// 应用状态管理
export const AppState = {
    // 配置参数
    HOURLY_RATE: 50, // 动态时薪（根据月薪计算）
    CELEBRATION_INTERVAL: 0.2, // 每增加100元触发庆祝效果
    
    // DOM元素
    salaryInput: null,
    startWorkBtn: null,
    endWorkBtn: null,
    amountEl: null,
    hoursEl: null,
    minutesEl: null,
    secondsEl: null,
    
    // 状态变量
    isWorking: false,
    startTime: Date.now(),
    totalEarned: 0,
    wallet: 0,
    lastCelebration: 0,
    userPanelVisible: false,
    currentPanel: null,
    earningsSummaryVisible: false,
    currentEarningsSummary: null,
    
    // 组件实例
    coinEffect: null,
    coinStream: null,
    
    // 初始化状态
    init() {
      // 获取DOM元素
      this.salaryInput = document.getElementById('monthly-salary');
      this.startWorkBtn = document.getElementById('start-work');
      this.endWorkBtn = document.getElementById('end-work');
      this.amountEl = document.getElementById('amount');
      this.hoursEl = document.getElementById('hours');
      this.minutesEl = document.getElementById('minutes');
      this.secondsEl = document.getElementById('seconds');
      
      // 初始化状态
      this.totalEarned = parseFloat(localStorage.getItem('totalEarned')) || 0;
      this.wallet = parseFloat(localStorage.getItem('wallet')) || 0;
      this.lastCelebration = Math.floor(this.totalEarned / this.CELEBRATION_INTERVAL);
      
      // 初始化月薪设置
      this.salaryInput.value = localStorage.getItem('monthlySalary') || '8000';
      this.HOURLY_RATE = this.calculateHourlyRate(this.salaryInput.value);
    },
    
    // 计算时薪
    calculateHourlyRate(monthlySalary) {
      return monthlySalary / 22 / 8; // 每月22个工作日，每天8小时
    },
    
    // 重置工作状态
    resetWorkState() {
      this.isWorking = true;
      this.startTime = Date.now();
      this.totalEarned = 0;
      this.lastCelebration = Math.floor(this.totalEarned / this.CELEBRATION_INTERVAL);
      localStorage.removeItem('totalEarned');
    },
    
    // 结束工作并计算收入
    endWork() {
      this.isWorking = false;
      const earned = this.totalEarned + (Date.now() - this.startTime) / 3600000 * this.HOURLY_RATE;
      this.wallet += earned;
      localStorage.setItem('wallet', this.wallet.toFixed(2));
      return earned;
    },
    
    // 更新时薪设置
    updateHourlyRate() {
      this.HOURLY_RATE = this.calculateHourlyRate(parseFloat(this.salaryInput.value));
      localStorage.setItem('monthlySalary', this.salaryInput.value);
      this.startTime = Date.now();
      this.totalEarned = 0;
      this.lastCelebration = Math.floor(this.totalEarned / this.CELEBRATION_INTERVAL);
      localStorage.removeItem('totalEarned');
    },
    
    // 关闭所有打开的面板
    closeAllPanels() {
      if (this.currentPanel) {
        this.closeUserPanel();
      }
      if (this.currentEarningsSummary) {
        this.closeEarningsSummary();
      }
    }
  };