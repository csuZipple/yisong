import React from 'react';
// import goodsImg from '../../assets/img/goods1.png';
import GoodsDialog from '../dialog/GoodsDialog';
import {addToCart} from '../../utils/cartOperation';
import {message} from 'antd';
import PropTypes from "prop-types";
import ajaxhost from '../../ajaxhost';
class GoodsItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: props.item,
            show: false,
            discount: 1
        }
    }
    componentDidMount(){
        let that = this;
        let goodsId = this.state.data.goodsId;
        fetch(ajaxhost+'/goods/discount/' + goodsId, {
            method: 'GET'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    if(result.code === 200){
                        let data = result.data;
                        console.log(data);
                        let good = that.state.data;
                        if (data !== null) {
                            good['discount'] = data.discount
                        } else {
                            good['discount'] = 1
                        }
                        that.setState({
                            data: good
                        })
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    static contextTypes = {
        showCartDotc: PropTypes.bool,
        updateCartDotc: PropTypes.func
    }
    addToCart(){
        if(!this.context.showCartDotc){
            this.context.updateCartDotc(true);
        }
        if(this.state.data.publish === 2){
            message.warning("商品未上架");
        }else if(this.state.data.stock === 0){
            message.warning("商品卖光了")
        }
        else{
            message.success("添加成功");
            addToCart(this.state.data);
            console.log("添加购物车",this.state.data);
        }
    }
    viewDetail(){
        this.setState({
            show: true
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        return true;
    }
    render() {
        const {data, show} = this.state;
        let goodsImg = data.picture;
        const Dialog = show? <GoodsDialog icon={goodsImg} data={data} hideDetail={val => {this.setState({show: val})}}></GoodsDialog> : "";
        return (
            <div className="goods-item">
                <div className="item-img" onClick={this.viewDetail.bind(this)}>
                    <img src={goodsImg} alt="" className="item-img"/>
                </div>
                <div className="item-name">{data.goodsName}</div>
                <div className="operation">
                    <div className="item-price">¥{(data.salePrice * data.discount).toFixed(2)}</div>
                    <i className="iconfont icon-iconfontcart item-icon" onClick={this.addToCart.bind(this)}></i>
                </div>
                {Dialog}
            </div>
        )
    }
}

export default GoodsItem;