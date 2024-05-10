import { useToast } from "./useToast";

export const Toaster = () => {
	const { toasts } = useToast();

	return (
		<>
			<div
				style={{
					position: "absolute",
					left: "50%",
					top: "10%",
					transform: "translateX(-50%)"
				}}
			>
				{toasts.map((toast) => {
					const bgColor =
						toast.type === "info"
							? "#0ae"
							: toast.type === "warning"
								? "#ea0"
								: "#e55";
					return (
						<div
							key={toast.id}
							style={{
								padding: "10px",
								marginBottom: "15px",
								borderRadius: "10px",
								backgroundColor: bgColor
							}}
						>
							{toast.msg}
						</div>
					);
				})}
			</div>
		</>
	);
};
