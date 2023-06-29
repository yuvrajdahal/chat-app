export function playAudio(path) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioElement = new Audio(path);

  const source = audioContext.createMediaElementSource(audioElement);
  source.connect(audioContext.destination);

  audioElement.play();
}
