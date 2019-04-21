const https = require("https")
const fs = require("fs")
const express = require("express")
const axios = require("axios")
const Web3 = require("web3")
const app = express()
const cors = require("cors")
const storage = requre('./storage')
const port = 3000

var privateKey  = fs.readFileSync('./privkey.pem', 'utf8');
var certificate = fs.readFileSync('./cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

app.use(cors())
app.use(express.json({limit: '5mb'}))
app.use(express.static('dist'))

app.get('/winners/:hashedIdCardNumber', (req, res) => getWinner(req.params.hashedIdCardNumber).then(r => res.send(r)))
app.get('/certifications/:hashedIdCardNumber', (req, res) => getCertification(req.params.hashedIdCardNumber).then(r => res.send(r)))

var httpsServer = https.createServer(credentials, app)
httpsServer.listen(port)

const web3 = new Web3()

const conf = {
    network: "https://api-ropsten.etherscan.io/",
    contractAddress: "0x8625953dd94b6e1507204a84e86006ab92ebf4ce",
    API_KEY: "UK1C9AYRMU7BG3ZA2F87MZZ4P3F84VKEXG"
}

const target = axios.create({
    baseURL: conf.network,
    params: {
        module: "proxy",
        action: "eth_call",
        to: conf.contractAddress,
        apikey: conf.API_KEY
    },
    timeout: 10000
})

function getWinner(hashedIdCardNumber) {
    return target.get("/api", { params: { data: encodingFunc("getWinner", hashedIdCardNumber)} })
        .then(res => {
            const result = web3.eth.abi.decodeParameters([
                {"name": "firstName", "type": "string"}, 
                {"name": "lastName", "type": "string"}, 
                {"name": "hashedIdCardNumber", "type": "string"}], res.data.result)

            return { 
                firstName: result.firstName, 
                lastName: result.lastName, 
                hashedIdCardNumber: result.hashedIdCardNumber
            }
        }
    ).catch(console.err)
}

function getCertification(hashedIdCardNumber) {
    return target.get("/api", {
        params: {
            data: encodingFunc("getCertification", hashedIdCardNumber)
        }
    }).then(res => {
        const result = web3.eth.abi.decodeParameters([
            {"name": "certificationType", "type": "string"}, 
            {"name": "subject", "type": "string"}, 
            {"name": "awardDate", "type": "string"}, 
            {"name": "expiredDate", "type": "string"}, 
            {"name": "partner", "type": "string"}], 
            res.data.result)

        return {
            certificationType: result.certificationType, 
            subject: result.subject, 
            awardDate: result.awardDate, 
            expiredDate: result.expiredDate, 
            partner: result.partner
        } 
    }).catch(console.err)

}

function encodingFunc(funcName, hashedIdCardNumber) {
    return web3.eth.abi.encodeFunctionCall(
        {
            "name": funcName, 
            "type": "function",
            "inputs": [{"name": "hashedIdCardNumber", "type": "string"}]
        }, [hashedIdCardNumber])
}

app.post('/photos', function (req, res) {
    storage
      .save(req.body)
      .then(
        photo => res.send({ message: `photo created with id ${photo.id}` }),
        console.err
      );
})

app.get("/photos/:tokenId", (req, res) => {
  storage.fetch(req.params.tokenId).then(results => {
    res.send(results[0]);
  });
});