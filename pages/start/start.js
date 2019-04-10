const WXAPI = require('../../wxapi/main');
const CONFIG = require('../../config.js');

var app = getApp();
Page({
	data: {
		boardUrl: ''
	},
	onLoad: function(){
		const _this = this;
		// 设置店铺名称
		wx.setNavigationBarTitle({
			title: wx.getStorageSync('mallName')
		})
		const app_show_pic_version = wx.getStorageSync('app_show_pic_version')
		if(app_show_pic_version && app_show_pic_version == CONFIG.version){
			wx.switchTab({
				url: '/pages/index/index'
			})
		}else{
			// 展示启动项
			WXAPI.banners({
				type: 'app'
			}).then(function(res){
				if(res.code == 700){
					wx.switchTab({
						url: '/pages/index/index'
					})
				}else{
					_this.setData({
						boardUrl: res.data[0].picUrl,
					})
				}
			}).catch(function(e){
				wx.switchTab({
					url: '/pages/index/index'
				})
			})
		}
		
	},
	goToIndex(){
		if(app.globalData.isConnected){
			
			console.log('跳转')
			wx.switchTab({
				url: '/pages/index/index'
			})
		
		}else{
			 wx.showToast({
				title: '当前无网络',
				icon: 'none',
			})
		}
		
	}
})