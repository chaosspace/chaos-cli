import { useState, useEffect, SetStateAction, Dispatch } from "react";

interface Toast {
	type: "info" | "warning" | "error";
	msg: string;
	id: string;
}

type Action =
	| {
			type: "toast";
			payload: Toast;
	  }
	| {
			type: "dismiss";
			toastId: Toast["id"];
	  };

const TOAST_LIMIT = 1;
const DURATION = 2000;
let count = 0;

function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}

let memorizedToasts: Toast[] = [];

const listeners: Dispatch<SetStateAction<{ toasts: Toast[] }>>[] = [];

const timerMap = new Map<string, ReturnType<typeof setTimeout>>();

const addToTimeoutQueue = (toastId: string) => {
	if (timerMap.has(toastId)) {
		return;
	}

	const timerId = setTimeout(() => {
		dismiss(toastId);
	}, DURATION);

	timerMap.set(toastId, timerId);
};

const reducer = (state: Toast[], action: Action) => {
	const { type } = action;

	switch (type) {
		case "toast": {
			const { payload } = action;
			state = [
				...state,
				{ type: payload.type, msg: payload.msg, id: payload.id }
			].slice(0, TOAST_LIMIT);
			return state;
		}

		case "dismiss":
			state = state.filter((toast) => toast.id !== action.toastId);
			return state;

		default:
			return state;
	}
};

const dispatch = (action: Action) => {
	memorizedToasts = reducer(memorizedToasts, action);
	listeners.forEach((listener) => {
		listener({ toasts: memorizedToasts });
	});
};

export const toast = (payload: Omit<Toast, "id">) => {
	const id = genId();
	dispatch({ type: "toast", payload: { ...payload, id } });
	addToTimeoutQueue(id);

	return { dismiss: () => dismiss(id), id };
};

const dismiss = (toastId: string) => {
	dispatch({ type: "dismiss", toastId });
};

export const useToast = () => {
	const [state, setState] = useState<{ toasts: Toast[] }>({
		toasts: memorizedToasts
	});

	useEffect(() => {
		listeners.push(setState);

		return () => {
			const index = listeners.indexOf(setState);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		};
	}, [state]);

	return { ...state, toast };
};
