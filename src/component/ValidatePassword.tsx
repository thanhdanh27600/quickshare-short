import {useRouter} from "next/router";
import {useCallback, useEffect, useRef, useState} from "react";
import {Input} from "./Input";
import {SubmitHandler, useForm} from "react-hook-form";
import {verifyPasswordRequest} from "@/utils/requests";
import {Modal} from "./Modal";
import {BASE_URL} from "@/utils/constant";
import mixpanel from "mixpanel-browser";
import {EVENTS_STATUS, MIXPANEL_EVENT} from "@/utils/analytics";

type ValidatePasswordForm = { password: string };

let timeout: any;

const startDisabledButton = () => {
	const button = document.getElementById(
		"disabled-confirm"
	) as HTMLButtonElement;
	if (!button) return;
	button.disabled = true;
	button.textContent = "Checking...";
	timeout = setTimeout(() => {
		button.disabled = false;
		button.textContent = "Confirm";
	}, 2000);
};

export const ValidatePassword = ({
	open,
	hash,
}: {
	hash: string;
	open?: boolean;
}) => {
	const {
		register,
		handleSubmit,
		formState: {errors},
		setError,
	} = useForm<ValidatePasswordForm>();
	const router = useRouter();
	const [maxTime, setMaxTime] = useState(0);

	useEffect(() => {
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, []);

	const onSubmit: SubmitHandler<ValidatePasswordForm> = async (data) => {
		if (maxTime > 5) {
			setError("password", {
				message: "Too many attempts. Please refresh page and try again.",
			});
			const log1 = {
				status: EVENTS_STATUS.FAILED,
				error: "Too many attempts. Please refresh page and try again.",
			};
			mixpanel.track(MIXPANEL_EVENT.FORWARD, log1);
			return;
		}

		try {
			const rs = await verifyPasswordRequest({h: hash, p: data.password});
			if (rs.token) {
				localStorage.setItem("quickshare-token", rs.token);
				window.location.reload();
			}
		} catch (error) {
			startDisabledButton();
			setError("password", {
				message: "Invalid password, please try again",
			});
			const log2 = {
				status: EVENTS_STATUS.FAILED,
				error: "Invalid password, please try again",
			};
			mixpanel.track(MIXPANEL_EVENT.FORWARD, log2);
		}
		setMaxTime((_m) => _m + 1);
	};

	return (
		<div>
			<Modal
				open={open}
				id="validatePassword"
				title={"Unlock"}
				ConfirmButtonProps={{
					onClick: handleSubmit(onSubmit),
					id: "disabled-confirm",
				}}
				modalOptions={{
					backdrop: "static",
					keyboard: false,
				}}
				DismissButtonProps={{
					onClick: () => {
						router.push(BASE_URL);
					},
				}}
				blockDismiss
			>
				<div className="pt-2">
					<label className="text-gray-700">{"Password *"}</label>
					<Input
						className="mt-2 h-12"
						{...register("password", {
							required: {
								message: "Invalid password, please try again",
								value: true,
							},
						})}
					/>
					<p className="mt-2 text-red-400">{errors.password?.message}</p>
				</div>
			</Modal>
		</div>
	);
};
