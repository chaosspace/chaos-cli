import prompts, { Options } from "prompts";
import { error, info, succ } from "../utils/logger.js";
import path from "path";
import { existsSync } from "fs";
import { isFolderEmpty, validateAppName } from "../utils/validation.js";
import { getPkgManager } from "../utils/helper.js";
import { initProject } from "./initProject.js";

interface Decisions {
	alias?: string;
	projectName: string | undefined;
	useTailwind: boolean;
	initGit: boolean;
}

const onCancel: Options["onCancel"] = (prompt) => {
	error(`Command cancelled when setting ${prompt.name as string}`);
	process.exit(1);
};

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
	const decisions: Decisions = {
		projectName,
		useTailwind: tailwind,
		initGit: true,
	};

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
		console.log(1);

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
			{ onCancel }
		);
		decisions.useTailwind = tailwind;
	}

	const { useAlias } = await prompts(
		{
			type: "toggle",
			name: "useAlias",
			message: "Would you like to use import alias?",
			initial: true,
			active: "yes",
			inactive: "no",
		},
		{ onCancel }
	);

	if (useAlias) {
		const { alias } = await prompts(
			{
				type: "text",
				name: "alias",
				message: "What import alias do you want:",
				initial: "@/",
			},
			{ onCancel }
		);
		decisions.alias = alias;
	}

	const { initGit } = await prompts(
		{
			type: "toggle",
			name: "initGit",
			message: "Would you like to init a git repo?",
			initial: true,
			active: "yes",
			inactive: "no",
		},
		{ onCancel }
	);

	decisions.initGit = initGit;

	const resolvedProjectPath = resolveProjectPath(decisions.projectName!);

	const packageManager = getPkgManager();

	try {
		await initProject({
			...decisions,
			packageManager,
			projectPath: resolvedProjectPath,
		});
	} catch (err) {
		console.log(err);

		error("crashed when downloading packages, please try again");
	}
}
