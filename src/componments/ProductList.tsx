import React, {useEffect, useState} from "react";
import {List, Avatar, Space, Input, Button, Modal, Divider, Form, Row, Col, Select, message, Upload} from 'antd';
import {DownOutlined, LineChartOutlined, LoadingOutlined, PlusOutlined, UpOutlined} from '@ant-design/icons';
import {CreateProduct, QueryCategoryList, QueryProductListApi, QueryStoreApi, UserInfoApi} from "../request/api";
import "./less/ProductList.less";
import {Link, Navigate, Outlet} from "react-router-dom";
import store from "../store";
import FormatDate from "../utils/DateUtils";
import StoreInfo from "./StoreInfo";

interface IQueryProduct {
    id?: string;
    storeId?: string;
    type?: string;
    name?: string;
    startPrice?: number;
    endPrice?: number;
    pageIndex?: number;
    pageSize?: number;
}

interface IQueryProductList {
    id: string;
    name: string;
    price: number;
    description?: string;
    sales: number;
    firstImage?: string;
    type: string | string[];
    storeId: string;
}

interface IQueryProductPage {
    count: number;
    data: IQueryProductList[];
}

interface ICreateProductParam {
    id?: string;
    storeId: string;
    name: string;
    price: number;
    description: string;
    type: string | string[];
}

let queryProductData: IQueryProduct = {pageIndex: 1, pageSize: 3};

let userType: number = 0;

