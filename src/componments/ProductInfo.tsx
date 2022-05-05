import React, {createElement, useState} from 'react';
import {Comment, Tooltip, Avatar, Radio, Carousel, Space, Image, Descriptions, Button, Input} from 'antd';
import moment from 'moment';
import "./less/ProductInfo.less";
import Logo from '../assets/images/logo.jpg';
import Laoba from '../assets/images/laoba.jpg';
import { PlusOutlined } from '@ant-design/icons';

function ProductInfo() {

    const [dotPosition, setDotPosition] = React.useState('top');
    const [visible, setVisible] = useState(false);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [action, setAction] = useState("");

    return (
        <div className="product-box">
            <Space direction="vertical">
                <Space>
                    <Image
                        preview={{ visible: false }}
                        width={200}
                        src={Laoba}
                        onClick={() => setVisible(true)}
                    />
                    <div style={{marginLeft: "20px"}}>
                        <Space>
                            <Descriptions title="餐品信息" column={{xs: 10, sm: 10, md: 1}}>
                                <Descriptions.Item label="名称">小汉堡</Descriptions.Item>
                                <Descriptions.Item label="描述">test123</Descriptions.Item>
                                <Descriptions.Item label="价格">13.99</Descriptions.Item>
                                <Descriptions.Item label="销量">1000</Descriptions.Item>
                            </Descriptions>
                            <Space direction="vertical">
                                <Button type="primary" icon={<PlusOutlined />} size="large">
                                    加入订单
                                </Button>
                                <Input placeholder="数量" />
                            </Space>
                        </Space>
                    </div>
                </Space>
                <Comment
                    author={<a>DrEAmSs59</a>}
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo"/>}
                    content={
                        <p>
                            东西很好吃，孩子很喜欢
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                        </Tooltip>
                    }
                />
            </Space>
        </div>
    );
}

export default ProductInfo;
