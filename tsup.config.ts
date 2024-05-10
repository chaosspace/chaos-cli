import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/cli.ts",
	},
	format: ["esm"],
	shims: true,
	target: "esnext",
	publicDir: "src/templates",
	outDir: "dist",
});
