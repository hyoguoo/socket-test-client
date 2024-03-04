import { Route, Routes } from 'react-router-dom';

import ChattingPage from './pages/ChattingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ChattingPage />} />
    </Routes>
  );
}
