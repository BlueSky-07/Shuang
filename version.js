// 版本統一管理
// Version Management System
// 修改此處即可更新所有地方的版本號

const VERSION = {
  major: 6,
  minor: 0,
  date: '2025.08.22',
  
  // 格式化版本號的方法
  get full() {
    return `${this.major}.${this.minor} ${this.date}`;
  },
  
  get withPrefix() {
    return `v${this.full}`;
  },
  
  get packageVersion() {
    return this.full;
  },
  
  get htmlComment() {
    return `${this.date.replace(/\./g, '.')}`;
  },
  
  get cacheName() {
    return `shuang-v${this.major}.${this.minor}.${this.date.replace(/\./g, '')}`;
  }
};

// 導出版本信息
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VERSION;
}

if (typeof window !== 'undefined') {
  window.VERSION = VERSION;
}