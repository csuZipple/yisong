import React from 'react';
import {connect} from 'react-redux'; 

function setStoreId(Component, type){
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

      // 判断登陆
        const storeId  = this.props.storeId;
        if(storeId === "" || storeId == null || storeId === undefined){
            this.props.setStoreId();
        }
        return;
    }

    render() {
        return <Component {...this.props}/>
    }
  }
  function mapStateToProps(state) {
    return {
      storeId: state.storeId
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      setStoreId(){
        dispatch({
            type: 'SET_STORE',
            storeId: 1
        })
      }
    };
  }
  Component.AuthenticatedComponent = connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
  return Component.AuthenticatedComponent;
}

export default setStoreId;