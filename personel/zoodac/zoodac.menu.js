var Menu = {
	$plans : [],
	$groups : [],
	$count : 0,
	$flag : false,
	init : function(permissions){
		var isMenu01 = false, isMenu02 = false, isMenu03 = false, 
			isMenu04 = false,isMenu05 = false, isMenu06 = false,
			isMenu07 = false;
		var perms = permissions.split('|');
		for(var i=0; i < perms.length; i++){
			if(perms[i] == 1) isMenu01 = true;
			else if(perms[i] == 2) isMenu02 = true;
			else if(perms[i] == 3) isMenu03 = true;
			else if(perms[i] == 4) isMenu04 = true;
			else if(perms[i] == 5) isMenu05 = true;
			else if(perms[i] == 6) isMenu06 = true;
			else if(perms[i] == 7) isMenu07 = true;
		}
		var html = '<ul id="ldd_menu" class="menu_background">';
		html += '<li><a href="/service/main.action"><img src="/resources/service/images/zoodac/logo.png" alt=""/></a></li>' /*添加了一个span目的可以回到首页面状态*/
		//管理
		if(isMenu01){
			html += '<li>';
			html += '	<span>'+$.rtls.menu[0].title+'</span>';
			html += '	<div class="ldd_submenu">';
			html += '		<ul>';
			html += '			<li><a href="/service/manager.action?pages=service.manager">'+$.rtls.menu[0].sub[0]+'</a></li>';
			html += '		</ul>';
			html += '		<a class="ldd_subfoot" href="#"> </a>';
			html += '	</div>';
			html += '</li>';
		}
		//工具
		if(isMenu02){
			html += '<li>';
			html += '	<span>'+$.rtls.menu[1].title+'</span>';
			html += '	<div class="ldd_submenu">';
			html += '		<ul>';
			html += '			<li><a href="/service/user.action?pages=service.user">'+$.rtls.menu[1].sub[0]+'</a></li>';
			html += '			<li><a href="/service/plan.action?pages=service.plan">'+$.rtls.menu[1].sub[1]+'</a></li>';
			html += '			<li><a href="/service/zone.action?pages=service.zone">'+$.rtls.menu[1].sub[2]+'</a></li>';
			html += '			<li><a href="/service/movement.action?pages=service.movement">'+$.rtls.menu[1].sub[3]+'</a></li>';
			html += '			<li><a href="/service/rap.action?pages=service.rap">'+$.rtls.menu[1].sub[4]+'</a></li>';
			html += '			<li><a href="/service/camera.action?pages=service.camera">'+$.rtls.menu[1].sub[5]+'</a></li>';
			html += '			<li><a href="/service/alarm.action?pages=service.alarm">'+$.rtls.menu[1].sub[6]+'</a></li>';
			html += '			<li><a href="/service/config.action?pages=service.config">'+$.rtls.menu[1].sub[7]+'</a></li>';
			html += '		</ul>';
			html += '		<a class="ldd_subfoot" href="#"> </a>';
			html += '	</div>';
			html += '</li>';
		}
		//设备状态
		if(isMenu03){
			html += '<li>';
			html += '	<span>'+$.rtls.menu[2].title+'</span>';
			html += '	<div class="ldd_submenu">';
			html += '		<ul>';
			html += '			<li><a href="/service/rap.action?pages=service.rap.status">'+$.rtls.menu[2].sub[0]+'</a></li>';
			html += '			<li><a href="/service/tag.action?pages=service.tag.status">'+$.rtls.menu[2].sub[1]+'</a></li>';
			html += '		</ul>';
			html += '		<a class="ldd_subfoot" href="#"> </a>';
			html += '	</div>';
			html += '</li>';
		}
		//统计信息
		if(isMenu04){
			html += '<li>';
			html += '	<span>'+$.rtls.menu[3].title+'</span>';
			html += '	<div class="ldd_submenu">';
			html += '		<ul>';
			html += '			<li><a href="/service/history.action?pages=service.history.statistics">'+$.rtls.menu[3].sub[0]+'</a></li>';
			html += '			<li><a href="/service/position.action?pages=service.position.log">'+$.rtls.menu[3].sub[1]+'</a></li>';
			html += '			<li><a href="/service/playback.action?pages=service.playback">'+$.rtls.menu[3].sub[2]+'</a></li>';
			html += '			<li><a href="/service/heat.map.action?pages=service.heat.map">'+$.rtls.menu[3].sub[3]+'</a></li>';
			html += '		</ul>';
			html += '		<a class="ldd_subfoot" href="#"> </a>';
			html += '	</div>';
			html += '</li>';
		}
		//客户需要
		if(isMenu07){
			html += '<li>';
			html += '<span>'+$.rtls.menu[6].title+'</span>';
			html += '<div id="" class="ldd_submenu">';
			html += '	<ul>';
			html += '		<li><a href="/service/user.action?pages=service.user">'+$.rtls.menu[6].sub[0]+'</a></li>';
			html += '		<li><a href="/service/rap.action?pages=service.rap.status">'+$.rtls.menu[6].sub[1]+'</a></li>';
			html += '		<li><a href="/service/tag.action?pages=service.tag.status">'+$.rtls.menu[6].sub[2]+'</a></li>';
			html += '		<li><a href="/service/history.action?pages=service.history.statistics">'+$.rtls.menu[6].sub[3]+'</a></li>';
			html += '		<li><a href="/service/position.action?pages=service.position.log">'+$.rtls.menu[6].sub[4]+'</a></li>';
			html += '		<li><a href="/service/playback.action?pages=service.playback">'+$.rtls.menu[6].sub[5]+'</a></li>';
			html += '		<li><a href="/service/heat.map.action?pages=service.heat.map">'+$.rtls.menu[6].sub[6]+'</a></li>';
			html += '	</ul>';
			html += '	<a class="ldd_subfoot" href="#"> </a>';
			html += '</div>';
			html += '</li>';
		}
		//实时监控
		if(isMenu05){
			html += '<li>';
			html += '<span>'+$.rtls.menu[4].title+'</span>';
			html += '<div id="menu-panels" class="ldd_submenu">';
			html += '	<ul>';
			html += '	</ul>';
			html += '	<a class="ldd_subfoot" href="#"> </a>';
			html += '</div>';
			html += '</li>';
		}
		//客户需求
		if(isMenu06){
			html += '<li>';
			html += '<span>'+$.rtls.menu[5].title+'</span>';
			html += '<div id="" class="ldd_submenu">';
			html += '	<ul>';
			html += '		<li><a href="/service/video.change.action?pages=service.video.change">'+$.rtls.menu[5].sub[0]+'</a></li>';
			html += '		<li><a href="/service/error.action?pages=service.error.panel">'+$.rtls.menu[5].sub[1]+'</a></li>';
			html += '		<li><a href="/service/work.order.action?pages=service.work.order">'+$.rtls.menu[5].sub[2]+'</a></li>';
			html += '		<li><a href="/service/roll.call.action?pages=service.roll.call">'+$.rtls.menu[5].sub[3]+'</a></li>';
			html += '		<li><a href="/service/work.attence.action?pages=service.work.attence">'+$.rtls.menu[5].sub[4]+'</a></li>';
			html += '		<li><a href="/service/overall.view.action?pages=service.overall.view">'+$.rtls.menu[5].sub[5]+'</a></li>';
			html += '		<li><a href="/service/video.watch.action?pages=service.video.watch">'+$.rtls.menu[5].sub[6]+'</a></li>';
			html += '		<li><a href="/service/video.reload.action?pages=service.video.reload">'+$.rtls.menu[5].sub[7]+'</a></li>';
			html += '	</ul>';
			html += '	<a class="ldd_subfoot" href="#"> </a>';
			html += '</div>';
			html += '</li>';
		}
		
		html += '</ul>';
		$('#menu').html(html);
		
		/*$ 添加地图分组功能 开始 $*/
		
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/plan.json?action=get.groups",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
			success : function(data) {
				if(data.groups.length==0){
					Menu.$flag = true;
					return;
				}
				Menu.$groups = data.groups;
				for (var i = 0; i < Menu.$groups.length; i++) {
					var item = "", html = "";
					item = Menu.$groups[i].groupName;
					html += '<li>';
					html += '<span>'+item+'</span>';
					html += '<div id="menu-groups" class="ldd_subgroup">';
					html += '	<ul>';
					html += '	</ul>';
					html += '</div>';
					html += '</li>';
					$('#menu-panels>ul').append(html);
				}
				$('#menu-panels>ul>li').hover(function(){
					$(this).children("#menu-groups").css("display","block");
				},function(){
					$(this).children("#menu-groups").css("display","none");
				});
				for (var j = 0; j < Menu.$groups.length; j++) {
					//下一层内容
					$.ajax({
						async : false,
						type: 'GET',
						url: "/service/plan.json?action=get.plansByGroupId",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
			            	"groupName" : Menu.$groups[j].groupName
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
						success : function(data) {

							Menu.$plans = data.plans;
							Menu.$count++;
							var item, html;
							for (var i = 0; i < Menu.$plans.length; i++) {
								item = Menu.$plans[i];
								html = '<li><a href="javascript:Panel.window.open('
										+ item.planId + ', \'' + item.name + '\' ,'+j+')">'
										+ item.name + '</a></li>';
								$('#menu-panels>ul>li:nth-child('+Menu.$count+') #menu-groups>ul').append(html);
							}
							var $menu = $('#ldd_menu');/* 动态创建的ul */
							$menu.children('li').each(function() {
								var $this = $(this);
								var $span = $this.children('span');
								$span.data('width', $span.width());
								/* 给鼠标绑定移入事件 */
								$this.bind('mouseenter', function() {
									/* 包含.ldd_submenu的样式的ul都停止被选元素的所有加入队列的动画但允许完成当前动画.隐藏 */
									$menu.find('.ldd_submenu').stop(true, true).hide();
									/* 给span改变宽度 */
									$span.stop().animate({
										'background-color' : '#00A2E9',
										'color' : '#fff'
									}, 0, function() {
										$this.find('.ldd_submenu').slideDown(200); /* 滑动效果200毫秒 */
									});
									/* 给鼠标绑定移出事件 */
								}).bind('mouseleave', function() {
									$this.find('.ldd_submenu').stop(true, true).hide();
									$span.stop().animate({
										'width' : (parseInt($span.data('width'))) + 'px',
										'background-color' : 'transparent',
										'color' : '#1e1e1e'
									}, 0);
								});
							});
						}
					});	
				}
			}
		});
		
		/*$ 结束 $*/
		
		
