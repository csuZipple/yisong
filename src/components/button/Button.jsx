import React from 'react';
import './button.css';
import { Popconfirm } from 'antd';
class Button extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            status: props.status
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            status: nextProps.status
        })
    }
    confirmOrder(type){
        this.props.confirmOrder(type);
    }
    cancel(e) {
        console.log(e);
    }
    render(){
        const {status} = this.state;
        let BtnContent;let tip ="";
        if(status === 0){
            BtnContent = <div className="pay-btn" onClick={this.confirmOrder.bind(this, "pay")}>立即支付</div>;
        }
        else if(status === 1){
            BtnContent = <div className="pay-btn" onClick={this.confirmOrder.bind(this, "confirm")}>立即确认</div>;
        }else if(status === 11 || status === 13){
            BtnContent =
            <Popconfirm title="确定删除订单?" onConfirm={this.confirmOrder.bind(this,"delete")} onCancel={this.cancel.bind(this)} okText="确定" cancelText="取消">
                    <div className="delete-btn helper">删除订单</div>
            </Popconfirm>;
        }else if(status === 8){
            BtnContent = <div className="delete-btn">正在取消中</div>;
        }else if(status === 14){
            BtnContent =
                <Popconfirm title="确定删除订单?" onConfirm={this.confirmOrder.bind(this, "delete")} onCancel={this.cancel.bind(this)} okText="确定" cancelText="取消">
                    <div className="delete-btn">删除订单</div>
                </Popconfirm>;
            tip = <p className="tip">订单已关闭</p>
        }
        else{
            BtnContent = "";
        }
        let returnB;
        if (BtnContent !== "") {
            returnB = <div className="order-opera">
            {tip}
                <div className="pay-order">
                    {BtnContent}
                </div>
            </div>
        }else{
            returnB = <div>{BtnContent}</div>
        }
        return(
           returnB
        )
    }
}

export default Button;