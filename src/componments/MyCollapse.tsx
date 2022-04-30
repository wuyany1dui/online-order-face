import React from "react";
import './less/MyCollapse.less';
import { Collapse, Card, Space } from 'antd';
import Laoba from '../assets/images/laoba.jpg';

const { Meta } = Card;
const { Panel } = Collapse;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

let testArr: number[] = [];
for (var i = 0; i < 6; i++) {
    testArr.push(i);
}

export default function MyCollapse() {
    return (
        <Collapse accordion>
            <Panel header="人气商店" key="1">
                <Space size={56}>
                    {
                        testArr.map(item =>
                            <Card
                                hoverable
                                style={{ width: 240 }}
                                cover={<img alt="example" src={Laoba} />}
                            >
                                <Meta title={"item"} description="item" />
                            </Card>)
                    }
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={Laoba} />}
                    >
                        <Meta title="老八の店" description="一日三餐没烦恼" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={Laoba} />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={Laoba} />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={Laoba} />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={Laoba} />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={Laoba} />}
                    >
                        <Meta title="Europe Street beat" description="www.instagram.com" />
                    </Card>
                </Space>
            </Panel>
            <Panel header="热销分类" key="2">
                <p>{text}</p>
            </Panel>
            <Panel header="美味餐品" key="3">
                <p>{text}</p>
            </Panel>
        </Collapse>
    )
}