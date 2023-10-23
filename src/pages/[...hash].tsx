import {EVENTS_STATUS, MIXPANEL_EVENT} from "@/utils/analytics";
import {forward, sendForwardRequest} from "@/utils/requests";
import base64url from "base64url";
import mixpanel from "mixpanel-browser";
import {GetServerSidePropsContext} from "next";
import Head from "next/head";
import {stringify} from "querystring";
import {useEffect, useState} from "react";
import requestIp from "request-ip";
import {UrlShortenerHistory} from "../types/shorten";
import {BASE_URL, BASE_URL_OG, Window, isLocal} from "../utils/constant";
import {ValidatePassword} from "@/component/ValidatePassword";
import {redirect} from "next/navigation";
import isbot from "isbot";

const ogDescriptionDefault = "Quickshare rút gọn link và ghi chú miễn phí.";
const ogTitleDefault = (hash: string) =>
	`Chia sẻ link <${hash}> với mọi người. Khám phá ngay!`;

const Forward = ({
	history,
	ip,
	userAgent,
	error,
}: {
	userAgent: string;
	ip: string;
	history: UrlShortenerHistory;
	error?: any;
	token: string;
}) => {
	const hash = history?.hash;
	let url = history?.url;
	const theme = history?.theme;
	const ogTitle = history?.ogTitle || ogTitleDefault(hash);
	const ogDescription = history?.ogDescription || ogDescriptionDefault;
	const ogImgSrc = history?.ogImgSrc;
	const encodeTitle = base64url.encode(ogTitle);

	const [loading, setLoading] = useState(true);

	const isUnauthorized = error === "UNAUTHORIZED";
	const isError = !history || !history?.hash || !!error;

	const startForward = async () => {
		const token = localStorage.getItem("quickshare-token");
		try {
			if (isUnauthorized && !token) {
				setLoading(false);
				return;
			}
			if (isError && !isUnauthorized) throw error;
			mixpanel.track(MIXPANEL_EVENT.FORWARD, {
				status: EVENTS_STATUS.OK,
				urlRaw: url,
				hash,
			});
			if (isUnauthorized) {
				const {history: _history} = await sendForwardRequest({
					hash: history.hash,
					userAgent,
					ip,
					fromClientSide: true,
				});
				url = _history.url;
				localStorage.setItem("quickshare-token", "");
			}
		} catch (error) {
			mixpanel.track(MIXPANEL_EVENT.FORWARD, {
				status: EVENTS_STATUS.FAILED,
				history,
				error,
			});
		}
		if (url) {
			return forward(url, token);
		}
		setLoading(false);
		if (isUnauthorized) return;
		location.replace(`${BASE_URL}/404`);
	};

	useEffect(() => {
		if (!Window()) {
			return;
		}
		// start client-side forward
		startForward();
	}, []);

	if (isUnauthorized && !loading) {
		return <ValidatePassword open={true} hash={hash} />;
	}
	if (isError) return isLocal ? error : null;

	return (
		<>
			<Head>
				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content={url} />
				<meta property="og:title" content={ogTitle} />
				<meta property="og:description" content={ogDescription} />
				{/* Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content={url} />
				<meta property="twitter:title" content={ogTitle} />
				<meta property="twitter:description" content={ogDescription} />
				{!ogImgSrc && (
					<>
						<meta
							property="og:image"
							content={`${BASE_URL_OG}/api/og?${stringify({
								hash,
								theme,
								title: encodeTitle,
							})}`}
						/>
						<meta property="og:image:width" content="1200" />
						<meta property="og:image:height" content="627" />
						<meta property="og:image:alt" content={ogTitle} />
						<meta
							property="twitter:image"
							content={`${BASE_URL_OG}/api/og?${stringify({
								hash,
								theme,
								title: encodeTitle,
							})}`}
						/>
						<meta name="twitter:image:alt" content={ogTitle}></meta>
						<meta property="twitter:card" content="summary_large_image" />
					</>
				)}
				{ogImgSrc && <meta property="og:image" content={ogImgSrc} />}
			</Head>
			{isLocal && <div>{history?.url}</div>}
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const {hash} = context.query;
	const ip = requestIp.getClientIp(context.req) || "";
	const userAgent = context.req.headers["user-agent"] || "Unknown";
	try {
		// start server-side forward
		const forwardUrl = await sendForwardRequest({
			hash: hash ? (hash[0] as string) : "",
			userAgent,
			ip,
			fromClientSide: !isbot(userAgent),
		});

		if (forwardUrl?.errorCode === 401) throw new Error("UNAUTHORIZED");
		const history = forwardUrl?.history as UrlShortenerHistory | undefined;
		if (!history) throw new Error("Cannot found history to forward");
		if (!history.url) throw new Error("Cannot found url to forward");
		const shouldRedirectNow =
			new Date(history.createdAt).getTime() ===
			new Date(history.updatedAt).getTime();
		const destination = `${history.url.includes("http") ? "" : "http://"}${
			history.url
		}`;
		return shouldRedirectNow
			? {
					redirect: {
						permanent: true,
						destination,
					},
			  }
			: {
					props: {
						token: forwardUrl.token,
						history: forwardUrl.history,
						userAgent,
						ip,
					},
			  };
	} catch (error: any) {
		return {
			props: {
				history: {hash: hash ? (hash[0] as string) : ""},
				userAgent,
				ip,
				error: error.message || "somethingWrong",
			},
		};
	}
}

export default Forward;
