import { useEffect } from 'react';
import './App.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firestore';

function App() {
  async function getData() {
    const docRef = doc(db, 'recipes', 'O3pzlJ8g9gTtHahU9aeZ');
    const docSnap = await getDoc(docRef);
    console.log('Document data:', docSnap.data());
  }

  useEffect(() => { getData(); }, []);

  return (
    <div className="App">
      hello!
    </div>
  );
}

export default App;
