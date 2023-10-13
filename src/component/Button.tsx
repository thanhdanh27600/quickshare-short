import clsx, {ClassValue} from "clsx";
import {ButtonHTMLAttributes, DetailedHTMLProps} from "react";

type ButtonVariants = "filled" | "outlined";

export interface ButtonProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	text?: string | React.ReactNode;
	TextClassname?: ClassValue;
	variant?: ButtonVariants;
	loading?: boolean;
	animation?: boolean;
	hoverTransform?: boolean;
}

export const Button = (props: ButtonProps) => {
	const {
		text,
		variant = "filled",
		loading,
		animation,
		hoverTransform = true,
		TextClassname,
		...otherProps
	} = props;
	return (
		<button
			{...otherProps}
			className={clsx(
				"rounded-lg bg-gradient-to-l px-4 py-3 text-center font-medium transition-all focus:ring-2 disabled:cursor-not-allowed disabled:bg-cyan-300 disabled:text-gray-300",
				{
					"py-2.5 text-white focus:outline-none focus:ring-cyan-400":
						variant === "filled",
					"hover:gradient-bg from-purple-600 to-cyan-600/80 ": animation,
					"from-blue-600  to-cyan-500": !animation,
					"hover:-translate-y-0.5 hover:opacity-80 hover:shadow-btn-hover":
						hoverTransform,
					"relative inline-flex items-center justify-center overflow-hidden border border-cyan-300 bg-none p-1 text-gray-900  hover:text-cyan-500 focus:outline-none focus:ring-cyan-400":
						variant === "outlined",
				},
				props.className
			)}
			disabled={props.loading || props.disabled}
		>
			<span
				className={clsx(
					"flex min-w-max items-center justify-center",
					TextClassname
				)}
			>
				<span className={clsx(loading && "max-sm:hidden")}>
					{text || props.children}
				</span>
			</span>
		</button>
	);
};
