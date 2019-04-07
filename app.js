//app.js
App({
	// 用户是否登录
	navigateToLogin: false,
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检测新版本
		const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
			
		})
  },
  globalData: {
    userInfo: null
  }
})