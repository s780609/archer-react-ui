import React, { useState, useEffect, useRef } from "react";

import styled from "styled-components";

const Keyboard = styled.div`
  display: block;
  position: fixed;
  width: 3rem;
  line-height: 3rem;
  background: #0d6efd !important;
  color: "white";
  text-align: center;
  top: 50%;
  right: 0;
  margin-top: -2rem;
  padding: 1rem 0 1rem 0;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  transition: background-color var(1);
  overflow: hidden;
  z-index: 999;
  box-shadow: -0.25rem 0 1rem rgba(0, 0, 0, 0.15);

  button {
    background-color: "#AA7D24";

    &:hover {
      background-color: rgb(179, 147, 88) !important;
    }
  }
`;

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

      if (typeof onClick === "function") {
        onClick(e);
      }

      targetElement.current.focus();
    }
  };

  return (
    <>
      <Keyboard>
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
      </Keyboard>
    </>
  );
}

export default SpecialCharacterKeyboard;
