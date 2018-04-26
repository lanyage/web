var Rap = {
	$rcmMode : 0,
	$item : null, $items : null, 
	$map : null, $markers : new HashMap(),
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[2].title+'</span><span class="bg">'+$.rtls.menu[2].sub[4]+'</span>');
		this.initMap();
		this.status();
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
	status : function(){
		$('#rap-status').html('');
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/rap.json?action=get.raps",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				"planId" : 100,
				"rcmMode" : Rap.$rcmMode
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Rap.$items = data.raps;
				if(Rap.$items.length == 0){
            		$('#rap-status').append("<center>"+$.rtls.device.list.empty+"<center>");
    			}else{
    				var latlon  = new google.maps.LatLng(Rap.$items[0].latitude, Rap.$items[0].longitude);
		            Rap.$map.setCenter(latlon);
			        
    				var item;
    				var html = "", euid="", network = "";
    				var x = 0, y = 0;
    				var masters = new Array();
    				for(var i=0; i < Rap.$items.length; i++){
    					item = Rap.$items[i];
    					euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length);
    					if(item.networkType == '1'){
    						network = 'ethernet';
    					}else if(item.networkType == '2'){
    						network = 'wifi';
    					}else if(item.networkType == '3'){
    						network = 'lte';
    					}
    					
						
						if(item.status == 'alive'){
    						html += "<div id='dev_"+item.euidSrc+"' class='rap-box-alive' style='cursor:pointer' onclick=\"Rap.selectItem('"+item.euidSrc+"')\">";	
    					}else{
    						html += "<div id='dev_"+item.euidSrc+"' class='rap-box-dead' style='cursor:pointer' onclick=\"Rap.selectItem('"+item.euidSrc+"')\">";
    					}
						if(item.rcmMode == '1'){
							if(item.status == 'alive'){
								html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_master_30x30.png' border='0' style='vertical-align: middle;'/> <b>RAP("+euid+")</b><br>";
							}else{
								html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_dead_30x30.png' border='0' style='vertical-align: middle;'/> <b>RAP("+euid+")</b><br>";
							}
	    					
						}else{
							if(item.status == 'alive'){
								if(item.masterStatus == '0'){
									html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_error_30x30.png' border='0' style='vertical-align: middle;'/> <b>RAP("+euid+")</b><br>";	
								}else{
									html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png' border='0' style='vertical-align: middle;'/> <b>RAP("+euid+")</b><br>";
								}
									
							}else{
								html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_dead_30x30.png' border='0' style='vertical-align: middle;'/> <b>RAP("+euid+")</b><br>";	
							}
							
    						
						}
						html += "<p><img src='/resources/commons/images/icon/icon_dot_green.gif' border='0'/>IP : "+item.ip+"</p>";
						html += "<p><img src='/resources/commons/images/icon/icon_dot_green.gif' border='0'/>详细报告 : "+item.reportTerm+"";
						html += "<p><img src='/resources/commons/images/icon/icon_dot_green.gif' border='0'/>电脑编号 : "+item.pcNumber+"</p>";
    					html += "<p><img src='/resources/commons/images/icon/icon_dot_green.gif' border='0'/>增益 : "+item.gain+"</p>";
    					html += "<p><img src='/resources/commons/images/icon/icon_dot_green.gif' border='0'/>版本 : "+item.version+"</p>";
    					html += "<p><img src='/resources/commons/images/icon/icon_dot_green.gif' border='0'/>固件 : "+item.firmwareVersion+"</p>";
    					html += "<p><img src='/resources/commons/images/icon/icon_dot_green.gif' border='0'/>活跃的时间 : "+item.alivePeriod+"</p>";
    					html += "<p><img src='/resources/commons/images/icon/icon_dot_green.gif' border='0'/>时间 : "+item.aliveTime.msdate()+"</p>";
    					html += "</div>";
    					
    					Rap.addMarker(item);
    				}
    				$('#rap-status').html(html);
    			}
            	
			}
		});
		
	},
	addMarker : function(rap){
		var euid = rap.euidSrc.substring(rap.euidSrc.length-4, rap.euidSrc.length);
		var network = '';
		if(rap.networkType == '1'){
			network = 'ethernet';
		}else if(rap.networkType == '2'){
			network = 'wifi';
		}else if(rap.networkType == '3'){
			network = 'lte';
		}
		var iconURL = '';
		if(rap.rcmMode == '1'){
			if(rap.status == 'alive'){
				iconURL = "/resources/commons/images/map/icon_rap_"+network+"_master_30x30.png";
			}else{
				iconURL = "/resources/commons/images/map/icon_rap_"+network+"_dead_30x30.png";
			}
		}else{
			if(rap.status == 'alive'){
				if(rap.masterStatus == '0'){
					iconURL = "/resources/commons/images/map/icon_rap_"+network+"_error_30x30.png";	
				}else{
					iconURL = "/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png";
				}
					
			}else{
				iconURL = "/resources/commons/images/map/icon_rap_"+network+"_dead_30x30.png";	
			}
		}
		var icon = new google.maps.MarkerImage(iconURL, new google.maps.Size(30, 30));
		var marker = new MarkerWithLabel({ 
		    map: Rap.$map, 
		    title: rap.euidSrc+'',
		    icon : icon,
		    animation: google.maps.Animation.DROP, 
		    position: new google.maps.LatLng(rap.latitude, rap.longitude),
			labelText: euid,
			labelAnchor: new google.maps.Point(0, 30),
			labelClass: "labels", 
		    labelInBackground: false
		});
		google.maps.event.addListener(marker, "click", function (e) { 
			Rap.itemSelect(marker.title);
		});
		Rap.$markers.put(rap.euidSrc, marker);
		
	},
	selectItem : function(id){ 
		$('#rap-status').children().each(function(){
			$(this).removeClass('rap-box-selected');
		});
		$('#dev_'+id).addClass('rap-box-selected');
		for(var i=0; i < Rap.$items.length; i++){
			if('dev_'+Rap.$items[i].euidSrc == id){
				var latlon  =  new google.maps.LatLng(Rap.$items[i].latitude, Rap.$items[i].longitude);
		        Rap.$map.setCenter(latlon);
				break;
			}
		}
		this.markerSelect(id);
	},
	itemSelect : function(id){ //  Call function from Map
		$('#rap-status').children().each(function(){
			$(this).removeClass('rap-box-selected');
		});
		$('#dev_'+id).addClass('rap-box-selected');
		this.markerSelect(id);
		
	},
	markerSelect : function(id){
		var rap = null, network = '';
		var markers = Rap.$markers.values();
		for(var  i=0; i < markers.length; i++){
			for(var  j=0; j < Rap.$items.length; j++){
	    		rap = Rap.$items[j];
	    		if(rap.euidSrc = markers[i].title){
	    			if(rap.networkType == '1'){
						network = 'ethernet';
					}else if(rap.networkType == '2'){
						network = 'wifi';
					}else if(rap.networkType == '3'){
						network = 'lte';
					}
					var iurl = '';
					if(rap.euidSrc == id){
						if(rap.rcmMode == 1){
							iurl = "/resources/commons/images/map/icon_rap_master_selected_30x30.png"
						}else if(rap.rcmMode == 2){
							iurl = "/resources/commons/images/map/icon_rap_slave_selected_30x30.png"
						}else if(rap.rcmMode == 3){
							iurl = "/resources/commons/images/map/icon_rap_slave_selected_30x30.png"
						}
		    			
					}else{
						if(rap.rcmMode == '1'){
							if(rap.status == 'alive'){
								iurl = "/resources/commons/images/map/icon_rap_"+network+"_master_30x30.png";
							}else{
								iurl = "/resources/commons/images/map/icon_rap_"+network+"_dead_30x30.png";
							}
						}else{
							if(rap.status == 'alive'){
								if(rap.masterStatus == '0'){
									iurl = "/resources/commons/images/map/icon_rap_"+network+"_error_30x30.png";	
								}else{
									iurl = "/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png";
								}
									
							}else{
								iurl = "/resources/commons/images/map/icon_rap_"+network+"_dead_30x30.png";	
							}
						}
					}
					var icon = new google.maps.MarkerImage(iurl, new google.maps.Size(30, 30));
					markers[i].setIcon(icon);
					break;
	    		}
			}
		}
	},
	
};