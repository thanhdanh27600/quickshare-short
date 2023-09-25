import {EVENTS_STATUS, MIXPANEL_EVENT} from "@/utils/analytics";
import {sendForwardRequest} from "@/utils/requests";
import base64url from "base64url";
import mixpanel from "mixpanel-browser";
import {GetServerSidePropsContext} from "next";
import Head from "next/head";
import {stringify} from "querystring";
import {useEffect} from "react";
import requestIp from "request-ip";
import {BASE_URL, BASE_URL_OG, Window, isLocal} from "../utils/constant";
import {UrlShortenerHistory} from "../types/shorten";

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
}) => {
	const hash = history?.hash;
	const url = history?.url;
	const theme = history?.theme;
	const ogTitle = history?.ogTitle || ogTitleDefault(hash);
	const ogDescription = history?.ogDescription || ogDescriptionDefault;
	const ogImgSrc = history?.ogImgSrc;
	const encodeTitle = base64url.encode(ogTitle);

	const isError = !history || !history?.hash || !!error;

	useEffect(() => {
		if (!Window()) {
			return;
		}
		// start client-side forward
		try {
			if (!isError) {
				sendForwardRequest({
					hash: history.hash,
					userAgent,
					ip,
					fromClientSide: true,
				});
				mixpanel.track(MIXPANEL_EVENT.FORWARD, {
					status: EVENTS_STATUS.OK,
					urlRaw: url,
					hash,
				});
				setTimeout(
					() => {
						location.replace(`${url.includes("http") ? "" : "//"}${url}`);
					},
					!isLocal ? 0 : 2000
				);
			} else throw error;
		} catch (error) {
			mixpanel.track(MIXPANEL_EVENT.FORWARD, {
				status: EVENTS_STATUS.FAILED,
				history,
				error,
			});
			location.replace(`${BASE_URL}/404`);
		}
	}, []);

	if (isError) return null;

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
	try {
		const {hash} = context.query;
		const ip = requestIp.getClientIp(context.req) || "";
		const userAgent = context.req.headers["user-agent"] || "Unknown";
		// start server-side forward
		const forwardUrl = await sendForwardRequest({
			hash: hash ? (hash[0] as string) : "",
			userAgent,
			ip,
			fromClientSide: false,
		});

		if (!forwardUrl?.history)
			throw new Error("Cannot found history to forward");

		return {
			props: {
				history: forwardUrl.history,
				userAgent,
				ip,
			},
		};
	} catch (error: any) {
		return {
			props: {
				error: error.message || "somethingWrong",
			},
		};
	}
}

export default Forward;
