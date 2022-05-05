import React, {useEffect} from "react";
import './less/MyCollapse.less';
import {Collapse, Card, Space} from 'antd';
import Laoba from '../assets/images/laoba.jpg';
import {QueryFirstPageStoreList} from "../request/api";
import FormDate from "../utils/DateUtils";

const {Meta} = Card;
const {Panel} = Collapse;

interface IStore {
    id: string;
    name: string;
    description: string;
}

let storeList: IStore[] = [];

class MyCollapse extends React.Component {

    state = storeList;

    componentWillMount() {
        QueryFirstPageStoreList().then((res: any) => {
            storeList = res;
            this.setState(storeList);
        });
    }

    render() {
        return (
            <Collapse accordion>
                <Panel header="人气商店" key="1">
                    <Space size={56}>
                        {
                            storeList.map(item =>
                                <Card
                                    hoverable
                                    style={{width: 240}}
                                    cover={<img alt="example" src={Laoba}/>}
                                >
                                    <Meta title={item.name} description={item.description}/>
                                </Card>)
                        }
                    </Space>
                </Panel>
                <Panel header="热销分类" key="2">
                    <p>{"text"}</p>
                </Panel>
                <Panel header="美味餐品" key="3">
                    <p>{"text"}</p>
                </Panel>
            </Collapse>
        )
    }
}

export default MyCollapse;