// src/pages/ResultPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ResultPage() {
  const navigate = useNavigate();

  const selectedTests = JSON.parse(localStorage.getItem("selectedTests") || "[]");

  const reaction = JSON.parse(localStorage.getItem("reactionResult") || "{}");
  const memory = JSON.parse(localStorage.getItem("memoryResult") || "{}");
  const numbers = JSON.parse(localStorage.getItem("numbersResult") || "{}");
  const flexibility = JSON.parse(localStorage.getItem("flexibilityResult") || "{}");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const getSummary = () => {
    const score = [
      selectedTests.includes("reaction") && reaction.avgTime < 500,
      selectedTests.includes("memory") && memory.correctRate >= 70,
      selectedTests.includes("numbers") && numbers.correctRate >= 70,
      selectedTests.includes("flexibility") && flexibility.correctRate >= 70,
    ].filter(Boolean).length;

    if (score === selectedTests.length) return '🟢 매우 우수함';
    if (score >= selectedTests.length / 2) return '🟡 평균 수준';
    return '🔴 주의 필요';
  };

  const getUserId = () => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = crypto.randomUUID(); // 최초 1회 생성
      localStorage.setItem("userId", id);
    }
    return id;
  };

  // AWS로 결과 전송 (요약 → 히스토리)
  useEffect(() => {
    const API = "https://0jfcf61qse.execute-api.ap-northeast-2.amazonaws.com/prod/storeUserData";

    const sendDataToAWS = async () => {
      const payload = {
        userId: getUserId(),                 // 항상 같은 userId로 덮어쓰기
        name: userInfo.name ?? "unknown",
        age: Number(userInfo.age ?? 0),
        gender: userInfo.gender ?? "unknown",
        results: {
          reaction: reaction.avgTime ?? -1,
          memory: memory.correctRate ?? -1,
          numbers: numbers.correctRate ?? -1,
          flexibility: {
            correctRate: flexibility.correctRate ?? -1,
            avgTime: flexibility.avgTime ?? -1
          }
        },
        summary: getSummary()
      };

      try {
        // 1) 요약 저장 (UserResults에 덮어쓰기)
        const resSummary = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!resSummary.ok) {
          const txt = await resSummary.text().catch(() => "");
          throw new Error(`summary save failed: ${resSummary.status} ${txt}`);
        }
        const dataSummary = await resSummary.json();
        console.log("AWS 요약 저장 응답:", dataSummary);
      } catch (e) {
        console.error("요약 저장 실패:", e);
      }

      try {
        // 2) 히스토리 저장 (UserResultsHistory에 누적)
        const resHistory = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, mode: "history" }),
        });
        if (!resHistory.ok) {
          const txt = await resHistory.text().catch(() => "");
          throw new Error(`history save failed: ${resHistory.status} ${txt}`);
        }
        const dataHistory = await resHistory.json();
        console.log("AWS 히스토리 저장 응답:", dataHistory);
      } catch (e) {
        console.error("히스토리 저장 실패:", e);
      }
    };

    sendDataToAWS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestart = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1>테스트 결과 분석</h1>

      {selectedTests.includes("reaction") && (
        <div style={styles.resultCard}>
          <h2>1. 인지 속도</h2>
          <p>평균 반응속도: {reaction.avgTime ?? '-'}ms</p>
        </div>
      )}

      {selectedTests.includes("memory") && (
        <div style={styles.resultCard}>
          <h2>2. 공간 기억력</h2>
          <p>정답률: {memory.correctRate ?? '-'}%</p>
        </div>
      )}

      {selectedTests.includes("numbers") && (
        <div style={styles.resultCard}>
          <h2>3. 숫자 기억력</h2>
          <p>정답률: {numbers.correctRate ?? '-'}%</p>
        </div>
      )}

      {selectedTests.includes("flexibility") && (
        <div style={styles.resultCard}>
          <h2>4. 인지 전환 유연성</h2>
          <p>정답률: {flexibility.correctRate ?? '-'}%</p>
          <p>평균 반응 시간: {flexibility.avgTime ?? '-'}ms</p>
        </div>
      )}

      <div style={styles.summary}>
        <h2>🧠 종합 수행 능력: {getSummary()}</h2>
      </div>

      <button onClick={handleRestart} style={styles.button}>
        다시 시작하기 🔄
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    textAlign: 'center',
  },
  resultCard: {
    background: '#f0f0f0',
    padding: '20px',
    margin: '20px auto',
    borderRadius: '12px',
    maxWidth: '400px',
    textAlign: 'left',
  },
  summary: {
    marginTop: '30px',
    backgroundColor: '#dff0d8',
    padding: '20px',
    borderRadius: '10px',
    display: 'inline-block',
  },
  button: {
    marginTop: '30px',
    fontSize: '18px',
    padding: '12px 24px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default ResultPage;