function ProductList() {

    const [showProductModal, setShowProductModal] = React.useState<boolean>(false);
    const [productId, setProductId] = React.useState<string>("");
    const [storeId, setStoreId] = React.useState<string>("");
    const [queryProduct, setQueryProduct] = React.useState<IQueryProductPage>({count: 0, data: []});
    const [categoryNameList, setCategoryNameList] = useState<any[]>([]);
    const [productInfo, setProductInfo] = React.useState<ICreateProductParam>({
        description: "", id: "", name: "", price: 0, storeId: "", type: ""
    });
    const [myStoreId, setMyStoreId] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
    const [imageUrl, setImageUrl] = React.useState<string>("");
    const [token, setToken] = React.useState<any>({token: ""});

    useEffect(() => {
        setStoreId(store.getState().storeId);
        // if (store.getState().storeId) {
        //     queryProductData.storeId = store.getState().storeId;
        // }
        setToken({token: localStorage.getItem("token")});
        let tempQueryProductData = queryProductData;
        tempQueryProductData.storeId = store.getState().storeId;
        QueryProductListApi(tempQueryProductData).then((res: any) => {
            setQueryProduct(res);

        });
        UserInfoApi().then((res: any) => {
            userType = res.type;
        });
        QueryStoreApi().then((res: any) => {
            setMyStoreId(res.id);
        })
    }, [])

    let listData = queryProduct.data;

    // @ts-ignore
    const IconText = ({icon, text}) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const nameInputOnChange = (e: any) => {
        queryProductData.name = e.target.value;
    }

    const typeInputOnChange = (e: any) => {
        queryProductData.type = e.target.value;
    }

    const startPriceInputOnChange = (e: any) => {
        queryProductData.startPrice = e.target.value;
    }

    const endPriceInputOnChange = (e: any) => {
        queryProductData.endPrice = e.target.value;
    }

    const titleClick = (e: any) => {
        const action = {
            type: "toProductInfo",
            value: e,
        }
        store.dispatch(action);
    }

    const searchOnClick = () => {
        delete queryProductData.storeId;
        QueryProductListApi(queryProductData).then((res: any) => {
            setQueryProduct(res)
        });
    }

    const showProductModalOnClick = (id: string, firstImage: string | undefined) => {
        if (firstImage) {
            setImageUrl("http://localhost:8597/online/order/file/download/" + firstImage);
        }
        setShowProductModal(true);
        setProductId(id)
        if (id) {
            setTimeout(() => {
                let temp: any = listData.find((item => item.id === id));
                let tempStr: any = temp.type;
                temp.type = tempStr.split(",");
                form.setFieldsValue(temp);
            }, 100)
        } else {
            form.resetFields();
            setImageUrl("");
        }
        QueryCategoryList("").then((res: any) => {
            let tempArr: any[] = [];
            QueryCategoryList("").then((res: any) => {
                res.data.map((item: any) => {
                    tempArr.push(<Option key={item.name}>{item.name}</Option>);
                });
                setCategoryNameList(tempArr);
            })
        })
    }

    const handleShowProductModalCancel = () => {
        setShowProductModal(false);
        setProductId("");
    }

    let formRef: any = React.createRef()

    const [form] = Form.useForm();

    const {Option} = Select;

    const layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 10},
    };
    const tailLayout = {
        wrapperCol: {offset: 8, span: 16},
    };

    const onFinish = (values: any) => {
        QueryStoreApi().then((res: any) => {
            let tempParams: ICreateProductParam = values;
            tempParams.id = productId;
            tempParams.storeId = res.id;
            tempParams.type = values.type.join(",");
            CreateProduct(tempParams).then((res: any) => {
                if (tempParams.id) {
                    message.success("修改成功");
                } else {
                    message.success("新增成功");
                }
                setShowProductModal(false);
                setStoreId(store.getState().storeId);
                if (storeId) {
                    queryProductData.storeId = storeId;
                }
                let tempQueryProductData = queryProductData;
                tempQueryProductData.storeId = storeId;
                QueryProductListApi(tempQueryProductData).then((res: any) => {
                    setQueryProduct(res);
                });
                UserInfoApi().then((res: any) => {
                    userType = res.type;
                });
                form.resetFields();
            }).catch((err: any) => {
                if (tempParams.id) {
                    message.error("修改失败");
                } else {
                    message.error("新增失败");
                }
                setShowProductModal(false);
                setStoreId(store.getState().storeId);
                if (storeId) {
                    queryProductData.storeId = storeId;
                }
                let tempQueryProductData = queryProductData;
                tempQueryProductData.storeId = storeId;
                QueryProductListApi(tempQueryProductData).then((res: any) => {
                    setQueryProduct(res);
                });
                UserInfoApi().then((res: any) => {
                    userType = res.type;
                });
            })
        })
        console.log(values);
    };

    const onReset = () => {
        form.resetFields();
    };

    function beforeUpload(file: any) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传JPG/PNG文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片不能大于2M!');
        }
        return isJpgOrPng && isLt2M;
    }

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

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined/> : <PlusOutlined/>}
            <div style={{marginTop: 8}}>图片</div>
        </div>
    );

    return (
        <div className="product-list-box">
            <div className="search-input">
                <Space direction="vertical" size={10}>
                    <Input
                        placeholder="餐品名称"
                        onChange={nameInputOnChange}
                    />
                    <Input
                        placeholder="餐品类型"
                        onChange={typeInputOnChange}
                    />
                    <Input
                        placeholder="起始价格"
                        onChange={startPriceInputOnChange}
                    />
                    ~
                    <Input
                        placeholder="上限价格"
                        onChange={endPriceInputOnChange}
                    />
                    <Button type="primary" onClick={searchOnClick}>搜索</Button>
                    {
                        userType === 1 ? (
                            <div>
                                <Button type="primary" onClick={() => showProductModalOnClick("", "")}>新增商品</Button>
                                <Modal visible={showProductModal}
                                       title={productId ? "修改商品" : "新增商品"}
                                       footer={null}
                                       onCancel={handleShowProductModalCancel}>
                                    <Form {...layout}
                                          form={form}
                                          ref={formRef}
                                          name="control-hooks"
                                          onFinish={onFinish}>
                                        <Form.Item name="name" label="餐品名称"
                                                   rules={[{required: true, message: '请输入餐品名称'}]}>
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item name="type" label="餐品分类"
                                                   rules={[{required: true, message: '请选择餐品分类'}]}>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{width: '100%'}}
                                                placeholder="请选择分类"
                                            >
                                                {categoryNameList}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="price" label="餐品价格"
                                                   rules={[{required: true, message: '请输入餐品价格'}]}>
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item name="description" label="餐品描述" rules={[{required: false}]}>
                                            <Input/>
                                        </Form.Item>
                                        <Form.Item name="firstImage" label="餐品图片" rules={[{required: false}]}>
                                            <Upload
                                                name="multipartFile"
                                                listType="picture-card"
                                                className="avatar-uploader"
                                                showUploadList={false}
                                                action={"http://localhost:8597/online/order/product/uploadImage/" + productId}
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
                                        </Form.Item>
                                        <Form.Item {...tailLayout}>
                                            <Space>
                                                <Button type="primary" htmlType="submit">
                                                    确定
                                                </Button>
                                                <Button htmlType="button" onClick={onReset}>
                                                    重置
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                        ) : ""
                    }
                </Space>
            </div>
            <div className="list">
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            queryProductData.pageIndex = page;
                            QueryProductListApi(queryProductData).then((res: any) => {
                                setQueryProduct(res);
                            })
                        },
                        current: queryProductData.pageIndex,
                        total: queryProduct.count,
                        pageSize: queryProduct.data.length,
                        showSizeChanger: false
                    }}
                    dataSource={listData}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <IconText icon={LineChartOutlined} text={item.sales} key="list-vertical-star-o"/>
                            ]}
                            extra={
                                <img
                                    width={272}
                                    height={169}
                                    alt=""
                                    src={"http://localhost:8597/online/order/file/download/" + item.firstImage}
                                    defaultValue="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                    onError={(e: any) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                    }}
                                />
                            }
                        >
                            <List.Item.Meta
                                title={<a onClick={() => titleClick(item.id)}>{item.name}</a>}
                                description={item.description}
                            />
                            售价：{item.price} <br/>
                            分类：{item.type}
                            {
                                userType === 1 && myStoreId === item.storeId ? (
                                    <div style={{float: "right"}}>
                                        <Button type="primary" style={{marginLeft: "5px"}}
                                                onClick={() => showProductModalOnClick(item.id, item.firstImage)}>修改商品信息</Button>
                                        <Modal visible={showProductModal}
                                               title={productId ? "修改商品" : "新增商品"}
                                               footer={null}
                                               onCancel={handleShowProductModalCancel}>
                                            <Form {...layout}
                                                  form={form}
                                                  ref={formRef}
                                                  name="control-hooks"
                                                  onFinish={onFinish}>
                                                <Form.Item name="name" label="餐品名称"
                                                           rules={[{required: true, message: '请输入餐品名称'}]}>
                                                    <Input/>
                                                </Form.Item>
                                                <Form.Item name="type" label="餐品分类"
                                                           rules={[{required: true, message: '请选择餐品分类'}]}>
                                                    <Select
                                                        mode="multiple"
                                                        allowClear
                                                        style={{width: '100%'}}
                                                        placeholder="请选择分类"
                                                        // key={item.id}
                                                        // defaultValue={item.type.split(",")}
                                                        // onChange={handleChange}
                                                    >
                                                        {categoryNameList}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item name="price" label="餐品价格"
                                                           rules={[{required: true, message: '请输入餐品价格'}]}>
                                                    <Input/>
                                                </Form.Item>
                                                <Form.Item name="description" label="餐品描述" rules={[{required: false}]}>
                                                    <Input/>
                                                </Form.Item>
                                                <Form.Item name="firstImage" label="餐品图片" rules={[{required: false}]}>
                                                    <Upload
                                                        name="multipartFile"
                                                        listType="picture-card"
                                                        className="avatar-uploader"
                                                        showUploadList={false}
                                                        action={"http://localhost:8597/online/order/product/uploadImage/" + productId}
                                                        beforeUpload={beforeUpload}
                                                        onChange={handleChange}
                                                        headers={token}
                                                    >
                                                        {
                                                            imageUrl ?
                                                                <img src={imageUrl} alt="avatar"
                                                                     style={{width: '100%'}}/>
                                                                : uploadButton
                                                        }
                                                    </Upload>
                                                </Form.Item>
                                                <Form.Item {...tailLayout}>
                                                    <Space>
                                                        <Button type="primary" htmlType="submit">
                                                            确定
                                                        </Button>
                                                        <Button htmlType="button" onClick={onReset}>
                                                            重置
                                                        </Button>
                                                    </Space>
                                                </Form.Item>
                                            </Form>
                                        </Modal>
                                    </div>
                                ) : ""
                            }
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}

export default ProductList;