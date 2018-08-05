import React from 'react';
import './input.css';
import  {Input, message}  from  'antd';

class InputBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title: props.title,
            place: props.place,
            type: props.type,
            tel: "",
            send: false,
            time: 60
        }
    }
    componentDidUpdate(){
        return true;
    }
    onChangeTel(e){
        this.setState({
            tel: e.target.value
        })
    }
    getCode(){
        if(this.notNull(this.state.tel)){
            if(!this.validate(this.state.tel)){
                message.warning('请输入有效的手机号码');
            }
            else{
                this.setState({
                    send: true
                })
            }
        }
        else{
            message.warning('手机号码不能为空');
        }
    }
    hasSend(){
        message.info("请在" + this.state.time + "s后重试");
    }
    validateTel(){
        
        if(this.notNull(this.state.tel)){
            if(!this.validate(this.state.tel)){
                message.warning('请输入有效的手机号码');
            }
        }
        else{
            message.warning('手机号码不能为空');
        }
    }
    validate(data){
        var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; 
        if (!phoneReg.test(data)) {  
            return false;
        }
        else{
            return true;
        }
    }
    notNull(data){
        if(data == null || data === ""){
            return false;
        }
        else{
            return true;
        }
    }
    render(){
        const {title, place, type, tel, send, time} = this.state;
        let operation;
        if(type === "code"){
            if(send){
                operation = <div className="code-input" onClick={this.hasSend.bind(this)}>{time}s后重新发送</div>;
            }
            else{
                operation = <div className="code-input" onClick={this.getCode.bind(this)}>获取验证码</div>;
            }
        }
        const input = type === "phone"? <Input placeholder={place} className="input" onChange={this.onChangeTel.bind(this)} onBlur={this.validateTel.bind(this)} value={tel}></Input>: <Input placeholder={place} className="input"></Input>;
        return (
            <div className="input-div">
                <div className="input-title">{title}：</div>
                {input}
                {operation}
            </div>
        )
    }
}

export default InputBar;