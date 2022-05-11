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
import StoreList from "./componments/StoreList";
import UserList from "./componments/UserList";
import CategoryList from "./componments/CategoryList";
import CommentList from "./componments/CommentList";

const {Content, Footer} = Layout;

function App() {

    const [menuKey, setMenuKey] = React.useState(1);
    const [productId, setProductId] = React.useState("");
    const [showProduct, setShowProduct] = React.useState(false);
    const [storeId, setStoreId] = React.useState("");
    const [showProductList, setShowProductList] = React.useState(false);
    const [userType, setUserType] = React.useState(0);

    const contentView = () => {
        if (showProduct) {
            return (<ProductInfo/>);
        }
        if (showProductList) {
            return (<ProductList/>);
        }
        if (menuKey == 1 && userType == 2) {
            return (<UserList/>);
        }
        if (menuKey == 2 && userType == 2) {
            return (<CategoryList/>);
        }
        if (menuKey == 3 && userType == 2) {
            return (<StoreList/>);
        }
        if (menuKey == 4 && userType == 2) {
            return (<ProductList/>);
        }
        if (menuKey == 5 && userType == 2) {
            return (<OrderInfo/>);
        }
        if (menuKey == 6 && userType == 2) {
            return (<CommentList/>);
        }
        if (menuKey == 2) {
            return (<StoreList/>);
        } else if (menuKey == 3) {
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
        setStoreId(store.getState().storeId);
        setProductId(store.getState().productId);
    })

    useEffect(() => {
        setStoreId("");
        setProductId("");
        UserInfoApi().then((res: any) => {
            setUserType(res.type);
        }).catch((err) => {
            localStorage.removeItem("token");
        })
    }, [menuKey])

    useEffect(() => {
        if (productId) {
            setShowProduct(true);
        } else {
            setShowProduct(false);
        }
    }, [productId])

    useEffect(() => {
        if (storeId) {
            setShowProductList(true);
        } else {
            setShowProductList(false);
        }
    }, [storeId])

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