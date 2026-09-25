import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProgressProvider } from './state/ProgressContext';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import ModulePage from './pages/ModulePage';
import LessonPage from './pages/LessonPage';
import Dashboard from './pages/Dashboard';
import Glossary from './pages/Glossary';
import About from './pages/About';
import References from './pages/References';
import WorkLog from './pages/WorkLog';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="learn" element={<Learn />} />
            <Route path="learn/:moduleId" element={<ModulePage />} />
            <Route path="learn/:moduleId/:lessonId" element={<LessonPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="about" element={<About />} />
            <Route path="references" element={<References />} />
            <Route path="work-log" element={<WorkLog />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  );
}
