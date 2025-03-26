// 金币爆炸效果类
export class CoinExplosion {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.coins = [];
    this.coinImages = [];
    this.soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') || 'true');
    this.coinSound = new Audio('./src/sounds/coin-sound.m4a'); // 请确保你有这个音效文件
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.loadCoinImages();
    this.setupSoundToggle();
  }
  
  updateSoundState(enabled) {
    this.soundEnabled = enabled;
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  loadCoinImages() {
    const coinUrls = [
      'https://cdn-icons-png.flaticon.com/512/2489/2489756.png',
      'https://cdn-icons-png.flaticon.com/512/272/272535.png',
      'https://cdn-icons-png.flaticon.com/512/217/217853.png'
    ];
    
    coinUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      this.coinImages.push(img);
    });
  }
  
  createCoin(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 3 + Math.random() * 5;
    const size = 15 + Math.random() * 15;
    const imgIndex = Math.floor(Math.random() * this.coinImages.length);
    
    return {
      x,
      y,
      size,
      velocity,
      angle,
      rotation: 0,
      rotationSpeed: Math.random() * 0.2 - 0.1,
      gravity: 0.1,
      opacity: 1,
      imgIndex
    };
  }
  
  setupSoundToggle() {
    // 使用已添加的音效开关元素
    const soundToggle = document.querySelector('.sound-toggle');
    if (soundToggle) {
      soundToggle.innerHTML = this.soundEnabled ? 
        '<i class="fas fa-volume-up"></i>' : 
        '<i class="fas fa-volume-mute"></i>';
      
      // 添加点击事件
      soundToggle.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled);
        soundToggle.innerHTML = this.soundEnabled ? 
          '<i class="fas fa-volume-up"></i>' : 
          '<i class="fas fa-volume-mute"></i>';
      });
    }
  }
  
  explode(x, y, count = 50) {
    for (let i = 0; i < count; i++) {
      this.coins.push(this.createCoin(x, y));
    }

    if (window.coinStream) {
      window.coinStream.burst();
    }

    if (this.soundEnabled) {
      this.coinSound.cloneNode(true).play().catch(e => {
        console.log("音效播放失败:", e);
      });
    }
    
    this.animate();
  }
  
  animate() {
    if (this.coins.length === 0) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.coins.length; i++) {
      const coin = this.coins[i];
      
      coin.x += Math.cos(coin.angle) * coin.velocity;
      coin.y += Math.sin(coin.angle) * coin.velocity + coin.gravity;
      coin.gravity += 0.05;
      coin.velocity *= 0.99;
      coin.rotation += coin.rotationSpeed;
      coin.opacity -= 0.005;
      
      this.ctx.save();
      this.ctx.translate(coin.x, coin.y);
      this.ctx.rotate(coin.rotation);
      this.ctx.globalAlpha = coin.opacity;
      
      if (this.coinImages[coin.imgIndex].complete) {
        this.ctx.drawImage(
          this.coinImages[coin.imgIndex], 
          -coin.size / 2, 
          -coin.size / 2, 
          coin.size, 
          coin.size
        );
      } else {
        this.ctx.fillStyle = "#FFD700";
        this.ctx.beginPath();
        this.ctx.arc(0, 0, coin.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
      
      if (coin.opacity <= 0) {
        this.coins.splice(i, 1);
        i--;
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}