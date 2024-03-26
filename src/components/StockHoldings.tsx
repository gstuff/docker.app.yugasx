import React, { useState, useEffect } from 'react';

export const StockHoldings = () => {
    const [stocks, setStocks] = useState(null);
    const [symbols, setSymbols] = useState([]);
    useEffect(() => {
        // If you're using Create React App and the file is in the public folder
        fetch('/data/stocks.json?url')
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          //.then(stocks => setStocks(stocks))
          .then(stocks =>{
            setStocks(stocks);
            setSymbols(Object.keys(stocks));
            //this.symbols = Object.keys(stocks);
            //console.log(Object.keys(stocks));
            //setSymbols(Object.keys(stocks));
          })
          //.then(symbols => setSymbols(Object.keys(stocks)))
          .catch(error => console.error('There has been a problem with your fetch operation:', error));
    }, []);
    
    //const symbols = Object.keys(stocks);

    return (    
    <div>
        {stocks && symbols && symbols.map((key, index) => (
            <h1>{key}</h1>
            // <li key={index}><strong>{key}:</strong> {stocks[key]}</li>
        ))}
        
        {stocks && symbols && <pre>{JSON.stringify(stocks, null, 2)}</pre>}
    </div>
    );
}