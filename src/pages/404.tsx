import {BASE_URL, Window} from "@/utils/constant";
import {redirect} from "next/navigation";
import {useEffect} from "react";

const PageNotFound = () => {
	useEffect(() => {
		try {
			Window().location.replace(`${BASE_URL}/404`);
		} catch (error) {}
	}, []);
	return null;
};

export default PageNotFound;
