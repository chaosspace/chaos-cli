import path, { dirname } from "path";
import { PackageManager } from "../utils/helper.js";
import { isWriteable } from "../utils/validation.js";
import { br, error, info, loggger, succ } from "../utils/logger.js";
import { mkdirSync } from "fs";
import { installTemplate } from "./installTemplate.js";
import { tryGitInit } from "../utils/git.js";

interface Params {
	projectPath: string;
	packageManager: PackageManager;
	useTailwind: boolean;
	initGit: boolean;
	alias: string;
}

export const initProject = async ({
	projectPath,
	useTailwind,
	packageManager,
	initGit,
	alias,
}: Params) => {
	const template = useTailwind ? "tailwind" : "normal";
	const root = path.resolve(projectPath);
	if (!(await isWriteable(dirname(root)))) {
		error(
			"The application path is not writable, please check folder permissions and try again."
		);
		error("It is likely you do not have write permissions for this folder.");
		process.exit(1);
	}

	const appName = path.basename(root);

	mkdirSync(root, { recursive: true });
	const originalDirectory = process.cwd();

	succ(`Creating a new vite app in ${root}.`);
	br();

	process.chdir(root);

	await installTemplate({
		appName,
		root,
		template,
		packageManager,
		alias
	});

	// if (initGit && tryGitInit(root)) {
	// 	info("Initialized a git repository.");
	// 	br();
	// }

	succ(`Project ${appName} set up successfully`);
	br();
	loggger("Inside that directory, you can run several commands:");
	info(`  ${packageManager} dev to start the development server.`);
	br();
	info(`  ${packageManager} build to build the App for production.`);
	br();
};
