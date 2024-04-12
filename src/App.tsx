import './App.css'
import  { Header }  from './components/layouts/Header';
import  { Footer }  from './components/layouts/Footer';
import  { StockHoldings }  from './components/StockHoldings';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export default function App() {
  return <MantineProvider defaultColorScheme="dark">
    {<Header />}    
    {<StockHoldings />}    
    {<Footer />}
  </MantineProvider>;
}