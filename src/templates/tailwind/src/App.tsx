import router from "./routes";
import { RouterProvider } from "react-router-dom";

function App() {
	return (
		<>
			App
			<RouterProvider router={router} />
		</>
	);
}

export default App;