//新增功能
		if(Menu.$flag){
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/plan.json?action=get.plans",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Menu.$plans = data.plans;
	            	var item, html; 
	            	for(var i=0; i < Menu.$plans.length; i++){
						item = Menu.$plans[i];
						html = '<li><a href="javascript:Panel.window.open('+item.planId+', \''+item.name+'\')">'+item.name+'</a></li>';
						$('#menu-panels').find('ul').append(html);
					}
					var $menu = $('#ldd_menu');/* 动态创建的ul */
					$menu.children('li').each(function() {
						var $this = $(this);
						var $span = $this.children('span');
						$span.data('width', $span.width());
						/* 给鼠标绑定移入事件 */
						$this.bind('mouseenter', function() {
							/* 包含.ldd_submenu的样式的ul都停止被选元素的所有加入队列的动画但允许完成当前动画.隐藏 */
							$menu.find('.ldd_submenu').stop(true, true).hide();
							/* 给span改变宽度 */
							$span.stop().animate({
								'background-color' : '#00A2E9',
								'color' : '#fff'
							}, 0, function() {
								$this.find('.ldd_submenu').slideDown(200); /* 滑动效果200毫秒 */
							});
							/* 给鼠标绑定移出事件 */
						}).bind('mouseleave', function() {
							$this.find('.ldd_submenu').stop(true, true).hide();
							$span.stop().animate({
								'width' : (parseInt($span.data('width'))) + 'px',
								'background-color' : 'transparent',
								'color' : '#1e1e1e'
							}, 0);
						});
					});
				}
			});
		}
		
			
		// Keyboard Shortcuts
		$(window).bind('keydown', function(event) {
		    if (event.ctrlKey && event.shiftKey || event.metaKey) {
		    	switch (String.fromCharCode(event.which).toLowerCase()) {
		        	case '1':
			            event.preventDefault();
			            var url = "/service/calibration.action?pages=service.calibration.analyzer";
			    		$.window({
			    			showModal: true,
			    			modalOpacity: 0.5,
			    			icon : '/resources/commons/images/icon/icon_setting1.png',
			    			title: 'Calibration tool',
			    			width: $(window).width()-5,
			    			height: $(window).height()-5,
			    			url: url,
			    			footerContent: name,
			    			bookmarkable : false,
			    			onClose: function (wnd) { 
			    				
			    			},
			    			onOpen:function(wnd){
			    				
			    			}
			    		});
		            break;
		        	case '2':
			            event.preventDefault();
			            $("#dialog-confirm").dialog({
							title : $.rtls.commons.dialog.title.ok,
					        width: "300",
					        bgiframe: true,
					        autoOpen: false,
					        modal: true,
					        resizable: false,
					        buttons: [{
					        	text : $.rtls.commons.button.ok,
								click: function() {
									$( this ).dialog( "close" );
									$.ajax({
						    			async : true,
						    			type: 'GET',
						    			url: "/service/init.json?action=init.data",
						    			contentType: "application/json; charset=utf-8",
						                dataType: 'json',
						                data : {},
						    			error: function(XMLHttpRequest, textStatus, errorThrown) { 
						    				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
						                },
						                success : function (data) {
						                	if(data.result == 'success'){
						                		Log.dialog($.rtls.commons.dialog.title.ok, "Partitioning & Statistics init start...");	
						                	}else{
						                		Log.dialog($.rtls.commons.dialog.title.ok, "Partitioning & Statistics already start...");
						                	}
						    			}
						    		});
									
								},
					        },{
					        	text : $.rtls.commons.button.cancel,
								click: function() {
									$( this ).dialog( "close" );
								}
							}],
							close: function() {
								$("#dialog-confirm").empty();
					        }
					        
					    });
						$("#dialog-confirm").append($.rtls.commons.message.initconfirm);
						$('#dialog-confirm').dialog('open');
			            
		            break;
		        }
		    
		    }
		});
		
	}
};

