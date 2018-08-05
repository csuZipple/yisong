import React from 'react';
import './returnBar.css';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'

class ReturnBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: props.type
        }
    }
    goBack(){
       this.context.router.history.goBack();
    }
    render(){
        const {type} = this.state;
        if(type === "checkout"){
            return(
                // 连接到主页 react-route-dom组件
                <div className="return-bar">
                    <Link to="/home"><i className="iconfont icon-left return-icon"></i></Link>
                    <div className="return-title">{this.props.title}</div>
                </div>
            )
        }
        else{
            return(
                <div className="return-bar">
                    <i className="iconfont icon-left return-icon" onClick={this.goBack.bind(this)}></i>
                    <div className="return-title">{this.props.title}</div>
                </div>
            )
        }
    }
}

ReturnBar.contextTypes = {
    router: PropTypes.object.isRequired
}
export default ReturnBar;