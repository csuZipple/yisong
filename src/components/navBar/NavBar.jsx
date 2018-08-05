import React from 'react';
import {Link} from 'react-router-dom';
import './navBar.css'

const qiniu = "http://pa5o8t6ay.bkt.clouddn.com/";
const linkHeader = "/home/";

class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: props.type,
            // display: [true, false, false, false, false, false, false, false, false, false],
            categorys: props.categorys,
            colors: ["rect-native", "rect-bin", "rect-drink", "rect-cigarette", "rect-xue", "rect-life", "rect-spices", "rect-top", "rect-adult", "rect-native"],
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            categorys: nextProps.categorys
        })
        if (this.state.type === "category") {
            let match = this.props.context.match.params.categoryId;
            let cate_ = this.state.categorys;
            for (let index = 0; index < cate_.length; index++) {
                if (match === cate_[index].categoryId) {
                    this.refs.navbar.scrollLeft = 45 * index;
                    console.log("hihi");
                    break;
                }
            }
        }
    }
    shouldComponentUpdate(){
        return true;
    }
    render(){
        const {type, categorys, colors} = this.state;
        if(type === "home"){
            return(
                <div className="nav-bar" ref="navbar">
                {
                    categorys.map((data, index) => (
                        <Link className="nav-item" to={linkHeader + data.categoryId} key={index}>
                            <div className={["rect", colors[index]].join(" ")}>
                                <img className="img-icon" src={data.icon} alt=""/>
                            </div>
                            <div className="nav-title">{data.categoryName}</div>
                        </Link>
                    ))
                }
                </div>
            )
        }
        else{
            let match = this.props.context.match.params.categoryId;
            return (
                <div className="nav-bar-cat" ref="navbar">
                {
                    categorys.map((data, index) => (
                        <Link className="nav-item-cat" to={linkHeader + data.categoryId} key={index} onClick={this.props.display(data.categoryId)}>
                            <div className={["rect", colors[index]].join(" ")}>
                                {/* <img className="img-icon" src={qiniu + data.categoryId + '.png'} alt=""/> */}
                                <img className="img-icon" src={data.icon} alt="" />
                            </div>
                            <div className="nav-title">{data.categoryName}</div>
                            <div className={`${match}` === `${data.categoryId}`?["nav-item-cat-active", colors[index]].join(" ") : "nav-cat-hide"}></div>
                        </Link>
                    ))
                }
                </div>
            )
        }
    }
}
export default NavBar;