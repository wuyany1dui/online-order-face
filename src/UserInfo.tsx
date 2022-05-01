import React, {useEffect, useState} from "react";
import DefaultAvatar from "./assets/images/defaultAvatar.png";
import {Button, Checkbox, Form, Input, message} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {ModifyUserInfoApi, RegisterApi, UserInfoApi} from "./request/api";
import './Register.less';
import './componments/less/ModifyPasswordModal.less'
import ModifyPasswordModal from "./componments/ModifyPasswordModal";

interface IUserInfoParam {
    id: string;
    username: string | number;
    nickname: string;
    phoneNumber?: number;
    email?: string;
    sign?: string;
    type: number;
    avatar?: string;
}

let userInfo: IUserInfoParam = {
    id: "",
    nickname: "",
    type: 0,
    username: ""
}

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
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

let avatar: string = DefaultAvatar;

export default function UserInfo() {

    const formRef: any = React.createRef()

    const navigate = useNavigate();

    const [form] = Form.useForm();

    // 组件初始化时加载
    useEffect(() => {
        UserInfoApi().then((res: any) => {
            userInfo = res;
            formRef.current.setFieldsValue(userInfo)
            if (userInfo.avatar) {
                avatar = userInfo.avatar;
            }
        });
    }, []);

    const onFinish = (values: IUserInfoParam) => {
        values.id = userInfo.id;
        ModifyUserInfoApi(values).then((res: any) => {
            message.success(res, 1);
        }).catch((res: any) => {
            message.error(res.response.data, 1);
        });
    };

    return (
        <div className='register_box'>
            <img src={DefaultAvatar} className="logo" alt="#" style={{width: '60px', height: '60px'}}></img>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
                ref={formRef}
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
                    <Input disabled={true}/>
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
                    <Input allowClear={true} />
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
                    <Input allowClear={true}/>
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="电话号码"
                >
                    <Input style={{width: '100%'}} allowClear={true} />
                </Form.Item>

                <Form.Item
                    name="sign"
                    label="个性签名"
                >
                    <Input.TextArea showCount maxLength={100} allowClear={true} />
                </Form.Item>

                <div className="ant-row ant-form-item">
                    <ModifyPasswordModal />
                </div>

                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" block>
                        确认修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}