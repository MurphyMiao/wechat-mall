const WXAPI = require('./wxapi/main');
//app.js
App({
	// 用户是否登录
	navigateToLogin: false,
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

		const self = this;
    // 检测新版本
		const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
			wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
		})
		
		// 检查网络状况
		wx.getNetworkType({
			success: function(res){
				let networkType = res.networkType;
				console.log(networkType)
				if(networkType === 'none'){
					wx.showToast({
						duration: 2000,
						title: '当前无网络',
						icon: 'loading'
					})
					self.globalData.isConnected = false;
				}
			}
		})
		
		// 监听网络状态变化
		wx.onNetworkStatusChange(function(res){
			if(!res.isConnected){
				that.globalData.isConnected = false
				wx.showToast({
					title: '网络连接已断开',
					icon: 'loading',
					duration: 2000,
					complete: function(){
						self.goStartIndexPage()
					}
				})
			}else{
				that.globalData.isConnected = true
        wx.hideToast()
			}
		})
		
		// 获取接口和后台权限
		WXAPI.vipLevel().then(res => {
			self.globalData.vipLevel = res.data
		})
		// 获取商城名称
		WXAPI.queryConfig({
			key: 'mallName'
		}).then(function(res){
			if(res.code == 0){
				wx.setStorageSync('mallName',res.data.value)
			}
		})
  },
	// 跳转到登录页
	goLoginPage: function(){
		if(this.navigateToLogin){
			return
		}
		wx.removeStorageSync('token')
		this.navigateToLogin = true
		setTimeout(function(){wx.navigateTo({
			url: '/pages/authorize/index'
		})})
	},
	// 返回起始页面
	goStartIndexPage: function() {
    setTimeout(function() {
      wx.redirectTo({
        url: "/pages/start/start"
      })
    }, 1000)
  },  
	onShow(e){
		const _this = this;
		const token = wx.getStorageSync('token');
		if(!token){
			this.goLoginPage()
			return
		}
		// 检查微信登录是否失效
		wx.checkSession({
			fail(){
				_this.goLoginPage()
			},
			success (){
				// 检查token是否失效
				WXAPI.checkToken(token).then(function(res){
					if(res.code != 0){
						wx.removeStorageSync('token')
						_this.goLoginPage();
					}
				})
			}
		})
		console.log(e)
		this.globalData.launchOption = e
		if(e && e.query && e.query.inviter_id){
			wx.setStorageSync('referrer', e.query.inviter_id)
			if(e.shareTicket){
				// 通过分享链接进入
				wx.getShareInfo({
					shareTicket: e.shareTicket,
					success: res => {
						console.error(res)
						console.error({
							referrer: q.query.inviter_id,
							encryteData: res.encryptedData,
							iv: res.iv
						})
						WXAPI.shareGroupGetScore(
							e.query.inviter_id,
							res.encryptedData,
							res.iv
						)
					}
				})
			}
		}
	},
  globalData: {
    isConnected: true,
    launchOption: undefined,
    vipLevel: 0
  }
})