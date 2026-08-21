import axiosInstance from "./axiosInstance";
import api from "@/services";

// دمج الدوال الخدمية من services مع axiosInstance لضمان التوافقية الكاملة
Object.assign(axiosInstance, api);

export default axiosInstance;
