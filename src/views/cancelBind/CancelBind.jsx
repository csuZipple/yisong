import React from 'react';
import './cancelBind.css';
import {Input, message, Popconfirm} from 'antd';
import ReturnBar from '../../components/returnBar/ReturnBar';
import { connect } from 'react-redux';
import {setCookie} from '../../utils/cookie';
import ajaxhost from '../../ajaxhost';

class CancelBind extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            tel: ""
        }
    }
    componentDidMount(){
        let token = this.props.token;
        let that = this;
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
                            tel: result.data.user.phone
                        })
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    submit(){
        let token = this.props.token;
        let that = this;
        fetch(ajaxhost+'/users/weixin/', {
            headers: {
                "Ys-user": token
            },
            method: 'DELETE'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    if(result.code === 200){
                        message.success("解绑成功");
                        that.props.history.push('/home');
                        setCookie("token", "");
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    cancel(e) {
        console.log(e);
    }
    confirm() {
        this.submit();
    }
    render(){
        const {tel} = this.state;
        return(
            <div className="cancel-bind">
                <ReturnBar title="取消绑定"></ReturnBar>
                <div className="input-bind-div">
                    <div className="input-bind-title">已绑定手机号码：</div>
                    <Input readOnly="readonly" className="input-bind" value={tel}></Input>
                </div>
                <Popconfirm title="确定取消绑定?" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="确定" cancelText="取消">
                    <div className="btn-register">
                        <div className="register">取消绑定</div>
                    </div>
                </Popconfirm>
            </div>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(CancelBind);