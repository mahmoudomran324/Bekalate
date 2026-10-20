/**
 * محرك تنبيه صوتي فوري مبني بالكامل على Web Audio API
 * يعمل بدون الحاجة لملفات صوت خارجية قد تتعطل أو تُحظر من المتصفح
 */

class AudioAlertEngine {
  private ctx: AudioContext | null = null;
  private isRinging = false;
  private timer: number | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGainNodes: GainNode[] = [];

  constructor() {
    this.initUnlockListeners();
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * إلغاء قفل الصوت تلقائياً عند أول لمسة أو ضغطة للمستخدم
   */
  private initUnlockListeners() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      try {
        const ctx = this.getContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      } catch (e) {
        console.warn('AudioContext unlock catch:', e);
      }
    };

    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
  }

  /**
   * تشغيل نغمة صفارة إنذار عالية ومميزة للتاجر (Hi-Lo Emergency Siren)
   * تستمر بالتكرار حتى يتم إيقافها أو قبول الطلب
   */
  public start(label?: string) {
    if (this.isRinging) return;
    this.isRinging = true;

    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      let highTone = true;

      const playPulse = () => {
        if (!this.isRinging) return;

        try {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          // الترددات الأوروبية لصفارات الطوارئ الحقيقية 960Hz و 770Hz
          const freq = highTone ? 960 : 770;
          highTone = !highTone;

          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(highTone ? 900 : 720, now + 0.35);

          // ضبط مستوى الصوت ليكون مسموعاً وواضحاً
          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.45, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.4);

          this.activeOscillators.push(osc);
          this.activeGainNodes.push(gain);

          // تنظيف المراجع المنتهية
          setTimeout(() => {
            const oscIdx = this.activeOscillators.indexOf(osc);
            if (oscIdx !== -1) this.activeOscillators.splice(oscIdx, 1);
            const gainIdx = this.activeGainNodes.indexOf(gain);
            if (gainIdx !== -1) this.activeGainNodes.splice(gainIdx, 1);
          }, 450);

        } catch (err) {
          console.error('Error generating audio pulse:', err);
        }

        if (this.isRinging) {
          this.timer = window.setTimeout(playPulse, 400);
        }
      };

      playPulse();
    } catch (err) {
      console.warn('AudioContext could not start immediately:', err);
    }
  }

  /**
   * إيقاف صفارة التنبيه فوراً
   */
  public stop() {
    this.isRinging = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    try {
      this.activeOscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      this.activeGainNodes.forEach(g => {
        try { g.disconnect(); } catch {}
      });
      this.activeOscillators = [];
      this.activeGainNodes = [];
    } catch (e) {
      console.warn('Error clearing oscillators:', e);
    }
  }

  public getIsRinging(): boolean {
    return this.isRinging;
  }

  /**
   * نغمة خفيفة لتأكيد الإجراءات (Chime)
   */
  public playChime() {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.1); // A5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Chime play error:', e);
    }
  }

  /**
   * تجربة الصوت والتأكد من تفعيله في المتصفح
   */
  public testSiren(): Promise<void> {
    return new Promise((resolve) => {
      this.start('تجربة الصوت');
      setTimeout(() => {
        this.stop();
        resolve();
      }, 1600);
    });
  }
}

export const audioAlert = new AudioAlertEngine();
