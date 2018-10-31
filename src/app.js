import io from 'socket.io-client'

const socket = io.connect()
const headerText = document.getElementById('headerText')
const ioState = document.getElementById('ioState')
const appMessages = document.getElementById('appMessages')
const bashtag = document.getElementById('bashtag')

socket.on('connect', () => {
	headerText.innerText = 'Sixteen19 LTO Duplicator'
	headerText.style.color = 'orange'
	ioState.innerText = 'socket connected'
	appMessages.innerText = 'null'
	bashtag.innerText = 'BashTag bash'
	bashtag.style.color = '#ddd'
})

