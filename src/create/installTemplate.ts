import path from "path";
import { PackageManager, copy, install } from "../utils/helper.js";
import { br, info } from "../utils/logger.js";
import os from "node:os";
import pc from "picocolors";
import ora from "ora";
import { Sema } from "async-sema";
import fg from "fast-glob";
import { stat, writeFile, readFile } from "fs/promises";

interface InstallTemplateArgs {
	appName: string;
	root: string;
	template: "tailwind" | "normal";
	packageManager: PackageManager;
	alias: string;
}

export const installTemplate = async ({
	appName,
	root,
	template,
	packageManager,
	alias,
}: InstallTemplateArgs) => {
	info(`Using ${packageManager}`);
	br();
	info(`Initializing project with template: ${template}\n`);

	const spinner = ora("Pulling template").start();
	const templatePath = path.join(__dirname, template);
	const copySource = ["**"];

	if (template === "normal") {
		copySource.push("!tailwind.config.js", "!postcss.config.js");
	}

	try {
		await copy(copySource, root, {
			cwd: templatePath,
			rename(name) {
				switch (name) {
					case "gitignore":
					case "eslintrc.cjs":
						return `.${name}`;
					case "README-template.md": {
						return "README.md";
					}
					default:
						return name;
				}
			},
		});
		spinner.succeed("Succeed to pull template to local");
	} catch {
		spinner.fail("Fail to pull template to local, please try again!");
		process.exit(1);
	}

	if (alias !== "@/*") {
		const tsConfigFile = path.join(root, "tsconfig.json");
		await writeFile(
			tsConfigFile,
			(await readFile(tsConfigFile, "utf8")).replace('"@/*"', `"${alias}"`)
		);

		const viteConfigFile = path.join(root, "vite.config.ts");
		const aliasWithNoSlash = alias.replace("/*", "");
		await writeFile(
			viteConfigFile,
			(
				await readFile(viteConfigFile, "utf8")
			).replace("@/", `${aliasWithNoSlash}`)
		);

		const files = await fg.async("**/*", {
			cwd: root,
			dot: true,
			stats: false,
			ignore: ["tsconfig.json", ".git/**/*"],
		});
		const writeSema = new Sema(8, { capacity: files.length });
		await Promise.all(
			files.map(async (file: string) => {
				await writeSema.acquire();
				const filePath = path.join(root, file);
				if ((await stat(filePath)).isFile()) {
					await writeFile(
						filePath,
						(
							await readFile(filePath, "utf8")
						).replace("@/", `${alias.replace(/\*/g, "")}`)
					);
				}
				writeSema.release();
			})
		);
	}

	const version = "1.0.0";
	const packageJson: any = {
		name: appName,
		version,
		private: true,
		type: "module",
		scripts: {
			dev: "vite",
			build: "tsc && vite build",
			lint: "eslint --fix . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
			preview: "vite preview",
			prepare: "husky",
		},
		dependencies: {
			axios: "^1.7.2",
			react: "^18.3.1",
			"react-dom": "^18.3.1",
			"react-router": "^6.23.1",
			"react-router-dom": "^6.23.1",
		},
		devDependencies: {
			"@types/node": "^20.12.13",
			"@types/react": "^18.3.3",
			"@types/react-dom": "^18.3.0",
			"@typescript-eslint/eslint-plugin": "^7.11.0",
			"@typescript-eslint/parser": "^7.11.0",
			"@vitejs/plugin-react": "^4.3.0",
			eslint: "^8.57.0",
			"eslint-config-prettier": "^9.1.0",
			"eslint-plugin-prettier": "^5.1.3",
			"eslint-plugin-react-hooks": "^4.6.2",
			"eslint-plugin-react-refresh": "^0.4.7",
			husky: "^9.0.11",
			prettier: "3.2.5",
			typescript: "^5.4.5",
			vite: "^5.2.12",
		},
	};

	if (template === "tailwind") {
		packageJson.devDependencies = {
			...packageJson.devDependencies,
			autoprefixer: "^10.4.19",
			postcss: "^8.4.38",
			"prettier-plugin-tailwindcss": "^0.5.14",
			tailwindcss: "^3.4.3",
		};
	}

	await writeFile(
		path.join(root, "package.json"),
		JSON.stringify(packageJson, null, 2) + os.EOL
	);

	info("\nInstalling dependencies:");
	for (const dependency in packageJson.dependencies) {
		console.log(`- ${pc.cyan(dependency)}`);
	}
	info("\nInstalling devDependencies:");
	for (const dependency in packageJson.devDependencies) {
		console.log(`- ${pc.cyan(dependency)}`);
	}

	br();

	await install(packageManager);
};
