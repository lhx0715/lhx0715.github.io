import CoinStream from './js/coinAnimation.js';

// 配置参数
let HOURLY_RATE = 50 // 动态时薪（根据月薪计算）
const CELEBRATION_INTERVAL = 0.2 // 每增加100元触发庆祝效果

// 初始化变量
const salaryInput = document.getElementById('monthly-salary')
const startWorkBtn = document.getElementById('start-work')
const endWorkBtn = document.getElementById('end-work')
let isWorking = false
let startTime = Date.now()
let totalEarned = parseFloat(localStorage.getItem('totalEarned')) || 0
let wallet = parseFloat(localStorage.getItem('wallet')) || 0
let lastCelebration = Math.floor(totalEarned / CELEBRATION_INTERVAL)

// 初始化月薪设置
salaryInput.value = localStorage.getItem('monthlySalary') || '8000'
HOURLY_RATE = calculateHourlyRate(salaryInput.value)

// 开始工作按钮事件
startWorkBtn.addEventListener('click', () => {
  if (!isWorking) {
    isWorking = true;
    startTime = Date.now();
    totalEarned = 0;
    lastCelebration = Math.floor(totalEarned / CELEBRATION_INTERVAL);
    localStorage.removeItem('totalEarned');
    updateDisplay();
    
    // 添加动画效果
    startWorkBtn.classList.add('btn-active');
    setTimeout(() => startWorkBtn.classList.remove('btn-active'), 300);
    
    // 改变背景颜色为工作模式
    document.body.classList.add('working-mode');
  }
});

// 下班按钮事件
endWorkBtn.addEventListener('click', () => {
  if (isWorking) {
    isWorking = false;
    const earned = totalEarned + (Date.now() - startTime) / 3600000 * HOURLY_RATE;
    wallet += earned;
    localStorage.setItem('wallet', wallet.toFixed(2));
    updateWalletDisplay();
    
    // 添加动画效果
    endWorkBtn.classList.add('btn-active');
    setTimeout(() => endWorkBtn.classList.remove('btn-active'), 300);
    
    // 触发更大的金币庆祝效果
    coinEffect.explode(window.innerWidth / 2, window.innerHeight / 2, 80);
    
    // 恢复背景颜色
    document.body.classList.remove('working-mode');
    
    // 显示收入总结
    showEarningsSummary(earned);
  }
});

// 月薪输入事件监听
salaryInput.addEventListener('input', () => {
  const isValid = salaryInput.checkValidity()
  if (isValid) {
    localStorage.setItem('monthlySalary', salaryInput.value)
    HOURLY_RATE = calculateHourlyRate(parseFloat(salaryInput.value)); // 确保传入的是数字类型
    startTime = Date.now();
    totalEarned = 0;
    lastCelebration = Math.floor(totalEarned / CELEBRATION_INTERVAL); // 同步重置庆祝计数器
    localStorage.removeItem('totalEarned');
    updateDisplay();
  }
})

// 计算时薪函数
function calculateHourlyRate(monthlySalary) {
  return monthlySalary / 22 / 8 // 每月22个工作日，每天8小时
}

