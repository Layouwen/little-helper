import bell from '@/assets/audio/bell.mp3';

export const zeroFill = (n: number) => {
  if (n < 10) {
    return '0' + n;
  }
  return String(n);
};

export const playAudio = () => {
  const audio = new Audio();
  audio.src = bell;
  void audio.play();
};
