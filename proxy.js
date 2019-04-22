const axios = require("axios")
const Web3 = require("web3")

const web3 = new Web3()

const conf = {
    network: "https://api-ropsten.etherscan.io/",
    contractAddress: "0xe7cbb89e1649047035833dee5426662a4c0c363b",
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

function getCertification(hashedCertificationId) {
    console.log(`Get certification by ${hashedCertificationId}`);

    return target.get("/api", {
        params: {
            data: encodingFunc("certifications", hashedCertificationId)
        }
    }).then(res => {
        const cert = web3.eth.abi.decodeParameters([
            {"name": "subject", "type": "string"}, 
            {"name": "firstName", "type": "string"}, 
            {"name": "lastName", "type": "string"}, 
            {"name": "issueDate", "type": "uint64"}, 
            {"name": "expireDate", "type": "uint64"}, 
            {"name": "additionalData", "type": "string"}], 
            res.data.result)

            let {
              subject,
              firstName,
              lastName,
              issueDate,
              expireDate,
              additionalData
            } = cert;

            additionalData = JSON.parse(additionalData);

            return {
              subject,
              firstName,
              lastName,
              issueDate,
              expireDate,
              additionalData
            };

   }).catch(console.err)

}


function encodingFunc(funcName, hashedIdCardNumber) {
    return web3.eth.abi.encodeFunctionCall(
        {
            "name": funcName, 
            "type": "function",
            "inputs": [{"name": "hashedIdCardNumber", "type": "uint256"}]
        }, [hashedIdCardNumber])
}

module.exports = {getWinner, getCertification}