import React, {useEffect, useState} from "react";
import {Button, Input, List, message, Modal, Radio, Space} from "antd";
import {ModifyUserLevel, QueryStoreListApi, QueryUserList} from "../request/api";
import "./less/ProductList.less";

interface IQueryUserParam {
    username?: string;
    nickname?: string;
    pageIndex: number;
    pageSize: number;
}

interface IUser {
    id: string;
    username: string;
    nickname: string;
    phoneNumber?: number;
    email?: string;
    sign?: string;
    avatar?: string;
    type: number;
    typeDesc: string;
}

let queryUserParams: IQueryUserParam = {pageIndex: 1, pageSize: 3}

export default function UserList() {

    const [userList, setUserList] = React.useState<IUser[]>([]);
    const [userListCount, setUserListCount] = React.useState<number>(0);
    const [showChangeLevel, setShowChangeLevel] = React.useState<boolean>(false);
    const [levelValue, setLevelValue] = React.useState<number>(0);
    const [userId, setUserId] = React.useState<string>("");

    const usernameOnChange = (e: any) => {
        queryUserParams.username = e.target.value;
    }

    const nicknameOnChange = (e: any) => {
        queryUserParams.nickname = e.target.value;
    }

    const changeOnclick = (id: string, type: number) => {
        setLevelValue(type);
        setShowChangeLevel(true);
        setUserId(id);
    }

    const handleChangeCancel = () => {
        setShowChangeLevel(false);
    }

    const chooseLevel = (e: any) => {
        setLevelValue(e.target.value);
    }

    const changeLevelOnClick = () => {
        ModifyUserLevel({id: userId, type: levelValue.toString()}).then((res: any) => {
            message.success("修改成功");
            setShowChangeLevel(false);
            QueryUserList(queryUserParams).then((res: any) => {
                setUserList(res.data);
                setUserListCount(res.count);
            })
        }).catch((err: any) => {
            message.error("修改失败");
        })
    }

    useEffect(() => {
        QueryUserList(queryUserParams).then((res: any) => {
            setUserList(res.data);
            setUserListCount(res.count);
        })
    }, [])

    const searchOnClick = () => {
        QueryUserList(queryUserParams).then((res: any) => {
            setUserList(res.data);
            setUserListCount(res.count);
        })
    }

    return (
        <div className="product-list-box">
            <div className="search-input">
                <Space direction="vertical" size={10}>
                    <Input
                        placeholder="用户名"
                        onChange={usernameOnChange}
                    />
                    <Input
                        placeholder="用户昵称"
                        onChange={nicknameOnChange}
                    />
                    <Button type="primary" onClick={searchOnClick}>搜索</Button>
                </Space>
            </div>
            <div className="list">
                <List
                    size="large"
                    bordered
                    dataSource={userList}
                    pagination={{
                        current: queryUserParams.pageIndex,
                        total: userListCount,
                        pageSize: queryUserParams.pageSize,
                        showSizeChanger: false,
                        onChange: page => {
                            queryUserParams.pageIndex = page;
                            QueryUserList(queryUserParams).then((res: any) => {
                                setUserList(res.data);
                                setUserListCount(res.count);
                            })
                        }
                    }}
                    renderItem={item =>
                        <List.Item>
                            <div>
                                用户名：{item.username}<br/>
                                用户昵称：{item.nickname}<br/>
                                手机号码：{item.phoneNumber}<br/>
                                电子邮箱：{item.email}<br/>
                                个性签名：{item.sign}<br/>
                                用户类型：{item.typeDesc}
                            </div>
                            <div>
                                <Button type="primary" onClick={() => changeOnclick(item.id, item.type)}>修改用户权限</Button>
                                <Modal
                                    visible={showChangeLevel}
                                    title="修改用户权限"
                                    footer={null}
                                    onCancel={handleChangeCancel}
                                >
                                    <Space direction="vertical">
                                        <Radio.Group onChange={chooseLevel} value={levelValue}>
                                            <Radio value={0}>普通用户</Radio>
                                            <Radio value={1}>商家</Radio>
                                        </Radio.Group>
                                        <Button type="primary" onClick={changeLevelOnClick}>确定</Button>
                                    </Space>
                                </Modal>
                            </div>
                        </List.Item>
                    }
                />
            </div>
        </div>
    );
}