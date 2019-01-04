const { spawn } = require('child_process')



const t = spawn('/usr/local/bin/runTape1.sh', ['/home/tarman/Downloads/cal_dpx'])



t.stdout.on('data', (data) => {
    console.log(data.toString())
})

t.stderr.on('data', (data) => {
    console.log('stderr...')
    console.log(data.toString());
})


t.on('close', (code) => {
    if (code === 0) {
        console.log(code);
    } else {
       console.log(`error: ${code}`);
    }
})
