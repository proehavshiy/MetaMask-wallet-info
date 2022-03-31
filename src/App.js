import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'
import Web3 from 'web3';
import { v4 as uuidv4 } from 'uuid';
import { CONSTANTS_PHRASES } from './constants/constants'


function App() {
  const { NOTLOGINED, LOGINED, BADCONNECTION, BTN_OK, BTN_CONNECTING, BTN_LOGOUT } = CONSTANTS_PHRASES

  const [userInfo, setUserInfo] = useState({})
  const [isConnected, setIsConnected] = useState(false)
  const [isBtnDisabled, setIsBtnDisabled] = useState(false)
  const [statusTitle, setStatusTitle] = useState(NOTLOGINED)

  function detectMetamaskExtension() {
    let ethProvider;
    const { etherium, web3 } = window;
    if (etherium) {
      ethProvider = etherium;
    } else if (web3) {
      ethProvider = web3.currentProvider;
    } else {
      setStatusTitle(NOTLOGINED)
    }
    return ethProvider;
  }

  // check MetaMask installation status
  useEffect(() => {
    const { web3 } = window;
    !web3
      ? setStatusTitle(NOTLOGINED)
      : setStatusTitle(LOGINED)
  }, [])


  async function connectToMetaMask() {
    try {
      // disable button
      setIsBtnDisabled(true)
      const userProvider = detectMetamaskExtension()

      // You should only initiate a connection request in response to direct user action,
      // such as clicking a button.You should always disable the "connect" button while the connection request is pending.
      // You should never initiate a connection request on page load.
      const web3 = new Web3(userProvider) // web3 main class

      //access the user's Ethereum account(s)
      const publicKey = await userProvider.request({ method: 'eth_requestAccounts' });
      // Get wallet balance
      let ethBalance = await web3.eth.getBalance(publicKey[0]);
      // ...other details

      //save to localStorage
      saveInfoToLocalStorage([
        {
          name: 'Public key',
          data: publicKey[0],
        },
        {
          name: 'balance',
          data: ethBalance,
        },
      ]);
    } catch (err) {
      setStatusTitle(BADCONNECTION)
    } finally {
      // enable button
      setIsBtnDisabled(false)
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

  const buttonTitle = !isConnected
    ? (!isBtnDisabled ? BTN_OK : BTN_CONNECTING)
    : BTN_LOGOUT

  function onClick() {
    return !isConnected ? connectToMetaMask() : disconnectMetaMask()
  }

  return (
    <div className="App">
      <main>
        <div className='wrapper'>
          <h1>Check your MetaMusk Wallet info</h1>
          {
            isConnected &&
            <>
              <h2 className='heading'>Details:</h2>
              <ul className='wallet-info'>
                {
                  userInfo.map(item =>
                    <li className='wallet-info__item' key={uuidv4()}>
                      {item.name}: {item.data}
                    </li>
                  )
                }
              </ul>
            </>
          }
          <button className='button' onClick={onClick} disabled={isBtnDisabled}>
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
