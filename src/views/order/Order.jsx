import React from 'react';
import {connect} from 'react-redux';
// import asyncComponent from '../../utils/asyncComponent';
import TopBar from '../../components/topBar/TopBar';
import OrderTabs from '../../components/tabs/OrderTabs';
import OrderContent from '../../components/orderContent/OrderContent';
import Footer from '../../components/footer/Footer';
import PropTypes from "prop-types";
import { getCartItems } from '../../utils/cartOperation';
import ajaxhost from '../../ajaxhost';
// const Footer = asyncComponent(() => import("../../components/footer/Footer"));

class Order extends React.Component{
    static childContextTypes = {
        showCartDotc: PropTypes.bool,
        updateCartDotc: PropTypes.func
    }

    constructor(props){
        super(props);
        this.state = {
            datas: [],
            lists: [],
            status: 0
        }
    }
    componentDidMount(){
        let that = this;
        let token = this.props.token;
        let value = sessionStorage.getItem('indexTab');
        if (value !== undefined && value !== null) {
            this.setState({
                status: parseInt(value,10)
            })
        }
        console.log(token);
        if (token == null) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        // else {
        //     console.log(token);
        // }
        fetch(ajaxhost+'/orders/', {
            headers: {
                "Ys-user": token
            },
            method: 'GET'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    console.log(result);
                    if(result.code === 200){
                        that.setState({
                            datas: result.data
                        }, function(){
                            that.getLists();
                        })
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
            // window.location.reload();
            console.log("------------------ERROR");
        })
        this.initialCartDoc();
    }

    getLists(){
        let {status, datas} = this.state;
        let lists = [];
        for(let i = 0; i < datas.length; i++){
            if(this.caculateState(datas[i]) === status){
                lists.push(datas[i]);
            }
        }
        this.setState({
            lists: lists
        })
    }
    caculateState(data){

        let state = 0;
        //2 未支付
        if(data.payStatus === 2){
            state = 0;
        }
        // 4是到货付款 5是提交退款 6退款成功 3到货付款申请退款
        //send是已确认
        if(data.payStatus === 1 || data.payStatus === 4 ){
            if(data.send !== 3){
                state = 1;
            }
            else{
                state = 2;
            }
        }else if(data.payStatus === 5|| data.payStatus === 3){
            state=1;
        }else if(data.payStatus === 6){
            state = 2;
        }
        return state;
    }
    changeTabs(index){
        this.setState({
            status: index
        }, function(){
            this.getLists();
        })
        sessionStorage.setItem('indexTab',index);
    }

    initialCartDoc() {
        var items = getCartItems();
        if ((items == null) || JSON.stringify(items) === '[]') {
            this.setState({
                showCartDotc: false
            })
        } else {
            this.setState({
                showCartDotc: true
            })
        }
    }
    updateCartDotc = value => {
        this.setState({
            showCartDotc: value
        })
    }

    getChildContext() {
        return {
            showCartDotc: this.state.showCartDotc,
            updateCartDotc: this.updateCartDotc
        }
    }

    render(){
        const {lists,status} = this.state;
        return (
            <div className="order">
                <TopBar title="我的订单"></TopBar>
                <OrderTabs index={status} changeTabs={this.changeTabs.bind(this)}></OrderTabs>
                <OrderContent datas={lists} ></OrderContent>
                <Footer></Footer>
            </div>
        );
    }
}
function mapStateToProps(state) {
    console.log(state);
    return {
      token: state.token
    };
  }

function mapDispatchToProps(dispatch, props) {
    return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Order);