import WebSocket from 'isomorphic-ws';

export const ws = new WebSocket('ws://host.docker.internal:8100');

ws.onopen = () => console.log('WebSocket connected');
ws.onclose = () => console.log('WebSocket disconnected');