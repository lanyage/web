$(function () {
	// 检查插件是否已经安装过
    var iRet = WebVideoCtrl.I_CheckPluginInstall();
	if (-2 == iRet) {
		alert("您的Chrome浏览器版本过高，不支持NPAPI插件！");
		return;
	} else if (-1 == iRet) {
        alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
		return;
    }
	
	//郑震宇修改
	//摄像头的宽高是获取外层div的宽高设置的，外层div的id=videoDiv
	var oPlugin = {
		iWidth: $("#videoDiv").width(),			    // plugin width
		iHeight: $("#videoDiv").height()			// plugin height
	};
	//
	
	
	// 初始化插件参数及插入插件
	WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
        bWndFull: true,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
        iWndowType: 1,
		cbSelWnd: function (xmlDoc) {
			
		}
	});
	WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

	// 检查插件是否最新
	if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
		alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
		return;
	}

	var oLiveView = {
		iProtocol: 1,			// protocol 1：http, 2:https
		szIP: "192.168.1.64",	// protocol ip
		szPort: "80",			// protocol port
		szUsername: "admin",	// device username
		szPassword: "a1234567",	// device password
		iStreamType: 1,			// stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
		iChannelID: 1,			// channel no
		bZeroChannel: false		// zero channel
	};

	// 登录设备
	WebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
		success: function (xmlDoc) {
			// 开始预览
			WebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
				iStreamType: oLiveView.iStreamType,
				iChannelID: oLiveView.iChannelID,
				bZeroChannel: oLiveView.bZeroChannel
			});
		}
	});

	// 关闭浏览器
	$(window).unload(function () {
		WebVideoCtrl.I_Stop();
	});
	var g_bPTZAuto = false;
	function mouseDownPTZControl(iPTZIndex) {
		var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0),
			bZeroChannel = false,
			iPTZSpeed = 6;

		if (bZeroChannel) {// 零通道不支持云台
			return;
		}
		
		if (oWndInfo != null) {
			if (9 == iPTZIndex && g_bPTZAuto) {
				iPTZSpeed = 0;// 自动开启后，速度置为0可以关闭自动
			} else {
				g_bPTZAuto = false;// 点击其他方向，自动肯定会被关闭
			}

			WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
				iPTZSpeed: iPTZSpeed,
				success: function (xmlDoc) {
					if (9 == iPTZIndex) {
						g_bPTZAuto = !g_bPTZAuto;
					}
					showOPInfo(oWndInfo.szIP + " 开启云台成功！");
				},
				error: function () {
					showOPInfo(oWndInfo.szIP + " 开启云台失败！");
				}
			});
		}
	}
});