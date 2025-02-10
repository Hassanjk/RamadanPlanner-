import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Store from './pages/Store';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;