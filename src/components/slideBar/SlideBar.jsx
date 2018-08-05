import React from 'react';
import './slideBar.css';

let startX;
class SlideBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            index: 0,
            slides: props.slides,
            points: []
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            slides: nextProps.slides
        }, function() {
            this.refreshPoints();
        })
    }
    tick = () => {
        const { index, slides } = this.state;
        let curIndex = 0;

        if(index < slides.length - 1){
            curIndex = parseInt(index, 10) + 1;
        }
        else{
            curIndex = 0;
        }
        this.setState({
            index: curIndex
        })
    }
    touchStart(event) {
        startX = event.changedTouches[0].pageX;
    }

    touchEnd(event) {
        clearInterval(this.interval);
        event.preventDefault();
        const endX = event.changedTouches[0].pageX;
        const { index, slides } = this.state;
        var curIndex = 0;

        if (endX - startX > 20) {
            // alert('左');
            if(index >= 1){
                curIndex = index - 1;
            }
            else{
                curIndex = slides.length - 1;
            }
        }
        else if (startX - endX > 20) {
            if(index < slides.length - 1){
                curIndex = parseInt(index, 10) + 1;
            }
            else{
                curIndex = 0;
            }
        }
        this.setState({
            index: curIndex
        })

        this.interval = setInterval(() => this.tick(), 3000);
    }
    pointClick(i, event){
        this.setState({
            index: i
        })
    }
    refreshPoints(){
        let arr = [];
        for(let i = 0; i < this.state.slides.length; i++){
            arr.push(i);
        }
        this.setState({
            points: arr
        })
    }
    componentDidMount() {
        this.refreshPoints();
        this.interval = setInterval(() => this.tick(), 3000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render(){
        const {slides, index, points} = this.state;
        let slideBanner;
        if (slides !== null) {
            slideBanner =
                slides.map((item, i) => (
                    <li key={i} onTouchStart={this.touchStart.bind(this)} onTouchEnd={(event) => this.touchEnd(event)} className={index === i ? "banner-active" : "banner-item"}> <img src={item.slideUrl} alt="" className="banner-img" /> </li>
                ))
        }else{
            slideBanner = ""
        }
        return (
            <div className="slide-bar">
                <ul className="banner">
                   {slideBanner}
                </ul>
                <ul className="banner points">
                    {
                        points.map((data, i) => (
                            <li onClick={this.pointClick.bind(this, i)} key={i}>
                                <i className={["iconfont icon-point", index === i? "point-active" : "point"].join(" ")}></i>
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    }
}

export default SlideBar;