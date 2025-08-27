// src/pages/UserFormPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserFormPage(){
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');

  const navigate = useNavigate();

  const appendAgeDigit = (d) => {
    if(age.length >= 3) return;
    if(age === '' && d === '0') return;   // 앞자리 0 방지
    setAge((prev) => prev + d);
  };
  const ageBackspace = () => setAge((prev) => prev.slice(0, -1));
  const clearAge = () => setAge('');

  const appendPhoneDigit = (d) => {
    if(phone.length >= 11) return;

    setPhone((prev) => prev + d);
  };
  const phoneBackspace = () => setPhone((prev) => prev.slice(0, -1));
  const clearPhone = () => setPhone('');

  const handleNext = () => {
    if(!age || !gender || !phone){
      alert('나이, 성별, 전화번호를 모두 입력해주세요!');
      return;
    }

    const ageNum = Number(age);
    if(Number.isNaN(ageNum) || ageNum <= 0 || ageNum > 120){
      alert('유효한 나이를 입력해주세요! (1~120)');
      return;
    }

    const onlyDigits = phone.replace(/\D/g, '');
    if(onlyDigits.length < 10 || onlyDigits.length > 11){
      alert('전화번호를 10~11자리 숫자로 입력해주세요.');
      return;
    }

    localStorage.setItem('userInfo', JSON.stringify({
      age: ageNum,
      gender,
      phone: onlyDigits
    }));

    navigate('/select');
  };

  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '전체 지우기'];

  return(
    <div style = {styles.container}>
      <h1>사용자 정보 입력</h1>

      <div style = {styles.twoCol}>
        <div style = {styles.card}>
          <label style = {styles.label}>나이</label>
          <input
            type = "text"
            value = {age}
            readOnly
            inputMode = "none"
            placeholder = "숫자 키패드로 입력"
            style = {{ ...styles.input, textAlign: 'center', fontSize: 22, letterSpacing: 1 }}
          />

          <div style = {styles.keypad}>
            {KEYS.map((key) => (
              <button
                key = {`age-${key}`}
                onClick = {() => {
                  if(key === '⌫') ageBackspace();
                  else if(key === '전체 지우기') clearAge();
                  else appendAgeDigit(key);
                }}
                style = {{
                  ...styles.key,
                  gridColumn: key === '전체 지우기' ? 'span 2' : 'auto',
                  backgroundColor: key === '⌫' ? '#FFD166' : key === '전체 지우기' ? '#EF476F' : '#ffffff',
                  color: key === '전체 지우기' ? '#ffffff' : '#333',
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div style = {styles.card}>
          <label style = {styles.label}>전화번호</label>
          <input
            type = "text"
            value = {phone}
            readOnly
            inputMode = "none"
            placeholder = "숫자 키패드로 입력"
            style = {{ ...styles.input, textAlign: 'center', fontSize: 22, letterSpacing: 1 }}
          />
          <div style = {styles.keypad}>
            {KEYS.map((key) => (
              <button
                key = {`phone-${key}`}
                onClick = {() => {
                  if(key === '⌫') phoneBackspace();
                  else if(key === '전체 지우기') clearPhone();
                  else appendPhoneDigit(key);
                }}
                style = {{
                  ...styles.key,
                  gridColumn: key === '전체 지우기' ? 'span 2' : 'auto',
                  backgroundColor: key === '⌫' ? '#FFD166' : key === '전체 지우기' ? '#EF476F' : '#ffffff',
                  color: key === '전체 지우기' ? '#ffffff' : '#333',
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label style = {styles.label}>성별</label>
      <select
        value = {gender}
        onChange = {(e) => setGender(e.target.value)}
        style = {styles.input}
      >
        <option value = "" disabled>선택하세요</option>
        <option value = "남성">남성</option>
        <option value = "여성">여성</option>
        <option value = "기타">기타</option>
      </select>

      <button onClick = {handleNext} style = {styles.button}>
        다음 ▶
      </button>
    </div>
  );
}

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '50px auto',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f5f7fb',
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    },
    twoCol: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',  // 좌우 2열
      gap: '24px',
      alignItems: 'start',
      marginBottom: '20px',
    },
    card: {
      background: '#ffffff',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
    },
    label: {
      display: 'block',
      textAlign: 'left',
      margin: '12px 0 6px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '10px',
      borderRadius: '10px',
      border: '1px solid #d0d7e2',
      background: '#fff',
      outline: 'none',
    },
    keypad: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '10px',
      margin: '12px 0 4px',
    },
    key: {
      padding: '14px 0',
      borderRadius: '12px',
      border: '1px solid #d0d7e2',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: 600,
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    },
    button: {
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      backgroundColor: '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      marginTop: '12px',
    },
  };

  export default UserFormPage;