import React from 'react';
import {connect} from 'react-redux';
import asyncComponent from '../../utils/asyncComponent';
import SearchBar from '../../components/searchBar/SearchBar';
import NavBar from '../../components/navBar/NavBar';
import CategoryItem from '../../components/caregoryItem/CategoryItem';
import GoodsDialog from "../../components/dialog/GoodsDialog";
import { getCartItems } from '../../utils/cartOperation';
import PropTypes from "prop-types";
import ajaxhost from '../../ajaxhost';
const Footer = asyncComponent(() => import("../../components/footer/Footer"));

class Category extends React.Component{
    static childContextTypes = {
        showCartDotc: PropTypes.bool,
        updateCartDotc: PropTypes.func
    }

    constructor(props){
        super(props);
        this.state = {
            categoryId: this.props.match.params.categoryId,
            categorys: [],
            subCategorys: [],
            goods: [],
            showGoods:false,
            // good:item
        }
    }
    componentDidMount(){
        let that = this;
        fetch(ajaxhost+'/categories/rank/first/', {
            method: 'GET'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    that.setState({
                        categorys: result.data
                    })
                })
            }
        }).catch((res) => {
            console.log(res);
        })
        this.refreshSub();
        this.initialCartDoc();
        sessionStorage.clear();
    }
    refreshSub(){
        let that = this;
        fetch(ajaxhost+'/categories/rank/second/' + this.state.categoryId, {
            method: 'GET'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    that.setState({
                        subCategorys: result.data
                    }, function(){
                        // console.log(that.state.subCategorys);
                        if(that.state.subCategorys !== null){
                            if (that.state.subCategorys[0] !== null && that.state.subCategorys[0] !== "") {
                                that.getGoods(that.state.subCategorys[0].categoryId);
                            }
                            else {
                                that.setState({
                                    goods: []
                                })
                            }
                        }else{
                            that.setState({
                                goods:[]
                            })
                        }
                    })
                })
            }
        }).catch((res) => {
            console.log(res);
        })

    }
    getGoods(categoryId){
        let that = this;
        let storeId = this.props.storeId;
        if(storeId === undefined){
            storeId = localStorage.storeId;
        }
        fetch(ajaxhost+'/stores/' + storeId + '/category/' + categoryId, {
            method: 'GET'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    that.setState({
                        goods: result.data
                    })
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    selectGoods(item) {
        console.log(item + "selectGoods");
        this.setState({
            showGoods: true,
            good: item
        })
    }
    display(categoryId){
        this.setState({
            categoryId: categoryId
        }, function(){
            this.refreshSub()
        })
    }
    changeCate(categoryId){
        this.getGoods(categoryId);
    }
    initialCartDoc() {
        var items = getCartItems();
        if ((items == null) || JSON.stringify(items) === '[]') {
            this.setState({
                showCartDotc: false
            })
        } else {
            this.setState({
                showCartDotc: true
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
        const {categoryId, categorys, subCategorys, goods,showGoods,good} = this.state;
        const GoodDialog = showGoods ? <GoodsDialog data={good} hideDetail={val => { this.setState({ showGoods: val }) }}></GoodsDialog> : "";
        return(
            <div className="category">
                <SearchBar selectGoods={this.selectGoods.bind(this)}></SearchBar>
                <NavBar type="category" categorys={categorys} context={this.props} display={(categoryId) => this.display.bind(this, categoryId)}></NavBar>
                <CategoryItem categoryId={categoryId} subCategorys={subCategorys} goods={goods} changeCate={(categoryId) => this.changeCate(categoryId)}></CategoryItem>
                <Footer></Footer>
                {GoodDialog}
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
      storeId: state.storeId
    };
  }

function mapDispatchToProps(dispatch, props) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Category);