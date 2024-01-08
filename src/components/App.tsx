import React from "react";
import Game from "./Game";
import LanguageSwitcher from "./LanguageSwitcher";

const App: React.FC = () => {
  return (
    <div className="App">
      <LanguageSwitcher />
      <Game />
    </div>
  );
};

export default App;
