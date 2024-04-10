import {useState, useEffect} from 'react';
import { Group, Paper, SimpleGrid, Text, Table } from '@mantine/core';
import { ws } from './ConnectionSockets';
import cx from 'clsx';

import {
  IconBuildingBank,
  IconDiamond,
  IconRecycle,
  IconCloudLock,
  IconArrowsExchange,
  IconPlane,
  IconRouter,
  IconCircleDotted,    
  IconArrowUpRight,
  IconArrowDownRight,
  IconLineDashed,  
  IconHandGrab,
  IconCalendarStats,
  IconClockHour1,  
} from '@tabler/icons-react';
import classes from './StockHoldings.module.css';

const icons = {
  finance: IconBuildingBank,
  resources: IconDiamond,
  renewables: IconRecycle,
  cybersecurity:IconCloudLock,
  etf: IconArrowsExchange,
  transport: IconPlane,
  telecommunications: IconRouter,
  null: IconCircleDotted,  
  up: IconArrowUpRight,
  down: IconArrowDownRight,
  neutral:IconLineDashed,
  hold:IconHandGrab,
  total:IconCalendarStats,
  today:IconClockHour1
};

const getMovementColour = (nv: number | 0) => {
  return nv == 0 ? 'var(--mantine-color-gray-text)' : nv > 0 ? 'var(--mantine-color-teal-text)' : 'var(--mantine-color-red-text)'  
}
const getMovementIcon = (nv: number | 0) => {
  return nv == 0 ? icons.neutral : nv > 0 ? icons.up : icons.down
}

const currencyFormat = (nv: number | 0, prec?: number | 2) => {
  return (nv).toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits:prec
  });   
}

const numberFormat = (nv: number | 0, prec?: number | 2) => {
  return (nv).toLocaleString('en-AU', {    
    maximumFractionDigits:prec
  });   
}

interface IStock { 
  CHANGE_VALUE: number;
  PROFIT_LOSS_PERC: number; 
  PROFIT_LOSS: number; 
  MARKET_VALUE: number; 
  UNITS: number; 
  PRICE: number; 
  PURCHASE_PRICE: number;
  CATEGORY: string; 
  PREVIOUS_CLOSE: number;
  PRICE_MOVE: number; 
  SYMBOL: string;
  NAME: string;
  PRICE_MOVE_PERC: number; 
  DATETIME: string 
};

interface IOverview {
  TODAY_ICON: any;
  TOTAL_ICON: any;  
  KEY_TODAY: string;
  TODAY_LABEL: string;
  TODAY_PROFIT_LOSS: number;
  TODAY_COLOR: string;  
  TODAY_PROFIT_LOSS_PERC: number;  
  KEY_TOTAL: string;
  TOTAL_LABEL: string;
  TOTAL_PROFIT_LOSS: number;
  TOTAL_COLOR:string;
  TOTAL_PROFIT_LOSS_PERC: number;  
  KEY_HOLDINGS: string;
  HOLDINGS_COSTS: number;
  HOLDINGS_MARKET_VALUE: number;
  HOLDINGS_LABEL: string;
}

