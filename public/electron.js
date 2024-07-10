const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Preload dosyasının yolu
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadURL('http://localhost:3000');

  ipcMain.on('toggle-full-screen', (event, isFullScreen) => {
    mainWindow.setFullScreen(isFullScreen);  // Tam ekran modunu açma/kapama
    if (isFullScreen) {
      mainWindow.setMenuBarVisibility(false);  // Tam ekran modunda menü çubuğunu gizle
    } else {
      mainWindow.setMenuBarVisibility(true);  // Tam ekran modunda değilse menü çubuğunu göster
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();  // Tüm pencereler kapatıldığında uygulamayı sonlandır
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();  // Eğer pencere yoksa yeni bir pencere oluştur
  }
});
