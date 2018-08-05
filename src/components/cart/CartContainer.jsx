import React from 'react';
import './cart.css';
import {message} from 'antd';
import {getCartItems, clearCart, addToCart, chageInput, delFromCart} from '../../utils/cartOperation';
import PropTypes from 'prop-types'

class CartContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show: props.show,
            data: [],
            none: false,
            length: 0,
            totalPrice: 0,
            inputValue: [],

        }
    }
    componentDidMount(){
        this.reloadDatas();
    }
    componentDidUpdate(){
        return true;
    }
    caculateLength(datas){
        var length = 0;
        for(let i = 0; i < datas.length; i++){
            length = length + parseInt(datas[i].count, 10);
        }
        return length;
    }
    caculateTotal(datas){
        var total = 0;
        for(let i = 0; i < datas.length; i++){
            let price = parseInt(datas[i].count, 10) * parseFloat(datas[i].salePrice, 10) * parseFloat(datas[i].discount,10)
            total += price;
        }
        return total;
    }
    hideDetail(){
        let show = false;
        this.setState({show}, ()=> this.props.hideDetail(show));
    }
    reloadDatas(){
        var items = getCartItems();
        if (items == null || (JSON.stringify(items) === "[]")){
            this.setState({
                data: [],
                none: true,
                length: 0,
                totalPrice: 0.00
            });
            this.context.updateCartDotc(false);
        }
        else{
            var length = this.caculateLength(items);
            var total = this.caculateTotal(items).toFixed(2);
            var inputArr = this.initInput(items);
            this.setState({
                data: items,
                none: false,
                length: length,
                totalPrice: total,
                inputValue: inputArr
            })
        }
    }
    initInput(datas){
        var arr = [];
        for(let i = 0; i < datas.length; i++){
            arr[i] = datas[i].count;
        }
        return arr;
    }
    clearAll(){
        if(getCartItems()!=null){
            clearCart();
            message.success("清空购物车成功～");
            this.context.updateCartDotc(false);
            this.hideDetail();
        }else{
            message.warning("购物车空空如也~");
        }
    }
    delSingleFromCart(item, index){
        var newArr = [];
        newArr = this.state.inputValue;
        if(newArr[index] > 1){
            newArr[index] =  parseInt(newArr[index], 10) - 1;
        }
        else{
            newArr[index] = 0;
        }
        this.setState({
            inputValue: newArr
        })
        delFromCart(item, newArr[index]);
        this.reCaculate();
        this.reloadDatas();
    }
    addSingleToCart(item, index){
        addToCart(item);
        var newArr = [];
        newArr = this.state.inputValue;
        if(newArr[index] === "") newArr[index] = 0;
        newArr[index] =  parseInt(newArr[index], 10) + 1;
        this.setState({
            inputValue: newArr
        })
        this.reCaculate();
    }
    changeCount = (index, e) =>{
        var newArr = [];
        newArr = this.state.inputValue;
        newArr[index] = e.target.value;
        if(e.target.value == null || e.target.value === ""){
            newArr[index] = "";
        }
        this.setState({
            inputValue: newArr
        })
    }
    blur(item, index){
        var da = this.state.inputValue[index]
        if(da === ""){
            da = 0;
        }
        chageInput(item,  parseInt(da, 10));
        this.reCaculate();
        this.reloadDatas();
    }
    reCaculate(){
        var items = getCartItems();
        if(items != null){
            var total = this.caculateTotal(items).toFixed(2);
            var length = this.caculateLength(items);
            this.setState({
                totalPrice: total,
                length: length
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            show : nextProps.show
        });
    }
    //结算按钮的点击事件 跳转到验证模块的结算
    checkOut(){
        var items = getCartItems();
        if(items != null){
            this.context.router.history.push('/checkout/' + this.state.totalPrice);
        }
        else{
            message.warning("购物车空空如也～请先添加商品哦");
        }
    }
    render(){
        const {data, none, length, totalPrice, inputValue} = this.state;
        return(
            <div className="cart-dialog">
                <div className="cart-mask" onClick={this.hideDetail.bind(this)}></div>
                <div className="dialog-cart">
                    <div className="cart-title">
                        <div className="tit">购物车</div>
                        <div className="clear-cart" onClick={this.clearAll.bind(this)}>清空</div>
                    </div>
                    <div className="cart-content">
                        <div className={none?'hide': 'display'}>
                            {
                                data.map((item, index) => (
                                    <div className="content-item" key={index}>
                                        <div className="name">{item.goodsName}</div>
                                        <div className="good-price content-price">¥{(item.salePrice*item.discount).toFixed(2)}</div>
                                        <div className="cart-operation">
                                            <i className="iconfont icon-minus icon-ope" onClick={this.delSingleFromCart.bind(this, item, index)}></i>
                                            <input type="number" className="cart-input" ref={node => this.countInput = node} value={inputValue[index]} onBlur={this.blur.bind(this, item, index)} onChange={this.changeCount.bind(this, index)}/>
                                            <i className="iconfont icon-plus1 icon-ope" onClick={this.addSingleToCart.bind(this, item, index)}></i>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="info-bar">
                        <div className="info">
                            {/* <div className="info-icon">本店活动</div>
                            <div className="info-content">本店香烟满10元赠壹送精美打火机1个</div> */}
                        </div>
                    </div>
                    <div className="cart-footer">
                        <div className="cart-total">共<span className="good-price">{length}</span>件商品</div>
                        <div className="total-price">总计：<span className="good-price">¥{totalPrice}</span></div>
                        <div className="final" onClick={this.checkOut.bind(this)}>结算</div>
                    </div>
                </div>
            </div>
        )
    }
}

CartContainer.contextTypes = {
    router: PropTypes.object.isRequired,
    showCartDotc: PropTypes.bool,
    updateCartDotc: PropTypes.func
}
// function mapStateToProps(state) {
//     console.log("test CartContainer storeID");
//     console.log(state.storeId);
//     return {
//         token: state.token,
//         storeId: state.storeId
//     };
// }

// function mapDispatchToProps(dispatch, props) {
//     return {
//         setStoreId(storeId) {
//             console.log("cartContainer set storeId");
//             alert(storeId);
//             dispatch({
//                 type: 'SET_STORE',
//                 storeId: storeId
//             })
//         },
//         setStoreName(storeName) {
//             dispatch({
//                 type: 'SET_STORE_NAME',
//                 storeName: storeName
//             })
//         }
//     };
// }
// export default connect(mapStateToProps, mapDispatchToProps)(CartContainer);
export default CartContainer;