// src/pages/NumberMemoryPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function generateRandomNumber() {
  return Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
}

function NumberMemoryPage() {
  const [phase, setPhase] = useState('ready'); // ready | show | input | review | result
  const [number, setNumber] = useState('');
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [lastAnswer, setLastAnswer] = useState({ correct: '', user: '', isCorrect: false });
  const navigate = useNavigate();

  const selectedTests = JSON.parse(localStorage.getItem('selectedTests')) || [];
  const currentTestId = 'numbers';
  const currentIndex = selectedTests.indexOf(currentTestId);
  const nextTest = selectedTests[currentIndex + 1];

  const startRound = () => {
    const newNumber = generateRandomNumber();
    setNumber(newNumber);
    setInput('');
    setPhase('show');

    setTimeout(() => {
      setPhase('input');
    }, 5000);
  };

  const handleKey = (digit) => {
    if (phase !== 'input') return;
    if (input.length < 7) setInput((prev) => prev + digit);
  };

  const handleBackspace = () => {
    if (phase === 'input' && input.length > 0) {
      setInput((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    const isCorrect = input === number;
    const newResult = { isCorrect, correct: number, user: input };
    setLastAnswer(newResult);
    setResults([...results, newResult]);
    setPhase('review');
  };

  const handleNextRound = () => {
    if (results.length >= 5) {
      setPhase('result');
    } else {
      setPhase('ready');
    }
  };

  const handleNextTest = () => {
    if (nextTest) {
      navigate(`/test/${nextTest}`);
    } else {
      navigate('/result');
    }
  };

  const correctRate = results.length
    ? Math.round((results.filter((r) => r.isCorrect).length / results.length) * 100)
    : 0;

  useEffect(() => {
    if (phase === 'result') {
      const numbersResult = { correctRate };
      localStorage.setItem("numbersResult", JSON.stringify(numbersResult));
    }
  }, [phase, correctRate]);

  return (
    <div style={styles.container}>
      <h2>숫자 기억력 테스트</h2>

      {phase === 'ready' && (
        <button onClick={startRound} style={styles.button}>시작하기</button>
      )}

      {phase === 'show' && (
        <div style={styles.display}>
          <p style={styles.bigText}>{number}</p>
          <p>5초간 숫자를 기억하세요</p>
        </div>
      )}

      <div style={styles.inputArea}>
        <div style={{ ...styles.inputBox, visibility: phase === 'input' ? 'visible' : 'hidden' }}>
          {input.split('').map((digit, idx) => (
            <span key={idx} style={styles.inputDigit}>{digit}</span>
          ))}
        </div>

        {(phase === 'input' || phase === 'review') && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={styles.keypad}>
              {[...Array(10).keys()].map((n) => (
                <button key={n} style={styles.key} onClick={() => handleKey(n.toString())}>
                  {n}
                </button>
              ))}
            </div>
            <button onClick={handleBackspace} style={styles.backspaceButton}>
              ⬅ 지우기
            </button>
          </div>
        )}
      </div>

      {phase === 'input' && input.length === 7 && (
        <button style={styles.button} onClick={handleSubmit}>제출</button>
      )}

      {phase === 'review' && (
        <div style={styles.reviewBox}>
          <h3>결과 확인</h3>
          <p>🟢 정답: <code>{lastAnswer.correct}</code></p>
          <p>🔵 입력: <code>{lastAnswer.user}</code></p>
          <p>{lastAnswer.isCorrect ? '✅ 정답입니다!' : '❌ 틀렸습니다.'}</p>
          <button onClick={handleNextRound} style={styles.button}>
            {results.length >= 5 ? '결과 보기 ▶' : '다음 문제 ▶'}
          </button>
        </div>
      )}

      {phase === 'result' && (
        <div style={styles.resultBox}>
          <h3>총 정답률: {correctRate}%</h3>
          <ul style={{ textAlign: 'left' }}>
            {results.map((res, idx) => (
              <li key={idx} style={{ marginBottom: '10px' }}>
                <strong>{idx + 1}회차</strong> - 정답: <code>{res.correct}</code>, 입력: <code>{res.user}</code> → {res.isCorrect ? '✅ 정답' : '❌ 오답'}
              </li>
            ))}
          </ul>
          <button onClick={handleNextTest} style={styles.button}>
            {nextTest ? '다음 테스트 ▶' : '종합 결과 보기 ▶'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '40px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '18px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  display: {
    marginTop: '30px',
  },
  bigText: {
    fontSize: '48px',
    letterSpacing: '10px',
  },
  inputArea: {
    minHeight: '250px',
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
  },
  inputBox: {
    fontSize: '36px',
    letterSpacing: '10px',
    borderBottom: '2px solid #ccc',
    width: '260px',
    paddingBottom: '10px',
    display: 'flex',
    justifyContent: 'center',
    height: '50px',
  },
  inputDigit: {
    width: '30px',
    textAlign: 'center',
  },
  keypad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 60px)',
    gridGap: '10px',
    justifyContent: 'center',
    marginTop: '10px',
  },
  key: {
    fontSize: '20px',
    padding: '12px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  backspaceButton: {
    marginTop: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  reviewBox: {
    background: 'white',
    color: '#333',
    padding: '20px',
    borderRadius: '10px',
    display: 'inline-block',
    marginTop: '20px',
  },
  resultBox: {
    background: 'white',
    color: '#333',
    padding: '20px',
    borderRadius: '10px',
    display: 'inline-block',
    marginTop: '20px',
    maxWidth: '500px',
  },
};

export default NumberMemoryPage;
