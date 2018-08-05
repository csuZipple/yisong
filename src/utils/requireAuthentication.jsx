import React from 'react';
import {connect} from 'react-redux';
import {getQueryString, getCookie, setCookie} from './cookie';
import ajaxhost from '../ajaxhost'
const appid = "wxe80557e8ca49c4b9";
const host = "http://wechat.yisongbld.com";


function requireAuthentication(Component, type){
  if(Comment.AuthenticatedComponent){
      return Comment.AuthenticatedComponent
  }

     // 创建验证组件
  class AuthenticatedComponent extends React.Component {

    componentWillMount() {
        this.checkAuth();
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth();
    }

    checkAuth() {
      if(this.props.history.pathname === "/router"){
        this.props.getPosition();
      }
      if(type === "p"){
        // this.props.getConfig();
        this.props.getPosition();
      }
      console.log(this.props);
      // alert(this.props);
      // if(this.props.storeId)
      this.props.goLogin(this.props.history);
      return;
    }

    render() {


        return (
             <Component {...this.props} />
        )
    }
  }
  function mapStateToProps(state) {
    return {
      token: state.token,
      storeId: state.storeId
    };
  }

  function mapDispatchToProps(dispatch,props) {
    return {
      goLogin(history) {
        let token = getCookie("token");
        let expireTime = getCookie("expireTime");
        if(token === "" || token == null){
          this.getToken(history);
        }
        else{
          let date = new Date().getTime();
          if(parseInt(expireTime, 10) < date){
            this.getToken(history);
          }
          else{
            console.log(token);
            dispatch({
              type: "SET_TOKEN",
              token: token
            });
          }
        };
      },
      setStoreId() {
        console.log("auth set storeId");
        // alert(storeId);
        dispatch({
          type: 'SET_STORE',
          storeId: this.prop.storeId
        })
      },
      getToken(history){
        let code = getQueryString('code');
          if(code == null){
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + host + history.location.pathname + '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
            // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + host + 'wechat.yisongbld.com/user' + '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
          }
          else{
            let formData = new FormData();
            formData.append('code', code);
            fetch(ajaxhost+'/auth/weixin/', {
                method: 'POST',
                body: formData
            }).then((res) => {
              if(res.ok){
                res.json().then(function(result){
                    if(result.code === 200){
                      console.log(result.data);
                      setCookie("token", result.data.token);
                      setCookie("expireTime", result.data.expireTime);
                      dispatch({
                        type: "SET_TOKEN",
                        token: result.data.token
                      });
                    }
                    else if(result.code === 400){
                      let path = host + '/register';
                      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appid +'&redirect_uri='+ path +'&response_type=code&scope=snsapi_userinfo#wechat_redirect';
                    }
                    else{
                      console.log(result);
                    }
                })
              }
            }).catch((res)=>{
                console.log(res);
            });
          }
      },
      getPosition(){
        let  url = window.location.href.split("#")[0];
        // alert(url);
        fetch(ajaxhost+'/wechat/jssdk/signature?url=' + url, {
            method: 'GET'
        }).then((res) => {
          if(res.ok){
            res.json().then(function(result){
                if(result.code === 200){
                  let data = result.data;
                  console.log(url,"------------------config url");
                  window.wx.config({
                    debug: false,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: [
                      'openLocation',
                      'getLocation',
                      'showOptionMenu',
                      'closeWindow',
                      'chooseWXPay',
                      'openProductSpecificView',
                      'addCard',
                      'chooseCard',
                      'openCard'
                    ]
                  });
                }
            })
          }
        }).catch((res)=>{
            console.log(res);
        });
      },
      getConfig() {
        // let url = window.location.href.split("#")[0];
        // alert(url);
        let url = host+"/home";
        fetch(ajaxhost+'/wechat/jssdk/signature?url=' + url, {
          method: 'GET'
        }).then((res) => {
          if (res.ok) {
            res.json().then(function (result) {
              if (result.code === 200) {
                let data = result.data;
                window.wx.config({
                  //   var jweixin = require('react-jweixin');
                  // jweixin.config({
                  debug: true,
                  appId: data.appId,
                  timestamp: data.timestamp,
                  nonceStr: data.nonceStr,
                  signature: data.signature,
                  jsApiList: [
                    'openLocation',
                    'getLocation',
                    'showOptionMenu',
                    'closeWindow',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                  ]
                });
              }
            })
          }
        }).catch((res) => {
          console.log(res);
        });
      }
    };
  }
  Component.AuthenticatedComponent = connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
  return Component.AuthenticatedComponent;
}

export default requireAuthentication;