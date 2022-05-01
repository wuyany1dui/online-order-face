import {Modal, Button, Input, Form, message} from 'antd';
import React from "react";
import {modifyUserPasswordApi} from "../request/api";

class ModifyPasswordModal extends React.Component {

    state = {
        loading: false,
        visible: false,
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {

        interface IModifyPassword {
            oldPassword: string;
            newPassword: string;
            confirmNewPassword?: string;
        }

        const onFinish = (values: IModifyPassword) => {
            this.setState({loading: true});
            delete values.confirmNewPassword;
            modifyUserPasswordApi(values).then((res: any) => {
                message.success(res, 1);
                this.setState({loading: false, visible: false});
            }).catch((res: any) => {
                message.error(res, 1)
            })
        };

        const {visible, loading} = this.state;

        return (
            <>
                <Button type="primary" onClick={this.showModal}>
                    修改密码
                </Button>
                <Modal
                    visible={visible}
                    title="修改密码"
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <div className='modify_password_modal'>
                        <Form
                            name="basic"
                            labelCol={{span: 8}}
                            wrapperCol={{span: 16}}
                            initialValues={{remember: true}}
                            onFinish={onFinish}
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
            </>
        );
    }
}

export default ModifyPasswordModal;