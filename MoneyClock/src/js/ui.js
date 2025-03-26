import { AppState } from './state.js';
import { calculateWorkDuration } from './utils.js';

// 初始化UI
export function initUI() {
  // 设置画布尺寸
  const canvas = document.getElementById('confetti');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
  
  // 初始化钱包显示
  updateWalletDisplay();
}

// 更新钱包显示
export function updateWalletDisplay() {
  const walletAmountEl = document.getElementById('wallet-amount');
  if (!walletAmountEl) return;
  
  // 添加动画效果
  walletAmountEl.classList.add('money-pop');
  setTimeout(() => walletAmountEl.classList.remove('money-pop'), 500);
  
  walletAmountEl.textContent = `¥${AppState.wallet.toFixed(2)}`;
}

// 更新显示
export function updateDisplay() {
  if (!AppState.isWorking) return;
  
  const currentTime = Date.now();
  const elapsedSeconds = (currentTime - AppState.startTime) / 1000;
  
  // 计算当前收入
  const currentEarning = (elapsedSeconds * AppState.HOURLY_RATE) / 3600;
  const total = AppState.totalEarned + currentEarning;
  
  // 计算时间
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = Math.floor(elapsedSeconds % 60);
  
  // 格式化金额显示
  AppState.amountEl.textContent = total.toFixed(2);
  AppState.amountEl.classList.add('money-transition');
  setTimeout(() => AppState.amountEl.classList.remove('money-transition'), 300);
  
  // 更新时间显示
  AppState.hoursEl.textContent = hours.toString().padStart(2, '0');
  AppState.minutesEl.textContent = minutes.toString().padStart(2, '0');
  AppState.secondsEl.textContent = seconds.toString().padStart(2, '0');
  
  AppState.hoursEl.classList.add('time-transition');
  AppState.minutesEl.classList.add('time-transition');
  AppState.secondsEl.classList.add('time-transition');
  
  setTimeout(() => {
    AppState.hoursEl.classList.remove('time-transition');
    AppState.minutesEl.classList.remove('time-transition');
    AppState.secondsEl.classList.remove('time-transition');
  }, 200);
  
  // 检查庆祝条件
  const currentInterval = Math.floor(total / AppState.CELEBRATION_INTERVAL);
  if (currentInterval > AppState.lastCelebration) {
    AppState.lastCelebration = currentInterval;
    // 在这里添加金币爆炸效果调用
    AppState.coinEffect.explode(window.innerWidth / 2, window.innerHeight / 2);
  }
}

// 显示收入总结
export function showEarningsSummary(earned) {
  // 如果已有总结面板，先关闭它
  if (AppState.currentEarningsSummary) {
    closeEarningsSummary();
    return;
  }
  
  // 计算工作时长
  const workDuration = calculateWorkDuration(AppState.startTime, Date.now());
  
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
            <div class="stat-value">¥${AppState.wallet.toFixed(2)}</div>
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
  AppState.currentEarningsSummary = summary;
  AppState.earningsSummaryVisible = true;
  
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
export function closeEarningsSummary() {
  if (AppState.currentEarningsSummary) {
    // 添加日志以检查函数是否被调用
    console.log('正在关闭收入总结面板');
    
    // 添加关闭动画类
    AppState.currentEarningsSummary.classList.remove('show');
    AppState.currentEarningsSummary.classList.add('hiding');
    
    // 使用定时器确保动画完成后再移除元素
    setTimeout(() => {
      if (AppState.currentEarningsSummary) {
        AppState.currentEarningsSummary.remove();
        AppState.currentEarningsSummary = null;
        AppState.earningsSummaryVisible = false;
        console.log('收入总结面板已关闭');
      }
    }, 300);
  }
}

// 显示用户面板
export function showUserPanel() {
  // 如果已有面板，先关闭它
  if (AppState.currentPanel) {
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
  AppState.currentPanel = panel;
  AppState.userPanelVisible = true;
  
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
      if (AppState.coinStream) {
        AppState.coinStream.toggleVisibility(coinStreamEnabled);
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
      if (AppState.coinEffect && typeof AppState.coinEffect.updateSoundState === 'function') {
        AppState.coinEffect.updateSoundState(soundEnabled);
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

// 关闭用户面板函数
export function closeUserPanel() {
  if (AppState.currentPanel) {
    AppState.currentPanel.classList.remove('show');
    setTimeout(() => {
      AppState.currentPanel.remove();
      AppState.currentPanel = null;
      AppState.userPanelVisible = false;
    }, 300);
  }
}

// 显示提示消息
export function showToast(message) {
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