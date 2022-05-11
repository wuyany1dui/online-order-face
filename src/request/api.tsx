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

// 获取当前用户历史订单接口
export const QueryOrderListApi = (params: any) => request.post("/order/queryList", params);

// 获取商店列表接口
export const QueryStoreListApi = (params: any) => request.post("/store/queryList", params);

// 获取用户是否对该餐品是否能评论接口
export const QueryCheckComment = (params: any) => request.get("/comment/check" + params);

// 新建订单接口
export const CreateOrder = (params: any) => request.post("/order/create", params);

// 查询订单详情接口
export const QueryOrderDetail = (params: any) => request.get("/order/queryDetail/" + params)

// 查询评论列表
export const QueryCommentList = (params: any) => request.get("/comment/queryList/" + params)

// 支付订单
export const PayOrder = (params: any) => request.post("/order/pay/" + params)

// 查询用户列表接口
export const QueryUserList = (params: any) => request.post("/user/queryList", params);

// 修改用户权限接口
export const ModifyUserLevel = (params: any) => request.post("/user/modifyLevel", params);

// 查询分类列表接口
export const QueryCategoryList = (params: any) => request.get("/category/queryList" + params);

// 新增分类接口
export const CreateCategory = (params: any) => request.post("/category/create", params);

// 删除分类接口
export const DeleteCategory = (params: any) => request.post("/category/delete", params);

// 修改商店接口
export const ModifyStore = (params: any) => request.post("/store/create", params)

// 删除评论接口
export const DeleteComment = (params: any) => request.post("/comment/delete", params)

// 新增餐品接口
export const CreateProduct = (params: any) => request.post("/product/create", params);