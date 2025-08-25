// server.js
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const WS_CLIENT_PORT = process.env.WS_CLIENT_PORT || 8080;
const WS_JETSON_PORT = process.env.WS_JETSON_PORT || 8081;

let LatestData = { x:0, y:0, click:false };

// Web -> 실시간 전송
const wss_client = new WebSocket.Server({ port: WS_CLIENT_PORT });
wss_client.on('connection', (ws) => {
  console.log('웹 클라이언트 접속');
  const interval = setInterval(() => {
    if(ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify(LatestData));
    }
  }, 50);   // 20fps

  ws.on('close', () => {
    clearInterval(interval);
    console.log('웹 클라이언트 종료');
  });
  ws.on('error', (e) => console.error("WS(Client) 에러:", e));
});

const wss_jetson = new WebSocket.Server({ port: WS_JETSON_PORT });
wss_jetson.on('connection', (ws) => {
  console.log("젯슨나노 접속");
  ws.on('message', (message) => {
    try{
        const data = JSON.parse(message);
        if(typeof data.x === 'number' && typeof data.y === 'number' && typeof data.click === 'boolean'){
            LatestData = data;
        }
    }
    catch(e){
        console.error("데이터 파싱 에러:", e);
    }
  });
  ws.on('error', (e) => console.error("WS(Jetson) 에러:", e));
});

app.get('/', (_req, res) => res.send("WebSocket 중계 서버 실행 중"));

app.listen(HTTP_PORT, () => {
    console.log(`HTTP 서버 실행: http://0.0.0.0:${HTTP_PORT}`);
    console.log(`WS Client: ws://<SERVER_IP>:${WS_CLIENT_PORT}`);
    console.log(`WS Jetson: ws://<SERVER_IP>:${WS_JETSON_PORT}`);
});
