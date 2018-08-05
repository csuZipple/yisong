import React from "react";
import TopBar from '../../components/topBar/TopBar';

class HelpDetail extends React.Component {
  /**
   * props:titleH
   * content
  **/
  // constructor(props){
  //   super(props);
  //   // 還不知道如何具體的獲取的方式
  //   this.state = {

  //   }
  // }helpId

  render(){
    // console.log(this.props.match.params.helpId);
    var helpId = this.props.match.params.helpId;
    console.log(helpId);
    console.log();
    const contentH = {
      "1":{
        title:"用户协议",
        content:"啦啦啦啦啦啦啦啦"
      },
      2:{
        title:"手机定位失败怎么办",
        content:""
      },
      3:{
        title:"支付订单如何取消",
        content:""
      }

    }
    return(
      <div>
        <TopBar title="信息详情"></TopBar>
        <div className="user-item">
          <div className="item-title">{contentH[helpId].title}</div>
        </div>
        <div className="user-item help-item">
          <div className="item-title">{contentH[helpId].content}</div>
        </div>
      </div>
    )
  }
}
export default HelpDetail;