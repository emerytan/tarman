const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron')

let mainWindow

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 900,
		'min-width': 800,
		'min-height': 200,
		'accept-first-mouse': true,
		'title-bar-style': 'hidden'
	})
	mainWindow.loadURL(`file://${__dirname}/index.html`)
	mainWindow.on('closed', function () {
		mainWindow = null
	})
	// mainWindow.webContents.openDevTools()
	
})

ipcMain.on('init', (event) => {
	event.sender.send('app path', app.getAppPath())
})
