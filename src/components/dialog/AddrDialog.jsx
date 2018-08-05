import React from 'react';
import './dialog.css';
import { Icon } from 'antd';

class MessDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show: props.showMess,
            data: props.data
        }
    }
    hideMess(){
        let show = false;
        this.setState({show}, ()=> this.props.hideMess(show));
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            show : nextProps.show,
            data: nextProps.data
        });
    }
    selectStore(item){
        this.props.selectStore(item);
    }
    cancel = () => {
        this.hideMess()
    }
    render(){
        const {data} = this.state;
        var cancelIcon = this.props.toCancel ? <Icon type="close-circle" onClick={this.cancel}/>:"";
        console.log("addr toCanel",this.props.toCancel);
        return(
            <div className="detail-dialog">
                <div className="mask"></div>
                <div className="addr-dialog">
                    <div className="close-mess close-addr-mess">
                        <div className="dialog-title">请选择门店 {cancelIcon}</div>
                    </div>
                    {
                        data.map((item, index) => (
                            <div className="store-item" key={index} onClick={this.selectStore.bind(this,item)}>
                                <div className="store-name">{item.storeName}</div>
                                <div className="store-addr">{item.address}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default MessDialog;