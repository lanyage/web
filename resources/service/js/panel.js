var $layout = null, $innerLayout = null; 
var Panel = {
	$id : 'Panel',	$isInit : false,
	$sbmId : 0, $componentId : 'RAP',
	$plans : [], $plan : null, $planName : null,
	$groups : [], $group : null,
	$raps : [], $count : 0,
	$tag : {euid : '0000000000000000'}, $tags : new HashMap(),
	$addTime : null, $isIn : true,
	start : function(planId){
		this.$plan = {'planId' : planId};
		Panel.ui.layout();
		Panel.ui.menu(Panel.$plan.planId);
		Panel.log.init();
		Panel.alarm.init();
		Panel.ui.indoorMap();	
		Panel.notify.init();
		
	},
	ui : {
		$map : null, $vectorLayer : null, $mapControls : null, $mapType : '2D',
		layout : function(){
			$layout = $('body').layout({
				center__paneSelector :  ".outer-layout-center",
				west__paneSelector :	".outer-layout-west",
				east__paneSelector :	".outer-layout-east",
				south__paneSelector :   ".outer-layout-south",
				north__paneSelector :   ".outer-layout-north",
				west__size:	200,
				west__minSize : 200,
				east__initClosed  : true,
				south__initClosed : true,
				north__initClosed : true,
				spacing_open : 4,
				spacing_closed:	4,
				east__spacing_closed : 0,
				north__spacing_closed :	0,
				south__spacing_closed :	0,
				center__onresize : "$innerLayout.resizeAll"
			});
			$innerLayout = $('div.outer-layout-center').layout({
				center__paneSelector:	".inner-layout-center",
				west__paneSelector:		".inner-layout-west",
				east__paneSelector:		".inner-layout-east",
				south__paneSelector:	".inner-layout-south",
				north__paneSelector:	".inner-layout-north",
				west__initClosed :      true,
				east__initClosed :      true,
				north__initClosed :	    true,
				south__size:			200, 
				spacing_open:	4,
				spacing_closed:	4,
				west__spacing_closed:	0,
				east__spacing_closed:	0,
				north__spacing_closed:	0,
				center__onresize_end: function () {  
					var h = $('.outer-layout-center > .inner-layout-center').height();
					if(Panel.ui.$mapType == '3D'){
						Unity.resize(null, h);
					}else{
						Map.ui.resize();
					}
					
				},
				south__onresize_end:    function () {  
					var h = $('.outer-layout-center > .inner-layout-south').height() - 20;
					Panel.log.$console.css('height', h+'px');
					Panel.alarm.$console.css('height', h+'px');
				}
			});
		},
		menu : function(planId){
			var html = '<ol id="pmenu" class="menu-selectable">';
			html += '<li><span class="ui-icon ui-icon-stop" style="float:left"></span> '+$.rtls.panel.button.circlemovement+'</li>';
			html += '<li><span class="ui-icon ui-icon-stop" style="float:left"></span> '+$.rtls.panel.button.linemovement+'</li>';
			html += '</ol>';
			html += '<div id="map3d-toolbar" style="padding:15px 0 15px 15px;display:none;">';
			html += '<ol id="map3d-selectable">';
			html += '	<li id="but-view-home" title="Home Screen" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_home.png"/></li>';
			html += '	<li id="but-view-front" title="Front Screen" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_front.png"/></li>';
			html += '	<li id="but-view-person" title="Person screen"class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_person_off.png"/></li>';
			html += '	<li id="but-zoom-in"title="Zoom in"  class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_zoom_in.png"/></li>';
			html += '	<li id="but-zoom-out" title="Zoom out"  class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_zoom_out.png"/></li>';
			html += '	<li id="but-rotate-left" title="Rotate left" class="ui-widget-content ui-selectee"style="cursor:pointer"><img src="/resources/commons/images/3d/icon_rotate_left.png"/></li>';
			html += '	<li id="but-rotate-right" title="Rotate right"  class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_rotate_right.png"/></li>';
			html += '	<li id="but-default" title="Mouse default" class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_default_on.png"/></li>';
			html += '	<li id="but-distance-3d" title="Distance 3D" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_distance_3d_off.png"/></li>';
			html += '	<li id="but-compass" title="Compass Enable" class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_compass.png"/></li>';
			html += '	<li id="but-2dmap" title="Change 2D Map" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_2d.png"/></li>';
			html += '</ol>';
			html += '<div style="clear:both;"> </div>';
			html += '</div>';
			html += '<div style="clear:both;color:#fff; text-align: left; pading:5px" class="header"> '+$.rtls.panel.form.plan+'</div>';
//修改的地方			
			html += '<ol id="plans"  class="menu-selectable">';
//			Panel.$plans = Panel.get.plans();
			Panel.$groups = Panel.get.groups();
			//第一层
			for(var j=0; j < Panel.$groups.length; j++){
				
				html += '<li>';
				html += '<span>'+Panel.$groups[j].groupName+'</span>';
//				html += '<div id="plan-groups" class="plan-groups">';
				html += '	<ol id="plan-group">';
				html += '	</ol>';
//				html += '</div>';
				html += '</li>';
			}
			
			Panel.$plans = Panel.get.plans();
		    var planIx ;
			for(var i=0; i < Panel.$plans.length; i++){
    			
				if(Panel.$plans[i].planId == planId){
					Panel.$plan = Panel.$plans[i];
					planIx = i;
				}
			}
//			for(var i=0; i < Panel.$plans.length; i++){
//    			html += '<li><span class="ui-icon ui-icon-contact" style="float:left"></span> ' 
//    				 +Panel.$plans[i].name+"</li>";
//				if(Panel.$plans[i].planId == planId){
//					Panel.$plan = Panel.$plans[i];
//					planIx = i;
//				}
//			}
			html += '</ol>';
			html += '<div style="color:#fff; text-align: left;" class="header"> '+$.rtls.panel.form.tag+'</div>';
			html += '<ol id="tags"  class="menu-selectable">';
			//html += '<li><span class="ui-icon ui-icon-tag" style="float:left"></span>'+$.rtls.panel.form.full+'</li>';
			//1.1.4.6中修改
			html += '<li id="tag_0000000000000000"><span class="ui-icon ui-icon-tag" style="float:left"></span>'+$.rtls.panel.form.full+'</li>';
			var tags = Panel.get.tags();
			/*
			for(var i=0; i < tags.length; i++){
    			html += '<li><span class="ui-icon ui-icon-tag" style="float:left"></span> '+tags[i].euid+'<i class="icon-pause icon-large" style="display:none"></i><i class="icon-camera icon-large" style="display:none"></i></li>';
    			Panel.$tags.put(tags[i].euid, tags[i]);
    			Panel.worker.init(tags[i].euid);
    		}
    		*/
			//1.1.4.6中修改
			for(var i=0, tag; tag = tags[i]; i++){

				if(tag.type == 1){
					html += '<li id="tag_'+tag.euid+'"><img src="http://218.77.105.241:60080/resources/commons/images/map/icon_tag_fixed.png" style="vertical-align: middle;padding-right:4px"/>'+tag.euid+'<i class="icon-pause icon-large" style="display:none"></i><i class="icon-camera icon-large" style="display:none"></i></li>';
        		}else if(tag.type == 2){
					html += '<li id="tag_'+tag.euid+'"><img src="http://218.77.105.241:60080/resources/commons/images/map/icon_tag_move.png"  style="vertical-align: middle;padding-right:4px"/>'+tag.euid+'<i class="icon-pause icon-large" style="display:none"></i><i class="icon-camera icon-large" style="display:none"></i></li>';
        		}else{
					html += '<li id="tag_'+tag.euid+'"><img src="http://218.77.105.241:60080/resources/commons/images/map/icon_tag_card.png"  style="vertical-align: middle;padding-right:4px"/>'+tag.euid+'<i class="icon-pause icon-large" style="display:none"></i><i class="icon-camera icon-large" style="display:none"></i></li>';
        		}
    			Panel.$tags.put(tag.euid, tag);
    			Panel.worker.init(tag.euid);
    		}
    		html += '</ol>';
			$('#menubar').html(html);
			Panel.$groups = Panel.get.groups();
			//第二层
			for (var j = 0; j < Panel.$groups.length; j++) {
				$.ajax({
					async : false,
					type: 'GET',
					url: "http://218.77.105.241:60080/service/plan.json?action=get.plansByGroupId",
					contentType: "application/json; charset=utf-8",
		            dataType: 'json',
		            data : { 
		            	"groupName" : Panel.$groups[j].groupName
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) { 
		            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
		            },
					success : function(data) {
	
						Panel.$plans = data.plans;
						Panel.$count++;
						
						for(var i=0; i < Panel.$plans.length; i++){
							var newHTML = "";
							newHTML = '<li><span class="ui-icon ui-icon-contact" style="float:left"></span> '+Panel.$plans[i].name+'</li>';
							$('#plans>li:nth-child('+Panel.$count+')>ol').append(newHTML);
						}
					}
				});
			}
			$("#pmenu").selectable({
				selected : function (event, ui) {
					var text = $.trim($(ui.selected).text());
					if(text == $.rtls.panel.button.circlemovement) {
						if ($(ui.selected).hasClass('click-selected')) {
		                    $(ui.selected).removeClass('ui-selected click-selected');
		                    $(ui.selected).children(".ui-icon-play").addClass('ui-icon-stop').removeClass('ui-icon-play');
		                    Panel.worker.$isCircleMovement = false;
		                } else {
		                	$(ui.selected).addClass('click-selected');
		                	$(ui.selected).children(".ui-icon-stop").addClass('ui-icon-play').removeClass('ui-icon-stop');
		                    Panel.worker.$isCircleMovement = true;
		                }
						
					}else if(text == $.rtls.panel.button.linemovement) {
						if ($(ui.selected).hasClass('click-selected')) {
		                    $(ui.selected).removeClass('ui-selected click-selected');
		                    $(ui.selected).children(".ui-icon-play").addClass('ui-icon-stop').removeClass('ui-icon-play');
		                    Panel.worker.$isLineMovement = false;
		                } else {
		                	$(ui.selected).addClass('click-selected');
		                	$(ui.selected).children(".ui-icon-stop").addClass('ui-icon-play').removeClass('ui-icon-stop');
		                    Panel.worker.$isLineMovement = true;
		                }
					}
					Map.canvas.clearPath();
			    },
			    unselected : function (event, ui) {
			    	$(ui.unselected).removeClass('click-selected');
			    	var text = $(ui.selected).text();
			        if($.trim(text) == $.rtls.panel.button.circlemovement){
						Panel.worker.$isCircleMovement = false;
						
			        }else if($.trim(text) == $.rtls.panel.button.linemovement){
			        	Panel.worker.$isLineMovement = false;
			        }
			        Map.canvas.clearPath();
			    }
			});
			Panel.$plans = Panel.get.plans();
			//
			$("#menubar #plans #plan-group").selectable({
				stop : function () {
					$( ".ui-selected", this ).each(function() {
						var ix = $("#menubar #plans #plan-group li").index(this);
						if(Panel.$plan.planId !=  Panel.$plans[ix].planId){
							Panel.$plan = Panel.$plans[ix];	
							Panel.ui.indoorMap();
							Panel.ui.clearIndoorNode();
						}
					});
				}
			});
			//获取展开第几项的值的方法：
            (function ($) {
                $.getUrlParam = function (name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]); return null;
                }
            })(jQuery);

            var pIndex = $.getUrlParam('index');
			$('#plans').accordion({
				active : parseInt(pIndex)
			});//包起来这个ID下的所有元素
			(function(){
				var lableId;
				TagLable=function(){}
				TagLable.prototype.getName=function(){
					return lableId;
				}
				TagLable.prototype.setName=function(value){
					lableId=value;
				}		
			})();
			//浮出按钮(点击开始按钮):odd奇数-even偶数
			$("#tags li i:odd").click(function(){
			    var tagLable = new TagLable().getName();
			    $.ajax({
				    type : 'GET',
				    url : "http://218.77.105.241:60080/sendTagEuid?tagEuid="+tagLable,
				    contentType: "application/json; charset=utf-8",
				    data : {
					    "tagEuid" : tagLable
				    }
			    });
			    $("#tags li i:odd").css('display','none');
			    $(this).prev().css('display','inline-block');
			    $("#map-viewport-"+tagLable).css("z-index","9999");
			});
			//点击暂停按钮
			$("#tags li i:even").click(function(){
				$("#map-viewport-"+new TagLable().getName()).css("z-index","initial");
			    var tagLable = null;
			    $.ajax({
				    type : 'GET',
				    url : "http://218.77.105.241:60080/sendTagEuid?tagEuid="+tagLable,
				    contentType: "application/json; charset=utf-8",
				    data : {
					    "tagEuid" : tagLable
				    }
			    });
			    $("#tags li i:odd").css('display','none');
			    $(this).css('display','none');
			    
			});
			
	       $("#menubar #tags li").hover(function(){
	    	   var tags = Panel.get.tags();
	    	   for(var i=0; i < tags.length*2; i++){
		    	   if($("#menubar #tags li i:eq("+i+")").css('display')=="block"){
		    		   return;
		    	   }
	    	   }
	    	   $( this ).each(function() {
					var ix = $( "#menubar #tags li" ).index( this );
					var text = $.trim($(this).text());
					var tagLable = new TagLable();
					tagLable.setName($(this).text());
					
				});
	    	   if($(this.lastChild).prev().css('display')=="block"){
	    		   $(this.lastChild).css('display','none');
	    	   }else{
	    		   $(this.lastChild).css('display','inline-block');
	    	   }
           },function(){
        	   $("#tags li i:odd").css('display','none');
           });
		    //
			$("#menubar #tags").selectable({
				cancel: "i",
				stop : function () {
					$( ".ui-selected", this ).each(function() {
						var ix = $( "#menubar #tags li" ).index( this );
						var text = $.trim($(this).text());
						if(ix == 0){
							Panel.$tag = {euid : '0000000000000000'};
						}else{
							Panel.$tag = Panel.$tags.get(text);
						}
						Panel.log.clear();
						Panel.ui.clearIndoorNode();
					});
				}
			});

			$('ol#plans #plan-group li').eq(planIx).addClass('ui-selected');
			$('ol#tags li').eq(0).addClass('ui-selected');
		},
		indoorMap : function(){
			/*var html = '<table style="width:100%">';
			html += '<thead>';
			html += '<tr>';
			html += '	<th style="color:#fff;text-align:center;width:50px">Alg</th>';
			html += '	<th style="color:#fff;text-align:center;width:40px">Status</th>';
			html += '	<th style="color:#fff;text-align:center;width:40px">Event</th>';//1.1.4.6中修改
			html += '	<th style="color:#fff;text-align:center;width:85px">Log Time</th>';
			html += '	<th style="color:#fff;text-align:center;width:80px">Sys Time</th>';
			html += '	<th style="color:#fff;text-align:center;width:80px">Delay Time</th>';
			html += '	<th style="color:#fff;text-align:center;width:55px">EUID</th>';
			html += '	<th style="color:#fff;text-align:center;width:50px">Seq</th>';
			html += '	<th style="color:#fff;text-align:center;width:80px">Diff</th>';
			html += '	<th style="color:#fff;text-align:center;width:150px">Position</th>';
			html += '	<th style="color:#fff;text-align:center;width:150px">Area</th>';
			html += '   <th align="right">';
			html += '	    <button id="trash" style="margin: 2px; padding: 4px; cursor: pointer; float: right;"></button>';
			html += '	    <button id="scroll" style="margin: 2px; padding: 4px; cursor: pointer; float: right;"></button>';
			html += '	    <button id="play" style="margin: 2px; padding: 4px; cursor: pointer; float: right;"></button>';
			html += '   </th>';
			html += '</tr>';
			html += '</thead>';
			html += '<table>';
			$('.outer-layout-center .inner-layout-south .header').html(html);*/
			
			var html = '<table style="width:100%">';
			html += '<thead>';
			html += '<tr>';
			html += '	<th class="alarm" style="color:#fff;text-align:center;width:150px">标签ID</th>';
			html += '	<th class="alarm" style="color:#fff;text-align:center;width:150px">厂名</th>';
			html += '	<th class="alarm" style="color:#fff;text-align:center;width:150px">区域</th>';
			html += '	<th class="alarm" style="color:#fff;text-align:center;width:150px">工作人员</th>';
			html += '	<th class="alarm" style="color:#fff;text-align:center;width:150px">报警信息</th>';
			html += '	<th class="alarm" style="color:#fff;text-align:center;width:150px">时间</th>';
			
			html += '	<th class="position" style="color:#fff;text-align:center;width:50px">Alg</th>';
			html += '	<th class="position" style="color:#fff;text-align:center;width:40px">Status</th>';
			html += '	<th class="position" style="color:#fff;text-align:center;width:40px">Event</th>';//1.1.4.6中修改
			html += '	<th class="position" style="color:#fff;text-align:center;width:85px">Log Time</th>';
			html += '	<th class="position" style="color:#fff;text-align:center;width:80px">Sys Time</th>';
			html += '	<th class="position" style="color:#fff;text-align:center;width:80px">Delay Time</th>';
			html += '	<th class="position" style="color:#fff;text-align:center;width:55px">EUID</th>';
			html += '	<th class="position" style="color:#fff;text-align:center;width:50px">Seq</th>';
			html += '	<th class="position" style="color:#fff;text-align:center;width:80px">Diff</th>';
			html += '	<th class="position" style="color:#fff;text-align:center;width:150px">Position</th>';
			html += '	<th class="position" style="color:#fff;text-align:center;width:150px">Area</th>';
			html += '   <th align="right">';
			html += '	    <button id="trash" style="margin: 2px; padding: 4px; cursor: pointer; float: right;"></button>';
			html += '	    <button id="scroll" style="margin: 2px; padding: 4px; cursor: pointer; float: right;"></button>';
			html += '	    <button id="play" style="margin: 2px; padding: 4px; cursor: pointer; float: right;"></button>';
			html += '	    <button id="alarm" style="margin: 2px; padding: 4px; cursor: pointer; float: right;"></button>';
			html += '   </th>';
			html += '</tr>';
			html += '</thead>';
			html += '<table>';
			$('.outer-layout-center .inner-layout-south .header').html(html);
			
			$(".outer-layout-center .inner-layout-south .header .alarm").css("display","none");
			$(".outer-layout-center .inner-layout-south .header .position").css("display","");
			
			$("#alarm").button({
				icons: {primary: "ui-icon-stop"}, text:false
			}).click(function() {
				if(Panel.alarm.$isConsole){
					Panel.alarm.$isConsole = false;
					Panel.alarm.$console.css('display', 'none');
					$(".outer-layout-center .inner-layout-south .header .alarm").css("display","none");
				}else{
					Panel.alarm.$isConsole = true;
					Panel.alarm.$console.css('display', '');
					$(".outer-layout-center .inner-layout-south .header .alarm").css("display","");
				}
				$(this).button("option", { 
			        icons: { primary: Panel.alarm.$isConsole ? 'ui-icon-play' : 'ui-icon-stop' }
			    });
				return false; 
			});
			$("#alarm").hover(function(){
			    $("#alarm").attr("title","显示工作票");
			});
			$("#play").button({
				icons: {primary: "ui-icon-stop"}, text:false
			}).click(function() {
				if(Panel.log.$isConsole){
					Panel.log.$isConsole = false;
					Panel.log.$console.css('display', 'none');
					$(".outer-layout-center .inner-layout-south .header .position").css("display","none");
				}else{
					Panel.log.$isConsole = true;
					Panel.log.$console.css('display', '');
					$(".outer-layout-center .inner-layout-south .header .position").css("display","");
				}
				$(this).button("option", { 
			        icons: { primary: Panel.log.$isConsole ? 'ui-icon-play' : 'ui-icon-stop' }
			    });
				return false; 
			});
			$("#play").hover(function(){
			    $("#play").attr("title","显示标签信息");
			});
			/*
			$("#play").button({
				icons: {primary: "ui-icon-stop"}, text:false
			}).click(function() {
				if(Panel.log.$isConsole){
					Panel.log.$isConsole = false;
				}else{
					Panel.log.$isConsole = true;
				}
				$(this).button("option", { 
			        icons: { primary: Panel.log.$isConsole ? 'ui-icon-play' : 'ui-icon-stop' }
			    });
				return false; 
			});
			*/
			
			$("#trash").button({
				icons: {primary: "ui-icon-trash"}, text:false
			}).click(function() {
				Panel.log.clear();
				return false; 
			});
			$("#trash").hover(function(){
			    $("#trash").attr("title","清除显示台");
			    console.log(2);
			});
			$("#scroll").button({
				icons: {primary: "ui-icon ui-icon-arrowthick-2-n-s"}, text:false
			}).click(function() {
				Panel.log.scroll();
				Panel.alarm.scroll();
				$(this).button("option", { 
			        icons: { primary: Panel.log.$isAutoScroll ? 'ui-icon-arrowthickstop-1-s' : 'ui-icon ui-icon-arrowthick-2-n-s' }
			    });
				return false; 
			});
			$("#scroll").hover(function(){
			    $("#scroll").attr("title","向下滚屏");
			});
			
			$("#dev_11").hover(function(){
                console.log(1);
            });
			
			Panel.log.clear();
			Panel.log.$isAutoScroll = false;
			
			if(this.$mapType == '2D'){
				$("#pmenu").show();
				$('#viewport').show();
				$('#viewport-3d').hide();
				$('#map3d-toolbar').hide();
				if(Map.$plan == null || Map.$plan.planId != Panel.$plan.planId){
					Panel.$isInit = false;
					Map.init(Panel);
				}
			}else{
				$("#pmenu").hide();
				$('#viewport').hide();
				$('#viewport-3d').show();
				$('#map3d-toolbar').show();
				var sbmPath = '/files/plan/';
				var texturePath = '/files/plan/map_'+Panel.$plan.planId+'/';
				var gxxmlPath = '/files/plan/map_'+Panel.$plan.planId+'.xml';
				if(!Unity.$isMapInit){
					Panel.$isInit = false;
					var h = $('.outer-layout-center > .inner-layout-center').height();
					Unity.init(Panel, '100%', h, sbmPath, texturePath, gxxmlPath);
				}else{
					if(Unity.$plan == null || Unity.$plan.planId != Panel.$plan.planId){
						Panel.$isInit = false;
						Unity.clearSBM();
						Unity.createGKXML(sbmPath, texturePath, gxxmlPath, Panel);	
					}
						
				}
			}
			
	    	
		},
		clearIndoorNode : function(){
			if(this.$mapType == '2D'){
				Map.canvas.clearPaper();
				Panel.worker.$lastIndoorPoints.clear();
			}else{
				
			}
			
		},
		
	},
	get : {
		time : function(milliseconds){
			var d = new Date(milliseconds);
			var h = d.getHours();
			var m = d.getMinutes();
			var s = d.getSeconds();
			var ms = d.getMilliseconds();
			if(h < 10) h = "0"+h;
			if(m < 10) m = "0"+m;
			if(s < 10) s = "0"+s;
			if(ms < 100) ms = "0"+ms;
			else if(ms < 10) ms = "00"+ms;
			
			return h+":"+m+":"+s+":"+ms;
		},
		plans : function(){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "http://218.77.105.241:60080/service/plan.json?action=get.plans",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.plans;
				}
			});
			return items;
		},
		planss : function(planGroupId){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "http://218.77.105.241:60080/service/plan.json?action=get.plansByGroupId",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planGroupId" : planGroupId
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.plans;
				}
			});
			return items;
		},
		groups : function(){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "http://218.77.105.241:60080/service/plan.json?action=get.groups",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.groups;
				}
			});
			return items;
		},
		raps : function(){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "http://218.77.105.241:60080/service/rap.json?action=get.raps",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Panel.$plan.planId
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.raps;
				}
			});
			return items;
		},
		tags : function(){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "http://218.77.105.241:60080/service/tag.json?action=get.issued.tags",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.tags;
				}
			});
			return items;
		},
		
	},
	alarm : {
		$isConsole : true,
		$isAutoScroll : true,
		$console : null,
		$items : [],
		init : function(){
			
			this.scroll();
			this.$console = $('#console-alarms');
			this.$console.css('width', '100%');
			var h = $('.outer-layout-center > .inner-layout-south').height() - 20;
			this.$console.css('height', h+'px');
			this.$console.on("DOMSubtreeModified", function() { 
				var elem = $("#console-alarms");
				if(elem.children('li').size() > 1000){
					elem.children("li:first").remove();
				}
				if (elem[0].scrollHeight > elem.outerHeight() && Panel.alarm.$isAutoScroll) {
					Panel.alarm.$console.animate({scrollTop : elem[0].scrollHeight}, 5);
		        }
			});
			
		},
		clear : function(){
			Panel.alarm.$console.html('');
			
		},
		scroll : function(){
			if(Panel.alarm.$isAutoScroll){
				Panel.alarm.$isAutoScroll = false;
			}else{
				Panel.alarm.$isAutoScroll = true;
			}
		},
		appendIndoor : function(tagEuid,userId,planId,zoneId, userName, zoneType, zoneName, alarmInfo, addTime){//1.1.4.6中修改
		    //var dt = new Date(addTime);
			var color = "", bgcolor = "";
			var html = '<li style="background-color:#FFFFFF;color:#000000;">';
			html += '<table class="console_table">';
			html += '<tr>';
			html += '	<td style="width:80px;padding:2px;background-color:red;color:white;">'+tagEuid+'</td>';
			html += '	<td style="width:80px;padding:2px;background-color:red;color:white;">'+Panel.$planName+'</td>';
			html += '	<td style="width:80px;padding:2px;background-color:red;color:white;">'+zoneName+'</td>';
			html += '	<td style="width:80px;padding:2px;background-color:red;color:white;">'+userName+'</td>';
			html += '	<td style="width:80px;padding:2px;background-color:red;color:white;">'+alarmInfo+'</td>';
			html += '	<td style="width:80px;padding:2px;background-color:red;color:white;">'+addTime+'</td>';
			html += '</tr>';
			html += '</table>';
			html += '</li>';
			this.$console.append(html);
			//this.$items.push({euid : euid, seq : seq, x : x, y : y, distance : distance, time : time, delayTime : delayTime, zoneName : zoneName, movePath : movePath, status : status});
		},
		appendOutdoor : function(algorithm, euid, lat, lng, distance, time, delayTime, processTime, proTime, address, status, tagColor, calibration, event){//1.1.4.6中修改
			var color = "", bgcolor = "";
			var html = '<li style="background-color:#FFFFFF;color:#000000;">';
			html += '<table class="console_table">';
			html += '<tr>';
			html += '	<td style="width:50px;padding:2px">GPS</td>';
			color = "#000000";
			bgcolor = "#FFFFFF";	
			html += '	<td style="width:40px;padding:2pxbackground-color:'+bgcolor+';color:'+color+';">N</td>';
			html += '	<td style="width:80px;padding:2px">'+(event == 1 ? 'O' : '--')+'</td>';
			html += '	<td style="width:80px;padding:2px">'+Panel.get.time(time)+'</td>';
			html += '	<td style="width:80px;padding:2px">'+processTime+'ms</td>';
			html += '	<td style="width:80px;padding:2px">'+(delayTime/1000).toFixed(0)+' sec</td>';
			html += '	<td style="width:50px;padding:2px;color:'+tagColor+'">'+euid+'</td>';
			html += '	<td style="width:80px;padding:2px">'+distance.toFixed(2)+'m</td>';
			html += '	<td style="width:200px;padding:2px">'+lat.toFixed(5)+','+lng.toFixed(5)+'</td>';
			html += '	<td style="width:50px;padding:2px">'+(calibration == 1 ? '0' : 'X')+'</td>';	
			html += '	<td class="console_zonename" style="padding:2px">'+address+'</td>';
			html += '</tr>';
			html += '</table>';
			html += '</li>';
			this.$console.append(html);
			//this.$items.push({euid : euid, seq : seq, x : x, y : y, distance : distance, time : time, delayTime : delayTime, zoneName : zoneName, movePath : movePath, status : status});
		}
		
	},
	log : {
		$isConsole : false,
		$isAutoScroll : false,
		$console : null,
		$items : [],
		init : function(){
			
			this.scroll();
			this.$console = $('#console-logs');
			this.$console.css('width', '100%');
			this.$console.css('display', 'none');
			var h = $('.outer-layout-center > .inner-layout-south').height() - 20;
			this.$console.css('height', h+'px');
			this.$console.on("DOMSubtreeModified", function() { 
				var elem = $("#console-logs");
				if(elem.children('li').size() > 1000){
					elem.children("li:first").remove();
				}
				if (elem[0].scrollHeight > elem.outerHeight() && Panel.log.$isAutoScroll) {
					Panel.log.$console.animate({scrollTop : elem[0].scrollHeight}, 5);
		        }
			});
			
		},
		clear : function(){
			Panel.log.$console.html('');
			
		},
		scroll : function(){
			if(Panel.log.$isAutoScroll){
				Panel.log.$isAutoScroll = false;
			}else{
				Panel.log.$isAutoScroll = true;
			}
		},
		appendIndoor : function(algorithm, euid, seq, x, y, distance, time, delayTime, processTime, zoneName, status, tagColor, errorCase, event){//1.1.4.6中修改
			var color = "", bgcolor = "";
			var html = '<li style="background-color:#FFFFFF;color:#000000;">';
			html += '<table class="console_table">';
			html += '<tr>';
			if(algorithm == 1){
				html += '	<td style="width:50px;padding:2px">TDOA</td>';
			}else if(algorithm == 2){
				html += '	<td style="width:50px;padding:2px">TWR</td>';
			}else{
				html += '	<td style="width:50px;padding:2px">GPS</td>';
			}
			if(status == 1){
				color = "#000000";
				bgcolor = "#00FF00";
				html += '	<td style="width:40px;padding:2px;background-color:'+bgcolor+';color:'+color+';">I</td>';
			}else if(status == 2){
				color = "#000000";
				bgcolor = "#FF5500";
				html += '	<td style="width:40px;padding:2px;background-color:'+bgcolor+';color:'+color+';">D</td>';
			}else{
				color = "#000000";
				bgcolor = "#FFFFFF";	
				html += '	<td style="width:40px;padding:2px;background-color:'+bgcolor+';color:'+color+';">N</td>';
			}

			html += '	<td style="width:40px;padding:2px">'+(event == 1 ? 'O' : '--')+'</td>';//1.1.4.6中修改
			html += '	<td style="width:80px;padding:2px">'+Panel.get.time(time)+'</td>';
			html += '	<td style="width:80px;padding:2px">'+processTime+'ms</td>';
			html += '	<td style="width:80px;padding:2px">'+delayTime+'ms</td>';
			html += '	<td style="width:50px;padding:2px;color:'+tagColor+'">'+euid+'</td>';
			html += '	<td style="width:50px;padding:2px;color:'+tagColor+'">'+seq+'</td>';
			html += '	<td style="width:80px;padding:2px">'+distance.toFixed(2)+'m</td>';
			if(algorithm == 3){
				html += '	<td style="width:150px;padding:2px">'+x.toFixed(5)+'m x '+y.toFixed(5)+'m</td>';	
			}else{
				html += '	<td style="width:150px;padding:2px">'+(x/100).toFixed(2)+'m x '+(y/100).toFixed(2)+'m</td>';
			}
			if(errorCase == '0'){
				html += '	<td class="console_zonename" style="padding:2px">'+zoneName+'</td>';	
			}else if(errorCase == '1'){
				html += '	<td class="console_zonename" style="padding:2px">TOA SIZE LOW</td>';
			}else if(errorCase == '2'){
				html += '	<td class="console_zonename" style="padding:2px">RANGE FILTER</td>';
			}else if(errorCase == '3'){
				html += '	<td class="console_zonename" style="padding:2px">RATIO FILTER</td>';
			}else if(errorCase == '4'){
				html += '	<td class="console_zonename" style="padding:2px">SPEED FILTER</td>';
			}else if(errorCase == '5'){
				html += '	<td class="console_zonename" style="padding:2px">CALCUATION FAIL</td>';
			}else if(errorCase == '6'){
				html += '	<td class="console_zonename" style="padding:2px">MAP FILTER LOSE</td>';
			}else if(errorCase == '7'){
				html += '	<td class="console_zonename" style="padding:2px">MAP SCALE OVER</td>';
			}else if(errorCase == '8'){
				html += '	<td class="console_zonename" style="padding:2px">MAP FILTER ERROR</td>';
			}else if(errorCase == '9'){
				html += '	<td class="console_zonename" style="padding:2px">SYSTEM ERROR</td>';
			}
			
			html += '</tr>';
			html += '</table>';
			html += '</li>';
			this.$console.append(html);
			//this.$items.push({euid : euid, seq : seq, x : x, y : y, distance : distance, time : time, delayTime : delayTime, zoneName : zoneName, movePath : movePath, status : status});
		},
		appendOutdoor : function(algorithm, euid, lat, lng, distance, time, delayTime, processTime, proTime, address, status, tagColor, calibration, event){//1.1.4.6中修改
			var color = "", bgcolor = "";
			var html = '<li style="background-color:#FFFFFF;color:#000000;">';
			html += '<table class="console_table">';
			html += '<tr>';
			html += '	<td style="width:50px;padding:2px">GPS</td>';
			color = "#000000";
			bgcolor = "#FFFFFF";	
			html += '	<td style="width:40px;padding:2pxbackground-color:'+bgcolor+';color:'+color+';">N</td>';
			html += '	<td style="width:80px;padding:2px">'+(event == 1 ? 'O' : '--')+'</td>';
			html += '	<td style="width:80px;padding:2px">'+Panel.get.time(time)+'</td>';
			html += '	<td style="width:80px;padding:2px">'+processTime+'ms</td>';
			html += '	<td style="width:80px;padding:2px">'+(delayTime/1000).toFixed(0)+' sec</td>';
			html += '	<td style="width:50px;padding:2px;color:'+tagColor+'">'+euid+'</td>';
			html += '	<td style="width:80px;padding:2px">'+distance.toFixed(2)+'m</td>';
			html += '	<td style="width:200px;padding:2px">'+lat.toFixed(5)+','+lng.toFixed(5)+'</td>';
			html += '	<td style="width:50px;padding:2px">'+(calibration == 1 ? '0' : 'X')+'</td>';	
			html += '	<td class="console_zonename" style="padding:2px">'+address+'</td>';
			html += '</tr>';
			html += '</table>';
			html += '</li>';
			this.$console.append(html);
			//this.$items.push({euid : euid, seq : seq, x : x, y : y, distance : distance, time : time, delayTime : delayTime, zoneName : zoneName, movePath : movePath, status : status});
		}
		
	},
	window : {
		$items : [], 
		open : function(planId, name, index){ //展开最大化
			console.log('open')
			var url = "http://218.77.105.241:60080/service/panel.action?pages=service.panel&planId="+planId+"&index="+index;
			Panel.window.$items[planId] = $.window({
				showModal: true,
				modalOpacity: 0.5,
				resizable: true,
				icon : 'http://218.77.105.241:60080/resources/commons/images/icon/icon_monitoring.gif',
				title: "———   智 慧 物 联   通 达 天 下   ———",
				width: $(window).width()-5,
				height: $(window).height()-5,
				url: url,
				footerContent: name,
				bookmarkable : false,
				onClose: function (wnd) { 
					Panel.window.$items[planId] = null;
				},
				onOpen:function(wnd){
					$("#window_overlay").css("display", "none");
				}
			});
			$index = index;
			//Panel.window.$items[planId].maximize(); 
		},
		homeOpen : function(planId, name, index){
			var url = "http://218.77.105.241:60080/service/panel.action?pages=service.panel&planId="+planId+"&index="+index;
			Panel.window.$items[planId] = $("#view").window({
				showModal: true,
				modalOpacity: 0.5,
				resizable : false,
				icon : 'http://218.77.105.241:60080/resources/commons/images/icon/icon_monitoring.gif',
				title: "———   智 慧 物 联   通 达 天 下   ———",
				width: $("#view").width()-5,
				height: $("#view").height()-5,
				url: url,
				footerContent: name,
				bookmarkable : false,
				onClose: function (wnd) { 
					Panel.window.$items[planId] = null;
				},
				onOpen:function(wnd){
					$("#window_overlay").css("display", "none");
/*					$(this).css("z-index", "99 !important");*/
				}
			});
			$index = index;
			//Panel.window.$items[planId].maximize();
		},
		close : function(){
			$("#dialog-message").dialog({
				title : $.rtls.panel.dialog.title[0],
		        width: "400",
		        bgiframe: true,
		        autoOpen: false,
		        modal: true,
		        resizable: false,
		        buttons: [{
		        	text : $.rtls.commons.button.ok,
					click: function() {
						$( this ).dialog( "close" );
						window.self.close();
					}
				}],
				close: function() {
					$("#dialog-message").empty();
					if(window.parent != null && window.parent != undefined){
						window.parent.Panel.window.windowClose(Panel.$plan.planId);	
					}
					
		        }
		        
		    });
			$("#dialog-message").append($.rtls.panel.message.disconnected);
			$('#dialog-message').dialog('open');
		},
		windowClose : function(planId){
			if(Panel.window.$items[planId] != null){
				Panel.window.$items[planId].close();
			}
		},
		
	},
	notify : {
		init : function(){
			var sock = new SockJS('/rtls/sockjs');
		  	var client = Stomp.over(sock);
		  	client.debug = null;
		    client.connect({}, function(frame) {
		    	Log.debug("Stomp.sock.connect");
				client.subscribe("/queue/position", function(message) {
		    		if(Panel.$isInit){
		    			Panel.notify.position(message.body);	
		    		}
		    		
		    	});
				
				//for alarm by larry_fan
				client.subscribe("http://218.77.105.241:60080/queue/alarm", function(message) {
		    		if(Panel.$isInit){
		    			Panel.notify.alarm(message.body);	
		    		}
		    		
		    	});
		    });
		    sock.onclose = function(event) {
		    	Log.debug("Stomp.sock.closed");
		    	Panel.window.close();
		    };
		 	$(window).bind('beforeunload',function(){
		    	Log.debug("Stomp.window.beforeunload");
		    	if(client != null && client.connected){
		    		client.disconnect();
		    	}
		    });

		},
		position : function(data){//$addTime : null, $isIn : true,
			var alarm  = $.parseJSON(data);
			if(alarm.eventType == '1' && alarm.tagTilt == 1 ){
				var worker = Panel.worker.$items.get(alarm.tagEuid);
				Panel.$planName = alarm.planName;
				if(worker != undefined){
					worker.postMessage(alarm);
				}
				Panel.$isIn = true;
			}else if(alarm.eventType == '1' && alarm.tagTilt == 0 ){
				if(Panel.$isIn){
					Panel.$addTime = alarm.addTime;
					Panel.$isIn = false;
				}
				if(alarm.addTime - Panel.$addTime < 5000){
					var worker = Panel.worker.$items.get(alarm.tagEuid);
					Panel.$planName = alarm.planName;
					if(worker != undefined){
						worker.postMessage(alarm);
					}
				}
				
				
			}
				
		},
		//for alarm by larry_fan
		alarm : function(data){
			var alarm  = $.parseJSON(data);
			if(alarm.eventType == '62'){
				var worker = Panel.worker.$alarmItems.get(alarm.tagEuid);
				if(worker != undefined){
					worker.postMessage(alarm);
				}
			}
		},
		tag : function(data){
			var alarm  = $.parseJSON(data);
			if(alarm.eventType == '4'){
				if(alarm.status == '1'){
					Panel.worker.$lastIndoorPoints.remove(alarm.tag.euid);
					Panel.$tags.remove(alarm.tag.euid);
					Map.canvas.removeNode(alarm.tag.euid);
				}else if(alarm.status == '2'){
					Panel.$tags.put(alarm.tag.euid, alarm.tag);
        			Panel.worker.init(alarm.tag.euid);
				}
			}
		}
		
	},
	worker : {
	/* 添加点和线的判断*/ 
		$isLineMovement : false,
		$isCircleMovement : false,
		$paper : null, 
		$items : new HashMap(), $item : null, 
		$alarmItems : new HashMap(), $alarmItem : null, //for alarm by larry_fan
		$lastIndoorPoints : new HashMap(),  
		$lastOutdoorPoints : new HashMap(), $markers : [],
		init : function(tagEuid){
			var worker = new Worker('http://218.77.105.241:60080/resources/commons/js/idolink/ido.worker.js');
			worker.onmessage = function(e){
				var data = e.data;
				if(Panel.$tag.euid == '0000000000000000'){ //标签 全体检测
					if(Panel.$plan.planId == data.planId){
						Panel.worker.indoorTracking(data);
					}	
				}else if(Panel.$tag.euid == data.tagEuid){ //个别检测
					if(Panel.$plan.planId != data.planId){
						for(var i=0; i < Panel.$plans.length; i++){
							$('ol#plans li').eq( i ).removeClass('ui-selected');
						}
						for(var i=0; i < Panel.$plans.length; i++){
							if(Panel.$plans[i].planId == data.planId){
								Panel.$plan = Panel.$plans[i]
								$('ol#plans li').eq( i ).addClass('ui-selected');
								break;
							}
						}
					}
					if($('#viewport').css('display') == "none"){
						Panel.ui.indoorMap();
					}
				
					if(Panel.$isInit){
						Panel.worker.indoorTracking(data);	
					}
				}
				
			};
			Panel.worker.$items.put(tagEuid, worker);
			Panel.worker.$alarmItems.put(tagEuid, worker);//for alarm by larry_fan
		},
		indoorTracking : function(data){
			//for alarm by larry_fan
			if(data.eventType == 62){
				if(Panel.alarm.$isConsole){
					Panel.alarm.appendIndoor(data.tagEuid,data.userId,data.planId,data.zoneId, data.userName, data.zoneType, data.zoneName, data.alarmInfo, data.addTime);
				}
				return;
			}
			//1.1.4.6中修改
			if((Panel.$tag.euid == '0000000000000000' || Panel.$tag.euid == data.tagEuid) && Panel.$plan.planId == data.planId){
				var tag =  Panel.$tags.get(data.tagEuid);
				var euid = data.tagEuid.substring(data.tagEuid.length-4, data.tagEuid.length);
				var name = (tag == null ? euid : tag.name);
				var seq = parseInt(data.tagSeq);
				var x = Math.round(data.localX);
				var y = Math.round(data.localY);
				var time = parseInt(data.addTime);
				var delayTime = parseInt(data.delayTime);
				var processTime = parseInt(data.processTime);
				var movePath =  data.movePath;
				var distance = parseFloat(parseFloat(data.distance).toFixed(2));
				var status = parseInt(data.status);
				var proTime = $.now() - time;
				var moveTime =  parseInt(delayTime/movePath.length);
				if(Panel.ui.$mapType == '2D'){ // 2D Mode
					if(status != 2){
						var lastData = Panel.worker.$lastIndoorPoints.get(data.tagEuid);
						if(lastData == null){
							Map.canvas.initNode(data.tagEuid, x, y, tag.size, tag.color, name);
						}
						if(!Map.canvas.addItem(data.tagEuid, seq, name, euid, x, y, time, processTime, movePath, distance, status)){
							Map.canvas.initNode(data.tagEuid, x, y, tag.size, tag.color, name);
							Map.canvas.addItem(data.tagEuid, seq, name, euid, x, y, time, processTime, movePath, distance, status)
						}
						x = Panel.util.carcPxTo3DMeter(x);
						y = Panel.util.carcPxTo3DMeter(y);	
					}
				}else{ //3D Mode
					var objId = 'TAG'+euid;
					x = Panel.util.carcPxTo3DMeter(x);
					y = Panel.util.carcPxTo3DMeter(y);
					var height =  Panel.util.carcMeterTo3DMeter(data.baseHeight);
					height = 140;
					if(Unity.isOBJ(objId)){
						Unity.setOBJTransform(0, Panel.$sbmId+"_OBJ_"+objId+"_0", x, -(y), height);
					}else{
						Unity.addOBJSphere(Panel.$sbmId, objId, x, height, -(y), tag.size, Panel.util.hexToRgbColor(tag.color), 125);	
					}
					
				}
				Panel.worker.$lastIndoorPoints.put(data.tagEuid, data);
				if(Panel.log.$isConsole){
					//1.1.4.6中修改
					Panel.log.appendIndoor(data.algorithm, euid, seq, x, y, distance, time, delayTime, processTime, data.zoneName, status, tag.color, data.errorCase, data.buttonEvent);
				}
				
				//1.1.4.6中加入
				var src = $('#tag_'+data.tagEuid).find('img:first').attr('src');
				if(data.buttonEvent == 1){
					if(src.indexOf('.png') != -1){
						if(data.tagType == 1){
							$('#tag_'+data.tagEuid).find('img:first').attr('src', 'http://218.77.105.241:60080/resources/commons/images/map/icon_tag_fixed_alarm.gif');
						}else if(data.tagType == 2){
							$('#tag_'+data.tagEuid).find('img:first').attr('src', 'http://218.77.105.241:60080/resources/commons/images/map/icon_tag_move_alarm.gif');
						}else if(data.tagType == 3){
							$('#tag_'+data.tagEuid).find('img:first').attr('src', 'http://218.77.105.241:60080/resources/commons/images/map/icon_tag_card_alarm.gif');
						}
					}
				}else{
					if(src.indexOf('.gif') != -1){
						if(data.tagType == 1){
							$('#tag_'+data.tagEuid).find('img:first').attr('src', 'http://218.77.105.241:60080/resources/commons/images/map/icon_tag_fixed.png');
						}else if(data.tagType == 2){
							$('#tag_'+data.tagEuid).find('img:first').attr('src', 'http://218.77.105.241:60080/resources/commons/images/map/icon_tag_move.png');
						}else if(data.tagType == 3){
							$('#tag_'+data.tagEuid).find('img:first').attr('src', 'http://218.77.105.241:60080/resources/commons/images/map/icon_tag_card.png');
						}
					}
				}
			}
		}
	},
	callback : {
		addMarkers : function(){ // 2DMAP init by Call function
			Map.marker.removeAll();
			Panel.$raps = Panel.get.raps();
    		var euid = '', network='';
        	var x=0, y=0;
        	var rap = null;
    		for(var i=0; i < Panel.$raps.length; i++){
    			rap = Panel.$raps[i];
    			rap.id = "dev_"+rap.rapId;
    			euid = rap.euidSrc.substring(rap.euidSrc.length-4, rap.euidSrc.length);
    			if(rap.networkType == '1'){
    				network = 'ethernet';
    			}else if(rap.networkType == '2'){
    				network = 'wifi';
    			}else if(rap.networkType == '3'){
    				network = 'lte';
    			}
    			x = Math.round(rap.localX) - 10;
    			y = Math.round(rap.localY) - 10;
    			if(rap.rcmMode == 1){
    				if(rap.status == 'alive'){
        				rap.marker = '<p id="'+rap.id+'" class="icon-rap-'+network+'-master" network="'+network+'" name="marker" title="'+euid+'" localX="'+x+'" localY="'+y+'" style="top:'+y+'px; left : '+x+'px"></p>';
    				}else{
    					rap.marker = '<p id="'+rap.id+'" class="icon-rap-'+network+'-dead" network="'+network+'" name="marker" title="'+euid+'" localX="'+y+'" localY="'+y+'" style="top:'+y+'px; left : '+x+'px"></p>';
    				}
    			}else{
    				if(rap.status == 'alive'){
    					rap.marker = '<p id="'+rap.id+'" class="icon-rap-'+network+'-slave" network="'+network+'" name="marker" title="'+euid+'" localX="'+y+'" localY="'+y+'" style="top:'+y+'px; left : '+x+'px"></p>';	
    				}else{
    					rap.marker = '<p id="'+rap.id+'" class="icon-rap-'+network+'-dead" network="'+network+'" name="marker" title="'+euid+'" localX="'+y+'" localY="'+y+'" style="top:'+y+'px; left : '+x+'px"></p>';
    				}
    				
    			}
    			Panel.$raps[i] = rap;
    			Map.marker.add(rap);
    		}
    		Panel.$isInit = true;
		},
		addComponents : function(sbmId){ // 3DMAP init by Call function
			Panel.$sbmId  = sbmId;
			Panel.$raps = Panel.get.raps();
			var item ={};
			for(var i=0; i < Panel.$raps.length; i++){
				item = Panel.$raps[i];
				Unity.addComponent(Panel.$sbmId, Panel.$componentId, 'RAP'+item.rapId, Panel.util.carcPxTo3DMeter(item.localX), Panel.util.carcPxTo3DMeter(item.localZ), -(Panel.util.carcPxTo3DMeter(item.localY)), 0, 0, 0, 5, 5, 5);
			}
			Panel.$isInit = true;
		},
		
	},
	util : {
		carcPxToMeter : function(px){
			var m = (px * Panel.$plan.meter);
			return m.toFixed(2);
		},
		carcMeterToPx : function(m){
			var p = (m * Panel.$plan.pixels);
			return p.toFixed(2);
		},
		carcMeterTo3DMeter : function(m){
			m = m * 100;
			return m.toFixed(2);
		},
		carcPxTo3DMeter : function(px){
			var m = (px * Panel.$plan.meter) * 100;
			return m.toFixed(2);
		},
		hexToRgbColor : function(hex) {
		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		    return result ? {
		        r: parseInt(result[1], 16),
		        g: parseInt(result[2], 16),
		        b: parseInt(result[3], 16)
		    } : null;
		},
		rgbToHexColor : function(r, g, b) {
		    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
		},
		componentToHex : function(c) {
		    var hex = c.toString(16);
		    return hex.length == 1 ? "0" + hex : hex;
		}

	}
};


