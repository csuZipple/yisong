import React from 'react';
import './addressItem.css';
import { Popconfirm} from 'antd';
// import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import { message } from "antd";
import ajaxhost from '../../ajaxhost';

class AddressItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            item: props.item,
            checked: props.item.isDefault === 1,
            type: props.type
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            checked: nextProps.item.isDefault === 1,
            item:nextProps.item
        });
    }
    onChange(e) {
        console.log("test-check");
        let flag = e.target.checked;
        this.setState({
            checked: flag,
        });
        let that = this;
        let token = this.props.token;
        // const { tel, receiveName, detail, value, lat, lnt, addressId, map } = this.state.item;
        var {address,addressId,isDefault,name,phone,location}= this.state.item;
        isDefault = isDefault===1?2:1;
        console.log("默认",isDefault);
        var loc = location.split(",")
                let params = "name=" + name + "&phone=" + phone + "&address=" + address + "&default=" + isDefault + "&lat=" + loc[1] + "&lnt=" + loc[0];
                fetch(ajaxhost+'/addresses/' + addressId + '?' + params, {
                    method: 'PUT',
                    headers: {
                        'Ys-user': token
                    }
                }).then((res) => {
                    if (res.ok) {
                        res.json().then(function (result) {
                            console.log(result);
                            if (result.code === 200) {
                                that.props.updateAddress();
                                message.success("默认地址修改成功");
                            }
                        })
                    }
                }).catch((res) => {
                    console.log(res);
                });
    }
    select(){
        let item = this.state.item;
        if(this.state.type === "select"){
            this.props.selectAddr(item);
        }else{
            this.edit();
        }
    }
    edit(){
        localStorage.setItem("editItem", JSON.stringify(this.state.item));
        console.log(this.state.item);
        this.context.router.history.push('/user/addrManage/add/edit');
    }
    cancel(e) {
        console.log(e);
    }
    confirm() {
        this.props.deleteItem(this.state.item);
    }
    render(){
        const {item, checked, type} = this.state;
        return(
            <div className="address-item">
                <div className="top-addr" onClick={this.select.bind(this)}>
                    <div className="addr-top">
                        <div className="name">收货人：{item.name}</div>
                        <div className="tel">{item.phone}</div>
                    </div>
                    <div className="addr">
                        <div>收货地址：</div>
                        <div>{item.address}</div>
                    </div>
                </div>

                <div className={["operation", type === "manage"? "": "select-opera"].join(" ")}>
                    <div className={["checkbox", type === "manage"? "show": "hide"].join(" ")}>
                        <i className={["iconfont icon-yes yes-icon", checked? "checked": "not-check"].join(" ")}></i>
                        <input type="checkbox" name="defaultAddress" className="check-box" id={["default", item.id].join("")} checked={checked} onChange={this.onChange.bind(this)}/>
                        <label htmlFor={["default", item.id].join("")} className="label">默认地址</label>
                    </div>
                    <div className="addr-opera">
                        <span onClick={this.edit.bind(this)} className="op-item">
                            <i className="iconfont icon-edit op-editicon"></i>
                            <span className="op-title">编辑</span>
                        </span>
                        <Popconfirm title="确定删除该地址?" onConfirm={this.confirm.bind(this)} onCancel={this.cancel.bind(this)} okText="确定" cancelText="取消">
                            <span className={["op-item", type === "manage"? "show": "hide"].join(" ")}>
                                <i className="iconfont icon-lvzhou_shanchu_lajitong op-icon"></i>
                                <span className="op-title">删除</span>
                            </span>
                        </Popconfirm>
                    </div>
                </div>
            </div>
        )
    }
}

AddressItem.contextTypes = {
    router: PropTypes.object.isRequired
}
export default AddressItem;