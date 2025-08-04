// src/pages/CognitiveFlexPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const colors = ['빨강', '노랑', '초록', '파랑'];
const colorMap = {
  빨강: 'red',
  노랑: 'yellow',
  초록: 'green',
  파랑: 'blue',
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function CognitiveFlexPage() {
  const [phase, setPhase] = useState('ready'); // ready | question | result
  const [round, setRound] = useState(0);
  const [questionType, setQuestionType] = useState('');
  const [textColor, setTextColor] = useState('');
  const [textWord, setTextWord] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('시작하기를 눌러주세요!');
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const selectedTests = JSON.parse(localStorage.getItem('selectedTests')) || [];
  const currentTestId = 'flexibility';
  const currentIndex = selectedTests.indexOf(currentTestId);
  const nextTest = selectedTests[currentIndex + 1];

  const startQuestion = () => {
    const word = getRandomItem(colors);
    let color = getRandomItem(colors);
    while (color === word) {
      color = getRandomItem(colors);
    }

    const type = Math.random() > 0.5 ? '글자' : '색깔';

    setTextWord(word);
    setTextColor(color);
    setQuestionType(type);
    setPhase('question');
    setStartTime(Date.now());
    setMessage(`${type}을(를) 선택하세요`);

    timeoutRef.current = setTimeout(() => {
      recordAnswer(null); // 시간 초과 시 오답 처리
    }, 5000);
  };

  const recordAnswer = (answer) => {
    clearTimeout(timeoutRef.current);

    const endTime = Date.now();
    const target = questionType === '글자' ? textWord : textColor;
    const isCorrect = answer === target;
    const timeTaken = endTime - startTime;

    setResults((prev) => [...prev, { isCorrect, time: timeTaken }]);

    if (results.length + 1 >= 5) {
      setPhase('result');
      setMessage('테스트 완료!');
    } else {
      setRound((r) => r + 1);
      setPhase('ready');
      setMessage('다음 라운드를 시작하세요');
    }
  };

  const handleStart = () => {
    if (phase === 'ready') {
      startQuestion();
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

  const avgTime = results.length
    ? Math.round(results.reduce((a, b) => a + b.time, 0) / results.length)
    : 0;

  useEffect(() => {
    if (phase === 'result') {
      const flexibilityResult = { correctRate, avgTime };
      localStorage.setItem("flexibilityResult", JSON.stringify(flexibilityResult));
    }
  }, [phase, correctRate, avgTime]);

  return (
    <div style={styles.container}>
      <h2>{message}</h2>

      {phase === 'question' && (
        <>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: colorMap[textColor],
              margin: '20px',
            }}
          >
            {textWord}
          </div>
          <div style={styles.choices}>
            {colors.map((c) => (
              <button key={c} onClick={() => recordAnswer(c)} style={styles.button}>
                {c}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'ready' && (
        <button onClick={handleStart} style={styles.button}>
          {round === 0 ? '시작하기' : '다음 문제'}
        </button>
      )}

      {phase === 'result' && (
        <div style={styles.resultBox}>
          <p>정답률: {correctRate}%</p>
          <p>평균 반응 시간: {avgTime}ms</p>
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
  choices: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 120px)',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '20px',
  },
  button: {
    padding: '14px 20px',
    fontSize: '18px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
  },
  resultBox: {
    background: 'white',
    color: '#333',
    padding: '20px',
    borderRadius: '10px',
    display: 'inline-block',
  },
};

export default CognitiveFlexPage;
