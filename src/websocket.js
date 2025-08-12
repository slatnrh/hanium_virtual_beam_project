// src/websocket.js

export function connectWebSocket(onMessage){
  const ws = new WebSocket("ws://15.164.129.241:8080");

  ws.onopen = () => {
    console.log("WebSocket 연결됨");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.gesture){
      onMessage(data.gesture);
    }
  };

  ws.onerror = (err) => {
    console.error("WebSocket 오류:", err);
  };

  ws.onclose = () => {
    console.warn("WebSocket 연결 종료됨");
  };

  return ws;
}