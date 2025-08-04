import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserFormPage from './pages/UserFormPage';
import TestSelectPage from './pages/TestSelectPage';
import ReactionTestPage from './pages/ReactionTestPage';
import SpatialMemoryPage from './pages/SpatialMemoryPage';
import NumberMemoryPage from './pages/NumberMemoryPage';
import CognitiveFlexPage from './pages/CognitiveFlexPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserFormPage />} />
        <Route path="/select" element={<TestSelectPage />} />
        <Route path="/test/reaction" element={<ReactionTestPage />} />
        <Route path="/test/memory" element={<SpatialMemoryPage />} />
        <Route path="/test/numbers" element={<NumberMemoryPage />} />
        <Route path="/test/flexibility" element={<CognitiveFlexPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
