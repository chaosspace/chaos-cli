import { lstatSync, readdirSync, promises, constants } from "fs";
import { br, error, info, loggger } from "./logger";
import path from "path";

const blacklist = ["node_modules", "favicon.ico"];

export const validateAppName = (projectName: string) => {
	if (!projectName || typeof projectName !== "string") {
		error("An App name must be provided and it should be a string");
		return false;
	}

	if (!projectName.length) {
		error("App name must be greate than zero");
		return false;
	}

	if (projectName.match(/^\./)) {
		error("App name cannot start with a period");
	}

	if (projectName.match(/^_/)) {
		error("App name cannot start with an underscore");
	}

	if (projectName.trim() !== projectName) {
		error("name cannot contain leading or trailing spaces");
	}

	blacklist.forEach(function (blacklistedName) {
		if (projectName.toLowerCase() === blacklistedName) {
			error(blacklistedName + " is a blacklisted name");
		}
	});

	if (/[~'!()*%&]/.test(projectName.split("/").slice(-1)[0])) {
		error('name can no longer contain special characters ("~\'!()*%&")');
	}
};

export const isFolderEmpty = (rootPath: string, projectName: string) => {
	const result = readdirSync(rootPath);

	if (result.length > 0) {
		info(`The directory ${projectName} contains file that could conflict:`);
		br();

		for (const file of result) {
			try {
				const stats = lstatSync(path.join(rootPath, file));
				if (stats.isDirectory()) {
					info(`  ${file}`);
				} else {
					loggger(`  ${file}`);
				}
			} catch {
				loggger(`  ${file}`);
			}
		}

		br();
		info(
			"Either try using a new directory name, or remove the files listed above."
		);
		br();

		return false;
	}

	return true;
};

export async function isWriteable(directory: string): Promise<boolean> {
	try {
		await promises.access(directory, constants.W_OK);
		return true;
	} catch (err) {
		return false;
	}
}
