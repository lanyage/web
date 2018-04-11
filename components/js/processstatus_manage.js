var script = document.createElement("script")
script.setAttribute("type", "text/javascript")
script.setAttribute("language", "JavaScript")
script.setAttribute("src", "../layui/laydate/laydate.js")
// document.getElementsByTagName("body")[0].appendChild(script)

Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};

var processstatus_manage = {

	curleader_result: [],
	do_once: function() {
		$.get(home.urls.user.getAll(), function(result) {
            processstatus_manage.curleader_result = result.data;
		})
	},
	init: function() {
		/** 获取部门信息分页显示并展示 */
		processstatus_manage.funcs.renderTable()
        var out = $('#processstatus_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#processstatus_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '36%')
            clearTimeout(time)
        }, 30)
	},
	pageSize: 0,
	funcs: {
		renderTable: function() {
				$.post(home.urls.processstatus.getAllByPage(), {
					page: 0
				}, function(result) {
					var processstatuses = result.data.content //获取数据
					const $tbody = $("#processstatus_table").children('tbody')
					processstatus_manage.funcs.renderHandler($tbody, processstatuses)
					processstatus_manage.pageSize = result.data.content.length

					var page = result.data
					/** @namespace page.totalPages 这是返回数据的总页码数 */
					layui.laypage.render({
						elem: 'processstatus_page',
						count: 10 * page.totalPages //数据总数
							,jump: function(obj, first) {
							if(!first) {
                                $.post(home.urls.processstatus.getAllByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function(result) {
                                    var processstatuses = result.data.content //获取数据
                                    const $tbody = $("#processstatus_table").children('tbody')
                                    processstatus_manage.funcs.renderHandler($tbody, processstatuses)
                                    processstatus_manage.pageSize = result.data.content.length
                                })
							}
						}
					})
				})
				//$数据渲染完毕
				var addBtn = $("#model-li-hide-add-60")
				processstatus_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
				var refreshBtn = $('#model-li-hide-refresh-60')
				processstatus_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
				var searchBtn = $('#model-li-hide-search-60')
				processstatus_manage.funcs.bindSearchEventListener(searchBtn)
			}

			,
		bindAddEventListener: function(addBtn) {
				addBtn.off('click')
				addBtn.on('click', function() {
					//首先就是弹出一个弹出框
					layer.open({
						type: 1,
						title: '添加',
						content: "<div id='addModal'>" +
							"<div style='text-align: center;padding-top: 10px;'>" +
							"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;流程编码:<input type='text' id='code'/></p>" +
							"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;流程状态:<input type='text' id='status'/></p>" +
							"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;当前负责人:<select id='curleader_code' style='width:174px;'></select></p>" +
							"<p style='padding: 5px 0px 5px 0px; height:20px'><label class='layui-form-label inline'>上次审核时间</label><input type='text' style='width:174px;20px' class='layui-input'  id='last_review_time' placeholder='yyyy-MM-dd HH:mm:ss' lay-key='6'></p>" +
							"</div>" +
							"</div>",
						area: ['400px', '250px'],
						btn: ['确认', '取消'],
						offset: ['40%', '45%'],
						yes: function(index) {
							var code = $('#code').val()
							var status = $('#status').val()
							var curleader_code = $('#curleader_code').val()
							var last_review_time = $('#last_review_time').val()
							$.post(home.urls.processstatus.add(), {
								code: code,
								status: status,
								curLeaderCode: curleader_code,
								//								lastReviewTime: last_review_time
							}, function(result) {
								layer.msg(result.message, {
									offset: ['40%', '55%'],
									time: 700
								})
								if(result.code === 0) {
									var time = setTimeout(function() {
										processstatus_manage.init()
										clearTimeout(time)
									}, 500)
								}
								layer.close(index)
							})
						},
						btn2: function(index) {
							layer.close(index)
						}
					});

					laydate.render({
						elem: '#last_review_time',
						type: 'datetime'
					});

					var curleader_select = $("#curleader_code");
					curleader_select.empty();
					curleader_result.forEach(function(curleader) {
						var option = $("<option>").val(curleader.code).text(curleader.name);
						curleader_select.append(option);
					});
				})
			} //$ bindAddEventListener——end$

			,
		bindDeleteEventListener: function(deleteBtns) {
				deleteBtns.off('click')
				deleteBtns.on('click', function() {
					//首先弹出一个询问框
					var _this = $(this)
					layer.open({
						type: 1,
						title: '删除',
						content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
						area: ['180px', '130px'],
						btn: ['确认', '取消'],
						offset: ['40%', '55%'],
						yes: function(index) {
							var processstatusCode = _this.attr('id').substr(3)
							$.post(home.urls.processstatus.deleteByCode(), {
								code: processstatusCode
							}, function(result) {
								layer.msg(result.message, {
									offset: ['40%', '55%'],
									time: 700
								})
								if(result.code === 0) {
									var time = setTimeout(function() {
										processstatus_manage.init()
										clearTimeout(time)
									}, 500)
								}
								layer.close(index)
							})
						},
						btn2: function(index) {
							layer.close(index)
						}
					})
				})
			} //$ bindDeleteEventListener_end$
			,
		bindSearchEventListener: function(searchBtn) {
				searchBtn.off('click')
				searchBtn.on('click', function() {
					var processstatus_name = $('#processstatus_name_input').val()
					$.post(home.urls.processstatus.getAllByLikeNameByPage(), {
						name: processstatus_name
					}, function(result) {
						var page = result.data
						var processstatuses = result.data.content //获取数据
						const $tbody = $("#processstatus_table").children('tbody')
						processstatus_manage.funcs.renderHandler($tbody, processstatuses)
						layui.laypage.render({
							elem: 'processstatus_page',
							count: 10 * page.totalPages //数据总数
								,
							jump: function(obj, first) {
								$.post(home.urls.processstatus.getAllByLikeNameByPage(), {
									name: processstatus_name,
									page: obj.curr - 1,
									size: obj.limit
								}, function(result) {
									var processstatuses = result.data.content //获取数据
									const $tbody = $("#processstatus_table").children('tbody')
									processstatus_manage.funcs.renderHandler($tbody, processstatuses)
									processstatus_manage.pageSize = result.data.content.length
								})
							}
						})
					})
				})
			} //$bindSearchEventListener_end$
			,
		bindRefreshEventLisener: function(refreshBtn) {
			refreshBtn.off('click')
			refreshBtn.on('click', function() {
				var index = layer.load(2, {
					offset: ['40%', '58%']
				});
				var time = setTimeout(function() {
					layer.msg('刷新成功', {
						offset: ['40%', '55%'],
						time: 700
					})
					processstatus_manage.init()
					layer.close(index)
					clearTimeout(time)
				}, 200)
			})
		},
		bindSelectAll: function(selectAllBox) {
			selectAllBox.off('change')
			selectAllBox.on('change', function() {
				var status = selectAllBox.prop('checked')
				$('.checkbox').each(function() {
					$(this).prop('checked', status)
				})
			})
		},
		bindDeleteBatchEventListener: function(deleteBatchBtn) {
			deleteBatchBtn.off('click')
			deleteBatchBtn.on('click', function() {
				if($('.checkbox:checked').length === 0) {
					layer.msg('亲,您还没有选中任何数据！', {
						offset: ['40%', '55%'],
						time: 700
					})
				} else {
					layer.open({
						type: 1,
						title: '批量删除',
						content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除选中记录吗?</h5>",
						area: ['190px', '130px'],
						btn: ['确认', '取消'],
						offset: ['40%', '55%'],
						yes: function(index) {
							var processstatusCodes = []
							$('.checkbox').each(function() {
								if($(this).prop('checked')) {
									processstatusCodes.push({
										code: $(this).val()
									})
								}
							})
							$.ajax({
								url: home.urls.processstatus.deleteByBatchCode(),
								contentType: 'application/json',
								data: JSON.stringify(processstatusCodes),
								dataType: 'json',
								type: 'post',
								success: function(result) {
									if(result.code === 0) {
										var time = setTimeout(function() {
											processstatus_manage.init()
											clearTimeout(time)
										}, 500)
									}
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
								}
							})
							layer.close(index)
						},
						btn2: function(index) {
							layer.close(index)
						}
					})
				}
			})
		},
		bindEditEventListener: function(editBtns) {
				editBtns.off('click')
				editBtns.on('click', function() {
					var _selfBtn = $(this)
					var processstatusCode = _selfBtn.attr('id').substr(5)
					$.post(home.urls.processstatus.getByCode(), {
						code: processstatusCode
					}, function(result) {
						var processstatus = result.data
						layer.open({
							type: 1,
							title: '编辑',
							content: "<div id='addModal'>" +
								"<div style='text-align: center;padding-top: 10px;'>" +
								"<p style='padding: 5px 0px 5px 0px;'>指标编码:<input type='text' id='code' value='" + (processstatus.code) + "'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>指标名称:<input type='text' id='name' value='" + (processstatus.name) + "'/></p>" +
								"</div>" +
								"</div>",
							area: ['350px', '180px'],
							btn: ['确认', '取消'],
							offset: ['40%', '45%'],
							yes: function(index) {
								var code = $('#code').val()
								var name = $('#name').val()
								$.post(home.urls.processstatus.update(), {
									code: code,
									name: name
								}, function(result) {
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											processstatus_manage.init()
											clearTimeout(time)
										}, 500)
									}
									layer.close(index)
								})
							},
							btn2: function(index) {
								layer.close(index)
							}
						})
					})
				})
			} //$ bindEditEventListener——end$
			,
		renderHandler: function($tbody, processstatuses) {
			$tbody.empty() //清空表格
			processstatuses.forEach(function(e) {
				$('#checkAll').prop('checked', false)
				$tbody.append(
					"<tr>" +
					"<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
					"<td>" + (e.code) + "</td>" +
					"<td>" + (e.status) + "</td>" +
					"<td>" + (e.curLeader && e.curLeader.name || '') + "</td>" +
					"<td>" + (e.lastReviewTime == null ? '' : new Date(e.lastReviewTime).format('yyyy-MM-dd h:m:s')) + "</td>" +
					"<td><a href='#' class='editprocessstatus' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
					"<td><a href='#' class='deleteprocessstatus' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
					"</tr>")
			}) //$数据渲染完毕
			var editBtns = $('.editprocessstatus')
			var deleteBtns = $('.deleteprocessstatus')
			processstatus_manage.funcs.bindDeleteEventListener(deleteBtns)
			processstatus_manage.funcs.bindEditEventListener(editBtns)
			var selectAllBox = $('#checkAll')
			processstatus_manage.funcs.bindSelectAll(selectAllBox)
			var deleteBatchBtn = $('#model-li-hide-delete-60')
			processstatus_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
			var checkboxes = $('.checkbox')
			processstatus_manage.funcs.disselectAll(checkboxes, selectAllBox)
		},
		disselectAll: function(checkboxes, selectAllBox) {
			checkboxes.off('change')
			checkboxes.on('change', function() {
				var statusNow = $(this).prop('checked')
				if(statusNow === false) {
					selectAllBox.prop('checked', false)
				} else if(statusNow === true && $('.checkbox:checked').length === processstatus_manage.pageSize) {
					selectAllBox.prop('checked', true)
				}
			})
		}
	}
}