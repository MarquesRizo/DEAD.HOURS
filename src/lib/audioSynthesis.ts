/**
 * DEAD HOURS — Sintetizador de Áudio Diegético Web Audio API
 * 100% Client-side, zero arquivos externos (.mp3/.wav), zero dependências.
 * Respeita rigorosamente a preferência do usuário (MUTE por padrão).
 */

class TacticalSoundSystem {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private isRadioPlaying: boolean = false;
  private volume: number = 0.04; // Volume de fundo muito sutil por padrão

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Inicia a reprodução de estática analógica de rádio VHF/AM (142.8 MHz).
   */
  public startRadioNoise(): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;

    if (this.isRadioPlaying) return true;

    try {
      // Cria buffer de ruído analógico de 3 segundos em loop
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Preenchimento com ruído suave levemente filtrado
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Filtro passa-baixa simples para aproximar de ruído rosa/estática de rádio
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filtro passa-faixa característico de rádio analógico VHF
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1400; // Frequência central
      bandpass.Q.value = 1.8;

      // Filtro de corte alto para remover sibilância excessiva
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 2600;

      // Controle de ganho sutil
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume, ctx.currentTime);

      // Conexões
      noiseSource.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();

      this.noiseNode = noiseSource;
      this.noiseGain = gain;
      this.isRadioPlaying = true;
      return true;
    } catch (e) {
      console.warn('Web Audio indisponível para rádio:', e);
      return false;
    }
  }

  /**
   * Interrompe o ruído de rádio
   */
  public stopRadioNoise() {
    if (!this.isRadioPlaying) return;
    try {
      if (this.noiseGain && this.ctx) {
        // Fade out rápido de 50ms para evitar 'pop' sonoro
        this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, this.ctx.currentTime);
        this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
      }
      setTimeout(() => {
        if (this.noiseNode) {
          try {
            this.noiseNode.stop();
            this.noiseNode.disconnect();
          } catch {}
          this.noiseNode = null;
        }
      }, 60);
    } catch {}
    this.isRadioPlaying = false;
  }

  /**
   * Alterna o estado do ruído de rádio
   */
  public toggleRadio(): boolean {
    if (this.isRadioPlaying) {
      this.stopRadioNoise();
      return false;
    } else {
      return this.startRadioNoise();
    }
  }

  public getIsPlaying(): boolean {
    return this.isRadioPlaying;
  }

  public setVolume(level: number) {
    this.volume = Math.max(0, Math.min(0.2, level));
    if (this.noiseGain && this.ctx) {
      this.noiseGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  /**
   * Bip tátil de telex / teclado mecânico para feedback de cópia ou clique tático
   */
  public playTacticalClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }

  /**
   * Bip curto de rádio (roger beep / confirmação de telemetria)
   */
  public playRogerBeep() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, ctx.currentTime);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  }
}

export const tacticalAudio = new TacticalSoundSystem();
