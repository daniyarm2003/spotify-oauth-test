import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/login/Login';
import { apiClient, ApiClientContext } from './api/server';
import TestPage from './pages/test/TestPage';
import AuthRedirectWrapper from './components/spotify-auth-redirect/AuthRedirectWrapper';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <ApiClientContext.Provider value={apiClient}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <AuthRedirectWrapper>
              <Dashboard />
            </AuthRedirectWrapper>} />
          <Route path='/login' element={<Login />} />
          <Route path='/test' element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </ApiClientContext.Provider>
  );
}

export default App;
