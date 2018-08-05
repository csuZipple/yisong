import React from 'react';
import './checkout.css';
import {message} from 'antd';
import {connect} from 'react-redux';
import {getCartItems} from '../../utils/cartOperation';
import ReturnBar from '../../components/returnBar/ReturnBar';
import CheckWay from '../../components/wayCheck/CheckWay';
import OrderItem from '../../components/orderItem/OrderItem';
import ReceiveMess from '../../components/receiveMess/ReceiveMess';
import AddrDialog from "../../components/dialog/AddrDialog";
import ajaxhost from '../../ajaxhost';
import  ErrorBoundary from "../../components/ErrorBoundary";
class Checkout extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            items: [],
            total: props.match.params.total,
            address: {},
            value: 1,
            note: "",
            show:false,
            storeLists:[],
            storeId: props.storeId,
        }
    }
    getAddress(token){
        let that = this;
        const promise = new Promise(function (resolve, reject) {
            this.setState({ storeId: localStorage.storeId });
            console.log("checkout token ", token);
            fetch(ajaxhost+'/addresses/', {
                headers: {
                    'Ys-user': token
                },
                method: 'GET'
            }).then((res) => {
                if (res.ok) {
                    res.json().then(function (result) {
                        if (result.code === 200) {
                            let data = result.data;
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].isDefault === 1) {
                                    that.setState({
                                        address: data[i]
                                    })
                                }
                            }
                            resolve(data);
                        }
                    })
                }
            }).catch((res) => {
                console.log(res);
                reject(res);
            })

        });
        return promise;
    }

    loadingItems(){
        return new Promise(function (resolve) {
            let arr = getCartItems();
            if(arr !== null){
                for (let i = 0; i < arr.length; i++) {
                    arr[i].price = arr[i].salePrice;
                }
            }
            resolve(arr);
        })
    }
    componentDidMount(){

        let that = this;
       this.loadingItems().then(function (value) {
           that.setState({
               items:value
           })
       })

        let token = this.props.token;
        let address = JSON.parse(localStorage.getItem("select"));
        console.log("test address == null");
        console.log(address);
        const { storeId } = this.state;
        if (storeId === "" || storeId === undefined) {
            this.setState({ storeId: localStorage.storeId });
            setTimeout(() => {
                message.loading("加载中")
            }, 1000);
        }
        if (address === null || address===undefined){
            console.log("checkout token ",token);
            fetch(ajaxhost+'/addresses/', {
                headers: {
                    'Ys-user': token
                },
                method: 'GET'
            }).then((res) => {
                if(res.ok){
                    res.json().then(function(result){
                        if(result.code === 200){
                            let data = result.data;
                            for(let i = 0; i < data.length; i++){
                                if(data[i].isDefault === 1){
                                    that.setState({
                                        address: data[i]
                                    })
                                }
                            }
                        }
                    })
                }
            }).catch((res) => {
                console.log(res);
            })
        }
        else{
            that.setState({
                address: address
            })
        }
    }
    onChangeNote(e){
        this.setState({
            note: e.target.value
        })
    }
    checkWay(value){
        this.setState({
            value: value
        })
    }
    selectStore(item) {
        this.setState({
            storeName: item.storeName,
            show: false,
            storeId: item.storeId
        }, function () {
            this.props.setStoreId(item.storeId);
            this.props.setStoreName(item.storeName);
        })
    }
    confirm(){
        // 结算页面点击之后的确定按钮的方法
        const {note, address, value, items} = this.state;
        let that = this;
        let token = this.props.token;
        // let storeId = this.props.storeId;
        // console.log(this.props.storeId);
        const {storeId} = this.state;
        let formData = new FormData();
        formData.append('note', note);
        formData.append('address_id', address.addressId);
        formData.append('store_id', storeId);
        formData.append('pay_type', value);
        let goods = [];
        for(let i = 0; i < items.length; i++){
            let obj = {
                goodsId: items[i].goodsId,
                count: items[i].count
            }
            goods.push(obj);
        }
        formData.append('order_items', JSON.stringify(goods));
        console.log(JSON.stringify(goods));
        fetch(ajaxhost+'/orders/', {
            headers: {
                'Ys-user': token,
            },
            method: 'POST',
            body: formData
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    if(result.code === 200){
                        if(value === 1){
                            //微信支付
                            let formData = new FormData();
                            let orderId = result.data;
                            formData.append('orderId', result.data)
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
                                            window.wx.ready(function(){
                                                window.wx.chooseWXPay({
                                                    // appId: data.appId,
                                                    timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                                    nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                                                    package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                                                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                                    paySign: data.paySign, // 支付签名
                                                    success: function (res) {
                                                        // 支付成功后的回调函数
                                                        if (res.errMsg === "chooseWXPay:ok") {
                                                            //支付成功
                                                            message.success("支付成功");
                                                            that.props.history.goBack();
                                                            localStorage.removeItem("select");
                                                            localStorage.removeItem("items");
                                                        } else {
                                                            //支付失败
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
                                                        localStorage.removeItem("select");
                                                        localStorage.removeItem("items");
                                                        let formData = new FormData();
                                                        formData.append('orderId', orderId);
                                                        fetch(ajaxhost+'/payments/orders/wepay/fail/', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Ys-user': token
                                                            },
                                                            body: formData
                                                        }).then((res) => {
                                                            if (res.ok) {
                                                                res.json().then(function (result) {
                                                                    console.log(result);
                                                                    if (result.code === 200) {
                                                                        message.success("订单成功关闭");
                                                                        // that.props.history.goBack();
                                                                    }
                                                                })
                                                            }
                                                        }).catch((res) => {
                                                            console.log(res);
                                                        });
                                                    }
                                                });
                                            })
                                        }
                                    })
                                }
                            }).catch((res) => {
                                console.log(res);
                            })
                        }
                        else if(value === 2){
                            //货到付款
                            let formData = new FormData();
                            formData.append('orderId', result.data)
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
                                            localStorage.removeItem("select");
                                            localStorage.removeItem("items");
                                        }
                                    })
                                }
                            }).catch((res) => {
                                console.log(res);
                            })
                        }
                    }
                    else if(result.code === 400){
                        console.log(storeId);
                        message.warning(result.message);
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }

    render(){
        const {items, total, address, note,show,storeLists} = this.state;
        const Dialog = show ? <AddrDialog data={storeLists} selectStore={this.selectStore.bind(this)} hideMess={val => { this.setState({ show: val }) }}></AddrDialog> : "";
        return(
            <div className="check-out">
                <ReturnBar title="结算" type="checkout"></ReturnBar>
                <ReceiveMess address={address} type="check"></ReceiveMess>
                <ErrorBoundary><OrderItem lists={items} total={total}></OrderItem></ErrorBoundary>
                <div className="note">
                    <div className="order-title border">备注</div>
                    <div className="note-input">
                        <textarea className="input textarea" onChange={this.onChangeNote.bind(this)} placeholder="添加备注" value={note}></textarea>
                    </div>
                </div>
                <CheckWay checkWay={this.checkWay.bind(this)}></CheckWay>
                <div className="btn-register">
                    <div className="register" onClick={this.confirm.bind(this)}>确定</div>
                </div>
                {Dialog}
            </div>
        )
    }
}

function mapStateToProps(state,ownProps) {
    console.log("test mapStateToProps storeId");
    // console.log(state.storeId);
    return {
      token: state.token,
      storeId: state.storeId
    };
  }

function mapDispatchToProps(dispatch, props) {
    return {
        setStoreId(storeId) {
            console.log("cartContainer set storeId");
            // alert(storeId);
            dispatch({
                type: 'SET_STORE',
                storeId: storeId
            })
        },
        setStoreName(storeName) {
            dispatch({
                type: 'SET_STORE_NAME',
                storeName: storeName
            })
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Checkout);