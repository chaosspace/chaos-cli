import { lstatSync, readdirSync, promises, constants } from "fs";
import { br, info, loggger } from "./logger";
import path from "path";

export const validateNpmName = (projectName: string) => {};

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
