import axios from "axios";
import { ElMessage } from "element-plus";

// 创建 Axios 实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL, // 你的 API 基础地址
  timeout: 50000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在这里可以添加认证令牌或其他头部信息
    // 例如，如果用户登录，从本地存储中获取token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 根据需要显示 loading 状态
    if (config.showLoading) {
      ElMessage.loading({ message: "请求中...", duration: 0 });
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    ElMessage.closeAll();
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 根据需要隐藏 loading 状态
    if (response.config.showLoading) {
      ElMessage.closeAll();
    }
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      if (error.response.status === 401) {
        // 处理未授权的错误，例如重定向到登录页面
      }
      if (error.response.status === 404) {
        ElMessage.error("接口不存在");
        return Promise.reject(error);
      }
      
      // 处理其他错误
      return error.response.data;
    } 
    if (error.code === "ERR_NETWORK") {
      ElMessage.error(error.code);
      return Promise.reject(error);
    }
    
    ElMessage.closeAll();
    return Promise.reject(error);
  }
);

export default instance;
