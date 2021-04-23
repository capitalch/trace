const { app, BrowserWindow, Menu } = require('electron')
const url = require('url')
const path = require('path')
const odbc = require('odbc')
const connString = 'DSN=service'
// const connString = "Driver='C:\\Program Files\\SQL Anywhere 11\\bin64\\dbodbc11.dll'; Server=server;DBN=service;UID=DBA;PWD=sql"
const template = [
    {
        label: 'Custom',
        submenu: [
            {
                label: 'odbc',
                click: () => odbcConnect()
            }
        ]
    }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // win.loadURL(
    //     url.format({
    //         pathname: path.join(__dirname, 'react-app/build/index.html'),
    //         protocol: 'file',
    //         slashes: true,
    //     })
    // )


    win.loadFile('react-app/build/index.html')
    // win.loadFile('index.html')
    win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

async function odbcConnect() {
    try {
        const conn = await odbc.connect(connString)
        console.log('Successfully connected')
        const data = await conn.query('select * from company_master')
        console.log(data)
    } catch (e) {
        console.log(e)
    }
}

// function odbcConnect() {
//     console.log('Starting odbc connect')
//     odbc.connect(connString, (err, conn) => {
//         if (err) {
//             return console.log(err)
//         }
//         console.log('Successfully connected')

//         conn.query('select * from company_master', (err, data) => {
//             if (err) {
//                 console.log('Db error:', err)
//             } else {
//                 console.log(data)
//             }
//         })
//         conn.close(() => {
//             console.log('db closed')
//         })
//     })
// }