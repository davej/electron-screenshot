module.exports = screenshot;

var fs = require('fs');
var BrowserWindow;

try {
  BrowserWindow = require('browser-window');
} catch (err) {
  var remote = require('remote');
  BrowserWindow = remote.require('browser-window');
}

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
    'enable-larger-than-screen': true,
    'node-integration': false
  });

  win.loadUrl(opt.url);
  win.webContents.on('did-finish-load', function() {
    setTimeout(function() {
      win.capturePage(function(img) {
        fs.writeFile(opt.filename, img.toPng(), cb);
      });
    }, (opt.delay || 0));
  });
}
