import {MIX_PANEL_TOKEN, isProduction} from "@/common/constant";
import "@/styles/globals.css";
import mixpanel from "mixpanel-browser";
import type {AppProps} from "next/app";

export default function App({Component, pageProps}: AppProps) {
	if (!MIX_PANEL_TOKEN) {
		console.error("Mix panel Not found");
	} else {
		mixpanel.init(MIX_PANEL_TOKEN, {
			debug: !isProduction,
			ignore_dnt: isProduction,
		});
	}

	return <Component {...pageProps} />;
}
