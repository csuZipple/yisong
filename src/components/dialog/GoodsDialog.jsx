import React from 'react';
import './dialog.css';
import {addToCart} from '../../utils/cartOperation';
import {message} from 'antd';
import PropTypes from "prop-types";
import ajaxhost from '../../ajaxhost';
class GoodsDialog extends React.Component{

    static contextTypes = {
        showCartDotc: PropTypes.bool,
        updateCartDotc: PropTypes.func
    }

    constructor(props){
        super(props);
        this.state = {
            show: props.show,
            icon: props.icon,
            data: props.data,
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
                        let good = that.state.data;
                        if(data != null){
                            good["discount"] = data.discount;
                            that.setState({
                               good:good
                            })
                        }
                        else{
                            good["discount"] = 1;
                            that.setState({
                                good:good
                            })
                        }
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }

    addToCart(){
        if (!this.context.showCartDotc) {
            this.context.updateCartDotc(true);
        }
        message.success("添加成功");
        addToCart(this.state.data);
        this.hideDetail();
    }
    hideDetail(){
        let show = false;
        this.setState({show}, ()=> this.props.hideDetail(show));
    }
    componentWillReceiveProps(nextProps) {
        this.setState({show : nextProps.show});
    }
    render(){
        const {icon, data, discount} = this.state;
        return(
            <div className="detail-dialog">
                <div className="mask" onClick={this.hideDetail.bind(this)}></div>
                <div className="dialog">
                    <div className="close">
                        <i className="iconfont icon-close close-icon" onClick={this.hideDetail.bind(this)}></i>
                    </div>
                    <div className="img-div">
                        <img src={icon} alt="" className="dialog-img"/>
                    </div>
                    <div className="detail-title">{data.goodsName}</div>
                    <div className="dialog-operation">
                        <div className="dialog-price">
                            ¥{(data.salePrice * data.discount).toFixed(2)}
                            <span className={["old", data.discount === 1? "hide": "show"].join(" ")}>¥{(data.salePrice).toFixed(2)}</span>
                        </div>
                        <div className="add-cart">
                             <span className="add-title" onClick={this.addToCart.bind(this)}> 加入购物车</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default GoodsDialog;