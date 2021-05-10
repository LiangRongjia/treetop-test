const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const { ipcMain } = require('electron')
// const spawn = require('child_process').spawn
const exec = require('child_process').exec
const fs = require('fs')

const devMode = false
const openDevTools = false

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady()
  .then(() => {
    Menu.setApplicationMenu(null) // 隐藏菜单栏
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 600,
      minHeight: 400,
      frame: false,
      backgroundColor: '#f7f7f7',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    // 加载完成后去除背景色，体现窗口圆角
    mainWindow.once('ready-to-show', () => {
      mainWindow.setBackgroundColor('#00000000')
    })

    devMode
      ? mainWindow.loadURL('http://localhost:3000')
      : mainWindow.loadFile(`${__dirname}/build/index.html`)

    openDevTools
      && mainWindow.webContents.openDevTools()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) window.createWindow()
    })

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') app.quit()
    })

    // 监听渲染进程事件
    ipcMainHandleEvents(mainWindow)
  })

/**监听渲染进程事件
 * @param { BrowserWindow } mainWindow 
 */
function ipcMainHandleEvents(mainWindow) {
  const inputFile = `${__dirname}/data/input.txt`
  // 关闭窗口
  ipcMain.on('closeMainWindow', () => {
    mainWindow.close()
  })
  // 导入 exe 文件
  ipcMain.on('importExeFile', (e, fileBinaryData) => {
    fs.writeFile(`${__dirname}/data/test.exe`, Buffer.from(fileBinaryData), () => { })
  })
  // exe 测试
  ipcMain.on('exeRunTest', async (e, cases) => {
    for (let i in cases) {
      fs.writeFileSync(`${__dirname}/data/input.txt`, cases[i].input)
      const execPromise = new Promise((resolve, reject) => {
        exec(`${__dirname}/data/test.exe<${__dirname}/data/input.txt`, (error, stdout, stderr) => {
          mainWindow.webContents.send('exeTestFinished', {
            key: cases[i].key,
            value: stdout
          })
          resolve()
        })
      })
      await execPromise
    }
  })
  const javaRunPath = `${__dirname}/data/`
  const javaFile = `${__dirname}/data/main.java`
  // 导入 java 文件
  ipcMain.on('importJavaFile', (e, fileBinaryData) => {
    fs.writeFileSync(javaFile, Buffer.from(fileBinaryData))
    exec(`javac main.java`, { cwd: javaRunPath }, (error, stdout, stderr) => { })
  })
  // java 测试
  ipcMain.on('javaRunTest', async (e, cases) => {
    for (let i in cases) {
      fs.writeFileSync(inputFile, cases[i].input)
      const execPromise = new Promise((resolve, reject) => {
        exec(`java main < input.txt`, { cwd: javaRunPath }, (error, stdout, stderr) => {
          mainWindow.webContents.send('javaTestFinished', {
            key: cases[i].key,
            value: stdout
          })
          resolve()
        })
      })
      await execPromise
    }
  })
}
