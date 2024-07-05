const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");
const _ = require("lodash");

const { app, BrowserWindow, ipcMain, shell } = electron;

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: { backgroundThrottling: false },
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});
//this promise is if you have multiple videos , callback functions doesnt start 
//alltogether it starts in a random order , so we make it to start together by
//using a promise. 
ipcMain.on("videos:added", (event, videos) => {
  const promises = _.map(videos, (video) => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, metadata) => {
        video.duration = metadata.format.duration;
        video.format = "avi";
        resolve(video);
      });
    });
  });
  Promise.all(promises).then((results) => {
    mainWindow.webContents.send("metadata:complete", results);
  });
});
//video conversion 
ipcMain.on("conversion:start", (event, videos) => {
  _.each(videos, (video) => {
    const outputDirectory = video.path.split(video.name)[0];
    const outputName = video.name.split(".")[0];
    const outputPath = `${outputDirectory}${outputName}.${video.format}`;

    ffmpeg(video.path)
      .output(outputPath)
      .on("progress", ({ timemark }) =>
        mainWindow.webContents.send("conversion:progress", { video, timemark })
      )
      .on("end", () =>
        mainWindow.webContents.send("conversion:end", { video, outputPath })
      )
      .run();
  });
});

ipcMain.on("folder:open", (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});
