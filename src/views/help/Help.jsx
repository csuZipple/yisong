import React from 'react';
import '../user/user.css';
// import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import asyncComponent from '../../utils/asyncComponent';
import TopBar from '../../components/topBar/TopBar';
import { getCartItems } from '../../utils/cartOperation';
import PropTypes from "prop-types";
const Footer = asyncComponent(() => import("../../components/footer/Footer"));

class Help extends React.Component{
    static childContextTypes = {
        showCartDotc: PropTypes.bool,
        updateCartDotc: PropTypes.func
    }

    constructor(props){
        super(props);
        this.state = {
            items: [
                {
                    name: "用户协议",
                    id:1
                },
                {
                    name: "手机定位失败怎么办",
                    id: 2
                },
                {
                    name: "支付订单如何取消",
                    id: 3
                }
            ],
            path:"/help/helpDetail"
        }
    }
    componentDidMount(){
        this.initialCartDoc();
    }
    initialCartDoc(){

        var items = getCartItems();
        if (items != null) {
            this.setState({
                showCartDotc: true
            })
        } else {
            this.setState({
                showCartDotc: false
            })
        }

    }
    updateCartDotc = value =>{
        this.setState({
            showCartDotc:value
        })
    }

    getChildContext() {
        return {
            showCartDotc:this.state.showCartDotc,
            updateCartDotc: this.updateCartDotc
        }
    }
    render(){
        const {items,path} = this.state;
        return (
            <div className="user">
                <TopBar title="帮助中心"></TopBar>
                <div className="user-content">
                    {
                        items.map((item, index) => (
                            <Link className="user-item" to={path+"/"+item.id} key={index}>
                                <div className="item-title">{item.name}</div>
                                <i className="iconfont icon-left1 left-icon"></i>
                            </Link>
                        ))
                    }
                </div>
                <Footer></Footer>
            </div>
        );
    }
}

export default Help;