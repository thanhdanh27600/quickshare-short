export const isLocal = process.env.NEXT_PUBLIC_BUILD_ENV === "local";
export const isUAT = process.env.NEXT_PUBLIC_BUILD_ENV === "uat";
export const isProduction = process.env.NEXT_PUBLIC_BUILD_ENV === "production";

export const localUrl = "http://localhost:5000";
export const brandUrl = "https://quickshare.at";
export const brandUrlShort = "https://qsh.at";
export const brandUrlUat = "https://uat.quickshare.at";
export const brandUrlShortUat = "https://uat.qsh.at";

export const baseUrl = (useShortDomain: boolean = false) => {
	if (isProduction) {
		return useShortDomain ? brandUrlShort : brandUrl;
	}
	if (isUAT) {
		return useShortDomain ? brandUrlShortUat : brandUrlUat;
	}
	return "http://localhost:5000";
};
export const BASE_URL = baseUrl();
export const BASE_URL_SHORT = baseUrl(true);
export const BASE_URL_OG = !isLocal
	? "https://og.quickshare.at"
	: "http://localhost:7071";

export const Window = () =>
	"object" === typeof window && window ? (window as any) : undefined;

export const MIX_PANEL_TOKEN = process.env.NEXT_PUBLIC_MIX_PANEL_TOKEN;
