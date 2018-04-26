var Rap = {
	$map : null,  $markers : [], $marker : null,
	$rapType : 0,
	$raps : [], $rap : {}, 
	$addRaps : [], $addRap : {},
	$masterRap : null,  $masterRaps : new Array(),
	$rcmMode : 0, $control : 0, $alivePeriod : 0,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[1].title+'</span><span class="bg">'+$.rtls.menu[1].sub[8]+'</span>');
		$('.top_right').html(
			'<button id="but-add-rap">'+$.rtls.device.button.add+'</button>'
		);
		$("#but-add-rap").button({
			icons: {primary: "ui-icon-plus"}
		}).click(function() {
			Rap.getAddRaps();
			return false;
		});
		this.initMap();
		this.getRaps();
	},	
	initMap : function(){
		var latlng = new google.maps.LatLng(37.56621, 126.9779); 
		var options = {
			zoom : 16, 
			center : latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP 
		};
		Rap.$map = new google.maps.Map(document.getElementById('viewport'), options); 
	},
	getRaps : function(){
		$.ajax({
			async : false,
			type: 'GET',
			url: "/service/rap.json?action=get.raps",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"planId" : 100
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	for(var  i=0; i < Rap.$markers.length; i++){
            		Rap.$markers[i].setMap(null);
            	}
            	Rap.$markers = [];
            	Rap.$raps = data.raps;
            	$('.top_left').html($.rtls.device.list.top(Rap.$raps.length));
            	if(Rap.$raps.length > 0){
    				var latlon  = new google.maps.LatLng(Rap.$raps[0].latitude, Rap.$raps[0].longitude);
			        Rap.$map.setCenter(latlon, 16 );
			        
    				var feature = null, drag = null; 
    				var item = {};
    				var euid = '', network = '';
    				var html = "<ol id='item-selectable' class='rap-selectable'>";	
    				for(var i=0; i < Rap.$raps.length; i++){
    					item = Rap.$raps[i];
    					euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length);
    					if(item.networkType == '1'){
    						network = 'ethernet';
    					}else if(item.networkType == '2'){
    						network = 'wifi';
    					}else if(item.networkType == '3'){
    						network = 'lte';
    					}
    					var iconURL = '';
						if(item.rcmMode == 1){
							iconURL = "/resources/commons/images/map/icon_rap_"+network+"_master_30x30.png"
							html += "<li class='ui-widget-content' id='"+item.euidSrc+"'><img src='"+iconURL+"'  style='float:left; padding-right:3px'/>"+euid+"</li>";
						}else if(item.rcmMode == 2){
							iconURL = "/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png"
							html += "<li class='ui-widget-content' id='"+item.euidSrc+"'><img src='"+iconURL+"'  style='float:left; padding-right:3px'/>"+euid+"</li>";
						}else if(item.rcmMode == 3){
							iconURL = "/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png"
							html += "<li class='ui-widget-content' id='"+item.euidSrc+"'><img src='"+iconURL+"' style='float:left; padding-right:3px'/>"+euid+"</li>";
						}
						Rap.addMarker(iconURL, item.euidSrc, item.latitude, item.longitude);
			        }
    				html += "</ol>";
					$('#map-items').html(html);
					
					$("#item-selectable", "#map-items").selectable({
						stop: function() {
							$( ".ui-selected", this ).each(function() {
								var id = $(this).attr('id');
								Rap.modForm(id);
								var latlon  = new google.maps.LatLng(Rap.$rap.latitude, Rap.$rap.longitude);
					            Rap.$map.setCenter(latlon);
							});		
						}
					});
					
					
    			}
			}
		});
		
	},
	addMarker :  function(iconURL , euid, latitude, longitude){
		var icon = new google.maps.MarkerImage(iconURL, new google.maps.Size(30, 30));
		var marker = new google.maps.Marker({ 
		    map: Rap.$map, 
		    title: euid,
		    icon : icon,
		    draggable:true, 
		    animation: google.maps.Animation.DROP, 
		    position: new google.maps.LatLng(latitude, longitude), 
		}); 
		google.maps.event.addListener(marker, 'click', function() {
		    Rap.modForm(marker.title);
		});
		google.maps.event.addListener(marker, 'dragend', function(){
		    var position = marker.getPosition();
		    $('#item-form #latitude').val(position.lat());
            $('#item-form #longitude').val(position.lng());
		});
		Rap.$markers.push(marker);
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
		       						Rap.addForm();
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
	       					var item = null;
	       					var euid = '', network = '';
	       					var x =0, y =0;
	       					var html = "<ol id='item-selectable'  class='rap-selectable'>";	
	           				for(var i=0; i < Rap.$addRaps.length; i++){
	           					item = Rap.$addRaps[i];
	           					euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length);
	           					if(item.networkType == '1'){
	        						network = 'ethernet';
	        					}else if(item.networkType == '2'){
	        						network = 'wifi';
	        					}else if(item.networkType == '3'){
	        						network = 'lte';
	        					}
	        					x = Math.round(item.localX);
	        					y = Math.round(item.localY);
	        					if(item.rcmMode == 1){
	    							html += "<li class='ui-widget-content' id='"+item.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_master_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
	    						}else if(item.rcmMode == 2){
	    							html += "<li class='ui-widget-content' id='"+item.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
	    						}else if(item.rcmMode == 3){
	    							html += "<li class='ui-widget-content' id='"+item.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
	    						}
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
	       							});		
	       						} 
	       					});
	       				},
	       				close: function() {
	       					$("#dialog-panel").empty();
	       				}
	       			});
	       			$( "#dialog" ).dialog( "open" ).parent('.ui-dialog').css('zIndex',9999);
	       		}
			}
		});
    	
 	},
 	addForm : function(){
 		var html = "<fieldset id='fields' style='width:98%'>";
 		html += "<div style='float:left'><label style='width:50px'>EUID</label><span class='text'>"+Rap.$addRap.euidSrc+"</span></div>";
		html += "<div style='float:left'><label style='width:50px'>IP</label><span class='text'>"+Rap.$addRap.ip+"</span></div>";
 		html += "<div style='float:left'>";
		html += "	<label style='width:50px'>"+$.rtls.device.form.point+"</label>";
		html += " 	<input type='text' id='latitude' value='' style='width:150px;text-align:center' placeholder='"+$.rtls.device.form.latitude+"'/> ";
		html += " 	<input type='text' id='longitude' value='' style='width:150px;text-align:center' placeholder='"+$.rtls.device.form.longitude+"'/>";
		html += " 	<input type='text' id='address' value='' style='width:150px;text-align:center'  placeholder='点/区/洞'/><button id='but_search'>"+$.rtls.device.button.search+"</button><br>";
		html += "</div>";
		html += "<div style='float:left'>";
		html += "	<label style='width:50px'>"+$.rtls.device.form.isAp+"</label>";
		html += "	<input type='checkbox' id='isAP' name='isAP' value='false'/>";	
		html += "</div>";
		html += "<div style='float:left'>";
		html += "	<label style='width:80px'>"+$.rtls.device.form.networkType+"</label>";
		html += "	<select id='networkType'>";				
		html += "		<option value='1'>有线</option>";
		html += "		<option value='2'>无线</option>";
		html += "		<option value='3' selected>3G网络</option>";
		html += "	</select>";
		html += "</div>";
		html += "<div style='float:left'><label style='width:50px'>"+$.rtls.device.form.description+"</label><input type='text' id='description' value=''/></div>";
		html += "<div style='float:left'>";
		html += "	<button id='but-mod'>"+$.rtls.device.button.add+"</button> ";
		html += "	<button id='but-cancel'>"+$.rtls.device.button.cancel+"</button>";
		html += "	<span id='result'></span> ";
		html += "</div>";
		html += "</fieldset> ";
		$("#item-form").html(html);
		$("#item-form").show();
		$('#networkType').val(Rap.$addRap.networkType);
		$('#description').val(Rap.$addRap.description);
		
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
		
		$("#but-mod").button({
			icons: {primary: "ui-icon-plus"}
		}).click(function() {
			Rap.mod(Rap.$addRap.rapId);
		});
		$("#but-cancel").button({
			icons: {primary: "ui-icon-cancel"}
		}).click(function() {
			Rap.cancel(Rap.$addRap.rapId);
			return false;
		});
		
		$("#but_search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			$.validity.start();
			$.validity.setup({outputMode:"summary" });
			$("#fields #address").require($.rtls.device.message.searchaddress);
			var result = $.validity.end();
			if(result.valid){
				var geocoder = new google.maps.Geocoder();
				geocoder.geocode( { 'address': $('#address').val()}, function(results, status) {
		            if (status == google.maps.GeocoderStatus.OK) {
		            	var network = '';
		            	if(Rap.$addRap.networkType == '1'){
    						network = 'ethernet';
    					}else if(Rap.$addRap.networkType == '2'){
    						network = 'wifi';
    					}else if(Rap.$addRap.networkType == '3'){
    						network = 'lte';
    					}
		            	var icon = new google.maps.MarkerImage('/resources/commons/images/map/icon_rap_'+network+'_slave_30x30.png', new google.maps.Size(30, 30));
						var location =  results[0].geometry.location;
						Rap.$map.setCenter(location);
    					Rap.$marker = new google.maps.Marker({
                            map: Rap.$map,
                            icon: icon,
                            title: Rap.$addRap.euidSrc,
                            draggable:true,
                            animation: google.maps.Animation.DROP,
                            position: location
                        });
    					google.maps.event.addListener(Rap.$marker, 'dragend', function(){
    					    var position = Rap.$marker.getPosition();
    					    $('#item-form #latitude').val(position.lat());
    		                $('#item-form #longitude').val(position.lng());
    					});

		                $('#item-form #latitude').val(location.lat());
		                $('#item-form #longitude').val(location.lng());
		                $('#item-form #result').html('');
		            } else {
		            	$('#item-form #result').html($.rtls.device.message.emptydata);
		            }
		        });
				
				
			}
			
		});
 	},
 	modForm : function(euid){ //  Call function from Map
 		$('li', '#item-selectable').removeClass('ui-selected');
		$('#'+euid, '#item-selectable').addClass('ui-selected');
		var html = "<fieldset id='fields' style='width:98%'>";
		var item;
		for(var i=0; i < Rap.$raps.length; i++){
			item = Rap.$raps[i];
			Rap.$rap = item;
			if(item.euidSrc == euid){
				html += "<div style='float:right'>";
				html += "	<button id='but-mod'>"+$.rtls.device.button.mod+"</button>";
				html += "	<button id='but-del'>"+$.rtls.device.button.del+"</button>";
				html += "	<button id='but-config'>"+$.rtls.device.button.config+"</button>";
				html += "	<span id='result'></span> ";
				html += "</div>";
				html += "<div style='clear:both;float:left'><label style='width:50px'>EUID</label><span class='text'>"+item.euidSrc+"</span></div>";
				html += "<div style='float:left'><label style='width:50px'>IP</label><span class='text'>"+item.ip+"</span></div>";
				html += "<div style='float:left'>";
				html += "	<label style='width:50px'>"+$.rtls.device.form.point+"</label>";
				html += " 	<input type='text' id='latitude' value='"+item.latitude+"' style='width:120px;text-align:center' placeholder='"+$.rtls.device.form.latitude+"'/>, ";
				html += " 	<input type='text' id='longitude' value='"+item.longitude+"' style='width:120px;text-align:center' placeholder='"+$.rtls.device.form.longitude+"'/>";
				html += "</div>";
				html += "<div style='float:left'>";
				html += "	<label style='width:50px'>"+$.rtls.device.form.isAp+"</label>";
				if(item.isAP == 'true'){
					html += "<input type='checkbox' id='isAP' name='isAP' value='true' checked/>";	
				}else{
					html += "<input type='checkbox' id='isAP' name='isAP' value='false'/>";
				}
				html += "</div>";
				html += "<div style='float:left'>";
				html += "	<label style='width:80px'>"+$.rtls.device.form.networkType+"</label>";
				html += "	<select id='networkType'>";				
				if(item.networkType == '1'){
					html += "<option value='1' selected>有线</option>";
					html += "<option value='2'>无线</option>";
					html += "<option value='3'>3G网络</option>";
				}else if(item.networkType == '2'){
					html += "<option value='1'>有线</option>";
					html += "<option value='2' selected>无线</option>";
					html += "<option value='3'>3G网络</option>";
				}else if(item.networkType == '3'){
					html += "<option value='1'>有线</option>";
					html += "<option value='2'>无线</option>";
					html += "<option value='3' selected>3G网络</option>";
				}else{
					html += "<option value='1' selected>有线</option>";
					html += "<option value='2'>无线</option>";
					html += "<option value='3'>3G网络</option>";
				}
				html += "	</select>";
				html += "</div>";
				html += "<div style='float:left'><label style='width:50px'>"+$.rtls.device.form.description+"</label><input type='text' id='description' value='"+item.description+"'/></div>";
				Rap.$rap = item;
				break;
			}
		}
		html += "</fieldset> ";
		$("#item-form").html(html);
		$("#item-form").show();
		
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
		$("#but-mod").button({
			icons: {primary: "ui-icon-check"}
		}).click(function() {
			Rap.mod(item.rapId)
			return false;
		});
		$("#but-del").button({
			icons: {primary: "ui-icon-minus"}
		}).click(function() {
			Rap.del(item.rapId);
			return false;
		});
		$("#but-config").button({
			icons: {primary: "ui-icon-gear"}
		}).click(function() {
			Rap.config(item.rapId);
			return false;
		});
		
		var rap = {}, network = '';
	    for(var  i=0; i < Rap.$markers.length; i++){
	    	for(var  j=0; j < Rap.$raps.length; j++){
	    		rap = Rap.$raps[j];
	    		if(rap.euidSrc == Rap.$markers[i].title){
	    			if(rap.networkType == '1'){
						network = 'ethernet';
					}else if(rap.networkType == '2'){
						network = 'wifi';
					}else if(rap.networkType == '3'){
						network = 'lte';
					}
					var iurl = '';
					if(rap.euidSrc == euid){
						if(rap.rcmMode == 1){
							iurl = "/resources/commons/images/map/icon_rap_master_selected_30x30.png"
						}else if(rap.rcmMode == 2){
							iurl = "/resources/commons/images/map/icon_rap_slave_selected_30x30.png"
						}else if(rap.rcmMode == 3){
							iurl = "/resources/commons/images/map/icon_rap_slave_selected_30x30.png"
						}
		    			
					}else{
						if(rap.rcmMode == 1){
							iurl = "/resources/commons/images/map/icon_rap_"+network+"_master_30x30.png"
						}else if(rap.rcmMode == 2){
							iurl = "/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png"
						}else if(rap.rcmMode == 3){
							iurl = "/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png"
						}
					}
					var icon = new google.maps.MarkerImage(iurl, new google.maps.Size(30, 30));
					Rap.$markers[i].setIcon(icon);
					break;
	    		}
	    	}
    		
    	}
	},
	mod : function(rapId){
		if(Rap.$addRap != null && Rap.$marker != null){
			Rap.$marker.setMap(null);
		}
		var latitude = $('#item-form #latitude').val();
		var longitude = $('#item-form #longitude').val();
		if(!$.string(latitude).blank() && !$.string(longitude).blank()){
			$.ajax({
				async : true,
				type: 'post',
				url: "/service/rap.json?action=mod.rap.out",
				dataType: 'json',
	            data : { 
	            	"planId" : 100,
	            	"rapId" : rapId,
	            	"latitude" : latitude,
	            	"longitude" : longitude,
	            	"isAP" : $("#isAP").val(),
	            	"networkType" : $('#networkType', '#item-form').val(),
	            	"description" : $('#description', '#item-form').val()
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
	            		Rap.getRaps();
	            		$('#item-form').html('');
	            		$('#item-form').hide();
					}else{
						$("#result", '#item-form').html("<span style='color:red'>"+$.rtls.device.message.modfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
					}
	        	
				}
			});
		}else{
			$("#result", '#item-form').html("<span style='color:red'>"+$.rtls.validity.required($.rtls.device.form.point)+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
		}
		
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
			            		$("#item-form").hide();
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
								"group" : $("#group", this).val(),
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
				            		Log.dialog($.rtls.commons.dialog.title.ok, $.rtls.device.message.configsuccess);
				            		Rap.getRaps();
				            		$("#dialog-device").dialog( "close" );
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
				var groupField = '<select id="group">';
				for(var i=0; i < 256; i++){
					groupField += '<option value="'+i+'">'+i+'</option>';
				}
				groupField += '</select>';
				var html = '<fieldset id="fields">';
				html += '<p><label>* 控制</label>';
				html += '<ol id="control-selectable" class="ui-selectable">';
				html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> 不能控制 </li>';
				html += '<li class="ui-widget-content" style="cursor:pointer"> 重置 </li>';
				html += '</ol>';
				html += '</p>';
				html += '<p><label>* RCM 模式</label>';
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
				html += '<p><label>* Group</label>'+groupField+' <span>(RCM Group Number)</span></p>';
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
				$("#group", this).val(Rap.$rap.group);
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
				
				// Master Rap 선택
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
							"planId" : 100,
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
							"planId" : 100,
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
							"planId" : 100,
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
							"planId" : 100,
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
		
	},
	cancel : function(){
		Rap.$vectorLayer.removeFeatures(Rap.$vectorLayer.getFeatureById('rap'));
		$('#item-form').html('');
	},
	cancelForm : function(feature){
		
	},
};