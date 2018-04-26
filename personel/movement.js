var Movement = {
	$id : 'movement', $map : null,
	$plan : {}, $plans : [],
	$info : null, $connections : [],
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[1].title+'</span><span class="bg">'+$.rtls.menu[1].sub[2]+'</span>');
		$('.top_right').html('<button id="but-preview" class="button button-rounded button-small">'+$.rtls.movement.button.preview+'</button><button id="but-update" class="button button-rounded button-small">'+$.rtls.movement.button.update+'</button>');
		$("#but-preview").click(function() {
			Movement.preview();
			return false;
		});
		$("#but-update").click(function() {
			Movement.update();
			return false;
		});
		$(".top_right>button.button").hover(function(){
			$(".top_right>button.button").addClass("button-primary");
		},function(){
			$(".top_right>button.button").removeClass("button-primary");
		});
		this.getPlans();
		this.initNotify();
	},
	initCookie : function(){
		if(this.$plan.movementInfo != undefined && this.$plan.movementInfo != null){
			this.$info = $.parseJSON(this.$plan.movementInfo);
			var walls = this.$info.walls;
			var wall = {};
			for(var i=0; i < walls.length; i++){
				wall = walls[i];
				var path = '';
				var p = {}, w = null;
				for(var j=0; j < wall.points.length; j++){
					p = wall.points[j];
					path += p[0].toUpperCase()+p[1]+ ',' + p[2];
				}
				w = Movement.$map.draw.line(path, wall.width, '#0000ff', 'line', wall.id);
				Movement.wallEvent(w, i);
			}
			var movements = this.$info.movements;
			
			var movement = {};
			for(var i=0; i < movements.length; i++){
				movement = movements[i];
				var path = '';
				var p = {}, w = null;
				for(var j=0; j < movement.points.length; j++){
					p = movement.points[j];
					path += p[0].toUpperCase()+p[1]+ ' ' + p[2];	
					
				}
				w = Movement.$map.draw.line(path, 6, '#ff0000', 'line', movement.id);
				Movement.movementEvent(w, i);
			}
			
			
		}else{
			this.$info = {walls : [], movements : []};
		}
	},
	initNotify : function(){ 
		var sock = new SockJS('/rtls/sockjs', null, {debug : false, devel : false});
	  	var client = Stomp.over(sock);
	  	client.debug = null;
		client.connect({}, function(frame) {
	    	client.subscribe("/queue/movement", function(message) {
				var data  = $.parseJSON(message.body);
				if(data.eventType == '13'){
					var check = false;
					$('#dialog-confirm').children().each(function(){
						if($(this).attr('id') == 'progressbar'){
							check = true;
						}
						
					});
					var value = (parseInt(data.count) * 100) / parseInt(data.total);
					if(check){
						$("#progressbar").progressbar({value: value});
					}else{
						$('#dialog-confirm').html('<p><div id="progressbar"><div class="progress-label">Loading...</div></did></p></p>');
						$("#progressbar").progressbar({
							value: false,
							change: function() {
								$(".progress-label").text( parseFloat($("#progressbar").progressbar( "value" )).toFixed(2) + "%" );
							},
							complete: function() {
								$(".progress-label").text( "Complete!" );
							}
					    });
					}
				}
	    		
	    		
	    	});
	    });
	    sock.onclose = function(event) {
	    	Log.debug("Stomp.sock.closed");
	    	
	    };
	 	$(window).bind('beforeunload',function(){
	    	Log.debug("Stomp.window.beforeunload");
	    	if(client != null && client.connected){
	    		client.disconnect();
	    	}
	    	if(Movement.$plan != null) {
	    		$.removeCookie('walls_'+Movement.$plan.planId);
	    		$.removeCookie('movements_'+Movement.$plan.planId);
	    	}
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
            	$('#tab').find('ul').html('');
            	Movement.$plans = data.plans;
            	var item, html; 
            	for(var i=0; i < Movement.$plans.length; i++){
					item = Movement.$plans[i];
					html = "<li id='"+i+"' class='ui-state-default ui-corner-top' onmouseover='Movement.tabOver("+i+")' onmouseout='Movement.tabOut("+i+")'>" +
					"<a class='button button-uppercase button-primary' href=\"javascript:Movement.tabSelect("+i+")\">"+item.name+"</a>" +
					"</li>";
					$('#tab').find('ul').append(html);
				}
				Movement.tabSelect(0);
			}
		});
		
	},
	getSVGtoPNGBase64 : function(){ // SVN Covet PAG base64 string
		// load svg
		var svgString = Movement.$map.viewport.html();
		var svg = $(svgString);
		svg.children().each(function(){
			var id = $(this).attr('id')+'';
			if(id != undefined && (id == 'gline100' || id == 'gline50' || id.indexOf('wcircle') != -1 || id.indexOf('mcircle') != -1)){
				$(this).remove();
			}
//			else if(id != undefined && (id.indexOf('movement') != -1)){
//				$(this).attr('stroke-width', 1)
//			}
		});
		svg.attr('width', this.$plan.width).attr('height', this.$plan.height);
		
		// convert svg to png base64
		var canvas = document.createElement('canvas');
		canvas.id = "canvas";
		document.body.appendChild(canvas);
		canvas.width = Movement.$plan.width;
		canvas.height = Movement.$plan.height;
		canvg(canvas, svg.prop('outerHTML'));
	    var png = canvas.toDataURL( "image/png" );
		png = png.split(',')[1];
		$(canvas).remove();
		
		return png;
	},
	tabOver : function(index){
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == index){
		    	$(this).addClass('ui-state-hover');
		    }else{
		    	$(this).removeClass('ui-state-hover');
		    }
		});
		
	},
	tabOut : function(index){
		$('#tab').find('ul').find('li').each(function(i) {
	    	$(this).removeClass('ui-state-hover');
		});
		
	},
	tabSelect : function(index){
		this.$plan = this.$plans[index];
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == index){
		    	$(this).addClass('ui-tabs-selected');
		    	$(this).addClass('ui-state-active');
		    }else{
		    	$(this).removeClass('ui-state-active');
				$(this).removeClass('ui-tabs-selected');
		    }
		});
		this.$map = new Map({
			plan : this.$plan, 
			view : {isRuler : true, isGrid : true, isTool : true},
			tool : {isPointer : true, isDistance : true, isGrid : true, isRuler : false, isZone : false, isMovement : true},
			isEvent : true,
			target : this
		});
		this.initCookie();
	},
	wallEvent : function(wall, ix){ // Zone event handler
		wall.mouseover(function(e) {
			if(Movement.$map.tool.action == 'pointer'){
				wall.attr('cursor', 'pointer');
				wall.attr('stroke', '#FF0000');	
			}else{
				wall.attr('cursor', 'default');
			}
		}).mouseout(function(e) {
			if(Movement.$map.tool.action == 'pointer'){
				wall.attr('cursor', 'pointer');
				wall.attr('stroke', '#0000FF');
			}else{
				wall.attr('cursor', 'default');
			}
		}).mouseup(function(e) {
			if(Movement.$map.tool.action == 'pointer'){
				Movement.modWall(wall, ix);
			}
		}); 
		var paths = wall.attr('path');
		for(var i=0; i < paths.length; i++){
			var c = Movement.$map.draw.circle(paths[i][1], paths[i][2], 8, '#ff0000', 'wcircle_'+ix+'_'+i);
			c.node.id = 'wcircle_'+ix+'_'+i;
			Movement.edgeEvent(c, wall, paths, ix, i, '#00FF00', '#FF0000');
		}
	},
	movementEvent : function(movement, ix){ // Zone event handler
		movement.mouseover(function(e) {
			if(Movement.$map.tool.action == 'pointer'){
				movement.attr('cursor', 'pointer');
				movement.attr('stroke', '#00FF00');	
			}else{
				movement.attr('cursor', 'default');
			}
		}).mouseout(function(e) {
			if(Movement.$map.tool.action == 'pointer'){
				movement.attr('cursor', 'pointer');
				movement.attr('stroke', '#FF0000');
			}else{
				movement.attr('cursor', 'default');
			}
		}).mouseup(function(e) {
			if(Movement.$map.tool.action == 'pointer'){
				Movement.delMovement(movement, ix);
			}
		}); 
		var paths = movement.attr('path');
		for(var i=0; i < paths.length; i++){
			var c = Movement.$map.draw.circle(paths[i][1], paths[i][2], 8, '#00FF00', 'mcircle_'+ix+'_'+i);
			c.node.id = 'mcircle_'+ix+'_'+i;
			Movement.edgeEvent(c, movement, paths, ix, i, '#FF0000', '#00FF00');
		}
	},
	
	edgeEvent : function(edge, item, paths, itemIx, edgeIx, overColor, outColor){
		edge.mouseover(function(e) {
			if(Movement.$map.tool.action == 'pointer'){
				edge.attr('cursor', 'pointer');
				edge.attr('fill', overColor);	
			}else{
				edge.attr('cursor', 'default');
			}
		}).mouseout(function(e) {
			if(Movement.$map.tool.action == 'pointer'){
				edge.attr('cursor', 'pointer');
				edge.attr('fill', outColor);
			}else{
				edge.attr('cursor', 'default');
			}
		}).mouseup(function(e) {
			if(Movement.$map.tool.action == 'pointer'){
				
			}
		});
		var start = function () {
			 if($.map.tool.action == 'pointer'){
		         this.cx = this.attr("cx");
		         this.cy = this.attr("cy");
		         this.animate({r: 10, opacity: .7}, 500, ">");
			 }
		},
		move = function (dx, dy) {
			if($.map.tool.action == 'pointer'){
				var x = this.cx + dx, y = this.cy + dy;
				this.attr({cx: x, cy: y});
				paths[edgeIx][1] = x;
				paths[edgeIx][2] = y;
				item.attr({path : paths});
				if(item.node.id.indexOf('movement_') != -1){
					Movement.$info.movements[itemIx].points = paths;
				}else if(item.node.id.indexOf('wall_') != -1){
					Movement.$info.walls[itemIx].points = paths;
				}
			}
		},
		up = function () {
			if($.map.tool.action == 'pointer'){
				this.animate({r: 8, opacity: .5}, 500, ">");
			}
		};
		this.$map.canvas.set(edge).drag(move, start, up);
	},
	modWall  : function(wall, ix){
		$("#dialog-wall").dialog({
			title:$.rtls.movement.dialog.title[1],
			autoOpen: false,
			height: 210,
			width: 480,
			modal: false,
			buttons: [{
				text : $.rtls.commons.button.ok,
				click: function() {
					var walls = Movement.$info.walls;
					walls[ix].width = wall.attr('stroke-width');
					walls[ix].points = wall.attr('path');
					$( this ).dialog( "close" );
					return false;
				},
			},{
				text : $.rtls.commons.button.del,
				click: function() {
					Movement.delWall(wall, ix);
					$( this ).dialog( "close" );
					
				}
			},{
				text : $.rtls.commons.button.cancel,
				click: function() {
					$( this ).dialog( "close" );
				}
			}],
			open: function() {
				var html = '<fieldset id="fields" style="width:400px">';
				html += '<table>';
				html += '<tr>';
				html += '	<td style="vertical-align: top; width:100px; height:35px;"><label>* '+$.rtls.movement.form.lineBorder+'</label></td>';
				html += '	<td style="text-align:left;vertical-align: top;">';
				html += '   	<div id="slider-vertical" style="height:25px;width:180px;float:left"></div>';
				html += '   	<input type="text" id="border" value="1" style="border:0; color:#f6931f; font-weight:bold; width : 30px; text-align : center; float:left" readonly="true"/>';
				html += '   </td>';
				html += '</tr>';
				html += '<tr>';
				html += '	<td style="vertical-align: top; width:100px; height:100%"></td>';
				html += '	<td style="text-align:left;vertical-align: top;"></td>';
				html += '</tr>';
				html += '</table>';
				html += '</fieldset>';
				$(this).html(html);
				$( "#slider-vertical" ).slider({
					range: "min",
					min: 1,
					max: 100,
					step: 1,
					value: wall.attr("stroke-width"),
					slide: function( event, ui ) {
						$("#border" ).val(ui.value);
						wall.attr("stroke-width", ui.value);
					}
				});
				$('#fields #border').val(wall.attr("stroke-width"));
			},
			close: function() {
				Movement.$map.movement.wall = [];
				$("#dialog-wall").empty();
				$("#dialog-wall").html('');
			}
		});
		$( "#dialog-wall" ).dialog( "open" );
	},
	delWall  : function(wall, ix){
		var walls = Movement.$info.walls;
		for(var i=0; i < walls.length; i++){
			if(walls[i].id == wall.node.id){
				walls.removeIxs([i]);
				break;
			}
		}
		
		var paths = wall.attr('path');
		for(var i=0; i < paths.length; i++){
			Movement.$map.remove('wcircle_'+ix+'_'+i);
		}
		Movement.$map.remove(wall.node.id);
		
	},
	delMovement  : function(movement, ix){
		$("#dialog-movement").dialog({
			title:$.rtls.movement.dialog.title[3],
			autoOpen: false,
			height: 180,
			width: 500,
			modal: false,
			buttons: [{
				text : $.rtls.commons.button.del,
				click: function() {
					var movements = Movement.$info.movements;
					for(var i=0; i < movements.length; i++){
						if(movements[i].id == movement.node.id){
							movements.removeIxs([i]);
							break;
						}
					}
					var paths = movement.attr('path');
					for(var i=0; i < paths.length; i++){
						Movement.$map.remove('mcircle_'+ix+'_'+i);
					}
					Movement.$map.remove(movement.node.id);
					$( this ).dialog( "close" );
					
				}
			},{
				text : $.rtls.commons.button.cancel,
				click: function() {
					$( this ).dialog( "close" );
				}
			}],
			open: function() {
				var html = '<fieldset id="fields" style="width:400px">';
				html += $.rtls.movement.message.delconfirm;
				html += '</fieldset>';
				$(this).html(html);
			},
			close: function() {
				Movement.$map.movement.movement = [];
				$("#dialog-movement").empty();
				$("#dialog-movement").html('');
			}
		});
		$( "#dialog-movement" ).dialog( "open" );
	},
	preview : function(){
		$("#dialog-preview").dialog({
			title:$.rtls.movement.dialog.title[4],
			autoOpen: false,
			height:  Movement.$plan.height+60,
			width: Movement.$plan.width + 30,
			modal: false,
			buttons: [],
			open: function() {
				// load svg
				var svgString = Movement.$map.viewport.html();
				var svg = $(svgString);
				svg.children().each(function(){
					var id = $(this).attr('id')+'';
					if(id != undefined && (id == 'gline100' || id == 'gline50' || id.indexOf('wcircle') != -1 || id.indexOf('mcircle') != -1)){
						$(this).remove();
					}else if(id != undefined && (id.indexOf('movement') != -1)){
						//$(this).attr('stroke-width', 1)
					}
				});
				svg.attr('width', Movement.$plan.width).attr('height', Movement.$plan.height);
				//svg.prepend('<image x="0" y="0" width="'+Movement.$plan.width+'px" height="'+Movement.$plan.height+'px" xlink:href="/files/plan/map_'+Movement.$plan.planId+'.png"/>')
				//console.log(svg);
				
				var html = '<canvas id="preview" width="'+Movement.$plan.width+'px" height="'+Movement.$plan.height+'px">';
				html += '</canvas>';
				$(this).html(html);
				
				var canvas = document.getElementById('preview');
				var ctx = canvas.getContext('2d');
				
				var source = new Image();
				source.src = '/files/plan/map_'+Movement.$plan.planId+'.png';
				source.onload = function(){
					ctx.drawImage(source,0,0, Movement.$plan.width, Movement.$plan.height);
					
					var img = new Image();
				    img.onload = function() {
				    	ctx.drawImage(img, 0, 0, Movement.$plan.width, Movement.$plan.height);
				    }
				    img.src = 'data:image/svg+xml,'+svg.prop('outerHTML');
				}
			    
			},
			close: function() {
				$("#dialog-preview").empty();
				$("#dialog-preview").html('');
			}
		});
		$( "#dialog-preview" ).dialog( "open" );
	},
	update : function(){ //동선설정 적용
		$("#dialog-confirm").dialog({
			title : $.rtls.commons.dialog.title.ok,
	        width: "400",
	        bgiframe: true,
	        autoOpen: false,
	        modal: true,
	        resizable: false,
	        buttons: [{
	        	text : $.rtls.commons.button.ok,
				click: function() {
					$('#dialog-confirm').siblings('.ui-dialog-buttonpane').find('button:first').hide();
					$('#dialog-confirm').siblings('.ui-dialog-buttonpane').find('button:last').hide();
					$('#dialog-confirm').html('<p><div id="progressbar"><div class="progress-label">Loading...</div></did></p></p>');
					$("#progressbar").progressbar({
						value: false,
						change: function() {
							$(".progress-label").text( parseFloat($("#progressbar").progressbar( "value" )).toFixed(2) + "%" );
						},
						complete: function() {
							$(".progress-label").text( "Complete!" );
						}
				    });
					$.ajax({
						async : true,
						type: 'POST',
						url: "/service/movement.json?action=update.movement",
						dataType: 'json',
			            data : { 
							"planId" : Movement.$plan.planId,
							"movementInfo" : JSON.stringify(Movement.$info),
							"png" : Movement.getSVGtoPNGBase64()
							
						},
						xhrFields: { withCredentials:true },
						beforeSend: function(x) {
						    if(x && x.overrideMimeType) {
						    	x.overrideMimeType("application/json;charset=UTF-8");
						    }
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
			            		Log.dialog($.rtls.commons.dialog.title.ok, $.rtls.movement.message.updatesuccess);
			            		$("#dialog-confirm").dialog( "close" );
							}else{
								$("#dialog-confirm").dialog( "close" );
								Log.dialog($.rtls.commons.dialog.title.error, $.rtls.movement.message.updatefail);
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
		$("#dialog-confirm").html($.rtls.movement.message.updateconfirm);
		$('#dialog-confirm').dialog('open');
	},
	callback : {
		addWall : function(wall){ //벽등록
			$("#dialog-wall").dialog({
    			title:$.rtls.movement.dialog.title[0],
    			autoOpen: false,
    			height: 210,
    			width: 480,
    			modal: false,
    			buttons: [{
    				text : $.rtls.commons.button.ok,
    				click: function() {
    					var walls = Movement.$info.walls;
    					var ix = walls.length;
    					wall.node.id = 'wall_'+ix;
    					walls.push({id : wall.node.id, width : wall.attr('stroke-width'), points : wall.attr('path')});
    					Movement.wallEvent(wall, ix);
    					$( this ).dialog( "close" );
    					return false;
    				},
    			},{
    				text : $.rtls.commons.button.cancel,
    				click: function() {
    					Movement.$map.remove('wall');
    					$( this ).dialog( "close" );
    				}
    			}],
    			open: function() {
    				var html = '<fieldset id="fields" style="width:400px">';
    				html += '<table>';
    				html += '<tr>';
    				html += '	<td style="vertical-align: top; width:100px; height:35px;"><label>* '+$.rtls.movement.form.lineBorder+'</label></td>';
    				html += '	<td style="text-align:left;vertical-align: top;">';
    				html += '   	<div id="slider-vertical" style="height:25px;width:180px;float:left"></div>';
    				html += '   	<input type="text" id="border" value="1" style="border:0; color:#f6931f; font-weight:bold; width : 30px; text-align : center; float:left" readonly="true"/>';
    				html += '   </td>';
    				html += '</tr>';
    				html += '<tr>';
    				html += '	<td style="vertical-align: top; width:100px; height:100%"></td>';
    				html += '	<td style="text-align:left;vertical-align: top;"></td>';
    				html += '</tr>';
    				html += '</table>';
    				html += '</fieldset>';
    				$(this).html(html);
    				$( "#slider-vertical" ).slider({
    					range: "min",
    					min: 1,
    					max: 100,
    					step: 1,
    					value: 1,
    					slide: function( event, ui ) {
    						$("#border" ).val(ui.value);
    						wall.attr("stroke-width", ui.value);
    					}
    				});
    			},
    			close: function() {
    				$("#dialog-wall").empty();
    				$("#dialog-wall").html('');
    			}
    		});
    		$( "#dialog-wall" ).dialog( "open" );
			
		},
		addMovement : function(movement){ //동선등록
			var movements = Movement.$info.movements;
			var ix = movements.length;
			movement.node.id = 'movement_'+ix;
			movements.push({id : movement.node.id, points : movement.attr('path')});
			Movement.movementEvent(movement, ix);
		}
	}
};