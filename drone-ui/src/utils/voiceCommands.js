export const startVoiceCommands = (onCommand) => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.continuous = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const text = event.results[event.results.length - 1][0].transcript.toLowerCase();

    console.log("Voice:", text);

    if (text.includes("follow")) onCommand("FOLLOW");
    if (text.includes("stop")) onCommand("STOP");
    if (text.includes("left")) onCommand("LEFT");
    if (text.includes("right")) onCommand("RIGHT");
  };

  recognition.start();
};