import React from 'react';
import './dialog.css';

class MessDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show: props.showMess,
            type: props.type,
            data: props.data
        }
    }
    hideMess(){
        let show = false;
        this.setState({show}, ()=> this.props.hideMess(show));
    }
    componentWillReceiveProps(nextProps) {
        this.setState({show : nextProps.show});
    }
    render(){
        const {type, data} = this.state;
        return(
            <div className="detail-dialog">
                <div className="mask" onClick={this.hideMess.bind(this)}></div>
                <div className="dialog">
                    <div className="close-mess">
                        <div></div>
                        <div className="dialog-title">提示信息</div>
                        <i className="iconfont icon-close close-icon close-mess-icon" onClick={this.hideMess.bind(this)}></i>
                    </div>
                    <div className="mess-content">
                        {data}
                    </div>
                    <div className="btn">
                        <div className={["close-btn", type === "home"? "btn-show" : "btn-hide"].join(" ")}>关闭</div>
                        <div className={["close-btn close-del-btn cancel-btn", type === "delete"? "btn-show" : "btn-hide"].join(" ")}>取消</div>
                        <div className={["close-btn close-del-btn", type === "delete"? "btn-show" : "btn-hide"].join(" ")}>确认</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MessDialog;