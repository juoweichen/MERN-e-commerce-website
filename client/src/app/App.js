import React, { useState, useEffect } from 'react';

import { getCategories } from '../services/category';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initFetch() {
      try {
        // fetch categories
        const categoryRes = await getCategories();
        setCategories(categoryRes.data);
        // set is loading to false :P
        setIsLoading(false);
      }
      catch (ex) {
        throw ex
      }
    }
    initFetch();
  }, [])

  return (
    <div className="App">
      <p>Welcome to worldwide</p>
      {isLoading ?
        <p>Loading...</p> :
        categories.map(category => <p>{category.name}</p>)
      }
    </div>
  );
}

export default App;
