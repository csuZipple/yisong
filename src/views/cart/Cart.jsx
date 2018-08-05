import React from 'react';
import asyncComponent from '../../utils/asyncComponent';
import './cart.css';
import { getCartItems } from '../../utils/cartOperation';

const Footer = asyncComponent(() => import("../../components/footer/Footer"));

class Cart extends React.Component{
// Catr頁面是哪裏的？？？？？？？未完成
    componentDidMount(){
        this.initialCartDoc();
    }
    initialCartDoc() {

        var items = getCartItems;
        if (items != null) {
            this.setState({
                showCartDotc: true
            })
        } else {
            this.setState({
                showCartDotc: false
            })
        }

    }
    updateCartDotc = value => {
        this.setState({
            showCartDotc: value
        })
    }

    getChildContext() {
        return {
            showCartDotc: this.state.showCartDotc,
            updateCartDotc: this.updateCartDotc
        }
    }
    render(){
        return (
            <div className="cart">
                <div className="mask"></div>
                <Footer></Footer>
            </div>
        );
    }
}

export default Cart;