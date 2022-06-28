import './App.css';
import {
  Routes, Route, BrowserRouter as Router,
} from 'react-router-dom';
import Cooking from './pages/Cooking';
import ModifyRecipe from './pages/ModifyRecipe/ModifyRecipe';
import ReadRecipe from './pages/ReadRecipe/ReadRecipe';
import SearchRecipe from './pages/SearchRecipe/SearchRecipe';
import Home from './pages/Home/home';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/cooking" element={<Cooking />} />
          <Route path="/modify_recipe" element={<ModifyRecipe />} />
          <Route path="/read_recipe" element={<ReadRecipe />} />
          <Route path="/search_recipe" element={<SearchRecipe />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
