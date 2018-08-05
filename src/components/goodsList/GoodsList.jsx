import React from 'react';
import './goodsList.css';
import asyncComponent from '../../utils/asyncComponent';

const GoodsItem = asyncComponent(() => import("../../components/goodsList/GoodsItem"));

class GoodsList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show: false,
            data: props.lists
        }
    }
    shouldComponentUpdate(){
        return true;
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            data: nextProps.lists
        })
    }
    render() {
        const {data} = this.state;
        return (
            <div className="goods-div">
                {
                    data.map((item, index) => (
                        <div className="goods-list" key={index}>
                            <div className="goods-title">{item.menuName}</div>
                            <div className="items">
                                {
                                    item.goodsList.map((list, index) => (
                                        <GoodsItem item={list} key={index} ></GoodsItem>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default GoodsList;