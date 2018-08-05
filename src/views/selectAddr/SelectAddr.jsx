import React from 'react';
import './selectAddr.css';
import {Link} from 'react-router-dom';
import ReturnBar from '../../components/returnBar/ReturnBar';
import AddressItem from '../../components/addressItem/AddressItem';
import { connect } from 'react-redux';
import ajaxhost from '../../ajaxhost';

class SelectAddr extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            addresses: []
        }
    }
    componentDidMount(){

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
                    if(result.code === 200){
                        that.setState({
                            addresses: result.data
                        })
                    }
                })
            }
        }).catch((res) => {
            console.log(res);
        })
    }
    select(item){
        localStorage.setItem("select", JSON.stringify(item));
        this.props.history.goBack();
    }
    render(){
        const {addresses} = this.state;
        return(
            <div className="select-addr">
                <ReturnBar title="选择地址"></ReturnBar>
                {
                    addresses.map((item, index) => (
                        <AddressItem key={index} item={item} type="select" selectAddr={this.select.bind(this, item)}></AddressItem>
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
export default connect(mapStateToProps, mapDispatchToProps)(SelectAddr);