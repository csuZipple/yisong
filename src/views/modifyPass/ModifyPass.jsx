import React from 'react';
import './modifyPass.css';
import {Input} from 'antd';
import ReturnBar from '../../components/returnBar/ReturnBar';

class ModifyPass extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pass: "",
            newPass: "",
            confirmPass: "",
            open: [true, false, false]
        }
    }
    componentDidUpdate(){
        return true;
    }
    onChangePass(e){
        this.setState({
            pass: e.target.value
        })
    }
    onChangeNewPas(e){
        this.setState({
            newPass: e.target.value
        })
    }
    onChangeConfirmPass(e){
        this.setState({
            confirmPass: e.target.value
        })
    }
    toggleEye(index){
        var arr = this.state.open;
        arr[index] = !arr[index];
        this.setState({
            open: arr
        })
    }
    render(){
        const {pass, newPass, confirmPass, open} = this.state;
        return(
            <div className="modify-pass">
                <ReturnBar title="修改密码"></ReturnBar>
                <div className="input-div">
                    <div className="input-title">输入当前密码：</div>
                    <Input placeholder="请输入当前密码" className="input" type={open[0]? "text": "password"} onChange={this.onChangePass.bind(this)} value={pass}></Input>
                    <i onClick={this.toggleEye.bind(this, 0)} className={["iconfont icon-eye", open[0]? "icon-yanjingfaxian": "icon-eye-close ", open[0]? "open-eyes": ""].join(" ")}></i>
                </div>
                <div className="input-div">
                    <div className="input-title">输入新密码：</div>
                    <Input placeholder="请输入新密码" className="input" type={open[1]? "text": "password"} onChange={this.onChangeNewPas.bind(this)} value={newPass}></Input>
                    <i onClick={this.toggleEye.bind(this, 1)} className={["iconfont icon-eye", open[1]? "icon-yanjingfaxian": "icon-eye-close ", open[1]? "open-eyes": ""].join(" ")}></i>
                </div>
                <div className="input-div">
                    <div className="input-title">再次输入新密码：</div>
                    <Input placeholder="请再次输入新密码" className="input" type={open[2]? "text": "password"} onChange={this.onChangeConfirmPass.bind(this)} value={confirmPass}></Input>
                    <i onClick={this.toggleEye.bind(this, 2)} className={["iconfont icon-eye", open[2]? "icon-yanjingfaxian": "icon-eye-close ", open[2]? "open-eyes": ""].join(" ")}></i>
                </div>
                <div className="btn-register">
                    <div className="register">确认修改</div>
                </div>
            </div>
        )
    }
}

export default ModifyPass;