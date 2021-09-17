import React, { useState } from 'react';
import './App.css';
import { ExportToCsv } from 'export-to-csv';
import { TextField } from '@material-ui/core';

const Web3 = require('web3')
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://ropsten.infura.io/v3/e1c1766ff1094be687df3b73baefaf27"));
//web3.eth.getAccounts(console.log);

const abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_initialSupply",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "standard",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }

]

const contractAddress = '0xDc6E75de4b3355EFcF45741f106Fdf1eCAdF9fF7' // Paste the smart contract address here after you have deployed it
var myContractInstance = new web3.eth.Contract(abi, contractAddress);

const csvExporter = new ExportToCsv();

function App() {
  const [walletAddress, setGetData] = useState([]);
  const [textData, setTextdata] = useState('');
  const [receiptData, setReceiptData] = useState('');
  const [random, setRandom] = useState(0);


  const generateHandler = () => {
    const ethWallet = require('ethereumjs-wallet');
    let addressDatas = [];
    for (let index = 0; index < Number(textData); index++) {
      let addressData = ethWallet['default'].generate();
      addressDatas.push({ id: index + 1, privateKey: addressData.getPrivateKeyString(), address: addressData.getAddressString() })
    }
    setGetData(addressDatas);
  }

  const exportCSV = () => {
    let values = [];
    walletAddress?.forEach((row, key) => {
      values.push(row);
    });
    csvExporter.generateCsv(values);
  };

  console.log({ walletAddress });

  async function transferHandler() {
    let toAddress = walletAddress.map((item) => item?.address);
    console.log({ toAddress })

    // let minValue = 1
    // let maxValue = 100
    // let value = minValue + minValue.random() * (minValue - maxValue);
    // setRandom(value);

    console.log("contract details=>>>>>>>>>>>>>>>>>>>>>>", myContractInstance);
    console.log("contract to value=>>>>>>>>>", toAddress,);
    for (let index = 0; index < toAddress.length; index++) {
      console.log({ index });
      const mint = await myContractInstance.methods.transferFrom(toAddress[index], '0xf9A1024Dc5F0808b181D22b9160423AeAC8960Fa', index + 1);
      console.log("contract to value=>>>>>>>>>", toAddress,);
      console.log({mint});
      const gas = await mint.estimateGas(5000);
      console.log("gas price------------->", gas);
      const data = await mint.encodeABI();
      console.log({data});
      // try {
      //   await web3.eth.sendTransaction(
      //     {
      //       from: '0xf9A1024Dc5F0808b181D22b9160423AeAC8960Fa',
      //       gas: 5000,
      //       gasPrice: 2,
      //       data: data,
      //     }, function (err, receipt) { console.log("Normal Setters: ", receipt) });
      // } catch (error) {
      //   console.log(" Normal Setters: ERROR !", error);
      // }
      const nonce = await web3.eth.getTransactionCount('0xf9A1024Dc5F0808b181D22b9160423AeAC8960Fa')
      console.log({nonce});
      const signedTx = await web3.eth.accounts.signTransaction({
        toAddress,
        data,
        gas:9,
        nonce: nonce,
        chainId: 3
      }, '2eed0f988d30161b216da2836bdfa19dc0d9f6b22ef92767e54f6bc2dd58e94a')
      var receipt = await web3.eth.sendSignedTransaction(signedTx);
      console.log({ receipt });
      receipt.push({ from: contractAddress, to: toAddress, })
      setReceiptData(receipt)
;
    }
  }
  console.log("reciptData = ", receiptData);

  return (
    <div className="App">
      <div className="buttonFirst">
        <TextField
          className="textclass"
          label="enter the value"
          id="textValue"
          variant="outlined"
          type="number"
          value={textData}
          onChange={(e) => setTextdata(e.target.value)}

        />
        <button
          className="generateButton"
          onClick={generateHandler}
        >generte address
        </button>

        <button
          className="generateButton"
          onClick={transferHandler}
        >Transfer
        </button>


        <button
          variant="outlined"
          //disabled={selectedRows.length > 0 ? false : true}
          className="generateButton"
          onClick={() => exportCSV()}
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
}

export default App;

