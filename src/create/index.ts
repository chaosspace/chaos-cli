import prompts, { Options } from "prompts";
import { error } from "../utils/logger.js";
import path from "path";
import { existsSync } from "fs";
import { isFolderEmpty, validateAppName } from "../utils/validation.js";
import { initProject } from "./initProject.js";

interface Decisions {
	alias: string;
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
		alias: "@/*",
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
	const resolvedProjectPath = resolveProjectPath(decisions.projectName!);

	if (!validateAppName(decisions.projectName!)) {
		process.exit(1);
	}

	const { packageManager } = await prompts({
		type: "select",
		name: "packageManager",
		message: "Which package manager would you like to use?",
		choices: [
			{ title: "NPM", value: "npm" },
			{ title: "YARN", value: "yarn" },
			{ title: "PNPM", value: "pnpm" },
		],
	});

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

	const importAliasPattern = /^[^*"]+\/\*\s*$/;
	if (useAlias) {
		const { alias } = await prompts(
			{
				type: "text",
				name: "alias",
				message: "What import alias do you want:",
				initial: "@/*",
				validate: (value) =>
					importAliasPattern.test(value)
						? true
						: "Import alias must follow the pattern <prefix>/*",
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
