(function($) {
$.datepicker.setDefaults({
    changeMonth: true,
    changeYear: true,
    showMonthAfterYear:true,
    dateFormat: 'yy-mm-dd',
    buttonImageOnly: true,
    buttonText: "Calendar"
});
		
$.rtls = {
	lang : 'zh',	
	language : function(lang){
		var url = $(location).attr('href');
		if(url.indexOf("?") == -1){
			url += "?language="+lang;
		}else{
			if(url.indexOf("language") != -1){
				url = url.substring(0, url.length-2) + lang;
			}else{
				url += "&language="+lang;	
			}
			
		}
		window.location = url;
	},
	home : '主页面',
	validity : {
		required : function(field){
			return field+"必须填写";
		},
		match : function(type, field){
			if(type == 'id'){
				return "帐号格式无效 (4 ~ 20 个英文字符)";	
			}else if(type == 'pixels'){
				return "像素处于无效格式";	
			}else if(type == 'meter'){
				return "米处于无效格式";	
			}else if(type == 'number'){
				return field+"必须是数字格式";	
			}else if(type == 'phone'){
				return field+"处于无效格式";	
			}else{
				return field+"处于无效格式";	
			}
			return "";
		},
		range : function(start, end, field){
			return field+'必须在'+start+'和'+end+''; 
		},
		check : function(field){
			return field+"检查";
		},
		notequal : function(field1, field2){
			return field1+"/"+field2+"值不匹配";
		},
		select : function(field){
			return "选择"+field+"";
		},
		checkId : function(field, result){
			if(result == 'success'){
				return field+"有效帐号";	
			}else{
				return field+"帐号重复";	
			}
		}
	},
	menu : [
			{title : '管 理', heading : ['管 理'], sub:['用户管理']},
			{title : '工 具', heading : ['工 具'], sub:['设置标签', '设置地图', '设置区域', '设置轨迹', '设置基站', '设置摄像头', '设置报警器', '设置参数']},
			{title : '设备状态', heading : ['设备状态'], sub:['基 站', '标 签', '基站版本管理', '标签版本管理']},
			{title : '统计数据', heading : ['统计数据'], sub:['区域统计', '区域日志', '回 放', '热力图']},
			{title : '实时监控', heading : ['实时监控'], sub:[]},
			{title : '增值应用', heading : ['功能'], sub:['视频切换', '报警信息', '工作票', '点名', '考勤', '全景', '视频监控', '视频回放']},
			{title : '功能列表', heading : ['功能列表'], sub:['设置标签', '标签状态', '基站状态','区域统计', '区域日志', '轨迹回放', '热力图']},
	],
	header : function(name){
		return $('.header .manager').html('你好！ <span class="name">'+name+'</span> | ');
	},
	commons : {
		button : {
			ok : '确 认',
			cancel : '取 消',
			add : '添 加 用 户',
			mod : '修 改',
			del : '删 除',
			close : '关 闭',
			apply : '应 用'
		},
		dialog : {
			title : {
				success : '成 功',
				error : '错 误',
				waring : '警 告',
				ok : '确 认'
			}
			
		},
		message : {
			errorsystem : '系统错误',
			errorpermission : '<p>没有访问RTLS系统</p><p>登录后使用</p>',
			initconfirm : '你确定你想要初始化统计数据?',
		}
	},
	main : {
		total : '合 计',
		online : '在 线',
		offline : '离 线',
		totalChart : {
			title : '基站状态',
			online : '基站在线', 
			offline : '基站离线',
		},
		masterChart : {
			title : '主机站状态',
			online : '主机站在线', 
			offline : '主机站离线'
		},
		slaveChart : {
			title : '从机站状态',
			online : '从机站在线', 
			offline : '从机站离线'
		}
	},
	manager : {
		button : { add :'注 册', mod :'修 改', del : '删 除', idcheck:'重复检查', ok : '确 认', cancel : '取 消'},
		form : {
			id : '用户名',
			password : '密 码',
			passwordRe : '确认密码',
			name : '昵 称',
			permission : '权 限'
		},
		list : { 
			top : function(totalNum){ return '一共 <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['编 号','类 型','帐 号','用户名','使用权限','创建日期','登录日期','修改/ 删除'],
			className : ['管 理','管理人员'],
			empty : '没有数据',
		},
		dialog : {
			title : {add :'添加用户', mod : '修改用户', del : '删除用户'}
		},
		message : {
			addfail : '注册账户信息失败', 
			modfail : '修改账户信息失败', 
			delfail : '删除账户信息失败', 
			delconfirm : '你确定你要删除这个帐户好吗?', 
			loginfail : "<p>用户名/密码的值不匹配</p>",
			unapproved : '<p>未经授权的用户</p><p>管理员批准后可用</p>',
			stopsite : '<p>暂停服务的网站</p>'
		}
		
	},
	plan : {
		button : { add :'添加地图', mod :'确 认', del : '删 除', upload : '上 传'},
		tool : {pointer : '移动工具', distance : '距离测量', distancePoint : '两个点的距离测量', grid : '显示网格', ruler : '显示标尺', drawing3d : '三维绘图', zone : '区设置工具', movement : '运动设置工具',wall : '墙添加工具',barrier : '障碍添加工具'},
		form : {
			planName : '地图名称',
			planSize : '地图尺寸',
			planPixels : '地图比例',
			isMovement : '运 动',
			planFile : '地图图片',
			mapFile : '映射文件',
			textureFile : '纹理文件',
			use : '启 用',
			unused : '停 用',
			del : '删 除',
			type : '类 型',
			name : '名 称',
			size : '尺 寸',
			sports : '运动模式',
			width : '宽 度',
			height : '高 度',
			offset : '抵 消',
		},
		dialog : {
			title : ['添加地图']
		},
		message : {
			namedublicate : '地图的名字是重复的.',
			fileexists : '映射文件不存在.',
			delfail : '无法删除地图',
			delconfirm : '<p>你确定你要删除这个地图吗?</p>',
			typefail : '使用PNG图像格式类型.',
			addsuccess : '成功.',
			uploadfail : '上传文件失败',
			dropzone : '拖动你想要上传的文件.',
			dropzonemsg : '浏览器不支持多个上传。点击这里单独上传。'
		}
	},
	zone : {
		button : { add :'添 加', mod :'确 认', del : '删  除', resetting : '复 位', update : '区域设置更新'},
		form : {
			name : '区域名称',
			file : '地 图',
			type : '区域类型',
			color : '区域颜色',
			safeZone : '安 全',
			dangerZone : '危 险'
		},
		list : { 
			top : function(totalNum){ return '一共 <span class="font_color1 bold">'+totalNum+'</span> 块区域';},
			head : ['颜 色','区域名称','区域类型'],
			empty : '没有数据',
		},
		dialog : {
			title : ['添加区域', '确认添加区域']
		},
		message : {
			whitecolor : '白色是不可用的。',
			colorduplicate : '颜色是重复的。',
			addfail : '未能添加区域信息',
			fileexists : '区域形象是不存在的。',
			delfail : '无法删除区域信息。',
			fileupload : '请上传一个区域形象。',
			uploadfail : '上传文件失败',
			typefail : '使用PNG图像格式类型。',
			delconfirm : '<p>你确定你要删除该区域信息吗?</p>',
			updateconfirm: '<p>你确定你想要申请该区域信息吗?</p>',
			updatefail: '<p>无法使用该区域的信息</p>',
			planover: '地区以外的图纸不能设置。',
		}
	},
	movement : {
		button : { add :'添 加', preview : '预 览', update : '轨迹设置更新'},
		form : {
			lineBorder : '边界线',
		},
		dialog : {
			title : ['添加墙体', '修改墙体', '添加轨迹节点', '删除轨迹节点', '预 览']
		},
		
		message : {
			delconfirm: '<p>你确定你要删除这个运动轨迹吗?</p>',
			updatesuccess : '成功应用运动信息',
			updatefail : '应用运动信息失败',
			updateconfirm : '<p>你确定你要应用这个运动轨迹吗?</p>',
			
		}
	},
	
	device : {
		button : { add :'添 加', mod :'确 认', del : '删 除', modall :'提 交', config : '设置 RAP', select : '选 择', cancel : '取 消', search : '查找地址'},
		form : {
			point : '坐 标(X,Y)',
			height : '高 度(Z)',
			isAp : 'AP',
			networkType : '网 络',
			description : '备 注',
			use : '启 用',
			notuse : '停 用',
			second : '秒',
			number : '',
			distance : ' 距 离',
			select : '选 择',
			latitude : '纬 度',
			longitude : '经 度',
			signalRatio : '信号比',
			signalWeight : '信号量',
			direction : '用法说明',
			zoneType : '区域类型',
			zone1D : '1D 区域',
			zone2D : '2D 区域',
			east : '东', west : '西', south : '南', north : '北',
			
		},
		status : {normal : '正 常', fault : '错 误'},
		list : { 
			top : function(totalNum){ return '<i class="fa fa-volume-up"></i>共 有 <span class="font_color1 bold">'+totalNum+'</span>个';},
			empty : '没有数据',
		},
		dialog : {
			title : ['选择基站', '基站设置', '选择主机站']
		},
		alarm : {
			title : ['请选择报警器','报警器设置','请选择区域']
		},
		camera : {
			title : ['请选择摄像头','摄像头设置','请选择区域']
		},
		alarmMsg : {
			emptyalarm : '没有报警器',
			emptyzone : '没有可用区域',
			selectalarm : '请选择报警器',
			selectzone : '请选择区域',
			modsuccess : '修改成功',
			modfail : '修改失败',
			modconfirm : '你确定修改报警器的数据吗？',
			delfail : ' 删除报警器失败',
			delconfirm : '<p>你确定删除报警器吗？</p>',
			config : '报警器设置',
			configsuccess : '成功设置报警器',
			deadalarm : '与报警器失去连接',
			configfail : '设置报警器失败',
			searchaddress : '请输入你想选择的IP地址',
			emptydata : '没有数据'
		},
		cameraMsg : {
			emptycamera : '没有摄像头',
			selectcamera : '请选择摄像头',
			emptyzone : '没有区域',
			selectzone : '请选择区域',
			modsuccess : '保存成功',
			modfail : '保存失败',
			modconfirm : '你确定保存摄像头的数据吗？',
			delfail : ' 删除摄像头失败',
			delconfirm : '<p>你确定删除摄像头吗？</p>',
			config : '摄像头设置',
			configsuccess : '成功设置摄像头',
			deadcamera : '与摄像头失去连接',
			configfail : '设置摄像头失败',
			searchaddress : '请输入你想选择的IP地址',
			emptydata : '没有数据'
		},
		message : {
			emptyrap : '没有基站',
			selectrap : '选择基站',
			modsuccess : '设置成功',
			modfail : '设置失败',
			modconfirm : '你想修改的基站位置吗?',
			delfail : ' 无法删除基站',
			delconfirm : '<p>你确定你要删除基站?</p>',
			config : '基站设置',
			configsuccess : '成功设置基站',
			deadrap : '基站断开连接',
			configfail : '设置基站失败',
			searchaddress : '输入您想搜索的地址。',
			emptydata : '没有数据'	
		}
	},
	rap : {
		button : { add :'添 加', use :'启 用', upgrade : '远程升级', mod : '确 认', del : '删 除' },
		form : {
			version : '版 本',
			note : '备 注',
			file : '固 件'
			
		},
		list : { 
			top : function(totalNum){ return '一共 <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['检 查','版 本','备 注','固 件','日 期','修 改 / 删 除'],
			empty : '没有数据',
		},
		dialog : {
			title : ['添加固件', '确定固件', '远程升级']
		},
		message : {
			fileexists : '固件文件不存在。',
			uploadfail : '上传文件失败',
			version : '版本信息是必需的。',
			delfail : ' 删除失败',
			delconfirm : '你确定你要删除这个版本信息吗?',
			selectfail : '未能选择版本',
			upgradesuccess : '固件升级成功',
			upgradefail : '固件升级失败',
			upgradetype : '选择升级的类型',
			uploadfail : '上传文件失败',
		}
	},
	position : {
		button : { 
			add :'添 加', modall :'修改位置', mod : '修 改', del : '删 除', cancel : '取 消',
			search : '查 找', select : '选 择', simulator : '模拟器', monitoringon : '监控开始', monitoringoff : '监控停止', clear : '清除记录' },
		form : {
			name : '名 字',
			point : '位 置',
			description : '备 注',
			time : '时 间',
			tag : '标 签',
			scale : '列表数量',
			neighborhood : '附 近',
			number : '',
			algorithm : '算 法',
			all : '所 有',
			tdoa : 'TDOA',
			twr : 'TWR',
			latitude : '纬 度',
			longitude : '经 度',
			address : '地 址',
			calibration : '校 准',
			uncalibration : '不校准',
		},
		list : { 
			top : function(totalNum){ return '一共 <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['检 查','版 本','节 点','文件名称','日 期','修 改/ 删 除'],
			empty : '没有数据',
		},
		log : { 
			top : function(totalNum){ return '一共 <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['编 号','算 法','标 签','区 域','位置信息','时 间'],
			empty : '没有数据',
		},
		out : { 
			top : function(totalNum){ return '一共 <span class="font_color1 bold">'+totalNum+'</span>';},
			head : ['编 号','算 法','标 签','位置信息','校 准','GPS 时间','创建时间'],
			empty : '没有数据',
		},
		dialog : { 
			title : ['选择标签', '轨 迹']
		},
		message : {
			addfail : ' 添加失败',
			point : '域是必需的',
			modsuccess : '修改成功',
			modfail : '修改失败',
			modconfirm : '你想修改所有的位置信息吗',
			delfail : '删除失败',
			delconfirm : '你确定要删除这个位置吗',
			tagselect : '选择标签',
			movementtag : '选择标签',
			simulator : '选择模拟条件[时 间, 标 签, 算 法]',
			clearfail : '清除历史记录失败',
			monitoringfail : '监控失败',
			monitoringonconfirm : '启动监控',
			monitoringoffconfirm : '停止监控',
			logdelconfirm : '<p>你确定要清除历史记录吗？</p>',
			
		}
	},
	config : {
		button : { set :'设 置', tagselect : '选择标签', search : '搜 索'},
		form : {
			algorithm : '算 法',
			speed : '速 率',
			time : '时 间',
			waitTime : '停留时间',
			avgMinCount : 'TOA 分钟数',
			baseHeight : '基础高度',
			isLogInsert : '原始的日志',
			use : '启 用',
			notuse : '停 用',
			broadcastTerm : '广播词',
			gpsTerm : '全球定位系统( GPS )',
			uwbTerm : '超宽频等待时间',
			uwbAct : '超宽频 开 / 关',
			dgpsAct : 'D-GPS 开 / 关',
			uwbBlink : '超宽频 频率',
			tdoaRatio : 'TDOA 比',
			thresh : '相关系数',
			grad : '比 率',
			angle : '角 度',
			isSports : '运动模式',
			tagfilter : '搜索标签',
			ball : '球标签'
		},
		title : {
			uwb : '超宽频配置',
			tdoa : '时间差算法配置',
			gps : '全球定位系统(GPS)配置',
			server : '服务器配置',
			motion : '运动检测配置(运动模式)',
		},
		message : {
			modsuccess : '设置成功',
			modfail : '设置失败'
		},
		description : {
			avgMinCount : "到达时间(TOA或ToA),有时被称为飞行时间(ToF),是一个超宽频无线信号的旅行时间从一个发射器(标签)远程单接收器(RAP)。系统后开始计算的TOA最小数量或更多的收集。如果该值为0,则系统可以计算标签的位置,无论收集TOA的计数。",
			speed : "如果标签的速度计算的定位数据比这更快速度的因素,系统将定位数据的丢弃。这个速度的因素是应用不同的根据标签的运动。如果系统已经确定,标签是移动,这个因素是应用的3倍。运动跟踪标签(球),这个因素将适用于10倍。",
			time : "例如：如果一个标签的频率2HZ,这个因素是3秒,然后系统将计算出的位置在收集六TOA数据。时间越短,系统的快速计算。系统平均运动所需的时间因素。",
			motion : "这个因素是确定的阈值标签的运动。如果标签的相关系数和变化的速度大于阈值,系统可以确定标签移动。增加两个阈值,标签的运动是不能很好地检测到。",
			baseHeight : '参考标签定位计算的高度',
			ballEuid : '使用球标签euid(后4位)',
			waitTime : '超宽频数据最大等待时间',
			tdoaRatio : '失真校正设定价值的定位价值',
			angle : '角阈值检查位置的线性',
		}
	},
	omp : {
		button : { info :'发 送', report :'报 导', search : '搜 索'},
		form : {
			creationTime : '创建时间',
			lastModifiedTime : '最后修改时间',
			deviceSearch : '设备搜索',
			reportSearch : '报导搜索',
			ompRAPId : 'OMP 基站 ID',
			reportTime : '报导时间',
			modTime : '修改时间',
			reportNum : '报导 编号',
			reportDate : '报到时间',
		},
		list : { 
			top : { addDate : '创建时间', modDate : '最后修改时间'},
			head : ['编 号','基站资源 ID','基站资源 URL','发 送'],
			empty : '没有数据',
		},
		dialog : {
			title : ['报 导']
		},
		message : {
			resetsuccess : '复位成功',
			resetfail : '复位失败',
			reportsuccess : '报导成功',
			reportfail : '报导失败',
		}
	},
	tag : {
		button : { search :'搜 索', addall : '添加标签', mod : '修 改', del : '删 除'},
		status : ['备 用','启 用','整 理','修 理','缺 陷', '损 失'],
		type : ['固 定','移 动','卡片'],
		active : {normal : '正 常', stop : '停止工作'},
		form : {
			select : '选 择',
			full : '全 部',
			search : '搜 索',
			tagType : '标签类型',
			activeStatus : '活跃状态',
			tagStatus : '标签状态',
			serial : '连续的',
			version : '版 本',
			battery : '电 压',
			status : '状 态',
			active : '活跃的',
			aliveTime : '有效时间',
			number : '',
			normal : '正 常',
			low : '低',
			excel : '上传表单',
			serialnum : '序列号',
			type : '类 型',
			blink : '频 率'
			
		},
		list : { 
			top : function(totalNum){ return '一共 <span class="font_color1 bold">'+totalNum+'</span> 个';},
			head : ['编 号','类 型','EUID','序列号','版 本','电 压','状 态','有效时间','修 改/删 除'],
			empty : '没有数据',
		},
		dialog : {
			title : ['添加标签','修改标签']
		},
		message : {
			addfail : '添加失败',
			addexcel : '选择excel文件',
			modfail : '修改失败',
			delfail : '删除失败',
			delconfirm : '<p>你确定你要删除这个标签吗?<p>',
			uploadfail : '上传文件失败'
				
		}
		
	},
	system : {
		button : {search : '搜 索'},
		chart : {
			title : { cpu : 'CPU 使用率(%)', memory : '内存使用情况(%)', network : '网络使用情况(KB/s)'}
		},
		tab : {day : '每日统计', month : '每月统计', year : '每年统计'},
		form : {
			date : '日期',
			year : '年份',
			month : '月份'
		},
		
	},
	error : {
		button : {filter : '标签过滤器', scroll : '自动滚动', clear : '清理控制台', search : '搜 索', select : '选 择'},
		level : ['至关重要的', '主要的', '次要的'],
		type : ['有效基站', '标签电压', '定位错误'],
		ecase : [
		    '不足够的 TOA, TWR', 
		    '接收到的目标辐射源价值大于两个说唱之间的距离。', 
		    '辐射源脉冲值突然变了,同时监控变化。',
		    '标签运动从服务器超过限速值。',
		    '算法计算错误',
		    '这个错误发生在您没有设置区域',
		    '超出地图区尺寸',
		    '地图匹配错误',
		    '它发生在定位过程中意外故障发生。',
		],
		chart : {
			title : { error : '失败率 (%)', success : '统计数据成功率'}
		},
		form : {
			point : '位 置',
			full : '所 有',
			total : '一 共',
			time : '时 间',
			date : '日 期',
			plan : '地 图',
			tag : '标 签',
			type : '类型错误',
			level : '等级错误',
			success : '成 功',
			fail : '失 败',
			count : '个 数',
			number : '',
		},
		log : { 
			top : function(totalNum){ return '一共  <span class="font_color1 bold">'+totalNum+'</span>.';},
			head : ['编 号','类型错误','等级错误','基站 /标签','错误情况','日 期'],
			empty : '没有数据',
		},
		dialog : {
			title : ['标签过滤器','标签选择']
		},
		message : {
			tagselect : '选择标签',
		}
	},
	history : {
		button : {search : '搜 索', select : '选 择'},
		chart : {
			title : { waitTime : '停留时间(%)', visitCount : '访问次数', network : '网络应用(KB/s)'}
		},
		tab : {zone : '通过区域统计', plan : '通过地图统计'},
		form : {
			time : '时 间',
			tag : '标 签',
			plan : '地 图',
			scale : '列表数量',
			number : '',
			visit : '访 问',
			full : '所 有',
			hour : ':',
			min : ':',
			sec : ''
		},
		list : { 
			top : function(totalNum){ return '一共 <span class="font_color1 bold">'+totalNum+'</span>.';},
			head : ['编 号','地 图','标 签','区 域','停留时间','创建时间'],
			empty : '没有数据',
		},
		dialog : {
			title : ['选择标签']
		},
		message : {
			tagselect : '选择标签',
		}
	},
	service : {
		button : {search : '搜 索', select : '选 择'},
		tab : {success : '统计数据的成功率', time : '每小时统计', rap : '通过基站统计'},
		form : {
			date : '日 期',
			plan : '地 图',
			tag : '标 签',
			full : '所 有',
			time : '小 时'
		},
		list : { 
			head : ['编 号','标 签','尝试此数','成功次数','失败次数','成功率', '失败率', '一 共', '时 间'],
			empty : '没有数据',
		},
		dialog : {
			title : ['选择标签']
		},
		message : {
			tagselect : '选择标签',
		}
	},
	simulator : {
		button : {scroll : '自动滚动', simulatoron : '开 始', simulatoroff : '停 止', simulatorpause : '暂 停', clear : '清理控制台'},
		form : {
			full : '所 有',
			plan : '选择地图',
			rap : '选择基站', 
		},
		dialog : {
			title : ['与服务器断开连接']
		},
		message : {
			disconnected : '<p>与服务器断开连接</p>',
			alreadyon : '模拟器已在运行',
			alreadyoff : '模拟器已经停止'
		}
	},
	panel : {
		/*添加 linemovement & circlemovement*/
		button : {scroll : '自动滚动', monitoring : '监 控', clear : '清理控制台', logclear : '清理记录', circlemovement : '点形式的运动轨迹', linemovement : '线形式的运动轨迹', filter : '标签过滤器'},
		form : {
			full : '所 有',
			tag : '选择标签',
			plan : '选择地图',
			outdoormap : 'GIS地图',
		},
		dialog : {
			title : ['与服务器断开连接','标签过滤器']
		},
		message : {
			disconnected : '<p>与服务器断开连接</p>',
			clearconfirm : '<p>你确定删除日志吗？</p>',
			clearfail : '清理日志失败',
			monitoringon : '监控开始',
			monitoringoff : '监控停止',
			tagselect : '选择标签',
			
		}
	},
	user : {
		button : {add :'添 加', delall :'删 除', mod : '修 改', del : '停 用', move : '移 动', edit : '编辑类别', editcancel : '编辑取消', search : '搜 索', select : '选 择'},
		tab : {tagissued : '启用列表', tagreturn : '回收列表', user : '用户数据', visit : '访问统计'},
		status : ['停 用', '启 用'],		
		chart : {
			title : { waitTime : '停留时间 (%)', visit : '访 问'}
		},
		form : {
			full : '全 部',
			name : '名 称',
			version : '版 本',
			battery : '电 压',
			man : '男',
			woman : '女',
			normal : '正 常',
			low : '低',
			tag : '标 签',
			alias : '昵 称',
			gender : '性 别',
			phone : '紧急联系人',
			color : '颜 色',
			size : '尺 寸',
			euid : '标 签',
			select : '选 择',
			date : '日 期',
			user : '用 户',
			count : '访 问',
			day : '天',
			tagfilter : '搜索标签',
			plan : '选择地图',
		},
		list : { 
			top : function(groupName, totalNum){ return '<span class="font_color1 bold">'+groupName+'</span> 一共<span class="font_color1 bold">'+totalNum+'</span>个标签';},
			head : ['','标 签','定位地图','昵 称','性 别','联 系','颜 色','状 态','启用时间','回收时间','修改 /停用'],
			empty : '没有数据',
		},
		statistics : { 
			head : ['编 号','标 签','访 问','活跃时间','区 域','一 共'],
		},
		dialog : {
			title : ['选择标签', '启用标签','确认信息','选择种类']
		},
		message : {
			tagselect : '选择标签',
			addfail : ' 启用标签失败',
			euidduplicate : '标签已经被另一个用户在使用。',
			tagnumduplicate : '标签号码是重复的。',
			delfail : '回收标签失败',
			delconfirm : '你确定要回收标签吗?',
			delselect : '选择至少大于1个用户。',
			delallconfirm : '你想回收标签?',
			userselect : '选择至少大于1个用户。',
			movefail : '移动标签失败',
			moveselect : '选择移动目录',
			groupnotempty : '<p>属于子范畴的范畴。</p>',
			usernotempty : '<p>有用户属于一类。</p>',
			groupdelsucccess : '<p>成功删除类别。</p>'
		}
	},
	calibration : {
		button : {add :'添 加', analysis :'无线电分析', mod : '修 改', del : '删 除', init : '初始化', select : '选 择'},
		form : {
			full : '完整的',
			select : '选 择',
			plan : '平面图',
			point : '位 置',
			barrier : '障 碍',
			add : '添 加',
			description : '简 介',
			type : '类 型',
			material : '材 料',
			coordinates : '坐 标',
			blockingRate : '屏蔽率',
			redraw : '重新绘画',
			radio : '广 播',
			radioenvironment : '无线环境',
			baudrate : '波特率',
			blockingrate: '屏蔽率',
			verygood : '非常好的',
			good : '好 的',
			poor : '不好的',
			horizontal : '水平的',
			vertical : '垂直的',
			height : '高 度',
			isAp : '无线接入点',
			networkType : '网 络',
			use : '启 用',
			notuse : '停 用',
			number : '',
			distance : '距 离',
			rapdistance : '到基站的距离',
			analysis : '无线环境',
			sec : '秒',
			min : '最 小'
		},
		rap : { 
			empty : '没有数据',
			emptyrap : '没有数据',
			selectrap : '选择基站',
			modsuccess : '修改成功',
			modfail : '修改失败',
			delsuccess : '删除基站成功',
			delfail : '删除基站失败',
			delconfirm : '你确定你要删除说唱吗?',
			configsuccess : '设置基站成功',
			deadrap : '基站断开连接',
			configfail : '设置基站失败'
		},
		barrier : { 
			empty : '没有数据',
			influenceempty : '没有障碍的影响',
			modsuccess : '修改成功',
			modfail : '修改失败',
			delsuccess : '删除的障碍成功',
			delfail : '删除的障碍失败',
			delconfirm : '你确定你要删除的障碍吗?',
			types : ['墙','柱形物','门'],
			materials : ['木制品', '铁', '铁 块', '塑 料', '玻 璃', '石膏板']
		},
		analysis : {
			mappingtag : '<p>没有映射的标签</p><p>各部门上映射后再测定吧</p>',
			startconfirm : '你想开始测量吗?',
			stopconfirm : '你想停止测量吗?',
			initconfirm : '你确定你想要初始化测量数据?',
		},
		
		dialog : {
			title : ['选择基站']
		},
		
	},
	playback : {
		form : {
			full : '全 部',
			plan : '地 图',
			time : '时 间',
			settime : '时间设置参数',
			tag : '标 签',
			oclock : "点 钟",
		},
		message : {
			settime : '选择一个时间',
			choosetag : '选择标签版本'
		}
	},
	video : {
		follow : {
			
		},
		see : {
			tab : {tag : '标签搜索', device : '设备搜索'},
		}
	},
};

})( jQuery );
