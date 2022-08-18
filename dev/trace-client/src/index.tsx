import React from 'react';
import ReactDOM from 'react-dom'; //-old
// import ReactDOM from 'react-dom/client'
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Following line is used to supress some warning related to useLayoutEffect which has internally some issues with material UI
if (typeof document === 'undefined') {
    React.useLayoutEffect = React.useEffect;
}

// const tempRoot:any = document.getElementById("root")
// const root:any = ReactDOM.createRoot(tempRoot);
// root.render(<App />)

//Old React 17 way
ReactDOM.render(
    <App />, document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
