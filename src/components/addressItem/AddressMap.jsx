import React from 'react';
import {Icon} from 'antd';

class AddressMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      init:false,
      center:"",
      // init_:false
    }
  }

  componentDidMount(){
    let that = this;
    // new Promise((resolve) => {

    //   let center_;
    //   window.wx.ready(function () {
    //     window.wx.getLocation({
    //       success: function (res) {
    //         let lat_ = res.latitude;
    //         let lnt_ = res.longitude;
    //         that.setState({
    //           lat: lat_,
    //           lnt: lnt_,
    //         })
    //         center_ = new window.AMap.LngLat(lnt_, lat_);
    //         // alert("setLocation wx did mount");
    //       }
    //     });
    //   })
    //   resolve(center_)
    // }).then(center_ => {
      window.AMapUI.loadUI(['misc/PositionPicker', 'overlay/SimpleMarker'], function (PositionPicker, SimpleMarker) {
        that.map = new window.AMap.Map('map', {
          zoom: 15,
          // center: center_,
          mapStyle: 'amap://styles/normal', //设置地图的显示样式
        })

        that.initPicker(PositionPicker);
        that.initMaker(SimpleMarker);
        console.log(that.map.getCenter(), "auto");
        that.map.on('complete', function () {
          // 地图图块加载完成后触发
          that.setLocation();
        });
        that.map.on('click', function (e) {
          that.props.updateLocation(e.lnglat.getLng(), e.lnglat.getLat());
          console.log(e);
          that.props.closeMap();
        });
      // });
    });
}

  componentWillReceiveProps(nextProps){
    // if(this.props.type==='edit'){
      if (!(nextProps.lat === -1 || isNaN(nextProps.lat) || nextProps.lat===undefined||this.map === undefined||this.state.init)){
      //用来保存初始化时的center
      this.setState({
        lat: nextProps.lat,
        lnt: nextProps.lnt,
        init:true
      })
      console.log(nextProps.lnt);
      console.log(this.state.lnt);
      let center = new window.AMap.LngLat(nextProps.lnt, nextProps.lat)
      this.map.setCenter(center);
      this.marker.setPosition(center);
     }
    // }else{
    //   if (!( this.state.init_ || isNaN(nextProps.lat_) || nextProps.lat_===undefined||this.map === undefined)){
    //     this.setState({
    //       init_:true
    //     })
    //   let center = new window.AMap.LngLat(nextProps.lnt_, nextProps.lat_)
    //   // this.map.setCenter(center);
    //   this.marker.setPosition(center);
    //   console.log(this.marker.getPosition());
    //   }
    // }

  }

  // onClick
  updateLocation(){
    let props = this.props;
    if (!(this.props.lat === -1 || isNaN(this.props.lat) || this.props.lat === undefined || this.map === undefined)) {
      this.setState({
        lat: props.lat,
        lnt: props.lnt,
      })
      console.log(props.lnt);
      console.log(this.state.lnt);
      let center = new window.AMap.LngLat(props.lnt, props.lat)
      this.map.setCenter(center);
      this.marker.setPosition(center);
    }
  }
  setLocation() {
    let that = this;
    window.wx.ready(function () {
      window.wx.getLocation({
        success: function (res) {
          let lat_ = res.latitude;
          let lnt_ = res.longitude;
          that.setState({
                    lat: lat_,
                    lnt: lnt_,
                  })
          let center = new window.AMap.LngLat(lnt_, lat_);
          // alert("wx setLocation");
          that.map.setCenter(center);
          that.marker.setPosition(center);
        }
      });
    })
  }

initPicker=(PositionPicker)=>{
  let that = this;
  var positionPicker = new PositionPicker({
    mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
    map: this.map,//依赖地图对象
    iconStyle: {//自定义外观
      url: '//webapi.amap.com/ui/1.0/assets/position-picker2.png',//图片地址
      size: [48, 48],  //要显示的点大小，将缩放图片
      ancher: [24, 40],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
    }
  });

  positionPicker.on('success', function (positionResult) {
    that.setState({
      position: positionResult.position,
      address: positionResult.address
    })
    that.getItems();
    console.log(positionResult);
  });

  positionPicker.on('fail', function (positionResult) {
    that.setState({
      position: positionResult.position,
      address: positionResult.address
    })
    console.log(positionResult);
  });

  positionPicker.start();
}
initMaker=(SimpleMarker)=>{
  // if (isNaN(this.state.lnt)) {
  //   po = this.map.getCenter();
  // }else{
  //   // po = this.state.lnt+","+this.state.lat
  //   po=[this.state.lnt,this.state.lat]
  // }
  this.marker = new SimpleMarker({
    //前景文字
    // iconLabel: {
    //   innerHTML:'<i></i>',
    //   style:{
    //     color:'#fff'
    //   }
    // },
    //图标主题
    iconTheme: 'numv1',
    //背景图标样式
    iconStyle: 'red',
    //...其他Marker选项...，不包括content
    map: this.map,
    // position: po
    position:this.map.getCenter()

  })
  console.log(this.lat_,this.lnt_,"-------------");
}

  getItems() {
    let that = this;
      // + "&type=" + "141200|130000|120000|080000|090000|170000&sortrule=distance", {
    fetch('https://restapi.amap.com/v3/place/around?key=09f13ffb9b4e34a8c411d3644baaa5c9&location='+this.state.position
      // + "&type=130000|010100|060000|120000|080000|090000|150000|170000|160100|142100|070000&sortrule=distance"
      + "&type=141207|120000|160100|170000|141200|060101|060102|070700|070200|080100|080300|140000|090100|100000|110100|130100|130500&radius=1000&sortrule=distance"
      , {
      method: 'GET'
    }).then((res) => {
      if (res.ok) {
        res.json().then(function (result) {
          if (result.info) {
            // that.setState({
            //   items: result.pois
            // })
            that.props.updateItems(result.pois);
          }
        })
      }
    }).catch((res) => {
      console.log(res);
    })
  }
  reload(){
    if(this.map !== undefined) {
      this.map.setCenter(this.marker.getPosition())
    }
  }

  render(){

    let keyMap = "09f13ffb9b4e34a8c411d3644baaa5c9";
    let width_ = window.screen.width;
    let height_ = window.screen.height;
    let style_={
      width: width_,
      height: height_ *0.4,
      position:'relative'
    }
    const buttonStyle = {
      position:'absolute',
      bottom:'10%',
      right:'8%',
      zIndex:'100',
      color:'rgb(243, 66, 52)',
      backgroundColor:'#fff',
      borderRadius:'50%',
      padding:'4px'
    }
    return (
      <div id="map" style={style_}>
        {/* <button style={buttonStyle} className="map-button">huuuhuhu</button> */}
        <Icon type="reload" style={buttonStyle} onClick={this.reload.bind(this)}/>
      </div>
    )
  }
}
export default AddressMap;