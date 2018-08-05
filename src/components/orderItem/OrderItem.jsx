import React from 'react';
import './orderItem.css';
import {message} from 'antd'
import ajaxhost from '../../ajaxhost';

class OrderItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lists: props.lists,
            total: props.total,
            status: props.status,
            canceled:props.canceled
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            lists: nextProps.lists,
            total: nextProps.total,
            status: nextProps.status,
            canceled:nextProps.canceled
        })
        console.log("OrderItem");
        console.log(this.state.canceled);
    }
    // componentDidMount(){
    //     let lists = this.state.lists;
    //     if (JSON.stringify(this.state.lists) === "[]"||this.state.lists===null) {
    //         this.setState({
    //             lists:lists.push("")
    //         })
    //     }
    //     alert(this.state.lists);
    // }
    toCancel(){
        let token = this.props.token;
        let that = this;
        let orderId = this.props.orderId;
        let formData = new FormData();
        formData.append('orderId', orderId);
        fetch(ajaxhost+'/payments/orders/refund/', {
            headers: {
                "Ys-user": token
            },
            method: 'POST',
            body: formData
        }).then((res) => {
            if (res.ok) {
                res.json().then(function (result) {
                    if (result.code === 200) {
                        message.success("已发送取消申请，店家会尽快处理~");
                        that.props.updateCancel();
                        that.setState({
                            canceled: true
                        });
                        // that.props.history.push('/order');
                        window.location.replace('/order');
                    }else if(result.code === 400){
                        message.error(result.message);
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    render(){
        const {lists, total, status,canceled} = this.state;
        let Cancle;
        console.log("OrderItem:"+canceled);
        if(status === 1){
            if (canceled) {
                Cancle = <div className="cancled">正在取消中</div>
            }else{
                Cancle = <div className="cancle" onClick={this.toCancel.bind(this)}>取消订单</div>
            }
        }
        else{
            Cancle = "";
        }
        let orderitems;
        if ((JSON.stringify(this.state.lists) === "[]")||this.state.lists===null||this.state.lists === undefined) {
            orderitems = "";
        }else{
            orderitems = lists.map((list, index) => (
                <div className="order-item border" key={index}>
                    <div className="order-first">
                        <div className="item-name">{list.goodsName}</div>
                        <div className="count">x{list.count}</div>
                    </div>
                    <div className="item-price">¥{(list.price*list.discount).toFixed(2)}</div>
                </div>
            ))
        }
        return(
            <div className="order-items">
                <div className="order-title border">商品列表</div>
                {orderitems}
                <div className={["order-total", status === 1? "cancle-order": ""].join(" ")}>
                    {Cancle}
                    <div className="total">
                        合计： <span className="item-price">¥{total}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default OrderItem;