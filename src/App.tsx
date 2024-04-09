import './App.css'
import  { Header }  from './components/layouts/Header';
import  { Footer }  from './components/layouts/Footer';
import  { StockHoldings }  from './components/StockHoldings';
import { useState, useEffect } from 'react';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export default function App() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    //const newWs = new WebSocket('ws://socket-server:8100');
    const newWs = new WebSocket('ws://localhost:8100');
    newWs.onopen = () => {
      console.log('WebSocket connection opened');
      // Subscribe to a channel upon connection (if needed)
      newWs.send(JSON.stringify({ type: 'subscribe', channel: 'asx' }));
    };

     // Event listener for receiving messages
    newWs.onmessage = (event) => {      
      console.log('Received message:', event.data);
      const jsonData = JSON.parse(event.data);
      console.log(jsonData);
    };

    // Event listener for closing connection
    newWs.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Save the WebSocket connection in state
    setWs(newWs);

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      if (newWs) {
        newWs.close();
      }
    };
   }, []);

  return <MantineProvider defaultColorScheme="dark">
    {<Header />}    
    {<StockHoldings />}    
    {<Footer />}
  </MantineProvider>;
}