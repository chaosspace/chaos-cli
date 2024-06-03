import { statSync, promises } from "fs";
import path from "path";
import fg from "fast-glob";
import { fileURLToPath } from "url";
import spawn from "cross-spawn";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

interface CopyOption {
	cwd?: string;
	rename?: (basename: string) => string;
	parents?: boolean;
}

const toPath = (urlOrPath: string | URL): string =>
	urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

const typeMappings = {
	directory: "isDirectory",
	file: "isFile",
};

const matchType = (type: keyof typeof typeMappings, stat: any) =>
	stat[typeMappings[type]]();

const locatePathSync = (
	paths: Iterable<string>,
	{ cwd, type = "file" }: any
): string | void => {
	cwd = toPath(cwd);

	for (const path_ of paths) {
		try {
			const stat = statSync(path.resolve(cwd, path_), {
				throwIfNoEntry: false,
			});

			if (!stat) {
				continue;
			}

			if (matchType(type, stat)) {
				return path_;
			}
		} catch {}
	}
};

export function findUp(name: string | string[]) {
	let directory = path.resolve(process.cwd()) ?? "";
	const { root } = path.parse(directory);
	const paths = [name].flat();
	const stopAt = path.resolve(root);

	const runMatcher = (options: { cwd: string }) => {
		return locatePathSync(paths, options);
	};

	const matches: string[] = [];

	while (true) {
		const foundPath = runMatcher({ cwd: directory });

		if (foundPath) {
			matches.push(path.resolve(directory, foundPath));
		}
		if (directory === stopAt) {
			break;
		}
		directory = path.dirname(directory);
	}

	return matches[0];
}

const identity = (x: string) => x;

export const copy = async (
	src: string | string[],
	dest: string,
	{ cwd, rename = identity }: CopyOption = {}
) => {
	const source = typeof src === "string" ? [src] : src;

	if (source.length === 0 || !dest) {
		throw new TypeError("`src` and `dest` are required");
	}

	const sourceFile = await fg.async(source, {
		cwd,
		dot: true,
		absolute: false,
		stats: false,
	});

	const destRelativeToCwd = cwd ? path.resolve(cwd, dest) : dest;

	return Promise.all(
		sourceFile.map(async (p) => {
			const dirname = path.dirname(p);
			const basename = rename(path.basename(p));

			const from = cwd ? path.resolve(cwd, p) : p;
			const to = path.join(destRelativeToCwd, dirname, basename);

			await promises.mkdir(path.dirname(to), { recursive: true });
			return promises.copyFile(from, to);
		})
	);
};

export const install = async (
	packageManager: PackageManager
): Promise<void> => {
	const args = [packageManager === "yarn" ? "" : "install"];
	return new Promise((resolve, reject) => {
		const child = spawn(packageManager, args, {
			stdio: "inherit",
			env: {
				...process.env,
				ADBLOCK: "1",
				NODE_ENV: "development",
				DISABLE_OPENCOLLECTIVE: "1",
			},
		});
		child.stdout?.on("data", (data) => {
			console.log(data);
		});
		child.on("close", (code) => {
			if (code !== 0) {
				reject({ command: `${packageManager} ${args.join(" ")}` });
				return;
			}
			resolve();
		});
	});
};
