var Rap = {
	$id : 'rap',	
	$rapType : 0,
	$plan : null, $plans : new Array(),	
	$rap : null, $raps : new Array(), 
	$addRap : null,  $addRaps : new Array(),
	$masterRap : null,  $masterRaps : new Array(),
	$rcmMode : 0, $control : 0, $alivePeriod : 0,
	$map : {}, $configTimeout : null,
	$textOptions : {'font-size':'14px', 'fill':'#000000', 'font-weight':'bold'},
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[6].title+'</span><span class="bg">'+$.rtls.menu[6].sub[4]+'</span>');
		$('.top_right').html(
			'<span id="error"></span>'+
			'<button id="but-add" class="button button-rounded button-small">'+$.rtls.device.button.add+'</button>'+
			'<button id="but-del" class="button button-rounded button-small">'+$.rtls.device.button.del+'</button>'
//			'<button id="but-modall" class="button button-rounded button-small">'+$.rtls.device.button.modall+'</button>'
		);
		$("#but-add").click(function() {
			Rap.getAddRaps();
			return false;
		});
		$("#but-del").click(function() {
			if(Rap.$rap==null){
				$("#error", '.top_right').html("<span style='color:red' >请选择一个基站！</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
				return;
			}
			return false;
		});
		$("#but-modall").click(function() {
			Rap.modAll();
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
	initNotify : function(){
		var sock = new SockJS('/rtls/sockjs');
	  	var client = Stomp.over(sock);
	  	client.debug = null;
		client.connect({}, function(frame) {
	    	Log.debug("Stomp.sock.connect");
			client.subscribe("/queue/rap", function(message) {
				var data  = $.parseJSON(message.body);
				if(data.eventType == '7'){
					if($( "#dialog-config-all" ).is(':data(uiDialog)') && $("#dialog-config-all").dialog( "isOpen" )){
						$("#dialog-config-all").html('<p style="text-align:center">'+$.rtls.device.message.configsuccess+'</p>');
						$("#dialog-config-all").dialog( "option", "buttons", [ { text: $.rtls.commons.button.ok, click: function() { $( this ).dialog( "close" ); } } ] );
						clearTimeout(Rap.$configTimeout);
						Rap.getRaps();
						Rap.itemSelect();
					}else{
						if(Rap.$rap != null && Rap.$rap.rapId == data.rapId){
							if($( "#dialog-config" ).is(':data(uiDialog)')){
								if ($("#dialog-config").dialog( "isOpen" )) {
									$("#dialog-config").html('<p style="text-align:center">'+$.rtls.device.message.configsuccess+'</p>');
									$("#dialog-config").dialog( "option", "buttons", [ { text: $.rtls.commons.button.ok, click: function() { $( this ).dialog( "close" ); } } ] );
									clearTimeout(Rap.$configTimeout);
									Rap.getRaps();
									Rap.itemSelect();
								}    
							}
							 
						}	
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
            	Rap.$plans = data.plans;
            	var item, html;
            	for(var i=0; i < Rap.$plans.length; i++){
            		item = Rap.$plans[i];
					html = "<li id='"+i+"' class='ui-state-default ui-corner-top'>" +
					"<a class='button button-uppercase' href=\"javascript:Rap.tabSelect("+i+")\">"+item.name+"</a>" +
					"</li>";
					$('#tab').find('ul').append(html);
				}
				Rap.tabSelect(0);
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
			plan : Rap.$plan, 
			view : {isRuler : true, isGrid : true, isTool : true},
			tool : {isPointer : true, isDistance : true, isGrid : true, isRuler : false, isZone : false},
			isEvent : true,
			target : this
		});
		
		Rap.getRaps();
	},
	getRaps : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/rap.json?action=get.raps",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : Rap.$plan.planId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Rap.$map.clear();
            	Rap.$map.marker.removeAll();
            	Rap.$raps = data.raps;
            	$('.top_left').html($.rtls.device.list.top(Rap.$raps.length));
				if(Rap.$raps.length == 0){
            		$('#map-items').html("<p><center>"+$.rtls.device.list.empty+"<center></p>");
    			}else{
    				var item = {}, euid = '', network = '';
    				var masters = new Array() , master = {}, master2 = {}, master3 = {};
    				var html = "<ol id='item-selectable' class='rap-selectable'>";	
    				for(var i=0; i < Rap.$raps.length; i++){
    					item = Rap.$raps[i];
    					master = null, master2= null, master3= null;
    					for(var j=0; j < Rap.$raps.length; j++){
    						if(item.euidMaster == Rap.$raps[j].euidSrc){
    							master = Rap.$raps[j];
    						}else if(item.euidMaster2 == Rap.$raps[j].euidSrc){
    							master2 = Rap.$raps[j];
    						}else if(item.euidMaster3 == Rap.$raps[j].euidSrc){
    							master3 = Rap.$raps[j];
    						}
    					}
    					euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length);
    					if(item.networkType == '1'){
    						network = 'fa-bolt';//有线
    					}else if(item.networkType == '2'){
    						network = 'fa-rss';//无线
    					}else if(item.networkType == '3'){
    						network = 'fa-signal';//充电
    					}
    					if(item.rcmMode == 1){
							masters.push(item);
							item.marker = '<p id="'+item.rapId+'" name="marker" class="master icon-p icon-rap-wifi-master" title="'+euid+'" type="'+item.rcmMode+'" ';
							item.marker += 'masterId="'+item.rapId+'" masterId2="0"  masterId3="0" ';
//							item.marker += 'network="wifi" status="alive" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"><button class="button button-tiny button-plain button-border button-circle"><i class="fa '+network+'"></i></button></p>';
//    						html += "<li class='ui-widget-content master li-select' id='"+item.rapId+"'><button class='button button-plain button-border button-box'><i class='fa "+network+"'></i></button>"+euid+"</li>";
    						if(item.status == 'dead'){
    							item.marker += 'network="wifi" status="alive" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"><button class="button button-tiny button-plain button-border button-circle dead"><i class="fa '+network+'"></i></button></p>';
								html += "<li class='ui-widget-content master li-select' id='"+item.rapId+"'><button class='button button-plain button-border button-box dead'><i class='fa "+network+"'></i></button>"+euid+"</li>";
							}else{
								item.marker += 'network="wifi" status="alive" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"><button class="button button-tiny button-plain button-border button-circle"><i class="fa '+network+'"></i></button></p>';
								html += "<li class='ui-widget-content master li-select' id='"+item.rapId+"'><button class='button button-plain button-border button-box'><i class='fa "+network+"'></i></button>"+euid+"</li>";
							}
						}else{
							item.marker = '<p id="'+item.rapId+'" name="marker" class="slave icon-p icon-rap-wifi-slave" title="'+euid+'" type="'+item.rcmMode+'" ';
							item.marker += 'masterId="'+(master == null ? 0 : master.rapId)+'" masterId2="'+(master2 == null ? 0 : master2.rapId)+'" masterId3="'+(master3 == null ? 0 : master3.rapId)+'" ';
//							item.marker += 'network="wifi" status="alive" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"><button class="button button-tiny button-plain button-border button-circle"><i class="fa '+network+'"></i></button></p>';
//    						html += "<li class='ui-widget-content slave li-select' id='"+item.rapId+"'><button class='button button-plain button-border button-box'><i class='fa "+network+"'></i></button>"+euid+"</li>";
    						if(item.status == 'dead'){
    							item.marker += 'network="wifi" status="alive" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"><button class="button button-tiny button-plain button-border button-circle dead"><i class="fa '+network+'"></i></button></p>';
								html += "<li class='ui-widget-content slave li-select' id='"+item.rapId+"'><button class='button button-plain button-border button-box dead'><i class='fa "+network+"'></i></button>"+euid+"</li>";
							}else{
								item.marker += 'network="wifi" status="alive" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"><button class="button button-tiny button-plain button-border button-circle"><i class="fa '+network+'"></i></button></p>';
								html += "<li class='ui-widget-content slave li-select' id='"+item.rapId+"'><button class='button button-plain button-border button-box'><i class='fa "+network+"'></i></button>"+euid+"</li>";
							}
						}
						item.id = item.rapId;
						Rap.$map.marker.add(item, true, true, Rap);

					}
    				html += "</ol>";
					$('#map-items').html(html);
					$("#item-selectable", "#map-items").selectable({
						stop: function() {
							$( ".ui-selected", this ).each(function() {
								var marker = Rap.$map.marker.getItem($(this).attr('id'));
								Rap.$map.marker.select(marker);
								Rap.itemSelect();
								if($(this).hasClass("slave")){
									$(this).children().addClass("slavechecked");
			   						$(this).siblings().children().removeClass("slavechecked masterchecked");
			   						for(var n=0; n<$("#map-viewport p button").length; n++){
										if($(this).attr("id")==$("#map-viewport p").eq(n).attr("id")){
											$("#map-viewport p").eq(n).children().addClass("slavechecked");
			    							$("#map-viewport p").eq(n).siblings().children().removeClass("slavechecked masterchecked");
										}
									}
								}else if($(this).hasClass("master")){
									$(this).children().addClass("masterchecked");
			   						$(this).siblings().children().removeClass("slavechecked masterchecked");
			   						for(var n=0; n<$("#map-viewport p button").length; n++){
										if($(this).attr("id")==$("#map-viewport p").eq(n).attr("id")){
											$("#map-viewport p").eq(n).children().addClass("masterchecked");
			    							$("#map-viewport p").eq(n).siblings().children().removeClass("slavechecked masterchecked");
										}
									}
								}
								
							});		
						}
					});
					$("p.slave").click(function(){
   						$(this).children().addClass("slavechecked");
   						$(this).siblings().children().removeClass("slavechecked masterchecked");
   						for(var n=0; n<$("#item-selectable .li-select").length; n++){
							if($(this).attr("id")==$("#item-selectable .li-select").eq(n).attr("id")){
								$("#item-selectable .li-select").eq(n).children().addClass("slavechecked");
    							$("#item-selectable .li-select").eq(n).siblings().children().removeClass("masterchecked slavechecked");
							}
						}
   					});
   					$("p.master").click(function(){
   						$(this).children().addClass("masterchecked");
   						$(this).siblings().children().removeClass("slavechecked masterchecked");
   						for(var n=0; n<$("#item-selectable .li-select").length; n++){
							if($(this).attr("id")==$("#item-selectable .li-select").eq(n).attr("id")){
								$("#item-selectable .li-select").eq(n).children().addClass("masterchecked");
    							$("#item-selectable .li-select").eq(n).siblings().children().removeClass("slavechecked masterchecked");
							}
						}
   					});
					// 도면 Master와의 거리 표현 图的距离Master和表达
    				var path = '', text = '', x = 0, y = 0;
    				for(var i=0; i < Rap.$raps.length; i++){
    					item = Rap.$raps[i];
    					x = Math.round(item.localX);
    					y = Math.round(item.localY);
						euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length);
						if(item.rcmMode == 2){
							text = '';
							for(var j=0; j < masters.length; j++){
		    					if(masters[j].euidSrc == item.euidMaster){
    								path = 'M'+masters[j].localX+' '+masters[j].localY+'L'+item.localX+' '+item.localY+'Z';
    								Rap.$map.draw.line(path, 1, "#FF0000", 'dot', 'rap_line_1_'+item.rapId);
    							}else if(masters[j].euidSrc == item.euidMaster2){
    								path = 'M'+masters[j].localX+' '+masters[j].localY+'L'+item.localX+' '+item.localY+'Z';
    								Rap.$map.draw.line(path, 1, "#FF0000", 'dot', 'rap_line_2_'+item.rapId);
    							}else if(masters[j].euidSrc == item.euidMaster3){
    								path = 'M'+masters[j].localX+' '+masters[j].localY+'L'+item.localX+' '+item.localY+'Z';
    								Rap.$map.draw.line(path, 1, "#FF0000", 'dot', 'rap_line_3_'+item.rapId);
    							}
    						}
							if(item.masterCount == 1){
								text = item.masterDistance+'m';
							}else if(item.masterCount == 2){
								text = item.masterDistance+'m, '+item.masterDistance2+'m';
							}else if(item.masterCount == 3){
								text = item.masterDistance+'m, '+item.masterDistance2+'m, '+item.masterDistance3+'m';
							}
							
    						Rap.$map.draw.text(x+10, y + 20, euid+"("+text+")", 'rap_text_'+item.rapId, Rap.$textOptions);
						}else{
							Rap.$map.draw.text(x, y + 20, euid, 'rap_text_'+item.rapId, Rap.$textOptions);
						}
    				}
    			}
			}
		});
		
	},
	getAddRaps : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/rap.json?action=get.add.raps",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Rap.$addRaps = data.raps;
            	if(Rap.$addRaps.length == 0){
           		 	Log.dialog($.rtls.commons.dialog.title.ok, $.rtls.device.message.emptyrap);
	       		}else{
	       			$("#dialog").dialog({
	       				title:$.rtls.device.dialog.title[0],
	       				bgiframe: true,
	       				autoOpen: false,
	       				width: 600,
	       				modal: true,
	       				buttons: [{
	       					text : $.rtls.commons.button.ok,
	       					click: function() {
		       					if(Rap.$addRap == null){
		       						Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.device.message.selectrap);
		       					}else{
		       						Rap.$map.marker.add(Rap.$addRap, true, true, Rap);
		       						var marker = Rap.$map.marker.getItem(Rap.$addRap.rapId);
		       						Rap.$map.marker.select(marker);
		       						Rap.$raps.push(Rap.$addRap);
		       						Rap.itemSelect();
		       						$( this ).dialog( "close" );
		       					}
//		       					alert(Rap.$addRaps.length);
//		       					var status = null;
//			   					for(var n=0; n<Rap.$addRaps.length; n++){
//			   						status = Rap.$addRaps[n];
//			   						alert(status.status); 
//			   						if(status.status == 'dead'){
//			   							$("#item-selectable li button").addClass("dead");
//			   							alert(222);
//			   						}
//			   					}
		       				},
	       				},{
	       					text : $.rtls.commons.button.cancel,
	       					click: function() {
	       						$( this ).dialog( "close" );
	       					}
	       				}],
	       				
	       				open: function(event, ui) {
	       					var item = null, euid = '', network = '', x =0, y =0;
	       					var masters = new Array() , master = {}, master2 = {}, master3 = {};
	        				var html = "<ol id='item-selectable'  class='rap-selectable'>";	
	           				for(var i=0; i < Rap.$addRaps.length; i++){
	           					item = Rap.$addRaps[i];
	           					euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length);
	           					/*alert(euid);*/
	           					master = null, master2 = null, master3 = null;
	           					for(var j=0; j < Rap.$raps.length; j++){
	        						if(item.euidMaster == Rap.$raps[j].euidSrc){
	        							master = Rap.$raps[j];
	        						}else if(item.euidMaster2 == Rap.$raps[j].euidSrc){
	        							master2 = Rap.$raps[j];
	        						}else if(item.euidMaster3 == Rap.$raps[j].euidSrc){
	        							master3 = Rap.$raps[j];
	        						}
	        					}
	           					if(item.networkType == '1'){
	        						network = 'fa-bolt';
	        					}else if(item.networkType == '2'){
	        						network = 'fa-rss';
	        					}else if(item.networkType == '3'){
	        						network = 'fa-signal';
	        					}
	           					item.localX = 20;
	           					item.localY = 20;
	           					item.localZ = 0;
	           					if(item.rcmMode == 1){
	    							item.marker = '<p id="'+item.rapId+'" name="marker" class="icon-rap-wifi-master" title="'+euid+'" type="'+item.rcmMode+'" ';
	    							item.marker += 'masterId="'+item.rapId+'" masterId2="0" masterId3="0" ';
	    							item.marker += 'network="wifi" status="'+item.status+'" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"></p>';
	    							if(item.status == 'dead'){
	    								html += "<li class='ui-widget-content master' id='"+item.rapId+"'><button class='button button-plain button-border button-box dead'><i class='fa "+network+"'></i></button>"+euid+"</li>";
	    							}else{
	    								html += "<li class='ui-widget-content master' id='"+item.rapId+"'><button class='button button-plain button-border button-box'><i class='fa "+network+"'></i></button>"+euid+"</li>";
	    							}
	    						}else{
	    							item.marker = '<p id="'+item.rapId+'" name="marker" class="icon-rap-wifi-slave" title="'+euid+'" type="'+item.rcmMode+'" ';
	    							item.marker += 'masterId="'+(master == null ? 0 : master.rapId)+'" masterId2="'+(master2 == null ? 0 : master2.rapId)+'" masterId3="'+(master3 == null ? 0 : master3.rapId)+'" ';
	    							item.marker += 'network="wifi" status="'+item.status+'" localX="'+item.localX+'" localY="'+item.localY+'" localZ="'+item.localZ+'"></p>';
	    							if(item.status == 'dead'){
	    								html += "<li class='ui-widget-content slave' id='"+item.rapId+"'><button class='button button-plain button-border button-box dead'><i class='fa "+network+"'></i></button>"+euid+"</li>";
	    							}else{
	    								html += "<li class='ui-widget-content slave' id='"+item.rapId+"'><button class='button button-plain button-border button-box'><i class='fa "+network+"'></i></button>"+euid+"</li>";
	    							}
	    						}
	    						item.id = item.rapId;
	           				}
	       					html += "</ol>";
	       					$(this).html(html);
	       					$("#item-selectable", this).selectable({
	       						stop: function() {
	       							$( ".ui-selected", this ).each(function() {
	       								for(var i=0; i < Rap.$addRaps.length; i++){
	       	    	    					if(Rap.$addRaps[i].rapId == $(this).attr('id')){
	       	    	    						Rap.$addRap = Rap.$addRaps[i];
	       	    	    						break;
	       	    	    					}
	       								}
	       								//
       									if($(this).hasClass("slave")){
	    									$(this).children().addClass("slavechecked");
	    			   						$(this).siblings().children().removeClass("slavechecked masterchecked");
	    			   						for(var n=0; n<$("#item-selectable .li-select").length; n++){
	    										if($(this).attr("id")==$("#item-selectable .li-select").eq(n).attr("id")){
	    											$("#item-selectable .li-select").eq(n).children().addClass("slavechecked");
	    			    							$("#item-selectable .li-select").eq(n).siblings().children().removeClass("slavechecked masterchecked");
	    										}
	    									}
	    								}else if($(this).hasClass("master")){
	    									$(this).children().addClass("masterchecked");
	    			   						$(this).siblings().children().removeClass("slavechecked masterchecked");
	    			   						for(var n=0; n<$("#item-selectable .li-select").length; n++){
	    										if($(this).attr("id")==$("#item-selectable .li-select").eq(n).attr("id")){
	    											$("#item-selectable .li-select").eq(n).children().addClass("masterchecked");
	    			    							$("#item-selectable .li-select").eq(n).siblings().children().removeClass("slavechecked masterchecked");
	    										}
	    									}
	    								}
	       							});		
	       						} 
	       					});
	       				},
	       				close: function() {
	       					Rap.$addRap = null;
	       					$("#dialog").empty();
	       					$("#dialog").html('');
	       				}
	       			});
	       			$( "#dialog" ).dialog( "open" );
	       		}
			}
		});
    	
 	},
 	getMasterDistances:function(marker){
 		var dists = [0.0, 0.0, 0,0, 0,0];
 		var localX = parseInt(marker.attr('localX'));
		var localY = parseInt(marker.attr('localY'));
		var localZ = parseInt(marker.attr('localZ'));
 		var masterId = parseInt(marker.attr('masterId'));
 		var masterId2 = parseInt(marker.attr('masterId2'));
 		var masterId3 = parseInt(marker.attr('masterId3'));
 		var masterMarker = {}, masterLocalX = 0, masterLocalY = 0, masterLocalZ = 0, dist = 0;
		if(masterId > 0){
			masterMarker = Rap.$map.marker.getItem(masterId);
			masterLocalX = parseInt(masterMarker.attr('localX'));
			masterLocalY = parseInt(masterMarker.attr('localY'));
			masterLocalZ = parseInt(masterMarker.attr('localZ'));
			dists[0] = Rap.$map.carc.pxToMeter(Rap.$map.carc.distance(masterLocalX, localX, masterLocalY, localY,  masterLocalZ, localZ));
		}
		if(masterId2 > 0){
			masterMarker = Rap.$map.marker.getItem(masterId2);
			masterLocalX = parseInt(masterMarker.attr('localX'));
			masterLocalY = parseInt(masterMarker.attr('localY'));
			masterLocalZ = parseInt(masterMarker.attr('localZ'));
			dists[1] = Rap.$map.carc.pxToMeter(Rap.$map.carc.distance(masterLocalX, localX, masterLocalY, localY,  masterLocalZ, localZ));
			
		}
		if(masterId3 > 0){
			masterMarker = Rap.$map.marker.getItem(masterId3);
			masterLocalX = parseInt(masterMarker.attr('localX'));
			masterLocalY = parseInt(masterMarker.attr('localY'));
			masterLocalZ = parseInt(masterMarker.attr('localZ'));
			dists[2] = Rap.$map.carc.pxToMeter(Rap.$map.carc.distance(masterLocalX, localX, masterLocalY, localY,  masterLocalZ, localZ));
		}
		return dists;
 	},
 	refreshMarker:function(marker){
 		var id = marker.attr('id');
 		Rap.$map.remove('rap_line_1_'+id);
		Rap.$map.remove('rap_line_2_'+id);
		Rap.$map.remove('rap_line_3_'+id);
		Rap.$map.remove('rap_text_'+id);
		
		var euid = marker.attr('title');
		var localX = parseInt(marker.attr('localX'));
		var localY = parseInt(marker.attr('localY'));
		var localZ = parseInt(marker.attr('localZ'));
		
 		var masterId = parseInt(marker.attr('masterId'));
 		var masterId2 = parseInt(marker.attr('masterId2'));
 		var masterId3 = parseInt(marker.attr('masterId3'));
 		
 		var text = '', masterMarker = {}, masterLocalX = 0, masterLocalY = 0, masterLocalZ = 0, dist = 0;
		if(masterId > 0){
			masterMarker = Rap.$map.marker.getItem(masterId);
			masterLocalX = parseInt(masterMarker.attr('localX'));
			masterLocalY = parseInt(masterMarker.attr('localY'));
			masterLocalZ = parseInt(masterMarker.attr('localZ'));
			
			dist = Rap.$map.carc.pxToMeter(Rap.$map.carc.distance(masterLocalX, localX, masterLocalY, localY,  masterLocalZ, localZ));
			Rap.$map.draw.line('M'+masterLocalX+' '+masterLocalY+'L'+localX+' '+localY+'Z', 1, "#FF0000", 'dot', 'rap_line_1_'+id);
			text = dist+'m';
		}
		if(masterId2 > 0){
			masterMarker = Rap.$map.marker.getItem(masterId2);
			masterLocalX = parseInt(masterMarker.attr('localX'));
			masterLocalY = parseInt(masterMarker.attr('localY'));
			masterLocalZ = parseInt(masterMarker.attr('localZ'));
			
			dist = Rap.$map.carc.pxToMeter(Rap.$map.carc.distance(masterLocalX, localX, masterLocalY, localY,  masterLocalZ, localZ));
			Rap.$map.draw.line('M'+masterLocalX+' '+masterLocalY+'L'+localX+' '+localY+'Z', 1, "#FF0000", 'dot', 'rap_line_2_'+id);
			text += ', '+dist+'m';
		}
		if(masterId3 > 0){
			masterMarker = Rap.$map.marker.getItem(masterId3);
			masterLocalX = parseInt(masterMarker.attr('localX'));
			masterLocalY = parseInt(masterMarker.attr('localY'));
			masterLocalZ = parseInt(masterMarker.attr('localZ'));
			
			dist = Rap.$map.carc.pxToMeter(Rap.$map.carc.distance(masterLocalX, localX, masterLocalY, localY,  masterLocalZ, localZ));
			Rap.$map.draw.line('M'+masterLocalX+' '+masterLocalY+'L'+localX+' '+localY+'Z', 1, "#FF0000", 'dot', 'rap_line_3_'+id);
			text += ', '+dist+'m';
		}
		if(!$.string(text).blank()){
			Rap.$map.draw.text(localX+10, localY + 20, euid+"("+text+")", 'rap_text_'+id, Rap.$textOptions);	
		}
		return text;
 	},
 	itemSelect : function(){ //  Call function from Map
		var marker = Rap.$map.marker.getSelectedItem();
		var dist = '0m';
		if(marker.attr('type') == 1){ //마스터일때 슬레이브 갱신  主时slave更新
			var markers = Rap.$map.marker.getItems();
			for(var i=0; i < markers.length; i++){
				if(markers[i].attr('type') == 2){
					this.refreshMarker(markers[i]);
				}
			}
			var id = marker.attr('id');
	 		var euid = marker.attr('title');
			var localX = parseInt(marker.attr('localX'));
			var localY = parseInt(marker.attr('localY'));
			Rap.$map.remove('rap_text_'+id);
			Rap.$map.draw.text(localX, localY + 20, euid, 'rap_text_'+id, Rap.$textOptions);	
		}else if(marker.attr('type') == 2){ //슬레이브이면 자기자신 갱신  slave自我更新。
			dist = this.refreshMarker(marker);
		}
		
		var localX = parseInt(marker.attr('localX'));
		var localY = parseInt(marker.attr('localY'));
		var localZ = parseInt(marker.attr('localZ'));
		
		var item = {};
		for(var i=0; i < Rap.$raps.length; i++){
			item = Rap.$raps[i];
			if(item.rapId == marker.attr('id')){
				Rap.$rap = item;
				break;
			}
		}
		
		$('li', '#item-selectable').removeClass('ui-selected');
		$('#'+marker.attr('id'), '#item-selectable').addClass('ui-selected');
		
		var html = "<fieldset id='fields' style='width:98%'>";
		html += "<input type='hidden' id='localX' value='"+localX+"'/>";
		html += "<input type='hidden' id='localY' value='"+localY+"'/>";
		html += "<input type='hidden' id='localZ' value='"+localZ+"'/>";
		html += "<div style='float:right'>";
		html += "	<span id='result'></span>";
		html += "	<button id='but-mod' class='button button-rounded button-small'>"+$.rtls.device.button.mod+"</button>";
//		html += "	<button id='but-del' class='button button-rounded button-small'>"+$.rtls.device.button.del+"</button>";
		html += "	<button id='but-back' class='button button-rounded button-small'>取 消</button>";
//		html += "	<button id='but-config' class='button button-rounded button-small'>"+$.rtls.device.button.config+"</button>";
		html += "</div>";
		html += "<div style='float:left'><a class='button button-glaw button-border button-rounded button-primary'>ID</a><a class='button button-glaw button-border button-rounded button-primary'>"+Rap.$rap.euidSrc+"</a></div>";
		html += "<div style='float:left'><a class='button button-glaw button-border button-rounded button-primary'>IP</a><a class='button button-glaw button-border button-rounded button-primary'>"+Rap.$rap.ip+"</a></div>";
		html += "<div style='float:left'>";
		html += "	<a class='button button-glaw button-border button-rounded button-primary'>"+$.rtls.device.form.point+"</a>";
		html += "	<input type='text' id='localXM' class='localXM button-rounded' value='"+Rap.$map.carc.pxToMeter(localX)+"' style='width:40px;text-align:center'/>&nbsp;&nbsp;m&nbsp;&nbsp;";
		html += "	<input type='text' id='localYM' class='localYM button-rounded' value='"+Rap.$map.carc.pxToMeter(localY)+"' style='width:40px;text-align:center'/>&nbsp;&nbsp;m&nbsp;&nbsp;";
		html += "	<span id='pointMeter' class='text'>("+dist+")</span>";
		html += "</div>";
		html += "<div style='float:left'>";
		html += "	<a class='button button-glaw button-border button-rounded button-primary'>"+$.rtls.device.form.height+"</a>";
		html += "	<input type='text' id='localZM' class='localZM button-rounded' value='"+Rap.$map.carc.pxToMeter(Rap.$rap.localZ)+"' style='width:40px;text-align:center'/>&nbsp;&nbsp;m&nbsp;&nbsp;";
		html += "</div>";
		html += "<div style='clear:both;float:left'>";
		html += "	<a class='button button-glaw button-border button-rounded button-primary'>"+$.rtls.device.form.networkType+"</a>";
		html += "	<select id='networkType' class='button-rounded'>";				
		if(Rap.$rap.networkType == '1'){
			html += "<option value='1' selected>有线模式</option>";
			html += "<option value='2'>无线模式</option>";
			html += "<option value='3'>3G网络</option>";
		}else if(Rap.$rap.networkType == '2'){
			html += "<option value='1'>有线模式</option>";
			html += "<option value='2' selected>无线模式</option>";
			html += "<option value='3'>3G网络</option>";
		}else if(Rap.$rap.networkType == '3'){
			html += "<option value='1'>有线模式</option>";
			html += "<option value='2'>无线模式</option>";
			html += "<option value='3' selected>3G网络</option>";
		}else{
			html += "<option value='1' selected>有线模式</option>";
			html += "<option value='2'>无线模式</option>";
			html += "<option value='3'>3G网络</option>";
		}
		html += "</select>";
		html += "</div>";
		html += "<div style='float:left'>";
		html += "	<a class='button button-glaw button-border button-rounded button-primary'>"+$.rtls.device.form.signalRatio+"</a>";
		html += "	<input type='text' id='signalRatio' value='"+Rap.$rap.signalRatio+"' style='width:40px;text-align:center'/>";
		html += "</div>";
		html += "<div style='float:left'>";
		html += "	<a class='button button-glaw button-border button-rounded button-primary'>"+$.rtls.device.form.signalWeight+"</a>";
		html += "	<input type='text' id='signalWeight' value='"+(Rap.$rap.signalWeight * 100)+"' style='width:40px;text-align:center'/> %";
		html += "</div>";
		html += "<div style='float:left'>";
		html += "	<a class='button button-glaw button-border button-rounded button-primary'>"+$.rtls.device.form.zoneType+"</a>";
		html += "	<select id='zoneType' class='button-rounded'>>";				
		if(Rap.$rap.zoneType == 1){
			html += "<option value='1' selected>"+$.rtls.device.form.zone1D+"</option>";
			html += "<option value='2'>"+$.rtls.device.form.zone2D+"</option>";
		}else if(Rap.$rap.zoneType == 2){
			html += "<option value='1'>"+$.rtls.device.form.zone1D+"</option>";
			html += "<option value='2' selected>"+$.rtls.device.form.zone2D+"</option>";
		}else{
			html += "<option value='1'>"+$.rtls.device.form.zone1D+"</option>";
			html += "<option value='2'>"+$.rtls.device.form.zone2D+"</option>";
		}
		html += "</select>";
		html += "</div>";
		html += "<div style='float:left'><a class='button button-glaw button-border button-rounded button-primary'>"+$.rtls.device.form.description+"</a><input type='text' id='description' class='button-rounded' value='"+Rap.$rap.description+"'/></div>";
		html += "</fieldset> ";
		
		$(".top_mid").html(html);
		$(".top_mid").show();
		$('.top_mid #localXM').keyup(function( event ) {
			var x = Rap.$map.carc.meterToPx($('.top_mid #localXM').val());
			$('.top_mid #localX').val(x);
			marker.attr('localX', x);
			var left = parseInt(x) - (marker.width()/2);
			marker.css('left', left+'px');
			$('.top_mid #pointMeter').html('('+Rap.refreshMarker(marker)+')');
		});
		$('.top_mid #localYM').keyup(function( event ) {
			var y = Rap.$map.carc.meterToPx($('.top_mid #localYM').val());
			$('.top_mid #localY').val(y);
			marker.attr('localY', y);
			var top = parseInt(y) - (marker.height()/2);
			marker.css('top', top+'px');
			$('.top_mid #pointMeter').html('('+Rap.refreshMarker(marker)+')');
		});
		$('.top_mid #localZM').keyup(function( event ) {
			var z = Rap.$map.carc.meterToPx($('.top_mid #localZM').val());
			$('.top_mid #localZ').val(z);
			marker.attr('localZ', z);
		});
		$('input[name="isAP"]').bootstrapSwitch({
			size : 'small',
			onColor : 'primary',
			onText : $.rtls.device.form.use,
			offText : $.rtls.device.form.notuse,
			animate : true
		}).on('switchChange.bootstrapSwitch', function(event, state) {
			if(state){
				$(event.target).val('true');	
			}else{
				$(event.target).val('false');
			}
		});
		$("#but-mod").click(function() {
			Rap.mod(Rap.$rap.rapId);
			$( ".top_mid" ).hide();
			return false;
		});
		$("#but-del").click(function() {
			Rap.del(Rap.$rap.rapId);
			return false;
		});
		$("#but-back").click(function() {
			$( ".top_mid" ).hide();
			return false;
		});
		$("#but-config").button({
			icons: {primary: "ui-icon-gear"}
		}).click(function() {
			window.open('http://'+Rap.$rap.ip+":8080/index.html");
			return false;
		});
		
	},
	mod : function(rapId){
		$.validity.start();
		$.validity.setup({outputMode:"summary" });
		$(".top_mid #localX").require($.rtls.validity.required($.rtls.device.form.point)).match("number", $.rtls.validity.match($.rtls.device.form.point));
		$(".top_mid #localY").require($.rtls.validity.required($.rtls.device.form.point)).match("number", $.rtls.validity.match($.rtls.device.form.point));
		$(".top_mid #signalRatio").require($.rtls.validity.required($.rtls.device.form.signalRatio)).match("number", $.rtls.validity.match($.rtls.device.form.signalRatio));
		$(".top_mid #signalWeight").require($.rtls.validity.required($.rtls.device.form.signalWeight)).match("number", $.rtls.validity.match($.rtls.device.form.signalWeight));
		var result = $.validity.end();
		if(result.valid){
			var localX = $('.top_mid #localX').val();
			var localY = $('.top_mid #localY').val();
			var localZ = $('.top_mid #localZ').val();
			var dists = Rap.getMasterDistances(Rap.$map.marker.getItem(rapId));
			$.ajax({
				async : true,
				type: 'post',
				url: "/service/rap.json?action=mod.rap",
				dataType: 'json',
	            data : { 
	            	"planId" : Rap.$plan.planId,
	            	"rapId" : rapId,
	            	"localX" : localX,
	            	"localY" : localY,
	            	"localZ" : localZ,
	            	"isAP" : Rap.$rap.isAp,
	            	"networkType" : $('.top_mid #networkType').val(),
	            	"signalRatio" : $(".top_mid #signalRatio").val(),
					"signalWeight" : (parseFloat($(".top_mid #signalWeight").val()) / 100),
					"zoneType" : $(".top_mid #zoneType").val(),
					"description" : $('#description', '.top_mid').val(),
	            	"masterDistance" : dists[0],
	            	"masterDistance2" : dists[1],
	            	"masterDistance3" : dists[2],
	            	"masterDistance4" : dists[3],
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
	            		$("#result", '.top_mid').html("<b>"+$.rtls.device.message.modsuccess+"</b>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
	            		Rap.getRaps();
					}else{
						$("#result", '.top_mid').html("<span style='color:red'>"+$.rtls.device.message.modfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
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
					var markers = Rap.$map.marker.getItems();
					if(markers.length > 0){
						var ids = '';
						var localXs = '';
						var localYs = '';
						var localZs = '';
						var dists = '';
						var tempDists = [];
						for(var i=0; i < markers.length; i++){
							ids += markers[i].attr('id')+'|';
							localXs += markers[i].attr('localX')+'|';
							localYs += markers[i].attr('localY')+'|';
							localZs += markers[i].attr('localZ')+'|';
							tempDists = Rap.getMasterDistances(markers[i]);
							dists += tempDists[0]+':'+tempDists[1]+':'+tempDists[2]+':'+tempDists[3]+'|'; 
						}
						if(markers.length > 0){
							ids = ids.substring(0, ids.length-1);
							localXs = localXs.substring(0, localXs.length-1);
							localYs = localYs.substring(0, localYs.length-1);
							localZs = localZs.substring(0, localZs.length-1);
							dists = dists.substring(0, dists.length-1);
						}
						$.ajax({
							async : true,
							type: 'post',
							url: "/service/rap.json?action=mod.raps",
							dataType: 'json',
				            data : { 
				            	"planId" : Rap.$plan.planId,
								"rapIds" : ids,
								"localXs" : localXs,
								"localYs" : localYs,
								"localZs" : localZs,
								"dists" : dists,
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
				            		$("#result", '.top_mid').html("<b>"+$.rtls.device.message.modsuccess+"</b>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
				            		Rap.getRaps();
								}else{
									$("#result", '.top_mid').html("<span style='color:red'>"+$.rtls.device.message.modfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
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
		$("#dialog-confirm").append("<p>"+$.rtls.device.message.modconfirm+"</p>");
		$('#dialog-confirm').dialog('open');
		
		
	},
	del : function(rapId){
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
						url: "/service/rap.json?action=del.rap",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"rapId" : rapId,
							"delType" : 0
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
			            		Rap.getRaps();
			            		$(".top_mid").hide();
			            		$("#dialog-confirm").dialog( "close" );
							}else{
								$("#dialog-confirm").dialog( "close" );
								Log.dialog($.rtls.commons.dialog.title.error, $.rtls.device.message.delfail);
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
		$("#dialog-confirm").append($.rtls.device.message.delconfirm);
		$('#dialog-confirm').dialog('open');
		
	},
	config : function(rapId){
		Rap.$rcmMode = Rap.$rap.rcmMode;
		Rap.$alivePeriod = Rap.$rap.alivePeriod;
		Rap.$control = 0;
		$("#dialog-device").dialog({
			title : $.rtls.device.dialog.title[1]+"("+Rap.$rap.euidSrc+")",
	        width: "800",
	        bgiframe: true,
	        autoOpen: false,
	        modal: true,
	        resizable: false,
	        buttons: [{
	        	text : $.rtls.commons.button.ok,
				click: function() {
					$.validity.start();
					$.validity.setup({outputMode:"summary" });
					$("#masterCount", this).require($.rtls.validity.required('Master Count')).match("number", $.rtls.validity.match('number', 'Master Count')).range(1, 4, $.rtls.validity.range(1,4, 'Master Count'));
					$("#masterDistance", this).require($.rtls.validity.required('RCM Master'+$.rtls.device.form.distance));
					$("#masterEuid", this).require($.rtls.validity.select('Master RAP'));
					$("#alivePeriod", this).require($.rtls.validity.required('Alive Period')).match("number", $.rtls.validity.match('number', 'Alive Period')).range(120, 3600, $.rtls.validity.range(120, 3600, 'Alive Period'));
					var result = $.validity.end();
					if(result.valid){
						$.ajax({
							async : true,
							type: 'post',
							url: "/service/rap.json?action=config.rap",
							dataType: 'json',
				            data : { 
								"rapId" : Rap.$rap.rapId,
								"rcmMode" : Rap.$rcmMode,
								"pcNumber" : $("#pcNumber", this).val(),
								"gain" : $("#gain", this).val(),
								"reportTerm" : $("#reportTerm", this).val(),
								"masterCount" : $("#masterCount", this).val(),
								"masterDistance" : $("#masterDistance", this).val(),
								"masterEuid" : $("#masterEuid", this).val(),
								"masterDistance2" : $("#masterDistance2", this).val(),
								"masterEuid2" : $("#masterEuid2", this).val(),
								"masterDistance3" : $("#masterDistanc3e", this).val(),
								"masterEuid3" : $("#masterEuid3", this).val(),
								"masterDistance4" : $("#masterDistance4", this).val(),
								"masterEuid4" : $("#masterEuid4", this).val(),
								"alivePeriod" : $("#alivePeriod", this).val(),
								"control" : Rap.$control
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
				            		$("#dialog-device").dialog( "close" );
				            		$("#dialog-config").dialog({
				            			title : $.rtls.commons.dialog.title.ok,
				            	        width: "300",
				            	        bgiframe: true,
				            	        autoOpen: false,
				            	        modal: true,
				            	        resizable: false,
				            	        buttons: [{
				            	        	text : $.rtls.commons.button.cancel,
				            				click: function() {
				            					$( this ).dialog( "close" );
				            				}
				            			}],
				            			close: function() {
				            				$("#dialog-config").empty();
				            	        }
				            	        
				            	    });
				            		$("#dialog-config").html('<p style="text-align:center">'+$.rtls.device.message.config+'</p><p style="text-align:center"><img src="/resources/commons/images/icon/icon_load.gif"/></p>');
				            		$('#dialog-config').dialog('open');
				            		Rap.$configTimeout = setTimeout(function() {
				            			$("#dialog-config").html('<p style="text-align:center">'+$.rtls.device.message.configsuccess+'</p>');
				            		}, 5000);
								}else if(data.result == 'error.dead'){
									$("#dialog-device").dialog( "close" );
									Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.device.message.deadrap);
								}else{
									$("#dialog-device").dialog( "close" );
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.device.message.configfail);
								}
				        	
							}
						});
					}else{
						$("#dialog-message").dialog({
							title : $.rtls.commons.dialog.title.error,
					        width: "auto",
					        bgiframe: true,
					        autoOpen: false,
					        modal: true,
					        resizable: false,
					        buttons: [{
					        	text : $.rtls.commons.button.ok,
								click: function() {
									$( this ).dialog( "close" );
								}
							}],
							close: function() {
								$.validity.clear();
					        }
					        
					    });
						$("#dialog-message").prepend($("#validity"));
						$('#dialog-message').dialog('open');
					}
					
				},
	        },{
	        	text : $.rtls.commons.button.cancel,
				click: function() {
					$( this ).dialog( "close" );
				}
			}],
			open : function(){
				var pcnumField = '<select id="pcNumber">';
				for(var i=0; i < 10; i++){
					pcnumField += '<option value="'+i+'">'+i+'</option>';
				}
				pcnumField += '</select>';
				var gainField = '<select id="gain">';
				for(var i=0; i < 35; i++){
					gainField += '<option value="'+i+'">'+i+'</option>';
				}
				gainField += '</select>';
				var reportTermField = '<select id="reportTerm">';
				for(var i=0; i < 256; i++){
					reportTermField += '<option value="'+i+'">'+i+'</option>';
				}
				reportTermField += '</select>';
				var html = '<fieldset id="fields">';
				html += '<p><label>* Control</label>';
				html += '<ol id="control-selectable" class="ui-selectable">';
				html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Not Control </li>';
				html += '<li class="ui-widget-content" style="cursor:pointer"> Reset </li>';
				html += '</ol>';
				html += '</p>';
				html += '<p><label>* RCM Mode</label>';
				html += '<ol id="rcmmode-selectable" class="ui-selectable">';
				if(Rap.$rap.rcmMode == 1){
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Master </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Slave </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Anchor </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Tag </li>';	
				}else if(Rap.$rap.rcmMode == 2){
					html += '<li class="ui-widget-content" style="cursor:pointer"> Master </li>';
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Slave </li>';	
					html += '<li class="ui-widget-content" style="cursor:pointer"> Anchor </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Tag </li>';
				}else if(Rap.$rap.rcmMode == 3){
					html += '<li class="ui-widget-content" style="cursor:pointer"> Master </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Slave </li>';	
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Anchor </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Tag </li>';
				}else{
					html += '<li class="ui-widget-content" style="cursor:pointer"> Master </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Slave </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> Anchor </li>';
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Tag </li>';
				}
				
				html += '</ol>';
				html += '</p>';
				html += '<p><label>* PC Number</label>'+pcnumField+' <span>(RCM Preconfiguration number)</span></p>';
				html += '<p><label>* Gain</label>'+gainField+'dB <span>(RCM TX Gain)</span></p>';
				html += '<p><label>* Report Term</label>'+reportTermField+' <span>'+$.rtls.device.form.second+'(UWB Report Term)</span></p>';
				html += '<p><label>* Alive Period</label><input type="text" id="alivePeriod" style="width:100px; text-align:right"/>'+$.rtls.device.form.second+' (120 ~ 3600)</p>';
				html += '<p><label>* Master Count</label><input type="text" id="masterCount" style="width:40px; text-align:right"/>'+$.rtls.device.form.number+' (1 ~ 4)</p>';
				html += '<p><label>* Master EUID</label><input type="text" id="masterEuid" readonly="true"/><button id="but-master">'+$.rtls.device.button.select+'</button></p>';
				html += '<p><label>* Master EUID2</label><input type="text" id="masterEuid2" readonly="true"/><button id="but-master2">'+$.rtls.device.button.select+'</button></p>';
				html += '<p><label>* Master EUID3</label><input type="text" id="masterEuid3" readonly="true"/><button id="but-master3">'+$.rtls.device.button.select+'</button></p>';
				html += '<p><label>* Master EUID4</label><input type="text" id="masterEuid4" readonly="true"/><button id="but-master4">'+$.rtls.device.button.select+'</button></p>';
				html += '<p><label>* Master Distance</label><input type="text" id="masterDistance" />m <span>(RCM Master'+$.rtls.device.form.distance+')</span></p>';
				html += '<p><label>* Master Distance2</label><input type="text" id="masterDistance2" />m <span>(RCM Master2'+$.rtls.device.form.distance+')</span></p>';
				html += '<p><label>* Master Distance3</label><input type="text" id="masterDistance3" />m <span>(RCM Master3'+$.rtls.device.form.distance+')</span></p>';
				html += '<p><label>* Master Distance4</label><input type="text" id="masterDistance4" />m <span>(RCM Master4'+$.rtls.device.form.distance+')</span></p>';
				html += '</fieldset>';
				$(this).html(html);
				$("#masterEuid", this).addClass("input-readonly");
				$("#masterEuid", this).attr("maxlength", "16");
				$("#masterEuid2", this).addClass("input-readonly");
				$("#masterEuid2", this).attr("maxlength", "16");
				$("#masterEuid3", this).addClass("input-readonly");
				$("#masterEuid3", this).attr("maxlength", "16");
				$("#masterEuid4", this).addClass("input-readonly");
				$("#masterEuid4", this).attr("maxlength", "16");
				$("#pcNumber", this).val(Rap.$rap.pcNumber);
				$("#gain", this).val(Rap.$rap.gain);
				$("#reportTerm", this).val(Rap.$rap.reportTerm);
				$("#masterCount", this).val(Rap.$rap.masterCount);
				$("#masterDistance", this).val(Rap.$rap.masterDistance);
				$("#masterEuid", this).val(Rap.$rap.euidMaster);
				$("#masterDistance2", this).val(Rap.$rap.masterDistance2);
				$("#masterEuid2", this).val(Rap.$rap.euidMaster2);
				$("#masterDistance3", this).val(Rap.$rap.masterDistance3);
				$("#masterEuid3", this).val(Rap.$rap.euidMaster3);
				$("#masterDistance4", this).val(Rap.$rap.masterDistance4);
				$("#masterEuid4", this).val(Rap.$rap.euidMaster4);
				$("#alivePeriod", this).val(Rap.$rap.alivePeriod);
					
				$("#rcmmode-selectable", this).selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							Rap.$rcmMode = $( "#rcmmode-selectable li" ).index( this ) + 1;
						});		
					}
				});
				
				$("#control-selectable", this).selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							Rap.$control = $( "#control-selectable li" ).index( this );
						});		
					}
				});
				
				// Master Rap 선택选择
				$("#but-master", this).button({
					icons: {primary: "ui-icon-tag"}
				}).click(function() {
					$.ajax({
						async : true,
						type: 'GET',
						url: "/service/rap.json?action=get.raps",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"planId" : Rap.$plan.planId,
							"rcmMode" : 1
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	Rap.$masterRap = null;
			            	Rap.$masterRaps = data.raps;
			            	$("#dialog-master").dialog({
			        			title: 'Master RAP'+$.rtls.device.form.select,
			        			autoOpen: false,
			        			height: 400,
			        			width: 400,
			        			modal: true,
			        			buttons: [{
			        				text : $.rtls.commons.button.ok,
									click: function() {
			        					if(Rap.$masterRap != null){
			        						$("#dialog-device #fields #masterEuid").val(Rap.$masterRap.euidSrc);
			        						$("#dialog-master").dialog( "close" );
			        					}else{
			        						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.validity.select('Master RAP'));
			        						
			        					}
			        					
			        				},
			        			},{
			        				text : $.rtls.commons.button.cancel,
									click: function() {
			        					$( this ).dialog( "close" );
			        				}
			        			}],
			        			open: function() {
			        				var html = "<ol id='master-selectable' class='rap-selectable'>";
									for(var i=0; i < Rap.$masterRaps.length; i++){
										html += "<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_rap_master_30x30.png' style='float:left; padding-right:3px'/>"+Rap.$masterRaps[i].euidSrc+"</li>";
									}	
									html += "</ol>";
									$(this).html(html);
									$("#master-selectable", this).selectable({
										stop: function() {
											$( ".ui-selected", this ).each(function() {
												Rap.$masterRap = Rap.$masterRaps[$( "#master-selectable li" ).index( this )];
											});		
										}
									});
			        			},
			        			close: function() {
			        				$(this).html('');
			        				$("#dialog-master").empty();
			        			}
			        		});
			        		$( "#dialog-master" ).dialog( "open" );
						}
					});
					return false; 
				});
				
				$("#but-master2", this).button({
					icons: {primary: "ui-icon-tag"}
				}).click(function() {
					$.ajax({
						async : true,
						type: 'GET',
						url: "/service/rap.json?action=get.raps",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"planId" : Rap.$plan.planId,
							"rcmMode" : 1
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	Rap.$masterRap = null;
			            	Rap.$masterRaps = data.raps;
			            	$("#dialog-master").dialog({
			        			title: 'Master RAP2'+$.rtls.device.form.select,
			        			autoOpen: false,
			        			height: 400,
			        			width: 400,
			        			modal: true,
			        			buttons: [{
			        				text : $.rtls.commons.button.ok,
									click: function() {
			        					if(Rap.$masterRap != null){
			        						$("#dialog-device #fields #masterEuid2").val(Rap.$masterRap.euidSrc);
			        						$("#dialog-master").dialog( "close" );
			        					}else{
			        						Log.dialog($.rtls.commons.dialog.title.error,  $.rtls.validity.select('Master RAP'));
			        						
			        					}
			        					
			        				},
			        			},{
			        				text : $.rtls.commons.button.cancel,
									click: function() {
			        					$( this ).dialog( "close" );
			        				}
			        			}],
			        			open: function() {
			        				var html = "<ol id='master-selectable' class='rap-selectable'>";
									for(var i=0; i < Rap.$masterRaps.length; i++){
										html += "<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_rap_master_30x30.png' style='float:left; padding-right:3px'/>"+Rap.$masterRaps[i].euidSrc+"</li>";
									}	
									html += "</ol>";
									$(this).html(html);
									$("#master-selectable", this).selectable({
										stop: function() {
											$( ".ui-selected", this ).each(function() {
												Rap.$masterRap = Rap.$masterRaps[$( "#master-selectable li" ).index( this )];
											});		
										}
									});
			        			},
			        			close: function() {
			        				$(this).html('');
			        				$("#dialog-master").empty();
			        			}
			        		});
			        		$( "#dialog-master" ).dialog( "open" );
						}
					});
					return false; 
				});
				
				$("#but-master3", this).button({
					icons: {primary: "ui-icon-tag"}
				}).click(function() {
					$.ajax({
						async : true,
						type: 'GET',
						url: "/service/rap.json?action=get.raps",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"planId" : Rap.$plan.planId,
							"rcmMode" : 1
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	Rap.$masterRap = null;
			            	Rap.$masterRaps = data.raps;
			            	$("#dialog-master").dialog({
			        			title: 'Master RAP3'+$.rtls.device.form.select,
			        			autoOpen: false,
			        			height: 400,
			        			width: 400,
			        			modal: true,
			        			buttons: [{
			        				text : $.rtls.commons.button.ok,
									click: function() {
			        					if(Rap.$masterRap != null){
			        						$("#dialog-device #fields #masterEuid3").val(Rap.$masterRap.euidSrc);
			        						$("#dialog-master").dialog( "close" );
			        					}else{
			        						Log.dialog($.rtls.commons.dialog.title.error,  $.rtls.validity.select('Master RAP'));
			        						
			        					}
			        					
			        				},
			        			},{
			        				text : $.rtls.commons.button.cancel,
									click: function() {
			        					$( this ).dialog( "close" );
			        				}
			        			}],
			        			open: function() {
			        				var html = "<ol id='master-selectable' class='rap-selectable'>";
									for(var i=0; i < Rap.$masterRaps.length; i++){
										html += "<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_rap_master_30x30.png' style='float:left; padding-right:3px'/>"+Rap.$masterRaps[i].euidSrc+"</li>";
									}	
									html += "</ol>";
									$(this).html(html);
									$("#master-selectable", this).selectable({
										stop: function() {
											$( ".ui-selected", this ).each(function() {
												Rap.$masterRap = Rap.$masterRaps[$( "#master-selectable li" ).index( this )];
											});		
										}
									});
			        			},
			        			close: function() {
			        				$(this).html('');
			        				$("#dialog-master").empty();
			        			}
			        		});
			        		$( "#dialog-master" ).dialog( "open" );
						}
					});
					return false; 
				});
				
				$("#but-master4", this).button({
					icons: {primary: "ui-icon-tag"}
				}).click(function() {
					$.ajax({
						async : true,
						type: 'GET',
						url: "/service/rap.json?action=get.raps",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"planId" : Rap.$plan.planId,
							"rcmMode" : 1
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	Rap.$masterRap = null;
			            	Rap.$masterRaps = data.raps;
			            	$("#dialog-master").dialog({
			        			title:'Master RAP4'+$.rtls.device.form.select,
			        			autoOpen: false,
			        			height: 400,
			        			width: 400,
			        			modal: true,
			        			buttons: [{
			        				text : $.rtls.commons.button.ok,
									click: function() {
			        					if(Rap.$masterRap != null){
			        						$("#dialog-device #fields #masterEuid4").val(Rap.$masterRap.euidSrc);
			        						$("#dialog-master").dialog( "close" );
			        					}else{
			        						Log.dialog($.rtls.commons.dialog.title.error,  $.rtls.validity.select('Master RAP'));
			        						
			        					}
			        					
			        				},
			        			},{
			        				text : $.rtls.commons.button.cancel,
									click: function() {
			        					$( this ).dialog( "close" );
			        				}
			        			}],
			        			open: function() {
			        				var html = "<ol id='master-selectable' class='rap-selectable'>";
									for(var i=0; i < Rap.$masterRaps.length; i++){
										html += "<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_rap_master_30x30.png' style='float:left; padding-right:3px'/>"+Rap.$masterRaps[i].euidSrc+"</li>";
									}	
									html += "</ol>";
									$(this).html(html);
									$("#master-selectable", this).selectable({
										stop: function() {
											$( ".ui-selected", this ).each(function() {
												Rap.$masterRap = Rap.$masterRaps[$( "#master-selectable li" ).index( this )];
											});		
										}
									});
			        			},
			        			close: function() {
			        				$(this).html('');
			        				$("#dialog-master").empty();
			        			}
			        		});
			        		$( "#dialog-master" ).dialog( "open" );
						}
					});
					return false; 
				});
			},
			close: function() {
				$(this).html('');
				$("#dialog-device").empty();
	        }
	        
	    });
		$('#dialog-device').dialog('open');
		
	}
	
};