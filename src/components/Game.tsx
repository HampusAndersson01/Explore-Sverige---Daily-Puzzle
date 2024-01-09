import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import Select from "react-select";
import { Feedback, FeedbackData, Landmark, LandmarksData } from "../types";
import landmarksData from "../landmarks.json";
import { useLanguage, Language } from "../LanguageContext";
import { db } from "../firebase";
import { get, ref, orderByKey, startAt, set, query } from "firebase/database";
import FeedbackList from "./FeedbackList";
import { getCompassDirection, getPreciseDistance } from "geolib";

const Game: React.FC = () => {
  const { language, setLanguage } = useLanguage(); // Use the language context

  const [guess, setGuess] = useState<string>("");
  const [feedback, setFeedback] = useState<FeedbackData>({} as FeedbackData);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(
    null
  );
  const [todaysLandmark, setTodaysLandmark] = useState<Landmark | null>(null);
  const [searchResults, setSearchResults] = useState<Landmark[]>([]);
  const [isFullMatch, setIsFullMatch] = useState<boolean>(false);
  const selectRef = React.createRef();

  const [guessCorrect, setGuessCorrect] = useState<boolean>(false);

  const landmarks: LandmarksData = landmarksData as LandmarksData;

  const pickDailyLandmark = async () => {
    const today = new Date().toISOString().split("T")[0];

    const snapshot = await get(ref(db, `dailyLandmarks/${today}`));
    if (!snapshot.exists()) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const usedLandmarksSnapshot = await get(
        query(
          ref(db, "dailyLandmarks"),
          orderByKey(),
          startAt(thirtyDaysAgo.toISOString().split("T")[0])
        )
      );

      const usedLandmarks = usedLandmarksSnapshot.val();
      const availableLandmarks = landmarks.landmarks.filter(
        (landmark) =>
          !usedLandmarks || !usedLandmarks[landmark.swedish.toLowerCase()]
      );

      const randomLandmark =
        availableLandmarks[
          Math.floor(Math.random() * availableLandmarks.length)
        ];

      await set(ref(db, `dailyLandmarks/${today}`), {
        [randomLandmark.swedish.toLowerCase()]: true,
      });

      // Save the entire landmark type
      setTodaysLandmark(randomLandmark);
    } else {
      const selectedLandmarkKey = Object.keys(snapshot.val())[0];
      const selectedLandmark = landmarks.landmarks.find(
        (landmark) => landmark.swedish.toLowerCase() === selectedLandmarkKey
      );
      if (selectedLandmark) {
        setTodaysLandmark(selectedLandmark);
      }
    }
  };

  useEffect(() => {
    pickDailyLandmark();
  }, []);

  const calculateScore = (distance: number) => {
    var score = 100 * Math.pow(0.999, distance);

    return Math.round(score);
  };

  const calculateDistance = (guess: Landmark, answer: Landmark) => {
    var guessLat = guess.latitude;
    var guessLong = guess.longitude;

    var answerLat = answer.latitude;
    var answerLong = answer.longitude;

    var distance = getPreciseDistance(
      { latitude: guessLat, longitude: guessLong },
      { latitude: answerLat, longitude: answerLong }
    );
    distance = distance / 1000;
    return distance;
  };

  const calculateDirection = (guess: Landmark, answer: Landmark) => {
    var guessLat = guess.latitude;
    var guessLong = guess.longitude;

    var answerLat = answer.latitude;
    var answerLong = answer.longitude;

    var direction = getCompassDirection(
      { latitude: guessLat, longitude: guessLong },
      { latitude: answerLat, longitude: answerLong }
    );
    return direction;
  };

  const addGuessToFeedback = (
    guess: Landmark,
    distance: number,
    score: number,
    direction: string
  ) => {
    const newFeedback = {
      ...feedback,
      guesses: {
        ...feedback.guesses,
        [guess.swedish.toLowerCase()]: {
          ...guess,
          distance,
          score,
          direction,
        },
      },
    };

    setFeedback(newFeedback);
  };

  const handleGuess = () => {
    var guessItem = landmarks.landmarks.find(
      (landmark) =>
        landmark.swedish.toLowerCase() === guess.toLowerCase() ||
        landmark.english.toLowerCase() === guess.toLowerCase()
    );

    // if guess exists in feedback, ignore
    if (
      guessItem !== undefined &&
      feedback.guesses !== undefined &&
      (feedback.guesses as Record<string, any>)[guessItem.swedish.toLowerCase()]
    ) {
      return;
    }

    var distance = 0;
    var score = 100;
    var direction = "";

    if (guess.toLowerCase() === todaysLandmark?.swedish.toLowerCase()) {
      setGuessCorrect(true);
    } else {
      if (guessItem && todaysLandmark) {
        var distance = calculateDistance(guessItem, todaysLandmark);

        var score = calculateScore(distance);
        distance = Math.round(distance);
        direction = calculateDirection(guessItem, todaysLandmark);
      }
    }

    if (guessItem) {
      addGuessToFeedback(guessItem, distance, score, direction);

      setSelectedLandmark(null);

      if (selectRef.current) {
      }
    }
  };

  const handleLandmarkSelect = (selectedOption: any) => {
    const selectedLandmark = selectedOption.value;
    setGuess(selectedLandmark[language]);
    setSelectedLandmark(selectedLandmark);
    setSearchResults([]);
  };

  let selectOptions = landmarks.landmarks.map((landmark) => {
    const translatedLandmark = {
      ...landmark,
      label:
        language === Language.English ? landmark.english : landmark.swedish,
    };

    return {
      value: translatedLandmark,
      label: translatedLandmark[language],
    };
  });

  selectOptions = selectOptions.sort((a, b) =>
    a.label.localeCompare(
      b.label,
      language === Language.English ? "en" : "sv",
      {
        sensitivity: "base",
      }
    )
  );

  return (
    <div className="container">
      <header>
        <h1>Explore Sverige</h1>
        <h2>Daily Puzzle</h2>
      </header>

      <div className="select-container">
        <Select
          className="basic-single"
          classNamePrefix="select"
          value={selectOptions.find(
            (option) => option.value === selectedLandmark
          )}
          onChange={handleLandmarkSelect}
          options={selectOptions}
          placeholder={`${
            language === Language.English ? "Select a city" : "Välj en stad"
          }`}
          isSearchable
          isDisabled={guessCorrect}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "#FECC02",
              primary: "black",
            },
          })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGuess();
            }
          }}
        />
        <button
          className="submit-guess-button"
          onClick={handleGuess}
          disabled={!selectedLandmark || guessCorrect}
        >
          {language === Language.English ? "Guess" : "Gissa"}
        </button>
      </div>
      <div className="feedback-container">
        <FeedbackList feedback={feedback} />
      </div>
    </div>
  );
};

export default Game;
