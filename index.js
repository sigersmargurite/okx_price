import fetch from 'node-fetch'
import compression from 'compression'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import express from 'express'

const app = express()

var trust_ips = []

const checkLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    message: 'Please wait',
    headers: true
})

app.set('port', (process.env.PORT || 5000))
app.use(express.json())
app.use(compression())
app.use(cors())
app.use('/price', checkLimiter)

app.get('/price', checkLimiter, (req, resp) => {
    try {
        const inst = req.query.inst
        const url = `https://www.okx.com/priapi/v5/market/mult-tickers?t=${new Date()}&instIds=${inst}`

        const response = fetch(url, { method: 'post' })
            .then((res) => { 
                return res.json()
            })
            .then((jsonResponse) => {
                const data = jsonResponse
                if (data.code == "0") {
                  resp.send(data)
                }
                throw 0
            })
            .catch((err) => {
                console.error(`Error request ReCaptcha (${ip}): ${err}`);
            })
    } catch (e) {
        console.log(`Error in get price: ${e}`)
        resp.send({ success: false })
    }
})

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost:${app.get('port')}`)
})

process.on('uncaughtException', function (exception) {
    console.error(`Uncaught exception: ${exception}`)
})

