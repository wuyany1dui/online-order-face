import request from './request'

// 注册接口
export const RegisterApi = (params: any) => request.post('/user/register', params);

// 登录接口
export const LoginApi = (params: any) => request.post('/user/login', params);

// 获取当前用户信息接口
export const UserInfoApi = () => request.get('/user/userInfo');