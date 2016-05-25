module.exports = screenshot;

var fs = require('fs');
var electron = require('electron');
var BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;

function screenshot(opt, cb) {
  cb = cb || function() {};
  if (opt.url && opt.height && opt.width && opt.filename) {
     captureUrl(opt, cb);
  } else {
    throw new Error('options `url`, `filename`, `width` and `height` are required');
  }
}

function captureUrl(opt, cb) {
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

  win.loadUrl(opt.url);
  win.webContents.on('did-finish-load', function() {
    setTimeout(function() {
      win.capturePage(function(img) {
        fs.writeFile(opt.filename, img.toPng(), cb);
        win.close();
      });
    }, (opt.delay || 0));
  });
}
