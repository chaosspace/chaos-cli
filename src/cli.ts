import cac from "cac";
import createProject from "./create";

const cli = cac();

cli
	.command("chaos [projectName]", "create project from template")
	.option("-t, --tailwind", "use tailwindcss")
	.action(async (projectName, options) => {
		await createProject(projectName, options);
	});

cli.help();

cli.parse();
