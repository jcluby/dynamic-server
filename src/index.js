const express = require('express')
const util = require('util');
const Fs = require('fs')
const Axios = require('axios')

const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(Fs.writeFile)

const app = express()
const port = process.env.PORT || 3000

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.json({
        name: process.env.SERVER
    })
})


app.post('/', async (req, res) => {
    try {
        const url = process.env.URL_PROCESS
        const response = await Axios({
            url,
            method: 'GET'
        })
        if(!response.data){
            res.json({
                message: 'ERROR GET PROCESS'
            })
            return
        }
        const filename = `process_${new Date().getTime()}.json`
        await writeFile(`./tmp/${filename}`, JSON.stringify(response.data))
        await exec(`npx pm2 start ./tmp/${filename}`).catch(err => { console.log(err); });
        res.json({
            message: 'updated'
        })

    } catch (error) {
        res.json({
            message: 'updated error'
        })
    }

})

app.listen(port, () => {
    console.log(`Server ${process.env.SERVER} port ${port}`)
})