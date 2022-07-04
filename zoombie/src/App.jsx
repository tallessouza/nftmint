
import React, { useEffect, useState } from "react";
import './styles/App.css';
import zombie from './z2.svg';
import zombie2 from './z6.svg';

import { ethers } from "ethers";
import abi from './utils/Nft.json'


// Constants
const TWITTER_HANDLE = '_buildspace';
// const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// const OPENSEA_LINK = '';
// const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x465866a929c88cdEc92Caa3360150e1087aef89B";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  var [link, setLink] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;


    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (!ethereum) {
        alert("Garanta que possua a Metamask instalada!");
        return;
      } else {
        //console.log(ethereum.chainId)
        if (ethereum.chainId != "0x4"){
          alert("Se conecte na rinkeby");
          await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x4' }],
           }) 
          return;
        }
      }

    if (accounts.length !== 0) {
      const account = accounts[0];
      //console.log("Autorizadoooo:", account);
      setCurrentAccount(account);
      //setupEventListener()
    } else {
      //console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        //console.log("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]); 
      setupEventListener()
    } catch (error) {
      //console.log(error);
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Conectar
    </button>
  );
   const setupEventListener = async () => {
    // é bem parecido com a função
     const onNewMint = (svg, id) => {
      let svg64 = `data:image/svg+xml;base64,${btoa(svg)}`
      //window.open(svg64, '_blank');
      setLink(svg64)
      var win = window.open();
      win.document.write(`<iframe src="${svg64}"frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'><\/iframe>`);
      window.open(`https://testnets.opensea.io/assets/rinkeby/${CONTRACT_ADDRESS}/${Number(id)-1}`)       
      //console.log(svg64)
    };
    try {
      const { ethereum } = window

      if (ethereum) {
        // mesma coisa de novo
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

        // Aqui está o tempero mágico.
        // Isso essencialmente captura nosso evento quando o contrato lança
        // Se você está familiar com webhooks, é bem parecido!
        connectedContract.on("NewMint", onNewMint);

       //console.log("Setup event listener!")
      } else {
       //console.log("Objeto ethereum não existe!")
      }
    } catch (error) {
     //console.log(error)
    }
  }
  
   useEffect(() => {
     checkIfWalletIsConnected();  
   },[])
  
  const askContractToMintNft = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

      //console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.mint();

      //console.log("Mining...please wait.")
      await nftTxn.wait();
     //console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
    } else {
      //console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    //console.log(error)
  }
}
  
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          
          <p className="header gradient-text">ZOOMBIES EVERYWHERE</p>
          <p className="sub-text">
            Minta um zumbizaço aí cara!<br/>Ao clicar em mintar, aguarde a transação finalizar.<br/> Você será redirecionado ao opensea automaticamente.<br/>
           Dá uma olhada na <a href='https://testnets.opensea.io/collection/zoombie' target={'_blank'}>Coleção</a>
          </p>
          <img alt="Twitter Logo"  src={zombie2} /><br/>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mintar
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={zombie} />
          <p className="sub-text">Meu Git: <a href='https://github.com/tallessouza' target={'_blank'}>tallessouza</a></p>
          
        </div>
      </div>
    </div>
  );
};

export default App;