export const zeroFill = (n: number) => {
  if (n < 10) {
    return '0' + n;
  }
  return String(n);
};

export const playAudio = () => {
  const audio = new Audio();
  audio.src = '/src/assets/audio/bell.mp3';
  void audio.play();
};
