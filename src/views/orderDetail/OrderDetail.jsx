import React from 'react';
import {connect} from 'react-redux';
import {message} from 'antd';
import './orderDetail.css';
import CheckWay from '../../components/wayCheck/CheckWay';
import ReturnBar from '../../components/returnBar/ReturnBar';
import OrderState from '../../components/orderState/OrderState';
import ReceiveMess from '../../components/receiveMess/ReceiveMess';
import OrderItem from '../../components/orderItem/OrderItem';
import Button from '../../components/button/Button';
import ajaxhost from '../../ajaxhost';

class OrderDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            status: 0,
            data: {},
            value: 1,
            canceled:0,
            cancel:false,
            doneCan:0
            // showP:false
        }
    }
    componentDidMount(){
        let that = this;
        let token = this.props.token;
        let orderId = this.props.match.params.orderId;
        fetch(ajaxhost+'/orders/' + orderId, {
            headers: {
                "Ys-user": token
            },
            method: 'GET'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    if(result.code === 200){
                        that.setState({
                            data: result.data
                        }, function(){
                            that.caculateState();
                        })
                        // console.log(result.data,"---------------------------");
                        // console.log(that.state.data.order.dicount);
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    componentDidUpdate(){
        return true;
    }
    caculateState(){
        let payStatus = this.state.data.order.payStatus;
        let send = this.state.data.order.send;
        let state = 0;
        if(payStatus === 2){
            state = 0;
        }
        else if (payStatus === 1 || payStatus === 4) {
            if (send !== 3) {
                state = 1;
            }
            else {
                state = 2;
            }
        } else if (payStatus === 5|| payStatus === 3) {
            state = 1;
            this.updateCancel();
        } else if (payStatus === 6) {
            state = 2;
            this.setState({
                doneCan:1
            })
        }
        this.setState({
            status: state
        })
    }
    checkWay(value){
        this.setState({
            value: value
        })
    }
    confirmOrder(type){

        let that = this;
        let token = this.props.token;
        let orderId = this.props.match.params.orderId;
        if(type === "confirm"){
            fetch(ajaxhost+'/orders/confirmed/' + orderId, {
                headers: {
                    "Ys-user": token
                },
                method: 'PUT'
            }).then((res) => {
                if(res.ok){
                    res.json().then(function(result){
                        if(result.code === 200){
                            message.success("订单确认成功");
                            that.props.history.push('/order');
                        }
                    })
                }
            }).catch((res) => {
                console.log(res);
            })
        }else if(type === "delete"){
            // 删除订单

            fetch(ajaxhost+'/orders/' + orderId, {
                method: 'DELETE',
                headers: {
                    'Ys-user': token
                }
            }).then((res) => {
                if (res.ok) {
                    res.json().then(function (result) {
                        console.log(result);
                        if (result.code === 200) {
                            message.success("订单删除成功");
                            that.props.history.push('/order');
                        }
                    })
                }
            }).catch((res) => {
                console.log(res);
            });
        }
        else{
            //支付订单
            const {value} = this.state;
            let formData = new FormData();
            formData.append('orderId', orderId);
            if(value === 1){
                //微信支付
                fetch(ajaxhost+'/payments/orders/wepay/', {
                    headers: {
                        'Ys-user': token
                    },
                    method: 'POST',
                    body: formData
                }).then((res) => {
                    if(res.ok){
                        res.json().then(function(result){
                            if(result.code === 200){
                                let data = result.data;
                                // alert("res.ok")
                                // window.wx.ready(function () {
                            window.wx.chooseWXPay({
                                // appId: "wxe80557e8ca49c4b9",
                                // appId: data.appId,
                                timestamp: data.timeStamp,
                                // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                                package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                                signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                paySign: data.paySign, // 支付签名
                                success: function (res) {
                                    // 支付成功后的回调函数
                                    if (res.errMsg === "chooseWXPay:ok") {
                                        //支付成功
                                        message.success("下单成功");
                                        that.history.goBack();
                                        // localStorage.removeItem("select");
                                        // localStorage.removeItem("items");
                                    } else {
                                        message.warning(res.errMsg);
                                    }
                                },
                                fail: function (err) {
                                    console.log("err");
                                    message.error("支付失败，请重试");
                                },
                                cancel: function (res) {
                                    //支付取消
                                    message.info("订单取消");
                                }
                            });
                        //   })
                         }
                        })
                    }
                }).catch((res) => {
                    console.log(res);
                })
            }
            else if(value === 2){
                //货到付款
                fetch(ajaxhost+'/payments/orders/arrivepay/', {
                    headers: {
                        'Ys-user': token
                    },
                    method: 'POST',
                    body: formData
                }).then((res) => {
                    if(res.ok){
                        res.json().then(function(result){
                            if(result.code === 200){
                                message.success("下单成功");
                                that.props.history.goBack();
                            }
                        })
                    }
                }).catch((res) => {
                    console.log(res);
                })
            }
        }
    }

    updateCancel(){
        this.setState({
            canceled:7,
            cancel:true
        });
    }
    render(){
        const {data, status,canceled,cancel,doneCan} = this.state;
        if(JSON.stringify(data) === "{}" || data.items === null){
            return(
                <div></div>
            )
        }
        else{
            return(
                <div className="order-detail">
                    <ReturnBar title="订单详情"></ReturnBar>
                    <OrderState status={status} ></OrderState>
                    <ReceiveMess address={data.address}></ReceiveMess>
                    <OrderItem lists={data.items} total={data.order.price} orderDiscount={data.order.dicount} status={status} canceled={cancel} token={this.props.token} orderId={this.props.match.params.orderId} updateCancel={this.updateCancel.bind(this)}></OrderItem>
                    {console.log(status)}
                    {console.log(cancel)}
                    <div className="note">
                        <div className="order-title border">备注</div>
                        <div className="note-input">
                            {data.order.note}
                        </div>
                    </div>
                    <CheckWay type="show" payStatus={data.order.payStatus} status={status} checkWay={this.checkWay.bind(this)}></CheckWay>
                    <Button status={status+canceled} confirmOrder={this.confirmOrder.bind(this)}></Button>
                    {/* <Button status={status} confirmOrder={this.confirmOrder.bind(this)}></Button> */}
                    <Button status={status + 11+doneCan} confirmOrder={this.confirmOrder.bind(this)}></Button>

                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
      token: state.token
    };
  }

function mapDispatchToProps(dispatch, props) {
    return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);