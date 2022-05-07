import React from "react";
import {Button, List, Modal, Space} from "antd";
import {QueryProductListApi} from "../request/api";
import {LineChartOutlined} from "@ant-design/icons";
import "./less/OrderProductInfoModal.less";

class OrderProductInfoModal extends React.Component {

    state = {
        loading: false,
        visible: false,
        orderId: ""
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({visible: false});
    };


    render() {

        // @ts-ignore
        const IconText = ({icon, text}) => (
            <Space>
                {React.createElement(icon)}
                {text}
            </Space>
        );

        const {visible, loading} = this.state;

        let listData = [1, 2];

        return (
            <div className="order-product-info-modal-box">
                <Button type="primary" onClick={this.showModal}>
                    查看订单内容
                </Button>
                <div className="modal">
                    <Modal visible={visible}
                           title="订单内容"
                           footer={null}
                           onCancel={this.handleCancel}>
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={listData}
                            renderItem={item => (
                                <List.Item
                                    key={item}
                                    extra={
                                        <img
                                            width={272}
                                            alt="logo"
                                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                        />
                                    }
                                >
                                    <List.Item.Meta
                                        title={item}
                                        description={item}
                                    />
                                    售价：{this.props.toString()} <br/>
                                    {/*{*/}
                                    {/*    userType === 1 ? (<Button type="primary">修改商品信息</Button>) : ""*/}
                                    {/*}*/}
                                </List.Item>
                            )}
                        />
                    </Modal>
                </div>
            </div>
        );
    }
}

export default OrderProductInfoModal;