import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Web3 = require("web3");

const web3 = new Web3();

interface Config {
  network: string;
  contractAddress: string;
  apiKey: string;
}

const conf: Config = {
  network: "https://api-ropsten.etherscan.io/",
  contractAddress: "0xe7cbb89e1649047035833dee5426662a4c0c363b",
  apiKey: "UK1C9AYRMU7BG3ZA2F87MZZ4P3F84VKEXG"
};

const axiosConfig: AxiosRequestConfig = {
  baseURL: conf.network,
  params: {
    module: "proxy",
    action: "eth_call",
    to: conf.contractAddress,
    apikey: conf.apiKey
  },
  timeout: 10000
};

const target = axios.create(axiosConfig);

function encodingFunc(funcName: string, hashedCertificationId: string) {
  return web3.eth.abi.encodeFunctionCall(
    {
      name: funcName,
      type: "function",
      inputs: [{ name: "hashedCertificationId", type: "uint256" }]
    },
    [hashedCertificationId]
  );
}

interface Certification {
    subject: string,
    firstName: string,
    lastName: string,
    issueDate: string,
    expireDate: string,
    additionalData: any
}

export const getCertification: (hashedCertificationId: string) => Promise<Certification> = (hashedCertificationId: string) => {
  console.log(`Get certification by ${hashedCertificationId}`);
  return target
    .get("/api", {
      params: {
        data: encodingFunc("certifications", hashedCertificationId)
      }
    })
    .then(res => {
      const cert = web3.eth.abi.decodeParameters(
        [
          { name: "subject", type: "string" },
          { name: "firstName", type: "string" },
          { name: "lastName", type: "string" },
          { name: "issueDate", type: "uint64" },
          { name: "expireDate", type: "uint64" },
          { name: "additionalData", type: "string" }
        ],
        res.data.result
      );

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
      }
    })
};
