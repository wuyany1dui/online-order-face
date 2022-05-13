import React, {useEffect} from "react";
import './less/MyCollapse.less';
import {Collapse, Card, Space} from 'antd';
import Laoba from '../assets/images/laoba.jpg';
import {QueryFirstPageProductList, QueryFirstPageStoreList} from "../request/api";
import FormDate from "../utils/DateUtils";
import store from "../store";

const {Meta} = Card;
const {Panel} = Collapse;

interface IStore {
    id: string;
    name: string;
    description: string;
}

interface IProduct {
    id: string;
    name: string;
    price: number;
    description?: string;
    sales: number;
    firstImage?: string;
    type: string | string[];
    storeId: string;
}

export default function MyCollapse() {

    const [storeList, setStoreList] = React.useState<IStore[]>([]);
    const [productList, setProductList] = React.useState<IProduct[]>([]);

    useEffect(() => {
        QueryFirstPageStoreList().then((res: any) => {
            setStoreList(res);
        });
        QueryFirstPageProductList().then((res: any) => {
            setProductList(res);
        })
    }, [])

    const storeOnClick = (id: string) => {
        const action = {
            type: "toProductList",
            value: id,
        }
        store.dispatch(action);
    }

    const productOnClick = (e: any) => {
        const action = {
            type: "toProductInfo",
            value: e,
        }
        store.dispatch(action);
    }

    return (
        <Collapse accordion>
            <Panel header="人气商店" key="1">
                <Space size={56}>
                    {
                        storeList.map(item =>
                            <Card
                                hoverable
                                style={{width: 240}}
                                onClick={() => storeOnClick(item.id)}
                                // cover={<img alt="example" src={Laoba}/>}
                            >
                                <Meta title={item.name} description={item.description}/>
                            </Card>)
                    }
                </Space>
            </Panel>
            <Panel header="美味餐品" key="3">
                <Space size={56}>
                    {
                        productList.map(item =>
                            <Card
                                hoverable
                                style={{width: 240}}
                                cover={
                                    <img alt="example"
                                         defaultValue="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                         onError={(e: any) => {
                                             e.target.onerror = null;
                                             e.target.src = "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                         }}
                                         src={"http://localhost:8597/online/order/file/download/" + item.firstImage}/>
                                }
                                onClick={() => productOnClick(item.id)}
                            >
                                <Meta title={item.name} description={item.description}/>
                            </Card>)
                    }
                </Space>
            </Panel>
        </Collapse>
    );
}