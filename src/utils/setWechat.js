import React from 'react';
import {connect} from 'react-redux';
import ajaxhost from '../ajaxhost';
function setWeChat(Component, type){
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

        this.props.getPosition();
        return;
    }

    render() {
        return <Component {...this.props}/>
    }
  }
  function mapStateToProps(state) {
    return {
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      getPosition(){
        let  url = window.location.href.split("#")[0];
        fetch(ajaxhost+'/wechat/jssdk/signature?url=' + url, {
            method: 'GET'
        }).then((res) => {
          if(res.ok){
            res.json().then(function(result){
                if(result.code === 200){
                  let data = result.data;
                 let interval = setInterval(() => {
                    console.log("setWechat interval");
                     window.wx.config({
                       debug: false, //调试模式
                       appId: data.appId, //公众号的唯一标识
                       timestamp: data.timestamp, //生成签名的时间戳
                       nonceStr: data.nonceStr, //生存签名的随机串
                       signature: data.signature, //签名
                       jsApiList: [ //JS接口列表
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
                     }
                    );
                    window.wx.checkJsApi({
                      jsApiList: ['getLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                      success: function (res) {
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                        clearInterval(interval);

                        console.log(res);
                        console.log("setWechat success");
                      }
                    });
                 },1000)

                }
            })
          }
        }).catch((res)=>{
            console.log(res);
        });

      }
    };
  }
  Component.AuthenticatedComponent = connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
  return Component.AuthenticatedComponent;
}

export default setWeChat;