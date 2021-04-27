const { app, BrowserWindow, Notification, ipcMain, Menu } = require('electron')
const url = require('url')
const path = require('path')
const {odbcConnect} = require('./artifacts/mock-odbc')

function createWindow () {
  const win = new BrowserWindow({
    width: 1080,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    args: process.argv
  })

  win.loadFile('react-app/build/index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(createWindow)
.catch((e) => console.log(e));

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

const template = [
  {
      label: 'Custom',
      submenu: [
          {
              label: 'Sale',
              click: () => odbcConnect('track-sale-sms', ['2021-04-02'])
          },
          {
              label: 'Product details',
              click: ()=> odbcConnect('track-get-product-details', [4])
          }
      ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)