import React, {useEffect} from 'react';
import {Button, Layout, Space} from 'antd';
import MyHeader from './componments/MyHeader';
import MyCarousel from './componments/MyCarousel';
import MyCollapse from './componments/MyCollapse';
import './Base.less'
import './App.less'
import ProductInfo from "./componments/ProductInfo";
import OrderInfo from "./componments/OrderInfo";
import store from "./store";
import ProductList from "./componments/ProductList";
import {UserInfoApi} from "./request/api";
import DefaultAvatar from "./assets/images/defaultAvatar.png";
import StoreInfo from "./componments/StoreInfo";

const {Content, Footer} = Layout;

function App() {

    const [menuKey, setMenuKey] = React.useState(1);
    const [productId, setProductId] = React.useState("");
    const [showProduct, setShowProduct] = React.useState(false);

    const contentView = () => {
        if (showProduct) {
            return (<ProductInfo/>);
        }
        if (menuKey == 3) {
            return (<ProductList/>);
        } else if (menuKey == 4) {
            return (<OrderInfo/>);
        } else if (menuKey == 5) {
            return (<StoreInfo/>);
        } else if (menuKey == 6) {
            return (<ProductList/>);
        } else {
            return (<div><MyCarousel/><MyCollapse/></div>);
        }
    }

    store.subscribe(() => {
        setMenuKey(store.getState().menuKey);
        setProductId(store.getState().productId);
    })

    useEffect(() => {
    }, [menuKey])

    useEffect(() => {
        if (productId) {
            setShowProduct(true);
        } else {
            setShowProduct(false);
        }
    }, [productId])

    useEffect(() => {
    }, [showProduct])

    return (
        <Layout className="container">
            <MyHeader/>
            <Content style={{padding: '0 50px'}}>
                <div className="site-layout-content">
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        {
                            contentView()
                        }
                    </Space>
                </div>
            </Content>
            <Footer style={{textAlign: 'center', backgroundColor: '#001529', color: '#fff'}}>Ant Design ©2018 Created by
                Ant UED</Footer>
        </Layout>
    );
}

export default App;