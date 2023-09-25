import {BASE_URL} from "./constant";

export async function sendForwardRequest(payload: any) {
	const url = `${BASE_URL}/api/forward`;

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
