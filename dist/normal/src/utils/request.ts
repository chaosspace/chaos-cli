import { toast } from "@/hooks";
import axios from "axios";

export const ins = axios.create({
	baseURL: import.meta.env.BASE_URL,
	timeout: 8000
});

/** 拦截器 */
ins.interceptors.request.use((config) => {
	return config;
});

ins.interceptors.response.use((res) => {
	if (`${res.status}`.startsWith("5")) {
		toast({ type: "error", msg: "请求出错了，待会再试试吧" });
	}
	return res;
});
