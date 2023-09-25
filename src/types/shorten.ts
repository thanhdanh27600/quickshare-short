export type UrlShortenerHistory = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	url: string;
	hash: string;
	theme: string;
	email: string | null;
	password: string | null;
	ogTitle: string | null;
	ogDomain: string | null;
	ogDescription: string | null;
	ogImgSrc: string | null;
	ogImgPublicId: string | null;
	isBanned: boolean;
	urlShortenerRecordId: number;
};
