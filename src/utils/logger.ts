import pc from "picocolors";

export const info = (text: string) => {
	console.log(pc.blue(text));
};

export const error = (text: string) => {
	console.log(pc.red(text));
};

export const succ = (text: string) => {
	console.log(pc.green(text));
};

export const br = () => {
	console.log();
};

export const loggger = (text: string) => {
	console.log(text);
};
