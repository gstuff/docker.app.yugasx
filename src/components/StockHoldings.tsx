import {useState, useEffect} from 'react';
import { Group, Paper, SimpleGrid, Text, RingProgress, Center, rem, Title } from '@mantine/core';
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
};

export function StockHoldings() {
  const [stocks, setStocks] = useState(null)

  useEffect(() => {
    fetch("/data/stocks.json?url")
    .then(response => response.json())
    .then(stocks => {      
      setStocks(stocks);
    })
  },[])
  
  // overview cards
  const overview_data = [
    { label: 'Today', move: 33.60, move_perc: 0.45, progress: 65, color: 'teal', icon: 'up' },
    { label: 'Total', move: 20.12, move_perc: 0.35, progress: 110, color: 'blue', icon: 'up' },    
  ] as const;

  const overview = overview_data && overview_data.map((stat) => {
    const Icon = icons[stat.icon];
    return(
      <Paper withBorder radius="md" p="xs" key={stat.label}>        
        <Group justify="space-between">
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: stat.progress, color: stat.color }]}
            label={
              <Center>
                <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
              </Center>
            }
          />
          <div>
          <Title c="dimmed" order={3}>{stat.label}</Title>          
          <Group>              
            <Text fw={700}>{stat.move.toLocaleString('en-AU',{style: 'currency',currency: 'AUD'})}</Text>
            <Text fw={700}>{stat.move_perc}%</Text>
          </Group>            
          </div>                    
        </Group>
      </Paper>
    );
  })
  // holdings cards
  const holdings = stocks && Object.keys(stocks).map((key,i) => {    
    const stock = stocks[key];
    const Icon = icons[stock.CATEGORY];
    const DiffIcon = stock.PRICE_MOVE == 0 ? IconLineDashed : stock.PRICE_MOVE > 0 ? IconArrowUpRight : IconArrowDownRight;
    return (
      <Paper withBorder p="md" radius="md" key={key}>
        <Group justify="space-between">
          <Text size="xl" className={classes.title}>{key}</Text>          
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
  })

  return (    
    <div className={classes.root}>                  
      <SimpleGrid cols={{ base: 1, sm: 2 }} mb="sm">{overview}</SimpleGrid>
      
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{holdings}</SimpleGrid>      
    </div>
  );
}