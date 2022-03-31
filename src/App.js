import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react'
import Web3 from 'web3';


function App() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(null)

  function detectMetamaskExtension() {
    let ethProvider;
    const { etherium, web3 } = window;
    if (etherium) {
      ethProvider = etherium;
    } else if (web3) {
      // eslint-disable-next-line
      ethProvider = web3.currentProvider;
    } else {
      console.log('you are not logined with MetaMusk wallet');
    }
    return ethProvider;
  }

  // check MetaMask Status
  useEffect(() => {
    const { web3 } = window;
    !web3 ? setIsMetaMaskInstalled(false) : setIsMetaMaskInstalled(true)
  }, [])

  console.log('консоль:', isMetaMaskInstalled);

  return (
    <div className="App">
      <main>

      </main>
    </div>
  );
}

export default App;
