import React, { useEffect, useState } from "react";
import './less/MyHeader.less';
import DefaultAvater from '../assets/images/defaultAvater.png';
import { Menu, Dropdown, Space, Layout, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserInfoApi } from "../request/api";

const { Header } = Layout;

const menuNames: string[] = ["首页", "商店", "餐品"];

// 用户信息对象
interface IUserInfo {
    id: string | null;
    username: string | null;
    nickname: string | null;
    phoneNumber?: number | null;
    email?: string | null;
    sign?: string | null;
    avater?: string | null;
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
    avater: null,
    type: null,
    typeDesc: null
};

export default function MyHeader() {

    const navigate = useNavigate();

    // 登出，清空本地token
    const dorpdownClick = (key: any) => {
        if (key.key === '1') {
            localStorage.removeItem("token");
            navigate("/", { replace: true });
        } else if (key.key === '0') {
            navigate("/userInfo");
        }
    };

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

    const [avater, setAvater] = useState(DefaultAvater);
    const [nickname, setNickname] = useState("暂未登录");

    // 组件初始化时加载
    useEffect(() => {
        UserInfoApi().then((res: any) => {
            userInfo = res;
            setAvater(userInfo.avater || DefaultAvater);
            setNickname(userInfo.nickname || "暂未登录");
        }).catch((res: any) => {
            message.error("用户未验证", 1);
        });
    }, []);

    if (localStorage.getItem("token")) {
        menu = loginMenu;
    }

    return (
        <Header>
            <Space align="start" size={1470}>
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
                />
                <Dropdown overlay={menu} trigger={['click']}>
                    <a onClick={e => e.preventDefault()} href="!#">
                        <Space align="start">
                            <img src={avater} alt="!#" width={45} height={45} style={{ marginRight: "5px" }}></img>
                            {nickname}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Space>
        </Header>
    )
}