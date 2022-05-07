import {Button, Divider, Input, List, Space, Typography} from "antd";
import "./less/ProductList.less";
import React from "react";
import {LineChartOutlined} from "@ant-design/icons";
import {QueryProductListApi} from "../request/api";

const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
];

export default function StoreList() {

    return (
        <div className="product-list-box">
            <div className="search-input">
                <Space direction="vertical" size={10}>
                    <Input
                        placeholder="商店类型"
                    />
                    <Button type="primary">搜索</Button>
                </Space>
            </div>
            <div className="list">
                <List
                    size="large"
                    bordered
                    dataSource={data}
                    pagination={{
                        current: 1,
                        total: 4,
                        pageSize: 4,
                        showSizeChanger: false
                    }}
                    renderItem={item =>
                        <List.Item>
                            名称：馋嘴鱼<br/>
                            介绍：test<br/>
                            销量：179<br/>
                            类型：汉堡炸鸡,奶茶果汁<br/>
                            销售额：2000.00<br/>
                        </List.Item>
                    }
                />
            </div>
        </div>
    );
}