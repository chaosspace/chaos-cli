import { Home } from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
	{
		path: "/",
		element: <Home />
	}
];

const router = createBrowserRouter(routes);

export default router;
