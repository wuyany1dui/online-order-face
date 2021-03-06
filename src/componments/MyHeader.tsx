import React, {useEffect, useState} from "react";
import './less/MyHeader.less';
import DefaultAvatar from '../assets/images/defaultAvatar.png';
import {Menu, Dropdown, Space, Layout, message} from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {Link, Navigate, useNavigate} from "react-router-dom";
import {UserInfoApi} from "../request/api";
import store from "../store";

const {Header} = Layout;

const normalUserNames: string[] = ["首页", "商店", "餐品", "我的订单"];

const merchantMenuNames: string[] = ["首页", "商店", "餐品", "我的订单", "商店管理", "餐品管理"];

const adminMenuName: string[] = ["用户管理", "分类管理", "商店管理", "餐品管理", "订单管理", "评论管理"];

let defaultMenuNames: string[] = ["首页"];

// 用户信息对象
interface IUserInfo {
    id: string | null;
    username: string | null;
    nickname: string | null;
    phoneNumber?: number | null;
    email?: string | null;
    sign?: string | null;
    avatar?: string | null;
    type: number | null;
    typeDesc: string | null;
}

let userInfo: IUserInfo = {
    id: null,
    nickname: null,
    username: null,
    phoneNumber: null,
    email: null,
    sign: null,
    avatar: null,
    type: null,
    typeDesc: null
};

export default function MyHeader() {

    const [avatar, setAvatar] = useState(DefaultAvatar);
    const [nickname, setNickname] = useState("暂未登录");
    const [menuNames, setMenuNames] = React.useState<string[]>(defaultMenuNames);

    const navigate = useNavigate();

    // 登出，清空本地token
    const dorpdownClick = (key: any) => {
        if (key.key === '1') {
            localStorage.removeItem("token");
            setNickname("暂未登录");
            setAvatar(DefaultAvatar);
            setMenuNames(defaultMenuNames);
            // 创建action对象
            const action = {
                type: "menuClick",       // type属性是必须要写的，用于校验
                value: 1,          // value代表要修改为什么值
            }
            // 将action用dispatch方法传递给store
            store.dispatch(action);
            navigate("/login");
        } else if (key.key === '0') {
            navigate("/userInfo");
        }
    };

    const notLoginMenu = (
        <Menu
            items={[
                {
                    label: <a href="/login">立即登录</a>,
                    key: '2',
                },
                {
                    label: <a href="/register">前往注册</a>,
                    key: '3',
                }
            ]}
        />
    );

    const loginMenu = (
        <Menu
            onClick={dorpdownClick}
            items={[
                {
                    label: "个人信息",
                    key: '0',
                },
                {
                    label: "退出登录",
                    key: '1',
                }
            ]}
        />
    );

    let menu = (
        <Menu
            items={[
                {
                    label: <a href="/login">立即登录</a>,
                    key: '2',
                },
                {
                    label: <a href="/register">前往注册</a>,
                    key: '3',
                }
            ]}
        />
    );

    // 组件初始化时加载
    useEffect(() => {
        setAvatar(DefaultAvatar);
        UserInfoApi().then((res: any) => {
            userInfo = res;
            if (userInfo.avatar) {
                setAvatar("http://localhost:8597/online/order/file/download/" + userInfo.avatar);
            } else {
                setAvatar(DefaultAvatar);
            }
            setNickname(userInfo.nickname || "暂未登录");
            if (userInfo.type === 0) {
                setMenuNames(normalUserNames);
            } else if (userInfo.type === 1) {
                setMenuNames(merchantMenuNames);
            } else if (userInfo.type === 2) {
                setMenuNames(adminMenuName);
            }
        }).catch(() => {
            menu = notLoginMenu;
            setAvatar(DefaultAvatar);
            localStorage.removeItem("token")
        });
    }, []);

    if (localStorage.getItem("token")) {
        menu = loginMenu;
    }

    const menuClick = (e: any) => {
        // 创建action对象
        const action = {
            type: "menuClick",       // type属性是必须要写的，用于校验
            value: e.key,          // value代表要修改为什么值
        }
        // 将action用dispatch方法传递给store
        store.dispatch(action);
    }

    return (
        <Header>
            <div>
                <div className="menu">
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        items={menuNames.map((menuName, index) => {
                            const key = index + 1;
                            return {
                                key,
                                label: menuName,
                            };
                        })}
                        onClick={menuClick}
                    />
                </div>
                <div className="dropdown">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a onClick={e => e.preventDefault()} href="!#">
                            <Space align="start">
                                <img src={avatar} width={45} height={45} style={{marginRight: "5px"}}></img>
                                {nickname}
                                <DownOutlined/>
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>
        </Header>
    )
}