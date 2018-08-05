import React from 'react';
import './addAddress.css';
import {connect} from 'react-redux';
import ReturnBar from '../../components/returnBar/ReturnBar';
import  {Input, message, Radio, Icon, Button}  from  'antd';
import MapItem from '../../components/mapItem/MapItem';
import ajaxhost from "../../ajaxhost";
import AddressMap from '../../components/addressItem/AddressMap';

const RadioGroup = Radio.Group;

class AddAddress extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            keyword: '',
            receiveName: "",
            tel: "",
            detail: "",
            show: false,
            value: 2,
            map: "",
            city: "",
            items: [],
            lat: -1,
            lnt: -1,
            title: "新增地址",
            type: props.match.params.type,
            addressId: "",
            showMap:true
        }
    }
    componentDidMount(){
        const {type} = this.state;
        console.log(type);
        if(type === "edit"){
            let item = JSON.parse(localStorage.getItem("editItem"));
            console.log(item);
            // 测试数据
            // let lat=28.142942;
            // let lnt= 112.994888;
            // item.location=lat+","+lnt;
            let loc = item.location.split(",")
            let address = item.address.split(":")
            this.setState({
                receiveName: item.name,
                tel: item.phone,
                detail: address[1],
                value: item.isDefault,
                title: "编辑地址",
                addressId: item.addressId,
                map: address[0],
                lat: loc[1],
                lnt: loc[0]
            })

            // fetch('http://restapi.amap.com/v3/geocode/regeo?key=09f13ffb9b4e34a8c411d3644baaa5c9&location=' + item.location +
            //     "&type=130000|010100|050000|060000|120000|080000|090000|150000|170000|160100", {
            //     method: 'GET'
            // }).then((res) => {
            //     if(res.ok){
            //         res.json().then(function(result){
            //             console.log(result);
            //             if(result.info){
            //                 let map = result.regeocode.formatted_address;
            //                 console.log(map);
            //                 console.log(item.location);
            //                 var loc = item.location.split(",")
            //                 that.setState({
            //                     receiveName: item.name,
            //                     tel: item.phone,
            //                     detail: item.address,
            //                     value: item.isDefault,
            //                     title: "编辑地址",
            //                     addressId: item.addressId,
            //                     map: map,
            //                     lat: loc[1],
            //                     lnt: loc[0]
            //                 })
            //             }
            //         })
            //     }
            // }).catch((res) => {
            //     console.log(res);
            // })
        }
        // else{
        //    this.setLocation();
        // }
    }

    emitEmpty = () => {
        this.keywordInput.focus();
        this.setState({ keyword: '' });
    }
    onChangeKeyword = (e) => {
        this.setState({
            keyword: e.target.value ,

        });
        this.getItems();
        // this.updateMapCenter();
    }
    onFocus = ()=>{
        this.setState({
            showMap: false
        })
    }
    // setCenter(){
    //     let that = this;
    //     window.wx.ready(function () {
    //         window.wx.getLocation({
    //             success: function (res) {
    //                 let lat_ = res.latitude;
    //                 let lnt_ = res.longitude;
    //                 that.setState({
    //                     lat_: lat_,
    //                     lnt_: lnt_,
    //                 })
    //                 alert(res);
    //             }
    //         });
    //     })
    // }
    updateLocation = (lnt,lat) =>{
        let that = this;
        // let location = val.split(",");
        this.setState({
            lnt:lnt,
            //维度，在后面
            lat:lat
        },function(){
            // that.getItems();
            let location = this.state.lnt+","+this.state.lat;
            fetch('http://restapi.amap.com/v3/geocode/regeo?key=09f13ffb9b4e34a8c411d3644baaa5c9&location=' + location, {
                method: 'GET'
            }).then((res) => {
                if(res.ok){
                    res.json().then(function(result){
                        console.log(result);
                        if(result.info){
                            let map = result.regeocode.formatted_address;
                            console.log(map);
                            that.setState({
                                map: map
                            })
                        }
                    })
                }
            }).catch((res) => {
                console.log(res);
            })
            console.log(this.state.lnt,"  ",this.state.lat);
        })
    }
    updateKeyword = (val) =>{
        this.setState({
            keyword:val
        },function(){
            // that.getItems();
            console.log(this.state.keyword);
        })
    }
    onChangeName(e){
        this.setState({
            receiveName: e.target.value
        })
    }
    onChangeMap  = (e)=>{
        // this.setState({
        //     map: e.target.value
        // })
        e.preventDefault();
        this.setState({
            show:true,
            detail:e.target.value+" "+this.state.detail
        })
    }
    notNull(data){
        if(data == null || data === ""){
            return false;
        }
        else{
            return true;
        }
    }
    onChangeTel(e){
        this.setState({
            tel: e.target.value
        })
    }
    onChangeDetail(e){
        this.setState({
            detail: e.target.value
        })
    }
    validateTel(){
        if(this.notNull(this.state.tel,)){
            if(this.validate(this.state.tel)){
                console.log(true);
            }
        }
        else{
            message.warning("手机号码不能为空哦");
        }
    }
    validate(data){
        var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
        if (!phoneReg.test(data)) {
            message.warning('请输入有效的手机号码');
            return false;
        }
        else{
            return true;
        }
    }
    focusMap = (e)=>{
        e.preventDefault();
        this.setState({
            show:true
        })
    }
    showMap(){
        this.setState({
            show: true,
            // keyword:this.state.map
        })
        message.info("点击或拖动选址");
        // if(this.state.type === 'add'){
        //     this.setCenter();
        // }

        // fetch('http://restapi.amap.com/v3/ip?key=09f13ffb9b4e34a8c411d3644baaa5c9&ip', {
        //     method: 'GET'
        // }).then((res) => {
        //     if(res.ok){
        //         res.json().then(function(result){
        //             console.log(result);
        //             that.setState({
        //                 city: result.city
        //             })
        //         })
        //     }
        // }).catch((res) => {
        //     console.log(res);
        // })
    }

    hideDetail(){
        this.setState({
            show: false,
            showMap:true,
            keyword:""
        })
    }
    onChange(e){
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }
    saveAddr(){
        // 保存新增地址
        let that = this;
        let token = this.props.token
        if(this.notNull(this.state.tel) && this.notNull(this.state.receiveName) && this.notNull(this.state.detail) && this.notNull(this.state.map)){
            if(this.validate(this.state.tel)){
                let formData = new FormData();
                formData.append("name", this.state.receiveName);
                formData.append('phone', this.state.tel);
                formData.append('address', this.state.map+":"+this.state.detail);
                formData.append('default', this.state.value);
                formData.append('lat', this.state.lat);
                formData.append('lnt', this.state.lnt);
                fetch(ajaxhost+'/addresses/', {
                    method: 'POST',
                    headers: {
                        'Ys-user': token
                    },
                    body: formData
                }).then((res) => {
                    if(res.ok){
                        res.json().then(function(result){
                            console.log(result);
                            if(result.code === 200){
                                message.success("地址添加成功");
                                that.props.history.goBack();
                            }
                        })
                    }
                }).catch((res)=>{
                    console.log(res);
                });
            }
        }
        else{
            message.warning("请填写完整信息");
        }
    }
    saveEditAddr(){
        let that = this;
        let token = this.props.token;
        const {tel, receiveName, detail, value, lat, lnt, addressId, map} = this.state;
        if(this.notNull(tel) && this.notNull(receiveName) && this.notNull(detail) && this.notNull(map)){
            if(this.validate(tel)){
                let params = "name=" + receiveName + "&phone=" + tel + "&address=" + this.state.map + ":" + this.state.detail + "&default=" + value + "&lat=" + lat + "&lnt=" + lnt;
                let headers = new Headers();
                headers.append('Ys-user',token);
                console.log("token in put address : ",token)
                fetch(ajaxhost+'/addresses/' + addressId + '?' + params, {
                    method: 'PUT',
                    headers:headers,
                }).then((res) => {
                    if(res.ok){
                        res.json().then(function(result){
                            console.log(result);
                            if(result.code === 200){
                                message.success("地址修改成功");
                                that.props.history.goBack();
                            }
                        })
                    }
                }).catch((res)=>{
                    console.log(res);
                });
            }
        }
        else{
            message.warning("请填写完整信息");
        }
    }
    onKeyUp(e){
        if(e.keyCode === 13){
            this.getItems();
        }
    }
    search(){
        this.getItems();
    }
    getItems(){
        let that = this;
        fetch('http://restapi.amap.com/v3/assistant/inputtips?key=09f13ffb9b4e34a8c411d3644baaa5c9&keywords=' + this.state.keyword + '&city=' + this.state.city, {
            method: 'GET'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    // console.log(result);
                    if(result.info){
                        that.setState({
                            items: result.tips
                        })
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    selectItem(data){
        console.log(data);
        let address;
        if(data.district === undefined){
            address = data.cityname+data.adname+data.address+data.name
        }else{
            address = data.district + data.name;
        }
        // let address = data.district + data.name;
        let location = (data.location).split(",");
        this.setState({
            map: address,
            lnt: location[0],
            lat: location[1]
        })
        this.hideDetail();
    }

    updateItems(val){
        this.setState({
            items:val
        })
    }

    hideSearchDetail(){
        this.setState({
            showMap:true
        })
    }
    closeMap(){
        this.setState({
            show:false
        })
    }
    render(){
        const {receiveName, tel, detail, show, map, keyword, items, title, type,lat,lnt,showMap,lat_,lnt_} = this.state;
        // if(lat===undefined||lnt===undefined){
        //     console.log("???");
        //     this.setLocation();
        // }
        let height_;
        if(showMap){
            height_ = window.screen.height/2;
        }else{
            height_ = 'auto';
        }
        const style = {
            height:height_,
            overflow:'scroll',
            display:'block'
        }
        let addressMap;
        let cancelButton;
        if(showMap) {
            addressMap =  <AddressMap type={type} lat={lat} lnt={lnt} lat_={lat_} lnt_={lnt_} updateItems={this.updateItems.bind(this)} updateLocation={this.updateLocation.bind(this)} closeMap={this.closeMap.bind(this)}/>;
            cancelButton = ""
        }else{
            addressMap=""
            cancelButton = < Button type = "primary" onClick = { this.hideSearchDetail.bind(this) } > 取消</Button >
        }
        console.log("test lat_lnt",lat,lnt);
        const suffix = keyword ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
        let Operation = type === "edit"?<div className="register" onClick={this.saveEditAddr.bind(this)}>保存返回</div>: <div className="register" onClick={this.saveAddr.bind(this)}>保存返回</div>
        return(
            <div className="add-register">
                <ReturnBar title={title}></ReturnBar>
                <div className="input-div">
                    <div className="input-title">收货人：</div>
                    <Input className="add-input" onChange={this.onChangeName.bind(this)} value={receiveName}></Input>
                </div>
                <div className="input-div">
                    <div className="input-title">手机号码：</div>
                    <Input className="add-input" onChange={this.onChangeTel.bind(this)} value={tel}></Input>
                </div>
                <div className="input-div">
                    <div className="input-title">地图定位：</div>
                    <textarea className="add-input textarea map-input" onFocus={this.focusMap} onChange={this.onChangeMap} value={map}></textarea>
                    <i className="iconfont icon-icon010 map" onClick={this.showMap.bind(this)}></i>
                </div>
                <div className="input-div">
                    <div className="input-title">详细地址：</div>
                    <textarea className="add-input textarea" onChange={this.onChangeDetail.bind(this)} value={detail}></textarea>
                </div>
                <div className="input-div">
                    <div className="input-title">默认地址：</div>
                    <RadioGroup onChange={this.onChange.bind(this)} value={this.state.value} className="choose-default">
                            <Radio name="way" value={1}>是</Radio>
                            <Radio name="way" value={2} checked>否</Radio>
                    </RadioGroup>
                </div>
                <div className="btn-register">
                    {Operation}
                </div>
                <div className={show?"map" : "hide"}>
                    <div className="add-mask" onClick={this.hideDetail.bind(this)}></div>
                    <div className="add-dialog">
                        <div className="search">
                            <i className="iconfont icon-left add-return-icon" onClick={this.hideDetail.bind(this)}></i>
                            <Input
                                className="search-input"
                                placeholder="输入地址"
                                prefix={<i className="iconfont icon-search"></i>}
                                suffix={suffix}
                                value={keyword}
                                onKeyUp={this.onKeyUp.bind(this)}
                                onChange={this.onChangeKeyword}
                                onFocus={this.onFocus}
                                ref={node => this.keywordInput = node}/>
                            {/* <Button type="primary" onClick={this.search.bind(this)}>搜索</Button> */}
                            {cancelButton}
                        </div>
                        {addressMap}
                        <div className="result-content" style={style}>
                            {
                                items.map((item, index) => (
                                    <MapItem item={item} key={index} selectItem={(data) => this.selectItem.bind(this, data)}></MapItem>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
      token: state.token
    };
  }

function mapDispatchToProps(dispatch, props) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAddress);