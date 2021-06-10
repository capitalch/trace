const { app, BrowserWindow, Notification, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile('react-app/build/index.html')
  win.webContents.openDevTools()
  // win.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, "react-app/build/index.html"),
  //     protocol: "file",
  //     slashes: true,
  //   })
  // );

  // win.webContents.openDevTools(); // to open dev toools // This way data is sent to renderer / react application
  win.webContents.on("dom-ready", () => {
    win.webContents.send("MAIN-EVENT", "jkljlkjljljkl");
  });
  try {
    let filePath;
    if (fs.existsSync("config.json")) {
      filePath = path.resolve("config.json");
    } else {
      filePath = path.join(__dirname, "..", "config.json");
      // console.log("app path:", app.getAppPath());
      // console.log("dirname:", __dirname);
    }
    console.log("filePath:", filePath);
    const temp = fs.readFileSync(filePath, { encoding: "utf8" });
    const config = JSON.parse(temp);
    console.log(config.name);
  } catch (e) {
    console.log(e.message);
  }
}

ipcMain.on("TEST-EVENT", (e, a) => {
  console.log("Args from renderer", a);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