//const socket_url = 'ws://localhost:8100'
//const socket_url = 'ws://host.docker.internal:8100';
//const socket_url = 'ws://socket-server:8100';
export function StockHoldings() {
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [overviewStatus, setOoverviewStatus] = useState<IOverview[]>([])  
  const [scrolled] = useState(false);
  
  function __setStocks(stocks: IStock[]){      
      console.log(stocks);
      const total_market_value = stocks.reduce((acc:number, stock) => {
        return acc + (stock.PRICE*stock.UNITS);
      },0)
      const total_cost = stocks.reduce((acc, stock) => {
        return acc + (stock.PURCHASE_PRICE*stock.UNITS);
      },0)      
      const open_market_value = stocks.reduce((acc, stock) => {
        return acc + (stock.PREVIOUS_CLOSE*stock.UNITS);
      },0)      
      const current_market_value = stocks.reduce((acc, stock) => {
        return acc + (stock.PRICE*stock.UNITS);
      },0)

      const ovs: IOverview[] = [{
        KEY_TODAY:'OV_TODAY', TODAY_LABEL:'Today Change',          
          TODAY_PROFIT_LOSS:current_market_value-open_market_value, TODAY_PROFIT_LOSS_PERC:((current_market_value-open_market_value)/open_market_value)*100,
          TODAY_ICON: getMovementIcon(current_market_value-open_market_value),
          TODAY_COLOR: getMovementColour(current_market_value-open_market_value),          
          KEY_TOTAL:'OV_TOTAL', TOTAL_LABEL: 'Total Profit/Loss', 
          TOTAL_PROFIT_LOSS:total_market_value-total_cost, TOTAL_PROFIT_LOSS_PERC:((total_market_value-total_cost)/total_cost)*100,
          TOTAL_ICON: getMovementIcon(total_market_value-total_cost),
          TOTAL_COLOR: getMovementColour(total_market_value-total_cost),
          KEY_HOLDINGS: 'OV_HOLDINGS', HOLDINGS_LABEL: 'Holdings', HOLDINGS_MARKET_VALUE:total_market_value, HOLDINGS_COSTS:total_cost        
      }];
        

      setStocks(stocks);
      setOoverviewStatus(ovs);
  }

  function setupSocket() {    
    console.log('Socket setup')
    ws.send(JSON.stringify({ type: 'subscribe', channel: 'asx' }));
    
    ws.onmessage = (e: MessageEvent) => {
      console.log("Message recieved from Socket");             
      __setStocks(JSON.parse(e.data));
    }
    // ws.onopen = () => {    
    //   ws.send(JSON.stringify({ type: 'subscribe', channel: 'asx' }));
    //   console.log('WebSocket connection opened');
    // };
    // // Event listener for receiving messages
    // ws.onmessage = (event) => {
    //   console.log("retrieve data from socket");     
    //   __setStocks(JSON.parse(event.data));
    // };

    // return () => {
    //   if (ws) {
    //     ws.close();
    //   }
    // };
  }

  useEffect(() => {
    fetch("/data/stocks.json?url")
    .then(response => response.json())
    .then(stocks__ => {
      __setStocks(stocks__);
    }).then(()=>{
      setupSocket();      
    });    
  },[]);
  
  
  const overview = overviewStatus && overviewStatus.map((ov: IOverview) => {
    //const TodayIcon = ov.TODAY_ICON;
    const TodayIcon = getMovementIcon(ov.TODAY_PROFIT_LOSS);
    return(
      <>
      <Paper withBorder p="md" radius="md" key="today_{index}">
        <Group justify="space-between" key={"today-$index-heading"}>
          <Text size="xl" className={classes.title}>{ov.TODAY_LABEL}</Text>                              
          <TodayIcon className={classes.icon} size="2.4rem" stroke={2.5} color={ov.TODAY_COLOR} />
          <icons.today className={classes.icon} size="2.4rem"/>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed" size="sm">Profit/Loss</Text>
          <Text size="sm" c={ov.TODAY_COLOR}>{currencyFormat(ov.TODAY_PROFIT_LOSS)}</Text>
          <Text c="dimmed" size="sm">Profit/Loss %</Text>
          <Text size="sm" c={ov.TODAY_COLOR}>{Math.round((ov.TODAY_PROFIT_LOSS_PERC + Number.EPSILON) * 100) / 100}%</Text>
        </Group>
      </Paper>
      <Paper withBorder p="md" radius="md" key="total_{index}">
        <Group justify="space-between">
          <Text size="xl" className={classes.title}>{ov.TOTAL_LABEL}</Text>          
          {/* <ov.TOTAL_ICON className={classes.icon} size="2.4rem" stroke={2.5} color={ov.TOTAL_COLOR} /> */}
          <icons.total className={classes.icon} size="2.4rem"/>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed" size="sm">Profit/Loss</Text>
          <Text size="sm" c={ov.TOTAL_COLOR}>{currencyFormat(ov.TOTAL_PROFIT_LOSS)}</Text>
          <Text c="dimmed" size="sm">Profit/Loss %</Text>
          <Text size="sm" c={ov.TOTAL_COLOR}>{Math.round((ov.TOTAL_PROFIT_LOSS_PERC + Number.EPSILON) * 100) / 100}%</Text>
        </Group>
      </Paper>
      <Paper withBorder p="md" radius="md" key="holding_{index}">
        <Group justify="space-between">
          <Text size="xl" className={classes.title}>{ov.HOLDINGS_LABEL}</Text>          
          <icons.hold className={classes.icon} size="2.4rem"/>
        </Group>
        <Group justify="space-between">
          <Text c="dimmed" size="sm">Market Value</Text>
          <Text size="sm">{currencyFormat(ov.HOLDINGS_MARKET_VALUE,2)}</Text>
          <Text c="dimmed" size="sm">Total Costs</Text>
          <Text size="sm">{currencyFormat(ov.HOLDINGS_COSTS, 2)}</Text>
        </Group>
      </Paper>
      </>        
    );
  })

  // holdings cards
  const holdings = stocks && stocks.map((stock: IStock) => {
    const Icon = icons.finance; //icons[stock.CATEGORY];
    const DiffIcon = stock.PRICE_MOVE == 0 ? IconLineDashed : stock.PRICE_MOVE > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (                  
      <Paper withBorder p="md" radius="md" key={stock.SYMBOL}>
        <Group justify="space-between">
          <Text size="xl" className={classes.title}>{stock.SYMBOL}</Text>          
          <Icon className={classes.icon} size="1.4rem" stroke={2.5} />
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">{stock.NAME.replace("&amp;","&")}</Text>      
        </Group>        
        <Group>
          <Text className={classes.value}>{stock.PRICE}</Text>
          <Text c={stock.PRICE_MOVE == 0 ? 'grey' : stock.PRICE_MOVE > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
            <span>{stock.PRICE_MOVE_PERC}%</span>
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>
        </Group>        
        <Group justify="space-between" align="flex-end" gap="xs" mt={25}>
          <Text size="xs" c="dimmed">{stock.DATETIME}</Text>        
        </Group>
      </Paper>
    );
  });
  
  // holdings table rows
  const holdings_row = stocks && stocks.map((stock: IStock) => {
    // const Icon = icons[stock.CATEGORY];
    // const DiffIcon = stock.PRICE_MOVE == 0 ? IconLineDashed : stock.PRICE_MOVE > 0 ? IconArrowUpRight : IconArrowDownRight;
    stock.MARKET_VALUE=stock.PRICE*stock.UNITS;
    stock.PROFIT_LOSS=(stock.PRICE*stock.UNITS)-(stock.PURCHASE_PRICE*stock.UNITS);
    stock.PROFIT_LOSS_PERC=stock.PROFIT_LOSS/10;
    stock.CHANGE_VALUE=stock.PRICE_MOVE*stock.UNITS;
    return (            
      <Table.Tr key={stock.SYMBOL}>
        <Table.Td>{stock.SYMBOL.split('.')[0]}</Table.Td>
        {/* <Table.Td>{stock.NAME.replace("&amp;","&")}</Table.Td> */}
        <Table.Td align='right'>{numberFormat(stock.UNITS,0)}</Table.Td>
        <Table.Td align='right'>{currencyFormat(stock.PURCHASE_PRICE,3)}</Table.Td>
        <Table.Td align='right'>{currencyFormat(stock.PRICE,3)}</Table.Td>
        <Table.Td align='right'>{currencyFormat(stock.MARKET_VALUE,2)}</Table.Td>
        <Table.Td align='right'><Text c={getMovementColour(stock.PROFIT_LOSS)}>{numberFormat(stock.PROFIT_LOSS,2)}</Text></Table.Td>
        <Table.Td align='right'><Text c={getMovementColour(stock.PROFIT_LOSS)}>{numberFormat(stock.PROFIT_LOSS_PERC,2)}</Text></Table.Td>
        <Table.Td align='right'><Text c={getMovementColour(stock.PRICE_MOVE)}>{numberFormat(stock.PRICE_MOVE,2)}</Text></Table.Td>
        <Table.Td align='right'><Text c={getMovementColour(stock.PRICE_MOVE_PERC)}>{numberFormat(stock.PRICE_MOVE_PERC,2)}</Text></Table.Td>
        <Table.Td align='right'><Text c={getMovementColour(stock.CHANGE_VALUE)}>{numberFormat(stock.CHANGE_VALUE,2)}</Text></Table.Td>
      </Table.Tr>      
      // <Paper withBorder p="md" radius="md" key={stock.SYMBOL}>
      //   <Group justify="space-between">
      //     <Text size="xl" className={classes.title}>{stock.SYMBOL}</Text>          
      //     <Icon className={classes.icon} size="1.4rem" stroke={2.5} />
      //   </Group>
      //   <Group justify="space-between">
      //     <Text size="sm" c="dimmed">{stock.NAME.replace("&amp;","&")}</Text>      
      //   </Group>        
      //   <Group>
      //     <Text className={classes.value}>{stock.PRICE}</Text>
      //     <Text c={stock.PRICE_MOVE == 0 ? 'grey' : stock.PRICE_MOVE > 0 ? 'teal' : 'red'} fz="sm" fw={500} className={classes.diff}>
      //       <span>{stock.PRICE_MOVE_PERC}%</span>
      //       <DiffIcon size="1rem" stroke={1.5} />
      //     </Text>
      //   </Group>        
      //   <Group justify="space-between" align="flex-end" gap="xs" mt={25}>
      //     <Text size="xs" c="dimmed">{stock.DATETIME}</Text>        
      //   </Group>
      // </Paper>
    );
  });

  return (    
    <div className={classes.root}>                  
      <SimpleGrid cols={{ base: 1, md: 3 }} mb="sm">{overview}</SimpleGrid>
      
      <SimpleGrid cols={{ base: 1, md: 4 }}>{holdings}</SimpleGrid>      

      <Table miw={800} striped={true}>
        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
            <Table.Th>Code</Table.Th>
            {/* <Table.Th>Name</Table.Th> */}
            <Table.Th>Units</Table.Th>
            <Table.Th>Purchase Price $</Table.Th>
            <Table.Th>Last Price $</Table.Th>
            <Table.Th>Market Value $</Table.Th>
            <Table.Th>Profit/Loss $</Table.Th>
            <Table.Th>Profit/Loss %</Table.Th>
            <Table.Th>Today's Change $</Table.Th>
            <Table.Th>Today's Change %</Table.Th>
            <Table.Th>Change Value $</Table.Th>
            {/* <Table.Th>Weight %</Table.Th> */}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{holdings_row}</Table.Tbody>
      </Table>
    </div>
  );
}