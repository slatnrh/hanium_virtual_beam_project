const API = "https://0jfcf61qse.execute-api.ap-northeast-2.amazonaws.com/prod/storeUserData";

export async function storeUserData(payload) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`storeUserData failed: ${res.status} ${txt}`);
  }
  return res.json(); // { message: "데이터 저장 완료!" }
}
