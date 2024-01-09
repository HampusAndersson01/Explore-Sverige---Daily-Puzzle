import React from "react";
import Game from "./Game";
import LanguageSwitcher from "./LanguageSwitcher";

const App: React.FC = () => {
  return (
    <div className="App">
      <LanguageSwitcher />
      <Game />
      <p
        style={{
          position: "absolute",
          bottom: "0",
          margin: "2rem",
        }}
      >
        Created by{" "}
        <a
          href="https://github.com/HampusAndersson01"
          style={{ color: "black", textDecoration: "underline" }}
          target="_blank"
        >
          Hampus Andersson
        </a>
      </p>
    </div>
  );
};

export default App;
