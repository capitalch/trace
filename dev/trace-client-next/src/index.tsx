import React from 'react';
import ReactDOM from 'react-dom'; //-old
// import ReactDOM from 'react-dom/client'
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

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
