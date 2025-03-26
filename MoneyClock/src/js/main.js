// 引入其他模块
import { CoinStream } from './coinAnimation.js';
import { CoinExplosion } from './coinExplosion.js';
import { 
  initUI, 
  updateDisplay, 
  updateWalletDisplay, 
  showEarningsSummary, 
  closeEarningsSummary, 
  showUserPanel, 
  closeUserPanel, 
  showToast 
} from './ui.js';
import { 
  calculateHourlyRate, 
  calculateWorkDuration 
} from './utils.js';
import { initEventListeners } from './events.js';
import { AppState } from './state.js';

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
  // 初始化应用状态
  AppState.init();
  
  // 初始化UI
  initUI();
  
  // 初始化金币效果
  AppState.coinEffect = new CoinExplosion('confetti');
  
  // 初始化金币流
  AppState.coinStream = new CoinStream();
  
  // 应用保存的主题
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme + '-theme';
  }
  
  // 初始化事件监听器
  initEventListeners();
  
  // 初始化动画循环
  (function animate() {
    updateDisplay();
    requestAnimationFrame(animate);
  })();
  
  // 保存进度
  window.addEventListener('beforeunload', () => {
    const earned = AppState.totalEarned + (Date.now() - AppState.startTime) / 3600000 * AppState.HOURLY_RATE;
    localStorage.setItem('totalEarned', earned.toFixed(2));
    localStorage.setItem('monthlySalary', AppState.salaryInput.value);
  });
});