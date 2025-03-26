// 计算时薪函数
export function calculateHourlyRate(monthlySalary) {
  return monthlySalary / 22 / 8; // 每月22个工作日，每天8小时
}

// 计算工作时长函数
export function calculateWorkDuration(start, end) {
  const durationMs = end - start;
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 设置画布尺寸
export function setCanvasSize(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}