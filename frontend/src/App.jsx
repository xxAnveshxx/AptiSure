import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Test from './pages/Test';
import TestTaking from './pages/TestTaking';
import Results from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test/:testId/start" element={<TestTaking />} />
        <Route path="/results/:id" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;