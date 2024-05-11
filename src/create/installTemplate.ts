import path from "path";
import { PackageManager, copy, install } from "../utils/helper.js";
import { br, info } from "../utils/logger.js";
import { writeFile } from "fs/promises";
import os from "node:os";
import pc from "picocolors";
import ora from "ora";

interface InstallTemplateArgs {
	appName: string;
	root: string;
	template: "tailwind" | "normal";
	packageManager: PackageManager;
	alias?: string;
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
	}

	// const tsconfigFile = path.join(root, "tsconfig.json");
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
			axios: "^1.6.8",
			react: "^18.2.0",
			"react-dom": "^18.2.0",
			"react-router": "^6.22.3",
			"react-router-dom": "^6.22.3",
		},
		devDependencies: {
			"@types/node": "^20.12.11",
			"@types/react": "^18.2.66",
			"@types/react-dom": "^18.2.22",
			"@typescript-eslint/eslint-plugin": "^7.2.0",
			"@typescript-eslint/parser": "^7.2.0",
			"@vitejs/plugin-react": "^4.2.1",
			eslint: "^8.57.0",
			"eslint-config-prettier": "^9.1.0",
			"eslint-plugin-prettier": "^5.1.3",
			"eslint-plugin-react-hooks": "^4.6.0",
			"eslint-plugin-react-refresh": "^0.4.6",
			husky: "^9.0.11",
			prettier: "3.2.5",
			typescript: "^5.2.2",
			vite: "^5.2.0",
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
