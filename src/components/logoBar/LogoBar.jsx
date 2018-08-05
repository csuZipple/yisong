import React from 'react';
import './logoBar.css'
import logo from '../../assets/img/logo.png';

class LogoBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            storeName: props.storeName,
            length: props.length
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            storeName: nextProps.storeName,
            length: nextProps.length
        })
    }
    choose(){
        this.props.choose();
    }
    render() {
        const {length} = this.state;
        return (
            <div className={["logo-bar", length === 0? "no-data": ""].join(" ")}>
                <div className="logo">
                    <img src={logo} alt=""/>
                </div>
                <div className="address" onClick={this.choose.bind(this)}>
                    <i className="iconfont icon-icon010 address-icon"></i>
                    <div className="address-title">您正在访问的门店为{this.state.storeName}</div>
                </div>
            </div>
        )
    }
}

export default LogoBar;