// 显示收入总结
function showEarningsSummary(earned) {
  // 如果已有总结面板，先关闭它
  if (currentEarningsSummary) {
    closeEarningsSummary();
    return;
  }
  
  // 计算工作时长
  const workDuration = calculateWorkDuration(startTime, Date.now());
  
  // 创建一个弹出总结框
  const summary = document.createElement('div');
  summary.className = 'earnings-summary';
  summary.innerHTML = `
    <div class="summary-content">
      <div class="summary-header">
        <i class="fas fa-check-circle"></i>
        <h3>工作完成！</h3>
      </div>
      
      <div class="summary-stats">
        <div class="summary-stat">
          <div class="stat-icon"><i class="fas fa-stopwatch"></i></div>
          <div class="stat-info">
            <div class="stat-label">工作时长</div>
            <div class="stat-value">${workDuration}</div>
          </div>
        </div>
        
        <div class="summary-stat">
          <div class="stat-icon"><i class="fas fa-coins"></i></div>
          <div class="stat-info">
            <div class="stat-label">本次收入</div>
            <div class="stat-value highlight">¥${earned.toFixed(2)}</div>
          </div>
        </div>
        
        <div class="summary-stat">
          <div class="stat-icon"><i class="fas fa-wallet"></i></div>
          <div class="stat-info">
            <div class="stat-label">钱包总额</div>
            <div class="stat-value">¥${wallet.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      <div class="summary-message">
        <p>干得好！您的收入已添加到钱包中。</p>
        <p class="summary-quote">"成功的秘诀在于坚持不懈的努力。" — 爱迪生</p>
      </div>
      
      <button class="summary-close btn">
        <i class="fas fa-check"></i> 确认
      </button>
    </div>
  `;
  
  document.body.appendChild(summary);
  currentEarningsSummary = summary;
  earningsSummaryVisible = true;
  
  // 延迟显示，添加动画效果
  setTimeout(() => summary.classList.add('show'), 10);
  
  // 关闭按钮事件 
  const closeButton = summary.querySelector('.summary-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      // 确保调用关闭函数
      closeEarningsSummary();
      
      // 额外添加记录，帮助调试
      console.log('关闭按钮被点击');
    });
  }
  
  // 点击外部区域关闭
  summary.addEventListener('click', (e) => {
    if (e.target === summary) {
      closeEarningsSummary();
    }
  });
}
// 关闭收入总结函数
function closeEarningsSummary() {
    if (currentEarningsSummary) {
      // 添加日志以检查函数是否被调用
      console.log('正在关闭收入总结面板');
      
      // 添加关闭动画类
      currentEarningsSummary.classList.remove('show');
      currentEarningsSummary.classList.add('hiding');
      
      // 使用定时器确保动画完成后再移除元素
      setTimeout(() => {
        if (currentEarningsSummary) {
          currentEarningsSummary.remove();
          currentEarningsSummary = null;
          earningsSummaryVisible = false;
          console.log('收入总结面板已关闭');
        }
      }, 300);
    }
}
// 计算工作时长函数
function calculateWorkDuration(start, end) {
  const durationMs = end - start;
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// DOM元素
const amountEl = document.getElementById('amount')
const hoursEl = document.getElementById('hours')
const minutesEl = document.getElementById('minutes')
const secondsEl = document.getElementById('seconds')
const canvas = document.getElementById('confetti')
const ctx = canvas.getContext('2d')

// 设置画布尺寸
function setCanvasSize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
setCanvasSize()
window.addEventListener('resize', setCanvasSize)

// 更新钱包显示
function updateWalletDisplay() {
  const walletAmountEl = document.getElementById('wallet-amount');
  
  // 添加动画效果
  walletAmountEl.classList.add('money-pop');
  setTimeout(() => walletAmountEl.classList.remove('money-pop'), 500);
  
  walletAmountEl.textContent = `¥${wallet.toFixed(2)}`;
}

// 更新显示
function updateDisplay() {
  if (!isWorking) return;
  const currentTime = Date.now()
  const elapsedSeconds = (currentTime - startTime) / 1000
  // 计算当前收入
  const currentEarning = (elapsedSeconds * HOURLY_RATE) / 3600;
  const total = totalEarned + currentEarning;
  // 计算时间
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = Math.floor(elapsedSeconds % 60);
  // 格式化金额显示
  amountEl.textContent = total.toFixed(2);
  amountEl.classList.add('money-transition');
  setTimeout(() => amountEl.classList.remove('money-transition'), 300);
  // 更新时间显示
  hoursEl.textContent = hours.toString().padStart(2, '0');
  minutesEl.textContent = minutes.toString().padStart(2, '0');
  secondsEl.textContent = seconds.toString().padStart(2, '0');
  hoursEl.classList.add('time-transition');
  minutesEl.classList.add('time-transition');
  secondsEl.classList.add('time-transition');
  setTimeout(() => {
    hoursEl.classList.remove('time-transition');
    minutesEl.classList.remove('time-transition');
    secondsEl.classList.remove('time-transition');
  }, 200);
  // 检查庆祝条件
  const currentInterval = Math.floor(total / CELEBRATION_INTERVAL);
  if (currentInterval > lastCelebration) {
    lastCelebration = currentInterval;
    // 在这里添加金币爆炸效果调用
    coinEffect.explode(window.innerWidth / 2, window.innerHeight / 2);
  }
}

// 初始化动画循环
(function animate() {
  updateDisplay()
  requestAnimationFrame(animate)
})()

// 保存进度
window.addEventListener('beforeunload', () => {
  const earned = totalEarned + (Date.now() - startTime) / 3600000 * HOURLY_RATE
  localStorage.setItem('totalEarned', earned.toFixed(2))
  localStorage.setItem('monthlySalary', salaryInput.value)
})

// 粒子效果
const PARTICLES = 50
const GOLD_COLOR = '#FFD700'

class CoinExplosion {
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
    // 与金币流联动
    if (coinStream) {
        coinStream.burst();
      }
    // 播放音效
    if (this.soundEnabled) {
      // 克隆音效对象以便同时播放多个音效
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

const coinEffect = new CoinExplosion('confetti');

// 用户头像点击事件
let userPanelVisible = false; // 追踪面板是否可见
let currentPanel = null; // 保存当前打开的面板引用
let earningsSummaryVisible = false;
let currentEarningsSummary = null;

// 开始工作按钮事件
startWorkBtn.addEventListener('click', () => {
  if (!isWorking) {
    // 如果有任何面板打开，先关闭它们
    closeAnyOpenPanel();
    
    isWorking = true;
    startTime = Date.now();
    totalEarned = 0;
    lastCelebration = Math.floor(totalEarned / CELEBRATION_INTERVAL);
    localStorage.removeItem('totalEarned');
    updateDisplay();
    
    // 添加动画效果
    startWorkBtn.classList.add('btn-active');
    setTimeout(() => startWorkBtn.classList.remove('btn-active'), 300);
    
    // 改变背景颜色为工作模式
    document.body.classList.add('working-mode');
  }
});

// 下班按钮事件
endWorkBtn.addEventListener('click', () => {
  if (isWorking) {
    isWorking = false;
    const earned = totalEarned + (Date.now() - startTime) / 3600000 * HOURLY_RATE;
    wallet += earned;
    localStorage.setItem('wallet', wallet.toFixed(2));
    updateWalletDisplay();
    
    // 添加动画效果
    endWorkBtn.classList.add('btn-active');
    setTimeout(() => endWorkBtn.classList.remove('btn-active'), 300);
    
    // 触发更大的金币庆祝效果
    coinEffect.explode(window.innerWidth / 2, window.innerHeight / 2, 80);
    
    // 恢复背景颜色
    document.body.classList.remove('working-mode');
    
    // 显示或关闭收入总结
    toggleEarningsSummary(earned);
  }
});
document.addEventListener('DOMContentLoaded', function() {
    const userAvatar = document.querySelector('.user-avatar');
    
    if (userAvatar) {
      userAvatar.addEventListener('click', function() {
        // 如果面板已经可见，则关闭它
        if (userPanelVisible && currentPanel) {
          closeUserPanel();
        } else {
          // 否则显示用户设置面板
          showUserPanel();
        }
      });
    }
    
    // 添加初始化钱包显示
    updateWalletDisplay();
  });
  
  // 关闭用户面板函数
  function closeUserPanel() {
    if (currentPanel) {
      currentPanel.classList.remove('show');
      setTimeout(() => {
        currentPanel.remove();
        currentPanel = null;
        userPanelVisible = false;
      }, 300);
    }
  }
  
  // 显示用户面板
function showUserPanel() {
    // 如果已有面板，先关闭它
    if (currentPanel) {
      closeUserPanel();
      return;
    }
    
    // 获取当前用户名和主题
    const currentUsername = localStorage.getItem('username') || '默认用户';
    const currentTheme = localStorage.getItem('theme') || 'default';
    
    // 创建一个用户设置面板
    const panel = document.createElement('div');
    panel.className = 'user-panel';
    panel.innerHTML = `
      <div class="user-panel-content">
        <div class="panel-header">
          <div class="user-avatar-large">
            <i class="fas fa-user"></i>
          </div>
          <h3>用户设置</h3>
        </div>
        
        <div class="panel-section">
          <div class="section-title">
            <i class="fas fa-id-card"></i>
            <span>个人信息</span>
          </div>
          
          <div class="panel-item">
            <label for="username">用户名称</label>
            <div class="input-container">
              <i class="fas fa-user input-icon"></i>
              <input type="text" id="username" value="${currentUsername}" placeholder="请输入您的用户名">
            </div>
          </div>
        </div>
        
        <div class="panel-section">
      <div class="section-title">
        <i class="fas fa-sliders-h"></i>
        <span>偏好设置</span>
      </div>
      
      <div class="panel-item">
        <label class="toggle-label">
          <span>音效</span>
          <div class="toggle-switch">
            <input type="checkbox" id="sound-setting" ${JSON.parse(localStorage.getItem('soundEnabled') || 'true') ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </div>
        </label>
      </div>
      
      <div class="panel-item">
        <label class="toggle-label">
          <span>金币流动画</span>
          <div class="toggle-switch">
            <input type="checkbox" id="coin-stream-setting" ${JSON.parse(localStorage.getItem('coinStreamEnabled') || 'true') ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </div>
        </label>
      </div>
    </div>
        
        <div class="panel-actions">
          <button class="panel-save btn">
            <i class="fas fa-save"></i> 保存
          </button>
          <button class="panel-close btn">
            <i class="fas fa-times"></i> 关闭
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    currentPanel = panel;
    userPanelVisible = true;
    
    // 延迟显示，添加动画效果
    setTimeout(() => panel.classList.add('show'), 10);
    
    // 主题切换
    const themeButtons = panel.querySelectorAll('.theme-option');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        document.body.className = theme + '-theme';
        localStorage.setItem('theme', theme);
        
        // 标记当前选中主题
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    // 金币流开关事件
  const coinStreamToggle = panel.querySelector('#coin-stream-setting');
  if (coinStreamToggle) {
    coinStreamToggle.addEventListener('change', () => {
      const coinStreamEnabled = coinStreamToggle.checked;
      localStorage.setItem('coinStreamEnabled', coinStreamEnabled);
      
      // 更新金币流可见性
      if (coinStream) {
        coinStream.toggleVisibility(coinStreamEnabled);
      }
    });
  }
    
    // 音效开关事件
    const soundToggle = panel.querySelector('#sound-setting');
    if (soundToggle) {
      soundToggle.addEventListener('change', () => {
        const soundEnabled = soundToggle.checked;
        localStorage.setItem('soundEnabled', soundEnabled);
        
        // 如果有音效控制类的实例，更新它的状态
        if (coinEffect && typeof coinEffect.updateSoundState === 'function') {
          coinEffect.updateSoundState(soundEnabled);
        }
        
        // 更新音量图标
        const volumeIcon = document.querySelector('.sound-toggle i');
        if (volumeIcon) {
          volumeIcon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        }
      });
    }
    
    // 保存按钮事件
    panel.querySelector('.panel-save').addEventListener('click', () => {
      const username = panel.querySelector('#username').value;
      localStorage.setItem('username', username);
      
      closeUserPanel();
      
      // 显示保存成功提示
      showToast('设置已保存');
    });
    
    // 关闭按钮事件
    panel.querySelector('.panel-close').addEventListener('click', () => {
      closeUserPanel();
    });
    
    // 点击外部区域关闭
    panel.addEventListener('click', (e) => {
      if (e.target === panel) {
        closeUserPanel();
      }
    });
  }
  
// 显示提示消息
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => toast.classList.add('show'), 10);
  
  // 自动隐藏
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// 应用保存的主题
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme + '-theme';
  }
});
let coinStream;

// 在DOMContentLoaded事件中初始化金币流动画
document.addEventListener('DOMContentLoaded', function() {
  // ... 现有代码 ...
  
  // 初始化金币流
  coinStream = new CoinStream();
  
  // 应用保存的主题
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme + '-theme';
  }
});

// 在开始工作时增加金币流动性
startWorkBtn.addEventListener('click', () => {
  if (!isWorking) {
    // ... 现有代码 ...
    
    // 增加金币流动性
    if (coinStream) {
      coinStream.burst();
    }
  }
});

// 在下班时增加大量金币
endWorkBtn.addEventListener('click', () => {
  if (isWorking) {
    // ... 现有代码 ...
    
    // 增加大量金币
    if (coinStream) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => coinStream.burst(), i * 300);
      }
    }
  }
});