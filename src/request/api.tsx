import request from './request'

// 注册接口
export const RegisterApi = (params: any) => request.post('/user/register', params);

// 登录接口
export const LoginApi = (params: any) => request.post('/user/login', params);

// 获取当前用户信息接口
export const UserInfoApi = () => request.get('/user/userInfo');

// 修改用户信息接口
export const ModifyUserInfoApi = (params: any) => request.post('/user/modify', params);

// 修改用户密码接口
export const ModifyUserPasswordApi = (params: any) => request.post('/user/modifyPwd', params);

// 获取当前用户商店信息接口
export const QueryStoreApi = () => request.get('/store/query');

// 获取首页人气商店列表接口
export const QueryFirstPageStoreList = () => request.get('/store/queryFirstPageList');

// 获取餐品列表接口
export const QueryProductListApi = (params: any) => request.post("/product/queryList", params);