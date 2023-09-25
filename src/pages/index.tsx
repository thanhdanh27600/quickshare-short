import {BASE_URL, Window} from "@/utils/constant";
import {useEffect} from "react";

const Redirect = () => {
	useEffect(() => {
		try {
			Window().location.replace(BASE_URL);
		} catch (error) {}
	}, []);
	return null;
};

export default Redirect;
