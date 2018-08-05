import React from 'react';
import './userTop.css';
import logo from '../../assets/img/logo.png';

class UserTop extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: props.user
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            user: nextProps.user
        })
    }    
    render(){
        const {user} = this.state;
        return(
            <div className="user-bar">
                <div className="user-top">
                    <div className="logo">
                        <img src={logo} alt=""/>
                    </div>
                    <div className="user-mess">
                        <div className="user-name">{user.nickname}</div>
                        <div className="user-tel">{user.phone}</div>
                    </div>
                </div>
                
                <div className="user-bottom">
                    <div className="balance">余额：¥{user.wallet}</div>
                    <div className="balance">积分：{user.score}</div>
                </div>
            </div>
        )
    }
}

export default UserTop;