const ipc = require('electron').ipcRenderer
const {
	exec
} = require('child_process')
const path = require('path')


const headerText = document.getElementById('headerText')
const ioState = document.getElementById('ioState')
const appMessages = document.getElementById('appMessages')
const bashtag = document.getElementById('bashtag')


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

let cmdButtons = document.getElementsByName('tapeCommands')
for (var index = 0; index < cmdButtons.length; index++) {
	cmdButtons[index].addEventListener('click', (event) => {
		let commandInfo = event.target.dataset
		tapeCommand(commandInfo.device, commandInfo.command, commandInfo.shell)
	})
}

function tapeCommand(drive, command, output) {
	
	let thisDrive

	if (drive.indexOf(0) !== -1) {
		thisDrive = document.getElementById('tape1')
	} else {
		thisDrive = document.getElementById('tape2')
	}

	thisDrive.innerText = `command: Tape ${drive.slice(8)} ${command}`
	thisDrive.style.color = 'yellow'

	let c = exec(`sudo mt -f ${drive} ${command}`, (error, stdout, stderr) => {
		if (!error || !stderr) {
			document.getElementById(output).innerText = stdout
			appMessages.innerText = `${drive} ${command}`
			appMessages.style.color = 'green'
		} else {
			document.getElementById(output).innerText = `stderr: ${stderr}`
			document.getElementById(output).innerText = `error: ${error}`
			ioState.innerText = `${drive} error`
			ioState.style.color = '#d00'
		}
	})

	c.on('close', (code) => {
		
		console.log(code)

		if (code === 0) {
			thisDrive.innerText = `${command} complete`
			thisDrive.style.color = 'green'
		} else {
			thisDrive.innerText = `Tape ${drive.slice(8)} ${command} exited with code: ${code}`
			thisDrive.style.color = 'red'
		}
	})
}
