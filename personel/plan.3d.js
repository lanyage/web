var Plan = {
	$id : 'Plan', $sbmId : 0, $componentId : 1,	
	$plan : null, $plans : null, $files : null, 
	$isMovement : 'true',
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[1].title+'</span><span class="bg">'+$.rtls.menu[1].sub[0]+'</span>');
		Plan.$plans = this.get.plans();
		this.ui.menu();
		this.ui.tab(0);
		
	},
	ui : {
		menu : function(){
			var html = '';
			html += '<div id="map3d-toolbar" style="padding:2px 2px 2px 2px; float:right">';
			html += '<ol id="map3d-selectable">';
			html += '	<li id="but-view-home" title="Home Screen" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_home.png"/></li>';
			html += '	<li id="but-view-front" title="Front Screen" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_front.png"/></li>';
			html += '	<li id="but-view-3d" title="3D Screen"class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_3d.png"/></li>';
			html += '	<li id="but-view-2d" title="2D Screen"class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_2d.png"/></li>';
			html += '	<li id="but-view-person" title="Person screen"class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_person_off.png"/></li>';
			html += '	<li id="but-zoom-in"title="Zoom in"  class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_zoom_in.png"/></li>';
			html += '	<li id="but-zoom-out" title="Zoom out"  class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_zoom_out.png"/></li>';
			html += '	<li id="but-rotate-left" title="Rotate left" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_rotate_left.png"/></li>';
			html += '	<li id="but-rotate-right" title="Rotate right"  class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_rotate_right.png"/></li>';
			html += '	<li id="but-default" title="Mouse default" class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_default_on.png"/></li>';
			html += '	<li id="but-distance-3d" title="Distance 3D" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_distance_3d_off.png"/></li>';
			html += '	<li id="but-compass"  title="Compass Enable" class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_compass.png"/></li>';
			html += '	<li id="but-reload"  title="3D Map reload" class="ui-widget-content ui-selectee" style="cursor:pointer"><img src="/resources/commons/images/3d/icon_reload.png"/></li>';
			html += '</ol>';
			html += '</div>';
			$('#menubar').html(html);
		},
		tab : function(ix){
			$('#tab').find('ul').html('');
        	var item, html; 
        	for(var i=0; i < Plan.$plans.length; i++){
				item = Plan.$plans[i];
				html = "<li id='"+i+"' class='ui-state-default ui-corner-top' onmouseover='Plan.ui.tabOver("+i+")' onmouseout='Plan.ui.tabOut("+i+")'>" +
				"<a href=\"javascript:Plan.ui.tabSelect("+i+")\"><img src='/resources/commons/images/tree/dir.gif'/> "+item.name+"</a>" +
				"</li>";
				$('#tab').find('ul').append(html);
			}
			Plan.ui.tabSelect(ix);
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
			if(Plan.$plan == null || Plan.$plan.planId != Plan.$plans[ix].planId){
				Plan.$plan = Plan.$plans[ix];
				Plan.$files = Plan.get.files();
				var sbmPath = '/files/plan/';
				var texturePath = '/files/plan/map_'+Plan.$plan.planId+'/';
				var gkxmlPath = '/files/plan/map_'+Plan.$plan.planId+'.xml';
				if(!Unity.$isMapInit){
					Unity.init(Plan, '100%', 800, sbmPath, texturePath, gkxmlPath);
				}else{
					Unity.clearSBM();
					Unity.createGKXML(sbmPath, texturePath, gkxmlPath);
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
			Plan.edit.form();
		},
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
		files : function(){
			var items = [];
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/plan.json?action=get.plan.files",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	'planId' : Plan.$plan.planId
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	items = data.files;
				}
			});
			return items;
		},
	},
	edit : {
		form : function(){
			var html = '';
			html += '<table id="form-mod" class="form-fields">';
			html += '<tr>';
			html += '    <td colspan="2" style="text-align:right">';
			html += "		<span id='result'></span>";
			html += '		<button id="but-mod">'+$.rtls.device.button.mod+'</button> ';
			html += '    </td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td class="labels">'+$.rtls.plan.form.planName+'</td>';
			html += '    <td style="text-align:left; width:300px">';
			html += '		<input type="text" id="name" />'; 
		    html += '    </td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td class="labels">'+$.rtls.plan.form.planPixels+'</td>';
			html += '    <td style="text-align:left; width:300px">';
			html += '		1m = <input type="text" id="pixels" style="text-align: right; width:60px;"/>px,'; 
		    html += '		1px = <input type="text" id="meter" style="text-align: right; width:60px;"/>m ';
		    html += '    </td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td class="labels">'+$.rtls.plan.form.isMovement+'</td>';
			html += '    <td style="text-align:left">';
			html += '		<ol id="ismovement-selectable" class="ui-selectable">';
	        html += '			<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.plan.form.use+' </li>';
	        html += '			<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.plan.form.unused+' </li>';
	        html += '		</ol>';
	        html += '    </td>';
			html += '</tr>';
			html += '</table>';
			html += '<form id="plan-upload-file" action="/service/planupload.json" method="POST" enctype="multipart/form-data">';
			html += '<input type="hidden" name="action" value="upload.plan.file"/>';
			html += '<input type="hidden" name="planId" value="'+Plan.$plan.planId+'"/>';
			html += '<table class="form-fields">';
			html += '<tr>';
			html += '    <td class="labels">'+$.rtls.plan.form.mapFile+'</td>';
			html += '    <td style="text-align:left">';
			html += '		<input id="plan-file" type="file" name="plan-file" multiple="" style="width:250px">';
			html += '    </td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td colspan="2">';
			html += '		<div id="plan-dropzone">';
			html += '			<div id="plan-dropzone-msg">'+$.rtls.plan.message.dropzone+'</div>';
			html += '		</div>';
			html += '		<button>'+$.rtls.plan.button.upload+'</button>';
			html += '		<table id="plan-uploaded-files" class="table_list">';
			html += '		<thead>';
			html += '		<tr>';
			html += '   		<th>'+$.rtls.plan.form.del+'</th>';
			html += '   		<th>'+$.rtls.plan.form.name+'</th>';
			html += '   		<th>'+$.rtls.plan.form.type+'</th>';
			html += '   		<th>'+$.rtls.plan.form.size+'</th>';
			html += '		</tr>';
			html += '		</thead>';
			html += '		<tbody>';
			if(Plan.$files.sbm.exists == 'true'){
				html += '	<tr id="map_1.sbm">';
				html += '		<td><img src="/resources/commons/images/icon/icon_del.gif" style="cursor:pointer" onclick="Plan.edit.delPlanFile(\'map_1.sbm\')" /></td>';
				html += '		<td style="text-align:left; padding-left:5px;">'+Plan.$files.sbm.fileName+'</td>';
				html += '		<td><img src="/resources/commons/images/ext/'+Plan.$files.sbm.ext+'.gif" onerror="this.src=\'/resources/commons/images/ext/etc.gif\';" /></td>';
				html += '		<td>'+Plan.$files.sbm.size+' KByte</td>';
				html += '	</tr>';
			}
			if(Plan.$files.gkxml.exists == 'true'){
				html += '	<tr id="map_1.xml">';
				html += '		<td><img src="/resources/commons/images/icon/icon_del.gif" style="cursor:pointer" onclick="Plan.edit.delPlanFile(\'map_1.xml\')" /></td>';
				html += '		<td style="text-align:left; padding-left:5px;">'+Plan.$files.gkxml.fileName+'</td>';
				html += '		<td><img src="/resources/commons/images/ext/'+Plan.$files.gkxml.ext+'.gif" onerror="this.src=\'/resources/commons/images/ext/etc.gif\';" /></td>';
				html += '		<td>'+Plan.$files.gkxml.size+' KByte</td>';
				html += '	</tr>';
			}
			if(Plan.$files.gpl.exists == 'true'){
				html += '	<tr id="map_1.gpl">';
				html += '		<td><img src="/resources/commons/images/icon/icon_del.gif" style="cursor:pointer" onclick="Plan.edit.delPlanFile(\'map_1.gpl\')" /></td>';
				html += '		<td style="text-align:left; padding-left:5px;">'+Plan.$files.gpl.fileName+'</td>';
				html += '		<td><img src="/resources/commons/images/ext/'+Plan.$files.gpl.ext+'.gif" onerror="this.src=\'/resources/commons/images/ext/etc.gif\';" /></td>';
				html += '		<td>'+Plan.$files.gpl.size+' KByte</td>';
				html += '	</tr>';
			}
			html += '		</tbody>';
			html += '		</table>';
			html += '    </td>';
			html += '</tr>';
			html += '</table>';
			html += '</form>';
			html += '<form id="texture-upload-file" action="/service/planupload.json" method="POST" enctype="multipart/form-data">';
			html += '<input type="hidden" name="action" value="upload.plan.texture.file"/>';
			html += '<input type="hidden" name="planId" value="'+Plan.$plan.planId+'"/>';
			html += '<table class="form-fields">';
			html += '<tr>';
			html += '    <td class="labels">'+$.rtls.plan.form.textureFile+'</td>';
			html += '    <td style="text-align:left">';
			html += '		<input id="texture-file" type="file" name="texture-file" multiple="" style="width:250px">';
			html += '    </td>';
			html += '</tr>';
			html += '<tr>';
			html += '    <td colspan="2">';
			html += '		<div id="texture-dropzone">';
			html += '			<div id="texture-dropzone-msg">'+$.rtls.plan.message.dropzone+'</div>';
			html += '		</div>';
			html += '		<button>'+$.rtls.plan.button.upload+'</button>';
			html += '		<table id="texture-uploaded-files" class="table_list">';
			html += '		<thead>';
			html += '		<tr>';
			html += '   		<th>'+$.rtls.plan.form.del+'</th>';
			html += '   		<th>'+$.rtls.plan.form.name+'</th>';
			html += '   		<th>'+$.rtls.plan.form.type+'</th>';
			html += '   		<th>'+$.rtls.plan.form.size+'</th>';
			html += '		</tr>';
			html += '		</thead>';
			html += '		<tbody>';
			var texture = {};
			for(var i=0; i < Plan.$files.textureFiles.length; i++){
				texture = Plan.$files.textureFiles[i]
				html += '	<tr id="'+texture.fileName+'">';
				html += '		<td><img src="/resources/commons/images/icon/icon_del.gif" style="cursor:pointer" onclick="Plan.edit.delTextureFile(\''+texture.fileName+'\')" /></td>';
				html += '		<td style="text-align:left; padding-left:5px;">'+texture.fileName+'</td>';
				html += '		<td><img src="/resources/commons/images/ext/'+texture.ext+'.gif" onerror="this.src=\'/resources/commons/images/ext/etc.gif\';" /></td>';
				html += '		<td>'+texture.size+' KByte</td>';
				html += '	</tr>';
			}
			html += '		</tbody>';
			html += '		</table>';
			html += '    </td>';
			html += '</tr>';
			html += '</table>';
			html += '</form>';
			$('#plan-form').html(html);
			
			$('#name').val(Plan.$plan.name);
			$('#pixels').val(Plan.$plan.pixels);
			$('#meter').val(Plan.$plan.meter);
			Plan.$isMovement = Plan.$plan.isMovement;
			
			$('#pixels').keyup(function( event ) {
				 var pixels = $('#pixels').val();
				 $('#meter').val(parseFloat(1/pixels).toFixed(5));
			});
			$('#meter').keyup(function( event ) {
				 var meter = $('#meter').val();
				 $('#pixels').val(parseFloat(1/meter).toFixed(5));
			});
			$("#ismovement-selectable").selectable({
				stop: function() {
					$( ".ui-selected", this ).each(function() {
						var ix = $( "#ismovement-selectable li" ).index( this );
						if(ix == 0){
							Plan.$isMovement = 'true';	
						}else{
							Plan.$isMovement = 'false';
						}
					});		
				}
			});
			$("#but-mod").button({
				icons: {primary: "ui-icon-plus"}
			}).click(function() {
				Plan.edit.mod();
			});
			
			if(Plan.$plan.isMovement == 'true'){
				$('ol#ismovement-selectable li').eq(0).addClass('ui-selected');	
			}else{
				$('ol#ismovement-selectable li').eq(1).addClass('ui-selected');
			}
			if (!$('input[type="file"]')[0].files) { //ie
				$('#plan-dropzone-msg').html($.rtls.plan.message.dropzonemsg);
				$('#texture-dropzone-msg').html($.rtls.plan.message.dropzonemsg);
		    }
			
			// 도면 파일 업로드
			$('#plan-upload-file').fileUploadUI({
	            namespace: 'plan-upload-file',
	            fileInputFilter: '#plan-file',
	            dropZone: $('#plan-dropzone'),
	            uploadTable: $('#plan-uploaded-files'),
	            downloadTable: $('#plan-uploaded-files'),
	            buildUploadRow: function (files, index) {
	            	var file = files[index];
	            	var ext = file.name.substring(file.name.lastIndexOf(".")+1, file.name.length);
	            	$('#plan-uploaded-files tr').each(function (i, row) {
				        var $row = $(row);
				        if ($row.attr('id') == 'map_'+Plan.$plan.planId+'.'+ext){
				        	$row.remove(); 
				        }
				    });
					var html = '<tr>';
        			html += '<td>'+(index+1)+'</td>';
        			html += '<td style="text-align:left padding-left:5px;" class="file_upload_progress">'+file.name+'<div></div></td>';
					html += '<td><img src="/resources/commons/images/ext/'+ext+'.gif" onerror="this.src=\'/resources/commons/images/ext/etc.gif\';" /></td>';
					html += '<td>'+parseInt(file.size/1024).formatMoney(0)+' KByte<\/td>';
					html += '</tr>';
	            	return $(html);
	            },
	            buildDownloadRow: function (file) {
	            	if(file.result == 'success'){
        		    	var html = '<tr id="'+file.fileName+'">';
            			html += '<td><img src="/resources/commons/images/icon/icon_del.gif" style="cursor:pointer" onclick="Plan.edit.delPlanFile(\''+file.name+'\')" /></td>';
            			html += '<td style="text-align:left; padding-left:5px;" class="file_upload_progress">'+file.fileName+'<div></div></td>';
    					html += '<td><img src="/resources/commons/images/ext/'+file.fileExt+'.gif" onerror="this.src=\'/resources/commons/images/ext/etc.gif\';" /></td>';
    					html += '<td>'+parseInt(file.fileSize/1024).formatMoney(0)+' KByte<\/td>';
    					html += '</tr>';
					    return $(html);
	            	}else{
	            		return null;
	            	}
	            	
	            }
	        });
			
			// Texture 파일 업로드
			$('#texture-upload-file').fileUploadUI({
	            namespace: 'texture-upload-file',
	            fileInputFilter: '#texture-file',
	            dropZone: $('#texture-dropzone'),
	            uploadTable: $('#texture-uploaded-files'),
	            downloadTable: $('#texture-uploaded-files'),
	            buildUploadRow: function (files, index) {
	            	var file = files[index];
	            	var ext = file.name.substring(file.name.lastIndexOf(".")+1, file.name.length);
	            	$('#texture-uploaded-files tr').each(function (i, row) {
				        var $row = $(row);
				        if ($row.attr('id') == file.name){
				        	$row.remove(); 
				        }
				    });
					var html = '';
	            	html += '<tr>';
	            	html += '<td>'+(index+1)+'</td>';
					html += '<td style="text-align:left; padding-left:5px;" class="file_upload_progress">'+file.name+'<div></div></td>';
					html += '<td><img src="/resources/commons/images/ext/'+ext+'.gif" onerror="this.src=\'/resources/commons/images/ext/etc.gif\';" /></td>';
					html += '<td>'+parseInt(file.size/1024).formatMoney(0)+' KByte</td>';
					html += '</tr>';
					return $(html);
	            },
	            buildDownloadRow: function (file) {
	            	if(file.result == 'success'){
            			var html = '<tr id="'+file.fileName+'">';
            			html += '	<td><img src="/resources/commons/images/icon/icon_del.gif" style="cursor:pointer" onclick="Plan.edit.delTextureFile(\''+file.fileName+'\')" /></td>';
        				html += '	<td style="text-align:left; padding-left:5px">'+file.fileName+'<\/td>';
    					html += '	<td><img src="/resources/commons/images/ext/'+file.fileExt+'.gif" onerror="this.src=\'/resources/commons/images/ext/etc.gif\';" /><\/td>';
    					html += '	<td>'+parseInt(file.fileSize/1024).formatMoney(0)+' KByte<\/td>';
    					html += '</tr>';
    					return $(html);
	            		
	            	}else{
	            		return null;
	            	}
	            	
	            }
	        });
		},
		delPlanFile : function(fileName){
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/plan.json?action=del.plan.file",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	'planId' : Plan.$plan.planId,
	            	'fileName' : fileName,
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	if(data.result == 'success'){
	            		$('#plan-uploaded-files tr').each(function (i, row) {
					        var $row = $(row);
					        if ($row.attr('id') == fileName){
					        	$row.remove(); 
					        }
					    });
	            	}
				}
			});
		},
		delTextureFile : function(fileName){
			$.ajax({
				async : false,
				type: 'GET',
				url: "/service/plan.json?action=del.plan.texture.file",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
	            	'planId' : Plan.$plan.planId,
	            	'fileName' : fileName,
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	if(data.result == 'success'){
	            		$('#texture-uploaded-files tr').each(function (i, row) {
					        var $row = $(row);
					        if ($row.attr('id') == fileName){
					           $row.remove(); 
					        }
					    });
	            	}
				}
			});
		},
		mod : function(){
			$.validity.start();
			$.validity.setup({outputMode:"summary" });
			$("#item-form #fields #name").require($.rtls.validity.required($.rtls.plan.form.planName));
			$("#item-form #fields #pixels").require($.rtls.validity.required($.rtls.plan.form.planPixels)).match("number", $.rtls.validity.match('pixels'));
			$("#item-form #fields #meter").require($.rtls.validity.required($.rtls.plan.form.planName)).match("number", $.rtls.validity.match('meter'));
			var result = $.validity.end();
			if(result.valid){
				$.ajax({
					async : true,
					type: 'post',
					url: "/service/plan.json?action=mod.plan",
					dataType: 'json',
		            data : { 
		            	"planId" : Plan.$plan.planId,
						"name" :$("#name").val(),
						"pixels" : $("#pixels").val(),
						"meter" : $("#meter").val(),
						"isMovement" : Plan.$isMovement,
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
		            		Plan.$plans = Plan.get.plans();
		            		for(var i=0; i < Plan.$plans.length; i++){
		            			if(Plan.$plans[i].planId == Plan.$plan.planId){
		            				Plan.$plan = Plan.$plans[i];
		            				Plan.ui.tab(i);
		            				break;
		            			}
		            		}
						}else if(data.result == 'error.plan.name.dublicate'){
							Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.plan.message.namedublicate, { my: "center center", at: "center center", of: "#plan-form" });
						}else if(data.result == 'error.plan.file.exists'){
							Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.plan.message.fileexists, { my: "center center", at: "center center", of: "#plan-form" });
						}else if(data.result == 'error.system'){
							Log.dialog($.rtls.commons.dialog.title.error, $.rtls.commons.message.errorsystem, { my: "center center", at: "center center", of: "#plan-form" });
						}
		        	
					}
				});
				
			}
		},
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