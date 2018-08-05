import React from 'react';
import './register.css';
import asyncComponent from '../../utils/asyncComponent';
import  {Input, message}  from  'antd';
import {getQueryString} from '../../utils/cookie';
import ajaxhost from "../../ajaxhost";

const ReturnBar = asyncComponent(() => import('../../components/returnBar/ReturnBar'));
// const InputBar = asyncComponent(() => import('../../components/input/Input'));

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tel: "",
            send: false,
            time: 60,
            code: ""
        }
    }
    componentDidMount(){
        message.warning("该微信号还未绑定手机号码，请使用手机号进行注册");
    }
    componentDidUpdate(){
        return true;
    }
    onChangeTel(e){
        this.setState({
            tel: e.target.value
        })
    }
    onChangeCode(e){
        this.setState({
            code: e.target.value
        })
    }
    getCode(){
        if(this.notNull(this.state.tel, "phone")){
            if(this.validate(this.state.tel)){
                let formData = new FormData();
                formData.append('phone', this.state.tel);
                fetch(ajaxhost + '/messages/wechat/', {
                    method: 'POST',
                    body: formData
                  }).then((res) => {
                    if(res.ok){
                      message.success("发送成功");
                      res.json().then(function(data){
                          console.log(data);
                      })
                    }
                  }).catch((res)=>{
                    console.log(res);
                  });

                this.setState({
                    send: true
                })
                this.interval = setInterval(() => this.tick(), 1000);
            }
        }
    }
    hasSend(){
        message.info("请在" + this.state.time + "s后重试");
    }
    tick(){
        var time = parseInt(this.state.time, 10);
        if(time === 1){
            this.setState({
                send: false,
                time: 60
            })
            clearInterval(this.interval);
        }
        else{
            this.setState({
                time: time - 1
            })
        }
    }
    validateTel(){

        if(this.notNull(this.state.tel, "phone")){
            if(this.validate(this.state.tel)){
                console.log(true);
            }
        }
    }
    validate(data){
        var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
        if (!phoneReg.test(data)) {
            message.warning('请输入有效的手机号码');
            return false;
        }
        else{
            return true;
        }
    }
    notNull(data, type){
        if(data == null || data === ""){
            return false;
        }
        else{
            return true;
        }
    }
    submit(){
        let that = this;
        if(this.notNull(this.state.tel) && this.notNull(this.state.code)){
            // var code = getCookie("code");
            if(this.validate(this.state.tel)){
                let code = getQueryString('code');

                let formData = new FormData();
                formData.append('phone', this.state.tel);
                formData.append('messageCode', this.state.code);
                formData.append('code', code);
                fetch(ajaxhost+'/users/weixin/', {
                    method: 'POST',
                    body: formData
                }).then((res) => {
                    if(res.ok){
                        res.json().then(function(data){
                            console.log(data);
                            if(data.code === 200){
                                message.success("注册成功");
                                that.props.history.push('/home');
                            }
                        })
                    }
                    else{
                        message.warning("注册失败，请重新注册");
                    }
                }).catch((res)=>{
                    console.log(res);
                });
            }
        }
        else{
            message.warning("请填写完整信息");
        }
    }
    render(){
        const {tel, send, time, code} = this.state;
        let operation;
        if(send){
            operation = <div className="code-input code-disable" onClick={this.hasSend.bind(this)}>{time}s后重新发送</div>;
        }
        else{
            operation = <div className="code-input" onClick={this.getCode.bind(this)}>获取验证码</div>;
        }
        return (
            <div className="register-div">
                <ReturnBar title="手机注册"></ReturnBar>
                <div className="input-div">
                    <div className="input-title">手机号码：</div>
                    <Input placeholder="请输入手机号码" className="input" onChange={this.onChangeTel.bind(this)} value={tel}></Input>
                </div>
                <div className="input-div">
                    <div className="input-title">验证码：</div>
                    <Input placeholder="请输入验证码" className="input" onChange={this.onChangeCode.bind(this)} value={code}></Input>
                    {operation}
                </div>
                <div className="btn-register">
                    <div className="register" onClick={this.submit.bind(this)}>提交</div>
                </div>
            </div>
        )
    }
}

export default Register;