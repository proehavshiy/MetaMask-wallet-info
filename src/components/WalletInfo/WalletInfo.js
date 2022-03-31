import './WalletInfo.css'
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

function WalletInfo({ data }) {
  return (
    <div className='wallet-info'>
      <h2 className='wallet-info__heading'>
        Details:
      </h2>
      <ul className='wallet-info__list'>
        {data.map(item =>
          <li className='wallet-info__item' key={uuidv4()}>
            <span>{item.name}</span>: {item.data}
          </li>
        )}
      </ul>
    </div>

  )
}

export default WalletInfo;
