// 定义默认状态值（即默认数据）
const defaultState = {
    menuKey: 0,
    currentOrders: [
        {
            id: "",
            userId: "",
            username: "",
            nickname: "",
            storeId: "",
            storeName: "",
            merchantId: "",
            merchantName: "",
            productInfos: [
                {
                    productId: "",
                    productName: "",
                    count: 0
                }
            ],
            price: 0,
        }
    ],
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
    productId: "",
    orderId: ""
}

// 导出一个函数，用于返回state
export default (state = defaultState, action: any) => {
    let newState = state;
    switch (action.type) {
        case "menuClick":
            newState.menuKey = action.value;
            newState.productId = "";
            break;
        case "addOrder":
            console.log("current:");
            console.log(newState.currentOrders);
            console.log("redux actionValue:");
            console.log(action.value);
            let newCurrentOrders:
                { id: string; userId: string; username: string; nickname: string; storeId: string; storeName: string;
                    merchantId: string; merchantName: string; productInfos: { productId: string; productName: string;
                        count: number; }[]; price: number; }[] = [];
            let newProductInfo = [];
            let tempOrderArr = newState.currentOrders.filter(item => item.storeId === action.value.storeId);
            if (tempOrderArr.length !== 0 && tempOrderArr.length !== null) {
                let tempOrder = tempOrderArr[0];
                if (tempOrder !== undefined && tempOrder !== null) {
                    let tempProduct: { productId: string; count: number; productName: string }[] = tempOrder.productInfos
                        .filter(item => item.productId === action.value.productInfos[0].productId);
                    if (tempProduct.length == 0) {
                        action.value.productInfos[0].count = Number(action.value.productInfos[0].count);
                        newProductInfo.push(action.value.productInfos[0]);
                    } else {
                        tempProduct[0].count = Number(tempProduct[0].count) + Number(action.value.productInfos[0].count);
                        newProductInfo.push(tempProduct);
                    }
                    tempOrder.productInfos = newProductInfo;
                }
                newCurrentOrders.push(tempOrder)
            } else {
                let filter: any[] = [];
                newState.currentOrders.map((item => {
                    filter = newCurrentOrders.filter(items => item.storeId !== items.storeId);
                }));
                filter.map(item => newCurrentOrders.push(item));
            }
            if (newState.currentOrders.length === 1 && newState.currentOrders[0].storeId === "") {
                action.value.productInfos[0].count = Number(action.value.productInfos[0].count);
                newCurrentOrders.push(action.value);
            }
            newState.currentOrders = newCurrentOrders;
            console.log("redux: ")
            console.log(newCurrentOrders);
            console.log(newState.currentOrders);
            break;
        case "toProductInfo":
            newState.productId = action.value;
            break;
        case "openOrderModal":
            newState.orderId = action.value;
            break;
    }
    return newState;
}