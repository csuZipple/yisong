import React from 'react';
import './receiveMess.css';
import {Link} from 'react-router-dom';

class ReceiveMess extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message: props.address,
            type: props.type
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            message: nextProps.address,
            type: nextProps.type
        })
    }
    render(){
        const {message, type} = this.state;
        return(
            <div className={["receive-mess", type === 'check'? "show-hover": ""].join(" ")}>
                <div className="top">
                    <div className="receive-name">收货人：{message.name}</div>
                    <div className="receive-tel">{message.phone}</div>
                    <Link to="/selectAddr" className={type === 'check'? "show": "hide"}><i className="iconfont icon-left1 left-icon"></i></Link>
                </div>
                <div className="receive-addr">
                    <div className="title-addr">收货地址：</div>
                    <div className="content">{message.address}</div>
                </div>
            </div>
        )
    }
}

export default ReceiveMess;