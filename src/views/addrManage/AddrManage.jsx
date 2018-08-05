import React from 'react';
import './addrManage.css';
import {message} from 'antd';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import ReturnBar from '../../components/returnBar/ReturnBar';
import AddressItem from '../../components/addressItem/AddressItem';
import ajaxhost from '../../ajaxhost';

class AddrManage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            address: []
        }
    }
    componentDidMount(){
        this.getAddress();
    }
    getAddress(){
        console.log("getAddress");
        let that = this;
        let token = this.props.token;
        fetch(ajaxhost+'/addresses/', {
            headers: {
                'Ys-user': token
            },
            method: 'GET'
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    console.log(result);
                    that.setState({
                        address: result.data
                    })
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    deleteItem(item){
        let token = this.props.token;
        let that = this;
        fetch(ajaxhost+'/addresses/' + item.addressId, {
            method: 'DELETE',
            headers: {
                'Ys-user': token
            }
        }).then((res) => {
            if(res.ok){
                res.json().then(function(result){
                    console.log(result);
                    if(result.code === 200){
                        if(result.data === "删除失败"){
                            message.warning("有尚未确认的订单要送到这里，不能删除哦")
                        }else{
                            message.success("地址删除成功");
                            that.getAddress();
                        }
                    }
                })
            }
        }).catch((res)=>{
            console.log(res);
        });
    }

    updateAddress(){
        this.getAddress();
    }
    render(){
        const {address} = this.state;
        return(
            <div className="addr-manage">
                <ReturnBar title="地址管理"></ReturnBar>
                {
                    address.map((item, index) => (
                        <AddressItem key={index} token={this.props.token} item={item} type="manage" deleteItem={this.deleteItem.bind(this)} updateAddress={this.getAddress.bind(this)}></AddressItem>
                    ))
                }
                <Link to="/user/addrManage/add/add" className="btn-register">
                    <div className="register">新增地址</div>
                </Link>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddrManage);