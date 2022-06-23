import './App.css';
import {
  Routes, Route, BrowserRouter as Router,
} from 'react-router-dom';
import Cooking from './pages/Cooking';
import ModifyRecipe from './pages/ModifyRecipe/ModifyRecipe';
import ReadRecipe from './pages/ReadRecipe/readRecipe';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/cooking" element={<Cooking />} />
          <Route path="/modify_recipe" element={<ModifyRecipe />} />
          <Route path="/read_recipe" element={<ReadRecipe />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
