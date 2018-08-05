import React from 'react';
import './user.css';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import asyncComponent from '../../utils/asyncComponent';
import TopBar from '../../components/topBar/TopBar';
import UserTop from '../../components/userTop/UserTop';
import { getCartItems } from '../../utils/cartOperation';
import PropTypes from "prop-types";
import ajaxhost from '../../ajaxhost';

const Footer = asyncComponent(() => import("../../components/footer/Footer"));

class User extends React.Component{
    static childContextTypes = {
        showCartDotc: PropTypes.bool,
        updateCartDotc: PropTypes.func
    }

    constructor(props){
        super(props);
        this.state = {
            user: {},
            items: [
                {
                    name: "地址管理",
                    path: "/user/addrManage"
                },
                {
                    name: "会员充值",
                    path: "/user/recharge"
                },
                {
                    name: "取消绑定",
                    path: "/user/cancelBind"
                }
            ]
        }
    }
    componentDidMount(){
        let token = this.props.token;
        let that = this;
        if (token == null) {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        // else{
        //     console.log(token);
        // }
        // alert(token);
        fetch(ajaxhost+'/users/weixin/info/', {
            headers: {
                "Ys-user": token
            },
            method: 'GET'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    if(result.code === 200){
                        that.setState({
                            user: result.data.user
                        })
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
            // alert("error");
        })
        this.initialCartDoc();
        sessionStorage.clear();
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
        const {items, user} = this.state;
        // alert(user.name);
        return (
            <div className="user">
                <TopBar title="个人中心"></TopBar>
                <div className="mess-top">
                    <UserTop user={user}></UserTop>
                </div>
                <div className="user-content">
                    {
                        items.map((item, index) => (
                            <Link className="user-item" to={item.path} key={index}>
                                <div className="item-title">{item.name}</div>
                                <i className="iconfont icon-left1 left-icon"></i>
                            </Link>
                        ))
                    }
                    <Link className="user-item help-item" to="/help">
                        <div className="item-title">帮助中心</div>
                        <i className="iconfont icon-left1 left-icon"></i>
                    </Link>
                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(User);