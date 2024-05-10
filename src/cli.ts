import cac from "cac";
import createProject from "./create";
import packageJson from "../package.json";

const cli = cac();

cli.version(packageJson.version);

cli
	.command("[projectName]", "create project from template")
	.option("-t, --tailwind", "use tailwindcss")
	.action(async (projectName: any, options: any) => {
		await createProject(projectName, options);
	});

cli.help();

cli.parse();
