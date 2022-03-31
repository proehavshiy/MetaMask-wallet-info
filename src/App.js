import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react'


function App() {

  function detectAuthUser() {
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
    console.log('eth:', detectAuthUser());
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          { }
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
