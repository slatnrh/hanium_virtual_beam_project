// src/websocket.js

export function connectWebSocket(onMessage){
  const socket = new WebSocket("ws://3.25.77.146:8765");

  socket.onopen = () => {
    console.log("WebSocket 연결됨");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.gesture){
      onMessage(data.gesture);
    }
  };

  socket.onerror = (err) => {
    console.error("WebSocket 오류:", err);
  };

  socket.onclose = () => {
    console.warn("WebSocket 연결 종료됨");
  };

  return socket;
}