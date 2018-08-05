import React from 'react';
import {Input, Icon} from 'antd';
import './searchBar.css'
import { connect } from 'react-redux';
import ajaxhost from '../../ajaxhost';

class SearchBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          keyword: '',
          show: false,
          toshow:false,
          datas: [
            // {
            //   "categoryId": "00010002",
            //   "costPrice": 4,
            //   "description": null,
            //   "goodsId": "40041001",
            //   "goodsName": "红烧牛肉面（桶装）",
            //   "id": 1,
            //   "keyword": "方便面",
            //   "lowStock": 200,
            //   "marketPrice": 4.5,
            //   "picture": "http://cdn.yisongbld.com/manager/dist/img/photo1.png",
            //   "publish": 1,
            //   "putTime": "201806130945",
            //   "salePrice": 5,
            //   "stock": 999,
            //   "unit": "个"
            // }
          ]
        };
      }

    emitEmpty = () => {
      this.keywordInput.focus();
      this.setState({ keyword: '' });
    }
    onChangeKeyword = (e) => {
      this.setState({
        keyword: e.target.value
      }, function(){
        this.searchGoods();
      });
    }
    searchGoods(){
      let that = this;
      let storeId = this.props.storeId;
      fetch(ajaxhost+'/stores/'+storeId + '/keyword/' + this.state.keyword, {
        method: 'GET'
      }).then((res) => {
          if(res.ok){
              res.json().then(function(result){
                  if(result.code === 200){
                    console.log(result.data);
                    that.setState({
                      datas: result.data
                    })
                  }
              })
          }
      }).catch((res) => {
          console.log(res);
      })
    }
    showDetail(){
      // 是否显示搜索中的提示
      this.setState({
        show: true,
        toshow:true
      })
      document.body.style.position = 'fixed';
    }
    hideDetail(){
      this.setState({
          show: false,
          toshow:false
      })
      document.body.style.position = 'static';
    }
    selectGoods(item){
      this.hideDetail();
      if (typeof this.props.selectGoods === 'function'){
        this.props.selectGoods(item);
      }else{
        console.log("ERROR:this.props");
        this.showDetail();
      }
    }
    toCancel = () => {
      this.setState({
        show: false,
        toshow: false,
        keyword: ''
      })
      this.keywordInput.blur();
      document.body.style.position='static';

    }
    render(){
      let info = {
        marginLeft:'1rem',
        fontSize:'1.6rem'
      }
        const { keyword, show, datas ,toshow} = this.state;
        const suffix = keyword ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        const after = toshow?<span onClick={this.toCancel}>取消</span>:null;
        let results = ""
        if (JSON.stringify(datas) === '[]' && keyword) {
          results = <p style={info}>暂无商品</p>
        }else{
          results =
            datas.map((item, index) => (
              <div className="result-content" key={index} onClick={this.selectGoods.bind(this, item)}>
                <div className="first-search">
                  <div className="img-search-div">
                    <img src={item.picture} alt="商品图片" className="img-search" />
                  </div>
                  <div className="goods-name">{item.goodsName}</div>
                </div>
                <div className="goods-price">¥{(item.salePrice).toFixed(2)}</div>
              </div>
            ))
        }
        return (
            <div className="search-bar">
                <Input
                    id = "searchBar"
                    className="search-input"
                    placeholder="搜索商品"
                    addonAfter={after}
                    prefix={<i className="iconfont icon-search"></i>}
                    suffix={suffix}
                    value={keyword}
                    onFocus={this.showDetail.bind(this)}
                    onInput={this.onChangeKeyword}
                    // onChange={this.onChangeKeyword}
                    ref={node => this.keywordInput = node}/>

            <div className={show ? "map" : "hide"}>
                    <div className="add-mask" ref="mask"></div>
                    <div className="add-dialog">
                        {results}
                    </div>
                </div>
             </div>
        );
    }
}
function mapStateToProps(state) {
  console.log(state);
  return {
      storeId: state.storeId
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
      setStoreId(storeId){
          console.log(storeId);
          dispatch({
              type: 'SET_STORE',
              storeId: storeId
          })
      }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);