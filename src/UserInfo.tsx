import React, {useEffect, useState} from "react";
import DefaultAvatar from "./assets/images/defaultAvatar.png";
import {Button, Checkbox, Form, Input, message, Modal, Upload} from "antd";
import {useNavigate} from "react-router-dom";
import {ModifyUserInfoApi, ModifyUserPasswordApi, RegisterApi, UserInfoApi} from "./request/api";
import './Register.less';
import './componments/less/ModifyPasswordModal.less'
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";

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

interface IModifyPassword {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword?: string;
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

    const showModal = () => {
        setModifyPwdVisible(true);
    };

    const handleCancel = () => {
        setModifyPwdVisible(false);
    };

    const formRef: any = React.createRef()

    const [form] = Form.useForm();

    const navigate = useNavigate();

    // 组件初始化时加载
    useEffect(() => {
        UserInfoApi().then((res: any) => {
            userInfo = res;
            formRef.current.setFieldsValue(userInfo)
            if (userInfo.avatar) {
                avatar = userInfo.avatar;
                setImageUrl("http://localhost:8597/online/order/file/download/" + avatar);
            }
            setToken({token: localStorage.getItem("token")});
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

    const modifyPwdOnFinish = (values: IModifyPassword) => {
        setModifyPwdLoading(true);
        delete values.confirmNewPassword;
        ModifyUserPasswordApi(values).then((res: any) => {
            message.success("修改成功");
            setModifyPwdVisible(false);
            setModifyPwdLoading(false);
            localStorage.removeItem("token");
            navigate("/");
        }).catch((res: any) => {
            message.error("修改失败：" + res.response.data )
            setModifyPwdLoading(false);
        })
    };

    const [modifyPwdLoading, setModifyPwdLoading] = React.useState<boolean>(false);
    const [modifyPwdVisible, setModifyPwdVisible] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imageUrl, setImageUrl] = React.useState<string>("");
    const [token, setToken] = React.useState<any>({token: ""});

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>上传头像</div>
        </div>
    );

    function getBase64(img: any, callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl: any) => {
                setLoading(false);
                setImageUrl(imageUrl);
            });
        }
    };

    function beforeUpload(file: any) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传JPG/PNG文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('头像不能大于2M!');
        }
        return isJpgOrPng && isLt2M;
    }

    return (
        <div className='register_box'>
            <Upload
                name="multipartFile"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http://localhost:8597/online/order/user/uploadAvatar"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                headers={token}
            >
                {
                    imageUrl ?
                        <img src={imageUrl} alt="avatar" style={{width: '100%'}}/>
                        : uploadButton
                }
            </Upload>
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
                    <Input allowClear={true}/>
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
                    <Input style={{width: '100%'}} allowClear={true}/>
                </Form.Item>

                <Form.Item
                    name="sign"
                    label="个性签名"
                >
                    <Input.TextArea showCount maxLength={100} allowClear={true}/>
                </Form.Item>

                <div className="ant-row ant-form-item">
                    <Button type="primary" onClick={showModal}>
                        修改密码
                    </Button>
                    <Modal
                        visible={modifyPwdVisible}
                        title="修改密码"
                        footer={null}
                        onCancel={handleCancel}
                    >
                        <div className='modify_password_modal'>
                            <Form
                                name="basic"
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                                initialValues={{remember: true}}
                                onFinish={modifyPwdOnFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="原密码"
                                    name="oldPassword"
                                    rules={[{required: true, message: '请输入原密码！'}]}
                                >
                                    <Input.Password/>
                                </Form.Item>

                                <Form.Item
                                    label="新密码"
                                    name="newPassword"
                                    rules={[{required: true, message: '请输入新密码！'}]}
                                >
                                    <Input.Password/>
                                </Form.Item>

                                <Form.Item
                                    label="确认新密码"
                                    name="confirmNewPassword"
                                    dependencies={['newPassword']}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请确认新密码！',
                                        },
                                        ({getFieldValue}) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('请确保两个密码一致！'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password/>
                                </Form.Item>

                                <Form.Item >
                                    <Button type="primary" htmlType="submit" block>
                                        确认修改
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Modal>
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        确认修改
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}