import React from 'react';
import './footer.css';
import {NavLink} from 'react-router-dom';
import CartContainer from '../cart/CartContainer';
import PropTypes from "prop-types";

class Footer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            display: false,
            // showDot:false
        }
    }
    static contextTypes = {
        showCartDotc: PropTypes.bool,
    }

    showCart(){
        this.setState({
            display: true
        })
    }
    hideCart(){
        this.setState({
            display: false
        })
    }
    render(){
        const {display} = this.state;
        var showDot = this.context.showCartDotc;
        // console.log("showDot:"+showDot);
        const Dialog = display ? <CartContainer show={display} hideDetail={val => { this.setState({ display: val }) }} ></CartContainer> : "";
        return (
            <div className="footer">
                <div className="footer-div">
                    <NavLink activeClassName="active" className={["nav", display? "no-active": ""].join(" ")} to="/home" onClick={this.hideCart.bind(this)}> <i className="iconfont icon-home footer-icon"></i> <span className="title">首页</span></NavLink>
                    {/* <div className={["nav", display ? "active" : ""].join(" ")} onClick={this.showCart.bind(this)}><i className="iconfont icon-iconfontcart footer-icon"><span className={showDot ? "icon-tip" : ""}></span></i> <span className="title">购物车</span></div> */}
                    <div className={["nav", display ? "active" : ""].join(" ")} onClick={this.showCart.bind(this)}><i className="iconfont icon-iconfontcart footer-icon"><span className={showDot ? "icon-tip" : ""}></span></i> <span className="title">购物车</span></div>
                    <NavLink activeClassName="active" className={["nav", display? "no-active": ""].join(" ")} to="/order" onClick={this.hideCart.bind(this)}><i className="iconfont icon-order footer-icon"></i> <span className="title">我的订单</span></NavLink>
                    <NavLink activeClassName="active" className={["nav", display? "no-active": ""].join(" ")} to="/user" onClick={this.hideCart.bind(this)}><i className="iconfont icon-geren footer-icon"></i> <span className="title">个人中心</span></NavLink>
                </div>
                {Dialog}
            </div>
        )
    }
}

export default Footer;