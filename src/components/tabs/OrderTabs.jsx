import React from 'react';
import './orderTabs.css';

class OrderTabs extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            index: this.props.index,
            status: ["未支付", "待确认", "已完成"]
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps!==this.props){
            this.setState({
                index:nextProps.index
            })
        }
    }
    showThis(index){
        console.log(this.state.index,"00000");
        this.setState({
            index: index
        })
        this.props.changeTabs(index);
    }
    shouldComponentUpdate(){
        return true;
    }
    render(){
        const {status, index} = this.state;
        return(
            <div className="order-tabs">
                {
                    status.map((item, i) => (
                        <div className={["status-tab", index === i? "status-tab-active" : ""].join(" ")} key={i} onClick={this.showThis.bind(this, i)}>{item}</div>
                    ))
                }
            </div>
        )
    }
}

export default OrderTabs;