const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// Register custom protocol scheme
if (!app.isDefaultProtocolClient('cfmnui')) {
  app.setAsDefaultProtocolClient('cfmnui');
}

let mainWindow = null;
let deeplinkUrl = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, 'logo.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allow HTTP requests from HTTPS context
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Bypass CORS by intercepting and modifying response headers
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['*'],
        'Access-Control-Allow-Methods': ['GET, POST, PUT, DELETE, OPTIONS'],
        'Access-Control-Allow-Headers': ['*'],
        'Access-Control-Allow-Credentials': ['true']
      }
    });
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Handle deep link after window is ready
  mainWindow.webContents.on('did-finish-load', () => {
    if (deeplinkUrl) {
      mainWindow.webContents.send('deep-link', deeplinkUrl);
      deeplinkUrl = null;
    }
  });

  // Open DevTools in development (optional - remove for production)
  // mainWindow.webContents.openDevTools();
}

// Handle deep links on macOS
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('deep-link', url);
  } else {
    deeplinkUrl = url;
  }
});

// Handle deep links on Windows/Linux (when app is already running)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    // Handle deep link from second instance
    const url = commandLine.find(arg => arg.startsWith('cfmnui://'));
    if (url && mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.webContents.send('deep-link', url);
    }
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // Handle deep link from command line args (Windows/Linux initial launch)
  const url = process.argv.find(arg => arg.startsWith('cfmnui://'));
  if (url) {
    deeplinkUrl = url;
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
