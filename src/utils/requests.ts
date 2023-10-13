import {BASE_URL, isLocal} from "./constant";

export function withAuth(token?: string) {
	const tokenLocal = global.window
		? global.window.localStorage.getItem("quickshare-token") || ""
		: "";
	return {
		"X-Platform-Auth": token || tokenLocal,
	};
}

export const forward = (url: string) =>
	setTimeout(
		() => {
			location.replace(`${url.includes("http") ? "" : "//"}${url}`);
		},
		!isLocal ? 0 : 2000
	);

export async function sendForwardRequest(payload: any) {
	const url = `${BASE_URL}/api/forward`;

	const requestOptions: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...withAuth(),
		},
		body: JSON.stringify(payload),
	};

	try {
		const response = await fetch(url, requestOptions);

		if (!response.ok) {
			throw new Error(`Request failed with status: ${response.status}`);
		}
		const responseData = await response.json();
		return responseData;
	} catch (error) {
		throw error;
	}
}

export async function verifyPasswordRequest(payload: any) {
	const url = `${BASE_URL}/api/password/verify`;

	const requestOptions: RequestInit = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	};

	try {
		const response = await fetch(url, requestOptions);

		if (!response.ok) {
			throw new Error(`Request failed with status: ${response.status}`);
		}
		const responseData = await response.json();
		return responseData;
	} catch (error) {
		throw error;
	}
}
