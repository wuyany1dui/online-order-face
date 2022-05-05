import React from "react";
import {List, Typography, Divider, Space, Pagination, Button} from 'antd';
import './less/OrderInfo.less';
import {QueryOrderListApi, UserInfoApi} from "../request/api";
import FormDate from "../utils/DateUtils";
import OrderProductInfoModal from "./OrderProductInfoModal";

interface IQueryOrderParam {
    id?: string;
    userId?: string;
    pageIndex: number;
    pageSize: number;
}

interface IOrderList {
    id: string;
    userId: string;
    username: string;
    nickname: string;
    storeId: string;
    storeName: string;
    merchantId: string;
    merchantName: string;
    price: number;
    createTime: string;
    payTime: string;
    status: number;
    statusDesc: string;
    productInfos: IProductInfo[];
}

interface IProductInfo {
    productId: string;
    productName: string;
    firstImage: string;
    count: number;
}

interface IResData {
    count: number;
    data: [];
}

let userId: string = "";

let orderListParams: IQueryOrderParam = {pageIndex: 1, pageSize: 3}

let listData: IOrderList[] = [];

let resData: IResData = {count: 0, data: []};

class OrderInfo extends React.Component {

    componentWillMount() {
        UserInfoApi().then((res: any) => {
            userId = res.id;
        });
        orderListParams.userId = userId;
        QueryOrderListApi(orderListParams).then((res: any) => {
            resData = res;
            listData = res.data;
            this.setState(resData);
            this.setState(listData);
        });
    }

    render() {
        return (
            <div className="order-box">
                <Space direction="vertical">
                    <div className="title">
                        <Divider type="vertical" orientation="center">历史订单</Divider>
                        <Button type="primary">查看当前订单</Button>
                    </div>
                    <div className="list">
                        <List
                            size="large"
                            bordered
                            dataSource={listData}
                            renderItem={item =>
                                <List.Item>
                                    <div>
                                        订单编号：{item.id} <br/>
                                        商家名称：{item.merchantName} <br/>
                                        商店名称：{item.storeName} <br/>
                                        订单价格：{item.price} <br/>
                                        订单创建时间：{FormDate(new Date(item.createTime))} <br/>
                                        订单支付时间：{FormDate(new Date(item.payTime))} <br/>
                                        订单状态：{item.statusDesc} <br/>
                                    </div>
                                    <div>
                                        <OrderProductInfoModal/>
                                    </div>
                                </List.Item>}
                            pagination={{
                                total: resData.count,
                                pageSize: 5,
                            }}
                        />
                    </div>
                </Space>
            </div>
        );
    }
}

export default OrderInfo;