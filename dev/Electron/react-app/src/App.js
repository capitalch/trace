import logo from './logo.svg'; 
import './App.css';
// import {ipcRenderer} from 'electron'
const odbc = window.require('odbc')
const ipcRenderer = window.require('electron')
// const isElectron = require('is-electron')
// let ipcr
// if(isElectron()){
//   var { ipcRenderer } = require('electron')
//   const fs = require('fs')
//   ipcr = ipcRenderer
// }



function App() {
  return (
    <div className="App">
      <button
        onClick={handleClick}
      >
        Import data
      </button>
    </div>
  )

  function handleClick() {
    odbcConnect()
  }

  async function odbcConnect() {
    const connString = 'DSN=service'
    // const connString = "CommLinks=TCPIP{},DatabaseName=service, ServerName=server, UserID=dba, Password=sql"
    try {
      const conn = await odbc.connect(connString)
      console.log('Successfully connected')
      const data = await conn.query('select * from company_master')
      console.log(data)
    } catch (e) {
      console.log(e)
    }
  }
}

export default App;
