import React from 'react';
import TitlePage from "./containers/TitlePage";
import './App.scss';

/**
 * Throws user directly into game play.
 * TODO: Start user at title page level
 */
function App() {
  return (
    <div className="laverty-pinocle-app">
      <TitlePage />
    </div>
  );
}

export default App;
