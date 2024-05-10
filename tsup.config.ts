import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/cli.ts",
	},
	format: ["esm"],
	target: "esnext",
	sourcemap: true,
	outDir: "dist",
});
