export class SoundEngine {
  constructor() {
    this._ctx = null;
    this._masterGain = null;
    this._flightOsc = null;
    this._flightGain = null;
    this._muted = false;
    this._volume = 0.5;
  }

  _ensureContext() {
    if (this._ctx) return true;
    if (typeof window === 'undefined') return false;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    this._ctx = new AudioCtx();
    this._masterGain = this._ctx.createGain();
    this._masterGain.gain.value = this._volume;
    this._masterGain.connect(this._ctx.destination);
    return true;
  }

  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this._masterGain) {
      this._masterGain.gain.value = this._muted ? 0 : this._volume;
    }
  }

  toggleMute() {
    this._muted = !this._muted;
    if (this._masterGain) {
      this._masterGain.gain.value = this._muted ? 0 : this._volume;
    }
    return this._muted;
  }

  get isMuted() {
    return this._muted;
  }

  _playTone(freq, type, duration, gainValue, startTime) {
    if (!this._ensureContext()) return;
    const ctx = this._ctx;
    const t = startTime ?? ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(gainValue, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this._masterGain);
    osc.start(t);
    osc.stop(t + duration);
  }

  _playNoise(duration, gainValue, filterFreq, startTime) {
    if (!this._ensureContext()) return;
    const ctx = this._ctx;
    const t = startTime ?? ctx.currentTime;
    const sampleCount = Math.ceil(ctx.sampleRate * duration);

    const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this._masterGain);
    source.start(t);
    source.stop(t + duration);
  }

  tick() {
    this._playTone(1200, 'square', 0.04, 0.08);
  }

  buttonClick() {
    this._playTone(800, 'square', 0.03, 0.05);
  }

  flightStart() {
    if (!this._ensureContext()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;

    this._playTone(150, 'sine', 0.3, 0.15, t);
    this._playTone(200, 'sine', 0.3, 0.1, t + 0.05);
    this._playTone(300, 'sine', 0.2, 0.08, t + 0.1);

    this._startFlightOsc();
  }

  _startFlightOsc() {
    if (!this._ensureContext()) return;
    this._stopFlightOsc();

    const ctx = this._ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);

    osc.connect(gain);
    gain.connect(this._masterGain);
    osc.start();

    this._flightOsc = osc;
    this._flightGain = gain;
  }

  _stopFlightOsc() {
    if (this._flightOsc) {
      try {
        this._flightOsc.stop();
        this._flightOsc.disconnect();
      } catch {
        // already stopped
      }
      this._flightOsc = null;
    }
    if (this._flightGain) {
      this._flightGain.disconnect();
      this._flightGain = null;
    }
  }

  updateMultiplier(multiplier) {
    if (!this._flightOsc || !this._ctx) return;

    const freq = 220 + Math.min(multiplier, 100) * 12;
    const maxVol = Math.min(0.06 + multiplier * 0.002, 0.2);

    this._flightOsc.frequency.setTargetAtTime(freq, this._ctx.currentTime, 0.05);
    this._flightGain.gain.setTargetAtTime(maxVol, this._ctx.currentTime, 0.05);
  }

  cashout() {
    if (!this._ensureContext()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;

    this._stopFlightOsc();

    const freqs = [880, 1100, 1320, 1760];
    for (let i = 0; i < freqs.length; i++) {
      this._playTone(freqs[i], 'sine', 0.4 - i * 0.05, 0.15, t + i * 0.06);
    }
  }

  crash() {
    if (!this._ensureContext()) return;
    const ctx = this._ctx;
    const t = ctx.currentTime;

    this._stopFlightOsc();

    this._playNoise(0.6, 0.25, 3000, t);
    this._playTone(60, 'sine', 0.5, 0.3, t);
    this._playTone(40, 'sine', 0.7, 0.2, t + 0.05);
    this._playNoise(0.3, 0.1, 800, t + 0.1);
  }

  dispose() {
    this._stopFlightOsc();
    if (this._ctx) {
      this._ctx.close();
      this._ctx = null;
    }
  }
}
