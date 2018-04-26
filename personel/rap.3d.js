var Rap = {
	$id : 'Rap', $sbmId : 0, $componentId : 'RAP',
	$rapType : 0,
	$plan : null, $plans : new Array(),	
	$rap : null, $raps : new Array(), 
	$addRap : null,  $addRaps : new Array(),
	$masterRap : null,  $masterRaps : new Array(),
	$rcmMode : 0, $control : 0, $alivePeriod : 0,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[1].title+'</span><span class="bg">'+$.rtls.menu[1].sub[3]+'</span>');
		$('.top_right').html('<button id="but-add" type="button" >'+$.rtls.device.button.add+'</button>');
		$("#but-add").button({
			icons: {primary: "ui-icon-plus"}
		}).click(function() {
			Rap.edit.addForm();
		});
		Rap.ui.tab(0);
		
	},
	ui : {
		tab : function(ix){
			Rap.$plans = Rap.get.plans();
			var item, html;
	    	for(var i=0; i < Rap.$plans.length; i++){
				item = Rap.$plans[i];
				html = "<li id='"+i+"' class='ui-state-default ui-corner-top' onmouseover='Rap.ui.tabOver("+i+")' onmouseout='Rap.ui.tabOut("+i+")'>" +
				"<a href=\"javascript:Rap.ui.tabSelect("+i+")\"><img src='/resources/commons/images/tree/dir.gif'/> "+item.name+"</a>" +
				"</li>";
				$('#tab').find('ul').append(html);
			}
			Rap.ui.tabSelect(ix);
				
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
			if(Rap.$plan == null || Rap.$plan.planId != Rap.$plans[ix].planId){
				Rap.$plan = Rap.$plans[ix];
				var sbmPath = '/files/plan/';
				var texturePath = '/files/plan/map_'+Rap.$plan.planId+'/';
				var gxxmlPath = '/files/plan/map_'+Rap.$plan.planId+'.xml';
				if(!Unity.$isMapInit){
					Unity.init(Rap, '100%', 800, sbmPath, texturePath, gxxmlPath);
					Rap.ui.rap();
				}else{
					Unity.clearSBM();
					Unity.createGKXML(sbmPath, texturePath, gxxmlPath);
					Rap.ui.rap();
				}
				
			}
			
			$('#tab').find('ul').find('li').each(function(i) {
			    if(i == ix){
			    	$(this).addClass('ui-tabs-selected');
			    	$(this).addClass('ui-state-active');
			    }else{
			    	$(this).removeClass('ui-state-active');
					$(this).removeClass('ui-tabs-selected');
			    }
			});
		},
		rap : function(){
			Rap.$raps = Rap.get.raps();
        	$('.top_left').html($.rtls.device.list.top(Rap.$raps.length));
			if(Rap.$raps.length == 0){
        		$('#map-items').html("<p><center>"+$.rtls.device.list.empty+"<center></p>");
        		$("#map-form").html('');
			}else{
				var item ={};
				var euid = '', network = '';
				var html = "<ol id='item-selectable' class='rap-selectable'>";	
				for(var i=0; i < Rap.$raps.length; i++){
					item = Rap.$raps[i];
					euid = item.euidSrc.substring(item.euidSrc.length-4, item.euidSrc.length); 
					if(item.networkType == '1') network = 'ethernet';
					else if(item.networkType == '2') network = 'wifi';
					else if(item.networkType == '3') network = 'lte';
					if(item.rcmMode == 1){
						html += "<li class='ui-widget-content' id='"+item.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_master_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
					}else if(item.rcmMode == 2){
						html += "<li class='ui-widget-content' id='"+item.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
					}else if(item.rcmMode == 3){
						html += "<li class='ui-widget-content' id='"+item.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
					}
				}
				html += "</ol>";
				$('#map-items').html(html);
				$("#item-selectable", "#map-items").selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							var id = $(this).attr('id');
							var item = {};
							Unity.clearPicking();
							for(var i=0; i < Rap.$raps.length; i++){
								item = Rap.$raps[i];
								if(item.rapId == id){
									var componentId = Rap.$sbmId+"_Component_RAP"+item.rapId+"_0";
									Unity.objPickingById(componentId);
									Rap.edit.modForm(item);
									break;
								}
							}
							
						});		
					}
				});
				Rap.$rap = Rap.$raps[0];
				Rap.edit.modForm(Rap.$rap);
				$('ol#item-selectable li').eq(0).addClass('ui-selected');
			}
		}
	},
	get : {
		plans : function(){
			var items = [];
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
	            	items = data.plans;
				}
			});
			return items;
		},
		raps : function(rcmMode){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/rap.json?action=get.raps",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	"planId" : Rap.$plan.planId,
	            	"rcmMode" : (rcmMode == undefined ? 0 : rcmMode)
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.raps
				}
			});
			return items;
		},
		addRaps : function(){
			var items = [];
			$.ajax({
				async : false,
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
	            	items = data.raps
	            	
				}
			});
	    	return items;
	 	},
	},
	edit : {
		addForm : function(){
			Rap.$addRaps = Rap.get.addRaps();
			if(Rap.$addRaps.length == 0){
       		 	$("#result", '#map-form').html("<span style='color:red'>"+$.rtls.device.message.emptyrap+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
       		}else{
       			
       			$("#dialog-rap").dialog({
       				title:$.rtls.device.dialog.title[0],
       				bgiframe: true,
       				autoOpen: false,
       				width: 400,
       				modal: true,
       				position: { my: "center center", at: "center center", of: "#map-form" },
       				buttons: [{
       					text : $.rtls.commons.button.ok,
       					click: function() {
	       					if(Rap.$addRap == null){
	       						Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.device.message.selectrap, { my: "center center", at: "center center", of: "#dialog-rap" });
	       					}else{
	       						Rap.$raps.push(Rap.$addRap);
	       						Rap.edit.modForm(Rap.$addRap);
	       						Unity.addComponent(Rap.$sbmId, Rap.$componentId, 'RAP'+Rap.$addRap.rapId, 100, 240, -100, 0, 0, 0, 5, 5, 5);
	       						var componentId = Rap.$sbmId+"_Component_RAP"+Rap.$addRap.rapId+"_0";
	       						Unity.objPickingById(componentId);
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
       					Rap.$addRap = null;
       					$("#dialog-rap").html('');
       					$("#dialog-rap").dialog('destroy');
       				}
       			});
       			$( "#dialog-rap" ).dialog( "open" );
       			
       		}
		},
		modForm : function(item){
			Rap.$rap = item;
			$("#map-form").show();
			var html = '';
			html += '<table id="form-mod" class="form-fields">';
			html += '<tr>';
			html += '    <td colspan="2" style="text-align:right">';
			html += "		<span id='result'></span>";
			html += '		<button id="but-mod">'+$.rtls.device.button.mod+'</button> ';
			html += '		<button id="but-del">'+$.rtls.device.button.del+'</button>';
			html += '    </td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td class="labels">EUID</td>';
			html += '    <td style="text-align:left; width:300px">'+Rap.$rap.euidSrc+'</td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td class="labels">IP</td>';
			html += '    <td style="text-align:left">'+Rap.$rap.ip+'</td>';
			html += '</tr>';
			html += '<tr>';
			html += '   <td class="labels">* '+$.rtls.device.form.point+'(X)</td>';
			html += '   <td style="text-align:left">';
			html += "		<input type='text' id='localX' value='' style='width:40px;text-align:center'/> m (<span id='localXPx'>"+Rap.$rap.localX+"</span>)px ";
			html += '   </td>';
			html += '</tr>';
			html += '<tr>';
			html += '   <td class="labels">* '+$.rtls.device.form.point+'(Y)</td>';
			html += '   <td style="text-align:left">';
			html += "		<input type='text' id='localY' value='' style='width:40px;text-align:center'/> m (<span id='localYPx'>"+Rap.$rap.localY+"</span>)px ";
			html += '   </td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td class="labels">* '+$.rtls.device.form.height+'(Z)</td>';
			html += '    <td style="text-align:left"><input type="text" id="localZ" value="" style="width:40px;text-align:center"/> m (<span id="localZPx">'+Rap.$rap.localZ+'</span>)px</td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td class="labels">* '+$.rtls.device.form.isAp+'</td>';
			html += '    <td style="text-align:left">';
			html += '		<ol id="isap-selectable" class="ui-selectable">';
			if(Rap.$rap.isAP == 'true'){
				html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> '+$.rtls.device.form.use+' </li>';
				html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.device.form.notuse+' </li>';
			}else{
				html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.device.form.use+' </li>';
				html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> '+$.rtls.device.form.notuse+' </li>';
			}
			html += '		</ol>';
			html += '   </td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td class="labels">* '+$.rtls.device.form.networkType+'</td>';
			html += '    <td style="text-align:left">';
			html += '		<ol id="networktype-selectable" class="ui-selectable">';
			if(Rap.$rap.networkType == 1){
				html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Ethernet </li>';
				html += '<li class="ui-widget-content" style="cursor:pointer"> WiFi </li>';
				html += '<li class="ui-widget-content" style="cursor:pointer"> LTE </li>';
			}else if(Rap.$rap.networkType == 2){
				html += '<li class="ui-widget-content" style="cursor:pointer"> Ethernet </li>';
				html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> WiFi </li>';
				html += '<li class="ui-widget-content" style="cursor:pointer"> LTE </li>';
			}else if(Rap.$rap.networkType == 3){
				html += '<li class="ui-widget-content" style="cursor:pointer"> Ethernet </li>';
				html += '<li class="ui-widget-content" style="cursor:pointer"> WiFi </li>';
				html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> LTE </li>';
			}else{
				html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Ethernet </li>';
				html += '<li class="ui-widget-content" style="cursor:pointer"> WiFi </li>';
				html += '<li class="ui-widget-content" style="cursor:pointer"> LTE </li>';
			}
			html += '		</ol>';
			html += '   </td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td class="labels">* '+$.rtls.device.form.description+'</td>';
			html += '    <td style="text-align:left"><input type="text" id="description" value="" style="width:250px;"/></td>';
			html += '</tr>';
			html += '</table>';
			
			var pcnumField = '<select id="pcNumber" style="width:50px;">';
			for(var i=0; i < 10; i++){
				pcnumField += '<option value="'+i+'">'+i+'</option>';
			}
			pcnumField += '</select>';
			var gainField = '<select id="gain" style="width:50px;">';
			for(var i=0; i < 35; i++){
				gainField += '<option value="'+i+'">'+i+'</option>';
			}
			gainField += '</select>';
			var reportTermField = '<select id="reportTerm" style="width:50px;">';
			for(var i=0; i < 256; i++){
				reportTermField += '<option value="'+i+'">'+i+'</option>';
			}
			reportTermField += '</select>';
			
			html += '<table id="form-config" class="form-fields">';
			html += '<tr>';
			html += '	<td colspan="2" style="text-align:right">';
			html += '		<span id="result-config"></span>';
			html += '      	<button id="but-config">'+$.rtls.device.button.config+'</button>';
			html += '</td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Control</td>';
			html += '   <td style="text-align:left;width:300px">';
			html += '		<ol id="control-selectable" class="ui-selectable">';
			html += '			<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> Not Control </li>';
			html += '			<li class="ui-widget-content" style="cursor:pointer"> Reset </li>';
			html += '		</ol>';
			html += '	</td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* RCM Mode</td>';
			html += '   <td style="text-align:left">';
			html += '		<ol id="rcmmode-selectable" class="ui-selectable">';
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
			
			html += '		</ol>';
			html += '	</td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* PC Number</td><td style="text-align:left">'+pcnumField+' <span>(RCM Preconfiguration number)</span></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Gain</td><td style="text-align:left">'+gainField+' <span>(RCM TX Gain)</span></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Report Term</td><td style="text-align:left">'+reportTermField+' <span> '+$.rtls.device.form.second+' (UWB state report term)</span></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Alive Period</td><td style="text-align:left"><input type="text" id="alivePeriod" style="width:50px; text-align:right"/> '+$.rtls.device.form.second+' (120 ~ 3600)</td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Master Count</td><td style="text-align:left"><input type="text" id="masterCount" style="width:50px; text-align:right"/> '+$.rtls.device.form.number+' (1 ~ 4)</td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Master EUID</td><td style="text-align:left"><input type="text" id="masterEuid" readonly="true"/><button id="but-master">'+$.rtls.device.button.select+'</button></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Master EUID2</td><td style="text-align:left"><input type="text" id="masterEuid2" readonly="true"/><button id="but-master2">'+$.rtls.device.button.select+'</button></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Master EUID3</td><td style="text-align:left"><input type="text" id="masterEuid3" readonly="true"/><button id="but-master3">'+$.rtls.device.button.select+'</button></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Master EUID4</td><td style="text-align:left"><input type="text" id="masterEuid4" readonly="true"/><button id="but-master4">'+$.rtls.device.button.select+'</button></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Master Distance</td><td style="text-align:left"><input type="text" id="masterDistance" style="width:80px; text-align:right" /> m <span>(RCM Master'+$.rtls.device.form.distance+')</span></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Master Distance2</td><td style="text-align:left"><input type="text" id="masterDistance2" style="width:80px; text-align:right" /> m <span>(RCM Master2'+$.rtls.device.form.distance+')</span></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Master Distance3</td><td style="text-align:left"><input type="text" id="masterDistance3" style="width:80px; text-align:right" /> m <span>(RCM Master3'+$.rtls.device.form.distance+')</span></td>';
			html += '</tr>';
			html += '<tr>';
			html += '	<td class="labels">* Master Distance4</td><td style="text-align:left"><input type="text" id="masterDistance4" style="width:80px; text-align:right" /> m <span>(RCM Master4'+$.rtls.device.form.distance+')</span></td>';
			html += '</tr>';
			html += '</table>';
			$("#map-form").html(html);
			
			$('#map-form #localX').val(Rap.util.carcPxToMeter(Rap.$rap.localX));
			$('#map-form #localY').val(Rap.util.carcPxToMeter(Rap.$rap.localY));
			$('#map-form #localZ').val(Rap.util.carcPxToMeter(Rap.$rap.localZ));
			$('#map-form #description').val((Rap.$rap.description != 'null' ? Rap.$rap.description : ''));
			$("#masterEuid").addClass("input-readonly");
			$("#masterEuid").attr("maxlength", "16");
			$("#masterEuid2").addClass("input-readonly");
			$("#masterEuid2").attr("maxlength", "16");
			$("#masterEuid3").addClass("input-readonly");
			$("#masterEuid3").attr("maxlength", "16");
			$("#masterEuid4").addClass("input-readonly");
			$("#masterEuid4").attr("maxlength", "16");
			$("#pcNumber").val(Rap.$rap.pcNumber);
			$("#gain").val(Rap.$rap.gain);
			$("#reportTerm").val(Rap.$rap.reportTerm);
			$("#masterCount").val(Rap.$rap.masterCount);
			$("#masterDistance").val(Rap.$rap.masterDistance);
			$("#masterEuid").val(Rap.$rap.euidMaster);
			$("#masterDistance2").val(Rap.$rap.masterDistance2);
			$("#masterEuid2").val(Rap.$rap.euidMaster2);
			$("#masterDistance3").val(Rap.$rap.masterDistance3);
			$("#masterEuid3").val(Rap.$rap.euidMaster3);
			$("#masterDistance4").val(Rap.$rap.masterDistance4);
			$("#masterEuid4").val(Rap.$rap.euidMaster4);
			$("#alivePeriod").val(Rap.$rap.alivePeriod);
			
			
			$("#isap-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						var ix = $( "#isap-selectable li" ).index( this );
						if(ix == 0){
							Rap.$rap.isAP = 'true';
						}else{
							Rap.$rap.isAP = 'false';
						}
					});		
				}
			});
			$("#networktype-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						var ix = $( "#networktype-selectable li" ).index( this );
						Rap.$rap.networkType = ix+1;
					});		
				}
			});
			$('#map-form #localX').keyup(function( event ) {
				 $('#localXPx').html(Rap.util.carcMeterToPx($('#map-form #localX').val()));
				 var componentId = Rap.$sbmId+"_Component_RAP"+Rap.$rap.rapId+"_0";
				 var x = parseFloat($('#map-form #localX').val()) * 100;
				 var y = parseFloat($('#map-form #localY').val()) * 100 * -1;
				 var z = parseFloat($('#map-form #localZ').val()) * 100;
				 Unity.setOBJTransform(0, componentId, x, y, z);
				 
			});
			$('#map-form #localY').keyup(function( event ) {
				 $('#localYPx').html(Rap.util.carcMeterToPx($('#map-form #localY').val()));
				 var componentId = Rap.$sbmId+"_Component_RAP"+Rap.$rap.rapId+"_0";
				 var x = parseFloat($('#map-form #localX').val()) * 100;
				 var y = parseFloat($('#map-form #localY').val()) * 100 * -1;
				 var z = parseFloat($('#map-form #localZ').val()) * 100;
				 Unity.setOBJTransform(0, componentId, x, y, z);
			});
			$('#map-form #localZ').keyup(function( event ) {
				 $('#localZPx').html(Rap.util.carcMeterToPx($('#map-form #localZ').val()));
				 var componentId = Rap.$sbmId+"_Component_RAP"+Rap.$rap.rapId+"_0";
				 var x = parseFloat($('#map-form #localX').val()) * 100;
				 var y = parseFloat($('#map-form #localY').val()) * 100 * -1;
				 var z = parseFloat($('#map-form #localZ').val()) * 100;
				 Unity.setOBJTransform(0, componentId, x, y, z);
			});
			
			$("#but-mod").button({
				icons: {primary: "ui-icon-plus"}
			}).click(function() {
				Rap.edit.mod(item.rapId);
			});
			$("#but-del").button({
				icons: {primary: "ui-icon-minus"}
			}).click(function() {
				Rap.edit.del(item.rapId);
			});
			
			$("#rcmmode-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						Rap.$rcmMode = $( "#rcmmode-selectable li" ).index( this ) + 1;
					});		
				}
			});
			
			$("#control-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						Rap.$control = $( "#control-selectable li" ).index( this );
					});		
				}
			});
			
			// Master Rap 선택
			$("#but-master").button({
				icons: {primary: "ui-icon-tag"}
			}).click(function() {
				Rap.edit.selectMasterRap();
				return false; 
			});
			
			$("#but-master2").button({
				icons: {primary: "ui-icon-tag"}
			}).click(function() {
				Rap.edit.selectMasterRap(2);
				return false; 
			});
			
			$("#but-master3").button({
				icons: {primary: "ui-icon-tag"}
			}).click(function() {
				Rap.edit.selectMasterRap(3);
				return false; 
			});
			
			$("#but-master4").button({
				icons: {primary: "ui-icon-tag"}
			}).click(function() {
				Rap.edit.selectMasterRap(4);
				return false; 
			});
			$("#but-config").button({
				icons: {primary: "ui-icon-gear"}
			}).click(function() {
				Rap.edit.config(Rap.$rap.rapId);
			});
			
		},
		selectMasterRap : function(ix){
			Rap.$masterRap = null;
        	Rap.$masterRaps = Rap.get.raps(1);
			$("#dialog-master").dialog({
    			title:'Master RAP'+(ix == undefined ? '' : ix)+' '+$.rtls.device.form.select,
    			autoOpen: false,
    			height: 400,
    			width: 400,
    			modal: true,
    			position: { my: "center center", at: "center center", of: "#form-config" },
    			buttons: [{
    				text : $.rtls.commons.button.ok,
					click: function() {
    					if(Rap.$masterRap != null){
    						$("#dialog-device #fields #masterEuid"+(ix == undefined ? '' : ix)).val(Rap.$masterRap.euidSrc);
    						$("#dialog-master").dialog( "close" );
    					}else{
    						Log.dialog($.rtls.commons.dialog.title.error,  $.rtls.validity.select('Master RAP'), { my: "center center", at: "center center", of: "#dialog-master" });
    						
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
				
			
		},
		mod : function(rapId){
			$.validity.start();
			$.validity.setup({outputMode:"summary" });
			$("#map-form #localX").require($.rtls.validity.required('X '+$.rtls.device.form.point));
			$("#map-form #localY").require($.rtls.validity.required('Y '+$.rtls.device.form.point));
			$("#map-form #localZ").require($.rtls.validity.required($.rtls.device.form.height));
			var result = $.validity.end();
			if(result.valid){
				var localX = Rap.util.carcMeterToPx($('#map-form #localX').val());
				var localY = Rap.util.carcMeterToPx($('#map-form #localY').val());
				var localZ = Rap.util.carcMeterToPx($('#map-form #localZ').val());
				$.ajax({
					async : true,
					type: 'post',
					url: "/service/rap.json?action=mod.rap",
					dataType: 'json',
		            data : { 
		            	"planId" : Rap.$plan.planId,
		            	"rapId" : rapId,
		            	"localX" : localX+"",
		            	"localY" : localY+"",
		            	"localZ" : localZ+"",
		            	"isAP" : Rap.$rap.isAP,
		            	"networkType" : Rap.$rap.networkType,
		            	"description" : $('#description', '#map-form').val()
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
		            		$("#result", '#form-mod').html("<b>"+$.rtls.device.message.modsuccess+"</b>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');

		            		Rap.$rap.localX = localX;
		            		Rap.$rap.localX = localY;
		            		Rap.$rap.localX = localZ;
		            		Rap.$rap.description = $('#description', '#map-form').val();
		            		// RAP 추가 처리
		            		var check = false;
		            		$("ol#item-selectable li", "#map-items").each(function () {
		            			if($(this).attr('id') == rapId){
	           		            	check = true;
	           		            	var network = '';
	    	    					if(Rap.$rap.networkType == '1') network = 'ethernet';
	    	    					else if(Rap.$rap.networkType == '2') network = 'wifi';
	    	    					else if(Rap.$rap.networkType == '3') network = 'lte';
	    	    					if(Rap.$rap.rcmMode == 1){
	    	    						$('img', this).attr('src', '/resources/commons/images/map/icon_rap_'+network+'_master_30x30.png');
	    	    					}else if(Rap.$rap.rcmMode == 2){
	    	    						$('img', this).attr('src', '/resources/commons/images/map/icon_rap_'+network+'_slave_30x30.png');
	    	    					}else if(Rap.$rap.rcmMode == 3){
	    	    						$('img', this).attr('src', '/resources/commons/images/map/icon_rap_'+network+'_slave_30x30.png');
	    	    					}else{
	    	    						$('img', this).attr('src', '/resources/commons/images/map/icon_rap_'+network+'_slave_30x30.png');
	    	    					}
	    	    					
	           		            }
		            		});
		            		if(!check){
		            			$('ol#item-selectable li').removeClass('ui-selected');
			            		var euid = Rap.$rap.euidSrc.substring(Rap.$rap.euidSrc.length-4, Rap.$rap.euidSrc.length);
		            			var network = '', html = '';
		    					if(Rap.$rap.networkType == '1') network = 'ethernet';
		    					else if(Rap.$rap.networkType == '2') network = 'wifi';
		    					else if(Rap.$rap.networkType == '3') network = 'lte';
		    					if(Rap.$rap.rcmMode == 1){
		    						html = "<li class='ui-widget-content' id='"+Rap.$rap.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_master_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
		    					}else if(Rap.$rap.rcmMode == 2){
		    						html = "<li class='ui-widget-content' id='"+Rap.$rap.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
		    					}else if(Rap.$rap.rcmMode == 3){
		    						html = "<li class='ui-widget-content' id='"+Rap.$rap.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
		    					}else{
		    						html = "<li class='ui-widget-content' id='"+Rap.$rap.rapId+"'><img src='/resources/commons/images/map/icon_rap_"+network+"_slave_30x30.png'  style='float:left; padding-right:3px'/>"+euid+"</li>";
		    					}
		    					if($("#map-items").find('#item-selectable').length < 1){
		    						$("#map-items").html("<ol id='item-selectable' class='rap-selectable'></ol>");
		    					}
		    					$("ol#item-selectable", "#map-items").append(html);
		    					$('ol#item-selectable li', "#map-items").last().addClass('ui-selected');
		    					$('.top_left').html($.rtls.device.list.top(Rap.$raps.length));
		            		}
						}else{
							$("#result", '#map-form').html("<span style='color:red'>"+$.rtls.device.message.modfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
						}
		        	
					}
				});
				$.validity.clear();
			}else{
				$("#result", '#map-form').html("<span style='color:red'>"+$.rtls.validity.required($.rtls.device.form.point)+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
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
		        position: { my: "center center", at: "center center", of: "#form-mod" },
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
				            		for(var i =0; i < Rap.$raps.length; i++){
				            			if(Rap.$raps[i].rapId == rapId){
				            				Rap.$raps.removeIxs([i]);
				            				break;
				            			}
				            		}
				            		$('.top_left').html($.rtls.device.list.top(Rap.$raps.length));
				            		$("#item-selectable li", "#map-items").each(function () {
			           		            if($(this).attr('id') == rapId){
			           		            	$(this).remove();
			           		            }
				            		});
				            		var componentId = Rap.$sbmId+"_Component_RAP"+rapId+"_0";
									Unity.deleteOBJ(componentId);
				            		$("#map-form").hide();
				            		$("#dialog-confirm").dialog( "close" );
								}else{
									$("#dialog-confirm").dialog( "close" );
									$("#result", '#map-form').html("<span style='color:red'>"+$.rtls.device.message.delfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
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
				open : function(){
					
				},
				close: function() {
					$("#dialog-confirm").empty();
					$("#dialog-confirm").dialog('destroy');
		        }
		        
		    });
			$("#dialog-confirm").append($.rtls.device.message.delconfirm);
			$('#dialog-confirm').dialog('open');
			
		},
		config : function(rapId){
			Rap.$rcmMode = Rap.$rap.rcmMode;
			Rap.$alivePeriod = Rap.$rap.alivePeriod;
			Rap.$control = 0;
			$.validity.start();
			$.validity.setup({outputMode:"summary" });
			$("#masterCount").require($.rtls.validity.required('Master Count')).match("number", $.rtls.validity.match('number', 'Master Count')).range(1, 4, $.rtls.validity.range(1,4, 'Master Count'));
			$("#masterDistance").require($.rtls.validity.required('RCM Master'+$.rtls.device.form.distance));
			$("#masterEuid").require($.rtls.validity.select('Master RAP'));
			$("#alivePeriod").require($.rtls.validity.required('Alive Period')).match("number", $.rtls.validity.match('number', 'Alive Period')).range(120, 3600, $.rtls.validity.range(120, 3600, 'Alive Period'));
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
						"pcNumber" : $("#pcNumber").val(),
						"gain" : $("#gain").val(),
						"reportTerm" : $("#reportTerm").val(),
						"masterCount" : $("#masterCount").val(),
						"masterDistance" : $("#masterDistance").val(),
						"masterEuid" : $("#masterEuid").val(),
						"masterDistance2" : $("#masterDistance2").val(),
						"masterEuid2" : $("#masterEuid2").val(),
						"masterDistance3" : $("#masterDistance3" ).val(),
						"masterEuid3" : $("#masterEuid3").val(),
						"masterDistance4" : $("#masterDistance4").val(),
						"masterEuid4" : $("#masterEuid4").val(),
						"alivePeriod" : $("#alivePeriod").val(),
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
		            		$("#result", '#form-mod').html("<b>"+$.rtls.device.message.configsuccess+"</b>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
		            		Rap.$rap.rcmMode = Rap.$rcmMode;
		            		Rap.$rap.pcNumber = $("#pcNumber").val();
		            		Rap.$rap.gain = $("#gain").val();
		            		Rap.$rap.reportTerm = $("#reportTerm").val();
		            		Rap.$rap.masterCount = $("#masterCount").val();
		            		Rap.$rap.masterDistance = $("#masterDistance").val();
		            		Rap.$rap.masterEuid = $("#masterEuid").val();
		            		Rap.$rap.masterDistance2 = $("#masterDistance2").val();
		            		Rap.$rap.masterEuid2 = $("#masterEuid2").val();
		            		Rap.$rap.masterDistance3 = $("#masterDistance3").val();
		            		Rap.$rap.masterEuid3 = $("#masterEuid3").val();
		            		Rap.$rap.masterDistance4 = $("#masterDistance4").val();
		            		Rap.$rap.masterEuid4 = $("#masterEuid4").val();
		            		Rap.$rap.alivePeriod = $("#alivePeriod").val();
						}else if(data.result == 'error.dead'){
							$("#result-config", '#form-config').html("<span style='color:red'>"+$.rtls.device.message.deadrap+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
						}else{
							$("#result-config", '#form-config').html("<span style='color:red'>"+$.rtls.device.message.configfail+"</span>").fadeIn('slow').animate({opacity: 1.0}, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');
						}
		        	
					}
				});
				$.validity.clear();
			}else{
				$("#dialog-message").dialog({
					title : $.rtls.commons.dialog.title.error,
			        width: "auto",
			        bgiframe: true,
			        autoOpen: false,
			        modal: true,
			        resizable: false,
			        position: { my: "center center", at: "center center", of: "#form-config" },
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
	},
	callback : {
		addComponents : function(sbmId){ // 3DMAP init by Call function
			this.$sbmId  = sbmId;
			var item ={};
			for(var i=0; i < Rap.$raps.length; i++){
				item = Rap.$raps[i];
				Unity.addComponent(Rap.$sbmId, Rap.$componentId, 'RAP'+item.rapId, Rap.util.carcPxTo3DMeter(item.localX), Rap.util.carcPxTo3DMeter(item.localZ), -(Rap.util.carcPxTo3DMeter(item.localY)), 0, 0, 0, 5, 5, 5);
			}
			var componentId = Rap.$sbmId+"_Component_RAP"+Rap.$rap.rapId+"_0";
			Unity.objPickingById(componentId);
		},
		modComponent : function(componentId, localX, localY, localZ){ // 3DMAP Component Mouse Picking by Call function
			//componentId = 0_Component_RAP3_0
			var components = componentId.split('_');
			var rapId = components[2].substring(3, components[2].length);
			if(Rap.$rap != null || Rap.$rap.rapId != rapId){
				Unity.clearPicking();
				var item = {};
				for(var i=0; i < Rap.$raps.length; i++){
					item = Rap.$raps[i];
					if(item.rapId == rapId){
						break;
					}
				}
				$('li', '#item-selectable').removeClass('ui-selected');
				$('#'+rapId, '#item-selectable').addClass('ui-selected');
				Rap.$rap = item;
				Rap.edit.modForm(item);
				Unity.objPickingById(componentId);
			}
			
			var xm = (localX/100).toFixed(2);
			var ym = (localY/100).toFixed(2);
			var zm = (localZ/100).toFixed(2);
			$('#map-form #localX').val(xm);
			$('#map-form #localY').val(ym);
			$('#map-form #localZ').val(zm);
			$('#localXPx').html(Rap.util.carcMeterToPx($('#map-form #localX').val()));
			$('#localYPx').html(Rap.util.carcMeterToPx($('#map-form #localY').val()));
			$('#localZPx').html(Rap.util.carcMeterToPx($('#map-form #localZ').val()));
		}
	},
	util : {
		carcPxToMeter : function(px){
			var m = (px * Rap.$plan.meter);
			return m.toFixed(2);
		},
		carcMeterToPx : function(m){
			var p = (m * Rap.$plan.pixels);
			return p.toFixed(2);
		},
		carcPxTo3DMeter : function(px){
			var m = (px * Rap.$plan.meter) * 100;
			return m.toFixed(2);
		}
	}
};