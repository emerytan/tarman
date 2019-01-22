const net = require('net')
const ipaddr = '10.208.79.51'
var ioTable = {}
var ioRegex = /(^[0-9]{1,2})\s([0-9]{1,2})/
var chunk = ""


const bmdRouter = net.createConnection({
        port: 9990,
        host: ipaddr
}, () => {
        console.log('connected to router...')
})

bmdRouter.on('connect', (socket) => {
    console.log('connected')
})

bmdRouter.on('data', (data) => {
    chunk += data.toString()
    var index = chunk.indexOf('\n')
    while (index > -1) {
        var line = chunk.substring(0, index)
        chunk = chunk.substring(index + 1)
        parseData(line)
        index = chunk.indexOf('\n')
    }
    chunk = ''
})

bmdRouter.on('error', (error) => {
    console.log(error)
})


function parseData(z) {
   var ioarr = ioRegex.exec(z)
   if (ioarr !== null) ioTable[ioarr[1]] = ioarr[2]
}


setTimeout(() => {
    console.log(ioTable)
    bmdRouter.end()
}, 5000);

