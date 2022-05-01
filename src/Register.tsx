import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, message } from 'antd';
import { Link } from "react-router-dom";
import Logo from './assets/images/logo.jpg';
import './Register.less';
import { RegisterApi } from "./request/api";
import { useNavigate } from 'react-router-dom';

interface IRegisterParam {
    username: string | number;
    password: any;
    phoneNumber?: number;
    email?: string;
    type: number;
    agreement?: boolean;
    confirm?: string;
    sign?: string;
}


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 0,
            offset: 0,
        },
    },
};

export default function Register() {

    const navigate = useNavigate();

    const [form] = Form.useForm();

    const onFinish = (values: IRegisterParam) => {
        values.type = 0;
        delete values.agreement;
        delete values.confirm;
        RegisterApi(values).then((res: any) => {
            message.success(res, 1);
            setTimeout(() => {
                navigate("/register");
            }, 1500);
        }).catch((res: any) => {
            message.error(res.response.data, 1);
        });
    };
    return (
        <div className='register_box'>
            <img src={Logo} className="logo" alt="#"></img>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
            >

                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名！',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: '请确认密码！',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('请确保两个密码一致！'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="nickname"
                    label="昵称"
                    tooltip="您希望别人如何称呼您？"
                    rules={[
                        {
                            required: true,
                            message: '请输入昵称！',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="电子邮箱"
                    rules={[
                        {
                            type: 'email',
                            message: '内容不符合电子邮箱格式！',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="电话号码"
                >
                    <Input style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="sign"
                    label="个性签名"
                >
                    <Input.TextArea showCount maxLength={100} />
                </Form.Item>

                <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error('您还未阅读用户条款！')),
                        },
                    ]}
                    {...tailFormItemLayout}
                >
                    <Checkbox>
                        我已阅读 <a href="/">用户条款</a>
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <Link to="/login">已有帐号？立即登录！</Link>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" block>
                        立即注册
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}