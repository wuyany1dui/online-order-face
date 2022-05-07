// 定义默认状态值（即默认数据）
const defaultState = {
    menuKey: 0,
    currentOrder: {
        id: "",
        userId: "",
        username: "",
        nickname: "",
        storeId: "",
        storeName: "",
        merchantId: "",
        merchantName: "",
        productInfos: [],
        price: 0,
    },
    productId: ""
}

// 导出一个函数，用于返回state
export default (state
                    = defaultState, action: any) => {
    let newState = state;
    switch (action.type) {
        case "menuClick":
            newState.menuKey = action.value;
            newState.productId = "";
            break;
        case "addOrder":
            newState.currentOrder = action.value;
            break;
        case "toProductInfo":
            newState.productId = action.value;
            break;
    }
    return newState;
}