import WebSocket from 'isomorphic-ws';

const ws_host = window.location.hostname.toUpperCase()==='LOCALHOST'?'host.docker.internal':window.location.hostname;
export const ws = new WebSocket(`ws://${ws_host}:8100`);

ws.onopen = () => console.log('WebSocket connected');
ws.onclose = () => console.log('WebSocket disconnected');