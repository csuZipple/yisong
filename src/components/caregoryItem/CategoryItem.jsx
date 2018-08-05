import React from 'react';
import './categoryItem.css';
import asyncComponent from '../../utils/asyncComponent';

const SlideNav = asyncComponent(() => import("./SlideNav"));
const CategoryContent = asyncComponent(() => import('./CategoryContent'));

class CategoryItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            categoryId: props.categoryId,
            subCategorys: props.subCategorys,
            category: 0,
            goods: props.goods
        }
    }
    componentDidMount() {
        this.refs.category.style.height = (document.body.clientHeight - 220) + "px";
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            categoryId: nextProps.categoryId,
            subCategorys: nextProps.subCategorys,
            goods: nextProps.goods
        })
    }
    shouldComponentUpdate(){
        return true;
    }
    changeCate(categoryId){
        if(categoryId !== this.state.category){
            this.setState({
                category: categoryId
            })
            this.props.changeCate(categoryId);
        }
    }
    render(){
        let {goods, subCategorys} = this.state;
        let goods_;
        if(goods===null||(JSON.stringify(goods)==='[]')){
            goods_ = ""
        }else{
            goods_ =
                goods.map((good, index) => (
                    <CategoryContent good={good} key={index}></CategoryContent>
                ))
        }
        return (
            <div className="caregoty-item">
                <SlideNav subCategorys={subCategorys} changeCate={(categoryId) => this.changeCate(categoryId)}></SlideNav>
                <div className="category-goods" ref="category">
                    {goods_}
                </div>
            </div>
        )
    }
}

export default CategoryItem;