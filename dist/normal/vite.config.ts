import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	/** 加载ENV */
	const env = loadEnv(mode, process.cwd());

	/** 开发环境 */
	if (mode === "development") {
		return {
			plugins: [react()],
			resolve: {
				alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
			},

			server: {
				open: true,
				proxy: {
					[env.VITE_API_BASE_URL]: {
						target: env.VITE_REQUEST,
						rewrite: (path: string) => path.replace(/^\/api/, "")
					}
				}
			}
		};
	}

	/** 其他环境 */
	const baseConfig = {
		plugins: [react()],
		resolve: {
			alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
		},

		server: {
			open: true
		}
	};

	return { ...baseConfig };
});
