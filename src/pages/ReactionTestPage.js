// src/pages/ReactionTestPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ReactionTestPage(){
  const [status, setStatus] = useState('ready'); // 'ready' | 'waiting' | 'go' | 'result'
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('테스트를 시작하세요');
  const navigate = useNavigate();

  const currentTestId = 'reaction';
  const selectedTests = JSON.parse(localStorage.getItem('selectedTests')) || [];
  const currentIndex = selectedTests.indexOf(currentTestId);
  const nextTest = selectedTests[currentIndex + 1];

  const average = results.length
    ? Math.round(results.reduce((a, b) => a + b) / results.length)
    : 0;

  useEffect(() => {
    if (status === 'waiting') {
      const delay = Math.floor(Math.random() * 2000) + 2000;
      setMessage('초록색으로 바뀌면 클릭하세요...');
      const timer = setTimeout(() => {
        setStatus('go');
        setStartTime(Date.now());
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'result') {
      const reactionResult = { avgTime: average };
      localStorage.setItem('reactionResult', JSON.stringify(reactionResult));
    }
  }, [status, average]);

  const handleClick = () => {
    if (status === 'ready') {
      setResults([]);
      setStatus('waiting');
    } else if (status === 'waiting') {
      setMessage('너무 빨랐어요! 다시 시도하세요.');
      setStatus('ready');
    } else if (status === 'go') {
      const reactionTime = Date.now() - startTime;
      const newResults = [...results, reactionTime];
      setResults(newResults);

      if (newResults.length >= 5) {
        setStatus('result');
        setMessage('완료! 결과를 확인하세요.');
      } else {
        setStatus('waiting');
      }
    } else if (status === 'result') {
      if (nextTest) {
        navigate(`/test/${nextTest}`);
      } else {
        navigate('/result');
      }
    }
  };

  const getBackgroundColor = () => {
    if (status === 'waiting') return '#e74c3c';
    if (status === 'go') return '#2ecc71';
    return '#bdc3c7';
  };

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleClick}
      style={{
        ...styles.container,
        backgroundColor: getBackgroundColor(),
      }}
    >
      <h2>{message}</h2>
      {status === 'result' && (
        <div style={styles.resultBox}>
          <h3>반응속도 결과</h3>
          <ul>
            {results.map((time, i) => (
              <li key={i}>{i + 1}회차: {time}ms</li>
            ))}
          </ul>
          <p>평균 반응속도: <strong>{average}ms</strong></p>
          <button onClick={handleClick} style={styles.button}>
            {nextTest ? '다음 테스트 ▶' : '결과 보기 ▶'}
          </button>
        </div>
      )}
      {status === 'ready' && (
        <button style={styles.button}>시작하기</button>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    textAlign: 'center',
    paddingTop: '20vh',
    color: 'white',
  },
  resultBox: {
    marginTop: '20px',
    background: 'white',
    color: '#333',
    padding: '20px',
    borderRadius: '10px',
    display: 'inline-block',
  },
  button: {
    marginTop: '20px',
    fontSize: '20px',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default ReactionTestPage;
