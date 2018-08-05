import React from 'react';
import {connect} from 'react-redux';
import SearchBar from '../../components/searchBar/SearchBar';
import Footer from '../../components/footer/Footer';
import NavBar from '../../components/navBar/NavBar';
import SlideBar from '../../components/slideBar/SlideBar';
import LogoBar from '../../components/logoBar/LogoBar';
import NoticeBar from '../../components/noticeBar/NoticeBar';
import GoodsList from '../../components/goodsList/GoodsList';
import AddrDialog from "../../components/dialog/AddrDialog";
import GoodsDialog from "../../components/dialog/GoodsDialog";
import PropTypes from "prop-types";
import { getCartItems } from '../../utils/cartOperation';
import {message} from "antd"
import ajaxhost from '../../ajaxhost';

class Home extends React.Component{
    //定义购物车小红点修改的类型
    static childContextTypes = {
        showCartDotc: PropTypes.bool,
        updateCartDotc: PropTypes.func
    }

    constructor(props){
        super(props);
        this.state = {
            // 显示地理位置框
            show: false,
            list: [],
            categorys: [],
            notices: [],
            slides: [],
            storeName: props.storeName,
            storeLists: [],
            showGoods: false,
            storeId: props.storeId,
            showTop:false,
            toCancel:false
        }
        // this.interval = 0;
    }
    async asyncComponent(){
        await new Promise((resolve)=>{
            this.getSlides();
            resolve("ok");
        });
        this.setState({
            showTop:true
        })
        await this.getNotices();
        await this.getFirstCategory();
        this.getMenuGoods();
    }
    componentDidMount(){
        const {storeId} = this.state;
        if(storeId === "" || storeId === undefined){
            if(localStorage.storeId !== undefined){
                this.setState({
                    storeId:localStorage.storeId,
                    // storeId: 1,测试数据
                    storeName:localStorage.storeName,
                    toCancel:true
                }
                , function () {
                    this.props.setStoreId(this.state.storeId);
                    this.props.setStoreName(this.state.storeName);
                    this.asyncComponent();
                })
                console.log("test",localStorage.storeId);
                console.log(this.state.storeId);
            }else{
                this.getPositionReady();
            }
        }
        else{
            this.asyncComponent();
        }
       this.initialCartDoc();
       sessionStorage.clear();

    }

    getPositionReady(){
        let that = this;
        window.wx.ready(function (){
            window.wx.getLocation({
                success: function (res) {
                    // console.log("success interval",that.interval);
                    // clearInterval(that.interval);
                    fetch(ajaxhost+'/stores/near?lnt=' + res.longitude + '&lat=' + res.latitude, {
                        method: 'GET'
                    }).then((res) => {
                        if (res.ok) {
                            res.json().then(function (result) {
                                if (result.code === 200) {
                                    if( result.data === '附近没有门店'||(JSON.stringify(result.data) === '附近没有门店')) {
                                        message.warning("附近没有门店");
                                    }else{
                                        that.setState({
                                            show: true,
                                            storeLists: result.data
                                        })
                                        console.log("result.data" ,result.data);
                                    }
                                }
                            })
                        }
                    }).catch((res) => {
                        console.log(res);
                    })
                },
                cancel: function (res) {
                    message.info("打开GPS，才能看到附近门店哦");
                },
                fail: function (res) {
                    message.info("打开GPS，才能看到附近门店哦");
                }
            });
        });
    }
    getNotices(){
        let that = this;
        fetch(ajaxhost+'/stores/notices/' + this.state.storeId, {
            method: 'GET'
        })
        .then(function(res) {
            if(res.ok){
                res.json().then(function(result){
                    that.setState({
                        notices: result.data
                    })
                })
            }
        }).catch(function(res) {
            console.log(res);
        });
    }
    getMenuGoods(){
        let that = this;
        fetch(ajaxhost+'/stores/menus/' + this.state.storeId, {
            method: 'GET'
        })
        .then(function(res) {
            if(res.ok){
                res.json().then(function(result){
                    that.setState({
                        list: result.data
                    })
                    // console.log(result.data);
                })
            }
        }).catch(function(res) {
            console.log(res);
        });
    }
    getFirstCategory(){
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
    }
    getSlides(){
        let that = this;
        fetch(ajaxhost+'/stores/slides/' + this.state.storeId, {
            method: 'GET'
        })
        .then(function(res) {
            if(res.ok){
                res.json().then(function(result){
                    that.setState({
                        slides: result.data
                    })
                })
            }
        }).catch(function(res) {
            console.log(res);
        });
    }
    shouldComponentUpdate(){
        return true;
    }
    selectStore(item){
        this.setState({
            storeName: item.storeName,
            show: false,
            storeId: item.storeId,
            toCancel:true
        }, function(){
            this.asyncComponent();
            localStorage.storeId = item.storeId;
            localStorage.storeName = item.storeName;
            this.props.setStoreId(item.storeId);
            this.props.setStoreName(item.storeName);
        })
    }
    selectGoods(item){
        console.log(item+"selectGoods");
        this.setState({
            showGoods: true,
            good: item
        })
    }
    choose(){
        this.setState({
            show: true
        })
        this.getPositionReady();
    }
    initialCartDoc(){
        var items = getCartItems();
        if ((items == null) || JSON.stringify(items)==='[]'){
            this.setState({
                showCartDotc: false
            })
        } else {
            this.setState({
                showCartDotc: true
            })
        }

    }
    updateCartDotc = value =>{
        this.setState({
            showCartDotc:value
        })
    }

    getChildContext() {
        return {
            showCartDotc:this.state.showCartDotc,
            updateCartDotc: this.updateCartDotc,

        }
    }

    render(){
        const {show, list, categorys, notices, slides, storeName, storeLists, good, showGoods,showTop,toCancel} = this.state;
        const Dialog = show? <AddrDialog data={storeLists} toCancel={toCancel} selectStore={this.selectStore.bind(this)} hideMess={val => {this.setState({show: val})}}></AddrDialog> : "";
        const GoodDialog = showGoods? <GoodsDialog data={good} hideDetail={val => {this.setState({showGoods: val})}}></GoodsDialog> : "";
        let Logo;
        let length = slides.length;
        let searchBar,noticeBar;
        if (showTop) {
            Logo = <LogoBar length={length} choose={this.choose.bind(this)} storeName={storeName}></LogoBar>;
            searchBar = <SearchBar selectGoods={this.selectGoods.bind(this)}></SearchBar>
            noticeBar = <NoticeBar notices={notices}></NoticeBar>
        }else{
            Logo = "";
            searchBar="";
            noticeBar="";
        }

        return (
            <div className="home">
                { searchBar }
                {/* <div style={{height:4.4}}></div> */}
                {/* {slideBar} */}
                <SlideBar slides={slides}></SlideBar>
                { Logo }
                {noticeBar}
                <NavBar type="home" categorys={categorys}></NavBar>
                <GoodsList lists={list}></GoodsList>
                <Footer></Footer>
                {Dialog}
                {GoodDialog}
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log(state);
    return {
        storeId: state.storeId,
        storeName: state.storeName
    };
  }

function mapDispatchToProps(dispatch, props) {
    return {
        setStoreId(storeId){
            console.log("home set storeId");
            console.log(storeId);
            dispatch({
                type: 'SET_STORE',
                storeId: storeId
            })
        },
        setStoreName(storeName){
            dispatch({
                type: 'SET_STORE_NAME',
                storeName: storeName
            })
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);