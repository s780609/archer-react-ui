import React, { useState, useEffect, useRef } from "react";

import "./specialCharacterKeyboard.css";

function SpecialCharacterKeyboard({ onClick }) {
  const symbolStyle = {
    backgroundColor: "#AA7D24",
    color: "#FFF",
    borderRadius: "3px",
    width: "2em",
    height: "2rem",
    cursor: "pointer",
    border: "none",
    display: "inline-block",
    textAlign: "center",
    fontSize: "1.2em",
  };

  const targetElement = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hasFocus()) {
        const tagName = document.activeElement.tagName;

        if (tagName === "INPUT" || tagName === "TEXTAREA") {
          if (targetElement.current) {
            if (targetElement.current.id !== document.activeElement.id) {
              targetElement.current = document.activeElement;
            }
          } else {
            targetElement.current = document.activeElement;
          }
        }
      }
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleKeyword = (e) => {
    if (!e.currentTarget) {
      console.error(new Error("!e.currentTarget"));
      return;
    }

    if (!e.currentTarget.innerText) {
      console.error(new Error("!e.currentTarget.innerText"));
      return;
    }

    if (!targetElement.current) {
      console.error(new Error("!targetElement.current"));
      return;
    }

    const specialCharacter = e.currentTarget.innerText;

    if (
      targetElement.current.tagName === "INPUT" ||
      targetElement.current.tagName === "TEXTAREA"
    ) {
      targetElement.current.value += specialCharacter;
      e.targetElement = targetElement.current;
      e.value = targetElement.current.value;

      if (typeof onClick === "function"){
        onClick(e);
      }

      targetElement.current.focus();
    }
  };

  return (
    <>
      <div className="special-character-keyboard">
        <button onClick={handleKeyword} style={symbolStyle}>
          <span>{"^"}</span>
        </button>
        <button onClick={handleKeyword} style={symbolStyle}>
          {"é"}
        </button>
        <button onClick={handleKeyword} style={symbolStyle}>
          {"ṟ"}
        </button>
        <button onClick={handleKeyword} style={symbolStyle}>
          {"ɨ"}
        </button>
        <button onClick={handleKeyword} style={symbolStyle}>
          {"ʉ"}
        </button>
        <button onClick={handleKeyword} style={symbolStyle}>
          {"’"}
        </button>
        <button onClick={handleKeyword} style={symbolStyle}>
          {":"}
        </button>
      </div>
    </>
  );
}

export default SpecialCharacterKeyboard;
