// LanguageSwitcher.tsx
import React from "react";
import { useLanguage, Language } from "../LanguageContext";
import { US, SE } from "country-flag-icons/react/3x2";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const switchLanguage = () => {
    const newLanguage =
      language === Language.English ? Language.Swedish : Language.English;
    setLanguage(newLanguage);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={switchLanguage}
    >
      {language === Language.Swedish ? (
        <US title="US" style={{ width: "30px", height: "20px" }} />
      ) : (
        <SE title="SE" style={{ width: "30px", height: "20px" }} />
      )}
    </div>
  );
};

export default LanguageSwitcher;
