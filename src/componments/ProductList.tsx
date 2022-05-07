import React from "react";
import {List, Avatar, Space, Input, Button, Modal, Divider} from 'antd';
import {LineChartOutlined} from '@ant-design/icons';
import {QueryProductListApi, UserInfoApi} from "../request/api";
import "./less/ProductList.less";
import {Link, Navigate, Outlet} from "react-router-dom";
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

let queryProductData: IQueryProduct = {pageIndex: 1, pageSize: 3};

let queryProduct: IQueryProductPage = {count: 0, data: []}

let userType: number = 0;

class ProductList extends React.Component {

    state = {
        loading: false,
        visible: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({visible: false});
    };

    componentWillMount() {
        QueryProductListApi(queryProductData).then((res: any) => {
            queryProduct = res;
            this.setState(queryProduct);
        });
        UserInfoApi().then((res: any) => {
            userType = res.type;
        });
    }

    render() {

        const {visible, loading} = this.state;

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
                        <Button type="primary">搜索</Button>
                        {
                            userType === 1 ? (<Button type="primary">新增商品</Button>) : ""
                        }
                        {
                            userType === 2 ? (
                                <div>
                                    <Button type="primary" onClick={this.showModal}>查看商品分类</Button>
                                    <Modal visible={visible}
                                           title="餐品分类"
                                           footer={null}
                                           onCancel={this.handleCancel}>
                                        <div>
                                            <Button type="primary">新增分类</Button>
                                            <Divider></Divider>
                                            <List
                                                dataSource={listData}
                                                pagination={{
                                                    current: 1,
                                                    total: 5,
                                                    pageSize: 5,
                                                    showSizeChanger: false}}
                                                renderItem={item => (
                                                    <List.Item>
                                                        名称：炸鸡 <br/>
                                                        创建时间：2022-05-07 14:46:05 <br/>
                                                        <Button type="primary">删除</Button>
                                                    </List.Item>
                                                )}
                                            >
                                            </List>
                                        </div>
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
                                    queryProduct = res;
                                    this.setState(queryProduct);
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
                                {
                                    userType === 1 ? (<Button type="primary">修改商品信息</Button>) : ""
                                }
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        )
    }
}

export default ProductList;