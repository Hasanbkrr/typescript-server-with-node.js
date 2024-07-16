const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL('http://localhost:3000');

  ipcMain.on('toggle-full-screen', (event, isFullScreen) => {
    mainWindow.setFullScreen(isFullScreen);
    if (isFullScreen) {
      mainWindow.setMenuBarVisibility(false);
    } else {
      mainWindow.setMenuBarVisibility(true);
    }
  });

  ipcMain.on('save-file', (event, { name, data }) => {
    console.log('Received save-file event');
    const desktopPath = app.getPath('desktop');
    const appFolderPath = path.join(desktopPath, 'SliderApp');
    const sourceFolderPath = path.join(appFolderPath, 'source');

    if (!fs.existsSync(appFolderPath)) {
      fs.mkdirSync(appFolderPath);
      console.log('Created SliderApp folder');
    }
    if (!fs.existsSync(sourceFolderPath)) {
      fs.mkdirSync(sourceFolderPath);
      console.log('Created source folder');
    }

    const filePath = path.join(sourceFolderPath, name);
    fs.writeFileSync(filePath, Buffer.from(data));
    console.log('File saved at:', filePath);

    event.returnValue = filePath;
  });

  ipcMain.handle('get-files', async () => {
    const desktopPath = app.getPath('desktop');
    const sourceFolderPath = path.join(desktopPath, 'SliderApp', 'source');
    const files = [];

    if (fs.existsSync(sourceFolderPath)) {
      const fileNames = fs.readdirSync(sourceFolderPath);

      fileNames.forEach((fileName) => {
        const filePath = path.join(sourceFolderPath, fileName);
        const fileStat = fs.statSync(filePath);
        const fileType = fileName.endsWith('.mp4') ? 'video' : fileName.endsWith('.png') ? 'image' :null;

        if (fileType) {
          files.push({
            name: fileName,
            src: filePath,
            duration: 5, // varsayılan süre, isteğe bağlı olarak ayarlanabilir
            type: fileType
          });
        }
      });
    }

    return files;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
