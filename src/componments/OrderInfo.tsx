import React, {useEffect, useState} from "react";
import {List, Typography, Divider, Space, Pagination, Button, Modal, Tooltip, Comment, Avatar, message} from 'antd';
import './less/OrderInfo.less';
import {
    PayOrder,
    QueryCommentList,
    QueryOrderDetail,
    QueryOrderListApi,
    QueryProductListApi,
    UserInfoApi
} from "../request/api";
import FormDate from "../utils/DateUtils";
import OrderProductInfoModal from "./OrderProductInfoModal";
import moment from "moment";
import erweima from "../assets/images/erweima.png";

interface IQueryOrderParam {
    id?: string;
    userId?: string;
    status?: string;
    pageIndex: number;
    pageSize: number;
}

interface IQueryCommentParam {
    orderId?: string;
    productId?: string;
    userId?: string;
    pageIndex: number;
    pageSize: number;
}

interface ICommentList {
    id: string;
    userId: string;
    username: string;
    nickname: string;
    orderId: string;
    content: string;
    createTime: number | Date
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
    price: number;
}

interface IResData {
    count: number;
    data: [];
}

let userId: string = "";

let orderListParams: IQueryOrderParam = {pageIndex: 1, pageSize: 3}

let commentListParams: IQueryCommentParam = {pageIndex: 1, pageSize: 2}

let currentListData: IOrderList[] = [];

let currentResData: IResData = {count: 0, data: []};

let showCurrentOrder: boolean = true;

let showDeleteComment: boolean = false;

let showPay: boolean = false;

export default function OrderInfo() {

    const [loading, setLoading] = React.useState<boolean>(false);
    const [visible, setVisible] = React.useState<boolean>(false);
    const [currentOrderVisible, setCurrentOrderVisible] = React.useState<boolean>(false);
    const [currentOrderDetailVisible, setCurrentOrderDetailVisible] = React.useState<boolean>(false);
    const [payVisible, setPayVisible] = React.useState<boolean>(false);
    const [showCurrentOrder, setShowCurrentOrder] = React.useState<boolean>(false);
    const [showDeleteComment, setShowDeleteComment] = React.useState<boolean>(false);
    const [orderId, setOrderId] = React.useState<string>("");
    const [userId, setUserId] = React.useState<string>("");
    const [resData, setResData] = React.useState<IResData>({count: 0, data: []});
    const [listData, setListData] = React.useState<IOrderList[]>([]);
    const [modalListData, setModalListData] = React.useState<IProductInfo[]>([]);
    const [commentResData, setCommentResData] = React.useState<IResData>({count: 0, data: []});
    const [commentListData, setCommentListData] = React.useState<ICommentList[]>([]);

    useEffect(() => {
        UserInfoApi().then((res: any) => {
            if (res.type !== 2) {
                orderListParams.userId = res.id;
                setUserId(res.id);
            }
            if (res.type === 2) {
                setShowCurrentOrder(false);
                setShowDeleteComment(true);
            } else {
                setShowCurrentOrder(true);
                setShowDeleteComment(false);
            }
            QueryOrderListApi(orderListParams).then((res: any) => {
                setResData(res);
                setListData(res.data);
            });
        });
    }, [])

    const showModal = (id: string) => {
        QueryOrderDetail(id).then((res: any) => {
            setModalListData(res);
        })
        QueryCommentList("?orderId=" + id + "&pageIndex=" + commentListParams.pageIndex + "&pageSize=" + commentListParams.pageSize)
            .then((res: any) => {
                setCommentResData(res);
                setCommentListData(res.data);
            })
        setVisible(true);
    };

    const showPayModal = () => {
        setPayVisible(true);
    }

    const payOrder = (id: string) => {
        PayOrder(id).then((res: any) => {
            message.success(res);
            setPayVisible(false);
            UserInfoApi().then((res: any) => {
                setUserId(res.id)
                if (res.type === 2) {
                    setShowCurrentOrder(false);
                    setShowDeleteComment(true);
                } else {
                    orderListParams.userId = res.id;
                    setShowCurrentOrder(true);
                    setShowDeleteComment(false);
                }
                QueryOrderListApi(orderListParams).then((res: any) => {
                    setResData(res);
                    setListData(res.data);
                });
            });
        }).catch((err: any) => {
            message.error(err);
        })
    }

    const handleCancel = () => {
        setVisible(false);
    };

    const handlePayCancel = () => {
        setPayVisible(false);
    }

    const IconText = ({icon, text}: any) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    return (
        <div className="order-box">
            <Space direction="vertical">
                <div className="title">
                    <Divider type="vertical" orientation="center">历史订单</Divider>
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
                                    {
                                        item.status === 1 ? (
                                            <div>
                                                订单支付时间：{FormDate(new Date(item.payTime))} <br/>
                                            </div>
                                        ) : ""
                                    }
                                    订单状态：{item.statusDesc} <br/>
                                </div>
                                <div className="order-product-info-modal-box">
                                    <Space direction="vertical">
                                        <Button type="primary" onClick={() => showModal(item.id)}>
                                            查看订单内容
                                        </Button>
                                        {
                                            item.status === 0 ? (
                                                <div>
                                                    <Button type="primary"
                                                            onClick={() => showPayModal()}>
                                                        立即支付
                                                    </Button>
                                                    <Modal visible={payVisible}
                                                           title="请打开微信或支付宝扫描二维码"
                                                           footer={null}
                                                           onCancel={handlePayCancel}
                                                    >
                                                        <img src={erweima} style={{height: "400px"}}/>
                                                        <Button type="primary"
                                                                onClick={() => payOrder(item.id)}>支付成功</Button>
                                                    </Modal>
                                                </div>
                                            ) : ""
                                        }
                                    </Space>
                                    <div className="modal">
                                        <Modal visible={visible}
                                               title="订单内容"
                                               footer={null}
                                               onCancel={handleCancel}>
                                            <List
                                                itemLayout="vertical"
                                                size="large"
                                                dataSource={modalListData}
                                                renderItem={product => (
                                                    <List.Item
                                                        key={product.productId}
                                                        extra={
                                                            <img
                                                                width={272}
                                                                alt="logo"
                                                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                                            />
                                                        }
                                                    >
                                                        <List.Item.Meta
                                                            title={product.productName}
                                                        />
                                                        数量：{product.count} <br/>
                                                        售价：{product.price} <br/>
                                                    </List.Item>
                                                )}
                                            />
                                            {
                                                commentListData.length !== 0 ? (
                                                    <List size="large"
                                                          bordered
                                                          dataSource={commentListData}
                                                          renderItem={comment => (
                                                              <List.Item>
                                                                  <Space direction="horizontal">
                                                                      <Comment
                                                                          author={<a>{comment.nickname}</a>}
                                                                          content={
                                                                              <p>
                                                                                  {comment.content}
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
                                                                                  <Button
                                                                                      type="primary">删除评论</Button> : ""
                                                                          }
                                                                      </Comment>
                                                                  </Space>
                                                              </List.Item>
                                                          )}
                                                    />
                                                ) : ""
                                            }
                                        </Modal>
                                    </div>
                                </div>
                            </List.Item>}
                        pagination={{
                            current: orderListParams.pageIndex,
                            total: resData.count,
                            pageSize: orderListParams.pageSize,
                            onChange: page => {
                                orderListParams.pageIndex = page;
                                QueryOrderListApi(orderListParams).then((res: any) => {
                                    setResData(res);
                                    setListData(res.data);
                                })
                            }
                        }}
                    />
                </div>
            </Space>
        </div>
    )
}