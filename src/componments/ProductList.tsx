import React, {useEffect, useState} from "react";
import {List, Avatar, Space, Input, Button, Modal, Divider, Form, Row, Col, Select} from 'antd';
import {DownOutlined, LineChartOutlined, UpOutlined} from '@ant-design/icons';
import {QueryCategoryList, QueryProductListApi, UserInfoApi} from "../request/api";
import "./less/ProductList.less";
import {Link, Navigate, Outlet} from "react-router-dom";
import store from "../store";
import FormatDate from "../utils/DateUtils";

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
    type: string;
}

interface IQueryProductPage {
    count: number;
    data: IQueryProductList[];
}

let queryProductData: IQueryProduct = {pageIndex: 1, pageSize: 3};

let userType: number = 0;

let storeId: string = "";

let categoryNameList: string[] = [];

function ProductList() {

    const [showProductModal, setShowProductModal] = React.useState<boolean>(false);
    const [productId, setProductId] = React.useState<string>("");
    const [storeId, setStoreId] = React.useState<string>("");
    const [queryProduct, setQueryProduct] = React.useState<IQueryProductPage>({count: 0, data: []});
    const [categoryNameList, setCategoryNameList] = useState<any[]>([]);

    useEffect(() => {
        setStoreId(store.getState().storeId);
        if (storeId) {
            queryProductData.storeId = storeId;
        }
        let tempQueryProductData = queryProductData;
        tempQueryProductData.storeId = storeId;
        QueryProductListApi(tempQueryProductData).then((res: any) => {
            setQueryProduct(res);
        });
        UserInfoApi().then((res: any) => {
            userType = res.type;
        });
    }, [])
    const listData = queryProduct.data;

    // @ts-ignore
    const IconText = ({icon, text}) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const nameInputOnChange = (e: any) => {
        queryProductData.name = e.target.value;
    }

    const typeInputOnChange = (e: any) => {
        queryProductData.type = e.target.value;
    }

    const startPriceInputOnChange = (e: any) => {
        queryProductData.startPrice = e.target.value;
    }

    const endPriceInputOnChange = (e: any) => {
        queryProductData.endPrice = e.target.value;
    }

    const titleClick = (e: any) => {
        const action = {
            type: "toProductInfo",
            value: e,
        }
        store.dispatch(action);
    }

    const searchOnClick = () => {
        QueryProductListApi(queryProductData).then((res: any) => {
            setQueryProduct(res)
        });
    }

    const showProductModalOnClick = (id: string) => {
        setShowProductModal(true);
        QueryCategoryList("").then((res: any) => {
            let tempArr: any[] = [];
            QueryCategoryList("").then((res: any) => {
                res.data.map((item: any) => {
                    tempArr.push(<Option key={item.name}>{item.name}</Option>);
                });
                setCategoryNameList(tempArr);
            })
        })
    }

    const handleShowProductModalCancel = () => {
        setShowProductModal(false);
        setProductId("");
    }

    let formRef: any = React.createRef()

    const {Option} = Select;

    const layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 10},
    };
    const tailLayout = {
        wrapperCol: {offset: 8, span: 16},
    };

    const onGenderChange = (value: string) => {
        switch (value) {
            case 'male':
                formRef.setFieldsValue({type: 'Hi, man!'});
                return;
            case 'female':
                formRef.setFieldsValue({type: 'Hi, lady!'});
                return;
            case 'other':
                formRef.setFieldsValue({type: 'Hi there!'});
        }
    };

    const onFinish = (values: any) => {
        console.log(values);
    };

    const onReset = () => {
        formRef.resetFields();
    };

    return (
        <div className="product-list-box">
            <div className="search-input">
                <Space direction="vertical" size={10}>
                    <Input
                        placeholder="餐品名称"
                        onChange={nameInputOnChange}
                    />
                    <Input
                        placeholder="餐品类型"
                        onChange={typeInputOnChange}
                    />
                    <Input
                        placeholder="起始价格"
                        onChange={startPriceInputOnChange}
                    />
                    ~
                    <Input
                        placeholder="上限价格"
                        onChange={endPriceInputOnChange}
                    />
                    <Button type="primary" onClick={searchOnClick}>搜索</Button>
                    {
                        userType === 1 ? (
                            <div>
                                <Button type="primary" onClick={() => showProductModalOnClick("")}>新增商品</Button>
                                <Modal visible={showProductModal}
                                       title={productId ? "修改商品" : "新增商品"}
                                       footer={null}
                                       onCancel={handleShowProductModalCancel}>
                                    <Form {...layout} ref={formRef} name="control-hooks" onFinish={onFinish}>
                                        <Form.Item name="name" label="餐品名称" rules={[{required: true}]}>
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item name="type" label="餐品分类" rules={[{required: true}]}>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{width: '100%'}}
                                                placeholder="请选择分类"
                                                // key={item.id}
                                                // defaultValue={item.type.split(",")}
                                                // onChange={handleChange}
                                            >
                                                {categoryNameList}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="price" label="餐品价格" rules={[{required: true}]}>
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item name="description" label="餐品描述" rules={[{required: false}]}>
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item name="firstImage" label="餐品图片" rules={[{required: true}]}>
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item {...tailLayout}>
                                            <Space>
                                                <Button type="primary" htmlType="submit">
                                                    确定
                                                </Button>
                                                <Button htmlType="button" onClick={onReset}>
                                                    重置
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                        ) : ""
                    }
                </Space>
            </div>
            <div className="list">
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            queryProductData.pageIndex = page;
                            QueryProductListApi(queryProductData).then((res: any) => {
                                setQueryProduct(res);
                            })
                        },
                        current: queryProductData.pageIndex,
                        total: queryProduct.count,
                        pageSize: queryProduct.data.length,
                        showSizeChanger: false
                    }}
                    dataSource={listData}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <IconText icon={LineChartOutlined} text={item.sales} key="list-vertical-star-o"/>
                            ]}
                            extra={
                                <img
                                    width={272}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            }
                        >
                            <List.Item.Meta
                                title={<a onClick={() => titleClick(item.id)}>{item.name}</a>}
                                description={item.description}
                            />
                            售价：{item.price} <br/>
                            分类：{item.type}
                            {
                                userType === 1 ? (
                                    <Button type="primary" style={{marginLeft: "5px"}}>修改商品信息</Button>
                                ) : ""
                            }
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}

export default ProductList;