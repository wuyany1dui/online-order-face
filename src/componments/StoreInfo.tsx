import React, {useEffect, Component, useState} from "react";
import {CreateStore, ModifyUserInfoApi, QueryCategoryList, QueryStoreApi, UserInfoApi} from "../request/api";
import {Statistic, Row, Col, Button, Form, Input, message, Space, Modal, Select} from 'antd';
import FormDate from "../utils/DateUtils";
import "./less/StoreInfo.less";

interface IStoreInfo {
    id: string;
    name: string;
    userId: string;
    description?: string;
    sales: number;
    salesVolume: number;
    type: string | string[];
    sort: number;
    createTime: string;
    updateTime: string;
}

export default function StoreInfo() {

    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
    };

    const layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 10},
    };
    const tailLayout = {
        wrapperCol: {offset: 8, span: 16},
    };

    const [storeInfo, setStoreInfo] = React.useState<IStoreInfo>({
        createTime: "",
        id: "",
        name: "",
        sales: 0,
        salesVolume: 0,
        sort: 0,
        type: "",
        updateTime: "",
        userId: ""
    });

    const [showCreateModal, setShowCreateModal] = React.useState<boolean>(false);
    const [categoryNameList, setCategoryNameList] = useState<any[]>([]);

    useEffect(() => {
        QueryStoreApi().then((res: any) => {
            res.sort = res.sort + 1;
            res.createTime = FormDate(new Date(res.createTime));
            res.updateTime = FormDate(new Date(res.updateTime));
            setStoreInfo(res);
            formRef.current.setFieldsValue(storeInfo);
        });
    }, [])

    let formRef: any = React.createRef()

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
        CreateStore(values).then((res: any) => {
            message.success(res, 1);
            QueryStoreApi().then((res: any) => {
                res.sort = res.sort + 1;
                res.createTime = FormDate(new Date(res.createTime));
                res.updateTime = FormDate(new Date(res.updateTime));
                setStoreInfo(res);
                formRef.current.setFieldsValue(storeInfo);
            });
        }).catch((res: any) => {
            message.error(res.response.data, 1);
            QueryStoreApi().then((res: any) => {
                res.sort = res.sort + 1;
                res.createTime = FormDate(new Date(res.createTime));
                res.updateTime = FormDate(new Date(res.updateTime));
                setStoreInfo(res);
                formRef.current.setFieldsValue(storeInfo);
            });
        });
    };

    const onCreateFinish = (values: IStoreInfo) => {
        UserInfoApi().then((res: any) => {
            values.userId = res.id;
            let tempArr: any = values.type;
            values.type = tempArr.join(",");
            CreateStore(values).then((res: any) => {
                message.success("????????????");
                setShowCreateModal(false);
                QueryStoreApi().then((res: any) => {
                    res.sort = res.sort + 1;
                    res.createTime = FormDate(new Date(res.createTime));
                    res.updateTime = FormDate(new Date(res.updateTime));
                    setStoreInfo(res);
                    formRef.current.setFieldsValue(storeInfo);
                });
            }).catch((res: any) => {
                message.error("???????????????" + res.response.data);
                setShowCreateModal(false);
                QueryStoreApi().then((res: any) => {
                    res.sort = res.sort + 1;
                    res.createTime = FormDate(new Date(res.createTime));
                    res.updateTime = FormDate(new Date(res.updateTime));
                    setStoreInfo(res);
                    formRef.current.setFieldsValue(storeInfo);
                });
            });
        })
    }

    const {Option} = Select;

    const createOnClick = () => {
        setShowCreateModal(true);
        QueryCategoryList("").then((res: any) => {
            let tempArr: any[] = [];
            res.data.map((item: any) => {
                tempArr.push(<Option key={item.name}>{item.name}</Option>);
            });
            setCategoryNameList(tempArr);
        })
    }

    const handleCreateOnCancel = () => {
        setShowCreateModal(false);
    }

    return (
        <div>
            {
                storeInfo.id == "" ?
                    (
                        <div>
                            <Button type="primary" onClick={createOnClick}>????????????????????????????????????</Button>
                            <Modal visible={showCreateModal}
                                   footer={null}
                                   title="????????????"
                                   onCancel={handleCreateOnCancel}>
                                <Form {...layout}
                                      form={form}
                                      ref={formRef}
                                      name="control-hooks"
                                      onFinish={onCreateFinish}>
                                    <Form.Item name="name" label="????????????"
                                               rules={[{required: true, message: '?????????????????????'}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item name="type" label="????????????"
                                               rules={[{required: true, message: '?????????????????????'}]}>
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{width: '100%'}}
                                            placeholder="???????????????"
                                        >
                                            {categoryNameList}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="description" label="????????????" rules={[{required: false}]}>
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item {...tailLayout}>
                                        <Space>
                                            <Button type="primary" htmlType="submit">
                                                ??????
                                            </Button>
                                            <Button htmlType="button" onClick={onReset}>
                                                ??????
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </div>)
                    : (
                        <div className="store-box">
                            <Space>
                                <Row gutter={[16, 70]}>
                                    <Col span={12}>
                                        <Statistic title="?????????" value={storeInfo.sales}/>
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="????????????" value={storeInfo.salesVolume}/>
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="????????????" value={storeInfo.sort}/>
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="????????????" value={storeInfo.createTime}/>
                                    </Col>
                                </Row>
                                <Form
                                    {...formItemLayout}
                                    name="register"
                                    onFinish={onFinish}
                                    scrollToFirstError
                                    ref={formRef}
                                >
                                    <Form.Item
                                        name="name"
                                        label="????????????"
                                        rules={[
                                            {
                                                required: true,
                                                message: '??????????????????',
                                            },
                                        ]}
                                    >
                                        <Input defaultValue={storeInfo.name}/>
                                    </Form.Item>
                                    <Form.Item
                                        name="description"
                                        label="????????????"
                                    >
                                        <Input.TextArea showCount maxLength={100} allowClear={true} defaultValue={storeInfo.description}/>
                                    </Form.Item>
                                    <Form.Item {...tailFormItemLayout}>
                                        <Button type="primary" htmlType="submit" block>
                                            ????????????
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Space>
                        </div>)
            }
        </div>
    )
}