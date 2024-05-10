import { Home, NotFound } from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
	{
		errorElement: <NotFound />,
		children: [
			{
				path: "/",
				element: <Home />
			}
		]
	}
];

const router = createBrowserRouter(routes);

export default router;
