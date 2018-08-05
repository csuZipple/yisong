import React from 'react';
import './recharge.css';
import  {Input, Radio}  from  'antd';
import ReturnBar from '../../components/returnBar/ReturnBar';

const RadioGroup = Radio.Group;

class Recharge extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            balance: "",
            value: 1
        }
    }
    onChangeBa(e){
        this.setState({
            balance: e.target.value
        })
    }
    onChange = (e) => {
        this.setState({
          value: e.target.value,
        });
    }

    toRecharge(){
    //    todo

    }
    render(){
        const {balance} = this.state;
        return(
            <div className="re-charge">
                <ReturnBar title="会员充值"></ReturnBar>
                <div className="input-div">
                    <div className="input-title">金额：</div>
                    <Input placeholder="请输入金额" className="input" onChange={this.onChangeBa.bind(this)} value={balance}></Input>
                </div>
                <div className="input-div input-way">
                    <div className="input-title">支付方式：</div>
                </div>
                <RadioGroup onChange={this.onChange} value={this.state.value}>
                    <div className="input-way way">
                        <div className="wechat">
                            <i className="iconfont icon-wechat wechat-icon"></i>
                            <span className="title-wechat">微信支付</span>
                        </div>
                        <div className="choose">
                            <Radio name="way" value={1} checked></Radio>
                        </div>
                    </div>
                </RadioGroup>
                <div className="btn-register">
                    <div className="register" onClick={this.toRecharge.bind(this)}>立即充值</div>
                </div>
            </div>
        )
    }
}

export default Recharge;