var Menu = {
	$plans : [],
	init : function(permissions){
		var isMenu01 = false, isMenu02 = false, isMenu03 = false, isMenu04 = false,isMenu05 = false, isMenu06 = false;
		var perms = permissions.split('|');
		for(var i=0; i < perms.length; i++){
			if(perms[i] == 1) isMenu01 = true;
			else if(perms[i] == 2) isMenu02 = true;
			else if(perms[i] == 3) isMenu03 = true;
			else if(perms[i] == 4) isMenu04 = true;
			else if(perms[i] == 5) isMenu05 = true;
			else if(perms[i] == 6) isMenu06 = true;
		}
		var html = '<ul id="ldd_menu" class="ldd_menu">';
		if(isMenu01){
			html += '<li>';
			html += '	<span>'+$.rtls.menu[0].title+'</span>';
			html += '	<div class="ldd_submenu">';
			html += '		<ul>';
			html += '			<li class="ldd_heading">'+$.rtls.menu[0].heading[0]+'</li>';
			html += '			<li><a href="/service/manager.action?pages=service.manager">'+$.rtls.menu[0].sub[0]+'</a></li>';
			html += '		</ul>';
			html += '		<a class="ldd_subfoot" href="#"> </a>';
			html += '	</div>';
			html += '</li>';
		}
		if(isMenu02){
			html += '<li>';
			html += '	<span>'+$.rtls.menu[1].title+'</span>';
			html += '	<div class="ldd_submenu">';
			html += '		<ul>';
			html += '			<li class="ldd_heading">'+$.rtls.menu[1].heading[0]+'</li>';
			html += '			<li><a href="/service/plan.action?pages=service.plan">'+$.rtls.menu[1].sub[0]+'</a></li>';
			html += '			<li><a href="/service/zone.action?pages=service.zone">'+$.rtls.menu[1].sub[1]+'</a></li>';
			html += '			<li><a href="/service/movement.action?pages=service.movement">'+$.rtls.menu[1].sub[2]+'</a></li>';
			html += '			<li><a href="/service/rap.action?pages=service.rap">'+$.rtls.menu[1].sub[3]+'</a></li>';
			html += '			<li><a href="/service/rap.action?pages=service.rap.version">'+$.rtls.menu[1].sub[4]+'</a></li>';
			html += '			<li><a href="/service/config.action?pages=service.config">'+$.rtls.menu[1].sub[6]+'</a></li>';
			html += '		</ul>';
			html += '		<a class="ldd_subfoot" href="#"> </a>';
			html += '	</div>';
			html += '</li>';
		}
		if(isMenu03){
			html += '<li>';
			html += '	<span>'+$.rtls.menu[2].title+'</span>';
			html += '	<div class="ldd_submenu">';
			html += '		<ul>';
			html += '			<li class="ldd_heading">'+$.rtls.menu[2].heading[0]+'</li>';
			html += '			<li><a href="/service/rap.action?pages=service.rap.status">'+$.rtls.menu[2].sub[0]+'</a></li>';
			html += '			<li><a href="/service/tag.action?pages=service.tag.status">'+$.rtls.menu[2].sub[1]+'</a></li>';
			html += '			<li><a href="/service/system.action?pages=service.system.resource">'+$.rtls.menu[2].sub[2]+'</a></li>';
			html += '			<li><a href="/service/error.action?pages=service.error.panel">'+$.rtls.menu[2].sub[3]+'</a></li>';
			html += '		</ul>';
			html += '		<a class="ldd_subfoot" href="#"> </a>';
			html += '	</div>';
			html += '</li>';
		}
		if(isMenu04){
			html += '<li>';
			html += '	<span>'+$.rtls.menu[3].title+'</span>';
			html += '	<div class="ldd_submenu">';
			html += '		<ul>';
			html += '			<li class="ldd_heading">'+$.rtls.menu[3].heading[0]+'</li>';
			html += '			<li><a href="/service/system.action?pages=service.system.statistics">'+$.rtls.menu[3].sub[0]+'</a></li>';
			html += '			<li><a href="/service/history.action?pages=service.history.statistics">'+$.rtls.menu[3].sub[1]+'</a></li>';
			html += '			<li><a href="/service/service.action?pages=service.service.statistics">'+$.rtls.menu[3].sub[2]+'</a></li>';
			html += '			<li><a href="/service/user.action?pages=service.user.statistics">'+$.rtls.menu[3].sub[3]+'</a></li>';
			html += '			<li><a href="/service/error.action?pages=service.error.statistics">'+$.rtls.menu[3].sub[4]+'</a></li>';
			html += '			<li class="ldd_heading">'+$.rtls.menu[3].heading[1]+'</li>';
			html += '			<li><a href="/service/playback.action?pages=service.playback">'+$.rtls.menu[3].sub[9]+'</a></li>';
			html += '			<li><a href="/service/history.action?pages=service.history.log">'+$.rtls.menu[3].sub[5]+'</a></li>';
			html += '			<li><a href="/service/position.action?pages=service.position.log">'+$.rtls.menu[3].sub[6]+'</a></li>';
			html += '			<li><a href="/service/error.action?pages=service.error.log">'+$.rtls.menu[3].sub[7]+'</a></li>';
			html += '		</ul>';
			html += '		<a class="ldd_subfoot" href="#"> </a>';
			html += '	</div>';
			html += '</li>';
		}
		if(isMenu05){
			html += '<li>';
			html += '<span>'+$.rtls.menu[4].title+'</span>';
			html += '<div id="menu-panels" class="ldd_submenu">';
			html += '	<ul>';
			html += '		<li class="ldd_heading">'+$.rtls.menu[4].heading[0]+'</li>';
			html += '	</ul>';
			html += '	<a class="ldd_subfoot" href="#"> </a>';
			html += '</div>';
			html += '</li>';
		}
		if(isMenu06){
			html += '<li>';
			html += '	<span>'+$.rtls.menu[5].title+'</span>';
			html += '	<div class="ldd_submenu">';
			html += '		<ul>';
			html += '			<li class="ldd_heading">'+$.rtls.menu[5].heading[0]+'</li>';
			html += '			<li><a href="/service/user.action?pages=service.user">'+$.rtls.menu[5].sub[0]+'</a></li>';
			html += '			<li><a href="/service/tag.action?pages=service.tag">'+$.rtls.menu[5].sub[1]+'</a></li>';
			html += '		</ul>';
			html += '		<a class="ldd_subfoot" href="#"> </a>';
			html += '	</div>';
			html += '</li>';
		}
		html += '</ul>';
		$('#menu').html(html);
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
		        	case '3':
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
						    			url: "/service/playback.json?action=playback.algolithm.enable",
						    			contentType: "application/json; charset=utf-8",
						                dataType: 'json',
						                data : {},
						    			error: function(XMLHttpRequest, textStatus, errorThrown) { 
						    				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
						                },
						                success : function (data) {
						                	if(data.result == 'success'){
						                		if(data.algorithm){
						                			Log.dialog($.rtls.commons.dialog.title.ok, "Algorithm Enable");	
						                		}else{
						                			Log.dialog($.rtls.commons.dialog.title.ok, "Algorithm Disable");
						                		}
						                			
						                	}else{
						                		Log.dialog($.rtls.commons.dialog.title.ok, "Algorithm Enable fail");
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
						$("#dialog-confirm").append('你确定你想将算法应用于回放吗?');
						$('#dialog-confirm').dialog('open');
			            
		            break;
		        }
		    
		    }
		});
		
	}
};
