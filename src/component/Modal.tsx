import {TE} from "@/utils/constant";
import {useEffect, useRef} from "react";
import {Button, ButtonProps} from "./Button";

interface Props {
	id: string;
	title: string;
	children: any;
	cancelText?: string;
	confirmText?: string;
	open?: boolean;
	modalOptions?: Object;
	ModalProps?: Object;
	blockDismiss?: boolean;
	hideDismissButton?: boolean;
	ConfirmButtonProps?: ButtonProps;
	onDismiss?: (e: any) => void;
	DismissButtonProps?: ButtonProps;
}
export const Modal = (props: Props) => {
	const ref = useRef(null);
	const TEInstance = TE();

	useEffect(() => {
		if (props.open === undefined) {
			return;
		}
		try {
			ref.current = TEInstance.Modal.getOrCreateInstance(
				document.getElementById(props.id),
				props.modalOptions
			);
			if (props.open === true) {
				(ref.current as any)?.show();
			}
			if (props.open === false) {
				(ref.current as any)?.hide();
			}
		} catch (error) {}
	}, [props.open, TEInstance]);

	return (
		<div
			data-te-modal-init
			className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
			id={props.id}
			tabIndex={-1}
			aria-labelledby={`${props.id}Label`}
			aria-hidden="true"
			{...(props.blockDismiss
				? {
						["data-te-backdrop"]: "static",
						["data-te-keyboard"]: "false",
				  }
				: {})}
			{...props.ModalProps}
		>
			<div
				data-te-modal-dialog-ref
				className="pointer-events-none relative flex min-h-full w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-full min-[576px]:max-w-[500px]"
			>
				<div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative mx-auto flex w-[95%] flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none">
					<div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4">
						<h5
							className="text-xl font-medium leading-normal text-neutral-800"
							id={`${props.id}Label`}
						>
							{props.title}
						</h5>
						{!props.blockDismiss && (
							<button
								type="button"
								className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
								data-te-modal-dismiss
								aria-label="Close"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									className="h-6 w-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}
					</div>
					<div
						className="relative max-h-[50vh] flex-auto overflow-auto p-4"
						data-te-modal-body-ref
					>
						{props.children}
					</div>
					<div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-4 rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4">
						{!props.hideDismissButton && (
							<Button
								type="button"
								data-te-modal-dismiss
								variant="outlined"
								text={props.cancelText || "Cancel"}
								{...props.DismissButtonProps}
							/>
						)}
						<Button
							type="button"
							text={props.confirmText || "Confirm"}
							{...props.ConfirmButtonProps}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
