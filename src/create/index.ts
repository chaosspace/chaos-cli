import prompts, { Options } from "prompts";
import { error, info, succ } from "../utils/logger.js";
import path from "path";
import { existsSync } from "fs";
import { isFolderEmpty, validateAppName } from "../utils/validation.js";
import { getPkgManager } from "../utils/helper.js";
import { initProject } from "./initProject.js";

const onCancel: Options["onCancel"] = (prompt) => {
	error(`Command cancelled when setting ${prompt.name as string}`);
	process.exit(1);
};

const onSubmit: Options["onSubmit"] = (prompt, answer, answers) => {};

const resolveProjectPath = (inputPath: string) => {
	const root = path.resolve(inputPath.trim());
	const projectName = path.basename(root);

	/**
	 * 验证dir是否存在或为非空dir
	 */
	const folderExists = existsSync(root);
	if (folderExists && !isFolderEmpty(root, projectName)) {
		process.exit(1);
	}

	return root;
};

export default async function createProject(
	projectName: string | undefined,
	{ tailwind }: { tailwind: boolean }
) {
	const decisions = { projectName, useTailwind: tailwind };

	if (!projectName) {
		const { project } = await prompts(
			{
				type: "text",
				name: "project",
				message: "Your project name:",
				initial: "ViteReactTemplate",
			},
			{ onCancel }
		);
		decisions.projectName = project;
	}

	if (!validateAppName(decisions.projectName!)) {
		process.exit(1);
	}
	
	if (!tailwind) {
		const { tailwind } = await prompts(
			{
				type: "toggle",
				name: "tailwind",
				message: "Would you like to use tailwindcss?",
				initial: true,
				active: "yes",
				inactive: "no",
			},
			{ onCancel, onSubmit }
		);
		decisions.useTailwind = tailwind;
	}

	succ("resolve config successfully!");
	const resolvedProjectPath = resolveProjectPath(decisions.projectName!);

	const packageManager = getPkgManager();

	try {
		await initProject({
			projectPath: resolvedProjectPath,
			packageManager,
			tailwind: decisions.useTailwind,
		});
	} catch (err) {
		console.log(err);

		error("crashed when downloading packages, please try again");
	}
}
