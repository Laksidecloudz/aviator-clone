const MAX_PARTICLES = 200;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 0;
    this.maxLife = 0;
    this.size = 0;
    this.color = '#00ff88';
    this.alpha = 1;
    this.active = false;
  }
}

export class ParticlePool {
  constructor() {
    this._particles = new Array(MAX_PARTICLES);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this._particles[i] = new Particle();
    }
    this._nextIndex = 0;
  }

  spawn(x, y, config) {
    const p = this._particles[this._nextIndex];
    this._nextIndex = (this._nextIndex + 1) % MAX_PARTICLES;

    p.x = x + (config.spreadX || 0) * (Math.random() * 2 - 1);
    p.y = y + (config.spreadY || 0) * (Math.random() * 2 - 1);
    p.vx = (config.vx || 0) + (config.randomVx || 0) * (Math.random() * 2 - 1);
    p.vy = (config.vy || 0) + (config.randomVy || 0) * (Math.random() * 2 - 1);
    p.maxLife = config.maxLife || 1000;
    p.life = p.maxLife;
    p.size = config.size || 2;
    p.color = config.color || '#00ff88';
    p.alpha = config.alpha || 1;
    p.active = true;
  }

  update(dtMs) {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = this._particles[i];
      if (!p.active) continue;

      p.life -= dtMs;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }

      p.x += p.vx * (dtMs / 1000);
      p.y += p.vy * (dtMs / 1000);
      p.alpha = p.life / p.maxLife;
      p.size *= 0.998;
    }
  }

  draw(ctx) {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = this._particles[i];
      if (!p.active) continue;

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  spawnTrail(x, y) {
    this.spawn(x, y, {
      spreadX: 4,
      spreadY: 4,
      vx: -20,
      vy: 10,
      randomVx: 10,
      randomVy: 15,
      maxLife: 600,
      size: 2.5,
      color: '#ff8800',
      alpha: 0.7,
    });
  }

  spawnCrashBurst(x, y) {
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * 6.2832;
      const speed = 100 + Math.random() * 200;
      this.spawn(x, y, {
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        maxLife: 800 + Math.random() * 400,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#ff3366' : '#ff8800',
        alpha: 1,
      });
    }
  }
}
