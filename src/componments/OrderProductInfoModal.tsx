import React from "react";
import {Button, Modal} from "antd";


class OrderProductInfoModal extends React.Component {

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
        this.setState({visible: false});
    };

    render() {

        const {visible, loading} = this.state;

        return (
            <div>
                <Button type="primary" onClick={this.showModal}>
                    查看订单内容
                </Button>
                <Modal visible={visible}
                       title="订单内容"
                       footer={null}
                       onCancel={this.handleCancel}>

                </Modal>
            </div>
        );
    }
}

export default OrderProductInfoModal;