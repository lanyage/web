var Group = {
	init : function(){
		this.list();
	},
	list : function(){
		$("#group-list")
		.bind("before.jstree", function (e, data) {
			
		})
		.jstree({ 
			"plugins" : ["themes","json_data","ui","crrm","cookies","dnd","types", "hotkeys","contextmenu"],
			"json_data" : { 
				"ajax" : {
					"url" : "/admins/group.action?pages=get.group.list",
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
						"icon" : {"image" : "/admin/images/tree/root.png"},
						"select_node" : function (e, data) {
							var obj =  $(e).closest("li");
							var groupId = obj.attr('id');
							var parent = obj.attr('parent');
							Group._groupId = (groupId == undefined ? 1 : groupId);
							Group._parent = (parent == undefined ? 0 : parent);
							
			            }
					},
					"group"   : { "valid_children" : [ "default", "group" ], "icon" : {"image" : "/admin/images/tree/folder.png"} },
					"folder" : {
						"valid_children" : [ "default", "group" ],
						"icon" : {"image" : "/admin/images/tree/folder.png"},
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
			$.post("/admins/group.action?pages=add.group", 
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
				$.post("/admins/group.action?pages=mod.group", 
					{ 
						"userGroupId" : data.rslt.obj.attr("id")
					}, 
					function (r) {
						if(r.result == 'error.group.notempty'){
							Admin.message('警告信息', '<p>下层组别.</p><p>在下层组别再尝试删除.</p>');
						}else if(r.result == 'error.group.user.notempty'){
							Admin.message('警告信息', '<p>该组的用户.</p><p>该组的用户移动后再次尝试!.</p>');
						}else{
							Admin.message('错误信息', '<p>系统错误 </p><p>请询问管理员</p>');
						}
						data.inst.refresh();
					},
					"json"
				);
			}else{
				Admin.message('警告信息', '<p>下层组别.</p><p>在下层组别再尝试删除.</p>');
				data.inst.refresh();
			}
		})
		.bind("rename.jstree", function (e, data) {
			$.post("/admins/group.action?pages=mod.group", 
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
	}
};