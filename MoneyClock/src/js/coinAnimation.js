/**
 * 底部金币流动动画
 * 创建一个连续的金币流动效果，金币从左往右缓缓移动
 */

class CoinStream {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.coins = [];
      this.coinImages = [];
      this.isActive = true;
      this.streamHeight = 50; // 金币流的高度区域
      
      this.initialize();
    }
    
    initialize() {
      // 设置画布样式
      this.canvas.className = 'coin-stream-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.bottom = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = `${this.streamHeight}px`;
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '50';
      
      // 添加到文档
      document.body.appendChild(this.canvas);
      
      // 设置画布尺寸
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      
      // 加载金币图片
      this.loadCoinImages();
      
      // 初始化一批金币
      this.initializeCoins();
      
      // 开始动画
      this.animate();
    }
    
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = this.streamHeight;
      
      // 调整金币数量以适应屏幕宽度
      this.updateCoinCount();
    }
    
    loadCoinImages() {
      const coinUrls = [
        'https://cdn-icons-png.flaticon.com/512/2489/2489756.png',
        'https://cdn-icons-png.flaticon.com/512/272/272535.png',
        'https://cdn-icons-png.flaticon.com/512/217/217853.png',
        'https://cdn-icons-png.flaticon.com/512/566/566445.png',
        'https://cdn-icons-png.flaticon.com/512/1490/1490897.png'
      ];
      
      coinUrls.forEach(url => {
        const img = new Image();
        img.src = url;
        this.coinImages.push(img);
      });
    }
    
    updateCoinCount() {
      // 根据屏幕宽度调整金币数量
      const desiredCount = Math.floor(this.canvas.width / 100); // 每100px一个金币
      
      // 添加更多金币，如果需要的话
      while (this.coins.length < desiredCount) {
        this.addCoin(true);
      }
    }
    
    initializeCoins() {
      // 初始化金币，均匀分布在整个宽度上
      const coinCount = Math.max(5, Math.floor(this.canvas.width / 100));
      
      for (let i = 0; i < coinCount; i++) {
        const x = (this.canvas.width / coinCount) * i;
        this.addCoinAt(x);
      }
    }
    
    addCoin(isOffscreen = false) {
      // 创建一个新金币
      const imgIndex = Math.floor(Math.random() * this.coinImages.length);
      const size = 15 + Math.random() * 20;
      const x = isOffscreen ? -size : Math.random() * this.canvas.width;
      const y = Math.random() * (this.canvas.height - size);
      const speed = 0.3 + Math.random() * 1.2; // 随机速度
      const rotationSpeed = Math.random() * 0.02 - 0.01;
      
      this.coins.push({
        x,
        y,
        size,
        speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed,
        imgIndex,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.7 + Math.random() * 0.3,
        wobbleSpeed: 0.01 + Math.random() * 0.03,
        wobblePos: Math.random() * Math.PI * 2
      });
    }
    
    addCoinAt(x) {
      // 在特定位置添加金币
      const imgIndex = Math.floor(Math.random() * this.coinImages.length);
      const size = 15 + Math.random() * 20;
      const y = Math.random() * (this.canvas.height - size);
      const speed = 0.3 + Math.random() * 1.2; // 随机速度
      const rotationSpeed = Math.random() * 0.02 - 0.01;
      
      this.coins.push({
        x,
        y,
        size,
        speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed,
        imgIndex,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.7 + Math.random() * 0.3,
        wobbleSpeed: 0.01 + Math.random() * 0.03,
        wobblePos: Math.random() * Math.PI * 2
      });
    }
    
    animate() {
      if (!this.isActive) return;
      
      // 清除画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 更新和绘制金币
      for (let i = 0; i < this.coins.length; i++) {
        const coin = this.coins[i];
        
        // 更新位置
        coin.x += coin.speed;
        // 添加上下小幅度摆动，制造流动感
        coin.wobblePos += coin.wobbleSpeed;
        const wobbleOffset = Math.sin(coin.wobblePos) * 2;
        
        // 更新旋转
        coin.rotation += coin.rotationSpeed;
        
        // 如果金币超出屏幕，重新从左侧出现
        if (coin.x > this.canvas.width + coin.size) {
          coin.x = -coin.size;
          coin.y = Math.random() * (this.canvas.height - coin.size);
          coin.wobblePos = Math.random() * Math.PI * 2;
        }
        
        // 绘制金币
        this.ctx.save();
        this.ctx.translate(coin.x, coin.y + wobbleOffset);
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
          // 如果图片未加载完成，显示一个圆形代替
          this.ctx.fillStyle = "#FFD700";
          this.ctx.beginPath();
          this.ctx.arc(0, 0, coin.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }
        
        this.ctx.restore();
      }
      
      // 随机添加新金币
      if (Math.random() < 0.03) {
        this.addCoin(true);
      }
      
      // 继续下一帧动画
      requestAnimationFrame(() => this.animate());
    }
    
    // 显示/隐藏金币流
    toggleVisibility(visible) {
      this.canvas.style.opacity = visible ? '1' : '0';
      this.isActive = visible;
      
      if (visible && !this.animationRunning) {
        this.animate();
      }
    }
    
    // 增加金币爆发效果（与特定事件关联）
    burst() {
      // 快速添加一批金币
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const randomX = Math.random() * this.canvas.width;
          this.addCoinAt(randomX);
        }, i * 100);
      }
    }
  }
  
  // 导出金币流类
  export default CoinStream;