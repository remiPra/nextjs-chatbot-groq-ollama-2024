import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId); // Nettoyer l'intervalle en cas de démontage du composant
  }, [text, speed]);

  return <div>{displayedText}</div>;
};

export default TypingEffect;
