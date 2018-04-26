
var Manager = {
	$startNum : 0, 
	$permissions : new HashMap(),
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[0].title+'</span><span class="bg">'+$.rtls.menu[0].sub[0]+'</span>');
		this.$permissions.put('1', $.rtls.menu[0].title);
		this.$permissions.put('2', $.rtls.menu[1].title);
		this.$permissions.put('3', $.rtls.menu[2].title);
		this.$permissions.put('4', $.rtls.menu[3].title);
		this.$permissions.put('5', $.rtls.menu[4].title);
		this.$permissions.put('6', $.rtls.menu[5].title);
		$('.top_right').html("<button id='but-add'>"+$.rtls.manager.button.add+"</button>");
		$("#but-add").button({
			icons: {primary: "ui-icon-person"}
		}).click(function() {
			Manager.add();
			return false;
		});
    	var html = '<tr>';
		html += '<th class="first">'+$.rtls.manager.list.head[0]+'</th>';
		html += '<th>'+$.rtls.manager.list.head[1]+'</th>';
		html += '<th>'+$.rtls.manager.list.head[2]+'</th>';
		html += '<th>'+$.rtls.manager.list.head[3]+'</th>';
		html += '<th>'+$.rtls.manager.list.head[4]+'</th>';
		html += '<th>'+$.rtls.manager.list.head[5]+'</th>';
		html += '<th>'+$.rtls.manager.list.head[6]+'</th>';
		html += '<th class="end">'+$.rtls.manager.list.head[7]+'</th>';
		html += '</tr>';
		$('#items thead').html(html);
		this.getManagers();
	},
	paging : function(startNum){
		this.$startNum = startNum;
		this.getManagers();
	},
	getManagers : function(){
		$('#items tbody').html("<tr><td colspan='9' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/manager.json?action=get.managers",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				"startNum" : Manager.$startNum
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#items tbody').html('');
           		var currentPageNum = parseInt(data.paging.currentPageNum);
    			var totalNum = parseInt(data.paging.totalNum);
    			var startNum = parseInt(data.paging.startNum);
    			$('.con_top .top_left').html($.rtls.manager.list.top(totalNum));
            	var items = data.items;
            	if(items.length == 0){
            		$('#items tbody').append("<tr><td colspan='10' style='height:50px'><center>"+$.rtls.manager.list.empty+"<center></td></tr>");
    			}else{
    				var item, html;
    				for(var i=0; i < items.length; i++){
    					item = items[i];
    					html = "<tr>";
    					html += "<td>"+(totalNum - startNum - i)+"</td>";	
						if(item.classId == '1'){
    						html += "<td>"+$.rtls.manager.list.className[0]+"</td>";	
    					}else{
    						html += "<td>"+$.rtls.manager.list.className[1]+"</td>";
    					}
						html += "<td>"+item.id+"</td>";
						html += "<td>"+item.name+"</td>";
						var permissions = '';
		        		for(var j=1; j <= Manager.$permissions.size(); j++){
		        			var check = false;
		        			for(var k=0; k < item.permissions.length; k++){
		        				if(item.permissions[k] == j+''){
		        					check = true;
		        					break;
		        				}
		        			}
		        			if(check){
		        				permissions += Manager.$permissions.get(j+'')+',';	
		        			}
		        			
		        		}
		        		html += "<td>"+(permissions.length == 0 ? '' : permissions.substring(0, permissions.length-1))+"</td>";
						html += "<td>"+item.firstDay.msdate()+"</td>";
						html += "<td>"+item.lastDay.msdate()+"</td>";
						html += "<td>";
						html += "<button id='but-mod-"+item.managerId+"' managerId='"+item.managerId+"'>"+$.rtls.manager.button.mod+"</button> ";
						if(item.classId > 1) html += "<button id='but-del-"+item.managerId+"'  managerId='"+item.managerId+"'>"+$.rtls.manager.button.del+"</button>";	
						html += "</td>";
						html += "</tr>";
    					$('#items tbody').append(html);
    					$("#but-mod-"+item.managerId).button({
    						icons: {primary: "ui-icon-check"}
    					}).click(function() {
    						Manager.mod($(this).attr('managerId'));
    						return false; 
    					});
    					if(item.classId > 1){
    						$("#but-del-"+item.managerId).button({
        						icons: {primary: "ui-icon-trash"}
        					}).click(function() {
        						Manager.del($(this).attr('managerId'));
        						return false; 
        					});	
    					}
    					

    				}
    			}
            	
            	html = "<a href=\"javascript:Manager.paging(0)\"><img src='/resources/commons/images/icon/icon_paging_first.gif' /></a>";
    			if(data.paging.isPrevPage == 'true'){
    				html += "<a href=\"javascript:Manager.paging('"+data.paging.prevNum+"')\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
    			}else{
    				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
    			}
    			var pages = data.paging.pages;
    			for(var i=0; i < pages.length; i++){
    				var page = pages[i];
    				html += "<a href=\"javascript:Manager.paging('"+page.startNum+"')\">";
    				if(currentPageNum == page.pageNum){
    					html += "<span class='num_on'>"+page.pageNum+"</span>";
    				}else{
    					html += "<span class='num'>"+page.pageNum+"</span>";
    				}
    				html += "</a>";
    			}
    			if(data.paging.isNextPage == 'true'){
    				html += "<a href=\"javascript:Manager.paging('"+data.paging.nextNum+"')\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
    			}else{
    				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
    			}
    			html += "<a href=\"javascript:Manager.paging('"+data.paging.lastNum+"')\"><img src='/resources/commons/images/icon/icon_paging_last.gif' /></a>";
    			$('.paginate').html(html);
			}
		});
		
	},
	add : function(){
		var permisitionField = '';
		for(var i=1; i <= this.$permissions.size()-1; i++){ /*此处size-1是因为标签管理集成到工具类中，没有标签管理类了，在新建用户权限中不应出现标签选项*/
			permisitionField += '<input type="checkbox" id="permissions'+i+'" name="permissions" value="'+i+'"/><span> '+this.$permissions.get(i)+'</span> ';
		}
		
		var html = '<fieldset id="fields">';
		html += '<table>';
		html += '<tr>';
		html += '<td width="100"><label>* '+$.rtls.manager.form.id+'</label></td>';
		html += '<td align="left"><input type="text" id="id" /><button id="but-id">'+$.rtls.manager.button.idcheck+'</button><span id="idprint"></span></td>';
		html += '</tr>';
		html += '<tr>';
		html += '<td width="100"><label>* '+$.rtls.manager.form.password+'</label></td>';
		html += '<td align="left"><input type="password" id="password"/></td>';
		html += '</tr>';
		html += '<tr>';
		html += '<td width="100"><label>* '+$.rtls.manager.form.passwordRe+'</label></td>';
		html += '<td align="left"><input type="password" id="passwordRe"/></td>';
		html += '</tr>';
		html += '<tr>';
		html += '<td width="100"><label>* '+$.rtls.manager.form.name+'</label></td>';
		html += '<td align="left"><input type="text" id="name"/></td>';
		html += '</tr>';
		html += '<tr>';
		html += '<td width="100" valign="top"><label>* '+$.rtls.manager.form.permission+'</label></td>';
		html += '<td align="left">'+permisitionField+'</td>';
		html += '</tr>';
		html += '</table>';
		html += '</fieldset>';
		$("#dialog").html(html);
		
		$("#dialog #fields #id").attr("maxlength", "20");
		$("#dialog #fields #password").attr("maxlength", "20");
		$("#dialog #fields #passwordRe").attr("maxlength", "20");
		
		$("#dialog #fields #euid").addClass("input-readonly");
		$("#dialog #fields #euid").attr("maxlength", "16");
		$("#dialog #fields #phone2").attr("maxlength", "4");
		$("#dialog #fields #phone3").attr("maxlength", "4");
		// ID 체크
		$("#dialog #but-id").button({
			icons: {primary: "ui-icon-key"}
		}).click(function() {
			$.validity.start();
			$.validity.setup({outputMode:"summary" });
			$("#fields #id").require().match('id');
			var result = $.validity.end();
			if(result.valid){
				$.ajax({
					async : true,
					type: 'GET',
					url: "/service/manager.json?action=check.manager.id",
					contentType: "application/json; charset=utf-8",
		            dataType: 'json',
		            data : { 
						"id" : $("#id").val()
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) { 
						Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
		            },
		            success : function (data) {
		            	$("#dialog #fields #idprint").html($.rtls.validity.checkId('&quot;<span style="color:red">'+$("#id").val()+'</span>&quot;', data.result));
		            	$.validity.clear();
					}
				});
			}
			return false; 
		});
		
		
		$("#dialog").dialog({
			title: $.rtls.manager.dialog.title.add,
			autoOpen: false,
			width: 500,
			modal: true,
			buttons: [
			{
				text : $.rtls.commons.button.ok,
				click : function() {
					$.validity.start();
					$.validity.setup({outputMode:"summary" });
					$("#dialog #fields #id").require($.rtls.validity.required($.rtls.manager.form.id)).match("id", $.rtls.validity.match('id'));
					$("#dialog #fields #password").require($.rtls.validity.required($.rtls.manager.form.password));
					$("#dialog #fields #passwordRe").require($.rtls.validity.required($.rtls.manager.form.passwordRe));
					$("#dialog #fields #name").require($.rtls.validity.required($.rtls.manager.form.name));
					var result = $.validity.end();
					if(result.valid){
						var error = "";
						if($.string($('#idprint').text()).blank()){
							error += "<ul>"+$.rtls.validity.check($.rtls.manager.form.id)+"</ul>";
						}
						var password =  $("#dialog #fields #password").val();
						var passwordRe =  $("#dialog #fields #passwordRe").val();
						if(password != passwordRe){
							error += "<ul>"+$.rtls.validity.notequal($.rtls.manager.form.password, $.rtls.manager.form.passwordRe)+"</ul>";
						}
						var permissions = "";
				    	$("input[name=permissions]").each(function(){
				    		if(this.checked){
				    			permissions += this.value+"|";
				    		}
				    	});
				    	if(permissions.length > 0){
				    		permissions = permissions.substring(0, permissions.length - 1);
				    	}
						if($.string(permissions).blank()){
							error += "<ul>"+$.rtls.validity.select($.rtls.manager.form.permission)+"</ul>";
						}
						if($.string(error).blank()){
							$.ajax({
								async : true,
								type: 'post',
								url: "/service/manager.json?action=add.manager",
								dataType: 'json',
					            data : { 
									"id" : $("#dialog #fields #id").val(),
									"password" : $.base64('encode', password),
									"name" : $("#dialog #fields #name").val(),
									"isApproved" : "true",
									"permissions" : permissions
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
										Manager.getManagers();
										$("#dialog").dialog( "close" );
									}else{
										Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.manager.message.addfail);
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
									$("#dialog-message").empty();
						            $.validity.clear();
						        }
						        
						    });
							$("#dialog-message").html(error);
							$('#dialog-message').dialog('open');
						}
						
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
						$("#dialog-message").html($("#validity"));
						$('#dialog-message').dialog('open');
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
	mod : function(managerId){
		
		$.ajax({
			async : true,
			type: 'get',
			url: "/service/manager.json?action=get.manager",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				"managerId" : managerId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	var permissionsField = '';
        		for(var i=1; i <= Manager.$permissions.size(); i++){
        			var check = false;
        			for(var j=0; j < data.item.permissions.length; j++){
        				if(i == data.item.permissions[j]){
        					check = true;
        				}
        			}
        			if(check){
        				permissionsField += '<input type="checkbox" id="permissions'+i+'" name="permissions" value="'+i+'" checked/> '+Manager.$permissions.get(i)+' ';	
        			}else{
        				permissionsField += '<input type="checkbox" id="permissions'+i+'" name="permissions" value="'+i+'"/> '+Manager.$permissions.get(i)+' ';
        			}
        			
        		}
        		
        		var html = '<fieldset id="fields">';
        		html += '<table>';
        		html += '<tr>';
        		html += '<td width="100"><label>* '+$.rtls.manager.form.id+'</label></td>';
        		html += '<td align="left"><input type="text" id="id" /></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '<td width="100"><label>* '+$.rtls.manager.form.password+'</label></td>';
        		html += '<td align="left"><input type="password" id="password"/></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '<td width="100"><label>* '+$.rtls.manager.form.passwordRe+'</label></td>';
        		html += '<td align="left"><input type="password" id="passwordRe"/></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '<td width="100"><label>* '+$.rtls.manager.form.name+'</label></td>';
        		html += '<td align="left"><input type="text" id="name"/></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '<td width="100" valign="top"><label>* '+$.rtls.manager.form.permission+'</label></td>';
        		html += '<td align="left">'+permissionsField+'</td>';
        		html += '</tr>';
        		html += '</table>';
        		html += '</table>';
        		html += '</fieldset>';
        		$("#dialog").html(html);
            	
        		$("#dialog #fields #id").addClass("input-readonly");
        		$("#dialog #fields #id").attr("maxlength", "20");
        		$("#dialog #fields #id").val(data.item.id);
        		$("#dialog #fields #name").attr("maxlength", "20");
        		$("#dialog #fields #name").val(data.item.name);
        		
        		$("#dialog").dialog({
        			title: $.rtls.manager.dialog.title.mod,
        			autoOpen: false,
        			width: 800,
        			modal: true,
        			buttons: [
        			{
        				text : $.rtls.commons.button.ok,
						click : function() {
        					$.validity.start();
        					$.validity.setup({outputMode:"summary" });
        					$("#dialog #fields #name").require($.rtls.validity.required($.rtls.manager.form.name));
        					var result = $.validity.end();
        					if(result.valid){
        						var error = "";
        						var password =  $("#dialog #fields #password").val();
        						if(!$.string(password).blank()){
        							var passwordRe =  $("#dialog #fields #passwordRe").val();
        							if($.string(passwordRe).blank()){
        								error += "<ul>"+$.rtls.validity.required($.rtls.manager.form.passwordRe)+"</ul>";
        							}else if(password != passwordRe){
        								error += "<ul>"+$.rtls.validity.notequal($.rtls.manager.form.password, $.rtls.manager.form.passwordRe)+"</ul>";
        							}
        						}
        						var permissions = "";
    					    	$("input[name=permissions]").each(function(){
    					    		if(this.checked){
    					    			permissions += this.value+"|";
    					    		}
    					    	});
    					    	if(permissions.length > 0){
    					    		permissions = permissions.substring(0, permissions.length - 1);
    					    	}
    					    	if($.string(permissions).blank()){
    					    		error += "<ul>"+$.rtls.validity.select($.rtls.manager.form.permission)+"</ul>";
    					    	}
        						if($.string(error).blank()){
	    							$.ajax({
	    								async : true,
	    								type: 'post',
	    								url: "/service/manager.json?action=mod.manager",
	    					            dataType: 'json',
	    					            data : { 
	    									"managerId" : data.item.managerId,
	    									"name" : $("#dialog #fields #name").val(),
	    									"password" : $.base64('encode', password),
	    									"permissions" : permissions
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
	    										Manager.getManagers();
	    										$("#dialog").dialog( "close" );
	    									}else{
	    										Log.dialog($.rtls.commons.dialog.title.error, $.rtls.manager.message.modfail);
	    										
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
            						$("#dialog-message").html(error);
            						$('#dialog-message').dialog('open');
        						}
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
        						$("#dialog-message").prepend($("#validity"));
        						$('#dialog-message').dialog('open');
        					}
        					
        				}
        			},{
        				text : $.rtls.commons.button.cancel,
        				click : function() {
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
	del : function(managerId){
		$("#dialog-confirm").dialog({
			title : $.rtls.commons.dialog.title.ok,
	        width: "300",
	        bgiframe: true,
	        autoOpen: false,
	        modal: true,
	        resizable: false,
	        buttons: [
	        {
	        	text : $.rtls.commons.button.ok,
				click : function() {
					$.ajax({
						async : true,
						type: 'get',
						url: "/service/manager.json?action=del.manager",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"managerId" : managerId
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
								Manager.getManagers();
								$("#dialog-confirm").dialog( "close" );
							}else{
								Log.dialog($.rtls.commons.dialog.title.error, $.rtls.manager.message.delfail);
							}
			            }
			        });
				}
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
		$("#dialog-confirm").append($.rtls.manager.message.delconfirm);
		$('#dialog-confirm').dialog('open');
	},
	login : function(){
		$.validity.start();
		$.validity.setup({outputMode:"summary" });
		$("#id").require($.rtls.validity.required($.rtls.manager.form.id));
		$("#password").require($.rtls.validity.required($.rtls.manager.form.password));
		var result = $.validity.end();
		if(result.valid){
			$.ajax({
				async : true,
				type: 'get',
				url: "/service/manager.json?action=login.manager",
				contentType: "application/json; charset=utf-8",
		        dataType: 'json',
		        data : {
		        	"id" : $("#id").val(),
					"password" :  $.base64('encode', $("#password").val())
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
		        	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
		        },
		        success : function (data) {
		    		if(data.result == 'success'){
	    				window.location = '/service/main.action';	
		    		}else if(data.result == 'error.manager.unapproved'){
		    			Log.dialog($.rtls.commons.dialog.title.error, $.rtls.manager.message.unapproved);
		    		}else{
		    			Log.dialog($.rtls.commons.dialog.title.error, $.rtls.manager.message.loginfail);
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
			$("#dialog-message").prepend($("#validity"));
			$('#dialog-message').dialog('open');
		}
		return false;
	},
	logout : function(){
		$.ajax({
			async : true,
			type: 'get',
			url: "/service/manager.json?action=logout.manager",
			contentType: "application/json; charset=utf-8",
	        dataType: 'json',
	        data : { 
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
	        	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	        },
	        success : function (data) {
    			window.location = '/service/manager.action?pages=service.login.form';
	        }
		});
	},
	change : function(managerId){
		
		$.ajax({
			async : true,
			type: 'get',
			url: "/service/manager.json?action=get.manager",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				"managerId" : managerId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
        		
        		var html = '<fieldset id="fields">';
        		html += '<table>';
        		html += '<tr>';
        		html += '<td width="100"><label>* '+$.rtls.manager.form.id+'</label></td>';
        		html += '<td align="left"><input type="text" id="id" /></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '<td width="100"><label>* '+$.rtls.manager.form.password+'</label></td>';
        		html += '<td align="left"><input type="password" id="password"/></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '<td width="100"><label>* '+$.rtls.manager.form.passwordRe+'</label></td>';
        		html += '<td align="left"><input type="password" id="passwordRe"/></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '<td width="100"><label>* '+$.rtls.manager.form.name+'</label></td>';
        		html += '<td align="left"><input type="text" id="name"/></td>';
        		html += '</tr>';
        		html += '</table>';
        		html += '</table>';
        		html += '</fieldset>';
        		$("#dialog").html(html);
            	
        		$("#dialog #fields #id").addClass("input-readonly");
        		$("#dialog #fields #id").attr("maxlength", "20");
        		$("#dialog #fields #id").val(data.item.id);
        		$("#dialog #fields #name").attr("maxlength", "20");
        		$("#dialog #fields #name").val(data.item.name);
        		
        		$("#dialog").dialog({
        			title: $.rtls.manager.dialog.title.mod,
        			autoOpen: false,
        			width: 800,
        			modal: true,
        			buttons: [
        			{
        				text : $.rtls.commons.button.ok,
						click : function() {
        					$.validity.start();
        					$.validity.setup({outputMode:"summary" });
        					$("#dialog #fields #name").require($.rtls.validity.required($.rtls.manager.form.name));
        					var result = $.validity.end();
        					if(result.valid){
        						var error = "";
        						var password =  $("#dialog #fields #password").val();
        						if(!$.string(password).blank()){
        							var passwordRe =  $("#dialog #fields #passwordRe").val();
        							if($.string(passwordRe).blank()){
        								error += "<ul>"+$.rtls.validity.required($.rtls.manager.form.passwordRe)+"</ul>";
        							}else if(password != passwordRe){
        								error += "<ul>"+$.rtls.validity.notequal($.rtls.manager.form.password, $.rtls.manager.form.passwordRe)+"</ul>";
        							}
        						}
        						if($.string(error).blank()){
	    							$.ajax({
	    								async : true,
	    								type: 'post',
	    								url: "/service/manager.json?action=mod.manager",
	    					            dataType: 'json',
	    					            data : { 
	    									"managerId" : data.item.managerId,
	    									"name" : $("#dialog #fields #name").val(),
	    									"password" : $.base64('encode', password),
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
	    										Manager.getManagers();
	    										$("#dialog").dialog( "close" );
	    									}else{
	    										Log.dialog($.rtls.commons.dialog.title.error, $.rtls.manager.message.modfail);
	    										
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
            						$("#dialog-message").html(error);
            						$('#dialog-message').dialog('open');
        						}
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
        						$("#dialog-message").prepend($("#validity"));
        						$('#dialog-message').dialog('open');
        					}
        					
        				}
        			},{
        				text : $.rtls.commons.button.cancel,
        				click : function() {
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
	}
	
};