const { app, BrowserWindow, Notification, ipcMain, Menu } = require('electron')
const url = require('url')
const path = require('path')
const {odbcConnect} = require('./artifacts/mock-odbc')

function createWindow () {
  const win = new BrowserWindow({
    width: 1080,
    height: 600,
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
              label: 'odbc',
              click: () => odbcConnect()
          }
      ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)