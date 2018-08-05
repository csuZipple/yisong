import React from 'react';

class SlideNav extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            index: 0,
            subCategorys: props.subCategorys
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.subCategorys !== this.state.subCategorys){
            this.setState({
                subCategorys: nextProps.subCategorys,
                index:0
            })
        }
    }
    changeCate(i, item){
        this.setState({
            index: i
        }, () => {
            this.props.changeCate(item.categoryId);
        })
    }
    render(){
        const {subCategorys, index} = this.state;
        let slide_;
        if (subCategorys === null || subCategorys === undefined) {
           slide_ = <div className={"slide-item"}></div>
        }else{
            slide_ = subCategorys.map((data, i) => (
                <div className={["slide-item", index === i ? "slide-item-active" : ""].join(" ")} key={i} onClick={this.changeCate.bind(this, i, data)}>{data.categoryName}</div>
            ))
        }
        return (
            <div className="slide-nav">
                {slide_}
            </div>
        )
    }
}

export default SlideNav;