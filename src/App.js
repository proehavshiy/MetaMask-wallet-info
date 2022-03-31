import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react'
import Web3 from 'web3';


function App() {

  function detectUserProvider() {
    let userProvider;
    if (window.etherium) {
      userProvider = window.etherium;
    } else if (window.web3) {
      userProvider = window.web3.currentProvider;
    } else {
      console.log('you are not logined with MetaMusk wallet')
    }
    return userProvider;
  }

  useEffect(() => {
    console.log('eth:', detectUserProvider());
  })



  return (
    <div className="App">
      <header>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
      </header>
      <main>
        <h1>MetaMusk wallet Status</h1>
        <button className="button">Get public key</button>
        <p className='public-key'></p>
      </main>
    </div>
  );
}

export default App;
