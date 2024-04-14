import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [established, establish] = useState(0);

  useEffect(() => {
    fetch('/').then(res => res.json()).then(data => {
      establish("Hello World!");
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">

        ... no changes in this part ...

        <p>{established}</p>
      </header>
    </div>
  );
}

export default App;
