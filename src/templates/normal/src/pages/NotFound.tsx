import { useNavigate } from "react-router";

export const NotFound = () => {
	const navigate = useNavigate();

	const back = () => {
		navigate(-1);
	};

	return <div onClick={() => back()}>404 NotFound</div>;
};
