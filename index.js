module.exports = screenshot;

var fs = require('fs');
var electron = require('electron');
var BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;

function screenshot(opt) {
  if (opt.url && opt.height && opt.width) {
     return captureUrl(opt);
  } else {
    Promise.reject('options `url`, `width` and `height` are required');
  }
}

function captureUrl(opt) {
  return new Promise((resolve) => {
    var win = new BrowserWindow({
      x:0,
      y:0,
      width: opt.width,
      height: opt.height,
      show: false,
      frame: false,
      enableLargerThanScreen: true,
      webPreferences: {
        nodeIntegration: false
      }
    });

    win.on('closed', function() {
      win = null;
    });

    win.loadURL(opt.url);
    win.webContents.on('did-finish-load', function() {
      setTimeout(function() {
        win.capturePage(function(img) {
          resolve(img);
          win.close();
        });
      }, (opt.delay || 0));
    });
  });
}
