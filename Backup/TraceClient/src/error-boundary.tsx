import React, { Component } from 'react'

// interface IState{
//     error?: string
// }

class ErrorBoundary extends React.Component {
    constructor(props:any) {
      super(props);
      this.state = { hasError: false };
    }
    //This is the lifecycle method of ReactJS which wil called if there will be any js error in child component. It won't called if the error is inside the same components, In our case lets say in ErrorBoundary.
    componentDidCatch(error:any, info:any) {
      this.setState({ hasError: true });
      // You can also log the error to an error reporting service
    //   logErrorToMyService(error, info);
    }
  
    render() {
    const st:any = this.state
      if (st.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong</h1>;
      }
      return this.props.children;
    }
  }

  export {ErrorBoundary}