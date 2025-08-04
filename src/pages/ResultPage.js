// src/pages/ResultPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ResultPage() {
  const navigate = useNavigate();

  const selectedTests = JSON.parse(localStorage.getItem("selectedTests") || "[]");

  const reaction = JSON.parse(localStorage.getItem("reactionResult") || "{}");
  const memory = JSON.parse(localStorage.getItem("memoryResult") || "{}");
  const numbers = JSON.parse(localStorage.getItem("numbersResult") || "{}");
  const flexibility = JSON.parse(localStorage.getItem("flexibilityResult") || "{}");

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
