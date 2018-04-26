var Config = {
	$uwbAct : 1, $dgpsAct : 0, $avgMinCount : 0, $isKalman : 'false', $isNLS : 'false', $isSports : 'false', $isLogInsert : 'false', $logLevel : 1, 
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[1].title+'</span><span class="bg">'+$.rtls.menu[1].sub[6]+'</span>');
		var html = '';
		html += '<p style="padding-top:10px;font-weight:bold;margin-bottom: 10px;"><a class="button button-pill button-primary">'+$.rtls.config.title.uwb+'</a></p>';
//		html += '<div id="panels">';
//		html += '	<label style="width:150px;">'+$.rtls.config.form.uwbAct+'</label>';
//		html += '	<div id="panels-datas">';
//      html += '		<ol id="uwbact-selectable" class="ui-selectable">';
//      html += '			<li class="ui-widget-content" style="cursor:pointer"> ON </li>';
//      html += '			<li class="ui-widget-content" style="cursor:pointer"> OFF </li>';
//      html += '		</ol>';
//      html += '	</div>';
//      html += '</div>';
//		html += '<div id="panels">';
//		html += '	<label style="width:150px;">'+$.rtls.config.form.uwbBlink+'</label>';
//		html += '	<input type="text" id="uwbBlink" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">msec</span>';
//		html += '</div>';
		html += '<div id="panels">';
		html += '<a class="button">'+$.rtls.config.form.waitTime+'</a>';
		html += '	<input type="text" id="waitTime" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">msec ('+$.rtls.config.description.waitTime+')</span>';
		html += '</div>';
		html += '<p style="padding-top:10px;font-weight:bold"><a class="button button-pill button-primary">'+$.rtls.config.title.tdoa+'</a></p>';
		html += '<div id="panels">';
		html += '	<a class="button">'+$.rtls.config.form.avgMinCount+'</a>';
		html += '	<div id="panels-datas">';
		html += '		<ol id="avgmincount-selectable" class="ui-selectable">';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">0</a></li>';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">1</a></li>';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">2</a></li>';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">3</a></li>';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">4</a></li>';
		html += '		</ol>';
		html += '	</div>';
		html += '</div>';
		html += '<div id="panels" style="padding:5px 40px;">'+$.rtls.config.description.avgMinCount+'</div>';
		html += '<div id="panels">';
		html += '	<a class="button">'+$.rtls.config.form.speed+'</a>';
        html += '	<input type="text" id="speed" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">米/秒</span>';
		html += '</div>';
		html += '<div id="panels" style="padding:5px 40px;">'+$.rtls.config.description.speed+'</div>';
		html += '<div id="panels">';
		html += '	<a class="button">'+$.rtls.config.form.time+'</a>';
        html += '	<input type="text" id="time" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">毫秒</span>';
		html += '</div>';
		html += '<div id="panels" style="padding:5px 40px;">'+$.rtls.config.description.time+'</div>';
		html += '<div id="panels">';
        html += '	<a class="button">'+$.rtls.config.form.angle+'</a>';
        html += '	<input type="text" id="angle" style="width:100px; height:28px; text-align:right"/> ˚';
		html += '</div>';
		html += '<div id="panels" style="padding:5px 40px;">'+$.rtls.config.description.angle+'</div>';
		html += '<div id="panels">';
        html += '	<a class="button">'+$.rtls.config.form.tdoaRatio+'</a>';
        html += '	<input type="text" id="tdoaRatio" style="width:100px; height:28px; text-align:right"/>';
		html += '</div>';
		html += '<div id="panels" style="padding:5px 40px;">'+$.rtls.config.description.tdoaRatio+'</div>';
		html += '<div id="panels">';
        html += '	<a class="button">卡尔曼滤波器</a>';
        html += '	<input id="isKalman" name="isKalman" type="checkbox"/>';
		html += '</div>';
		html += '<div id="panels">';
        html += '	<a class="button">非线性最小二乘法</a>';
        html += '	<input id="isNLS" name="isNLS" type="checkbox"/>';
		html += '</div>';
		html += '<div id="panels">';
        html += '	<a class="button">范围过滤器</a>';
        html += '	<input type="text" id="rngmgn" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">米</span>';
		html += '</div>';
		html += '<div id="panels">';
		html += '	<a class="button">'+$.rtls.config.form.baseHeight+'</a>';
		html += '	<input type="text" id="baseHeight" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">米 ('+$.rtls.config.description.baseHeight+')</span>';
		html += '</div>';
		html += '<p style="padding-top:10px;font-weight:bold;margin-bottom: 10px;"><a class="button button-pill button-primary">'+$.rtls.config.title.motion+'</a></p>';
		html += '<div id="panels" style="padding:5px 40px;">'+$.rtls.config.description.motion+'</div>';
		html += '<div id="panels">';
		html += '	<a class="button">'+$.rtls.config.form.isSports+'</a>';
		html += '	<input id="isSports" name="isSports" type="checkbox">';
		html += '</div>';
		html += '<div id="panels">';
		html += '	<a class="button">'+$.rtls.config.form.thresh+'</a>';
		html += '	<input type="text" id="thresh" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px"></span>';
		html += '</div>';
		html += '<div id="panels">';
		html += '	<a class="button">'+$.rtls.config.form.grad+'</a>';
		html += '	<input type="text" id="grad" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">米/秒 </span>';
		html += '</div>';
		html += '<div id="panels">';
		html += '	<a class="button">'+$.rtls.config.form.ball+'</a>';
		html += '	<input type="text" id="ballEuid" style="width:100px; height:28px; text-align:right" maxlength="4"/><button id="but-tagselect" class="button button-rounded">'+$.rtls.config.button.tagselect+'</button> <span style="padding: 5px"> '+$.rtls.config.description.ballEuid+'</span>';
		html += '</div>';
