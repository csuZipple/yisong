import React from 'react';
import './orderState.css';

class OrderState extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            status: props.status
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            status: nextProps.status
        })
    }
    render() {
        const {status} = this.state;
        return (
            <div className="order-state">
                <div className="first">
                    <div className="circle circle-active">
                        <span className="number">1</span>
                    </div>
                    <div className="state state-active">支付订单</div>
                </div>
                <div className="line-div">
                    <div className={["line", status === 0? "": "line-active"].join(" ")}></div>
                </div>
                <div className="first">
                    <div className={["circle", status === 0? "": "circle-active"].join(" ")}>
                        <span className="number">2</span>
                    </div>
                    <div className={["state", status !== 0? "state-active": ""].join(" ")}>待确认</div>
                </div>
                <div className="line-div">
                    <div className={["line", status === 2? "line-active": ""].join(" ")}></div>
                </div>
                <div className="first">
                    <div className={["circle", status === 2? "circle-active": ""].join(" ")}>
                        <span className="number">3</span>
                    </div>
                    <div className={["state", status === 2? "state-active": ""].join(" ")}>订单完成</div>
                </div>
            </div>
        )
    }
}

export default OrderState;