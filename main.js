const {
	app,
	BrowserWindow
} = require('electron')

let mainWindow

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 800,
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