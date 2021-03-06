import {Button, Input, List, Space, Modal, Select, message} from "antd";
import "./less/ProductList.less";
import React, {useEffect, useState} from "react";
import {ModifyStore, QueryCategoryList, QueryStoreListApi, UserInfoApi} from "../request/api";
import store from "../store";
import FormatDate from "../utils/DateUtils";

interface IQueryStoreList {
    pageIndex: number;
    pageSize: number;
    userId?: string;
    type?: string;
}

interface IModifyStoreCategory {
    id: string;
    type: string;
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

    let chosenNameList: string[] = [];

    const {Option} = Select;

    function handleChange(value: string[]) {
        chosenNameList = value;
        console.log(value);
        setModifyStoreCategory({id: storeId, type: value.join(",")});
        setSelectedNameList(chosenNameList);
        console.log(selectedNameList);
    }

    const [selectedNameList, setSelectedNameList] = useState<string[]>([]);
    const [tempListData, setTempListData] = useState<IStore[]>([]);
    const [tempListCount, setTempListCount] = useState<number>(0);
    const [userType, setUseType] = useState<number>(0);
    const [showModifyCategory, setShowModifyCategory] = useState<boolean>(false);
    const [storeId, setStoreId] = useState<string>("");
    const [categoryNameList, setCategoryNameList] = useState<any[]>([]);
    const [modifyStoreCategory, setModifyStoreCategory] = useState<IModifyStoreCategory>({id: "", type: ""})

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

    const modifyCategoryOnClick = (id: string, type: string) => {
        setStoreId(id);
        setShowModifyCategory(true);
        setSelectedNameList(type.split(","));
        let tempArr: any[] = [];
        QueryCategoryList("").then((res: any) => {
            res.data.map((item: any) => {
                tempArr.push(<Option key={item.name}>{item.name}</Option>);
            });
            setCategoryNameList(tempArr);
        })
    }

    const handelModifyCategoryCancel = () => {
        setShowModifyCategory(false);
        // setSelectedNameList([]);
    }

    const modifyCategory = () => {
        ModifyStore(modifyStoreCategory).then((res: any) => {
            message.success("????????????");
            setShowModifyCategory(false);
            UserInfoApi().then((res: any) => {
                setUseType(res.type);
            })
            QueryStoreListApi(queryStoreList).then((res: any) => {
                listCount = res.count;
                listData = res.data;
                setTempListData(listData);
                setTempListCount(listCount);
            })
        }).catch((err: any) => {
            message.error("???????????????" + err.response.data);
            setShowModifyCategory(false);
            UserInfoApi().then((res: any) => {
                setUseType(res.type);
            })
            QueryStoreListApi(queryStoreList).then((res: any) => {
                listCount = res.count;
                listData = res.data;
                setTempListData(listData);
                setTempListCount(listCount);
            })
        })
    }

    useEffect(() => {
        UserInfoApi().then((res: any) => {
            setUseType(res.type);
        })
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
                        placeholder="????????????"
                        onChange={typeInputOnChange}
                    />
                    <Button type="primary" onClick={searchOnClick}>??????</Button>
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
                            <div>
                                ?????????<a onClick={() => titleOnClick(item.id)}>{item.name}</a><br/>
                                ?????????{item.description}<br/>
                                ?????????{item.sales}<br/>
                                ?????????{item.type}<br/>
                                ????????????{item.salesVolume}<br/>
                            </div>
                            <div>
                                {
                                    userType === 2 ? (
                                        <div>
                                            <Button type="primary"
                                                    onClick={() => modifyCategoryOnClick(item.id, item.type)}>??????????????????</Button>
                                            <Modal visible={showModifyCategory}
                                                   title="??????????????????"
                                                   footer={null}
                                                   onCancel={handelModifyCategoryCancel}>
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    style={{width: '100%'}}
                                                    placeholder="???????????????"
                                                    key={item.id}
                                                    defaultValue={item.type.split(",")}
                                                    onChange={handleChange}
                                                >
                                                    {categoryNameList}
                                                </Select>
                                                <Button type="primary" style={{marginTop: "10px"}} onClick={modifyCategory}>????????????????????????</Button>
                                            </Modal>
                                        </div>
                                    ) : ""
                                }
                            </div>
                        </List.Item>
                    }
                />
            </div>
        </div>
    );
}