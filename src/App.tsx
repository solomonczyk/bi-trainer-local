import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import ModulePage from './pages/ModulePage';
import QuestionPage from './pages/QuestionPage';
import ExamPage from './pages/ExamPage';
import ReportPage from './pages/ReportPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/diagnostics" element={<DiagnosticsPage />} />
        <Route path="/modules/:moduleId" element={<ModulePage />} />
        <Route path="/modules/:moduleId/:questionId" element={<QuestionPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Route>
    </Routes>
  );
}
