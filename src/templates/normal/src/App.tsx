import router from "./routes";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./hooks";

function App() {
	return (
		<>
			<Toaster />
			<RouterProvider router={router} />
		</>
	);
}

export default App;
