import {cdn} from "@/utils/constant";
import {Html, Head, Main, NextScript} from "next/document";
import Script from "next/script";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="noindex" />
				<link rel="stylesheet" href={cdn(`/lib/styles.min.css`)} />
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/tw-elements/dist/css/tw-elements.min.css"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
				<Script
					src={cdn(`/lib/styles.min.js`)}
					id="external-styles"
					strategy="beforeInteractive"
				/>
				<Script
					src={"https://cdn.tailwindcss.com/3.3.0"}
					id="external-tailwind"
					strategy="beforeInteractive"
				/>
			</body>
		</Html>
	);
}
