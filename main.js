const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron')
const {exec} = require('child_process')

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
	mainWindow.webContents.on('did-finish-load', () => {
		
		setTimeout(() => {
			mainWindow.webContents.send('check drive', {
				device: 'st0',
				element: 'tape1',
				div: 'leftCont'
			})
		}, 1000)


		setTimeout(() => {
			mainWindow.webContents.send('check drive', {
				device: 'st1',
				element: 'tape2',
				div: 'rightCont'
			})
		}, 2000)
	})
	
})

ipcMain.on('init', (event) => {
	event.sender.send('app path', app.getAppPath())
})

