// src/pages/UserFormPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserFormPage(){
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if(!name || !age || !gender){
      alert('모든 정보를 입력해주세요!');
      return;
    }

    // 사용자 정보를 localStorage에 저장 (임시로 다음 페이지에서 불러오기 위함)
    localStorage.setItem('userInfo', JSON.stringify({ name, age, gender }));

    // 페이지 2로 이동
    navigate('/select');
  };

  return(
    <div style={styles.container}>
      <h1>사용자 정보 입력</h1>

      <label style={styles.label}>이름</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>나이</label>
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>성별</label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        style={styles.input}
      >
        <option value="" disabled>선택하세요</option>
        <option value="남성">남성</option>
        <option value="여성">여성</option>
        <option value="기타">기타</option>
      </select>

      <button onClick={handleNext} style={styles.button}>
        다음 ▶
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    marginBottom: '4px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default UserFormPage;
