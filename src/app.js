const ipc = require('electron').ipcRenderer
const {
	dialog
} = require('electron').remote
const {
	exec,
	spawn
} = require('child_process')
const path = require('path')
const fs = require('fs')


const headerText = document.getElementById('headerText')
const ioState = document.getElementById('ioState')
const appMessages = document.getElementById('appMessages')
const bashtag = document.getElementById('bashtag')
const t1ArchiveSrc = document.getElementById('t1ArchiveSrc')
const shellOut1 = document.getElementById('shellOut1')
const tape1 = document.getElementById('tape1')
var tape1Archive = {}
var appPath



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
	appPath = message
	console.log(appPath)
	console.log(process.cwd());
})




ipc.on('check drive', (event, message) => {
	checkTape(message.element, message.device, message.div)
})


let cmdButtons = document.getElementsByName('tapeCommands')
for (var index = 0; index < cmdButtons.length; index++) {
	cmdButtons[index].addEventListener('click', (event) => {
		let commandInfo = event.target.dataset
		tapeCommand(commandInfo.device, commandInfo.command, commandInfo.shell)
	})
}

document.getElementById('tape1getDir').addEventListener('click', (event) => {
	let commandInfo = event.target.dataset
	
	dialog.showOpenDialog({
		buttonLabel: 'Directory to be Archived',
		properties: ['openDirectory', 'createDirectory']
	}, (selection) => {
		if (selection) {
			tape1Archive.srcPath = selection[0]
			t1ArchiveSrc.innerText = `src path: ${selection[0]}`
			getSize(selection[0], commandInfo.shell)
		}
	})
})


document.getElementById('tape1archive').addEventListener('click', (event) => {

	let scriptPath = path.resolve(process.cwd(), 'bashScripts', 'runTape1.sh')
	
	fs.exists(scriptPath, (exists) => {
		if (exists) {
			runArchive(scriptPath, tape1Archive.srcPath, event.target.dataset.shell)
		} else {
			tape1.style.color = 'red'
			tape1.innerText = 'path to script not valid'
		}
	})


}, false)



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


function getSize(s, output) {
	
	let d = exec(`du -sh ${s} | cut -f1`, (error, stdout, stderr) => {
		if (!error || !stderr) {
			document.getElementById(output).innerText = `dir size: ${stdout}`
		} else {
			document.getElementById(output).innerText = `stderr: ${stderr}`
			document.getElementById(output).innerText = `error: ${error}`	
		}
	})

	d.on('close', (code) => {
		appMessages.innerText = `size request exit code ${code}`
	})
}


function checkTape(element, drive, div) {
	
	let show = document.getElementById(element)

	exec(`lsscsi | grep ${drive}`, (error, stdout, stderr) => {

		if (stderr || error) {
			show.style.color = 'red'
			show.innerText = `${element} not available`
			disableButtons(div)
		} else {
			show.style.color = 'green'
			show.innerText = `${element} ready`
			shellOut1.innerText = stdout
		}
 

	})
}

function disableButtons(div) {
	
	let element = document.getElementById(div).getElementsByTagName('button')

	for (let index = 0; index < element.length; index++) {
		element[index].disabled = true
	}
}



function runArchive(script, source, element) {
	
	let show = document.getElementById(element)
	let b = path.basename(tape1Archive.srcPath)
	
	const t = spawn(script, [source])
	tape1.style.color = 'cyan'
	tape1.innerText = `archiving ${path.basename(source)}`
	
	t.stdout.on('data', (data) => {
		shellOut1.style.color = 'green'
		show.innerText += data
	})
	
	t.stderr.on('data', (data) => {
		show.style.color = 'yellow'
		show.innerText = data
	})
	
	t.on('error', (error) => {
		show.style.color = 'red'
		show.innerText += error
	})
	
	t.on('close', (code) => {
		if (code === 0) {
			tape1.style.color = 'green'
			tape1.innerText = `finished archiving ${b}`
		} else {
			tape1.style.color = 'yellow'
			tape1.innerText = `error while arvhivig ${b}`
		}
	})

}
