
var Simulator = {
	$plan : null,  $tags : new HashMap(),
	$moveQueue : [], $moveNode : {}, $moveCount : 0, $isAnimate : false,
	$worker : null, $console : null, $isAutoScroll : false, $isPause : false, $isStart : true,
	$paper : null, $path : null, $targetPath:null, $node : null, $targetNode : null,
	$isInit : false, $algorithm : 0, $startDay : null, $endDay : null, $startTime : null, $endTime : null, $euid : null,
	$textOptions : {'font-size':'11px', 'fill':'#000000', 'font-weight':'nolmal'},
	$logs : [], $map : null,
	close : function(){
		$("#dialog-message").dialog({
			title : $.rtls.simulator.dialog.title[0],
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
				if(window.parent.Position != undefined && window.parent.Position != null) window.parent.Position.windowClose(Simulator.$plan.planId);
	        }
	        
	    });
		$("#dialog-message").append($.rtls.simulator.message.disconnected);
		$('#dialog-message').dialog('open');
	},
	getTags : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/tag.json?action=get.issued.tags",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Simulator.$plan.planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
				for(var i=0; i < data.length; i++){
					Simulator.$tags.put(data[i].euid, data[i]);
        		}
				Simulator.$isInit = true;
            	Simulator.start();
			}
		});
	},
	start : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/simulator.json?action=start.simulator",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Simulator.$plan.planId,
            	"algorithm" : Simulator.$algorithm,
            	"startDay" : Simulator.$startDay,
            	"endDay" : Simulator.$endDay,
            	"startTime" : Simulator.$startTime,
            	"endTime" : Simulator.$endTime,
            	"euid" : Simulator.$euid
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		Simulator.$map.remove('target_path');
            		Simulator.$map.remove('target_node');
            		Simulator.$map.remove('src_node');
            		Simulator.$moveQueue = [];
            		Simulator.$moveNode = null;
            		Simulator.$moveCount = 0;
            		Simulator.$node = null; 
            		Simulator.clearConsole();
            		Simulator.$isStart = true;
            		$("#but_startstop").button("option", { 
        		        icons: { primary: Simulator.$isStart ? 'ui-icon-stop' : 'ui-icon-play' },
        		        label : $.rtls.simulator.button.simulatoroff 
        		    });
            	}else if(data.result == 'error.already.start'){
            		$("#dialog-message").dialog({
	        			title:$.rtls.commons.dialog.title.ok,
	        			autoOpen: false,
	        			height: 200,
	        			width: 400,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					$( this ).dialog( "close" );
	        					
	        				}
	        			}],
	        			open: function() {
	        				var html = $.rtls.simulator.message.alreadyon;
							$(this).html(html);
	        			},
	        			close: function() {
	        				$("#dialog-message").empty();
	        			}
	        		});
	        		$( "#dialog-message" ).dialog( "open" );
            	}
				
			}
		});
	},
	stop : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/simulator.json?action=stop.simulator",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"euid" : Simulator.$euid
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		if(window.parent.Position != undefined && window.parent.Position != null) window.parent.Position.windowClose(Simulator.$plan.planId);
            	}else if(data.result == 'error.already.stop'){
            		$("#dialog-message").dialog({
	        			title:$.rtls.commons.dialog.title.ok,
	        			autoOpen: false,
	        			height: 200,
	        			width: 400,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					$( this ).dialog( "close" );
	        					
	        				}
	        			}],
	        			open: function() {
	        				var html = $.rtls.simulator.message.alreadyoff;
							$(this).html(html);
	        			},
	        			close: function() {
	        				$("#dialog-message").empty();
	        			}
	        		});
	        		$( "#dialog-message" ).dialog( "open" );
            	}
				
			}
		});
	},
	pause : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/simulator.json?action=pause.simulator",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"euid" : Simulator.$euid
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		if(data.isPause == "true"){
            			Simulator.$isPause = true;
            			$("#log-items").selectable({
                			stop: function() {
                				$("#log-items li").css('background-color', '#FFFFFF');
                				$(".ui-selected", this ).each(function() {
                					Simulator.$map.remove("dline");
                					Simulator.$map.remove("dcircle");
                					Simulator.$map.remove("dtext");
                					
                					var ix = $( "#log-items li" ).index( this );
                					$(this).css('background-color', '#00FF00');
                					
                					var log = Simulator.$logs[ix];
                					if(log != null && log != undefined){
                						var item = {}, path = '';
                    					path = 'M'+log.x+' '+log.y;
                    	            	for(var i=0; i < log.movePath.length;i++){
                    	            		item = log.movePath[i];
                    	            		path += 'L'+item.x+' '+item.y;	
                    	            		Simulator.$map.draw.circle(item.x,  item.y, 3, "#00FF00", "dcircle");
                    	            		Simulator.$map.draw.text(item.x,  item.y + 10, (i+1)+'', "dtext", Simulator.$textOptions);	
                    	            	}
                    	            	//path += 'L'+Simulator._targetPoint.x+' '+Simulator._targetPoint.y+'';
                    	            	Simulator.$map.draw.line(path, 1, "#0000FF", "line", "dline");	
                					}
                					
                				});		
                			}
                		});
            		}else{
            			$("#log-items").selectable("destroy");
            			Simulator.$isPause = false;
            		}
            		
            	}else if(data.result == 'error.already.stop'){
            		$("#dialog-message").dialog({
	        			title:$.rtls.commons.dialog.title.ok,
	        			autoOpen: false,
	        			height: 200,
	        			width: 400,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					$( this ).dialog( "close" );
	        					
	        				}
	        			}],
	        			open: function() {
	        				var html = $.rtls.simulator.message.alreadyoff;
							$(this).html(html);
	        			},
	        			close: function() {
	        				$("#dialog-message").empty();
	        			}
	        		});
	        		$( "#dialog-message" ).dialog( "open" );
            	}
				
			}
		});
	},
	initConsole : function(){
		Simulator.$console = $('#map-logs');
		Simulator.$console.css('min-width', '500px');
		Simulator.$console.css('height', $(window).height()-20);
		Simulator.$console.on("DOMSubtreeModified", function() { 
			var elem = $("#map-logs");
			if (elem[0].scrollHeight > elem.outerHeight() && Simulator.$isAutoScroll) {
	        	Simulator.$console.animate({scrollTop : elem[0].scrollHeight}, 100);
	        }
		});
		
	},
	clearConsole : function(){
		$('#log-items').html('');
		this.$logs = [];
	},
	appendConsole : function(euid, seq, x, y, distance, time, delayTime, zoneName, movePath, status, tagColor, errorCase){
		var color = "", bgcolor = "", statusChar;
		if(status == 1){
			color = "#000000";
			bgcolor = "#00FF00";
			statusChar = "I"
		}else if(status == 2){
			color = "#000000";
			bgcolor = "#FF5500";
			statusChar = "D"
		}else{
			color = "#000000";
			bgcolor = "#FFFFFF";
			statusChar = "N"
		}
		var html = '<li style="background-color:#FFFFFF;color:#000000;">';
		html += '<table class="console_table">';
		html += '<tr>';
		html += '	<td style="width:20px;background-color:'+bgcolor+';color:'+color+';">'+statusChar+'</td>';
		html += '	<td style="width:80px">'+Simulator.getLogTime(time)+'</td>';
		html += '	<td style="width:35px;color:'+tagColor+';">'+euid+'</td>';
		html += '	<td style="width:30px">'+seq+'</td>';
		html += '	<td style="width:120px">'+Simulator.$map.carc.pxToMeter(x)+'m x '+Simulator.$map.carc.pxToMeter(y)+'m</td>';
		html += '	<td style="width:45px">'+distance.toFixed(2)+'m</td>';
		html += '	<td style="width:50px">'+delayTime+'ms</td>';
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
		$('#log-items').append(html);
		Simulator.$logs.push({euid : euid, seq : seq, x : x, y : y, distance : distance, time : time, delayTime : delayTime, zoneName : zoneName, movePath : movePath, status : status});
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
		return h+":"+m+":"+s+":"+ms;
	},
	addAlarm : function(data){
		if(Simulator.$isInit){
			var alarm  = $.parseJSON(data);
			if(alarm.planId == Simulator.$plan.planId){
				if(alarm.eventType == '20'){
					if(alarm.algorithm == '1'){
						Simulator.$worker.postMessage(data);
					}else{
						Simulator.$worker.postMessage(data);	
					}
				}else if(alarm.eventType == '100'){ //종료
					Simulator.$isStart = false;
					$("#but_startstop").button("option", { 
        		        icons: { primary: Simulator.$isStart ? 'ui-icon-stop' : 'ui-icon-play' },
        		        label : $.rtls.simulator.button.simulatoron
        		    });
					
				}
			}
		}
		
	},
	init : function(planId, algorithm, startDay, endDay, startTime, endTime, euid){
		$('#buttons').html(
				'<button id="but_autoscroll">'+$.rtls.simulator.button.scroll+'</button>'+
				'<button id="but_clear">'+$.rtls.simulator.button.clear+'</button>'+
				'<button id="but_pause">'+$.rtls.simulator.button.simulatorpause+'</button>'+
				'<button id="but_startstop">'+$.rtls.simulator.button.simulatoroff+'</button>'
		);
		Simulator.$algorithm = algorithm;
		Simulator.$startDay = startDay;
		Simulator.$endDay = endDay;
		Simulator.$startTime = startTime;
		Simulator.$endTime = endTime;
		Simulator.$euid = euid;
		$("#but_autoscroll").button({
			icons: {primary: "ui-icon ui-icon-arrowthick-2-n-s"}
		}).click(function() {
			if(Simulator.$isAutoScroll){
				Simulator.$isAutoScroll = false;
			}else{
				Simulator.$isAutoScroll = true;
			}
			$(this).button("option", { 
		        icons: { primary: Simulator.$isAutoScroll ? 'ui-icon-arrowthickstop-1-s' : 'ui-icon ui-icon-arrowthick-2-n-s' }
		    });
			return false;
		});
		$("#but_clear").button({
			icons: {primary: "ui-icon-trash"}
		}).click(function() {
			Simulator.clearConsole();
			return false;
		});
		$("#but_pause").button({
			icons: {primary: "ui-icon-pause"}
		}).click(function() {
			Simulator.pause();
			return false;
		});
		$("#but_startstop").button({
			icons: {primary: "ui-icon-stop"}
		}).click(function() {
			if(Simulator.$isStart){
				Simulator.stop();	
			}else{
				Simulator.start();
			}
			
			return false;
		});
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/plan.json?action=get.plan",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Simulator.$plan = data.plan;
            	$("#viewport").css("width", Simulator.$plan.width+"px");
            	Simulator.initConsole();
            	Simulator.initWorker();
            	Simulator.$map = new Map({
        			plan : Simulator.$plan, 
        			view : {isRuler : true, isGrid : true, isTool : false},
        			tool : {isPointer : true, isDistance : true, isGrid : true, isRuler : false},
        			isEvent : false,
        			target : this
        		});
            	
        		Simulator.$paper = Simulator.$map.canvas;
        		Simulator.getTags();
        		
        		$( window ).resize(function() {
        			$("#viewport").css("width", Simulator.$plan.width+"px");
        			Simulator.$console.css('min-height', $(window).height()-20);
        			
        		});
			}
		});
	},
	initWorker : function(){
		this.$worker = new Worker('/resources/commons/js/idolink/ido.worker.js'),
		this.$worker.onmessage = function(e){
			var data = $.parseJSON(e.data);
			if(Simulator.$euid == data.tagEuid){
				var euid = data.tagEuid.substring(data.tagEuid.length-4, data.tagEuid.length);
				var x = Math.round(data.localX);
				var y = Math.round(data.localY);
				var time = parseInt(data.addTime);
				var delayTime = parseInt(data.delayTime);
				var movePath =  data.movePath;
				var distance = parseFloat(data.distance);
				var moveTime =  parseInt(delayTime/movePath.length);
				var status = parseFloat(data.status);
				if(Simulator.$node != null){
					if(status == 0){
						var srcnode = Simulator.$paper.circle(x, y, 4).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": data.tagColor, "fill-opacity" : 0.3 });
						srcnode.node.id = 'src_node';
						
						Simulator.$moveQueue.push({
							'seq' : data.tagSeq, 
							'x' : x, 
							'y' : y,
							'color' : data.tagColor, 
							'isInit' : false,
							'delayTime' : delayTime, 
							'distance' : distance,
							'moveTime' : moveTime,
							'movePath' : movePath
						});
						
		    			Simulator.moveAnimateNode();
					}else if(status == 1){ // init
						var srcnode = Simulator.$paper.circle(x, y, 4).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": data.tagColor, "fill-opacity" : 0.3 });
						srcnode.node.id = 'src_node';
						
						Simulator.$moveQueue.push({
							'seq' : data.tagSeq,
		    				'x' : x,
							'y' : y,
							'color' : data.tagColor, 
							'isInit' : true, 
							'delayTime' : delayTime,
							'distance' : distance,
							'moveTime' : moveTime,
							'movePath' : movePath
						});
						Simulator.moveAnimateNode();
					}else{ // drop
						
					}
				}else{
					Simulator.$node = Simulator.$paper.circle(x, y, 8).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": data.tagColor, "fill-opacity" : 1 });
					Simulator.$node.node.id = "target_node";
				}
				
				Simulator.appendConsole(euid, data.tagSeq, x, y, distance, time, delayTime, data.zoneName, movePath, status, data.tagColor, data.errorCase);
			}
			
		};
		
	},
	moveAnimateNode : function(){
		if(!Simulator.$isAnimate && Simulator.$moveQueue.length > 0){
			var node = Simulator.$moveQueue.shift();
//			Simulator.$map.remove('target_path');
//			var tpath = "";
//			for(var i=0; i < node.movePath.length; i++){
//				if(i==0){
//					tpath += "M"+ node.movePath[i].x+" "+ node.movePath[i].y;
//				}else{
//					tpath += "L"+ node.movePath[i].x+" "+ node.movePath[i].y;
//				}
//			}
//			Simulator.$targetPath = Simulator.$paper.path(tpath);
//			Simulator.$targetPath.attr ("stroke-width", 1);
//			Simulator.$targetPath.attr ("stroke", '#FF0000');
//			Simulator.$targetPath.node.id = 'target_path';
			
			Simulator.$moveNode = node;
			if(node.isInit == true){
				Simulator.$map.remove('target_node');
				Simulator.$node = Simulator.$paper.circle(Simulator.$moveNode.x, Simulator.$moveNode.y, 8).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": Simulator.$moveNode.color, "fill-opacity" : 1 });
				Simulator.$node.node.id = "target_node";
				Simulator.$moveCount = 0;
				Simulator.$isAnimate = false;
				Simulator.moveAnimateNode();
			}else{
				Simulator.$isAnimate = true;
				Simulator.animateNode();
			}
			
		}
	},
	animateNode : function(){
		Simulator.$moveCount++;
		if(Simulator.$moveCount < Simulator.$moveNode.movePath.length){
			Simulator.$isAnimate = true;
			var point = Simulator.$moveNode.movePath[Simulator.$moveCount];
			Simulator.$node.animate({cx : point.x, cy : point.y}, 5, function () {
				Simulator.animateNode();
			});
		}else{
			Simulator.$isAnimate = false;
			Simulator.$moveCount = 0;
			Simulator.moveAnimateNode();	
		}
	}
	
};