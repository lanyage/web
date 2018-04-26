var RAP = {
	$items : [],
	$upgradeFlag : -1,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[1].title+'</span><span class="bg">'+$.rtls.menu[1].sub[4]+'</span>');
		$('.top_right').html(
			'<button id="but-upgrade" class="button button-rounded button-small">'+$.rtls.rap.button.upgrade+'</button>'+
			'<button id="but-select" class="button button-rounded button-small">'+$.rtls.rap.button.use+'</button>'+
			'<button id="but-add" class="button button-rounded button-small">'+$.rtls.rap.button.add+'</button>'
		);
		$(".top_right>button.button").hover(function(){
			$(".top_right>button.button").addClass("button-primary");
		},function(){
			$(".top_right>button.button").removeClass("button-primary");
		});
		var html = '<tr>';
		html += '<th class="first">'+$.rtls.rap.list.head[0]+'</th>';
		html += '<th>'+$.rtls.rap.list.head[1]+'</th>';
		html += '<th>'+$.rtls.rap.list.head[2]+'</th>';
		html += '<th>'+$.rtls.rap.list.head[3]+'</th>';
		html += '<th>'+$.rtls.rap.list.head[4]+'</th>';
		html += '<th class="end">'+$.rtls.rap.list.head[5]+'</th>';
		html += '</tr>';
		$('#items thead').html(html);
		
		$("#but-upgrade").button({
			icons: {primary: "ui-icon-arrowthickstop-1-n"}
		}).click(function() {
			RAP.upgradeVerion();
			return false;
		});
		$("#but-select").button({
			icons: {primary: "ui-icon-pin-s"}
		}).click(function() {
			RAP.selectVersion();
			return false;
		});
		$("#but-add").button({
			icons: {primary: "ui-icon-plus"}
		}).click(function() {
			RAP.add();
			return false;
		});
		this.initNotify();
		this.getVersions();
	},	
	initNotify : function(){
		var sock = new SockJS('/rtls/sockjs', null, {debug : false, devel : false});
	  	var client = Stomp.over(sock);
	    client.connect({}, function(frame) {
	    	client.subscribe("/queue/rapupgrade", function(message) {
				var data  = $.parseJSON(message.body);
				if(data.eventType == '11'){
					var check = false;
					$('#dialog #panels-datas').children().each(function(){
						if($(this).attr('id') == 'progressbar'){
							check = true;
						}
						
					});
					var value = (parseInt(alarm.count) * 100) / parseInt(alarm.total);
					if(check){
						$("#progressbar").progressbar({value: value});
					}else{
						$('#dialog #panels-datas').html('<p><div id="progressbar"><div class="progress-label">Loading...</div></did></p></p>');
						$("#progressbar").progressbar({
							value: false,
							change: function() {
								$(".progress-label").text( $("#progressbar").progressbar( "value" ) + "%" );
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
	getVersions : function(){
		$('#items tbody').html("<tr><td colspan='6' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/rap.json?action=get.rap.versions",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#items tbody').html('');
            	
            	RAP.$items = data.versions;
            	$('.top_left').html($.rtls.rap.list.top(RAP.$items.length));
            	if(items.length == 0){
            		$('#items tbody').append("<tr><td colspan='6' style='height:50px'><center>"+$.rtls.rap.list.empty+"<center></td></tr>");
    			}else{
    				var item, html;
    				for(var i=0; i < RAP.$items.length; i++){
    					item = RAP.$items[i];
    					html = "<tr>";
    					if(item.isUse == 'true'){
    						html += "<td><input type='radio' name='isUse' value='"+item.rapVersionId+"' checked/></td>";	
    					}else{
    						html += "<td><input type='radio' name='isUse' value='"+item.rapVersionId+"'/></td>";
    					}
    					
    					html += "<td>"+item.version+"</td>";
    					html += "<td>"+item.note+"</td>";
    					html += "<td>"+item.fileName+"</td>";
    					html += "<td>"+item.addTime.msdate()+"</td>";
    					html += "<td>"+
						"<button id='but-mod-"+i+"' ix='"+i+"'>"+$.rtls.rap.button.mod+"</button>"+
						"<button id='but-del-"+i+"' ix='"+i+"'>"+$.rtls.rap.button.del+"</button>"+
    					"</td>"+
    					"</tr>";
    					$('#items tbody').append(html);
    					$("#but-mod-"+i).button({
    						icons: {primary: "ui-icon-check"}
    					}).click(function() {
    						RAP.mod($(this).attr('ix'));
    						return false;
    					});
    					$("#but-del-"+i).button({
    						icons: {primary: "ui-icon-minus"}
    					}).click(function() {
    						RAP.del($(this).attr('ix'));
    						return false;
    					});
    				}
    			}
			}
		});
	},
	add : function(){
		$("#dialog").append('<fieldset id="fields"></fieldset>');
		$("#dialog #fields").append('<form id="rapForm" name="rapForm" method="post" enctype="multipart/form-data">');
		$("#dialog #fields #rapForm").append('<input type="hidden" id="type" name="type" value="file" />');
		$("#dialog #fields #rapForm").append('<input type="hidden" id="target" name="target" value="/files/temp" />');
		$("#dialog #fields #rapForm").append('<input type="hidden" id="fileName" name="fileName" value="" />');
		$("#dialog #fields #rapForm").append('<input type="hidden" id="fileExt" name="fileExt" value="" />');
		$("#dialog #fields #rapForm").append('<p><label>* '+$.rtls.rap.form.version+'</label><input type="text" id="version" /></p>');
		$("#dialog #fields #rapForm").append('<p><label>* '+$.rtls.rap.form.note+'</label><input type="text" id="note" style="width:400px"/></p>');
		$("#dialog #fields #rapForm").append('<p><label>* '+$.rtls.rap.form.file+'</label><div id="fileupload-result"><input type="file" id="Filedata" name="Filedata" class="multi" maxlength="1" onchange="RAP.fileUpload();"/></div></p>');
		$("#dialog").dialog({
			title:$.rtls.rap.dialog.title[0],
			autoOpen: false,
			width: 700,
			modal: true,
			buttons: [{
				text : $.rtls.commons.button.ok,
				click: function() {
					$.validity.start();
					$.validity.setup({outputMode:"summary" });
					$("#dialog #fields #version").require($.rtls.validity.required($.rtls.rap.form.version));
					var result = $.validity.end();
					if(result.valid){
						$.ajax({
							async : true,
							type: 'post',
							url: "/service/rap.json?action=add.rap.version",
							dataType: 'json',
				            data : { 
				            	"version" :$("#dialog #fields #version").val(),
								"note" : $("#dialog #fields #note").val(),
								"fileName" : $("#dialog #fields #fileName").val()
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
				            		RAP.getVersions();
				            		$("#dialog").dialog( "close" );
								}else if(data.result == 'error.rap.file.exists'){
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.rap.message.fileexists);
								}else if(data.result == 'error.system'){
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.commons.message.errorsystem);
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
				$.validity.clear();
				$("#dialog").html("");
				$("#dialog").dialog('destroy');
			}
		});
		$( "#dialog" ).dialog( "open" );
		
	},
	mod : function(ix){
		var item = RAP.$items[ix];
	  	$("#dialog").append('<fieldset id="fields"></fieldset>');
      	$("#dialog #fields").append('<form id="rapForm" name="rapForm" method="post" enctype="multipart/form-data"></form>');
      	$("#dialog #fields #rapForm").append('<input type="hidden" id="type" name="type" value="file" />');
		$("#dialog #fields #rapForm").append('<input type="hidden" id="target" name="target" value="/files/temp" />');
		$("#dialog #fields #rapForm").append('<input type="hidden" id="fileName" name="fileName" value="rap.gw.server_'+item.version+'" />');
		$("#dialog #fields #rapForm").append('<input type="hidden" id="fileExt" name="fileExt" value="" />');
      	$("#dialog #fields #rapForm").append('<p><label>* '+$.rtls.rap.form.version+'</label><input type="text" id="version" name="version"/></p>');
      	$("#dialog #fields #rapForm").append('<p><label> '+$.rtls.rap.form.note+'</label><input type="text" id="note" style="width:400px" /></p>');
		$("#dialog #fields #rapForm").append('<p><label>* '+$.rtls.rap.form.file+'</label><div id="fileupload-result"><img src="/resources/commons/images/icon/icon_del.gif" style="cursor:pointer;cursor:hand" onclick=\"RAP.fileUploadForm()\"/> rap.gw.server_'+item.version+'</div></p>');
		$("#dialog #fields #rapForm #version").val(item.version);
		$("#dialog #fields #rapForm #note").val(item.note);
		$("#dialog").dialog({
			title:$.rtls.rap.dialog.title[1],
			autoOpen: false,
			width: 700,
			modal: true,
			buttons: [{
				text : $.rtls.commons.button.ok,
				click : function() {
					var version = $('#version').val();
					if(!$.string(version).blank()){
						$.ajax({
							async : true,
							type: 'post',
							url: "/service/rap.json?action=mod.rap.version",
							dataType: 'json',
				            data : { 
								"rapVersionId" : item.rapVersionId,
								"fileName" : $("#dialog #fields #rapForm #fileName").val(),
								"note" : $("#dialog #fields #rapForm #note").val(),
								"version" : $("#dialog #fields #rapForm #version").val()
							},
							beforeSend: function(x) {
							    if(x && x.overrideMimeType) {
							    	x.overrideMimeType("application/json;charset=UTF-8");
							    }
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            	Log.error("responseText: " + XMLHttpRequestfgfg.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
				            },
				            success : function (data) {
								if(data.result == 'success'){
									RAP.getVersions();
									$("#dialog").dialog( "close" );
								}else{
									Log.message($.rtls.commons.dialog.title.error, $.rtls.rap.message.uploadfail);
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
								click : function() {
									$( this ).dialog( "close" );
								}
							}],
							close: function() {
					            $.validity.clear();
					        }
					        
					    });
						$("#dialog-message").html($.rtls.rap.message.version);
						$('#dialog-message').dialog('open');
					}
					
				},
			},{
				text : $.rtls.commons.button.cancel,
				click : function() {
					$( this ).dialog( "close" );
				}
			}],
			close: function() {
				$.validity.clear();
				$("#dialog").html("");
				$("#dialog").dialog('destroy');
			}
		});
		$( "#dialog" ).dialog( "open" );
        
	},
	del : function(ix){
		var item = RAP.$items[ix];
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
						url: "/service/rap.json?action=del.rap.version",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"rapVersionId" : item.rapVersionId,
							"version" : item.version,
							"fileName" : item.fileName,
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
								RAP.getVersions();
								$("#dialog-confirm").dialog( "close" );
							}else{
								Log.dialog($.rtls.commons.dialog.title.error, $.rtls.rap.message.delfail);
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
		$("#dialog-confirm").append($.rtls.rap.message.delconfirm);
		$('#dialog-confirm').dialog('open');
	},
	selectVersion : function(){
		$.ajax({
			async : true,
			type: 'get',
			url: "/service/rap.json?action=select.rap.version",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				"rapVersionId" : $(':radio[name="isUse"]:checked').val()
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	if(data.result == 'success'){
					RAP.getVersions();
					$("#dialog-confirm").dialog( "close" );
				}else{
					Log.dialog($.rtls.commons.dialog.title.error, $.rtls.rap.message.selectfail);
				}
            }
        });
		
	},
	upgradeVerion : function(){
		RAP.$upgradeFlag = -1;
		$("#dialog").dialog({
			title : $.rtls.rap.dialog.title[2],
	        width: "400",
	        bgiframe: true,
	        autoOpen: false,
	        modal: true,
	        resizable: false,
	        buttons: [{
	        	text : $.rtls.commons.button.ok,
				click: function() {
					if(RAP.$upgradeFlag != -1){
						
						$('#dialog').siblings('.ui-dialog-buttonpane').find('button:first').hide();
						$('#dialog').siblings('.ui-dialog-buttonpane').find('button:last').hide();
						
						$.ajax({
							async : true,
							type: 'get',
							url: "/service/rap.json?action=upgrade.rap.version",
							contentType: "application/json; charset=utf-8",
				            dataType: 'json',
				            data : { 
								"upgradeFlag" : RAP.$upgradeFlag
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
				            },
				            success : function (data) {
				            	if(data.result == 'success'){
				            		Log.dialog($.rtls.commons.dialog.title.ok, $.rtls.rap.message.upgradesuccess);
									$("#dialog").dialog( "close" );
								}else{
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.rap.message.upgradefail);
								}
				            }
				        });
						
					}else{
						Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.rap.message.upgradetype);
					}
					
				},
	        },{
	        	text : $.rtls.commons.button.cancel,
				click: function() {
					$( this ).dialog( "close" );
				}
			}],
			open: function() {
				var html = '<div style="padding:5px">';
				html += '<ol id="rapversion-selectable" class="ui-selectable">';
				html += '	<li class="ui-widget-content button-rounded" style="cursor:pointer"> 升级 </li>';
				html += '	<li class="ui-widget-content button-rounded" style="cursor:pointer"> 降级 </li>';
				html += '</ol>';
				html += '</div>';
				$(this).html(html);
				$("#rapversion-selectable").selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							RAP.$upgradeFlag = $( "#rapversion-selectable li" ).index( this );
						});		
					}
				});
			},
			close: function() {
				$(this).html('');
				$("#dialog").html("");
				$("#dialog").dialog('destroy');
	        }
	        
	    });
		$('#dialog').dialog('open');
			
		
		
	},
	fileUpload : function(){
		var options = {
			success : RAP.fileUploadResponse,
			url : '/fileupload.json?action=file.upload',
			type : 'post',
		};
		$('#rapForm').ajaxSubmit(options);
		$("#rapForm #fileupload-result").append("<img src='/resources/commons/images/tree/throbber.gif'/>");
		
	},
	fileUploadForm : function(){
		$("#rapForm #fileName").val("");
		$("#rapForm #fileExt").val("");
		$("#rapForm #fileupload-result").html('<input type="file" id="Filedata" name="Filedata" class="multi" maxlength="1" onchange="RAP.fileUpload();"/>');
	},
	fileUploadResponse : function(responseText, status){
		var data = responseText;
		if(data.result == 'success'){
			$("#rapForm #fileName").val(data.fileName);
			$("#rapForm #fileExt").val(data.fileExt);
			$("#rapForm #fileupload-result").html(" <img src='/resources/commons/images/icon/icon_del.gif' style='cursor:pointer;cursor:hand' onclick=\"RAP.fileUploadForm()\"/> "+data.fileName+" ("+data.fileSize+"byte)");
		}else{
			$("#rapForm #fileupload-result").html(" <img src='/resources/commons/images/icon/icon_del.gif' style='cursor:pointer;cursor:hand' onclick=\"RAP.fileUploadForm()\"/> "+$.rtls.rap.message.uploadfail);
		}
	},
};