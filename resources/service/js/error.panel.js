
var Error = {
	$isAutoScroll : false,
	$tag : {},
	$plans : new HashMap(),  $tags : new HashMap(), $raps : new HashMap(),
	$worker : null, $console : null,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[2].title+'</span><span class="bg">'+$.rtls.menu[2].sub[3]+'</span>');
		$('#buttons').html(	
			"<button id='but_tag'>"+$.rtls.error.button.filter+"</button>"+
			"<button id='but_autoscroll'>"+$.rtls.error.button.scroll+"</button>"+
			"<button id='but_clear'>"+$.rtls.error.button.clear+"</button>"
		);
		$("#but_select").button({
			icons: {primary: "ui-icon-tag"}
		}).click(function() {
			Error.showPermission();
			return false;
		});
		$("#but_tag").button({
			icons: {primary: "ui-icon-tag"}
		}).click(function() {
			Error.filterTag();
			return false;
		});
		$("#but_autoscroll").button({
			icons: {primary: "ui-icon ui-icon-arrowthick-2-n-s"}
		}).click(function() {
			if(Error.$isAutoScroll){
				Error.$isAutoScroll = false;
			}else{
				Error.$isAutoScroll = true;
			}
			$(this).button("option", { 
		        icons: { primary: Error.$isAutoScroll ? 'ui-icon-arrowthickstop-1-s' : 'ui-icon ui-icon-arrowthick-2-n-s' }
		    });
			return false;
		});
		$("#but_clear").button({
			icons: {primary: "ui-icon-trash"}
		}).click(function() {
			Error.$console.html('');
			return false;
		});
		
		Error.getPlans();
		Error.getRaps();
		Error.getTags();
    	Error.initConsole();
    	Error.initWorker();
		Error.initNotify();
	},
	initNotify : function(){
		var sock = new SockJS('/rtls/sockjs');
		var client = Stomp.over(sock);
		client.debug = null;
		client.connect({}, function(frame) {
			client.subscribe("/queue/error", function(message) {
				var data  = $.parseJSON(message.body);
				if(data.eventType == '5'){
					Error.$worker.postMessage(data);	
				}
			});
		});
		sock.onclose = function(event) {
			
		};
		$(window).bind('beforeunload',function(){
			if(client != null){
				client.disconnect();
			}
		});
	},
	initConsole : function(){
		Error.$console = $('#error-logs');
		Error.$console.css('height', $(window).height()-170);
		Error.$console.on("DOMSubtreeModified", function() { 
			var elem = $("#error-logs");
			if(elem.children('p').size() > 50000){
				elem.children("p:first").remove();
			}
			if (elem[0].scrollHeight > elem.outerHeight() && Error.$isAutoScroll) {
				Error.$console.animate({scrollTop : elem[0].scrollHeight}, 10);
	        }
		});
	},
	initWorker : function(tagEuid){
		
		this.$worker = new Worker('/resources/commons/js/idolink/ido.worker.js');
		this.$worker.onmessage = function(e){
			var data = e.data;
			if(Error._tag == null || Error._tag.euid == '0000000000000000' || Error._tag.euid == data.euid){
				var debug = '';
				var debugflag = '';
				var plan = Error.$plans.get(data.planId);
				if(plan != null){
					var euid = data.euid.substring(data.euid.length-6, data.euid.length);
					var time = parseInt(data.addTime);
					debug += "["+Error.getLogTime(time)+"]  ";
//新增功能
					debugflag = debug;
					var num = $("#contents div>table>tbody>tr td:nth-child(4) span").length;
					var flag = [ false , false , false , false ];
					if(num>0){
						for(var i=0; i<num; i++){
							if($("#contents div>table>tbody>tr td:nth-child(4) input").eq(i).prop("checked")==true){
								flag[i]=true;
							}
						}
					}
					
					if(data.errorType == '1' && flag[0]==true){
						debug += "基站故障报警 ";
					}
					if(data.errorType == '2' && flag[1]==true){
						debug += "标签低电报警 ";
					}
					if(data.errorType == '3' && flag[2]==true){
						debug += data.errorMessage+" ";
					}
					if(data.errorType == '4' && flag[3]==true){
						debug += "围栏越界报警  越界区域："+data.zoneName;
					}
					if(debugflag==debug){
						return;
					}
					for(var i=0; i<num; i++){
						if(flag[i]==true){
							debug += ", EUID = "+euid+", "+$.rtls.error.form.point+" = "+plan.name;
							if(data.errorLevel == 'critical'){
								Error.$console.append('<p style="color:#FF0000">'+debug+'</p>');	
							}else if(data.errorLevel == 'major'){
								Error.$console.append('<p style="color:#ff6600">'+debug+'</p>');	
							}else if(data.errorLevel == 'minor'){
								Error.$console.append('<p style="color:#ffff00">'+debug+'</p>');	
							}
							break;
						}
						
					}
						
				}
				
			}
			
			
		};
		this.$worker.addEventListener('message', function(e){
			
		});
		
	},
	getPlans : function(){
		$.ajax({
			async : false,
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
            	for(var i=0; i < data.plans.length; i++){
        			Error.$plans.put(data.plans[i].planId, data.plans[i]);
        		}
				
			}
		});
	},
	getRaps : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/rap.json?action=get.raps",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	for(var i=0; i < data.raps.length; i++){
        			Error.$raps.put(data.raps[i].euid, data.raps[i]);
        		}
			}
		});
	},
	showPermission : function(){
		$("#dialog-tag").dialog({
			title:"选择报警权限",
			autoOpen: false,
			height: 400,
			width: 800,
			modal: true,
			buttons: [{
				text : $.rtls.commons.button.ok,
				click: function() {
					/*var num = $("#permission-selectable li").length;
					for(var i=0; i<num; i++){
						if($("#permission-selectable li").eq(i).children("input").prop("checked")==true){
							Error.$console.append('<p style="color:#FF0000">'+$("#permission-selectable li").eq(i).children("span").text()+'</p>');
						}
					}*/
					$("#dialog-tag").dialog( "close" );
				},
			},{
				text : $.rtls.commons.button.cancel,
				click: function() {
					$( this ).dialog( "close" );
				}
			}],
			open: function() {
				var html = "<ol id='permission-selectable' class='ui-selectable'>";
				html += "<li class='ui-widget-content' style='width:140px'><input type='checkbox' unchecked><span>基站故障报警</span></li>";
				html += "<li class='ui-widget-content' style='width:140px'><input type='checkbox' unchecked><span>标签低电报警</span></li>";
				html += "<li class='ui-widget-content' style='width:140px'><input type='checkbox' unchecked><span>标签丢失报警</span></li>";
				html += "<li class='ui-widget-content' style='width:140px'><input type='checkbox' unchecked><span>围栏越界报警</span></li>";
				html += "</ol>";
				$(this).html(html);
			},
			close: function() {
				$("#dialog-tag").empty();
			}
		});
		$( "#dialog-tag" ).dialog( "open" );
	},
	getTags : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/tag.json?action=get.issued.tags",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
				for(var i=0; i < data.tags.length; i++){
        			Error.$tags.put(data.tags[i].euid, data.tags[i]);
        		}
			}
		});
	},
	getLogTime : function(milliseconds){
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
	filterTag : function(){
		$("#dialog-tag").dialog({
			title:$.rtls.error.dialog.title[0],
			autoOpen: false,
			height: 400,
			width: 800,
			modal: true,
			buttons: [{
				text : $.rtls.commons.button.ok,
				click: function() {
					if(Error.$tag != null){
						Error.$console.html('');
						$("#dialog-tag").dialog( "close" );
					}else{
						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.error.message.tagselect);
					}
					
				},
			},{
				text : $.rtls.commons.button.cancel,
				click: function() {
					$( this ).dialog( "close" );
				}
			}],
			open: function() {
				var html = "<ol id='plan-selectable' class='ui-selectable'>";
				html += "<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+$.rtls.error.form.full+"</li>";
				var tags = Error.$tags.keys();
				for(var i=0; i < tags.length; i++){
					if(Error.$tags.get(tags[i]).type == 1){
						html += "<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+tags[i]+"</li>";	
					}else{
						html += "<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_move.png' style='float:left; padding-right:3px'/>"+tags[i]+"</li>";
					}
					
				}	
				html += "</ol>";
				$(this).html(html);
				$("#plan-selectable", this).selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							var ix = $( "#plan-selectable li" ).index( this );
							var text = $(this).text();
							if(ix == 0){
								Error.$tag = {euid : '0000000000000000'};
							}else{
								Error.$tag = Error.$tags.get(text);
							}
						});		
					}
				});
			},
			close: function() {
				$("#dialog-tag").empty();
			}
		});
		$( "#dialog-tag" ).dialog( "open" );
	}
	
};