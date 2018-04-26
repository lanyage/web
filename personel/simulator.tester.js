var Simulator = {
	_plan : null,  _tags : new HashMap(),
	_moveQueue : [], _moveNode : {}, _moveCount : 0, _isAnimate : false,
	_worker : null, _console : null,
	_paper : null, _path : null, _targetPath:null, _node : null, _targetNode : null,
	_isInit : false, _type : 0, _startDay : null, _endDay : null, _startTime : null, _endTime : null, _euid : null,
	_textOptions : {'font-size':'11px', 'fill':'#000000', 'font-weight':'nolmal'},
	_edges : [], _vertexs : [], _walls : [],
	_startPoint : {x :0, y :0},_targetPoint : {x :0, y :0},
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
				if(window.parent.Position != undefined && window.parent.Position != null) window.parent.Position.windowClose(Simulator._plan.planId);
	        }
	        
	    });
		$("#dialog-message").append($.rtls.simulator.message.disconnected);
		$('#dialog-message').dialog('open');
	},
	getTags : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/admins/tag.action?pages=get.use.tags",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Simulator._plan.planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
				for(var i=0; i < data.length; i++){
					Simulator._tags.put(data[i].euid, data[i]);
        		}
				Simulator._isInit = true;
            	
			}
		});
	},
	getMovements : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/admins/simulator.action?pages=get.map.movement.vertex",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Simulator._plan.planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
				Simulator._vertexs = data;
				var item = {};
				var html = "<ol id='item-selectable'>";	
				for(var i=0; i < Simulator._vertexs.length; i++){
					item = Simulator._vertexs[i];
					html += "<li class='ui-widget-content' id='"+i+"'>"+(i+1)+".("+item.x+", "+item.y+")</li>";
				}
				html += "</ol>";
				$('#map-items').html(html);
				$("#item-selectable", "#map-items").selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							Simulator.makeVertex($( "#item-selectable li" ).index( this ));
							
						});		
					}
				});
			}
		});
	},
	start : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/admins/simulator.action?pages=start.simulator",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Simulator._plan.planId,
            	"type" : Simulator._type,
            	"startDay" : Simulator._startDay,
            	"endDay" : Simulator._endDay,
            	"startTime" : Simulator._startTime,
            	"endTime" : Simulator._endTime,
            	"euid" : Simulator._euid
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		Map.removeSvg('target_path');
            		Map.removeSvg('target_node');
            		Map.removeSvg('src_node');
            		Simulator._moveQueue = [];
            		Simulator._moveNode = null;
            		Simulator._moveCount = 0;
            		Simulator._node = null; 
            		Simulator.clearConsole();
            		$('#but_startstop').html("<button type='button' onclick='Simulator.stop()'><img src='/commons/images/grid/close.png'/>"+$.rtls.simulator.button.simulatoroff+"</button>");
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
			url: "/admins/simulator.action?pages=stop.simulator",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"euid" : Simulator._euid
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
            		if(window.parent.Position != undefined && window.parent.Position != null) window.parent.Position.windowClose(Simulator._plan.planId);
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
	clearConsole : function(){
		Simulator._console.html('');
	},
	autoConsoleScroll : function(){
		if(Simulator._isAutoScroll){
			Simulator._isAutoScroll = false;
			$('#but_autoscroll').html('<button type="button" onclick="Simulator.autoConsoleScroll()"><img src="/commons/images/grid/icon_off.gif"/>'+$.rtls.simulator.button.scroll+'</button>');
		}else{
			Simulator._isAutoScroll = true;
			$('#but_autoscroll').html('<button type="button" onclick="Simulator.autoConsoleScroll()"><img src="/commons/images/grid/icon_on.gif"/>'+$.rtls.simulator.button.scroll+'</button>');
		}
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
		if(Simulator._isInit){
			var alarm  = $.parseJSON(data);
			if(alarm.planId == Simulator._plan.planId){
				if(alarm.eventType == '20'){
					if(alarm.algorithm == '1'){
						Simulator._worker.postMessage(data);
					}else{
						Simulator._worker.postMessage(data);	
					}
				}else if(alarm.eventType == '100'){ //종료
					$('#but_startstop').html('<button type="button" onclick="Simulator.start()"><img src="/commons/images/grid/next.gif"/>'+$.rtls.simulator.button.simulatoron+'</button>');
				}
			}
		}
		
	},
	init : function(planId, type, startDay, endDay, startTime, endTime, euid){
		Simulator._type = type;
		Simulator._startDay = startDay;
		Simulator._endDay = endDay;
		Simulator._startTime = startTime;
		Simulator._endTime = endTime;
		Simulator._euid = euid;
		
		$.ajax({
			async : true,
			type: 'GET',
			url: "/admins/plan.action?pages=get.plan",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Simulator._plan = data;
            	$("#viewport").css("width", Simulator._plan.width+"px");
            	Simulator.initConsole();
            	Simulator.initWorker();
        		Map.init(Simulator._plan, 
        				{isRuler : true, isGrid : true, isTool : true, isTag : true},
        				{isPointer : true, isSelector : false, isDistance : true, isMove : false, isGrid : true, isRuler : true},
        				true, Simulator);
        		window.setTimeout(function(){
        			Simulator._paper = Map.getPaper();
        			Simulator.getTags();
        			Simulator.getMovements();
        		}, 1000);
        		$( window ).resize(function() {
        			$("#viewport").css("width", Simulator._plan.width+"px");
        			Simulator._console.css('width', ($(window).width()-parseInt(Simulator._plan.width)-5)+'px');
        			Simulator._console.css('height', $(window).height()-20);
        			
        		});
			}
		});
	},
	initConsole : function(){
		Simulator._console = $('#map-logs');
		Simulator._console.css('height', "200px");
		Simulator._console.live("DOMSubtreeModified", function() { 
			var elem = $("#map-logs");
			if (elem[0].scrollHeight > elem.outerHeight() && Simulator._isAutoScroll) {
	        	Simulator._console.animate({scrollTop : elem[0].scrollHeight}, 100);
	        }
		});
	},
	initWorker : function(){
		this._worker = new Worker('/admin/js/worker.js'),
		this._worker.onmessage = function(e){
			var data = $.parseJSON(e.data);
			if(Simulator._euid == data.tagEuid){
				var euid = data.tagEuid.substring(data.tagEuid.length-2, data.tagEuid.length);
				var x = Math.round(data.localX);
				var y = Math.round(data.localY);
				var time = parseInt(data.addTime);
				var delayTime = parseInt(data.delayTime);
				var movePath =  data.movePath;
				var distance = parseFloat(data.distance);
				
				var srcnode = Simulator._paper.circle(x, y, 4).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": data.color, "fill-opacity" : 0.3 });
				srcnode.node.id = 'src_node';
				var debug = Simulator.getLogTime(time)+" ["+euid+"] seq="+data.tagSeq+" ("+x+","+y+")";
				if(Simulator._node != null){
					Simulator._moveQueue.push({
						'seq' : data.tagSeq,
	    				'x' : x,
						'y' : y,
						'color' : data.color, 
						'isInit' : true, 
						'delayTime' : delayTime,
						'distance' : distance,
						'moveTime' : parseInt(delayTime/movePath.length) - 150,
						'movePath' : movePath
					});
					Simulator.moveAnimateNode();
				}else{
					debug += " <<Initialization>>";
					Simulator._node = Simulator._paper.circle(x, y, 10).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": data.color, "fill-opacity" : 1 });
					Simulator._node.node.id = "target_node";
				}
				
				debug += " distance="+distance+"m, ("+delayTime+" ms) ["+data.zoneName+"]";
				if(distance > 2){
					Simulator._console.append('<p style="color:red">'+debug+'</p>');	
				}else if(delayTime > 2000){
					Simulator._console.append('<p style="color:blue">'+debug+'</p>');
				}else{
					Simulator._console.append('<p>'+debug+'</p>');
				}
			}
			
		};
		
	},
	moveAnimateNode : function(){
		if(!Simulator._isAnimate && Simulator._moveQueue.length > 0){
			var node = Simulator._moveQueue.shift();
			Map.removeSvg('target_path');
			var tpath = "";
			for(var i=0; i < node.movePath.length; i++){
				if(i==0){
					tpath += "M"+ node.movePath[i].x+" "+ node.movePath[i].y;
				}else{
					tpath += "L"+ node.movePath[i].x+" "+ node.movePath[i].y;
				}
			}
			Simulator._targetPath = Simulator._paper.path(tpath);
			Simulator._targetPath.attr ("stroke-width", 1);
			Simulator._targetPath.attr ("stroke", '#FF0000');
			Simulator._targetPath.node.id = 'target_path';
			
			Simulator._moveNode = node;
			if(node.isInit == true){
				Map.removeSvg('target_node');
				Simulator._node = Simulator._paper.circle(Simulator._moveNode.x, Simulator._moveNode.y, 10).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": Simulator._moveNode.color, "fill-opacity" : 1 });
				Simulator._node.node.id = "target_node";
				Simulator._moveCount = 0;
				Simulator._isAnimate = false;
				Simulator.moveAnimateNode();
			}else{
				Simulator._isAnimate = true;
				Simulator.animateNode();
			}
			
		}
	},
	animateNode : function(){
		Simulator._moveCount++;
		if(Simulator._moveCount < Simulator._moveNode.movePath.length){
			Simulator._isAnimate = true;
			var point = Simulator._moveNode.movePath[Simulator._moveCount];
			Simulator._node.animate({cx : point.x, cy : point.y}, Simulator._moveNode.moveTime, function () {
				Simulator.animateNode();
			});
		}else{
			Simulator._isAnimate = false;
			Simulator._moveCount = 0;
			Simulator.moveAnimateNode();	
		}
	},
	makeVertex : function(ix){
		Map.initCanvas();
		var vertex = Simulator._vertexs[ix];
		Simulator._paper.circle(vertex.x, vertex.y, 2).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": "#FF0000", "fill-opacity" : 1 });
		Map.drawText(vertex.x,  vertex.y + 20, "0", "text", Simulator._textOptions);	
		var edge = {}, path = 'M'+vertex.x+' '+vertex.y;
		for(var i=0; i < vertex.edges.length; i++){
			edge = vertex.edges[i];
			path = 'M'+vertex.x+' '+vertex.y+'L'+edge.x+' '+edge.y;
			Simulator._paper.circle(edge.x, edge.y, 2).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": "#00FF00", "fill-opacity" : 1 });
			Map.drawLine(path, 1, "0000FF", "line", "line");
			Map.drawText(edge.x,  edge.y + 20, (i+1)+"."+edge.weight, "text", Simulator._textOptions);	
		}
		
		
	},
	makeMovement : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/admins/simulator.action?pages=get.map.movement.path",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Simulator._plan.planId,
            	"startX" : Simulator._startPoint.x,
            	"startY" : Simulator._startPoint.y,
            	"targetX" : Simulator._targetPoint.x,
            	"targetY" : Simulator._targetPoint.y,
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Map.initCanvas();
        		var item = {}, path = '';
        		path = 'M'+Simulator._startPoint.x+' '+Simulator._startPoint.y;
            	for(var i=0; i < data.length;i++){
            		item = data[i];
            		if(i == 0){
            			path = 'M'+item.x+' '+item.y;
            		}else{
            			path += 'L'+item.x+' '+item.y;	
            		}
            		
        			//Simulator._paper.circle(item.x, item.y, 2).attr({ "stroke": "#000000", "stroke-width": 1, "stroke-opacity": 0.5, "fill": "#00FF00", "fill-opacity" : 1 });
            		Map.drawCircle(item.x,  item.y, 3, "#FF0000", "dcircle");
        			Map.drawText(item.x,  item.y + 10, (i+1)+'', "dtext", Simulator._textOptions);	
            	}
            	//path += 'L'+Simulator._targetPoint.x+' '+Simulator._targetPoint.y+'';
            	Map.drawLine(path, 1, "#0000FF", "line", "dline");
            	Simulator._console.append('<p>'+path+'</p>');
			}
		});
	},
	setPoint : function(sx, sy, tx, ty){
		$('#startPoint').val(sx+', '+sy);
		$('#targetPoint').val(tx+', '+ty);
		this._startPoint.x = sx;
		this._startPoint.y = sy;
		this._targetPoint.x = tx;
		this._targetPoint.y = ty;
	}
	
};