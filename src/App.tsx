import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import * as fs from 'fs';

//import React from 'react';
import  {StockHoldings}  from './components/StockHoldings';
//import stocks from '/data/stocks.json?url'

// const jsonStockDataFilePath: string = '/public/data/stocks.json';
// fs.readFile(jsonStockDataFilePath, 'utf8', (err, data) => {
//   if (err) {
//       console.error('Error reading JSON file:', err);
//       return;
//   }

//   try {
//       // Parse JSON data
//       const jsonData = JSON.parse(data);

//       // Loop through the JSON data
//       for (const item of jsonData) {
//           // Access properties of each item
//           console.log('Item:', item);
//       }
//   } catch (error) {
//       console.error('Error parsing JSON data:', error);
//   }
// });

export default function App() {
  const [count, setCount] = useState(0)    
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite &amp; React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {<StockHoldings />}
{/* <TestButton/> */}
    </>
  )
}

//export default App
