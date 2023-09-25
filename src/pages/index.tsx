import {BASE_URL, Window} from "@/common/constant";
import {redirect} from "next/navigation";
import {useEffect} from "react";


const Redirect = () => {
	useEffect(() => {
		try {
			Window().location.replace(BASE_URL);
		} catch (error) {}
	}, []);
};

export default Redirect;
