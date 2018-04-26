
var Tag = {
	$startNum : 0, $searchType : 0, $keyword : null, $status : 0, $type : 0,
	$tag : null, $tags : [],
	$tagstatus : new HashMap(),
	$tagType : 1, $tagStatus : 1,
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[5].title+'</span><span class="bg">'+$.rtls.menu[5].sub[1]+'</span>');
		//$('.top_right').html('<span class="button"><button type="button" onclick="Tag.add()"><img src="/resources/commons/images/icon/icon_gr_edit.gif"/>'+$.rtls.tag.button.addall+'</button></span>');
		
		var html ='<table>';
		html +='<tr>';
		html +='	<td  height="20">';
		html +='		<div id="search-fields">';
		html +='		<p>';
		html +='			<label class=" button-rounded">'+$.rtls.tag.form.search+'</label>';
		html +='			<select id="searchType" name="searchType" class=" button-rounded">';
		html +='				<option value="0">'+$.rtls.tag.form.select+'</option>';
		html +='				<option value="1">EUID</option>';
		html +='				<option value="2">序列号</option>';
		html +='			</select>';
		html +='			<input type="text" id="keyword" class=" button-rounded" value="" />';
		html +='			<button id="but-search" class="button button-rounded button-small">'+$.rtls.tag.button.search+'</button>';
		html +='		</p>';
		html +='		</div>';
		html +='	</td>';
		html +='</tr>';
		html +='<tr>';
		html +='	<td  height="20">';
		html +='		<div id="search-fields">';
		html +='			<label class=" button-rounded">'+$.rtls.tag.form.tagType+'</label>';
		html +='			<ol id="type-selectable">';
		html +='			<li class="ui-widget-content ui-selectee ui-selected button-rounded">'+$.rtls.tag.form.full+'</li>';
		html +='			<li class="ui-widget-content button-rounded">'+$.rtls.tag.type[0]+'</li>';
		html +='			<li class="ui-widget-content button-rounded">'+$.rtls.tag.type[1]+'</li>';
		html +='			<li class="ui-widget-content button-rounded">'+$.rtls.tag.type[2]+'</li>';
		html +='			</ol>';
		html +='		</div>';
		html +='	</td>';
		html +='</tr>';
		html +='<tr>';
		html +='	<td  height="20">';
		html +='		<div id="search-fields">';
		html +='			<label class=" button-rounded">'+$.rtls.tag.form.tagStatus+'</label>';
		html +='			<ol id="status-selectable">';
		html +='			<li class="ui-widget-content ui-selectee ui-selected button-rounded">'+$.rtls.tag.form.full+'</li>';
		html +='			<li class="ui-widget-content button-rounded">'+$.rtls.tag.status[0]+'</li>';
		html +='			<li class="ui-widget-content button-rounded">'+$.rtls.tag.status[1]+'</li>';
		html +='			</ol>';
		html +='		</div>';
		html +='	</td>';
		html +='</tr>';
		html +='</table>';
		$("#search-form").html(html);
		
		html ='<tr>';
		html +='<th class="first">'+$.rtls.tag.list.head[0]+'</th>';
		html +='<th>'+$.rtls.tag.list.head[1]+'</th>';
		html +='<th>'+$.rtls.tag.list.head[2]+'</th>';
		html +='<th>'+$.rtls.tag.list.head[3]+'</th>';
		html +='<th>'+$.rtls.tag.list.head[4]+'</th>';
		html +='<th>'+$.rtls.tag.list.head[5]+'</th>';
		html +='<th>'+$.rtls.tag.list.head[6]+'</th>';
		html +='<th>'+$.rtls.tag.list.head[7]+'</th>';
		html +='<th class="end">'+$.rtls.tag.list.head[8]+'</th>';
		html +='</tr>';
		$("#items thead").html(html);
		
		$("#but-search").button({
			icons: {primary: "ui-icon-search"}
		}).click(function() {
			Tag.$startNum = 0;
			Tag.$searchType = $('#searchType').val();
			Tag.$keyword = $('#keyword').val();
			Tag.getTags();
			return false; 
		});
		$("#type-selectable").selectable({
			stop: function() {
				$( ".ui-selected", this ).each(function() {
					Tag.$startNum = 0;
					Tag.$type = $( "#type-selectable li" ).index( this );
					Tag.getTags();
				});		
			}
		});
		$("#status-selectable").selectable({
			stop: function() {
				$( ".ui-selected", this ).each(function() {
					Tag.$startNum = 0;
					Tag.$status = $( "#status-selectable li" ).index( this );
					Tag.getTags();
				});		
			}
		});
		this.$tagstatus.put('1',  $.rtls.tag.status[0]);
		this.$tagstatus.put('2',  $.rtls.tag.status[1]);
		this.$tagstatus.put('3',  $.rtls.tag.status[2]);
		this.$tagstatus.put('4',  $.rtls.tag.status[3]);
		this.$tagstatus.put('5',  $.rtls.tag.status[4]);
		this.$tagstatus.put('6',  $.rtls.tag.status[5]);
		Tag.getTags();
	},
	paging : function(startNum){
		this.$startNum = startNum;
		this.getTags();
	},
	getTags : function(){
		$('#items tbody').html("<tr><td colspan='9' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/tag.json?action=get.tags",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
            	"startNum" : Tag.$startNum,
            	"type" : Tag.$type,
				"status" : Tag.$status,
				"searchType" : Tag.$searchType,
				"keyword" : (Tag.$keyword == null ? '' : Tag.$keyword)
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#items tbody').html('');
            	$('.paginate').html('');
            	var currentPageNum = parseInt(data.paging.currentPageNum);
    			var totalNum = parseInt(data.paging.totalNum);
    			var startNum = parseInt(data.paging.startNum);
    			$('.top_left').html($.rtls.tag.list.top(totalNum));
            	var items = data.tags;
            	if(items.length == 0){
            		$('#items tbody').append("<tr><td colspan='12' style='height:50px'><center>"+$.rtls.tag.list.empty+"<center></td></tr>");
    			}else{
    				var item, html;
    				for(var i=0; i < items.length; i++){
    					item = items[i];
    					html = "<tr>";
    					html += "<td>"+(totalNum - startNum - i)+"</td>";	
    					if(item.type == '1'){
    						html += "<td>"+$.rtls.tag.type[0]+"</td>";	
    					}else if(item.type == '2'){
    						html += "<td>"+$.rtls.tag.type[1]+"</td>";	
    					}else{
    						html += "<td>"+$.rtls.tag.type[2]+"</td>";
    					}
    					html += "<td>"+item.euid+"</td>";
    					html += "<td>"+item.serial+"</td>";
    					html += "<td>"+item.version+"</td>";
    					if((new Date().getTime() - item.aliveTime) <= (24*60*60*1000)){
    						if(item.batteryState == '0'){
        						html += "<td>"+item.batteryLevel+"v, "+$.rtls.tag.form.normal+"</td>";	
        					}else{
        						html += "<td>"+item.batteryLevel+"v, "+$.rtls.tag.form.low+"</td>";
        					}
    					}else{
    						html += "<td>--</td>";
    					}
    						
    					if(item.status == '1'){
    						html += "<td>"+$.rtls.tag.status[0]+"</td>";	
    					}else if(item.status == '2'){
    						html += "<td style='color:#0000FF'>"+$.rtls.tag.status[1]+"</td>";	
    					}else if(item.status == '3'){
    						html += "<td style='color:#FF0000'>"+$.rtls.tag.status[2]+"</td>";	
    					}else if(item.status == '4'){
    						html += "<td style='color:#FF0000'>"+$.rtls.tag.status[3]+"</td>";	
    					}else if(item.status == '5'){
    						html += "<td style='color:#FF0000'>"+$.rtls.tag.status[4]+"</td>";	
    					}else if(item.status == '6'){
    						html += "<td style='color:#FF0000'>"+$.rtls.tag.status[5]+"</td>";	
    					}else{
    						html += "<td>"+$.rtls.tag.status[0]+"</td>";
    					}
    					html += "<td>"+item.aliveTime.msdate()+"</td>";
    					html += "<td>";
						html += "<button id='but_mod_"+item.euid+"' euid='"+item.euid+"' class='button button-rounded button-small'>"+$.rtls.tag.button.mod+"</button>";
						//html += "<button id='but_del_"+item.euid+"'>"+$.rtls.tag.button.del+"</button>";	
						html += "</td>";
						$('#items tbody').append(html);
						$("#but_mod_"+item.euid).button({
							icons: {primary: "ui-icon-check"}
						}).click(function() {
							Tag.mod($(this).attr('euid'));
							return false;
						});
						$("button.button").hover(function(){
							$("button.button").addClass("button-primary");
						},function(){
							$("button.button").removeClass("button-primary");
						});
    				}
    				
    				html = "<a href=\"javascript:Tag.paging(0)\"><img src='/resources/commons/images/icon/icon_paging_first.gif' /></a>";
        			if(data.paging.isPrevPage == 'true'){
        				html += "<a href=\"javascript:Tag.paging('"+data.paging.prevNum+"')\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
        			}else{
        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
        			}
        			var pages = data.paging.pages;
        			for(var i=0; i < pages.length; i++){
        				var page = pages[i];
        				html += "<a href=\"javascript:Tag.paging('"+page.startNum+"')\">";
        				if(currentPageNum == page.pageNum){
        					html += "<span class='num_on'>"+page.pageNum+"</span>";
        				}else{
        					html += "<span class='num'>"+page.pageNum+"</span>";
        				}
        				html += "</a>";
        			}
        			if(data.paging.isNextPage == 'true'){
        				html += "<a href=\"javascript:Tag.paging('"+data.paging.nextNum+"')\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
        			}else{
        				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
        			}
        			html += "<a href=\"javascript:Tag.paging('"+data.paging.lastNum+"')\"><img src='/resources/commons/images/icon/icon_paging_last.gif' /></a>";
        			$('.paginate').html(html);
    			}
            	
            	
			}
		});
		
	},
	add : function(){
		$("#dialog").html('<fieldset id="fields"></fieldset>');
      	$("#dialog #fields").append('<form id="tagForm" name="tagForm" method="post" enctype="multipart/form-data"></form>');
      	$("#dialog #fields #tagForm").append('<input type="hidden" id="type" name="type" value="file" />');
      	$("#dialog #fields #tagForm").append('<input type="hidden" id="target" name="target" value="/files/temp" />');
      	$("#dialog #fields #tagForm").append('<input type="hidden" id="fileName" name="fileName" value="" />');
      	$("#dialog #fields #tagForm").append('<input type="hidden" id="fileExt" name="fileExt" value="" />');
      	$("#dialog #fields #tagForm").append('<input type="hidden" id="targetDir" name="targetDir" value="temp" />');
      	$("#dialog #fields #tagForm").append('<p><label>'+$.rtls.tag.form.excel+'</label><div id="fileupload-result"><input type="file" id="Filedata" name="Filedata" class="multi" maxlength="1" onchange="Tag.fileUpload();"/></div></p>');
		$("#dialog").dialog({
			title:$.rtls.tag.dialog.title[0],
			autoOpen: false,
			height: 240,
			width: 580,
			modal: true,
			buttons: [{
	        	text : $.rtls.commons.button.ok,
				click: function() {
					var fileName = $('#dialog #fields #tagForm #fileName').val();
					if(!$.string(fileName).blank()){
						$("#dialog #fields #tagForm #fileupload-result").html("<img src='/commons/images/tree/throbber.gif'/>loading...");
						$.ajax({
							async : true,
							type: 'get',
							url: "/service/tag.json?pages=add.tags",
							contentType: "application/json; charset=utf-8",
				            dataType: 'json',
				            data : { 
								"fileName" : fileName
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
				            },
				            success : function (data) {
								if(data.result == 'success'){
									Tag.init();
									$("#dialog").dialog( "close" );
								}else{
									$("#dialog").dialog( "close" );
									Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.tag.message.addfail);
								}
							}
						});
					}else{
						$("#dialog-message").dialog({
							title : $.rtls.commons.dialog.title.waring,
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
						$("#dialog-message").html($.rtls.tag.message.addexcel);
						$('#dialog-message').dialog('open');
					}
					
				},
			},{
				text : $.rtls.commons.button.cancel,
				click: function() {
					$("#dialog").dialog( "close" );
				}
			}],
			close: function() {
				$("#dialog").html("");
				$("#dialog").empty();
				$.validity.clear();
			}
		});
		$( "#dialog" ).dialog( "open" );
	},
	mod : function(euid){
		
		$.ajax({
			async : true,
			type: 'get',
			url: "/service/tag.json?action=get.tag",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				"euid" : euid
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	Tag.$tagType = data.tag.type;
            	Tag.$tagStatus = data.tag.status;
            	var html = '<fieldset id="fields">';
        		html += '<table>';
        		html += '<tr>';
        		html += '<td width="100"><label>EUID</label></td>';
        		html += '<td align="left"><input type="text" id="euid" /></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '<td width="100"><label>'+$.rtls.tag.form.serialnum+'</label></td>';
        		html += '<td align="left"><input type="text" id="serial"/></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '<td width="100"><label>'+$.rtls.tag.form.type+'</label></td>';
        		html += '<td align="left">';
        		html += '<ol id="tagtype-selectable">';
				if(data.tag.type == 1){
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> '+$.rtls.tag.type[0]+' </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.tag.type[1]+' </li>';	
					html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.tag.type[2]+' </li>';	
				}else if(data.tag.type == 2){
					html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.tag.type[0]+' </li>';
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> '+$.rtls.tag.type[1]+' </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.tag.type[2]+' </li>';	
				}else{
					html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.tag.type[0]+' </li>';
					html += '<li class="ui-widget-content" style="cursor:pointer"> '+$.rtls.tag.type[1]+' </li>';
					html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> '+$.rtls.tag.type[2]+' </li>';	
				}
				
				html += '</ol>';
				html += '</td>';
        		html += '</tr>';
//        		html += '<tr>';
//        		html += '<td width="100"><label>* '+$.rtls.tag.form.status+'</label></td>';
//        		html += '<td align="left">';
//        		html += '<ol id="tagstatus-selectable">';
//        		if(data.tag.status == 2){
//        			html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> '+$.rtls.tag.status[1]+'';
//        		}else{
//        			for(var i=1; i <= Tag.$tagstatus.size(); i++){
//        				if(i != 2){
//        					if(data.tag.status == i){
//        						html += '<li class="ui-widget-content ui-selectee ui-selected" style="cursor:pointer"> ';
//        					}else{
//        						html += '<li class="ui-widget-content" style="cursor:pointer"> ';
//        					}
//        					html += Tag.$tagstatus.get(i) +'</li>';	
//        				}
//    					
//    				}
//        		}
//				
//				
//				html += '</ol>';
//        		html += '</tr>';
        		html += '</table>';
        		html += '</fieldset>';
        		$("#dialog").html(html);
            	
        		$("#dialog #fields #euid").addClass("input-readonly");
        		$("#dialog #fields #euid").val(data.tag.euid);
        		$("#dialog #fields #serial").val(data.tag.serial);
        		$("#dialog #fields #serial").attr("maxlength", "8");
        		$("#dialog #fields #serial").attr("readonly", "readonly");
        		$("#tagtype-selectable", '#dialog').selectable({
					stop: function() {
						$( ".ui-selected", this ).each(function() {
							Tag.$tagType = $( "#tagtype-selectable li" ).index( this ) + 1;
						});		
					}
				});
//        		if(data.status != 2){
//        			$("#tagstatus-selectable", "#dialog").selectable({
//    					stop: function() {
//    						$( ".ui-selected", this ).each(function() {
//    							var ix = $( "#tagstatus-selectable li" ).index( this );
//    							if(ix == 0){
//    								Tag.$tagStatus = 1;
//    							}else if(ix == 1){
//    								Tag.$tagStatus = 3;
//    							}else if(ix == 2){
//    								Tag.$tagStatus = 4;
//    							}else if(ix == 3){
//    								Tag.$tagStatus = 5;
//    							}else if(ix == 4){
//    								Tag.$tagStatus = 6;
//    							}
//    						});		
//    					}
//    				});
//    				
//        		}
				
        		
        		$("#dialog").dialog({
        			title:$.rtls.tag.dialog.title[1]+'['+data.tag.euid+']',
        			autoOpen: false,
        			width: 600,
        			modal: true,
        			buttons: [{
        	        	text : $.rtls.commons.button.ok,
        				click: function() {
        					$.validity.start();
        					$.validity.setup({outputMode:"summary" });
        					$("#dialog #fields #serial").require($.rtls.validity.required($.rtls.tag.form.serialnum));
        					var result = $.validity.end();
        					if(result.valid){
        						
        						
    							$.ajax({
    								async : true,
    								type: 'post',
    								url: "/service/tag.json?action=mod.tag",
    								dataType: 'json',
    					            data : { 
    									"euid" : data.tag.euid,
    									"serial" : $("#dialog #fields #serial").val(),
    									"type" : Tag.$tagType,
    									"status" : Tag.$tagStatus
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
    										Tag.getTags();
    										$("#dialog").dialog( "close" );
    									}else{
    										Log.dialog($.rtls.commons.dialog.title.error, $.rtls.tag.message.modfail);
    										
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
        			close: function() {
        				$("#dialog").empty();
        				$.validity.clear();
        			}
        		});
        		$( "#dialog" ).dialog( "open" );
			}
		});
	},
	del : function(euid){
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
						type: 'post',
						url: "/service/tag.json?action=del.tag",
						dataType: 'json',
			            data : { 
							"euid" : euid
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
								Tag.getTags();
								$("#dialog-confirm").dialog( "close" );
							}else{
								Log.dialog($.rtls.commons.dialog.title.error,  $.rtls.tag.message.delfail);
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
		$("#dialog-confirm").append($.rtls.tag.message.delconfirm);
		$('#dialog-confirm').dialog('open');
	},
	fileUpload : function(){
		var options = {
			success : Tag.fileUploadResponse,
			url : '/fileupload.json?action=file.upload',
			type : 'post'
			
		};
		$('#tagForm').ajaxSubmit(options);
		$("#dialog #fields #tagForm #fileupload-result").append("<img src='/resources/commons/images/icon/icon_load.gif'/>");
		
	},
	fileUploadForm : function(){
		$("#dialog #fields #tagForm #fileName").val("");
		$("#dialog #fields #tagForm #fileExt").val("");
		$("#dialog #fields #tagForm #fileupload-result").html('<input type="file" id="Filedata" name="Filedata" class="multi" maxlength="1" onchange="Tag.fileUpload();"/>');
	},
	fileUploadResponse : function(responseText, status){
		var data = responseText;
		if(data.result == 'success'){
			$("#dialog #fields #tagForm #fileName").val(data.fileName);
			$("#dialog #fields #tagForm #fileExt").val(data.fileExt);
			$("#dialog #fields #tagForm #fileupload-result").html(" <img src='/resources/commons/images/icon/icon_del.gif' style='cursor:pointer;cursor:hand' onclick=\"Tag.fileUploadForm()\"/> "+data.fileName+" ("+data.fileSize+"byte)");
		}else{
			$("#dialog #fields #tagForm #fileupload-result").html(" <img src='/resources/commons/images/icon/icon_del.gif' style='cursor:pointer;cursor:hand' onclick=\"Tag.fileUploadForm()\"/> "+$.rtls.tag.message.uploadfail);
		}
	}
};