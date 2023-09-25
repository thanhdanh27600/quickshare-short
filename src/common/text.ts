export function extractHashFromURL(url: string): string | null {
	// Define a regular expression to match the 3 characters after the host
	const regex = /^(https?:\/\/[^\/]+\/)([a-zA-Z0-9]{3}\/?)$/;

	// Use the RegExp exec method to search for the pattern in the URL
	const match = regex.exec(url);

	// If a match is found, return the extracted parameter (group 2)
	if (match && match[2]) {
		return match[2].replace("/", "");
	} else {
		// Return null if there is no match
		return null;
	}
}

// // Test cases
// const url1 = "http://localhost:5000/xxx";
// const url2 = "https://example.com/123";

// const param1 = extractHashFromURL(url1);
// const param2 = extractHashFromURL(url2);

// console.log(param1); // Output: "xxx"
// console.log(param2); // Output: "123"
