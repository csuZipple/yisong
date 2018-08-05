import React from 'react';
import './noticeBar.css'

class NoticeBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            index: 0,
            notices: props.notices
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            notices: nextProps.notices
        })
    }
    componentDidMount(){
        this.interval = setInterval(() => this.tick(), 5000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }
    tick(){
        let {index, notices} = this.state;
        if(index < notices.length - 1){
            index = parseInt(index, 10) + 1;
        }
        else{
            index = 0;
        }
        this.setState({
            index: index
        })
    }
    render() {
        const {index, notices} = this.state;
        return (
            <div className="notice-bar">
                <div className="notice-icon">
                    <i className="iconfont icon-gonggao icon-notice"></i>
                    <span className="notice-title">公告</span>
                </div>
                <div className="notice">
                    {
                        notices.map((item, i) => (
                            <div className={["notice-item", index === i? "notice-show": "notice-hide"].join(" ")} key={i}>{item.content}</div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default NoticeBar;