//		html += '<p style="padding-top:10px;font-weight:bold"><img src="/resources/commons/images/icon/icon_paging_next_off.gif" align="absmiddle"/>'+$.rtls.config.title.gps+'</p>';
//		html += '<div id="panels">';
//		html += '	<label style="width:150px;">'+$.rtls.config.form.dgpsAct+'</label>';
//		html += '	<div id="panels-datas">';
//      html += '		<ol id="dgpsact-selectable" class="ui-selectable">';
//      html += '			<li class="ui-widget-content" style="cursor:pointer"> ON </li>';
//      html += '			<li class="ui-widget-content" style="cursor:pointer"> OFF </li>';
//      html += '		</ol>';
//      html += '	</div>';
//      html += '</div>';
//		html += '<div id="panels">';
//		html += '	<label style="width:150px;">'+$.rtls.config.form.broadcastTerm+'</label>';
//		html += '	<input type="text" id="broadcastTerm" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">sec</span>';
//		html += '</div>';
//		html += '<div id="panels">';
//		html += '	<label style="width:150px;">'+$.rtls.config.form.gpsTerm+'</label>';
//		html += '	<input type="text" id="gpsTerm" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">sec</span>';
//		html += '</div>';
//		html += '<div id="panels">';
//		html += '	<label style="width:150px;">'+$.rtls.config.form.uwbTerm+'</label>';
//		html += '	<input type="text" id="uwbTerm" style="width:100px; height:28px; text-align:right"/> <span style="padding: 5px">msec</span>';
//		html += '</div>';
		html += '<p style="padding-top:10px;font-weight:bold;margin-bottom: 10px;"><a class="button button-pill button-primary">'+$.rtls.config.title.server+'</a></p>';
		html += '<div id="panels">';
		html += '	<a class="button">'+$.rtls.config.form.isLogInsert+'</a>';
		html += '	<div id="panels-datas">';
		html += '		<ol id="isloginsert-selectable" class="ui-selectable">';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">'+$.rtls.config.form.use+'</a></li>';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">'+$.rtls.config.form.notuse+'</a></li>';
		html += '		</ol>';
		html += '	</div>';
		html += '</div>';
		html += '<div id="panels">';
		html += '	<a class="button">日志等级</a>';
		html += '	<div id="panels-datas">';
		html += '		<ol id="loglevel-selectable" class="ui-selectable">';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">调 试</a></li>';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">信 息</a></li>';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">警 告</a></li>';
		html += '			<li class="ui-widget-content" style="cursor:pointer"><a class="button button-rounded">错 误</a></li>';
		html += '		</ol>';
		html += '	</div>';
		html += '</div>';
		html += '<div id="panels">';
		html += '	<p id="views" style="text-align: center; padding:10px" >';
		html += '		<button id="but-config" class="button button-rounded">'+$.rtls.config.button.set+'</button>';
		html += '	</p>';
		html += ' </div>';
		$('.tb_sec').html(html);
		
		$("#isloginsert-selectable").selectable({
			stop: function() {
				$( ".ui-selected", this ).each(function() {
					if($( "#isloginsert-selectable li" ).index( this ) == 0){
						Config.$isLogInsert = "true";	
					}else{
						Config.$isLogInsert = "false";
					}
					
				});		
			}
		});
		$("#loglevel-selectable").selectable({
			stop: function() {
				$( ".ui-selected", this ).each(function() {
					Config.$logLevel = $( "#loglevel-selectable li" ).index( this ) + 1;	
				});		
			}
		});
		$("#panels>button.button").hover(function(){
			$("#panels>button.button").addClass("button-primary");
		},function(){
			$("#panels>button.button").removeClass("button-primary");
		});
		$("#panels p button.button").hover(function(){
			$("#panels p button.button").addClass("button-primary");
		},function(){
			$("#panels p button.button").removeClass("button-primary");
		});
		$("#avgmincount-selectable").selectable({
			stop: function() {
				$( ".ui-selected", this ).each(function() {
					Config.$avgMinCount = $( "#avgmincount-selectable li" ).index( this );	
				});		
			}
		});
