// src/pages/TestSelectPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TestSelectPage(){
  const navigate = useNavigate();
  const [selectedTests, setSelectedTests] = useState([]);

  const testOptions = [
    { id: 'reaction', label: '인지 속도 테스트' },
    { id: 'memory', label: '공간 기억력 테스트' },
    { id: 'numbers', label: '숫자 기억력 테스트' },
    { id: 'flexibility', label: '인지 전환 유연성 테스트' },
  ];

  const toggleSelection = (id) => {
    setSelectedTests((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const PRIORITY = {
    reaction: 1,
    memory: 2,
    numbers: 3,
    flexibility: 4,
  };

  const handleNext = () => {
    if(selectedTests.length === 0){
      alert('최소 하나 이상의 테스트를 선택해주세요!');
      return;
    }

    const ordered = [...selectedTests].sort((a, b) => PRIORITY[a] - PRIORITY[b]);

    localStorage.setItem('selectedTests', JSON.stringify(ordered));

    navigate(`/test/${ordered[0]}`);
  };

  return(
    <div style = {styles.container}>
      <h1>진행할 테스트를 선택하세요</h1>
      <div style = {styles.list}>
        {testOptions.map((test) => (
          <button
            key = {test.id}
            onClick = {() => toggleSelection(test.id)}
            aria-pressed = {selectedTests.includes(test.id)}
            style = {{
              ...styles.testButton,
              backgroundColor: selectedTests.includes(test.id)
                ? '#4CAF50'
                : '#f0f0f0',
              color: selectedTests.includes(test.id) ? 'white' : 'black',
            }}
          >
            {test.label}
          </button>
        ))}
      </div>

      <button onClick = {handleNext} style = {styles.nextButton}>
        다음 ▶
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px',
  },
  testButton: {
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '18px',
    cursor: 'pointer',
  },
  nextButton: {
    padding: '12px',
    fontSize: '18px',
    width: '100%',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default TestSelectPage;
