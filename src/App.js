import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'
import Web3 from 'web3';
import { v4 as uuidv4 } from 'uuid';


function App() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [isConnected, setIsConnected] = useState(false)

  function detectMetamaskExtension() {
    let ethProvider;
    const { etherium, web3 } = window;
    if (etherium) {
      ethProvider = etherium;
    } else if (web3) {
      ethProvider = web3.currentProvider;
    } else {
      console.log('you are not logined with MetaMusk wallet');
    }
    return ethProvider;
  }

  // check MetaMask installation status
  useEffect(() => {
    const { web3 } = window;
    !web3 ? setIsMetaMaskInstalled(false) : setIsMetaMaskInstalled(true)
  }, [])


  async function connectToMetaMask() {
    try {
      const userProvider = detectMetamaskExtension()

      // You should only initiate a connection request in response to direct user action,
      // such as clicking a button.You should always disable the "connect" button while the connection request is pending.
      // You should never initiate a connection request on page load.
      const web3 = new Web3(userProvider) // web3 main class

      // get acc info
      //access the user's Ethereum account(s)
      const publicKey = await userProvider.request({ method: 'eth_requestAccounts' });
      // Get wallet balance
      let ethBalance = await web3.eth.getBalance(publicKey[0]);
      console.log('ethBalance:', ethBalance);
      // save to localStorage
      saveInfoToLocalStorage([
        {
          name: 'Public key',
          data: publicKey[0],
        },
      ]);
    } catch (err) {
      console.log(err)
    }
  }

  function disconnectMetaMask() {
    window.localStorage.removeItem('userInfo');
    setUserInfo({});
    setIsConnected(false);
  };

  useEffect(() => {
    function checkConnectedWallet() {
      const userData = JSON.parse(localStorage.getItem('userInfo'));
      if (userData != null) {
        setUserInfo(userData);
        setIsConnected(true);
      }
    }
    checkConnectedWallet();
  }, []);

  function saveInfoToLocalStorage(data) {
    window.localStorage.setItem('userInfo', JSON.stringify(data))
    const userData = JSON.parse(window.localStorage.getItem('userInfo'))
    setUserInfo(userData)
    setIsConnected(true)
  }

  const buttonTitle = !isConnected ? 'Get public key' : 'Log out'
  const statusTitle = !isMetaMaskInstalled ? 'MetaMusk is locked. Please login' : 'MetaMusk is available!'

  function onClick() {
    return !isConnected ? connectToMetaMask() : disconnectMetaMask()
  }



  return (
    <div className="App">
      <main>
        <div className='wrapper'>
          <h1>Check your MetaMusk Wallet stats</h1>
          {
            isConnected &&
            <>
              <h2 className='heading'>Account details:</h2>
              <ul className='wallet-info'>
                {
                  userInfo.map(item => <li className='wallet-info__item' key={uuidv4()}>{item.name}: {item.data}</li>)
                }
              </ul>
            </>
          }
          <button className='button' onClick={onClick}>
            {buttonTitle}
          </button>
          {
            !isConnected &&
            <p className='status'>{statusTitle}</p>
          }
        </div>
      </main>
    </div>
  );
}

export default App;
