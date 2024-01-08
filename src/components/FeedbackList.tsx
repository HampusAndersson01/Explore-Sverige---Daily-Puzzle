import React, { useEffect } from "react";
import { FeedbackData, Feedback } from "../types";
import { useLanguage, Language } from "../LanguageContext";

import {
  MdNorth,
  MdNorthEast,
  MdNorthWest,
  MdWest,
  MdEast,
  MdSouth,
  MdSouthEast,
  MdSouthWest,
} from "react-icons/md";
import { FaCheck } from "react-icons/fa";

interface FeedbackListProps {
  feedback: FeedbackData;
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedback }) => {
  const { language } = useLanguage();

  return (
    <div className="feedback-container">
      <table className="feedback-table">
        <tr>
          {language === Language.English ? (
            <>
              <th>Guess</th>
              <th>Distance (km)</th>
              <th>Direction</th>
              <th>Score</th>
            </>
          ) : (
            <>
              <th>Gissning</th>
              <th>Avstånd (km)</th>
              <th>Riktning</th>
              <th>Poäng</th>
            </>
          )}
        </tr>
        {feedback && feedback.guesses ? (
          Object.values(feedback.guesses)
            .sort((a: Feedback, b: Feedback) => a.distance - b.distance)
            .map((feedbackItem: Feedback) => (
              <tr
                key={feedbackItem.english}
                className={feedbackItem.distance === 0 ? "correct" : ""}
              >
                <td>
                  {language === Language.English
                    ? feedbackItem.english
                    : feedbackItem.swedish}
                </td>
                <td>{feedbackItem.distance} km</td>
                <td>
                  {feedbackItem.direction === "N" ||
                  feedbackItem.direction === "NNE" ||
                  feedbackItem.direction === "NNW" ? (
                    <MdNorth />
                  ) : feedbackItem.direction === "NE" ? (
                    <MdNorthEast />
                  ) : feedbackItem.direction === "NW" ? (
                    <MdNorthWest />
                  ) : feedbackItem.direction === "W" ||
                    feedbackItem.direction === "WNW" ||
                    feedbackItem.direction === "WSW" ? (
                    <MdWest />
                  ) : feedbackItem.direction === "E" ||
                    feedbackItem.direction === "ENE" ||
                    feedbackItem.direction === "ESE" ? (
                    <MdEast />
                  ) : feedbackItem.direction === "S" ||
                    feedbackItem.direction === "SSE" ||
                    feedbackItem.direction === "SSW" ? (
                    <MdSouth />
                  ) : feedbackItem.direction === "SE" ? (
                    <MdSouthEast />
                  ) : feedbackItem.direction === "SW" ? (
                    <MdSouthWest />
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  {feedbackItem.score === 100 ? (
                    <FaCheck
                      style={{
                        color: "green",
                      }}
                    />
                  ) : (
                    feedbackItem.score + " %"
                  )}
                </td>
              </tr>
            ))
        ) : (
          <tr>
            <td className="empty"></td>
          </tr>
        )}
      </table>
    </div>
  );
};

export default FeedbackList;
