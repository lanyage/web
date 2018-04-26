var Zone = {
	$id : 'zone',	
	$plan : {}, $plans : [],
	$item : {}, $items : [], 
	$tag : null, $tags : null,
	$map : null,
	$num : new Array(),$n : 0,
	$textOptions : {'font-size':'14px', 'fill':'#000000', 'font-weight':'bold'},
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[1].title+'</span><span class="bg">'+$.rtls.menu[1].sub[1]+'</span>');
		$('.top_right').html('<button id="but-preview" class="button button-rounded button-small">'+$.rtls.movement.button.preview+'</button><button id="but-update" class="button button-rounded button-small">'+$.rtls.zone.button.update+'</button>');
		$("#but-preview").click(function() {
			Zone.preview();
			return false;
		});
		$("#but-update").click(function() {
			Zone.updateZone();
			return false;
		});
		$(".top_right>button.button").hover(function(){
			$(".top_right>button.button").addClass("button-primary");
		},function(){
			$(".top_right>button.button").removeClass("button-primary");
		});
		this.initNotify();
		this.getPlans();
	},
	initNotify : function(){ 
		var sock = new SockJS('/rtls/sockjs', null, {debug : false, devel : false});
	  	var client = Stomp.over(sock);
	  	client.debug = null;
		client.connect({}, function(frame) {
	    	client.subscribe("/queue/zone", function(message) {
				var data  = $.parseJSON(message.body);
				if(data.eventType == '12'){
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
	    });
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
			tool : {isPointer : true, isDistance : true, isGrid : true, isRuler : false, isZone : true},
			isEvent : true,
			target : this
		});
		Zone.getZones();
	},
	getPlans : function(){ //도면정보 가져오기
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
            	$('#tab').find('ul').html('');
            	Zone.$plans = data.plans;
            	var item, html; 
            	for(var i=0; i < Zone.$plans.length; i++){
					item = Zone.$plans[i];
					html = "<li id='"+i+"' class='ui-state-default ui-corner-top' onmouseover='Zone.tabOver("+i+")' onmouseout='Zone.tabOut("+i+")'>" +
					"<a class='button button-uppercase button-primary' href=\"javascript:Zone.tabSelect("+i+")\">"+item.name+"</a>" +
					"</li>";
					$('#tab').find('ul').append(html);
				}
				Zone.tabSelect(0);
			}
		});
		
	},
	getZones : function(){ //영역정보 가져오기
		Zone.$map.viewport.children('svg').children().each(function(){
			var id = $(this).attr('id')+'';
			if(id.indexOf('zone_') != -1){
				$(this).remove();
			}
		});
		
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/zone.json?action=get.zones",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Zone.$plan.planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#items tbody').html('');
        		Zone.$items = data.zones;
        		$('.top_left').html($.rtls.zone.list.top(Zone.$items.length));
            	if(Zone.$items.length > 0){
            		var item = {};
            		for(var i=0; i < Zone.$items.length; i++){
            			item = Zone.$items[i];
            			var path = 'M';
            			var points = item.points.split('|'), p = {};
            			for(var j=0; j < points.length; j++){
            				p = points[j].split(':');
            				path += p[0]+ ' ' + p[1]+'L';
            			}
            			path = path.substring(0, path.length-1)+'Z';
            			var poly = Zone.$map.draw.polygon(path, 1, '#000000', 'line', '#'+item.color, 0.7, 'zone_'+item.zoneId);
            			Zone.zoneEvent(item, poly);
            			var bbox =  Raphael.pathBBox(path);
            			if(Raphael.isPointInsidePath(path, bbox.cx, bbox.cy)){
            				Zone.$map.draw.text(bbox.cx, bbox.cy, item.name, 'zone_'+item.zoneId, Zone.$textOptions);	
            			}else{
            			    for(var j=0; j < points.length; j++){
            			    	p = points[j].split(':');
                				if(Raphael.isPointInsidePath(path, parseInt(p[0])+20, parseInt(p[1])+20)){
                					Zone.$map.draw.text(parseInt(p[0])+20, parseInt(p[1])+20, item.name, 'zone_'+item.zoneId, Zone.$textOptions);
                					break;
                				}
            			    }
            				
            			}
            		}
            	}
            	
        	}
        		
		});
		
	},
	getSVGtoPNGBase64 : function(){ // SVN Covet PAG base64 string
		// load svg
		var svgString = this.$map.viewport.html();
		var svg = $(svgString);
		svg.children().each(function(){
			var id = $(this).attr('id');
			if(id != undefined && (id == 'gline100' || id == 'gline50' || $(this)[0].tagName == 'text')){
				$(this).remove();
			}else if($(this)[0].tagName == 'path'){
				$(this).css('fill-opacity', 1);
				$(this).attr('fill-opacity', 1);
				$(this).attr('stroke-width', 0);
			}
		});
		svg.attr('width', this.$plan.width).attr('height', this.$plan.height);
		//console.log(svg);
		// convert svg to png base64
		var canvas = document.createElement('canvas');
		canvas.id = "canvas";
		document.body.appendChild(canvas);
		canvg(canvas, svg.prop('outerHTML'));
		var png =  document.getElementById('canvas').toDataURL( "image/png" );
		png = png.split(',')[1];
		$(canvas).remove();
		//console.log(img);
		return png;
	},
	zoneEvent : function(item, zone){ // Zone event handler
		zone.mouseover(function(e) {
			if(Zone.$map.tool.action == 'pointer'){
				zone.attr('cursor', 'pointer');
				zone.attr('fill', '#FF0000');
				zone.attr('stroke', '#FF0000');	
			}else{
				zone.attr('cursor', 'default');
			}
		}).mouseout(function(e) {
			if(Zone.$map.tool.action == 'pointer'){
				zone.attr('cursor', 'pointer');
				zone.attr('fill', '#'+item.color);
				zone.attr('stroke', '#000000');
			}else{
				zone.attr('cursor', 'default');
			}
		}).mouseup(function(e) {
			if(Zone.$map.tool.action == 'pointer'){
				Zone.mod(item);
			}
		}); 
		
	},
	mod : function(item){ //영역수정
		Zone.$item = item;
		var zone = Zone.$map.draw.getItem('zone_'+Zone.$item.zoneId);
		$("#dialog-zone").dialog({
			title:$.rtls.zone.dialog.title[1],
			autoOpen: false,
			height: 410,
			width: 560,
			modal: false,
			buttons: [{
				text : $.rtls.commons.button.mod,
				click: function() {
					$.validity.start();
					$.validity.setup({outputMode:"summary" });
					$("#fields #name").require($.rtls.zone.form.name);
					$("#fields #color").require($.rtls.zone.form.color);
					var result = $.validity.end();
					if(result.valid){
						var color = $("#fields #color").val()+''.toUpperCase();
						if($("#fields #color").val() == '#FFFFFF'){
							Log.dialog($.rtls.commons.dialog.title.error, $.rtls.zone.message.whitecolor);
						}else{
							$.ajax({
    							async : true,
    							type: 'POST',
    							url: "/service/zone.json?action=mod.zone",
    							dataType: 'json',
    				            data : { 
    				            	"zoneId" : Zone.$item.zoneId,
    								"planId" : Zone.$item.planId,
    								"name" : $("#fields #name").val(),
    								"color" : color.substring(1, color.length),
    								"type" : $("#fields #type").val(),
    								"points" : Zone.$item.points,
    								
    							},
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
    				            		Zone.$map.remove('zpolygon');
    				            		Zone.$map.zone.points = [];
    				            		Zone.getZones();
    				            		$( '#dialog-zone' ).dialog( "close" );
    				            	}else if(data.result == 'error.zone.color.duplicate'){
    				            		Log.dialog($.rtls.commons.dialog.title.error, $.rtls.zone.message.colorduplicate);
    				            	}else{
    				            		Log.dialog($.rtls.commons.dialog.title.error, $.rtls.zone.message.addfail);
    				            	}
    				            	
    							}
    						});
						}
						
					}
					return false;
				},
			},{
				text : $.rtls.commons.button.del,
				click: function() {
					$( this ).dialog( "close" );
					Zone.del(Zone.$item);
				}
			},{
				text : $.rtls.zone.button.resetting,
				click: function() {
					Zone.$map.remove('zone_'+Zone.$item.zoneId);
					
				}
			},{
				text : $.rtls.commons.button.cancel,
				click: function() {
					$( this ).dialog( "close" );
				}
			}],
			open: function() {
				var html = '<fieldset id="fields">';
				html += '<table id="cZone">';
				html += '<tr>';
				html += '	<td style="vertical-align: top; width:100px; height:35px;"><label>* '+$.rtls.zone.form.name+'</label></td>';
				html += '	<td style="text-align:left;vertical-align: top;"><input type="text" id="name"/></td>';
				html += '	<td style="text-align:left;vertical-align: top;" rowspan="4"><div id="zoneColor"></div></td>';
				html += '</tr>';
				html += '<tr>';
				html += '	<td style="vertical-align: top; width:100px; height:35px;"><label>* '+$.rtls.zone.form.type+'</label></td>';
				html += '	<td style="text-align:left;vertical-align: top;">';
				if(Zone.$item.type == 'safe'){
					html += '		<input id="type" name="type" type="checkbox" checked="true" value="safe">';
				}else{
					html += '		<input id="type" name="type" type="checkbox" value="danger">';
				}
				html += '	</td>';
				html += '</tr>';
				html += '<tr>';
				html += '	<td style="vertical-align: top; width:100px; height:35px;"><label>* '+$.rtls.zone.form.color+'</label></td>';
				html += '	<td style="text-align:left;vertical-align: top;"><input type="text" id="color"/></td>';
				html += '</tr>';
				html += '<tr>';
				html += '	<td style="vertical-align: top; width:100px; height:35px;"><label>* 权限设置</label></td>';
				html += '	<td style="text-align:left;vertical-align: top; height:35px;"><input type="button" id="chooseTag" value="选择标签" style="height:30px;width:100px;" /></td>';
				html += '</tr>';
				html += '<tr>';
				html += '	<td id="choosedTag" style="text-align:left;vertical-align: top;vertical-align: top; width:288px; height:35px;"><ol id="plan-select" class="ui-selectable"></ol></td>';
				html += '</tr>';
				html += '</table>';
				html += '</fieldset>';
				$(this).html(html);
				$('#fields #name').val(Zone.$item.name);
				$('#fields #color').val('#'+Zone.$item.color);
//新增功能
				$.ajax({
					async : true,
					type: 'GET',
					url: "/service/zone.json?action=get.zone.permission",
					contentType: "application/json; charset=utf-8",
		            dataType: 'json',
		            data : { 
						"zoneId" : Zone.$item.zoneId
					},
					success : function (data) {
						var html = "";
						var items = data.tagId;
						if(typeof(items)=="undefined"){
							return;
						}
						for(var i=0;i<items.length;i++){
							html+="<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+items[i]+"</li>";
						}
						$("#plan-select").html(html);
					}
				});
				$("#chooseTag").click(function() {
					$.ajax({
						async : true,
						type: 'GET',
						
						url: "/service/user.json?action=get.users",//修改为get.users
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"status" : 2
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	Zone.$tag = null;
			            	Zone.$tags = data.users;
			            	$("#dialog-tag").dialog({
			        			title:$.rtls.user.dialog.title[0],
			        			autoOpen: false,
			        			height: 400,
			        			width: 610,
			        			modal: true,
			        			buttons: [{
			        				text : $.rtls.commons.button.ok,
			        				click: function() {
			        					var html = "";
			        					var n = $("#plan-selectable li").length;
			        					var permission = "";
			        					var flag = true;
		        						for(var i=0; i<n; i++){
			        						if($("#plan-selectable").children("li").eq(i).children("input").prop("checked")==true){
			        							var tagName = $("#plan-selectable").children("li").eq(i).text();
			        							var userId = Zone.$tags[i].userId;
			        							if(i==0){
			        								permission += userId;
			        								flag = false;
			        							}else if(flag){
			        								permission += userId;
			        							}else {
			        								permission += "|" + userId;
			        							}
			        							html+="<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+tagName+"</li>";
			        						}
			        					}
			        					
			        					$.ajax({
	        								async : true,
	        								type: 'POST',
	        								url: "/service/zone.json?action=mod.zone.permission",
	        					            dataType: 'json',
	        					            data : { 
	        									"permission" : permission,
	        									"zoneId" : Zone.$item.zoneId
	        								}
	        							});
			        					$("#plan-select").html(html);
		        						$("#dialog-tag").dialog( "close" );
			        					
			        				},
			        			},{
			        				text : $.rtls.commons.button.cancel,
			        				click: function() {
			        					$( this ).dialog( "close" );
			        				}
			        			}],
			        			open: function() {
			        				var html = "<ol id='plan-selectable' class='ui-selectable'>";
									if(typeof(data.users)!='undefined'){
										for(var i=0; i < data.users.length; i++){
											html += "<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+data.users[i].name+"<input type='checkbox' unchecked></li>";	
										}	
										html += "</ol>";
										$(this).html(html);
									}
									var n = $("#choosedTag #plan-select li").length;
									if(n>0){
										for(var i=0; i<n; i++){
											var name = $("#choosedTag #plan-select").children("li").eq(i).text();
											for(var j=0; j<data.users.length; j++){
												if(data.users[j].name==name){
													$(this).children("ol").children("li").eq(j).children("input").attr("checked",true);
												}
											}
										}
									}
									$("#plan-selectable", this).selectable({
										stop: function() {
											$( ".ui-selected", this ).each(function() {
												if($(this).children("input").prop("checked")==false){
													$(this).children("input").prop("checked", true);
												}else{
													$(this).children("input").prop("checked", false);
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
					});
					return false; 
				});
				$('input[name="type"]').bootstrapSwitch({
        			size : 'small',
        			onColor : 'success',
        			offColor : 'danger',
        			onText : $.rtls.zone.form.safeZone,
        			offText : $.rtls.zone.form.dangerZone,
        			animate : true
        		}).on('switchChange.bootstrapSwitch', function(event, state) {
        			if(state){
        				$(event.target).val('safe');	
        			}else{
        				$(event.target).val('dangel');
        			}
        		});
				$("#zoneColor").colorpicker(
					{color: '#'+Zone.$item.color, defaultPalette:'web'}
				).on("change.color", function(event, color){
				    $('#color').val(color.toUpperCase());
				    zone.attr('fill', color);
				});
			},
			close: function() {
				$.validity.clear();
				$("#dialog-zone").empty();
				$("#dialog-zone").html('');
			}
		});
		$( "#dialog-zone" ).dialog( "open" );
	},
	del : function(item){ //영역삭제
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
					Zone.$map.remove('zone_'+item.zoneId);
					$.ajax({
				
						async : true,
						type: 'get',
						url: "/service/zone.json?action=del.zone",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
			            	"zoneId" : item.zoneId,
							"planId" : item.planId,
							"color"  : item.color
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
			            		Zone.getZones();
			            		$("#dialog-confirm").dialog( "close" );
							}else{
								$("#dialog-confirm").dialog( "close" );
								Log.dialog($.rtls.commons.dialog.title.error, $.rtls.zone.message.delfail);
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
		$("#dialog-confirm").append($.rtls.zone.message.delconfirm);
		$('#dialog-confirm').dialog('open');
		
	},
	preview : function(){
		$("#dialog-preview").dialog({
			title:$.rtls.movement.dialog.title[4],
			autoOpen: false,
			height:  Zone.$plan.height+60,
			width: Zone.$plan.width + 30,
			modal: false,
			buttons: [],
			open: function() {
				// load svg
				var svgString = Zone.$map.viewport.html();
				var svg = $(svgString);
				svg.children().each(function(){
					var id = $(this).attr('id');
					if(id != undefined && (id == 'gline100' || id == 'gline50' || $(this)[0].tagName == 'text')){
						$(this).remove();
					}else if($(this)[0].tagName == 'path'){
						$(this).css('fill-opacity', 1);
						$(this).attr('fill-opacity', 1);
						$(this).attr('stroke-width', 0);
					}
				});
				svg.attr('width', Zone.$plan.width).attr('height', Zone.$plan.height);
				//svg.prepend('<image x="0" y="0" width="'+Zone.$plan.width+'px" height="'+Zone.$plan.height+'px" xlink:href="/files/plan/map_'+Zone.$plan.planId+'.png"/>')
				//console.log(svg);
				
				var html = '<canvas id="preview" width="'+Zone.$plan.width+'px" height="'+Zone.$plan.height+'px">';
				html += '</canvas>';
				$(this).html(html);
				
				var canvas = document.getElementById('preview');
				var ctx = canvas.getContext('2d');
				
				var source = new Image();
				source.src = '/files/plan/map_'+Zone.$plan.planId+'.png';
				source.onload = function(){
					ctx.drawImage(source,0,0, Zone.$plan.width, Zone.$plan.height);
					
					var img = new Image();
				    img.onload = function() {
				    	ctx.drawImage(img, 0, 0, Zone.$plan.width, Zone.$plan.height);
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
	updateZone : function(){ //영역설정 적용
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
						url: "/service/zone.json?action=update.zone",
						dataType: 'json',
			            data : { 
							"planId" : Zone.$plan.planId,
							"png" : Zone.getSVGtoPNGBase64()
							
						},
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
			            		$("#dialog-confirm").dialog( "close" );
							}else{
								$("#dialog-confirm").dialog( "close" );
								Log.dialog($.rtls.commons.dialog.title.error, $.rtls.zone.message.updatefail);
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
		$("#dialog-confirm").append($.rtls.zone.message.updateconfirm);
		$('#dialog-confirm').dialog('open');
	},
	callback : {
		addZone : function(polygon, points){
			if($("#dialog-zone").closest('.ui-dialog').is(':visible')){ //수정
				var p = '';
				for(var i=0; i < points.length; i++){
					p += points[i].x+':'+points[i].y+'|';
				}
				if(p.length > 0){
					p = p.substring(0, p.length - 1);	
				}
				Zone.$item.points = p;
				Zone.$map.zone.points = [];
				polygon.node.id = 'zone_'+Zone.$item.zoneId;
				polygon.attr('fill', '#'+Zone.$item.color);
				Zone.zoneEvent(Zone.$item, polygon);
				var bbox =  Raphael.pathBBox(polygon.attr('path'));
    			Zone.$map.draw.text(bbox.cx, bbox.cy, Zone.$item.name, 'zone_'+Zone.$item.zoneId, Zone.$textOptions);
			}else{ // 등록
				$("#dialog-zone").dialog({
	    			title:$.rtls.zone.dialog.title[0],
	    			autoOpen: false,
	    			height: 410,
	    			width: 560,
	    			modal: false,
	    			buttons: [{
	    				text : $.rtls.commons.button.ok,
	    				click: function() {
	    					$.validity.start();
	    					$.validity.setup({outputMode:"summary" });
	    					$("#fields #name").require($.rtls.zone.form.name);
	    					$("#fields #color").require($.rtls.zone.form.color);
	    					var result = $.validity.end();
	    					if(result.valid){
	    						var color = $("#fields #color").val()+''.toUpperCase();
	    						if($("#fields #color").val() == '#FFFFFF'){
	    							Log.dialog($.rtls.commons.dialog.title.error, $.rtls.zone.message.whitecolor);
	    						}else{
	    							var p = '';
	    							for(var i=0; i < points.length; i++){
	    								p += points[i].x+':'+points[i].y+'|';
	    							}
	    							if(p.length > 0){
	    								p = p.substring(0, p.length - 1);	
	    							}
	    							
	    							$.ajax({
	        							async : true,
	        							type: 'POST',
	        							url: "/service/zone.json?action=add.zone",
	        							dataType: 'json',
	        				            data : { 
	        								"planId" : Zone.$plan.planId,
	        								"name" : $("#fields #name").val(),
	        								"color" : color.substring(1, color.length),
	        								"type" : $("#fields #type").val(),
	        								"points" : p,
	        								
	        							},
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
	        				            		Zone.$map.remove('zpolygon');
	        				            		Zone.$map.zone.points = [];
	        				            		Zone.getZones();
	        				            		$( '#dialog-zone' ).dialog( "close" );
	        				            	}else if(data.result == 'error.zone.color.duplicate'){
	        				            		Log.dialog($.rtls.commons.dialog.title.error, $.rtls.zone.message.colorduplicate);
	        				            	}else{
	        				            		Log.dialog($.rtls.commons.dialog.title.error, $.rtls.zone.message.addfail);
	        				            	}
	        				            	
	        							}
	        						});
	    						}
	    						
	    					}
	    					return false;
	    				},
	    			},{
	    				text : $.rtls.commons.button.cancel,
	    				click: function() {
	    					Zone.$map.remove('zpolygon');
	    					Zone.$map.zone.points = [];
	    					$( this ).dialog( "close" );
	    				}
	    			}],
	    			open: function() {
	    				var html = '<fieldset id="fields">';
	    				html += '<table>';
	    				html += '<tr>';
	    				html += '	<td style="vertical-align: top; width:100px; height:35px;"><label>* '+$.rtls.zone.form.name+'</label></td>';
	    				html += '	<td style="text-align:left;vertical-align: top;"><input type="text" id="name"/></td>';
	    				html += '	<td style="text-align:left;vertical-align: top;" rowspan="4"><div id="zoneColor"></div></td>';
	    				html += '</tr>';
	    				html += '<tr>';
	    				html += '	<td style="vertical-align: top; width:100px; height:35px;"><label>* '+$.rtls.zone.form.type+'</label></td>';
	    				html += '	<td style="text-align:left;vertical-align: top;"><input id="type" name="type" type="checkbox" checked="true" value="safe"></td>';
	    				html += '</tr>';
	    				html += '<tr>';
	    				html += '	<td style="vertical-align: top; width:100px; height:35px;"><label>* '+$.rtls.zone.form.color+'</label></td>';
	    				html += '	<td style="text-align:left;vertical-align: top;"><input type="text" id="color"/></td>';
	    				html += '</tr>';
	    				html += '<tr>';
	    				html += '	<td style="vertical-align: top; width:100px; height:100%"></td>';
	    				html += '	<td style="text-align:left;vertical-align: top;"></td>';
	    				html += '</tr>';
	    				html += '</table>';
	    				html += '</fieldset>';
	    				$(this).html(html);
	    				$('input[name="type"]').bootstrapSwitch({
	            			size : 'small',
	            			onColor : 'success',
	            			offColor : 'danger',
	            			onText : $.rtls.zone.form.safeZone,
	            			offText : $.rtls.zone.form.dangerZone,
	            			animate : true
	            		}).on('switchChange.bootstrapSwitch', function(event, state) {
	            			if(state){
	            				$(event.target).val('safe');	
	            			}else{
	            				$(event.target).val('dangel');
	            			}
	            		});
	    				$("#zoneColor").colorpicker(
	    					{color:'#31859b', defaultPalette:'web'}
	    				).on("change.color", function(event, color){
	    				    $('#color').val(color.toUpperCase());
	    				    polygon.attr('fill', color);
	    				});
	    			},
	    			close: function() {
	    				$.validity.clear();
	    				$("#dialog-zone").empty();
	    				$("#dialog-zone").html('');
	    			}
	    		});
	    		$( "#dialog-zone" ).dialog( "open" );
			}
			
		}
	},
	
};