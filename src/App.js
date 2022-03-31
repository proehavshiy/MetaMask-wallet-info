import pic from './img/MetaMaskLogo.png'
import './App.css';
import { useEffect, useState } from 'react'
import Web3 from 'web3';
import MetaMaskOnboarding from '@metamask/onboarding';
import WalletInfo from './components/WalletInfo/WalletInfo';
import { NotLoginedError } from './errors/NotLoginedError';
import { CONSTANTS_PHRASES } from './constants/constants'

function App() {
  const { NOTLOGINED, LOGINED, BADCONNECTION, BTN_OK, BTN_CONNECTING, BTN_LOGOUT, BTN_INSTALL } = CONSTANTS_PHRASES

  const [userInfo, setUserInfo] = useState({})
  const [isConnected, setIsConnected] = useState(false)
  const [isBtnDisabled, setIsBtnDisabled] = useState(false)
  const [statusTitle, setStatusTitle] = useState(NOTLOGINED)
  const [isOnboarding, setIsOnboarding] = useState(false)

  const onboarding = new MetaMaskOnboarding()

  function getProvider() {
    let ethProvider;
    const { etherium, web3 } = window;
    if (etherium) {
      ethProvider = window.etherium;
    } else if (web3) {
      ethProvider = web3.currentProvider;
    } else {
      setStatusTitle(NOTLOGINED)
    }
    return ethProvider;
  }

  async function connectToMetaMask() {
    try {
      // disable button
      setIsBtnDisabled(true)
      const userProvider = getProvider()
      if (!userProvider) {
        throw new NotLoginedError()
      }

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
          name: 'Balance',
          data: ethBalance + ' eth',
        },
      ]);
    } catch (err) {
      if (err instanceof NotLoginedError) {
        setStatusTitle(NOTLOGINED)
      } else {
        setStatusTitle(BADCONNECTION)
      }
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

  // set status title
  useEffect(() => {
    !MetaMaskOnboarding.isMetaMaskInstalled()
      ? setStatusTitle(NOTLOGINED)
      : setStatusTitle(LOGINED)
  }, [])

  const setBtnTitle = () => {
    return MetaMaskOnboarding.isMetaMaskInstalled()
      ? (!isConnected ? (!isBtnDisabled ? BTN_OK : BTN_CONNECTING) : BTN_LOGOUT)
      : BTN_INSTALL
  }

  function onClick() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      return !isConnected ? connectToMetaMask() : disconnectMetaMask()
    } else {
      // install MetaMask extension by startOnboarding
      onboarding.startOnboarding();
      setIsOnboarding(true)
    }
  };

  // stop onboarding
  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboarding.stopOnboarding();
      setIsOnboarding(false)
    }
  }, [isOnboarding]);

  return (
    <main>
      <div className='wrapper'>
        <div className='content'>
          <h1 className='heading'>Check your MetaMask Wallet info</h1>
          {
            isConnected
              ? <WalletInfo
                data={userInfo}
              />
              : <img className='img' src={pic} alt='logo'></img>
          }
          <div className='control'>
            <button className='button' onClick={onClick} disabled={isBtnDisabled}>
              {setBtnTitle()}
            </button>
            {
              !isConnected &&
              <p className='status'>{statusTitle}</p>
            }
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
