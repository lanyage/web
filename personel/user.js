var User = {
	$isEdit : false,	
	$startNum : 0, $searchType : 0, $keyword : null,
	$groupId : 0, $moveGroupId : 0, $groupName : null, 
	$gender : 1, $status : 2,
	$tag : null, $tags : null,
	$plans : [],
	init : function(){
		$('.con_title').html($.rtls.home+'<span class="bg">'+$.rtls.menu[6].title+'</span><span class="bg">'+$.rtls.menu[6].sub[0]+'</span>');
		$('#group-edit').html('<button id="but-category" class="button button-primary button-rounded button-small">'+$.rtls.user.button.edit+'</button>');
		$('.top_right').html(
				'<button id="but-delall" class="button button-rounded button-small">'+$.rtls.user.button.delall+'</button>'+
				'<button id="but-add" class="button button-rounded button-small">'+$.rtls.user.button.add+'</button>'+
				'<button id="but-move" class="button button-rounded button-small">'+$.rtls.user.button.move+'</button>'
		);
		$("#but-category").click(function() {
			if(User.$isEdit){
				User.$isEdit = false;
			}else{
				User.$isEdit = true;
			}
			$(this).button("option", { 
		        icons: { primary: User.$isEdit ? 'ui-icon-folder-open' : 'ui-icon-folder-collapsed' }
		    });
			User.groupEdit(User.$isEdit);
			return false; 
		});
		$("#but-delall").click(function() {
			User.dels();
			return false; 
		});
		$("#but-add").click(function() {
			User.add();
			return false; 
		});
		$("#but-move").click(function() {
			User.moveGroup();
			return false; 
		});
		$(".top_right>button.button").hover(function(){
			$(".top_right>button.button").addClass("button-primary");
		},function(){
			$(".top_right>button.button").removeClass("button-primary");
		});
		var html = '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">';
		html += '<li id="0" class="ui-state-default ui-corner-top ui-tabs-selected ui-state-active" onmouseover="User.tabOver(0)" onmouseout="User.tabOut(0)">';
		html += '	<a class="button button-uppercase" href="javascript:User.tabSelect(0)">'+$.rtls.user.tab.tagissued+'</a>';
		html += '</li>';
		html += '<li id="1" class="ui-state-default ui-corner-top" onmouseover="User.tabOver(1)" onmouseout="User.tabOut(1)">';
		html += '	<a class="button button-uppercase" href="javascript:User.tabSelect(1)">'+$.rtls.user.tab.tagreturn+' </a>';
		html += '</li>';
		html += '</ul>';
		$('#tab').html(html);
		
		html = '<tr>';
		html += '<th class="first">'+$.rtls.user.list.head[0]+'</th>';
		html += '<th>'+$.rtls.user.list.head[1]+'</th>';
		html += '<th>'+$.rtls.user.list.head[2]+'</th>';
		html += '<th>'+$.rtls.user.list.head[3]+'</th>';
		html += '<th>'+$.rtls.user.list.head[4]+'</th>';
		//html += '<th>'+$.rtls.user.list.head[5]+'</th>';
		html += '<th>'+$.rtls.user.list.head[6]+'</th>';
		html += '<th>'+$.rtls.user.list.head[7]+'</th>';
		html += '<th>'+$.rtls.user.list.head[8]+'</th>';
		html += '<th>'+$.rtls.user.list.head[9]+'</th>';
		html += '<th class="end">'+$.rtls.user.list.head[10]+'</th>';
		html += '</tr>';
    	$("#items thead").html(html);
    	
//    	html = '<img src="/admin/images/search_bg.gif" alt="" style="padding:5px 5px 0 0;" />';
//    	html += '<select id="searchType">';
//    	html += '<option value="0">'+$.rtls.user.form.full+'</option>';
//    	html += '<option value="1">'+$.rtls.user.form.name+'</option>';
//    	html += '<option value="2">EUID</option>';
//    	html += '</select>';
//    	html += '<input id="keyword" type="text" class="form_basic"  style="width:350px;" />';
//    	html += '<a href="javascript:User.search()"><img src="/admin/images/btn_search1.gif" alt="" /></a>'; 
//    	$(".search").html(html);
    	this.getPlans();
    	this.getGroups();
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
		if(index == 0){this.$status = 2;}
		else if	(index == 1){this.$status = 1;}
			
		$('#tab').find('ul').find('li').each(function(i) {
		    if(i == index){
		    	$(this).addClass('ui-tabs-selected');
		    	$(this).addClass('ui-state-active');
		    }else{
		    	$(this).removeClass('ui-state-active');
				$(this).removeClass('ui-tabs-selected');
		    }
		});
		this.getUsers();
		
	},
	paging : function(startNum){
		this.$startNum = startNum;
		this.getUsers();
	},
	search : function(){
		this.$searchType = $('#searchType').val();
		this.$keyword = $('#keyword').val();
		this.getUsers();
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
            	User.$plans = data.plans;
            	
			}
		});
		
	},
	getGroups : function(){
		var treeData = {};
		$.ajax({
	        async : false,
	        type : "GET",
	        url : "/service/group.json?action=get.groups",
	        dataType : "json",    
	        success : function(data) {
	        	treeData = data;
	        },    
	        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
	    });
		
		
		$("#group-list")
		.bind("before.jstree", function (e, data) {
			
		})
		.jstree({ 
			"plugins" : ["themes","json_data","ui","crrm","dnd","types"],
			"json_data" : {
				"data" : treeData
			},
			"types" : {
				"max_depth" : -2,
				"max_children" : -2,
				"valid_children" : [ "folder", "root", "group" ],
				"types" : {
					"default"    : { 
						"valid_children" : "none", 		             
						"icon" : {"image" : "/resources/commons/images/tree/root.png"},
						"select_node" : function (e, data) {
							var obj =  $(e).closest("li");
							User.$groupId = obj.attr('id');
							User.$groupName = obj.attr('name');
							User.getUsers();
				        }
					},
					"root"   : { "valid_children" : [ "default", "root" ], "icon" : {"image" : "/resources/commons/images/tree/root.png"} },
					"group"   : { "valid_children" : [ "default", "group" ], "icon" : {"image" : "/resources/commons/images/tree/dir.gif"} },
					"folder" : {
						"valid_children" : [ "default", "group" ],
						"icon" : {"image" : "/resources/commons/images/tree/dir.gif"},
						"start_drag" : false,
						"move_node" : false,
						"delete_node" : true,
						"remove" : true
					}
				}
			}
			
		})
		.bind("loaded.jstree", function (e, data) {
			User.$groupId = treeData[0].attr.id;
			User.$groupName = treeData[0].attr.name;
			User.getUsers();
		});
	},
	getUsers : function(){
		$('#items tbody').html("<tr><td colspan='9' style='height:100px'><center><img src='/resources/commons/images/icon/icon_load.gif'/><center></td></tr>");
		$.ajax({
			async : true,
			type: 'GET',
			url: "/service/user.json?action=get.users",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				"startNum" : User.$startNum,
				"searchType" : User.$searchType,
				"userGroupId" : User.$groupId == 0 ? 1 :  User.$groupId,
				"status" : User.$status == 0 ? 2 :  User.$status,
				"keyword" : (User.$keyword == null ? '' : User.$keyword)
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
            	$('#items tbody').html('');
        		var str= "";
        		if(User.$status == 2){
        			$('#but-delall').show();	
        			$('#but-add').show();	
        		}else{
        			$('#but-delall').hide();	
        			$('#but-add').hide();
        		}
        		var currentPageNum = parseInt(data.paging.currentPageNum);
    			var totalNum = parseInt(data.paging.totalNum);
    			var startNum = parseInt(data.paging.startNum);
    			$('.top_left').html($.rtls.user.list.top(User.$groupName, totalNum));
            	var items = data.users;
            	if(items.length == 0){
            		$('#items tbody').append("<tr><td colspan='10' style='height:50px'><center>"+$.rtls.user.list.empty+"<center></td></tr>");
    			}else{
    				var item, html;
    				for(var i=0; i < items.length; i++){
    					item = items[i];
    					html = "<tr>";
						html += "<td><span class='checkbox'><input type='checkbox' id='"+item.userId+"' name='userId' value='"+item.userId+"' class='input_check'/><label for='"+item.userId+"'></label></span></td>";
						html += "<td style='vertical-align: middle;'>";
						if(item.type == '1'){
							html += "<img src='/resources/commons/images/map/icon_tag_fixed.png' style='padding-right:3px; vertical-align: middle;'/>";
						}else{
							html += "<img src='/resources/commons/images/map/icon_tag_move.png' style='padding-right:3px; vertical-align: middle;'/>";
						}
						html += item.euid+"("+$.rtls.user.form.version+" : "+item.version+", ";
						if(item.batteryState == '0'){
    						html += $.rtls.user.form.battery+" : "+item.batteryLevel+"v, "+$.rtls.user.form.normal+")</td>";	
    					}else{
    						html += $.rtls.user.form.battery+" :"+item.batteryLevel+"v, "+$.rtls.user.form.low+")</td>";
    					}
						if(item.planId == 0){
							html += "<td>"+$.rtls.user.form.full+"</td>";	
						}else{
							for(var j=0; j < User.$plans.length; j++){
								if(User.$plans[j].planId == item.planId){
									html += "<td>"+User.$plans[j].name+"</td>";
									break;
								}
							}
						}
						html += "<td>"+item.name+"</td>";
						if(item.gender == 1){
							html += "<td>"+$.rtls.user.form.man+"</td>";	
						}else{
							html += "<td>"+$.rtls.user.form.woman+"</td>";
						}
						//html += "<td>"+item.phone+"</td>";
						html += "<td align=center><div style='background-color:"+item.color+"; width:15px; height:15px'></div> "+item.size+"px</td>";
						if(item.status == 1){
							html += "<td>"+$.rtls.user.status[0]+"</td>";	
						}else{
							html += "<td style='color:blue'>"+$.rtls.user.status[1]+"</td>";
						}
						html += "<td>"+item.firstDay.msdate()+"</td>";
						if(item.lastDay != undefined){
							html += "<td>"+item.lastDay.msdate()+"</td>";	
						}else{
							html += "<td>--</td>";
						}
						
						html += "<td>";
						html += "<button id='but-mod-"+item.userId+"' userId='"+item.userId+"' class='button button-rounded button-small'>"+$.rtls.user.button.mod+"</button>";
						if(item.status == 2){
							html += "<button id='but-del-"+item.userId+"' userId='"+item.userId+"' class='button button-rounded button-small'>"+$.rtls.user.button.del+"</button>";	
						}
    					 
						html += "</td>";
						html += "</tr>";
    					$('#items tbody').append(html);
    					$("#but-mod-"+item.userId).click(function() {
    						User.mod($(this).attr('userId'));
    						return false;
    					});
    					$("button.button").hover(function(){
    						$("button.button").addClass("button-primary");
    					},function(){
    						$("button.button").removeClass("button-primary");
    					});
    					if(item.status == 2){
    						$("#but-del-"+item.userId).button({
	    						icons: {primary: "ui-icon-extlink"}
	    					}).click(function() {
	    						User.del($(this).attr('userId'));
	    						return false;
	    					});
    					}

    				}
    			}
            	
            	html = "<a href=\"javascript:User.paging(0)\"><img src='/resources/commons/images/icon/icon_paging_first.gif' /></a>";
    			if(data.paging.isPrevPage == 'true'){
    				html += "<a href=\"javascript:User.paging('"+data.paging.prevNum+"')\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
    			}else{
    				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_prev.gif' /></a>";
    			}
    			var pages = data.paging.pages;
    			for(var i=0; i < pages.length; i++){
    				var page = pages[i];
    				html += "<a href=\"javascript:User.paging('"+page.startNum+"')\">";
    				if(currentPageNum == page.pageNum){
    					html += "<span class='num_on'>"+page.pageNum+"</span>";
    				}else{
    					html += "<span class='num'>"+page.pageNum+"</span>";
    				}
    				html += "</a>";
    			}
    			if(data.paging.isNextPage == 'true'){
    				html += "<a href=\"javascript:User.paging('"+data.paging.nextNum+"')\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
    			}else{
    				html += "<a href=\"#\"><img src='/resources/commons/images/icon/icon_paging_next.gif' /></a>";
    			}
    			html += "<a href=\"javascript:User.paging('"+data.paging.lastNum+"')\"><img src='/resources/commons/images/icon/icon_paging_last.gif' /></a>";
    			$('.paginate').html(html);
			}
		});
		
	},
	add : function(){
		var phones = ["010","011","016","017","019"];
		var phoneField = '<select id="phone1">';
		phoneField += '<option value="0">'+$.rtls.user.form.select+'</option>';
		for(var i=0; i < phones.length; i++){
			phoneField += '<option value="'+phones[i]+'">'+phones[i]+'</option>';
		}
		phoneField += '</select>';
		
		var html = '<fieldset id="fields">';
		html += '<table>';
		html += '<tr>';
		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.tag+'</label></td>';
		html += '	<td style="text-align:left"><input type="text" id="euid" readonly="true"/><a id="but-tag" class="button button-primary button-rounded button-small">'+$.rtls.user.form.select+'</a><span id="tagprint"></span></td>';
		html += '	<td rowspan="7"><div id="colorpicker"></div></td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.alias+'</label></td>';
		html += '	<td align="left"><input type="text" id="name"/></td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.gender+'</label></td>';
		html += '	<td style="text-align:left">';
		html += '		<input id="gender" name="gender" type="checkbox" checked="true" value="1">';
		html += '	</td>';
		html += '</tr>';
//		html += '<tr>';
//		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.phone+'</label></td>';
//		html += '	<td style="text-align:left">';
//		html += '       '+ phoneField+'-<input type="text" id="phone2" value="1111" style="width:40px"/>-<input type="text" id="phone3" value="1111" style="width:40px"/>';
//		html += '	</td>';
//		html += '</tr>';
		html += '<tr>';
		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.color+'</label></td>';
		html += '	<td style="text-align:left"><input type="text" id="color" value="#000000" style="border:0; color:#000000; font-weight:bold;" readonly="true"/></td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.size+'</label></td>';
		html += '	<td style="text-align:left">';
		html += '		<div id="slider-vertical" style="height:25px;width:180px;float:left"></div>';
		html += '		<input type="text" id="size" value="10" style="border:0; color:#f6931f; font-weight:bold; width : 30px; text-align : center; float:left" readonly="true"/>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.plan+'</label></td>';
		html += '	<td style="text-align:left">';
		html += '		<select id="planId" name="planId">';
		html += '			<option value="0">'+$.rtls.user.form.full+'</option>';
		for(var i=0, plan; plan = User.$plans[i]; i++){
			html += '		<option value="'+plan.planId+'">'+plan.name+'</option>';
		}
		html += '		</select>';
		html += '	</td>';
		html += '</tr>';
		html += '<tr>';
		html += '	<td style="width:100px;height:100%"></td>';
		html += '	<td></td>';
		html += '</tr>';
		html += '</table>';
		html += '</fieldset>';
		$("#dialog").html(html);
		
		$("#dialog #fields #phone1").val('010');
		$("#dialog #fields #euid").addClass("input-readonly");
		$("#dialog #fields #euid").attr("maxlength", "16");
		$("#dialog #fields #phone2").attr("maxlength", "4");
		$("#dialog #fields #phone3").attr("maxlength", "4");
		// TAG 선택
		$("#dialog #but-tag").button({
			icons: {primary: "ui-icon-tag"}
		}).click(function() {
			$.ajax({
				async : true,
				type: 'GET',
				url: "/service/tag.json?action=get.unissued.tags",
				contentType: "application/json; charset=utf-8",
	            dataType: 'json',
	            data : { 
					
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
	            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
	            },
	            success : function (data) {
	            	User.$tag = null;
	            	User.$tags = data.tags;
	            	$("#dialog-tag").dialog({
	        			title:$.rtls.user.dialog.title[0],
	        			autoOpen: false,
	        			height: 400,
	        			width: 610,
	        			modal: true,
	        			buttons: [{
	        				text : $.rtls.commons.button.ok,
	        				click: function() {
	        					if(User.$tag != null){
	        						$("#dialog #fields #euid").val(User.$tag.euid);
	        						$("#dialog #fields #name").val(User.$tag.euid.substring(User.$tag.euid.length-4, User.$tag.euid.length));
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
	        				html += "<p><label>"+$.rtls.user.form.tagfilter+"</label><input type='text' id='tagEuid' style='text-align:center'/><button id='but-tag-search' style='border-radius:4px; background-color:#1B9AF7; height:30px; padding:10px; cursor:pointer; color:#fff;'>"+$.rtls.user.button.search+"</button></p></br>";
	        				html += "<ol id='plan-selectable' class='ui-selectable'>";
	        				//var html = "<ol id='plan-selectable' class='ui-selectable'>";
							for(var i=0; i < data.tags.length; i++){
								if(data.tags[i].type == 1){
									html += "<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+data.tags[i].euid+"</li>";	
								}else{
									html += "<li class='ui-widget-content'><img src='/resources/commons/images/map/icon_tag_move.png' style='float:left; padding-right:3px'/>"+data.tags[i].euid+"</li>";
								}
								
							}	
							html += "</ol>";
							html += "</fieldset>";  //
							$(this).html(html);
							
							$("#but-tag-search").button({  //新增标签搜索按钮
								icons: {primary: "ui-icon-search"}
							}).click(function() {
								var euid = $('#tagEuid').val();
								var tag = {};
								if(!$.string(euid).blank()){
									$('#plan-selectable').html('');
									for(var i=0 ; i < User.$tags.length; i++){
										tag = User.$tags[i];
										if(tag.euid.indexOf(euid.toUpperCase()) != -1){
											if(tag.type == 1){
												$('#plan-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");	
											}else if(tag.type == 2){
												$('#plan-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_move.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");
											}else{
												$('#plan-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_card.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");
											}
										}
									}
								}else{
									for(var i=0 ; i < User.$tags.length; i++){
										tag = User.$tags[i];
										if(tag.type == 1){
											$('#plan-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_fixed.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");	
										}else if(tag.type == 2){
											$('#plan-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_move.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");
										}else{
											$('#plan-selectable').append("<li class='ui-widget-content' style='width:140px'><img src='/resources/commons/images/map/icon_tag_card.png' style='float:left; padding-right:3px'/>"+tag.euid+"</li>");
										}
									}
								}
								
							}); //新增标签搜索按钮
							
							
							$("#plan-selectable", this).selectable({
								stop: function() {
									$( ".ui-selected", this ).each(function() {
										var tagEuid = $(this).text();
										for(var i=0 ; i < User.$tags.length; i++){
											if(User.$tags[i].euid = tagEuid){
												User.$tag = User.$tags[i];
												break;
											}
										}
									});		
								}
							});
	        			},
	        			close: function() {
	        				$("#dialog-tag").empty();
	        			}
	        		});
	        		$( "#dialog-tag" ).dialog( "open" );
				}
			});
			return false; 
		});
		$('input[name="gender"]').bootstrapSwitch({
			size : 'small',
			onColor : 'primary',
			offColor : 'danger',
			onText : $.rtls.user.form.man,
			offText : $.rtls.user.form.woman,
			animate : true
		}).on('switchChange.bootstrapSwitch', function(event, state) {
			if(state){
				User.$gender = 1;
				$(event.target).val(1);	
			}else{
				User.$gender = 2;
				$(event.target).val(2);
			}
		});
		$("#colorpicker").colorpicker(
			{color: '#000000', defaultPalette:'theme'}
		).on("change.color", function(event, color){
		    $('#color').val(color.toUpperCase());
		    $('#color').css('color', color.toUpperCase());
		});
		$( "#slider-vertical" ).slider({
			range: "min",
			min: 1,
			max: 30,
			step: 1,
			value: 10,
			slide: function( event, ui ) {
				$("#size" ).val( ui.value);
			}
		});
		$("#dialog").dialog({
			title:$.rtls.user.dialog.title[1],
			autoOpen: false,
			width: 640,
			height: 410,
			modal: true,
			buttons: [{
	        	text : $.rtls.commons.button.ok,
				click: function() {
					$.validity.start();
					$.validity.setup({outputMode:"summary" });
					$("#dialog #fields #euid").require($.rtls.validity.select($.rtls.user.form.euid));
					$("#dialog #fields #name").require($.rtls.validity.required($.rtls.user.form.alias));
					var result = $.validity.end();
					if(result.valid){
						var error = "";
						var phone = "";
//						var phone1 = $("#dialog #fields #phone1").val();
//						var phone2 = $("#dialog #fields #phone2").val();
//						var phone3 = $("#dialog #fields #phone3").val();
//						if($.string(phone1).blank() || $.string(phone2).blank() || $.string(phone3).blank()){
//							//error += "<ul>"+$.rtls.validity.required($.rtls.user.form.phone)+"</ul>";
//						}else{
//							phone = phone1+"-"+phone2+"-"+phone3;
//							if(!$.string(phone).isPhone()){
//								error += "<ul>"+$.rtls.validity.match('phone',$.rtls.user.form.phone)+"</ul>";
//							}							
//						}
						if($.string(error).blank()){
							$.ajax({
								async : true,
								type: 'post',
								url: "/service/user.json?action=add.user",
								dataType: 'json',
					            data : { 
									"userGroupId" : User.$groupId,
									"classId" : 2,
									"planId" : $( "#planId" ).val(),
									"name" : $("#dialog #fields #name").val(),
									"gender" : User.$gender,
									"phone" : phone,
									"euid" : $("#dialog #fields #euid").val(),
									"size" : $( "#slider-vertical" ).slider( "value" ),
									"color" : $( "#color" ).val()
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
										User.getUsers();
										$("#dialog").dialog( "close" );
									}else if(data.result == 'error.user.euid.duplicate'){
										Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.user.message.euidduplicate);
									}else if(data.result == 'error.user.tagnum.duplicate'){
										Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.user.message.tagnumduplicate);
									}else{
										Log.dialog($.rtls.commons.dialog.title.error, $.rtls.user.message.addfail);
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
									$("#dialog-message").empty();
						            $.validity.clear();
						        }
						        
						    });
							$("#dialog-message").append(error);
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
	},
	mod : function(userId){
		
		$.ajax({
			async : true,
			type: 'get',
			url: "/service/user.json?action=get.user",
			contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data : { 
				"userId" : userId
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
            },
            success : function (data) {
    			User.$gender = data.user.gender;
    			var phone1 = '';
    			var phone2 = '';
    			var phone3 = '';
    			if(!$.string(data.user.phone).blank()){
    				var uphone = data.user.phone.split('-');
    				phone1 = uphone[0];
    				phone2 = uphone[1];
    				phone3 = uphone[2];
    			}
    			if(User.$gender == 0) User.$gender = 1;
    			
//            	var phones = ["010","011","016","017","019"];
//        		var phoneField = '<select id="phone1">';
//        		phoneField += '<option value="0">'+$.rtls.user.form.select+'</option>';
//        		for(var i=0; i < phones.length; i++){
//        			if(phones[i] == phone1){
//        				phoneField += '<option value="'+phones[i]+'" selected>'+phones[i]+'</option>';	
//        			}else{
//        				phoneField += '<option value="'+phones[i]+'">'+phones[i]+'</option>';
//        			}
//        			
//        		}
//        		phoneField += '</select>';
            	var html = '<fieldset id="fields">';
        		html += '<table>';
        		html += '<tr>';
        		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.tag+'</label></td>';
        		html += '	<td  style="text-align:left"><input type="text" id="euid" readonly="true"/></td>';
        		html += '	<td rowspan="7"><div id="colorpicker"></div></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.alias+'</label></td>';
        		html += '	<td style="text-align:left"><input type="text" id="name"/></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.gender+'</label></td>';
        		html += '	<td style="text-align:left">';
        		if(data.user.gender == '1'){
        			html += '<input id="gender" name="gender" type="checkbox" checked="true" value="1">';
        		}else{
        			html += '<input id="gender" name="gender" type="checkbox" value="2">';
        		}
        		html += '	</td>';
        		html += '</tr>';
//        		html += '<tr>';
//        		html += '	<td width="100"><label>* '+$.rtls.user.form.phone+'</label></td>';
//        		html += '	<td align="left">';
//        		html +=  phoneField+'-<input type="text" id="phone2" style="width:40px"/>-<input type="text" id="phone3" style="width:40px"/>';
//        		html += '	</td>';
//        		html += '</tr>';
        		html += '<tr>';
        		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.color+'</label></td>';
        		html += '	<td style="text-align:left"><input type="text" id="color" value="#000000" style="border:0; color:#000000; font-weight:bold;" readonly="true"/></td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.size+'</label></td>';
        		html += '	<td style="text-align:left">';
        		html += '		<div id="slider-vertical" style="height:25px;width:180px;float:left"></div>';
        		html += '		<input type="text" id="size" value="10" style="border:0; color:#f6931f; font-weight:bold; width : 30px; text-align : center; float:left" readonly="true"/>';
        		html += '	</td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '	<td style="width:100px;height:34px"><label>* '+$.rtls.user.form.plan+'</label></td>';
        		html += '	<td style="text-align:left">';
        		html += '		<select id="planId" name="planId">';
        		html += '			<option value="0">'+$.rtls.user.form.full+'</option>';
        		for(var i=0, plan; plan = User.$plans[i]; i++){
        			if(data.user.planId == plan.planId){
            			html += '	<option value="'+plan.planId+'" selected>'+plan.name+'</option>';
        			}else{
        				html += '	<option value="'+plan.planId+'">'+plan.name+'</option>';
        			}
        		}
        		html += '		</select>';
        		html += '	</td>';
        		html += '</tr>';
        		html += '<tr>';
        		html += '	<td style="width:100px;height:100%"></td>';
        		html += '	<td></td>';
        		html += '</tr>';
        		html += '</table>';
        		html += '</fieldset>';
        		$("#dialog").html(html);
            	
        		$("#dialog #fields #euid").addClass("input-readonly");
        		$("#dialog #fields #euid").attr("maxlength", "16");
//        		$("#dialog #fields #phone2").attr("maxlength", "4");
//        		$("#dialog #fields #phone3").attr("maxlength", "4");
        		$("#dialog #fields #name").val(data.user.name);
        		$("#dialog #fields #euid").val(data.user.euid);
//        		$("#dialog #fields #phone2").val(phone2);
//        		$("#dialog #fields #phone3").val(phone3);
        		$("#dialog #fields #color").val(data.user.color);
        		$("#dialog #fields #color").css("color", data.user.color);
        		$("#dialog #fields #size").val(data.user.size);
        		
        		$('input[name="gender"]').bootstrapSwitch({
        			size : 'small',
        			onColor : 'primary',
        			offColor : 'danger',
        			onText : $.rtls.user.form.man,
        			offText : $.rtls.user.form.woman,
        			animate : true
        		}).on('switchChange.bootstrapSwitch', function(event, state) {
        			if(state){
        				User.$gender = 1;
        				$(event.target).val(1);	
        			}else{
        				User.$gender = 2;
        				$(event.target).val(2);
        			}
        		});
        		
        		$("#colorpicker").colorpicker(
        				{color: '#000000', defaultPalette:'theme'}
        			).on("change.color", function(event, color){
        			    $('#color').val(color.toUpperCase());
        			    $('#color').css('color', color.toUpperCase());
        			});
        			
        		$( "#slider-vertical" ).slider({
        			range: "min",
        			min: 1,
        			max: 30,
        			step: 1,
        			value: data.user.size,
        			slide: function( event, ui ) {
        				$("#size" ).val( ui.value);
        			}
        		});
        		$("#dialog").dialog({
        			title:$.rtls.user.dialog.title[2],
        			autoOpen: false,
        			width: 640,
        			height: 410,
        			modal: true,
        			buttons: [{
        	        	text : $.rtls.commons.button.ok,
        				click: function() {
        					$.validity.start();
        					$.validity.setup({outputMode:"summary" });
        					$("#dialog #fields #name").require($.rtls.validity.required($.rtls.user.form.alias));
        					var result = $.validity.end();
        					if(result.valid){
        						var error = "";
        						var phone = "";
//        						var phone1 = $("#dialog #fields #phone1").val();
//        						var phone2 = $("#dialog #fields #phone2").val();
//        						var phone3 = $("#dialog #fields #phone3").val();
//        						if($.string(phone1).blank() || $.string(phone2).blank() || $.string(phone3).blank()){
//        							//error += "<ul>"+$.rtls.validity.required($.rtls.user.form.phone)+"</ul>";
//        						}else{
//        							phone = phone1+"-"+phone2+"-"+phone3;
//        							if(!$.string(phone).isPhone()){
//        								error += "<ul>"+$.rtls.validity.match('phone',$.rtls.user.form.phone)+"</ul>";
//        							}							
//        						}
        						if($.string(error).blank()){
	    							$.ajax({
	    								async : true,
	    								type: 'post',
	    								url: "/service/user.json?action=mod.user",
	    								dataType: 'json',
	    					            data : { 
	    									"userGroupId" : User.$groupId,
											"userId" : data.user.userId,
											"planId" : $( "#planId" ).val(),
											"euid" : data.user.euid,
	    									"name" : $("#dialog #fields #name").val(),
	    									"gender" : User.$gender,
	    									"phone" : phone,
	    									"size" : $( "#slider-vertical" ).slider( "value" ),
	    									"color" : $( "#color" ).val()
	    									
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
	    										User.getUsers();
	    										$("#dialog").dialog( "close" );
	    									}else if(data.result == 'error.user.euid.duplicate'){
	    										Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.user.message.euidduplicate);
	    									}else if(data.result == 'error.user.tagnum.duplicate'){
	    										Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.user.message.tagnumduplicate);
	    									}else{
	    										Log.dialog($.rtls.commons.dialog.title.error, $.rtls.user.message.addfail);
	    										
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
        									$("#dialog-message").empty();
        						            $.validity.clear();
        						        }
        						        
        						    });
        							$("#dialog-message").append(error);
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
	del : function(userId){
		$("#dialog-confirm").dialog({
			title : $.rtls.commons.dialog.title.warking,
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
						url: "/service/user.json?action=del.user",
						contentType: "application/json; charset=utf-8",
			            dataType: 'json',
			            data : { 
							"userId" : userId
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) { 
			            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
			            },
			            success : function (data) {
			            	if(data.result == 'success'){
								User.getUsers();
								$("#dialog-confirm").dialog( "close" );
							}else{
								Log.dialog($.rtls.commons.dialog.title.error, $.rtls.user.message.delfail);
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
		$("#dialog-confirm").append( $.rtls.user.message.delconfirm);
		$('#dialog-confirm').dialog('open');
	},
	dels : function(){
		var cnt = $("input[name=userId]:checkbox:checked").length;
	    if(cnt < 1){
	         Log.dialog($.rtls.commons.dialog.title.error, $.rtls.user.message.delselect);
	    }else{
	    	var userIds = "";
	    	$("input[name=userId]").each(function(){
	    		if(this.checked){
	    			userIds += this.value+"|";
	    		}
	    	});
	    	userIds = userIds.substring(0, userIds.length-1);
	    	
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
							url: "/service/user.json?action=clear.user",
							contentType: "application/json; charset=utf-8",
				            dataType: 'json',
				            data : { 
								"userIds" : userIds
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) { 
				            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
				            },
				            success : function (data) {
				            	if(data.result == 'success'){
									User.getUsers();
									$("#dialog-confirm").dialog( "close" );
								}else{
									Log.dialog($.rtls.commons.dialog.title.error, $.rtls.user.message.delfail);
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
	    	$("#dialog-confirm").append( $.rtls.user.message.delallconfirm);
			$('#dialog-confirm').dialog('open');
	    }
	},
	
	moveGroup : function(){
		var cnt = $("input[name=userId]:checkbox:checked").length;
	    if(cnt < 1){
	         Log.dialog($.rtls.commons.dialog.title.error, $.rtls.user.message.userselect);
	    }else{
	    	var userIds = "";
	    	$("input[name=userId]").each(function(){
	    		if(this.checked){
	    			userIds += this.value+"|";
	    		}
	    	});
	    	userIds = userIds.substring(0, userIds.length-1);
	    	
	    	$("#dialog").append('<fieldset id="fields"  style="text-align:left"></fieldset>');
	    	$("#dialog #fields").append('<div id="group-list"></div>');
	    	$("#dialog #fields #group-list")
			.bind("before.jstree", function (e, data) {
				
			})
			.jstree({ 
				"plugins" : ["themes","json_data","ui","crrm","dnd","types"],
				"json_data" : { 
					"ajax" : {
						"url" : "/service/group.json?action=get.groups",
						"data" : function (n) { 
							return { 
								 
							}; 
						}
					}
				},
				"types" : {
					"max_depth" : -2,
					"max_children" : -2,
					"valid_children" : [ "folder", "root" ],
					"types" : {
						"default"    : { 
							"valid_children" : "none", 		             
							"icon" : {"image" : "/resources/commons/images/tree/root.png"},
							"select_node" : function (e, data) {
								var obj =  $(e).closest("li");
								var groupId = obj.attr('id');
								User.$moveGroupId = groupId;
					        }
						},
						"group"   : { "valid_children" : [ "default", "group" ], "icon" : {"image" : "/resources/commons/images/tree/folder.png"} },
						"folder" : {
							"valid_children" : [ "default", "group" ],
							"icon" : {"image" : "/resources/commons/images/tree/folder.png"},
							"start_drag" : false,
							"move_node" : false,
							"delete_node" : true,
							"remove" : true
						}
					}
				}
				
			})
			.bind("loaded.jstree", function (e, data) {
				
			});
	    	
	    	$("#dialog").dialog({
				title:$.rtls.user.dialog.title[3],
				autoOpen: false,
				height: 450,
				width: 600,
				modal: true,
				buttons: [{
					text : $.rtls.commons.button.ok,
					click: function() {
						if(User.$moveGroupId != 0){
							$.ajax({
								async : true,
								type: 'get',
								url: "/service/user.json?action=move.user",
								contentType: "application/json; charset=utf-8",
					            dataType: 'json',
					            data : { 
									"userGroupId" : User.$groupId,
									"moveGroupId" : User.$moveGroupId,
									"userIds" : userIds
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) { 
					            	Log.error("responseText: " + XMLHttpRequest.responseText+ ", textStatus: " + textStatus+ ", errorThrown: " + errorThrown);
					            },
					            success : function (data) {
									if(data.result == 'success'){
										User.getUsers();
										$("#dialog").dialog( "close" );
									}else{
										Log.dialog($.rtls.commons.dialog.title.error, $.rtls.user.message.movefail);
									}
								}
							});
						}else{
							Log.dialog($.rtls.commons.dialog.title.error, $.rtls.user.message.moveselect);
						}
						
					},
				},{
					text : $.rtls.commons.button.cancel,
					click: function() {
						$( this ).dialog( "close" );
					}
				}],
				open: function() {
					$( "#dialog" ).css( "overflow" , "auto" );
				},
				close: function() {
					$("#dialog").empty();
				}
			});
			$( "#dialog" ).dialog( "open" );
	    }
	},
	groupEdit:function(isEdit){
		$("#group-list").empty();
		if(isEdit){
			$("#group-list")
			.bind("before.jstree", function (e, data) {
				
			})
			.jstree({ 
				"plugins" : ["themes","json_data","ui","crrm","cookies","dnd","types", "hotkeys","contextmenu"],
				"json_data" : { 
					"ajax" : {
						"url" : "/service/group.json?action=get.groups",
						"data" : function (n) { 
							return { 
								 
							}; 
						}
					}
				},
				"types" : {
					"max_depth" : -2,
					"max_children" : -2,
					"valid_children" : [ "folder" ],
					"types" : {
						"default"    : { 
							"valid_children" : "none", 		             
							"icon" : {"image" : "/resources/commons/images/tree/root.png"},
							"select_node" : function (e, data) {
								var obj =  $(e).closest("li");
								var groupId = obj.attr('id');
								var parent = obj.attr('parent');
								
								
				            }
						},
						"group"   : { "valid_children" : [ "default", "group" ], "icon" : {"image" : "/resources/commons/images/tree/folder.png"} },
						"folder" : {
							"valid_children" : [ "default", "group" ],
							"icon" : {"image" : "/resources/commons/images/tree/folder.png"},
							"start_drag" : false,
							"move_node" : false,
							"delete_node" : true,
							"remove" : true
						}
					}
				},
				"ui" : {
					"initially_select" : [ "1" ]
				}
			})
			.bind("create.jstree", function (e, data) {
				$.post("/service/group.json?action=add.group", 
					{ 
					"parent" : data.rslt.parent.attr("id"), 
					"name" : data.rslt.name
					}, 
					function (res) {
						if(res.result == 'success') {
							$(data.rslt.obj).attr("id", res.userGroupId);
							$(data.rslt.obj).attr("root", res.root);
							$(data.rslt.obj).attr("parent", res.parent);
							$(data.rslt.obj).attr("level", res.level);
							$(data.rslt.obj).attr("depth", res.depth);
							$(data.rslt.obj).attr("degree", res.degree);
							$(data.rslt.obj).attr("orders", res.orders);
							$(data.rslt.obj).attr("rel", "group");
						}else {
							$.jstree.rollback(data.rlbk);
						}
					},
					 "json"
				);
			})
			.bind("remove.jstree", function (e, data) {
				var degree = parseInt(data.rslt.obj.attr("degree"));
				if(degree == 0){
					$.post("/service/group.json?action=del.group", 
						{ 
							"userGroupId" : data.rslt.obj.attr("id")
						}, 
						function (r) {
							if(r.result == 'error.group.notempty'){
								Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.user.message.groupnotempty);
							}else if(r.result == 'error.group.user.notempty'){
								Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.user.message.usernotempty);
							}else{
								Log.dialog($.rtls.commons.dialog.title.waring, $.rtls.user.message.groupdelsucccess);
							}
							data.inst.refresh();
						},
						"json"
					);
				}else{
					Log.dialog(waring, $.rtls.user.message.groupnotempty);
					data.inst.refresh();
				}
			})
			.bind("rename.jstree", function (e, data) {
				$.post("/service/group.json?action=mod.group", 
					{ 
						"userGroupId" : data.rslt.obj.attr("id"),
						"name" : data.rslt.new_name
					}, 
					function (r) {
						if(r.result != 'success') {
							$.jstree.rollback(data.rlbk);
						}
					},
					"json"
				);
			})
			.bind("loaded.jstree", function (e, data) {
				
			});
		}else{
			User.getGroups();
		}
	}
};