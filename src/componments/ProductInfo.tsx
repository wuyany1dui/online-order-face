import React, {createElement, useEffect, useState} from 'react';
import {
    Comment,
    Tooltip,
    Avatar,
    Radio,
    Carousel,
    Space,
    Image,
    Descriptions,
    Button,
    Input,
    List,
    Form,
    message, Modal, InputNumber
} from 'antd';
import moment from 'moment';
import "./less/ProductInfo.less";
import Logo from '../assets/images/logo.jpg';
import Laoba from '../assets/images/laoba.jpg';
import {PlusOutlined} from '@ant-design/icons';
import {
    CreateComment,
    CreateOrder,
    QueryCheckComment,
    QueryCommentList,
    QueryOrderListApi,
    QueryProductListApi,
    UserInfoApi
} from "../request/api";
import store from "../store";
import FormDate from "../utils/DateUtils";
import FormatDate from "../utils/DateUtils";
import DefaultAvatar from "../assets/images/defaultAvatar.png";

interface IQueryProduct {
    id?: string;
    storeId?: string;
    type?: string;
    name?: string;
    startPrice?: number;
    endPrice?: number;
    pageIndex?: number;
    pageSize?: number;
}

interface IQueryProductList {
    id: string;
    name: string;
    price: number;
    description?: string;
    sales: number;
    firstImage?: string;
    storeId: string;
    storeName: string;
    merchantId: string;
    merchantName: string;
}

interface IProductInfo {
    productId: string;
    productName: string;
    count: number;
}

interface IOrder {
    id: string,
    userId: string,
    username: string,
    nickname: string,
    storeId: string,
    storeName: string,
    merchantId: string,
    merchantName: string,
    productInfos: [],
    price: 0,
}

interface IQueryProductPage {
    count: number;
    data: IQueryProductList[];
}

let tempProduct: IQueryProductList = {
    merchantId: "",
    merchantName: "",
    storeId: "",
    storeName: "",
    description: "",
    firstImage: "",
    id: "",
    name: "",
    price: 0,
    sales: 0
};

let canComment: boolean = false;

const {TextArea} = Input;

interface IQueryOrderParam {
    id?: string;
    userId?: string;
    status?: string;
    pageIndex: number;
    pageSize: number;
}

interface IQueryCommentParam {
    productId?: string;
    pageIndex: number;
    pageSize: number;
}

interface IComment {
    id: string;
    userId: string;
    username: string;
    nickname: string;
    orderId: string;
    content: string;
    createTime: number | Date;
}

interface ICreateComment {
    productId: string;
    content: string;
}

