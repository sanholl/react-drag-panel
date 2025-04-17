import './index.css';

import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PanelGrid from '../src/components/PanelGrid';
import Example1 from './Example1';
import Example2 from './Example2';

const App = () => {
  return (
    <Routes>
      <Route path="/example1" element={<Example1 />} />
      <Route path="/example2" element={<Example2 />} />
    </Routes>
  );
};

export default App;