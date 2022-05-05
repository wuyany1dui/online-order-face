import React, {useEffect, Component} from "react";
import {ModifyUserInfoApi, QueryStoreApi} from "../request/api";
import {Statistic, Row, Col, Button, Form, Input, message, Space} from 'antd';
import FormDate from "../utils/DateUtils";
import "./less/StoreInfo.less";

interface IStoreInfo {
    id: string;
    name: string;
    userId: string;
    description?: string;
    sales: number;
    salesVolume: number;
    type: string;
    sort: number;
    createTime: string;
    updateTime: string;
}

let storeInfo: IStoreInfo = {
    createTime: "",
    id: "",
    name: "",
    sales: 0,
    salesVolume: 0,
    sort: 0,
    type: "",
    updateTime: "",
    userId: ""
}

class StoreInfo extends React.Component {

    state = storeInfo;

    componentWillMount() {
        QueryStoreApi().then((res: any) => {
            storeInfo = res;
            storeInfo.sort = storeInfo.sort + 1;
            storeInfo.createTime = FormDate(new Date(storeInfo.createTime));
            storeInfo.updateTime = FormDate(new Date(storeInfo.updateTime));
            this.setState(storeInfo);
            console.log(this.state)
            this.formRef.current.setFieldsValue(storeInfo);
        });
    }

    formRef: any = React.createRef()

    render() {

        const formItemLayout = {
            labelCol: {
                xs: {span: 10},
                sm: {span: 10},
            },
            wrapperCol: {
                xs: {span: 50},
                sm: {span: 50},
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 10,
                    offset: 10,
                },
                sm: {
                    span: 50,
                    offset: 50,
                },
            },
        };

        const onFinish = (values: IStoreInfo) => {
            values.id = storeInfo.id;
            ModifyUserInfoApi(values).then((res: any) => {
                message.success(res, 1);
            }).catch((res: any) => {
                message.error(res.response.data, 1);
            });
        };

        return (
            <div className="store-box">
                <Space>
                    <Row gutter={[16, 70]}>
                        <Col span={12}>
                            <Statistic title="总销量" value={this.state.sales}/>
                        </Col>
                        <Col span={12}>
                            <Statistic title="总销售额" value={this.state.salesVolume}/>
                        </Col>
                        <Col span={12}>
                            <Statistic title="当前排序" value={this.state.sort}/>
                        </Col>
                        <Col span={12}>
                            <Statistic title="创建时间" value={this.state.createTime}/>
                        </Col>
                    </Row>
                    <Form
                        {...formItemLayout}
                        name="register"
                        onFinish={onFinish}
                        scrollToFirstError
                        ref={this.formRef}
                    >
                        <Form.Item
                            name="name"
                            label="店铺名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入名称！',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="店铺介绍"
                        >
                            <Input.TextArea showCount maxLength={100} allowClear={true}/>
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" block>
                                确认修改
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </div>
        )
    }

}

export default StoreInfo;