var Camera = {
		$id : 'camera',	
		$plan : null, $plans : new Array(),	
		$camera : null, $cameras : new Array(),
		$zone : null, $zones : new Array(),
		$addCamera : null,  $addCameras : new Array(),
		$addZone : null,  $addZones : new Array(),
		$rcmMode : 0, $control : 0, $alivePeriod : 0,
		$map : {}, $configTimeout : null,
		$textOptions : {'font-size':'14px', 'fill':'#000000', 'font-weight':'bold'},
		init : function(){
			$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[6].title+'</span><span class="bg">'+$.rtls.menu[6].sub[5]+'</span>');
			$('.top_right').html(
				'<span id="error"></span>'+
				'<button id="but-add" class="button button-rounded button-small">'+$.rtls.device.button.add+'</button>'+
				'<button id="but-del" class="button button-rounded button-small">'+$.rtls.device.button.del+'</button>'
//				'<button id="but-modall" class="button button-rounded button-small">'+$.rtls.device.button.modall+'</button>'
			);
			$("#but-add").click(function() {
				Camera.getAddCameras();
				return false;
			});
			$("#but-del").click(function() {
				if(Camera.$camera==null){
					$("#error", '.top_right').html("<span style='color:red' >请选择一个摄像头！</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
					return;
				}
				return false;
			});
			$("#but-modall").click(function() {
				if($("#name").val()==""){
					$("#result", '.top_mid').html("<span style='color:red' >请添加区域！</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
					return;
				}
				Camera.modAll();
				return false;
			});
			$(".top_right>button.button").hover(function(){
				$(".top_right>button.button").addClass("button-primary");
			},function(){
				$(".top_right>button.button").removeClass("button-primary");
			});
			this.getPlans();
		},
		getPlans : function(){
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
	            	Camera.$plans = data.plans;
	            	var item, html;
	            	for(var i=0; i < Camera.$plans.length; i++){
						item = Camera.$plans[i];
						html = "<li id='"+i+"' class='ui-state-default ui-corner-top'>" +
						"<a href=\"javascript:Camera.tabSelect("+i+")\">"+item.name+"</a>" +
						"</li>";
						$('#tab').find('ul').append(html);
					}
	            	Camera.tabSelect(0);
					
				}
			});
			
		},
		tabSelect : function(ix){
			this.$plan = this.$plans[ix];
			$('#tab').find('ul').find('li').each(function(i) {
			    if(i == ix){
			    	$(this).addClass('ui-tabs-selected');
			    	$(this).addClass('ui-state-active');
			    }else{
			    	$(this).removeClass('ui-state-active');
					$(this).removeClass('ui-tabs-selected');
			    }
			});
			$(".top_mid").hide();
			this.$map = new Map({
				plan : Camera.$plan, 
				view : {isRuler : true, isGrid : true, isTool : true},
				tool : {isPointer : true, isDistance : true, isGrid : true, isRuler : false, isZone : false},
				isEvent : true,
				target : this
			});
			
			Camera.getCameras();
		},
		getCameras : function(){
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/camera.json?action=get.cames",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Camera.$plan.planId
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Camera.$map.clear();
	            	Camera.$map.marker.removeAll();
	            	Camera.$cameras = data.cameras;
//	            	$('.top_left').html($.rtls.device.list.top(Camera.$cameras.length));
					if(Camera.$cameras.length == 0){
	            		$('#map-items').html("<p><center>"+$.rtls.device.cameraMsg.emptydata+"<center></p>");
	    			}else{
	    				var item = {};
	    				var html = "<ol id='item-selectable' class='rap-selectable'>";	
	    				for(var i=0; i < Camera.$cameras.length; i++){
	    					item = Camera.$cameras[i];
							item.marker = '<p id="'+item.cameraId+'" name="marker" class="icon-p icon-rap-wifi-master" zoneId="'+item.zoneId+'"';
							item.marker += 'localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"><button class="button button-tiny button-plain button-border button-circle"><i class="fa fa-camera"></i></button>"'+item.cameraId+'"</p>';
    						html += "<li class='li-select ui-widget-content' id='"+item.cameraId+"'><button class='button button-plain button-border button-box'><i class='fa fa-camera'>&nbsp;&nbsp;"+item.cameraId+"</i></button></li><input id='switch-state' type='hidden' value="+item.ip+"|"+item.cameraId+">";
							item.id = item.cameraId;
							Camera.$map.marker.add(item, true, true, Camera);
							
						}
	    				html += "</ol>";
						$('#map-items').html(html);
						
						$("#item-selectable .li-select").click(function(){
							var marker = Camera.$map.marker.getItem($(this).attr('id'));
							Camera.$map.marker.select(marker);
							Camera.itemSelect(true);
							
							$(this).children().addClass("checked");
							$(this).siblings().children().removeClass("checked");
							for(var n=0; n<$("#map-viewport p button").length; n++){
								if($(this).attr("id")==$("#map-viewport p").eq(n).attr("id")){
									$("#map-viewport p").eq(n).children().addClass("checked");
	    							$("#map-viewport p").eq(n).siblings().children().removeClass("checked");
								}
							}
						});
						$("#map-viewport p .button-tiny").click(function(){
							var marker = Camera.$map.marker.getItem($(this).parent("p").attr('id'));
							Camera.$map.marker.select(marker);
							Camera.itemSelect(true);
							$(this).addClass("checked");
							$(this).parent().siblings().children().removeClass("checked");
							for(var n=0; n<$("#item-selectable .li-select").length; n++){
								if($(this).parent().attr("id")==$("#item-selectable .li-select").eq(n).attr("id")){
									$("#item-selectable .li-select").eq(n).children().addClass("checked");
	    							$("#item-selectable .li-select").eq(n).siblings().children().removeClass("checked");
								}
							}
						});
						
	    			}
				}
			});
		},
		getAddCameras : function(){
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/camera.json?action=get.add.cameras",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Camera.$addCameras = data.cameras;
	            	if(Camera.$addCameras.length == 0){
	           		 	Log.dialog($.rtls.commons.dialog.title.ok, $.rtls.device.cameraMsg.emptycamera);
		       		}else{
		       			$("#dialog").dialog({
		       				title:$.rtls.device.camera.title[0],
		       				bgiframe: true,
		       				autoOpen: false,
		       				width: 600,
		       				modal: true,
		       				buttons: [{
		       					text : $.rtls.commons.button.ok,
		       					click: function() {
			       					if(Camera.$addCamera == null){
			       						Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.device.cameraMsg.selectcamera);
			       					}else{
			       						Camera.$map.marker.add(Camera.$addCamera, true, true, Camera);
			       						var marker = Camera.$map.marker.getItem(Camera.$addCamera.cameraId);
			       						Camera.$map.marker.select(marker);
			       						Camera.$cameras.push(Camera.$addCamera);
			       						Camera.itemSelect(false);
			       						$( this ).dialog( "close" );
			       					}
			       				},
		       				},{
		       					text : $.rtls.commons.button.cancel,
		       					click: function() {
		       						$( this ).dialog( "close" );
		       					}
		       				}],
		       				open: function(event, ui) {
		       					var item = null, x =0, y =0;
		        				var html = "<ol id='item-selectable'  class='rap-selectable'>";	
		        				for(var i=0; i < Camera.$addCameras.length; i++){
		        					item = Camera.$addCameras[i];
			        				item.localX = 20;
		           					item.localY = 20;
		           					item.localZ = 0;
	    							item.marker = '<p id="'+item.cameraId+'" name="marker" class="icon-rap-wifi-master" zoneId="'+item.zoneId+'"';
	    							item.marker += 'localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"></p>';
	    							html += "<li class='li-content ui-widget-content' id='"+item.cameraId+"'><button class='button button-plain button-border button-box'><i class='fa fa-camera'></i></button>"+item.cameraId+"</li>";
	    							item.id = item.cameraId;
		           				}
        						html += "</ol>";
		       					$(this).html(html);
		       					$("#item-selectable", this).selectable({
		       						stop: function() {
		       							$( ".ui-selected", this ).each(function() {
		       								for(var i=0; i < Camera.$addCameras.length; i++){
		       	    	    					if(Camera.$addCameras[i].cameraId == $(this).attr('id')){
		       	    	    						Camera.$addCamera = Camera.$addCameras[i];
		       	    	    						break;
		       	    	    					}
		       								}
		       								
			       							$(this).children().addClass("checked");
			    							$(this).siblings().children().removeClass("checked");
			    							
		       							});	
		       						} 
		       					});
		       				},
		       				close: function() {
		       					Camera.$addCamera = null;
		       					$("#dialog").empty();
		       					$("#dialog").html('');
		       				}
		       			});
		       			$( "#dialog" ).dialog( "open" );
		       		}
				}
			});
	    	
	 	},
	 	getAddZones : function(planId,marker){
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/camera.json?action=get.add.zones",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : planId
	            },
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	Camera.$addZones = data.zones;
	            	if(Camera.$addZones.length == 0){
	           		 	Log.dialog($.rtls.commons.dialog.title.ok, $.rtls.device.cameraMsg.emptyzone);
		       		}else{
		       			$("#dialog").dialog({
		       				title:$.rtls.device.camera.title[2],
		       				bgiframe: true,
		       				autoOpen: false,
		       				width: 600,
		       				modal: true,
		       				buttons: [{
		       					text : $.rtls.commons.button.ok,
		       					click: function() {
			       					if(Camera.$addZone == null){
			       						Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.device.cameraMsg.selectzone);
			       					}else{
			       						$("#name").val(Camera.$addZone.name);
			       						$("#fields>:nth-child(8) span").attr("id",Camera.$addZone.zoneId);
			       						var zid = Camera.$addZone.zoneId;
			       						marker.attr('zoneId', zid);
			       						$( this ).dialog( "close" );
			       					}
			       				},
		       				},{
		       					text : $.rtls.commons.button.cancel,
		       					click: function() {
		       						$( this ).dialog( "close" );
		       					}
		       				}],
		       				open: function(event, ui) {
		       					var item = null, x =0, y =0;
		        				var html = "<ol id='item-selectable'  class='rap-selectable'>";	
		        				for(var i=0; i < Camera.$addZones.length; i++){
		        					item = Camera.$addZones[i];
	    							html += "<li class='li-content ui-widget-content' id='"+item.zoneId+"'><button class='button button-plain button-border button-box'><i class='fa fa-tag'></i></button>"+item.name+"</li>";
		           				}
        						html += "</ol>";
		       					$(this).html(html);
		       					$("#item-selectable", this).selectable({
		       						stop: function() {
		       							$( ".ui-selected", this ).each(function() {
		       								for(var i=0; i < Camera.$addZones.length; i++){
		       	    	    					if(Camera.$addZones[i].zoneId == $(this).attr('id')){
		       	    	    						Camera.$addZone = Camera.$addZones[i];
		       	    	    						break;
		       	    	    					}
		       								}
		       								
			       							$(this).children().addClass("checked");
			    							$(this).siblings().children().removeClass("checked");
		       							});	
		       						} 
		       					});
		       				},
		       				close: function() {
		       					Camera.$addZone = null;
		       					$("#dialog").empty();
		       					$("#dialog").html('');
		       				}
		       			});
		       			$( "#dialog" ).dialog( "open" );
		       		}
				}
			});
	    	
	 	},
	 	itemSelect : function(isGetZone){
			var marker = Camera.$map.marker.getSelectedItem();
			var localX = parseInt(marker.attr('localX'));
			var localY = parseInt(marker.attr('localY'));
			var localZ = parseInt(marker.attr('localZ'));
			
			var item = {};
			for(var i=0; i < Camera.$cameras.length; i++){
				item = Camera.$cameras[i];
				if(item.cameraId == marker.attr('id')){
					Camera.$camera = item;
					break;
				}
			}
			$('li', '#item-selectable').removeClass('ui-selected');
			$('#'+marker.attr('id'), '.li-select').addClass('ui-selected');
			if(isGetZone){
				$.ajax({
					async : true,
					type: 'GET',
					url: "/service/camera.json?action=get.zone",
					contentType: "application/json; charset=utf-8",
		            dataType: 'json',
		            data : { 
		            	"zid" : Camera.$camera.zoneId
		            },
					success : function (data) {
						$("#name").val(data.zone);
					}
				});
			}
			var html = "<fieldset id='fields' style='width:98%'>";
			html += "<input type='hidden' id='localX' value='"+localX+"'/>";
			html += "<input type='hidden' id='localY' value='"+localY+"'/>";
			html += "<input type='hidden' id='localZ' value='"+localZ+"'/>";
			html += "<div style='float:right'>";
			html += "	<span id='result'></span>";
			html += "	<button id='but-mod' class='button button-rounded button-small'>"+$.rtls.device.button.mod+"</button>";
//			html += "	<button id='but-del' class='button button-rounded button-small'>"+$.rtls.device.button.del+"</button>";
			html += "	<button id='but-back' class='button button-rounded button-small'>取 消</button>";
			html += "</div>";
			html += "<div style='clear:both; float:left'>";
			html +=	"	<a class='button button-glaw button-border button-rounded button-primary'>IP</a>";
			html +=	"	<a class='button button-glaw button-border button-rounded button-primary'>"+Camera.$camera.ip+"</a>";
			html +=	"</div>";
			html += "<div style='float:left'>";
			html += "	<a class='button button-glaw button-border button-rounded button-primary'>坐标(X,Y):</a>";
			html += "	<input type='text' id='localXM' class='localXM button-rounded' value='"+Camera.$map.carc.pxToMeter(localX)+"' style='width:40px;text-align:center'/>&nbsp;&nbsp;m&nbsp;&nbsp;";
			html += "	<input type='text' id='localYM' class='localYM button-rounded' value='"+Camera.$map.carc.pxToMeter(localY)+"' style='width:40px;text-align:center'/>&nbsp;&nbsp;m&nbsp;&nbsp;";
			html += "</div>";
			html += "<div style='float:left'>";
			html += "	<a class='button button-glaw button-border button-rounded button-primary'>高度(Z):</a>";
			html += "	<input type='text' id='localZM' class='localZM button-rounded' value='"+Camera.$map.carc.pxToMeter(Camera.$camera.localZ)+"' style='width:40px;text-align:center'/>&nbsp;&nbsp;m&nbsp;&nbsp;";
			html += "</div>";
			html += "<div style='float:left'>";
			html +=	"	<a class='button button-glaw button-border button-rounded button-primary'>监控区域</a><span id='zon'></span>";
			html +=	"	<input type='text' id='name' class='name button-rounded' value='' style='width:70px;text-align:center'/><button id='chooseZone' class='button button-rounded button-small'>添加区域</button>";
			html +=	"</div>";
			html += "</fieldset> ";
			
			$(".top_mid").html(html);
			$(".top_mid").show();
			$('.top_mid #localXM').keyup(function( event ) {
				var x = Camera.$map.carc.meterToPx($('.top_mid #localXM').val());
				$('.top_mid #localX').val(x);
				marker.attr('localX', x);
				var left = parseInt(x) - (marker.width()/2);
				marker.css('left', left+'px');
			});
			$('.top_mid #localYM').keyup(function( event ) {
				var y = Camera.$map.carc.meterToPx($('.top_mid #localYM').val());
				$('.top_mid #localY').val(y);
				marker.attr('localY', y);
				var top = parseInt(y) - (marker.height()/2);
				marker.css('top', top+'px');
			});
			$('.top_mid #localZM').keyup(function( event ) {
				var z = Camera.$map.carc.meterToPx($('.top_mid #localZM').val());
				$('.top_mid #localZ').val(z);
				marker.attr('localZ', z);
			});
			$("#chooseZone").click(function() {
				Camera.getAddZones(Camera.$plan.planId,marker);
				return false;
			});
			
			$("#but-mod").click(function() {
				if($("#name").val()==""){
					$("#result", '.top_mid').html("<span style='color:red' >请添加区域！</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
					return;
				}
				Camera.mod(Camera.$camera.cameraId);
				$( ".top_mid" ).hide();
				return false;
			});
			$("#but-back").click(function() {
				$( ".top_mid" ).hide();
				return false;
			});
			$("#but-del").click(function() {
				Camera.del(Camera.$camera.cameraId);
				return false;
			});
			$("#fields div>button.button").hover(function(){
				$("#fields div>button.button").addClass("button-primary");
			},function(){
				$("#fields div>button.button").removeClass("button-primary");
			});
		},
		mod : function(cameraId){
			$.validity.start();
			$.validity.setup({outputMode:"summary" });
			$(".top_mid #localX").require($.rtls.validity.required($.rtls.device.form.point)).match("number", $.rtls.validity.match($.rtls.device.form.point));
			$(".top_mid #localY").require($.rtls.validity.required($.rtls.device.form.point)).match("number", $.rtls.validity.match($.rtls.device.form.point));
			var result = $.validity.end();
			if(result.valid){
				var localX = $('.top_mid #localX').val();
				var localY = $('.top_mid #localY').val();
				var localZ = $('.top_mid #localZ').val();
				var zoneId = $("#fields>:nth-child(8) span").attr("id");
				$.ajax({
					async : true,
					type: 'post',
					url: "/service/camera.json?action=mod.camera",
					dataType: 'json',
		            data : { 
		            	"planId" : Camera.$plan.planId,
		            	"cameraId" : cameraId,
		            	"localX" : localX,
		            	"localY" : localY,
		            	"localZ" : localZ,
		            	"zoneId" : zoneId
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
		            		$("#result", '.top_mid').html("<b>"+$.rtls.device.cameraMsg.modsuccess+"</b>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
		            		Camera.getCameras();
						}else{
							$("#result", '.top_mid').html("<span style='color:red'>"+$.rtls.device.cameraMsg.modfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
						}
		        	
					}
				});
				$.validity.clear();
			}else{
				$("#result", '.top_mid').html("<span style='color:red'>"+$.rtls.validity.required($.rtls.device.form.point)+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
			}
			
		},
		modAll : function(){
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
						var markers = Camera.$map.marker.getItems();
						if(markers.length > 0){
							var ids = '';
							var localXs = '';
							var localYs = '';
							var localZs = '';
							var zoneIds = '';
							for(var i=0; i < markers.length; i++){
								ids += markers[i].attr('id')+'|';
								localXs += markers[i].attr('localX')+'|';
								localYs += markers[i].attr('localY')+'|';
								localZs += markers[i].attr('localZ')+'|';
								zoneIds += markers[i].attr('zoneId')+'|';
							}
							if(markers.length > 0){
								ids = ids.substring(0, ids.length-1);
								localXs = localXs.substring(0, localXs.length-1);
								localYs = localYs.substring(0, localYs.length-1);
								localZs = localZs.substring(0, localZs.length-1);
								zoneIds = zoneIds.substring(0, zoneIds.length-1);
							}
							$.ajax({
								async : true,
								type: 'post',
								url: "/service/camera.json?action=mod.cameras",
								dataType: 'json',
					            data : { 
					            	"planId" : Camera.$plan.planId,
									"cameraIds" : ids,
									"localXs" : localXs,
									"localYs" : localYs,
									"localZs" : localZs,
									"zoneIds" : zoneIds
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
					            		$("#dialog-confirm").dialog("close");
					            		$("#result", '.top_mid').html("<b>"+$.rtls.device.cameraMsg.modsuccess+"</b>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
					            		Camera.getCameras();
									}else{
										$("#result", '.top_mid').html("<span style='color:red'>"+$.rtls.device.cameraMsg.modfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
									}
					        	
								}
							});
						}
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
			$("#dialog-confirm").append("<p>"+$.rtls.device.cameraMsg.modconfirm+"</p>");
			$('#dialog-confirm').dialog('open');
			
			
		},
		del : function(cameraId){
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
						$.ajax({
							async : true,
							type: 'get',
							url: "/service/camera.json?action=del.camera",
							contentType: "application/json; charset=utf-8",
				            dataType: 'json',
				            data : { 
								"cameraId" : cameraId,
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
				            },
				            success : function (data) {
				            	if(data.result == 'success'){
				            		Camera.getCameras();
				            		$(".top_mid").hide();
				            		$("#dialog-confirm").dialog( "close" );
								}else{
									$("#dialog-confirm").dialog( "close" );
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.device.cameraMsg.delfail);
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
			$("#dialog-confirm").empty();
			$("#dialog-confirm").append($.rtls.device.cameraMsg.delconfirm);
			$('#dialog-confirm').dialog('open');
			
		}
};

	
