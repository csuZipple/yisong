import React from 'react';
import './orderContent.css';
import {Link} from 'react-router-dom';

class OrderContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            datas: props.datas
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            datas: nextProps.datas
        })
    }
    render(){
        const {datas} = this.state;
        return(
            <div className="order-content">
                {
                    datas.map((item, index) => (
                        <Link className="order-item" key={index} to={["/order/detail/", item.orderId].join("")}>
                            <div className="order-title">{item.orderId}</div>
                            <div className="description">
                                <div className="order-count">总价：{item.price}元</div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        )
    }
}

export default OrderContent;