// src/pages/SpatialMemoryPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const colors = ['red', 'yellow', 'green', 'blue', 'purple'];
const shapes = ['square', 'triangle', 'circle'];

const colorKoreanMap = {
  red: '빨간색',
  yellow: '노란색',
  green: '초록색',
  blue: '파란색',
  purple: '보라색',
};

const shapeKoreanMap = {
  square: '네모',
  triangle: '세모',
  circle: '원',
};

function getRandomGrid() {
  const allCombinations = [];
  for (let c of colors) {
    for (let s of shapes) {
      allCombinations.push({ color: c, shape: s });
    }
  }

  const shuffled = allCombinations.sort(() => Math.random() - 0.5);
  const grid = shuffled.slice(0, 9);
  const correctIndex = Math.floor(Math.random() * 9);
  const correctItem = grid[correctIndex];

  return {
    grid,
    correctIndex,
    correctItem,
  };
}

function SpatialMemoryPage() {
  const [phase, setPhase] = useState('ready'); // ready | memorize | question | result
  const [gridData, setGridData] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [correctItem, setCorrectItem] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('테스트를 시작하세요');
  const navigate = useNavigate();

  const selectedTests = JSON.parse(localStorage.getItem('selectedTests')) || [];
  const currentTestId = 'memory';
  const currentIndex = selectedTests.indexOf(currentTestId);
  const nextTest = selectedTests[currentIndex + 1];

  const startRound = () => {
    const { grid, correctIndex, correctItem } = getRandomGrid();
    setGridData(grid);
    setCorrectIndex(correctIndex);
    setCorrectItem(correctItem);
    setPhase('memorize');
    setMessage('5초 동안 기억하세요');

    setTimeout(() => {
      setGridData(Array(9).fill(null));
      setPhase('question');
      setStartTime(Date.now());
      setMessage('');
    }, 5000);
  };

  const handleClick = (idx) => {
    if (phase !== 'question') return;

    const time = Date.now() - startTime;
    const isCorrect = idx === correctIndex;
    const newResults = [...results, { isCorrect, time }];
    setResults(newResults);

    if (newResults.length >= 5) {
      setPhase('result');
      setMessage('테스트 완료!');
    } else {
      setPhase('ready');
      setMessage('다음 라운드를 시작하세요');
    }
  };

  const handleStart = () => {
    if (phase === 'ready') {
      startRound();
    } else if (phase === 'result') {
      if (nextTest) {
        navigate(`/test/${nextTest}`);
      } else {
        navigate('/result');
      }
    }
  };

  const correctRate = results.length
    ? Math.round((results.filter((r) => r.isCorrect).length / results.length) * 100)
    : 0;

  useEffect(() => {
    if (phase === 'result') {
      const memoryResult = { correctRate };
      localStorage.setItem("memoryResult", JSON.stringify(memoryResult));
    }
  }, [phase, correctRate]);

  return (
    <div style={styles.container}>
      <h2>
        {phase === 'question' && correctItem
          ? `"${colorKoreanMap[correctItem.color]} ${shapeKoreanMap[correctItem.shape]}" 도형은 어디에 있었나요?`
          : message}
      </h2>

      <div style={styles.grid}>
        {gridData.map((item, idx) => (
          <div key={idx} onClick={() => handleClick(idx)} style={styles.cell}>
            {item?.shape === 'circle' && (
              <div style={{ ...styles.circle, backgroundColor: item.color }} />
            )}
            {item?.shape === 'square' && (
              <div style={{ ...styles.square, backgroundColor: item.color }} />
            )}
            {item?.shape === 'triangle' && (
              <div style={{ ...styles.triangle, borderBottomColor: item.color }} />
            )}
          </div>
        ))}
      </div>

      {phase === 'ready' && (
        <button onClick={handleStart} style={styles.button}>
          시작하기
        </button>
      )}

      {phase === 'result' && (
        <div style={styles.resultBox}>
          <p>정답률: {correctRate}%</p>
          <button onClick={handleStart} style={styles.button}>
            {nextTest ? '다음 테스트 ▶' : '결과 보기 ▶'}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 100px)',
    gridGap: '12px',
    justifyContent: 'center',
    margin: '30px 0',
  },
  cell: {
    width: '100px',
    height: '100px',
    backgroundColor: '#eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '12px',
    cursor: 'pointer',
    border: '2px solid #ccc',
  },
  circle: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'white',
  },
  square: {
    width: '30px',
    height: '30px',
    backgroundColor: 'white',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderBottom: '30px solid white',
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
  resultBox: {
    background: 'white',
    color: '#333',
    display: 'inline-block',
    padding: '20px',
    borderRadius: '10px',
  },
};

export default SpatialMemoryPage;
