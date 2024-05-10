import path, { dirname } from "path";
import { PackageManager } from "../utils/helper";
import { isWriteable } from "../utils/validation";
import { br, error, info, loggger, succ } from "../utils/logger";
import { mkdirSync } from "fs";
import { installTemplate } from "./installTemplate";
import { tryGitInit } from "../utils/git";
import { cwd } from "process";

interface InitProjectFun {
	({}: {
		projectPath: string;
		tailwind: boolean;
		packageManager: PackageManager;
	}): Promise<void>;
}

export const initProject: InitProjectFun = async ({
	projectPath,
	tailwind,
	packageManager,
}) => {
	const template = tailwind ? "tailwind" : "normal";
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

	// const packageJsonPath = path.join(root, "package.json");
	// let hasPackageJson = false;

	await installTemplate({
		appName,
		root,
		template,
		packageManager,
	});

	if (tryGitInit(root)) {
		info("Initialized a git repository.");
		br();
	}

	succ(`Project ${appName} set up successfully`);
	br();
	loggger("Inside that directory, you can run several commands:");
	info(`  ${packageManager} dev to start the development server.`);
	br();
	info(`  ${packageManager} build to build the App for production.`);
	br();

	process.chdir(`${process.cwd()}/${appName}`);
};
