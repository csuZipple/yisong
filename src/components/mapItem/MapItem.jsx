import React from 'react';
import './mapItem.css';

class MapItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            item: props.item
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            item: nextProps.item
        })
    }
    render(){
        const {item} = this.state;
        let district;
        if(item.district === undefined || item.district === null){
             district = <div className="item-district">{item.district}</div>
        }else{
            district = <div className="item-district">{item.cityname}{item.adname}</div>
        }
        return(
            <div className="map-item" onClick={this.props.selectItem(item)}>
                <div className="name">
                    <div className="item-name">{item.name}</div>
                    <div className="item-address">{item.address}</div>
                </div>
                {/* <div className="item-district">{item.district}</div> */}
                {district}
            </div>
        )
    }
}

export default MapItem;