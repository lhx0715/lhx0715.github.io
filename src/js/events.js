import { AppState } from './state.js';
import { 
  updateDisplay, 
  updateWalletDisplay, 
  showEarningsSummary, 
  closeEarningsSummary, 
  showUserPanel, 
  closeUserPanel 
} from './ui.js';

// 初始化事件监听器
export function initEventListeners() {
  // 开始工作按钮事件
  AppState.startWorkBtn.addEventListener('click', handleStartWork);
  
  // 下班按钮事件
  AppState.endWorkBtn.addEventListener('click', handleEndWork);
  
  // 月薪输入事件监听
  AppState.salaryInput.addEventListener('input', handleSalaryInput);
  
  // 用户头像点击事件
  const userAvatar = document.querySelector('.user-avatar');
  if (userAvatar) {
    userAvatar.addEventListener('click', handleUserAvatarClick);
  }
}

// 开始工作处理函数
function handleStartWork() {
  if (!AppState.isWorking) {
    console.log('开始工作按钮被点击');
    
    // 如果有任何面板打开，先关闭它们
    AppState.closeAllPanels();
    
    AppState.resetWorkState();
    updateDisplay();
    
    // 添加动画效果
    AppState.startWorkBtn.classList.add('btn-active');
    setTimeout(() => AppState.startWorkBtn.classList.remove('btn-active'), 300);
    
    // 改变背景颜色为工作模式
    document.body.classList.add('working-mode');
    
    // 增加金币流动性
    if (AppState.coinStream) {
      AppState.coinStream.burst();
    }
  }
}

// 下班处理函数
function handleEndWork() {
  if (AppState.isWorking) {
    console.log('下班按钮被点击');
    
    const earned = AppState.endWork();
    updateWalletDisplay();
    
    // 添加动画效果
    AppState.endWorkBtn.classList.add('btn-active');
    setTimeout(() => AppState.endWorkBtn.classList.remove('btn-active'), 300);
    
    // 触发更大的金币庆祝效果
    AppState.coinEffect.explode(window.innerWidth / 2, window.innerHeight / 2, 80);
    
    // 增加大量金币
    if (AppState.coinStream) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => AppState.coinStream.burst(), i * 300);
      }
    }
    
    // 恢复背景颜色
    document.body.classList.remove('working-mode');
    
    // 显示收入总结
    showEarningsSummary(earned);
  }
}

// 月薪输入处理函数
function handleSalaryInput() {
  const isValid = AppState.salaryInput.checkValidity();
  if (isValid) {
    AppState.updateHourlyRate();
    updateDisplay();
  }
}

// 用户头像点击处理函数
function handleUserAvatarClick() {
  console.log('用户头像被点击');
  
  // 如果面板已经可见，则关闭它
  if (AppState.userPanelVisible && AppState.currentPanel) {
    closeUserPanel();
  } else {
    // 否则显示用户设置面板
    showUserPanel();
  }
}

// 切换收入总结显示
export function toggleEarningsSummary(earned) {
  if (AppState.earningsSummaryVisible && AppState.currentEarningsSummary) {
    closeEarningsSummary();
  } else {
    showEarningsSummary(earned);
  }
}