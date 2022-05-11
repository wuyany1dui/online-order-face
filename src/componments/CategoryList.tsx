import {Button, Divider, Input, message, Modal, Radio, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import {CreateCategory, DeleteCategory, QueryCategoryList, QueryProductListApi, QueryUserList} from "../request/api";
import FormatDate from "../utils/DateUtils";

interface IQueryCategoryParam {
    pageIndex: number;
    pageSize: number;
    name?: string;
}

interface INewCategoryParam {
    id?: string
    name: string;
}

interface ICategory {
    key: React.Key;
    id: string;
    name: string;
    createTime: number | Date;
    updateTime: number | Date;
}

let queryCategoryParam: IQueryCategoryParam = {pageIndex: 1, pageSize: 10, name: ""};
let newCategoryParam: INewCategoryParam = {name: "", id: ""};

export default function CategoryList() {

    const categoryNameOnClick = (text: string, e: any) => {
        setCurrentCategoryName(text);
        setCurrentCategoryId(e.id)
        setShowModifyCategory(true);
    }

    const handleCategoryNamCancel = () => {
        setCurrentCategoryId("");
        setCurrentCategoryName("");
        setShowModifyCategory(false);
    }

    const columns = [
        {
            title: '分类名称',
            dataIndex: 'name',
            render: (text: string, e: any) => <a onClick={() => categoryNameOnClick(text, e)}>{text}</a>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
        },
        {
            title: '上次更新时间',
            dataIndex: 'updateTime',
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[] | string[], selectedRows: ICategory[]) => {
            setIds(selectedRowKeys);
        }
    };

    const [currentCategoryId, setCurrentCategoryId] = React.useState<string>("");
    const [currentCategoryName, setCurrentCategoryName] = React.useState<string>("");
    const [categoryList, setCategoryList] = React.useState<ICategory[]>([]);
    const [categoryListCount, setCategoryListCount] = React.useState<number>(0);
    const [showNewCategory, setShowNewCategory] = React.useState<boolean>(false);
    const [showModifyCategory, setShowModifyCategory] = React.useState<boolean>(false);
    const [ids, setIds] = React.useState<React.Key[] | string[]>([])
    const [showCheckDelete, setShowCheckDelete] = React.useState<boolean>(false);

    const nameOnChange = (e: any) => {
        queryCategoryParam.name = e.target.value;
    }

    const newNameOnChange = (e: any) => {
        newCategoryParam.name = e.target.value;
        setCurrentCategoryName(e.target.value);
    }

    const searchOnClick = () => {
        QueryCategoryList("?pageIndex=" + queryCategoryParam.pageIndex + "&pageSize=" +
            queryCategoryParam.pageSize + "&name=" + queryCategoryParam.name).then((res: any) => {
            res.data.map(((item: any) => {
                item.key = item.id;
                item.createTime = FormatDate(new Date(item.createTime));
                item.updateTime = FormatDate(new Date(item.updateTime));
            }));
            setCategoryList(res.data);
            setCategoryListCount(res.count);
        })
    }

    const newCategoryOnClick = () => {
        setShowNewCategory(true);
    }

    const handleNewCategoryCancel = () => {
        setCurrentCategoryId("");
        setCurrentCategoryName("");
        setShowNewCategory(false);
    }

    const categoryOnClick = () => {
        CreateCategory(newCategoryParam).then((res: any) => {
            message.success("新增成功");
            setShowNewCategory(false);
            QueryCategoryList("?pageIndex=" + queryCategoryParam.pageIndex + "&pageSize=" +
                queryCategoryParam.pageSize + "&name=" + queryCategoryParam.name).then((res: any) => {
                res.data.map(((item: any) => {
                    item.key = item.id;
                    item.createTime = FormatDate(new Date(item.createTime));
                    item.updateTime = FormatDate(new Date(item.updateTime));
                }));
                setCategoryList(res.data);
                setCategoryListCount(res.count);
            })
        }).catch((err: any) => {
            message.error("新增失败：" + err.response.data);
            setShowNewCategory(false);
            QueryCategoryList("?pageIndex=" + queryCategoryParam.pageIndex + "&pageSize=" +
                queryCategoryParam.pageSize + "&name=" + queryCategoryParam.name).then((res: any) => {
                res.data.map(((item: any) => {
                    item.key = item.id;
                    item.createTime = FormatDate(new Date(item.createTime));
                    item.updateTime = FormatDate(new Date(item.updateTime));
                }));
                setCategoryList(res.data);
                setCategoryListCount(res.count);
            })
        });
    }

    const modifyCategoryOnClick = () => {
        let modifyCategoryParam: INewCategoryParam = {id: currentCategoryId, name: currentCategoryName}
        CreateCategory(modifyCategoryParam).then((res: any) => {
            message.success("修改成功");
            setShowModifyCategory(false);
            QueryCategoryList("?pageIndex=" + queryCategoryParam.pageIndex + "&pageSize=" +
                queryCategoryParam.pageSize + "&name=" + queryCategoryParam.name).then((res: any) => {
                res.data.map(((item: any) => {
                    item.key = item.id;
                    item.createTime = FormatDate(new Date(item.createTime));
                    item.updateTime = FormatDate(new Date(item.updateTime));
                }));
                setCategoryList(res.data);
                setCategoryListCount(res.count);
            })
        }).catch((err: any) => {
            message.error("修改失败：" + err.response.data);
            setShowModifyCategory(false);
            QueryCategoryList("?pageIndex=" + queryCategoryParam.pageIndex + "&pageSize=" +
                queryCategoryParam.pageSize + "&name=" + queryCategoryParam.name).then((res: any) => {
                res.data.map(((item: any) => {
                    item.key = item.id;
                    item.createTime = FormatDate(new Date(item.createTime));
                    item.updateTime = FormatDate(new Date(item.updateTime));
                }));
                setCategoryList(res.data);
                setCategoryListCount(res.count);
            })
        });
    }

    const deleteCategory = () => {
        setShowCheckDelete(true);
    }

    const showCheckDeleteOnClick = () => {
        DeleteCategory(ids).then((res: any) => {
            message.success("删除成功")
            setShowCheckDelete(false);
            QueryCategoryList("?pageIndex=" + queryCategoryParam.pageIndex + "&pageSize=" +
                queryCategoryParam.pageSize + "&name=" + queryCategoryParam.name).then((res: any) => {
                res.data.map(((item: any) => {
                    item.key = item.id;
                    item.createTime = FormatDate(new Date(item.createTime));
                    item.updateTime = FormatDate(new Date(item.updateTime));
                }));
                setCategoryList(res.data);
                setCategoryListCount(res.count);
            })
        }).catch((err: any) => {
            message.error("删除失败：" + err.response.data)
            setShowCheckDelete(false);
            QueryCategoryList("?pageIndex=" + queryCategoryParam.pageIndex + "&pageSize=" +
                queryCategoryParam.pageSize + "&name=" + queryCategoryParam.name).then((res: any) => {
                res.data.map(((item: any) => {
                    item.key = item.id;
                    item.createTime = FormatDate(new Date(item.createTime));
                    item.updateTime = FormatDate(new Date(item.updateTime));
                }));
                setCategoryList(res.data);
                setCategoryListCount(res.count);
            })
        })
    }

    const handleShowCheckDeleteCancel = () => {
        setShowCheckDelete(false);
    }

    useEffect(() => {
        QueryCategoryList("?pageIndex=" + queryCategoryParam.pageIndex + "&pageSize=" +
            queryCategoryParam.pageSize + "&name=" + queryCategoryParam.name).then((res: any) => {
            res.data.map(((item: any) => {
                item.key = item.id;
                item.createTime = FormatDate(new Date(item.createTime));
                item.updateTime = FormatDate(new Date(item.updateTime));
            }));
            setCategoryList(res.data);
            setCategoryListCount(res.count);
        })
    }, [])

    return (
        <div className="product-list-box">
            <div className="search-input">
                <Space direction="vertical" size={10}>
                    <Input
                        placeholder="分类名称"
                        onChange={nameOnChange}
                        allowClear={true}
                    />
                    <Button type="primary" onClick={searchOnClick}>搜索</Button>
                    <Button type="primary" onClick={newCategoryOnClick}>新增分类</Button>
                    <Button type="primary" onClick={deleteCategory}>删除所选分类</Button>
                    <Modal visible={showCheckDelete}
                           title="确认删除所选分类"
                           onCancel={handleShowCheckDeleteCancel}
                           footer={null}>
                        <Button type="primary" onClick={showCheckDeleteOnClick}>确认删除</Button>
                    </Modal>
                    <Modal visible={showNewCategory}
                           title="新增分类"
                           footer={null}
                           onCancel={handleNewCategoryCancel}
                    >
                        <Input
                            placeholder="分类名称"
                            onChange={newNameOnChange}
                            defaultValue=""
                            allowClear={true}
                        />
                        <Button type="primary" onClick={categoryOnClick} style={{marginTop: "10px"}}>立即新增</Button>
                    </Modal>
                    <Modal visible={showModifyCategory}
                           title="修改分类"
                           footer={null}
                           onCancel={handleCategoryNamCancel}>
                        <Input
                            placeholder="分类名称"
                            onChange={newNameOnChange}
                            allowClear={true}
                            key={currentCategoryId}
                            defaultValue={currentCategoryName}
                        />
                        <Button type="primary" onClick={modifyCategoryOnClick} style={{marginTop: "10px"}}>立即修改</Button>
                    </Modal>
                </Space>
            </div>
            <div className="list">
                <Table
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={categoryList}
                    pagination={{
                        onChange: page => {
                            queryCategoryParam.pageIndex = page;
                            QueryCategoryList("?pageIndex=" + queryCategoryParam.pageIndex + "&pageSize=" +
                                queryCategoryParam.pageSize + "&name=" + queryCategoryParam.name).then((res: any) => {
                                res.data.map(((item: any) => {
                                    item.key = item.id;
                                    item.createTime = FormatDate(new Date(item.createTime));
                                    item.updateTime = FormatDate(new Date(item.updateTime));
                                }));
                                setCategoryList(res.data);
                                setCategoryListCount(res.count);
                            })
                        },
                        current: queryCategoryParam.pageIndex,
                        total: categoryListCount,
                        pageSize: queryCategoryParam.pageSize,
                        showSizeChanger: false
                    }}
                />
            </div>
        </div>
    )
}