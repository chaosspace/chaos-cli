import { red, underline, green, blue } from "picocolors";

export const info = (text: string) => {
	console.log(blue(text));
};

export const error = (text: string) => {
	console.log(red(text));
};

export const succ = (text: string) => {
	console.log(green(text));
};

export const br = () => {
	console.log();
};

export const loggger = (text: string) => {
	console.log(text);
};
