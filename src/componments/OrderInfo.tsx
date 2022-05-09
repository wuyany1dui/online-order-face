import React, {useState} from "react";
import {List, Typography, Divider, Space, Pagination, Button, Modal, Tooltip, Comment, Avatar} from 'antd';
import './less/OrderInfo.less';
import {QueryOrderListApi, UserInfoApi} from "../request/api";
import FormDate from "../utils/DateUtils";
import OrderProductInfoModal from "./OrderProductInfoModal";
import moment from "moment";

interface IQueryOrderParam {
    id?: string;
    userId?: string;
    status?: string;
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

let currentListData: IOrderList[] = [];

let resData: IResData = {count: 0, data: []};

let showCurrentOrder: boolean = true;

let showDeleteComment: boolean = false;

const data = [
    {
        actions: [<span key="comment-list-reply-to-0">Reply to</span>],
        author: 'Han Solo',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: (
            <p>
                We supply a series of design principles, practical patterns and high quality design
                resources (Sketch and Axure), to help people create their product prototypes beautifully and
                efficiently.
            </p>
        ),
        datetime: (
            <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment().subtract(1, 'days').fromNow()}</span>
            </Tooltip>
        ),
    },
    {
        actions: [<span key="comment-list-reply-to-0">Reply to</span>],
        author: 'Han Solo',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: (
            <p>
                We supply a series of design principles, practical patterns and high quality design
                resources (Sketch and Axure), to help people create their product prototypes beautifully and
                efficiently.
            </p>
        ),
        datetime: (
            <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
                <span>{moment().subtract(2, 'days').fromNow()}</span>
            </Tooltip>
        ),
    },
];


class OrderInfo extends React.Component {

    state = {
        loading: false,
        visible: false,
        currentOrderVisible: false,
        currentOrderDetailVisible: false,
        orderId: "",
    };

    componentWillMount() {
        UserInfoApi().then((res: any) => {
            userId = res.id;
            if (res.type === 2) {
                showCurrentOrder = false;
                showDeleteComment = true;
                this.setState(showDeleteComment);
                this.setState(showCurrentOrder);
            } else {
                showCurrentOrder = true;
                showDeleteComment = false;
                this.setState(showDeleteComment);
                this.setState(showCurrentOrder);
            }
        });
        orderListParams.userId = userId;
        QueryOrderListApi(orderListParams).then((res: any) => {
            resData = res;
            listData = res.data;
            this.setState(resData);
            this.setState(listData);
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    showCurrentOrderModal = () => {
        this.setState({
            currentOrderVisible: true,
        });
        orderListParams.status = "0";
        UserInfoApi().then((res: any) => {
            userId = res.id;
        });
        orderListParams.userId = userId;
        QueryOrderListApi(orderListParams).then((res: any) => {
            currentListData = res.data;
            this.setState(currentListData);
        });
    }

    showCurrentOrderDetailModal = () => {
        this.setState({
            currentOrderDetailVisible: true,
        });
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    handleCurrentOrderCancel = () => {
        this.setState({currentOrderVisible: false});
    };

    handleCurrentOrderDetailCancel = () => {
        this.setState({currentOrderDetailVisible: false});
    };

    render() {

        // @ts-ignore
        const IconText = ({icon, text}) => (
            <Space>
                {React.createElement(icon)}
                {text}
            </Space>
        );

        const {visible, loading, currentOrderVisible, currentOrderDetailVisible} = this.state;

        let modalListData = [1];

        return (
            <div className="order-box">
                <Space direction="vertical">
                    <div className="title">
                        <Divider type="vertical" orientation="center">历史订单</Divider>
                        {
                            showCurrentOrder ?
                                (
                                    <div style={{float: "right"}}>
                                        <Button type="primary" onClick={this.showCurrentOrderModal}>查看当前订单</Button>
                                        <div className="modal">
                                            <Modal visible={currentOrderVisible}
                                                   title="当前订单"
                                                   footer={null}
                                                   onCancel={this.handleCurrentOrderCancel}>
                                                <div className="list">
                                                    <List
                                                        size="large"
                                                        bordered
                                                        dataSource={currentListData}
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
                                                                <div className="order-product-info-modal-box">
                                                                    <Button type="primary" onClick={this.showCurrentOrderDetailModal}>
                                                                        查看订单内容
                                                                    </Button>
                                                                    <div className="modal">
                                                                        <Modal visible={currentOrderDetailVisible}
                                                                               title="订单内容"
                                                                               footer={null}
                                                                               onCancel={this.handleCurrentOrderDetailCancel}>
                                                                            <List
                                                                                itemLayout="vertical"
                                                                                size="large"
                                                                                dataSource={modalListData}
                                                                                renderItem={item => (
                                                                                    <List.Item
                                                                                        key={item}
                                                                                        extra={
                                                                                            <img
                                                                                                width={272}
                                                                                                alt="logo"
                                                                                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                                                                            />
                                                                                        }
                                                                                    >
                                                                                        <List.Item.Meta
                                                                                            title="汉堡"
                                                                                            description="test"
                                                                                        />
                                                                                        数量：2 <br/>
                                                                                        售价：13.99 <br/>
                                                                                    </List.Item>
                                                                                )}
                                                                            />
                                                                        </Modal>
                                                                    </div>
                                                                </div>
                                                            </List.Item>}
                                                        pagination={{
                                                            total: resData.count,
                                                            pageSize: 5,
                                                        }}
                                                    />
                                                </div>
                                            </Modal>
                                        </div>
                                    </div>
                                ) : ""
                        }
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
                                    <div className="order-product-info-modal-box">
                                        <Button type="primary" onClick={this.showModal}>
                                            查看订单内容
                                        </Button>
                                        <div className="modal">
                                            <Modal visible={visible}
                                                   title="订单内容"
                                                   footer={null}
                                                   onCancel={this.handleCancel}>
                                                <List
                                                    itemLayout="vertical"
                                                    size="large"
                                                    dataSource={modalListData}
                                                    renderItem={item => (
                                                        <List.Item
                                                            key={item}
                                                            extra={
                                                                <img
                                                                    width={272}
                                                                    alt="logo"
                                                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                                                />
                                                            }
                                                        >
                                                            <List.Item.Meta
                                                                title="汉堡"
                                                                description="test"
                                                            />
                                                            数量：2 <br/>
                                                            售价：13.99 <br/>
                                                            {/*{*/}
                                                            {/*    userType === 1 ? (<Button type="primary">修改商品信息</Button>) : ""*/}
                                                            {/*}*/}
                                                        </List.Item>
                                                    )}
                                                />
                                                {
                                                    item.status == 1 ? (
                                                        <Space direction="horizontal">
                                                            <Comment
                                                                author={<a>DrEAmSs59</a>}
                                                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random"
                                                                                alt="Han Solo"/>}
                                                                content={
                                                                    <p>
                                                                        东西很好吃，孩子很喜欢
                                                                    </p>
                                                                }
                                                                datetime={
                                                                    <Tooltip
                                                                        title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                                                                        <span>{moment().fromNow()}</span>
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                {
                                                                    showDeleteComment ?
                                                                        <Button type="primary">删除评论</Button> : ""
                                                                }
                                                            </Comment>
                                                        </Space>) : ""
                                                }
                                            </Modal>
                                        </div>
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