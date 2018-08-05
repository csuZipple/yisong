import React from 'react';
import GoodsDialog from '../dialog/GoodsDialog';
import {addToCart} from '../../utils/cartOperation';
import {message} from 'antd';
// import goodImg from '../../assets/img/goods1.png';
import PropTypes from "prop-types";
import ajaxhost from '../../ajaxhost';

class CategoryContent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            good: props.good,
            show: false
        }


    }

    componentDidMount() {
        this.getDiscount(this.state.good);
    }
    getDiscount(good){
        let that = this;
        let goodsId = good.goodsId;
        fetch(ajaxhost + '/goods/discount/' + goodsId, {
            method: 'GET'
        }).then((res) => {
            if (res.ok) {
                res.json().then(function (result) {
                    if (result.code === 200) {
                        let data = result.data;
                        console.log(data);

                        if (data !== null) {
                            good['discount'] = parseFloat(data.discount,10);
                            that.setState({
                                good: good,
                            })
                            console.log("getDiscount",good);
                        }else{
                            good['discount'] = 1;
                            that.setState({
                                good: good,
                            })
                        }

                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    componentWillReceiveProps(nextProps){

        if (nextProps!==this.props) {
            this.getDiscount(nextProps.good)
        }
    }
    static contextTypes = {
        showCartDotc: PropTypes.bool,
        updateCartDotc: PropTypes.func
    }
    addToCart() {
        if (!this.context.showCartDotc) {
            this.context.updateCartDotc(true);
        }
        message.success("添加成功");
        addToCart(this.state.good);
    }
    viewDetail(){
        this.setState({
            show: true
        })
    }
    render() {
        const {good, show} = this.state;
        let goodImg = good.picture;
    <div className="good-price">¥{(good.salePrice * good.discount).toFixed(2)}</div>
        const Dialog = show? <GoodsDialog icon={goodImg} data={good} hideDetail={val => {this.setState({show: val})}}></GoodsDialog> : "";
        return (
            isNaN(good.discount) ||
            <div className="category-content">
                <div className="good-img" onClick={this.viewDetail.bind(this)}>
                    <img src={goodImg} alt="" className="good-img-item"/>
                </div>
                <div className="good-title">{good.goodsName}</div>
                <div className="operation">
                    <div className="good-price">¥{(good.salePrice * good.discount).toFixed(2)}</div>
                    <i className="iconfont icon-iconfontcart good-add" onClick={this.addToCart.bind(this)}></i>
                </div>
                {Dialog}
            </div>
        )
    }
}

export default CategoryContent;