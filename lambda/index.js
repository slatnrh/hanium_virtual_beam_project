// index.js (Node.js 18, AWS SDK v3)
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-2" });

const SUMMARY_TABLE = "UserResults";
const HISTORY_TABLE = "UserResultsHistory";
const ALLOW_ORIGIN = "https://virtual-kiosk.netlify.app";

exports.handler = async (event) => {
  const method = (event.httpMethod || "GET").toUpperCase();
  const path = (event.resource || event.path || "").toLowerCase();

  if(method === "OPTIONS") return resp(204, "");

  try{
    if(method !== "POST") return resp(405, { error: "Use POST" });

    const body = event.body ? JSON.parse(event.body) : {};
    const userId = String(body.userId || "");
    if(!userId) return resp(400, { error: "userId 필수" });

    const common = {
      name: body.name ?? "unknown",
      age: Number(body.age ?? 0),
      gender: body.gender ?? "unknown",
      summary: body.summary ?? "none",
      reaction: Number(body.results?.reaction ?? -1),
      memory: Number(body.results?.memory ?? -1),
      numbers: Number(body.results?.numbers ?? -1),
      flexRate: Number(body.results?.flexibility?.correctRate ?? -1),
      flexAvg: Number(body.results?.flexibility?.avgTime ?? -1),
    };

    // 🔀 분기: mode === "history" → 누적 저장, 그 외 → 요약 저장(덮어쓰기)
    if(String(body.mode).toLowerCase() === "history"){
      const ts = Date.now();
      await client.send(new PutItemCommand({
        TableName: HISTORY_TABLE,
        Item: {
          UserID: { S: userId },
          ts: { N: String(ts) },      // SK
          name: { S: common.name },
          age: { N: String(common.age) },
          gender: { S: common.gender },
          summary: { S: common.summary },
          reaction: { N: String(common.reaction) },
          memory: { N: String(common.memory) },
          numbers: { N: String(common.numbers) },
          flexibility_correctRate: { N: String(common.flexRate) },
          flexibility_avgTime: { N: String(common.flexAvg) }
        }
      }));
      return resp(200, { ok: true, where: "history" });
    }

    // 기본: 요약 저장 (덮어쓰기)
    await client.send(new PutItemCommand({
      TableName: SUMMARY_TABLE,
      Item: {
        UserID: { S: userId },           // PK만 있는 테이블 → 덮어쓰기
        name: { S: common.name },
        age: { N: String(common.age) },
        gender: { S: common.gender },
        summary: { S: common.summary },
        reaction: { N: String(common.reaction) },
        memory: { N: String(common.memory) },
        numbers: { N: String(common.numbers) },
        flexibility_correctRate: { N: String(common.flexRate) },
        flexibility_avgTime: { N: String(common.flexAvg) },
        updatedAt: { N: String(Date.now()) }
      }
    }));
    return resp(200, { ok: true, where: "summary" });

  }
  catch(e){
    console.error(e);
    return resp(500, { error: "Lambda 오류", detail: String(e) });
  }
};

function resp(code, jsonOrString){
  const body = typeof jsonOrString === "string" ? jsonOrString : JSON.stringify(jsonOrString);
  return{
    statusCode: code,
    headers: {
      "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Content-Type": "application/json",
    },
    body
  };
}
