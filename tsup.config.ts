import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/cli.ts",
	},
	format: ["esm"],
	// 目标语法
	target: "es2020",
	sourcemap: true,
	outDir: "dist",
});
