import {Button, Input, List, Space} from "antd";
import "./less/ProductList.less";
import React, {useEffect, useState} from "react";
import {QueryStoreListApi} from "../request/api";
import store from "../store";

const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
];

interface IQueryStoreList {
    pageIndex: number;
    pageSize: number;
    userId?: string;
    type?: string;
}

interface IStore {
    id: string;
    name: string;
    description: string;
    sales: number;
    type: string;
    salesVolume: number;
}

let queryStoreList: IQueryStoreList = {
    pageIndex: 1,
    pageSize: 4
};

let listData: IStore[] = []
let listCount: number = 0;

export default function StoreList() {

    const [tempListData, setTempListData] = useState<IStore[]>([]);
    const [tempListCount, setTempListCount] = useState<number>(0);

    const typeInputOnChange = (e: any) => {
        queryStoreList.type = e.target.value;
    }

    const searchOnClick = () => {
        QueryStoreListApi(queryStoreList).then((res: any) => {
            listCount = res.count;
            listData = res.data;
            setTempListData(listData);
            setTempListCount(listCount);
        })
    }

    const titleOnClick = (id: string) => {
        const action = {
            type: "toProductList",
            value: id,
        }
        store.dispatch(action);
    }

    useEffect(() => {
        QueryStoreListApi(queryStoreList).then((res: any) => {
            listCount = res.count;
            listData = res.data;
            setTempListData(listData);
            setTempListCount(listCount);
        })
    }, [])

    return (
        <div className="product-list-box">
            <div className="search-input">
                <Space direction="vertical" size={10}>
                    <Input
                        placeholder="商店类型"
                        onChange={typeInputOnChange}
                    />
                    <Button type="primary" onClick={searchOnClick}>搜索</Button>
                </Space>
            </div>
            <div className="list">
                    <List
                        size="large"
                        bordered
                        dataSource={listData}
                        pagination={{
                            current: queryStoreList.pageIndex,
                            total: listCount,
                            pageSize: queryStoreList.pageSize,
                            showSizeChanger: false
                        }}
                        renderItem={item =>
                            <List.Item>
                                名称：<a onClick={() => titleOnClick(item.id)}>{item.name}</a><br/>
                                介绍：{item.description}<br/>
                                销量：{item.sales}<br/>
                                类型：{item.type}<br/>
                                销售额：{item.salesVolume}<br/>
                            </List.Item>
                        }
                    />
            </div>
        </div>
    );
}