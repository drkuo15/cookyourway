import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Cooking from './pages/Cooking';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/cooking" element={<Cooking />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