//		$("#uwbact-selectable").selectable({
//			stop: function() {
//				$( ".ui-selected", this ).each(function() {
//					var ix = $( "#uwbact-selectable li" ).index( this );
//					if(ix == 0){
//						Config.$uwbAct = 1;	
//					}else{
//						Config.$uwbAct = 0;
//					}
//						
//				});		
//			}
//		});
//		$("#dgpsact-selectable").selectable({
//			stop: function() {
//				$( ".ui-selected", this ).each(function() {
//					var ix = $( "#dgpsact-selectable li" ).index( this );
//					if(ix == 0){
//						Config.$dgpsAct = 1;	
//					}else{
//						Config.$dgpsAct = 0;
//					}
//						
//				});		
//			}
//		});
		$('input[name="isSports"]').bootstrapSwitch({
			size : 'small',
			onColor : 'primary',
			animate : true
		}).on('switchChange.bootstrapSwitch', function(event, state) {
			  Config.$isSports = state ? "true" : "false";
		});
		$('input[name="isKalman"]').bootstrapSwitch({
			size : 'small',
			onColor : 'primary',
			animate : true
		}).on('switchChange.bootstrapSwitch', function(event, state) {
			  Config.$isKalman = state ? "true" : "false";
		});
		$('input[name="isNLS"]').bootstrapSwitch({
			size : 'small',
			onColor : 'primary',
			animate : true
		}).on('switchChange.bootstrapSwitch', function(event, state) {
			  Config.$isNLS = state ? "true" : "false";
		});
		$('#but-tagselect').button({
			icons: {primary: "ui-icon-tag"}
		}).click(function() {
			Config.tagSelect();
		});
		
		$('#but-config').button({
			icons: {primary: "ui-icon-gear"}
		}).click(function() {
			Config.mod();
		});
		this.getConfig();
	},	
	getConfig : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/config.json?action=get.config",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	var config = data.config;
            	Config.$isLogInsert = config.isLogInsert;
            	Config.$logLevel = config.logLevel;
            	Config.$avgMinCount = config.avgMinCount;
            	Config.$uwbAct = config.uwbAct;
            	Config.$dgpsAct = config.dgpsAct;
            	Config.$isSports = config.isSports;
            	Config.$isKalman = config.isKalman;
            	Config.$isNLS = config.isNLS;
            	$('#uwbBlink').val(config.uwbBlink);
            	$('#tdoaRatio').val(config.tdoaRatio);
            	$('#waitTime').val(config.waitTime);
            	$('#speed').val(config.speed);
            	$('#time').val(config.time*1000);
            	$('#rngmgn').val(config.rngmgn);
            	$('#baseHeight').val(config.baseHeight);
            	$('#broadcastTerm').val(config.broadcastTerm);
            	$('#gpsTerm').val(config.gpsTerm);
            	$('#uwbTerm').val(config.uwbTerm);
            	$('#thresh').val(config.thresh);
            	$('#grad').val(config.grad);
            	$('#angle').val(config.angle);
            	$('#ballEuid').val(config.ballEuid == null ? '' : config.ballEuid);
            	$('#isSports').val(config.isSports);
        		$('ol#loglevel-selectable li').eq( config.logLevel-1 ).addClass('ui-selected');
            	$('ol#avgmincount-selectable li').eq( config.avgMinCount).addClass('ui-selected');
            	$('ol#uwbact-selectable li').eq((config.uwbAct == 1 ? 0 : 1)).addClass('ui-selected');
            	$('ol#dgpsact-selectable li').eq((config.dgpsAct == 1 ? 0 : 1)).addClass('ui-selected');
            	$('input[name="isKalman"]').bootstrapSwitch('state', (Config.$isKalman == 'true' ? true : false));	
            	$('input[name="isNLS"]').bootstrapSwitch('state', (Config.$isNLS == 'true' ? true : false));	
            	$('input[name="isSports"]').bootstrapSwitch('state', (Config.$isSports == 'true' ? true : false));	
        		
            	if(Config.$isLogInsert == 'true'){
            		$('ol#isloginsert-selectable li').eq(0).addClass('ui-selected');
            	}else {
            		$('ol#isloginsert-selectable li').eq(1).addClass('ui-selected');
            	}
			}
		});
		
	},
	mod : function(){
		$.validity.start();
		$.validity.setup({outputMode:"summary" });
		//$("#uwbBlink").require($.rtls.validity.required($.rtls.config.form.uwbBlink)).match("number", $.rtls.validity.match('number', $.rtls.config.form.uwbBlink));
		$("#speed").require($.rtls.validity.required($.rtls.config.form.speed)).match("number", $.rtls.validity.match('number', $.rtls.config.form.speed));
		$("#time").require($.rtls.validity.required($.rtls.config.form.time)).match("number", $.rtls.validity.match('number', $.rtls.config.form.time));
		$("#tdoaRatio").require($.rtls.validity.required($.rtls.config.form.tdoaRatio)).match("number", $.rtls.validity.match('number', $.rtls.config.form.tdoaRatio));
		$("#rngmgn").require($.rtls.validity.required('RANGE FILTER')).match("number", $.rtls.validity.match('number', 'RANGE FILTER'));
		$("#waitTime").require($.rtls.validity.required($.rtls.config.form.waitTime)).match("number", $.rtls.validity.match('number', $.rtls.config.form.waitTime));
		$("#baseHeight").require($.rtls.validity.required($.rtls.config.form.baseHeight)).match("number", $.rtls.validity.match('number', $.rtls.config.form.baseHeight));
		//$("#broadcastTerm").require($.rtls.validity.required($.rtls.config.form.broadcastTerm)).match("number", $.rtls.validity.match('number', $.rtls.config.form.broadcastTerm));
		//$("#gpsTerm").require($.rtls.validity.required($.rtls.config.form.gpsTerm)).match("number", $.rtls.validity.match('number', $.rtls.config.form.gpsTerm));
		//$("#uwbTerm").require($.rtls.validity.required($.rtls.config.form.uwbTerm)).match("number", $.rtls.validity.match('number', $.rtls.config.form.uwbTerm));
		$("#thresh").require($.rtls.validity.required($.rtls.config.form.thresh)).match("number", $.rtls.validity.match('number', $.rtls.config.form.thresh));
		$("#grad").require($.rtls.validity.required($.rtls.config.form.grad)).match("number", $.rtls.validity.match('number', $.rtls.config.form.grad));
		$("#angle").require($.rtls.validity.required($.rtls.config.form.angle)).match("number", $.rtls.validity.match('number', $.rtls.config.form.angle));
		//$("#ballEuid").require($.rtls.validity.required('Ball EUID'));
		var result = $.validity.end();
		if(result.valid){
		
			$.ajax({
				async : true,
				type: 'post',
				url: "/service/config.json?action=mod.config",
				dataType: 'json',
	            data : { 
					"speed" : $('#speed').val(),
					"time" : (parseInt($('#time').val())/1000).toFixed(1),
					"tdoaRatio" : $('#tdoaRatio').val(),
					"rngmgn" : $('#rngmgn').val(),
					"waitTime" : $('#waitTime').val(),
					"avgMinCount" : Config.$avgMinCount,
					"baseHeight" : $('#baseHeight').val(),
					//"broadcastTerm" : $('#broadcastTerm').val(),
					//"gpsTerm" : $('#gpsTerm').val(),
					//"uwbTerm" : $('#uwbTerm').val(),
					//"uwbBlink" : $('#uwbBlink').val(),
					//"uwbAct" : Config.$uwbAct,
					//"dgpsAct" : Config.$dgpsAct,
					"thresh" : $('#thresh').val(),
					"grad" : $('#grad').val(),
					"angle" : $('#angle').val(),
					"ballEuid" : $('#ballEuid').val(),
					"isKalman" : Config.$isKalman,
					"isNLS" : Config.$isNLS,
					"isSports" : Config.$isSports,
					"isLogInsert" : Config.$isLogInsert,
					"logLevel" : Config.$logLevel
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
						Log.dialog($.rtls.commons.dialog.title.ok,  $.rtls.config.message.modsuccess);
					}else{
						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.config.message.modfail);
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
	tagSelect : function(){
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/tag.json?action=get.issued.tags",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	var chooseTag = null;
            	$("#contents").append("<div id='dialog-tag'></div>");
            	$("#dialog-tag").dialog({
        			title:$.rtls.config.title.tag,
        			autoOpen: false,
        			height: 400,
        			width: 680,
        			modal: true,
        			buttons: [{
        				text : $.rtls.commons.button.ok,
        				click: function() {
        					if(chooseTag != null){
        						$("#ballEuid").val(chooseTag.euid.substring(chooseTag.euid.length - 4, chooseTag.euid.length));
        						$("#dialog-tag").dialog( "close" );
        					}else{
        						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.user.message.tagselect);
        						
        					}
        					
        				},
        			},{
        				text : $.rtls.commons.button.cancel,
        				click: function() {
        					$( this ).dialog( "close" );
        				}
        			}],
        			open: function() {
        				var html = '<fieldset id="fields">';
        				html += "<p><label>"+$.rtls.config.form.tagfilter+"</label><input type='text' id='tagEuid' style='text-align:center'/><button id='but-tag-search'>"+$.rtls.config.button.search+"</button></p></br>";
        				html += "<ol id='tag-selectable' class='ui-selectable'>";
						for(var i=0; i < data.tags.length; i++){
							if(data.tags[i].type == 1){
								html += "<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+data.tags[i].euid+"</li>";	
							}else if(data.tags[i].type == 2){
								html += "<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_move.png' style='float:left; padding-right:3px'/>"+data.tags[i].euid+"</li>";	
							}else{
								html += "<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_card.png' style='float:left; padding-right:3px'/>"+data.tags[i].euid+"</li>";
							}
							
						}	
						html += "</ol>";
						html += "</fieldset>";
						$(this).html(html);
						
						$("#but-tag-search").button({
							icons: {primary: "ui-icon-search"}
						}).click(function() {
							var euid = $('#tagEuid').val();
							var tag = {};
							if(!$.string(euid).blank()){
								$('#tag-selectable').html('');
								for(var i=0 ; i < data.tags.length; i++){
									tag = data.tags[i];
									if(tag.euid.indexOf(euid.toUpperCase()) != -1){
										if(tag.type == 1){
											$('#tag-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");	
										}else if(tag.type == 2){
											$('#tag-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_move.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");
										}else{
											$('#tag-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_card.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");
										}
									}
								}
							}else{
								for(var i=0 ; i < data.tags.length; i++){
									tag = data.tags[i];
									if(tag.type == 1){
										$('#tag-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");	
									}else if(tag.type == 2){
										$('#tag-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_move.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");
									}else{
										$('#tag-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_card.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");
									}
								}
							}
							
						});
						
						$("#tag-selectable", this).selectable({
							stop: function() {
								$( ".ui-selected", this ).each(function() {
									var tagEuid = $(this).text();
									for(var i=0 ; i < data.tags.length; i++){
										if(data.tags[i].euid = tagEuid){
											chooseTag = data.tags[i];
											break;
										}
									}
								});		
							}
						});
        			},
        			close: function() {
        				$("#dialog-tag").dialog("destroy");
        				$("#dialog-tag").remove();
        			}
        		});
        		$( "#dialog-tag" ).dialog( "open" );
            }
        });
	}
};