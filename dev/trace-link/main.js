const { app, BrowserWindow } = require('electron')
// const url = require('url')
// const path = require('path')
// const config = require('./config.json')
// const { odbcConnect } = require('./artifacts/mock-odbc')

function createWindow() {
    const win = new BrowserWindow({
        width: 1080,
        height: 800,
        title:'Trace import utility',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        args: process.argv,
    })
    
    win.loadFile('react-app/build/index.html')
    // win.webContents.openDevTools()
}

app.whenReady()
    .then(createWindow)
    .catch((e) => console.log(e))

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// const template = [
//     {
//         label: 'Custom',
//         submenu: [
//             {
//                 label: 'Sale',
//                 click: async () => {
//                     const saleDat = await odbcConnect('track-sale-sms', [
//                         '2021-04-02',
//                     ])
//                     const saleData = saleDat.map(x=>x)
//                     const len = saleData.length
//                     for(let i=0 ; i< len; i++){ // map function did not work. It returned promise
//                       const billMemoId = saleData[i].bill_memo_id
//                       const produc = await odbcConnect('track-get-product-details', [billMemoId])
//                       const products = produc.map(x=>x)
//                       saleData[i].products = products
//                     }
                    
//                     // console.log(saleData)
//                 },
//             },
//             {
//                 label: 'Product details',
//                 click: () => odbcConnect('track-get-product-details', [4]),
//             },
//         ],
//     },
// ]

// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)
