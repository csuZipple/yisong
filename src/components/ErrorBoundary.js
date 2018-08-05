import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({
      hasError: true
    });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    var errorStyle = {
      color: 'red',
      marginLeft:'1rem'
    }
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p style={errorStyle}>需要确认商品，请后退刷新页面</p>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;