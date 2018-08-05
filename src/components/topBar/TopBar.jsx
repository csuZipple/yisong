import React from 'react';
import './topBar.css';
import PropTypes from 'prop-types'

// title 居中显示
class TopBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title: props.title
        }
    }

    goBack() {
        this.context.router.history.goBack();
    }

    render(){
        return(
            <div className="top-bar">
                <i className="iconfont icon-left return-icon" onClick={this.goBack.bind(this)}></i>
                {this.state.title}
            </div>
        )
    }
}

TopBar.contextTypes = {
    router: PropTypes.object.isRequired
}

export default TopBar;