function ProductInfo() {

    const [avatar, setAvatar] = React.useState<string>("");
    const [productId, setProductId] = React.useState<string>("");
    const [productDetail, setProductDetail] = React.useState({});
    const [queryProduct, setQueryProduct] = React.useState({count: 0, data: []});
    const [dotPosition, setDotPosition] = React.useState('top');
    const [visible, setVisible] = useState(false);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [action, setAction] = useState("");
    const [tempCanComment, setTempCanComment] = useState(false);
    const [count, setCount] = useState(1);
    const [queryCommentParams, setQueryCommentParams] =
        React.useState<IQueryCommentParam>({pageIndex: 1, pageSize: 2});
    const [listDataCount, setListDataCount] = React.useState<number>(0);
    const [listData, setListData] = React.useState<IComment[]>([]);
    // const [commentContent, setCommentContent] = React.useState<string>("");
    const [newComment, setNewComment] = React.useState<ICreateComment>({content: "", productId: ""});

    let commentContent: string = "";

    store.subscribe(() => {
        setProductId(store.getState().productId);
    })

    const addOrderOnClick = (productId: string, productName: string, count: number, storeId: string,
                             storeName: string, merchantId: string, merchantName: string) => {
        UserInfoApi().then((res: any) => {
            let productInfo = {productId: productId, productName: productName, count: count};
            let order = {
                id: "", userId: res.id, username: res.username, nickname: res.nickname,
                storeId: storeId, storeName: storeName, merchantId: merchantId, merchantName: merchantName,
                productInfos: [productInfo]
            };
            let queryOrderListParams: IQueryOrderParam = {pageIndex: 1, pageSize: 1, status: "0"};
            QueryOrderListApi(queryOrderListParams).then((res: any) => {
                if (res.data.length !== 0) {
                    order.id = res.data[0].id;
                    let oldProduct = res.data[0].productInfos
                        .find((item: { productId: string; productName: string; count: number }) => item.productId == productInfo.productId);
                    if (oldProduct !== undefined) {
                        order.productInfos[0].count = Number(oldProduct.count) + Number(order.productInfos[0].count);
                    }
                    let oldProducts = res.data[0].productInfos
                        .filter((item: { productId: string; productName: string; count: number }) => item.productId !== productInfo.productId);
                    if (oldProducts.length !== 0) {
                        oldProducts.map(((item: { productId: string; productName: string; count: number; }) => {
                            order.productInfos.push(item);
                        }))
                    }
                }
                CreateOrder(order).then((res: any) => {
                    message.success("添加成功！");
                });
            })
        })
    }

    const countOnChange = (value: number) => {
        setCount(value)
    }

    useEffect(() => {
        UserInfoApi().then((res: any) => {
            setAvatar("http://localhost:8597/online/order/file/download/" + res.avatar || DefaultAvatar);
        }).catch((err: any) => {
            setAvatar(DefaultAvatar);
        })
        let queryProductData: IQueryProduct = {pageIndex: 1, pageSize: 1, id: store.getState().productId};
        QueryProductListApi(queryProductData).then((res: any) => {
            tempProduct = res.data[0];
            if (tempProduct) {
                setProductDetail(tempProduct);
            }
        });
        QueryCheckComment("?productId=" + store.getState().productId).then((res: any) => {
            canComment = res;
            setTempCanComment(canComment);
        })
        QueryCommentList("?pageIndex=" + queryCommentParams.pageIndex +
            "&pageSize=" + queryCommentParams.pageSize + "&productId=" + store.getState().productId)
            .then((res: any) => {
                setListDataCount(res.count);
                setListData(res.data);
            })
    }, [productId])

    const handleCommentContentOnChange = (e: any) => {
        commentContent = e.target.value;
    }

    const createCommentOnClick = () => {
        setNewComment({productId: store.getState().productId, content: commentContent});
        let tempNewComment: ICreateComment = {productId: store.getState().productId, content: commentContent}
        CreateComment(tempNewComment).then((res: any) => {
            message.success("评论成功");
            QueryCommentList("?pageIndex=" + queryCommentParams.pageIndex +
                "&pageSize=" + queryCommentParams.pageSize + "&productId=" + store.getState().productId)
                .then((res: any) => {
                    setListDataCount(res.count);
                    setListData(res.data);
                })
        }).catch((err: any) => {
            message.error("评论失败：" + err.response.data);
            QueryCommentList("?pageIndex=" + queryCommentParams.pageIndex +
                "&pageSize=" + queryCommentParams.pageSize + "&productId=" + store.getState().productId)
                .then((res: any) => {
                    setListDataCount(res.count);
                    setListData(res.data);
                })
        })
    }

    function Editor(props: { submitting: any, onChange: any, onSubmit: any, value: any }) {
        return (
            <div>
                <Form.Item>
                    <TextArea rows={2} onChange={handleCommentContentOnChange}/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary" onClick={createCommentOnClick}>
                        添加评论
                    </Button>
                </Form.Item>
            </div>
        );
    }

    return (
        <div className="product-box">
            <Space direction="vertical">
                <Space>
                    <Image
                        width={200}
                        src={"http://localhost:8597/online/order/file/download/" + tempProduct.firstImage}
                        fallback="data:image/png;base64,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"
                    />
                    <div style={{marginLeft: "20px"}}>
                        <Space>
                            <Descriptions title="餐品信息" column={{xs: 10, sm: 10, md: 1}}>
                                <Descriptions.Item label="名称">{tempProduct.name}</Descriptions.Item>
                                <Descriptions.Item label="描述">{tempProduct.description}</Descriptions.Item>
                                <Descriptions.Item label="价格">{tempProduct.price}</Descriptions.Item>
                                <Descriptions.Item label="销量">{tempProduct.sales}</Descriptions.Item>
                            </Descriptions>
                            <Space direction="vertical">
                                <Button type="primary" icon={<PlusOutlined/>} size="large"
                                        onClick={(e) =>
                                            addOrderOnClick(tempProduct.id, tempProduct.name, count, tempProduct.storeId,
                                                tempProduct.storeName, tempProduct.merchantId, tempProduct.merchantName)}>
                                    加入订单
                                </Button>
                                <InputNumber placeholder="数量" min={1} defaultValue={count} max={9999} onChange={countOnChange} />
                            </Space>
                        </Space>
                    </div>
                </Space>
                {
                    canComment ? (
                        <Comment
                            avatar={<Avatar src={avatar} alt="Han Solo"/>}
                            content={
                                <Editor
                                    onChange={handleCommentContentOnChange}
                                    onSubmit=""
                                    submitting=""
                                    value=""
                                />
                            }
                        />
                    ) : ""
                }
                {
                    listDataCount !== 0 ? (
                        <List
                            size="large"
                            bordered
                            dataSource={listData}
                            renderItem={item =>
                                <List.Item>
                                    <Comment
                                        author={<a>{item.nickname}</a>}
                                        avatar={<Avatar src={avatar} alt="Han Solo"/>}
                                        content={
                                            <p>
                                                {item.content}
                                            </p>
                                        }
                                        datetime={
                                            <span>{FormatDate(new Date(item.createTime))}</span>
                                        }
                                    />
                                </List.Item>
                            }
                            pagination={{
                                total: listDataCount,
                                pageSize: queryCommentParams.pageSize,
                                current: queryCommentParams.pageIndex,
                                onChange: page => {
                                    setQueryCommentParams({pageIndex: page, pageSize: 2})
                                    QueryCommentList("?pageIndex=" + page +
                                        "&pageSize=" + queryCommentParams.pageSize + "&productId=" + store.getState().productId)
                                        .then((res: any) => {
                                            setListDataCount(res.count);
                                            setListData(res.data);
                                        })
                                }
                            }}
                        />
                    ) : ""
                }
            </Space>
        </div>
    );
}

export default ProductInfo;
