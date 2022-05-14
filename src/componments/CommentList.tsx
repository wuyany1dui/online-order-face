import './less/OrderInfo.less';
import {Button, Comment, Divider, List, message, Modal, Space, Tooltip} from "antd";
import FormDate from "../utils/DateUtils";
import erweima from "../assets/images/erweima.png";
import moment from "moment";
import {DeleteComment, QueryCommentList, QueryOrderListApi} from "../request/api";
import React, {useEffect} from "react";

interface IQueryCommentParam {
    pageIndex: number;
    pageSize: number;
}

interface IComment {
    id: string;
    userId: string;
    username: string;
    nickname: string;
    orderId: string;
    content: string;
    createTime: number | Date;
}

export default function CommentList() {

    const [listData, setListData] = React.useState<IComment[]>([]);
    const [queryCommentParams, setQueryCommentParams] =
        React.useState<IQueryCommentParam>({pageIndex: 1, pageSize: 3});
    const [listDataCount, setListDataCount] = React.useState<number>(0);
    const [commentId, setComment] = React.useState<string>("");
    const [showCheckDelete, setShowCheckDelete] = React.useState<boolean>(false);

    const deleteClick = (id: string) => {
        setComment(id);
        setShowCheckDelete(true);
    }

    const handleCheckDeleteCancel = () => {
        setShowCheckDelete(false);
    }

    const checkDelete = () => {
        let tempArr: string[] = [commentId];
        DeleteComment(tempArr).then((res: any) => {
            message.success("删除成功");
            setShowCheckDelete(false);
            QueryCommentList("?pageIndex=" + queryCommentParams.pageIndex +
                "&pageSize=" + queryCommentParams.pageSize)
                .then((res: any) => {
                    setListDataCount(res.count);
                    setListData(res.data);
                })
        }).catch((err: any) => {
            message.error("删除失败");
            setShowCheckDelete(false);
            QueryCommentList("?pageIndex=" + queryCommentParams.pageIndex +
                "&pageSize=" + queryCommentParams.pageSize)
                .then((res: any) => {
                    setListDataCount(res.count);
                    setListData(res.data);
                })
        })
    }

    useEffect(() => {
        QueryCommentList("?pageIndex=" + queryCommentParams.pageIndex +
            "&pageSize=" + queryCommentParams.pageSize)
            .then((res: any) => {
                setListDataCount(res.count);
                setListData(res.data);
            })
    }, [])

    return (
        <div className="order-box">
            <Space direction="vertical">
                <div className="title">
                    <Divider type="vertical" orientation="center">用户评论</Divider>
                </div>
                <div className="list">
                    <List
                        size="large"
                        bordered
                        dataSource={listData}
                        renderItem={item =>
                            <List.Item>
                                <div>
                                    订单编号：{item.orderId} <br/>
                                    用户名：{item.username} <br/>
                                    用户昵称：{item.nickname} <br/>
                                    评论内容：{item.content} <br/>
                                    订单创建时间：{FormDate(new Date(item.createTime))}
                                </div>
                                <div>
                                    <Button type="primary" onClick={() => deleteClick(item.id)}>删除</Button>
                                    <Modal visible={showCheckDelete}
                                           title="确认是否删除"
                                           footer={null}
                                            onCancel={handleCheckDeleteCancel}>
                                        <Button type="primary" onClick={checkDelete}>确认删除</Button>
                                    </Modal>
                                </div>
                            </List.Item>}
                        pagination={{
                            current: queryCommentParams.pageIndex,
                            total: listDataCount,
                            pageSize: queryCommentParams.pageSize,
                            onChange: page => {
                                setQueryCommentParams({pageIndex: page, pageSize: 3})
                                QueryCommentList("?pageIndex=" + queryCommentParams.pageIndex +
                                    "&pageSize=" + queryCommentParams.pageSize)
                                    .then((res: any) => {
                                        setListDataCount(res.count);
                                        setListData(res.data);
                                    })
                            }
                        }}
                    />
                </div>
            </Space>
        </div>
    )
}