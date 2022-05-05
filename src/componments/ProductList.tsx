import React from "react";
import {List, Avatar, Space, Input, Button} from 'antd';
import {LineChartOutlined} from '@ant-design/icons';
import {QueryProductListApi} from "../request/api";
import "./less/ProductList.less";

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

class ProductList extends React.Component {

    componentWillMount() {
        QueryProductListApi(queryProductData).then((res: any) => {
            queryProduct = res;
            this.setState(queryProduct);
        })
    }

    render() {
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

        const startPriceInputOnChange  = (e: any) => {
            queryProductData.startPrice = e.target.value;
        }

        const endPriceInputOnChange  = (e: any) => {
            queryProductData.endPrice = e.target.value;
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
                                    title={<a href={item.description}>{item.name}</a>}
                                    description={item.description}
                                />
                                售价：{item.price}
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        )
    }
}

export default ProductList;