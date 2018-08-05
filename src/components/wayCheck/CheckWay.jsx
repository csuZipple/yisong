import React from 'react';
import './checkWay.css';
import {Radio} from 'antd';
const RadioGroup = Radio.Group;

class CheckWay extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: 1,
            type: props.type,
            payStatus: props.payStatus,
            status: props.status,
            payType:props.payType
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            status: nextProps.status,
            payStatus: nextProps.payStatus,
            payType:nextProps.payType
        })
    }
    onChange(e){
        this.setState({
            value: e.target.value,
        }, function(){
            this.props.checkWay(e.target.value);
        });
    }
    render(){
        const {type, value, payStatus, status,payType} = this.state;
        if(type === "show" && status !== 0){
            let curValue;
            // if(payStatus === 4){
            //     curValue = 2;
            // }
            // else if(payStatus === 1){
            //     curValue = 1;
            // }
            if(payType === 1){
                curValue =1;
            }else if(payType === 2){
                curValue = 2;
            }
            return(
                <div className="check-out">
                    <div className="order-title border">支付方式</div>
                    <RadioGroup value={curValue}>
                        <div className={["input-way way", curValue === 1? "show-way" : "hide"].join(" ")}>
                            <div className="wechat">
                                <i className="iconfont icon-wechat wechat-icon"></i>
                                <span className="title-wechat">微信支付</span>
                            </div>
                            <div className="choose">
                                <Radio name="way" value={1} checked></Radio>
                            </div>
                        </div>
                        <div className={["input-way way", curValue === 2? "show-way" : "hide"].join(" ")}>
                            <div className="wechat">
                                <i className="iconfont icon-huodaofukuan pay-icon"></i>
                                <span className="title-wechat">货到付款</span>
                            </div>
                            <div className="choose">
                                <Radio name="way" value={2}></Radio>
                            </div>
                        </div>
                    </RadioGroup>
                </div>
            )
        }
        else{
            return(
                <div className="check-out">
                    <div className="order-title border">支付方式</div>
                    <RadioGroup onChange={this.onChange.bind(this)} value={value}>
                        <div className="input-way way">
                            <div className="wechat">
                                <i className="iconfont icon-wechat wechat-icon"></i>
                                <span className="title-wechat">微信支付</span>
                            </div>
                            <div className="choose">
                                <Radio name="way" value={1} checked></Radio>
                            </div>
                        </div>
                        <div className="input-way way">
                            <div className="wechat">
                                <i className="iconfont icon-huodaofukuan pay-icon"></i>
                                <span className="title-wechat">货到付款</span>
                            </div>
                            <div className="choose">
                                <Radio name="way" value={2}></Radio>
                            </div>
                        </div>
                    </RadioGroup>
                </div>
            )
        }

    }
}

export default CheckWay;