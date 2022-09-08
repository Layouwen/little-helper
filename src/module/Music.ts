enum MusicStatus {
  PLAY,
  PAUSE,
  STOP
}

class Music {
  private audio: HTMLAudioElement;
  private status = MusicStatus.STOP;

  constructor (private src: string) {
    const audio = new Audio();
    audio.src = src;
    this.audio = audio;
  }

  public isPlaying () {
    return this.status === MusicStatus.PLAY;
  }

  public isPause () {
    return this.status === MusicStatus.PAUSE;
  }

  public isStop () {
    return this.status === MusicStatus.STOP;
  }

  public play () {
    if (this.isPlaying()) return;
    this.status = MusicStatus.PLAY;
    void this.audio.play();
  }

  public stop () {
    if (this.isStop()) return;
    this.status = MusicStatus.STOP;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  public pause () {
    if (!this.isPlaying()) return;
    this.status = MusicStatus.PAUSE;
    this.audio.pause();
  }
}

export default Music;
