export const speak = (text) => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.onend = resolve;
      synth.speak(utterance);
    });
  };
  