import React from 'react';
import GamePlay from "./containers/GamePlay";
import './App.scss';

/**
 * Throws user directly into game play.
 * TODO: Start user at title page level
 */
function App() {
  return (
    <div className="laverty-pinocle-app">
      <GamePlay />
    </div>
  );
}

export default App;
