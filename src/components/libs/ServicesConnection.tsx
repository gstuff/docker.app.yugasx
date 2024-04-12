import WebSocket from 'isomorphic-ws';
export function createWebocket(websocket_url: string){
    return new WebSocket(websocket_url);
}