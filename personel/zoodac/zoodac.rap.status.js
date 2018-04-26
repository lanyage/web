var Rap = {
	$id : 'rap', $map : null,	
	$rcmMode : 0,
	$plan : null, $plans : null,	
	$item : null, $items : null, 
	$textOptions : {'font-size':'14px', 'fill':'#000000', 'font-weight':'bold'},
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[2].title+'</span><span class="bg">'+$.rtls.menu[2].sub[0]+'</span>');
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
            	Rap.$plans = data.plans;
            	var item, html;
            	for(var i=0; i < Rap.$plans.length; i++){
					item = Rap.$plans[i];
					html = "<li id='"+i+"' class='ui-state-default ui-corner-top' onmouseover='Rap.tabOver("+i+")' onmouseout='Rap.tabOut("+i+")'>" +
					"<a href=\"javascript:Rap.tabSelect("+i+")\"> "+item.name+"</a>" +
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
		this.$map = new Map({
			plan : Rap.$plan, 
			view : {isRuler : true, isGrid : true, isTool : true},
			tool : {isPointer : true, isDistance : true, isGrid : true, isRuler : false},
			isEvent : true,
			target : this
		});
		
		Rap.status();
		
	},
	
	status : function(){
		$('#rap-status').html('');
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/rap.json?action=get.rap.status",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				"planId" : Rap.$plan.planId,
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
    					x = parseInt(item.localX) - 10;
    					y = parseInt(item.localY) - 10;
						if(item.rcmMode == 1){
							masters.push(item);
							if(item.status == 'alive'){
								item.marker = '<p id="dev_'+item.rapId+'" name="marker" class="icon-rap-'+network+'-master" title="'+euid+'" type="'+item.rcmMode+'" network="'+network+'" status="'+item.status+'" masterstatus="1" localX="'+x+'" localY="'+y+'" style="top:'+y+'px; left:'+x+'px"></p>';	
							}else{
								item.marker = '<p id="dev_'+item.rapId+'" name="marker" class="icon-rap-'+network+'-dead" title="'+euid+'" type="'+item.rcmMode+'" network="'+network+'" status="'+item.status+'" masterstatus="1" localX="'+x+'" localY="'+y+'" style="top:'+y+'px; left:'+x+'px"></p>';
							}
							
							
						}else{
							if(item.status == 'alive'){
								if(item.masterStatus == '0'){
									item.marker = '<p id="dev_'+item.rapId+'" name="marker" class="icon-rap-'+network+'-error" title="'+euid+'" type="'+item.rcmMode+'" network="'+network+'" status="'+item.status+'" masterstatus="'+item.masterStatus+'" localX="'+x+'" localY="'+y+'" style="top:'+y+'px; left:'+x+'px"></p>';
								}else{
									item.marker = '<p id="dev_'+item.rapId+'" name="marker" class="icon-rap-'+network+'-slave" title="'+euid+'" type="'+item.rcmMode+'" network="'+network+'" status="'+item.status+'" masterstatus="'+item.masterStatus+'" localX="'+x+'" localY="'+y+'" style="top:'+y+'px; left:'+x+'px"></p>';
								}
								
							}else{
								item.marker = '<p id="dev_'+item.rapId+'" name="marker" class="icon-rap-'+network+'-dead" title="'+euid+'" type="'+item.rcmMode+'" network="'+network+'" status="'+item.status+'" localX="'+x+'" localY="'+y+'" style="top:'+y+'px; left:'+x+'px"></p>';
							}
							
	    				}
						item.id = 'dev_'+item.rapId;
						Rap.$map.marker.add(item, true, false, Rap);
						if(item.status == 'alive'){
    						html += "<div id='dev_"+item.rapId+"' class='rap-box-alive' style='cursor:pointer' onclick=\"Rap.selectItem('dev_"+item.rapId+"')\">";	
    					}else{
    						html += "<div id='dev_"+item.rapId+"' class='rap-box-dead' style='cursor:pointer' onclick=\"Rap.selectItem('dev_"+item.rapId+"')\">";
    					}
						if(item.rcmMode == '1'){
							if(item.status == 'alive'){
								html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_master_30x30.png' border='0' style='vertical-align: middle;'/> <b>基站("+euid+")</b><br>";
							}else{
								html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_dead_30x30.png' border='0' style='vertical-align: middle;'/> <b>基站("+euid+")</b><br>";
							}
	    					
						}else{
							if(item.status == 'alive'){
								if(item.masterStatus == '0'){
									html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_error_30x30.png' border='0' style='vertical-align: middle;'/> <b>基站("+euid+")</b><br>";	
								}else{
									html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png' border='0' style='vertical-align: middle;'/> <b>基站("+euid+")</b><br>";
								}
									
							}else{
								html += "<img src='/resources/commons/images/map/icon_rap_"+network+"_dead_30x30.png' border='0' style='vertical-align: middle;'/> <b>基站("+euid+")</b><br>";	
							}
							
    						
						}
						html += "<p><img src='' border='0'/>IP : "+item.ip+"</p>";
						html += "<p><img src='' border='0'/>报告期 : "+item.reportTerm+"";
						html += "<p><img src='' border='0'/>计算机数量 : "+item.pcNumber+"</p>";
    					html += "<p><img src=''/>增益 : "+item.gain+"</p>";
    					html += "<p><img src='' border='0'/>版本 : "+item.version+"</p>";
    					html += "<p><img src='' border='0'/>固件 : "+item.firmwareVersion+"</p>";
    					html += "<p><img src='' border='0'/>生命周期: "+item.alivePeriod+"</p>";
    					if(item.status == 'alive'){
    						if(item.rcmMode == '1'){
        						html += "<p><img src='' border='0'/>超宽带状态 : <span style='color:blue'>"+$.rtls.device.status.normal+"</span></p>";
        					}else{
        						if(item.masterStatus == '0'){
            						html += "<p><img src='' border='0'/>超宽带状态 : <span style='color:red'>"+$.rtls.device.status.fault+"</span></p>";
            					}else{
            						html += "<p><img src='' border='0'/>超宽带状态 : <span style='color:blue'>"+$.rtls.device.status.normal+"</span></p>";
            					}
        					}	
    					}else{
    						html += "<p><img src='' border='0'/>超宽带状态 : </p>";
    					}
    					if(item.rcmMode == '1'){
    						html += "<p><img src='' border='0'/>无线同步率 : </p>";
    					}else{
    						html += "<p><img src='' border='0'/>无线同步率 : "+item.wirelessSync+"%</p>";	
    					}
    					
    					
    					
						html += "<p><img src='' border='0'/>时间 : "+item.aliveTime.msdate()+"</p>";
    					html += "</div>";
    					
    				}
    				$('#rap-status').html(html);
    				// 도면 Master와의 거리 표현
    				var path = '', text = '', x = 0, y = 0;
    				for(var i=0; i < Rap.$items.length; i++){
    					item = Rap.$items[i];
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
							text += ', '+item.wirelessSync+'%'
    						Rap.$map.draw.text(x+10, y + 20, euid+"("+text+")", 'rap_text_'+item.rapId, Rap.$textOptions);
						}else{
							Rap.$map.draw.text(x, y + 20, euid, 'rap_text_'+item.rapId, Rap.$textOptions);
						}
    				}
    				
    			}
            	
			}
		});
		
	},
	selectItem : function(id){ 
		var marker = Rap.$map.marker.getItem(id);
		$('#rap-status').children().each(function(){
			$(this).removeClass('rap-box-selected');
		});
		$('#rap-status #'+id).addClass('rap-box-selected');
		Rap.$map.marker.select(marker);
	},
	itemSelect : function(){ //  Call function from Map
		var marker = Rap.$map.marker.getSelectedItem();
		$('#rap-status').children().each(function(){
			$(this).removeClass('rap-box-selected');
		});
		$('#rap-status #'+marker.attr('id')).addClass('rap-box-selected');
		var item;
		for(var i=0; i < Rap.$items.length; i++){
			item = Rap.$items[i];
			if(marker.attr('id') == 'dev_'+item.rapId){
				break;
			}
		}
		
	}
};