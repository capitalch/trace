const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const odbc = require("odbc");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Following lines are necessary for window.require to work in react-app
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("react-app/build/index.html");
  win.webContents.openDevTools();
}

app
  .whenReady()
  .then(createWindow)
  .catch((e) => console.log(e));

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const template = [
  {
    label: "Custom",
    submenu: [
      {
        label: "Export inventory",
        click: () => odbcConnect(),
      },
    ],
  },
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

async function odbcConnect() {
  const connString = "DSN=Acc";
  try {
    fs.readFile(
      path.join(__dirname, "sql", "create-temp-files.sql"),
      async (error, data) => {
        if (error) {
          throw error;
        }
        try {
          const conn = await odbc.connect(connString);
          console.log("Successfully connected");
        } catch(e){
            console.log(e.message)
        }
        // const ret = await conn.query(data.toString())
      }
    );

    //   console.log(data)
  } catch (e) {
    console.log(e);
  }
}
