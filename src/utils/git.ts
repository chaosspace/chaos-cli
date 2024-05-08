import { execSync } from "child_process";
import { rmSync } from "fs";
import path from "path";

const isInGitRepository = () => {
	try {
		execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
};

const isInMercurialRepository = () => {
	try {
		execSync("hg --cwd . root", { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
};

const isDefautBranchSet = () => {
	try {
		execSync("git config init.defaultBranch", { stdio: "ignore" });
		return true;
	} catch {
		return false;
	}
};

export const tryGitInit = (rootDir: string) => {
	let didInit = false;
	try {
		execSync("git --version", { stdio: "ignore" });

		if (isInGitRepository() || isInMercurialRepository()) {
			return false;
		}

		execSync("git init", { stdio: "ignore" });

		if (!isDefautBranchSet()) {
			execSync("git checkout -b main", { stdio: "ignore" });
		}

		execSync("git add -A", { stdio: "ignore" });
		execSync('git commit -m "Initial commit from chaos"', { stdio: "ignore" });
		return true;
	} catch {
		if (didInit) {
			try {
				rmSync(path.join(rootDir, ".git"), { recursive: true, force: true });
			} catch {}
		}
		return false;
	}
};
