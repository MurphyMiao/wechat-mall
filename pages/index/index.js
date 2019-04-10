const WXAPI = require('../../wxapi/main');
//获取应用实例
const app = getApp()

Page({
  data: {
   inputVal: '',
	 inputShowed: false,
	 banners: [],
  },
  
  
  onLoad: function () {
		// 获取商品分类
    WXAPI.goodsCategory().then(res => {
			console.log(res)
		})
		// 获取banner
		WXAPI.banners({type: 'new'}).then(res => {
			console.log(res)
			if(res.code === 0){
				this.setData({
					banners: res.data
				})
			}
		})
  },
	//事件处理函数
	inputTyping (e){
		this.setData({
      inputVal: e.detail.value
    });
	},
	toSearch (){
		
	},
	showInput (){
		this.setData({
			inputShowed: true
		})
	},
	hideInput (){
		this.setData({
			inputVal: '',
			inputShowed: false
		})
	},
	clearInput (){
		this.setData({
			inputVal: '',
			
		})
	}
})
