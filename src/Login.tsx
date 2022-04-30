import React, { useState } from "react"
import { Form, Input, Button, message } from 'antd';
import './Login.less'
import { Link } from "react-router-dom";
import Logo from './assets/images/logo.jpg'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LoginApi } from "./request/api";
import { useNavigate } from 'react-router-dom';

interface ILoginParam {
    username: string;
    password: string;
}

const onFinishFailed = (errorInfo: any) => {
    message.error("登陆失败！");
};

export default function Login() {

    const navigate = useNavigate();

    const onFinish = (values: ILoginParam) => {
        LoginApi(values).then((res: any) => {
            message.success("登录成功！", 1.5);
            localStorage.setItem("token", res);
            setTimeout(() => {
                navigate("/", res);
            }, 1500);
        }).catch((res: any) => {
            message.error(res.response.data, 1.5);
        })
    };

    return (
        <div className="login_box">
            <img src={Logo} className="logo" alt=""></img>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="请输入密码" />
                </Form.Item>

                <Form.Item>
                    <Link to="/register">还没账号？立即注册！</Link>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block size="large">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}