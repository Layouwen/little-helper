import bell from '@/assets/audio/bell.mp3';
import EventBus from '@/module/EventBus';
import Music from '@/module/Music';

export enum FocusClockStatus {
  START = 'start',
  PAUSE = 'pause',
  STOP = 'stop',
}

interface FocusClockConfig {
  playSound: number; // 音乐声音
  focusTime: number; // 专注时间（分钟）
  restTime: number; // 休息时间（分钟）
}

class FocusClock extends EventBus {
  private music: Music;
  private remainingTime = 0;
  private timer?: NodeJS.Timer;
  private timeout = 1000;
  private status = FocusClockStatus.STOP;

  constructor (private config: FocusClockConfig) {
    super();
    this.music = new Music(bell);
  }

  public getState () {
    return {
      remainingTime: this.remainingTime,
      status: this.status,
      focusTime: this.config.focusTime,
    };
  }

  public setFocusTime (n: number) {
    this.config.focusTime = n;
    this.initRemainingTime();
  }

  public setTimeout (timeout: number) {
    this.timeout = timeout;
    if (this.isStart()) {
      this.stop(false);
      this.start();
    }
  }

  public init () {
    this.initRemainingTime();
    this.emit('init', this.getState());
  }

  private initRemainingTime () {
    this.remainingTime = this.config.focusTime * 60;
  }

  public isStart () {
    return this.status === FocusClockStatus.START;
  }

  public start (isPlayMusic = true) {
    if (this.isStart()) return;
    this.status = FocusClockStatus.START;
    this.timer = setInterval(() => {
      if (this.remainingTime === 0) {
        this.stop();
        if (isPlayMusic) this.playMusic();
      } else {
        this.remainingTime--;
        this.emit('update', this.getState());
      }
    }, this.timeout);
  }

  public stop (isEmit = true) {
    if (!this.timer) return;
    this.status = FocusClockStatus.STOP;
    clearInterval(this.timer);
    this.timer = undefined;
    if (isEmit) {
      this.emit('end', this.getState());
    }
  }

  public playMusic () {
    this.music.play();
  }

  public pauseMusic () {
    this.music.pause();
  }

  public stopMusic () {
    this.music.stop();
  }
}

export default FocusClock;
