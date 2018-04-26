var Plan = {
	$id : 'plan',	
	$ix : 0, $form : '',
	$plan : null, $plans : null,
	$config : null,
	$meter : 0, $isMovement : 'true', $map : null,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[1].title+'</span><span class="bg">'+$.rtls.menu[1].sub[0]+'</span>');
		$('.top_right').append('<button id="but-add" class="button button-rounded button-small">'+$.rtls.plan.button.add+'</button>');
		this.getConfig();
		var html = '<fieldset id="fields" style="width:99%">';
        html += '<form id="planForm" name="planForm" method="post" enctype="multipart/form-data">';
        html += '<input type="hidden" id="type" name="type" value="img" />';
        html += '<input type="hidden" id="target" name="target" value="/files/temp" />';
        html += '<input type="hidden" id="fileName" name="fileName" value="" />';
        html += '<input type="hidden" id="fileExt" name="fileExt" value="" />';
        html += '<div style="float:left"><a class="button button-glaw button-border button-rounded button-primary">'+$.rtls.plan.form.planName+'</a><input type="text" id="name" class="name"/></div>';
        html += '<div style="float:left"><a class="button button-glaw button-border button-rounded button-primary">'+$.rtls.plan.form.planSize+'</a><span id="planSize" class="text"></span></div>';
        html += '<div style="float:left; padding-right:5px">'
        html += '<a class="button button-glaw button-border button-rounded button-primary">'+$.rtls.plan.form.planPixels+'</a>';
        html += '	1m = <input type="text" id="pixels" class="pixels" style="text-align: right; width:60px;"/>  px'; 
        html += '</div>';
        html += '<div style="clear:both; float:left; padding-right:5px">'
        html += '<a class="button button-glaw button-border button-rounded button-primary">'+$.rtls.plan.form.isMovement+'</a>';
        html += '	<input id="isMovement" class="isMovement" name="isMovement" type="checkbox">';
        html += '</div>';
        html += '<div style="float:left; padding-right:5px">'
        html += '<a class="button button-glaw button-border button-rounded button-primary">'+$.rtls.plan.form.planFile+'</a><div id="fileupload-result"></div>';
        html += '</div>';
        html += '<div style="float:right"><button id="but-mod" class="button button-rounded button-small">'+$.rtls.plan.button.mod+'</button><button id="but-del" class="button button-rounded button-small">'+$.rtls.plan.button.del+'</button></div>';
        html += '<div style="float:left; padding-right:5px">'
        html += '<a class="button button-glaw button-border button-rounded button-primary">地图组别</a>';
        html += '<input type="text" id="plan-group" class="plan-group" style="text-align: right; width:60px;"/>'; 
        html += '</div>';
        if(this.$config.isSports == 'true'){
            html += '<p></p>';
            html += '<div style="float:left"><label style="width:100px">'+$.rtls.plan.form.sports+' '+$.rtls.plan.form.width+'</label><input type="text" id="sportsWidth"  style="width:80px;text-align:right"/><span class="text">px</span> </div>';
            html += '<div style="float:left"><label style="width:100px">'+$.rtls.plan.form.sports+' '+$.rtls.plan.form.height+'</label><input type="text" id="sportsHeight" style="width:80px;text-align:right"/><span class="text">px</span> </div>';
            html += '<div style="float:left"><label style="width:100px">'+$.rtls.plan.form.sports+' '+$.rtls.plan.form.offset+'</label>';
            html += '	<input type="text" id="offsetX" style="width:80px;text-align:right"/> <span class="text">px x</span> <input type="text" id="offsetY" style="width:80px;text-align:right"/><span class="text">px</span>';
            html += '</div>';
        }
        
        html += '</form>';
        html += '</fieldset>';
        $('#item-form').html(html);
        $('#pixels', '#item-form').keyup(function( event ) {
			 var pixels = $('#pixels', '#item-form').val();
			 Plan.$meter = parseFloat(1/pixels).toFixed(5);
		});
		$('input[name="isMovement"]').bootstrapSwitch({
			size : 'small',
			onColor : 'primary',
			animate : true
		}).on('switchChange.bootstrapSwitch', function(event, state) {
			  Plan.$isMovement = state ? "true" : "false";
		});
        
        $("#but-add").click(function() {
			Plan.add();
			return false;
		});
        $("#but-mod").click(function() {
			Plan.mod();
			return false;
		});
        $("#but-del").click(function() {
			Plan.del();
			return false;
		});
        $(".top_right button.button").hover(function(){
			$(".top_right button.button").addClass("button-primary");
		},function(){
			$(".top_right button.button").removeClass("button-primary");
		});
        $("#fields button.button").hover(function(){
			$("#fields button.button").addClass("button-primary");
		},function(){
			$("#fields button.button").removeClass("button-primary");
		});
		this.getPlans();
	},
	getConfig : function(){
		$.ajax({
			async : false,
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
            	Plan.$config = data.config;
            	
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
            	$('#tab').find('ul').html('');
            	Plan.$plans = data.plans;
            	var item, html; 
            	for(var i=0; i < Plan.$plans.length; i++){
					item = Plan.$plans[i];
					html = "<li id='"+i+"' class='ui-state-default ui-corner-top' onmouseover='Plan.tabOver("+i+")' onmouseout='Plan.tabOut("+i+")'>" +
					"<a class='button button-uppercase button-primary' href=\"javascript:Plan.tabSelect("+i+")\">"+item.name+"</a>" +
					"</li>";
					$('#tab').find('ul').append(html);
				}
				Plan.tabSelect(Plan.$ix);
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
		this.$ix = index;
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
			plan : Plan.$plan, 
			view : {isRuler : true, isGrid : true, isTool : true},
			tool : {isPointer : true, isDistance : true, isGrid : true, isRuler : false},
			isEvent : true,
			target : this
		});
		
		
		this.$plan.planId == 1 ? $('#but-del').hide() : $('#but-del').show();
		$('#name').val(this.$plan.name);
		$('#plan-group').val(this.$plan.groupName);
		$('#pixels').val(this.$plan.pixels);
		$('#planSize').html(Plan.$map.carc.pxToMeter(this.$plan.width) +'m x '+Plan.$map.carc.pxToMeter(this.$plan.height)+'m');
		$('input[name="isMovement"]').bootstrapSwitch('state', (this.$plan.isMovement == 'true' ? true : false));	
		if(this.$config.isSports){
	        $('#sportsWidth').val(this.$plan.sportsWidth);
	        $('#sportsHeight').val(this.$plan.sportsHeight);
	        $('#offsetX').val(this.$plan.offsetX);
	        $('#offsetY').val(this.$plan.offsetY);
		}
		$('#fileupload-result').html('<img src="/resources/commons/images/icon/icon_del.gif" style="cursor:pointer;cursor:hand;" onclick=\"Plan.planUploadForm(\'item-form\')\"/> map_'+this.$plan.planId+'.'+this.$plan.ext);
		Plan.$meter = this.$plan.meter;
		Plan.$isMovement = this.$plan.isMovement;
		
	},
	add : function(){
		$("#dialog").append('<fieldset id="fields"></fieldset>');
		$("#dialog #fields").append('<form id="planForm" name="planForm" method="post" enctype="multipart/form-data">');
		$("#dialog #fields #planForm").append('<input type="hidden" id="type" name="type" value="img" />');
		$("#dialog #fields #planForm").append('<input type="hidden" id="target" name="target" value="/files/temp" />');
		$("#dialog #fields #planForm").append('<input type="hidden" id="fileName" name="fileName" value="" />');
		$("#dialog #fields #planForm").append('<input type="hidden" id="fileExt" name="fileExt" value="" />');
		$("#dialog #fields #planForm").append('<p><label>* '+$.rtls.plan.form.planName+'</label><input type="text" id="name" /></p>');
		$("#dialog #fields #planForm").append('<p><label>* '+$.rtls.plan.form.planPixels+'</label>1m = <input type="text" id="pixels" style="text-align: right; width:80px"/>px</p>');
		$("#dialog #fields #planForm").append('<p><label>* '+$.rtls.plan.form.planFile+'</label><div id="fileupload-result"><input type="file" id="Filedata" name="Filedata" class="multi" maxlength="1" onchange="Plan.planUpload(\'dialog\');"/></div></p>');
		$("#dialog #fields #planForm").append('<p><label>* 地图组别</label><input type="text" id="plan-group" /></p>');
		$('#pixels', '#dialog').keyup(function( event ) {
			 var pixels = $('#pixels', '#dialog').val();
			 Plan.$meter = parseFloat(1/pixels).toFixed(5);
		});
		
		$("#dialog").dialog({
			title:$.rtls.plan.dialog.title[0],
			autoOpen: false,
			height: 250,
			width: 600,
			modal: true,
			buttons: [{
				text : $.rtls.commons.button.ok,
				click: function() {
					$.validity.start();
					$.validity.setup({outputMode:"summary" });
					$("#dialog #fields #name").require($.rtls.validity.required($.rtls.plan.form.planName));
					$("#dialog #fields #pixels").require($.rtls.validity.required($.rtls.plan.form.planPixels)).match("number", $.rtls.validity.match('pixels'));
					if($("#dialog #fields #plan-group").val()==""){
						Log.dialog($.rtls.commons.dialog.title.error,"添加失败！请填写地图组别");
						return;
					}
					var result = $.validity.end();
					if(result.valid){
						$.ajax({
							async : true,
							type: 'post',
							url: "/service/plan.json?action=add.plan",
							dataType: 'json',
				            data : { 
				            	"name" :$("#dialog #fields #name").val(),
								"pixels" : $("#dialog #fields #pixels").val(),
								"meter" : Plan.$meter,
								"isMovement" : Plan.$isMovement,
								"fileName" : $("#dialog #fields #fileName").val(),
								"fileExt" : $("#dialog #fields #fileExt").val(),
								"groupName" : $("#dialog #fields #plan-group").val()
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
				            		Plan.getPlans();
				            		$("#dialog").dialog( "close" );
								}else if(data.result == 'error.plan.name.dublicate'){
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.plan.message.namedublicate);
								}else if(data.result == 'error.plan.file.exists'){
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.plan.message.fileexists);
								}else if(data.result == 'error.system'){
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.commons.message.errorsystem);
								}
				        	
							}
						});
						
					}
				}
			},{
				text : $.rtls.commons.button.cancel,
				click: function() {
					$( this ).dialog( "close" );
				}
			}],
			close: function() {
				$("#dialog").empty();
				$.validity.clear();
			}
		});
		$( "#dialog" ).dialog( "open" );
		
	},
	mod : function(){
		$.validity.start();
		$.validity.setup({outputMode:"summary" });
		$("#item-form #fields #name").require($.rtls.validity.required($.rtls.plan.form.planName));
		$("#item-form #fields #pixels").require($.rtls.validity.required($.rtls.plan.form.planPixels)).match("number", $.rtls.validity.match('pixels'));
		if(this.$config.isSports == 'true'){
			$("#item-form #fields #sportsWidth").require($.rtls.validity.required($.rtls.plan.form.width)).match("number", $.rtls.validity.match('number'));
			$("#item-form #fields #sportsHeight").require($.rtls.validity.required($.rtls.plan.form.height)).match("number", $.rtls.validity.match('number'));
			$("#item-form #fields #offsetX").require($.rtls.validity.required($.rtls.plan.form.offset)).match("number", $.rtls.validity.match('number'));
			$("#item-form #fields #offsetY").require($.rtls.validity.required($.rtls.plan.form.offset)).match("number", $.rtls.validity.match('number'));
		}
		var result = $.validity.end();
		if(result.valid){
			$.ajax({
				async : true,
				type: 'post',
				url: "/service/plan.json?action=mod.plan",
				dataType: 'json',
	            data : { 
	            	"planId" : Plan.$plan.planId,
					"name" :$("#item-form #fields #name").val(),
					"pixels" : $("#item-form #fields #pixels").val(),
					"meter" : Plan.$meter,
					"isMovement" : Plan.$isMovement,
					"fileName" : $("#item-form #fields #fileName").val(),
					"fileExt" : $("#item-form #fields #fileExt").val(),
					"sportsWidth" : (Plan.$config.isSports == 'true' ? $("#item-form #fields #sportsWidth").val() : 0),
					"sportsHeight" : (Plan.$config.isSports == 'true' ? $("#item-form #fields #sportsHeight").val() : 0),
					"offsetX" : (Plan.$config.isSports == 'true' ? $("#item-form #fields #offsetX").val() : 0),
					"offsetY" : (Plan.$config.isSports == 'true' ? $("#item-form #fields #offsetY").val() : 0),
					"groupName" : $("#item-form #fields #plan-group").val(),
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
	            		Plan.getPlans();
					}else if(data.result == 'error.plan.name.dublicate'){
						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.plan.message.namedublicate);
					}else if(data.result == 'error.plan.file.exists'){
						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.plan.message.fileexists);
					}else if(data.result == 'error.system'){
						Log.dialog($.rtls.commons.dialog.title.error, $.rtls.commons.message.errorsystem);
					}
	            	$.validity.clear();
				}
			});
			
		}
	},
	del : function(){
		$("#dialog-confirm").dialog({
			title : $.rtls.commons.dialog.title.ok,
	        width: "300",
	        bgiframe: true,
	        autoOpen: false,
	        modal: true,
	        resizable: false,
	        buttons: [{
	        	text : $.rtls.commons.button.ok,
				click : function() {
					$.ajax({
				
						async : true,
						type: 'get',
						url: "/service/plan.json?action=del.plan",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"planId" : Plan.$plan.planId
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
			            		Plan.getPlans();
			            		$("#dialog-confirm").dialog("close");
							}else{
								$("#dialog-confirm").dialog("close");
								Log.dialog($.rtls.commons.dialog.title.error, $.rtls.plan.message.delfail);
							}
			        	
						}
					});
				},
	        },{
	        	text : $.rtls.commons.button.cancel,
				click : function() {
					$( this ).dialog( "close" );
				}
			}],
			close: function() {
				$("#dialog-confirm").empty();
	        }
	        
	    });
		$("#dialog-confirm").append($.rtls.plan.message.delconfirm);
		$('#dialog-confirm').dialog('open');
		
	},
	ratio : function(pixels){
		Plan.$meter = parseFloat(1/pixels).toFixed(5);
		$("#item-form #fields #pixels").val(pixels.toFixed(5));
	},
	planUpload : function(form){
		if(Plan.isImage($('#'+form+' #Filedata').val())){
			Plan.$form = form;
			$('#'+form+' #planForm').ajaxSubmit({
				url : '/fileupload.json?action=file.upload',
				type : 'post',
				success : function(data, status){
					if(data.result == 'success'){
						$("#"+Plan.$form+" #fields #planForm #fileName").val(data.fileName);
						$("#"+Plan.$form+" #fields #planForm #fileExt").val(data.fileExt);
						$("#"+Plan.$form+" #fields #planForm #fileupload-result").html(" <img src='/resources/commons/images/icon/icon_del.gif' style='cursor:pointer;cursor:hand' onclick=\"Plan.planUploadForm('item-form')\"/> "+data.fileName+" ("+parseInt(data.fileSize/1024).formatMoney(0)+" KByte)");
					}else{
						$("#"+Plan.$form+" #fields #planForm #fileupload-result").html(" <img src='/resources/commons/images/icon/icon_del.gif' style='cursor:pointer;cursor:hand' onclick=\"Plan.planUploadForm('item-form')\"/> "+$.rtls.plan.message.uploadfail);
					}
				},
				
			});
			$("#"+form+" #fields #planForm #fileupload-result").append("<img src='/resources/commons/images/icon/icon_load.gif'/>");
		}else{
			$("#"+form+" #fields #planForm #fileName").val("");
			Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.plan.message.typefail);
		}
	},
	planUploadForm : function(form){
		$("#"+form+" #fields #planForm #fileName").val("");
		$("#"+form+" #fields #planForm #fileupload-result").html('<input type="file" id="Filedata" name="Filedata" class="multi" maxlength="1" onchange="Plan.planUpload(\''+form+'\');"/>');
	},
	getExtension : function(filename) {
	    var parts = filename.split('.');
	    return parts[parts.length - 1];
	},
	isImage : function(filename) {
	    var ext = this.getExtension(filename);
	    switch (ext.toLowerCase()) {
	    case 'png':
	        //etc
	        return true;
	    }
	    return false;
	}
};