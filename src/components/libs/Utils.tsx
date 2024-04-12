import { IconBuildingBank, IconDiamond, IconRecycle, IconCloudLock, IconArrowsExchange, IconPlane, IconRouter, IconCircleDotted, IconArrowUpRight, IconArrowDownRight, IconLineDashed, IconHandGrab, IconCalendarStats, IconClockHour1,  } from '@tabler/icons-react';
const icons = { finance: IconBuildingBank, resources: IconDiamond, renewables: IconRecycle, cybersecurity:IconCloudLock, etf: IconArrowsExchange, transport: IconPlane, telecommunications: IconRouter, null: IconCircleDotted, up: IconArrowUpRight, down: IconArrowDownRight, neutral:IconLineDashed, hold:IconHandGrab, total:IconCalendarStats, today:IconClockHour1 };

export function getMovementColour(nv: number | 0){
    return nv == 0 ? 'var(--mantine-color-gray-text)' : nv > 0 ? 'var(--mantine-color-teal-text)' : 'var(--mantine-color-red-text)'  
}

export function getMovementIcon(nv: number | 0){
    return nv == 0 ? icons.neutral : nv > 0 ? icons.up : icons.down
}

export function currencyFormat(nv: number | 0, prec?: number | 2){
    return (nv).toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        maximumFractionDigits:prec
    });   
}

export function numberFormat(nv: number | 0, prec?: number | 2){
    return (nv).toLocaleString('en-AU', {    
      maximumFractionDigits:prec
    });   
}
  