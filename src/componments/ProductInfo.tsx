import React, {createElement, useEffect, useState} from 'react';
import {Comment, Tooltip, Avatar, Radio, Carousel, Space, Image, Descriptions, Button, Input, List, Form} from 'antd';
import moment from 'moment';
import "./less/ProductInfo.less";
import Logo from '../assets/images/logo.jpg';
import Laoba from '../assets/images/laoba.jpg';
import {PlusOutlined} from '@ant-design/icons';
import {QueryProductListApi} from "../request/api";
import store from "../store";

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
}

interface IQueryProductPage {
    count: number;
    data: IQueryProductList[];
}

let tempProduct: IQueryProductList = {description: "", firstImage: "", id: "", name: "", price: 0, sales: 0};

const { TextArea } = Input;

function Editor(props: { submitting: any, onChange: any, onSubmit: any, value: any }) {
    return (<>
        <Form.Item>
            <TextArea rows={2} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" type="primary">
                添加评论
            </Button>
        </Form.Item>
    </>);
}

function ProductInfo() {

    // let queryProduct: IQueryProductPage = {count: 0, data: []};\
    const [productId, setProductId] = React.useState("");
    const [productDetail, setProductDetail] = React.useState({});
    const [queryProduct, setQueryProduct] = React.useState({count: 0, data: []});
    const [dotPosition, setDotPosition] = React.useState('top');
    const [visible, setVisible] = useState(false);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [action, setAction] = useState("");

    const formRef: any = React.createRef()

    store.subscribe(() => {
        setProductId(store.getState().productId);
    })

    useEffect(() => {
        let queryProductData: IQueryProduct = {pageIndex: 1, pageSize: 1, id: store.getState().productId};
        QueryProductListApi(queryProductData).then((res: any) => {
            tempProduct = res.data[0];
            if (tempProduct) {
                setProductDetail(tempProduct);
            }
        });
    }, [productId])

    return (
        <div className="product-box">
            <Space direction="vertical">
                <Space>
                    <Image
                        preview={{visible: false}}
                        width={200}
                        src={tempProduct.firstImage}
                        // src={Laoba}
                        onClick={() => setVisible(true)}
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
                                <Button type="primary" icon={<PlusOutlined/>} size="large">
                                    加入订单
                                </Button>
                                <Input placeholder="数量"/>
                            </Space>
                        </Space>
                    </div>
                </Space>
                <Comment
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo"/>}
                    content={
                        <Editor
                            onChange=""
                            onSubmit=""
                            submitting=""
                            value=""
                        />
                    }
                />
                <Comment
                    author={<a>DrEAmSs59</a>}
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo"/>}
                    content={
                        <p>
                            东西很好吃，孩子很喜欢
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                        </Tooltip>
                    }
                />
            </Space>
        </div>
    );
}

export default ProductInfo;
