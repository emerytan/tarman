const ipc = require('electron').ipcRenderer
const {
	spawn
} = require('child_process')
const path = require('path')


const headerText = document.getElementById('headerText')
const ioState = document.getElementById('ioState')
const appMessages = document.getElementById('appMessages')
const bashtag = document.getElementById('bashtag')
const shellOut1 = document.getElementById('shellOut1')
const shellOut2 = document.getElementById('shellOut2')

window.onload = function () {
	headerText.innerText = 'Sixteen19 tarman the apeman'
	headerText.style.color = 'orange'
	ioState.innerText = 'socket connected'
	appMessages.innerText = 'null'
	bashtag.innerText = 'BashTag bash'
	bashtag.style.color = '#ddd'
	ipc.send('init')
}

ipc.on('app path', (event, message) => {
	appMessages.innerText = path.basename(message)
	ioState.innerText = 'IPC connected'
})

document.getElementById('tape1getStat').addEventListener('click', () => {
	console.log('clich')
	ioState.innerText = 'click'
	const ls = spawn('ls', ['-al', process.cwd()])

	ls.stdout.on('data', (data) => {
		shellOut1.innerText = data.toString()
		shellOut2.innerText = data.toString()
	})

}, false)