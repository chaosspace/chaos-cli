import { Home, NotFound, Test } from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
	{
		errorElement: <NotFound />,
		children: [
			{
				path: "/",
				element: <Home />
			},

			{ path: "/test", element: <Test /> }
		]
	}
];

const router = createBrowserRouter(routes);

export default router;
