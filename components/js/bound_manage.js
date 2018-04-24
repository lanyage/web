var bound_manage = {
	indicator_result: [],
	do_once: function() {
		$.get(home.urls.indicator.getAll(), function(result) {
            bound_manage.indicator_result = result.data;
		})
	},
	init: function() {
		/** 获取部门信息分页显示并展示 */
		bound_manage.funcs.renderTable()
        var out = $('#bound_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#bound_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
	},
	pageSize: 0,
	funcs: {
		renderTable: function() {
				$.post(home.urls.bound.getAllByPage(), {
					page: 0
				}, function(result) {
					var boundes = result.data.content //获取数据
					const $tbody = $("#bound_table").children('tbody')
					bound_manage.funcs.renderHandler($tbody, boundes)
					bound_manage.pageSize = result.data.content.length

					var page = result.data
					/** @namespace page.totalPages 这是返回数据的总页码数 */
					layui.laypage.render({
						elem: 'bound_page',
						count: 10 * page.totalPages //数据总数
							,
						jump: function(obj, first) {
							if(!first) {
                                $.post(home.urls.bound.getAllByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function(result) {
                                    var boundes = result.data.content //获取数据
                                    const $tbody = $("#bound_table").children('tbody')
                                    bound_manage.funcs.renderHandler($tbody, boundes)
                                    bound_manage.pageSize = result.data.content.length
                                })
							}
						}
					})
				})
				//$数据渲染完毕
				var addBtn = $("#model-li-hide-add-60")
				bound_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
				var refreshBtn = $('#model-li-hide-refresh-60')
				bound_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
				var searchBtn = $('#model-li-hide-search-60')
				bound_manage.funcs.bindSearchEventListener(searchBtn)
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
						"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编码:<input type='text' id='code'/></p>" +
						"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序号:<input type='text' id='num'/></p>" +
						"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;指标名称:<select id='indicator_code' style='width:174px;'></select></p>" +
						"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上界:<input type='text' id='upper'/></p>" +
						"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下界:<input type='text' id='down'/></p>" +
						"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;均值:<input type='text' id='mean'/></p>" +
						"<p style='padding: 5px 0px 5px 0px;'>3位标准差上界:<input type='text' id='upper_standard'/></p>" +
						"<p style='padding: 5px 0px 5px 0px;'>3位标准差下界:<input type='text' id='down_standard'/></p>" +
						"</div>" +
						"</div>",
					area: ['350px', '350px'],
					btn: ['确认', '取消'],
					offset: ['40%', '45%'],
					yes: function(index) {
						var code = $('#code').val()
						var num = $('#num').val()
						var indicator_code = $('#indicator_code').val()
						var upper = $('#upper').val()
						var down = $('#down').val()
						var mean = $('#mean').val()
						var upper_standard = $('#upper_standard').val()
						var down_standard = $('#down_standard').val()
						$.post(home.urls.bound.add(), {
							code: code,
							num: num,
							indicatorCode: indicator_code,
							upperBound: upper,
							downBound: down,
							mean: mean,
							upperStandardDeviation: upper_standard,
							downStandardDeviation: down_standard
						}, function(result) {
							layer.msg(result.message, {
								offset: ['40%', '55%'],
								time: 700
							})
							if(result.code === 0) {
								var time = setTimeout(function() {
									bound_manage.init()
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

				var indicator_select = $("#indicator_code");
				indicator_select.empty();
                bound_manage.indicator_result.forEach(function(indicator) {
					var option = $("<option>").val(indicator.code).text(indicator.name);
					indicator_select.append(option);
				});
			})
		},
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
							var boundCode = _this.attr('id').substr(3)
							$.post(home.urls.bound.deleteByCode(), {
								code: boundCode
							}, function(result) {
								layer.msg(result.message, {
									offset: ['40%', '55%'],
									time: 700
								})
								if(result.code === 0) {
									var time = setTimeout(function() {
										bound_manage.init()
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
					var bound_name = $('#bound_name_input').val()
					$.post(home.urls.bound.getAllByCodeLikeByPage(), {
						code: bound_name
					}, function(result) {
						var page = result.data
						var boundes = result.data.content //获取数据
						const $tbody = $("#bound_table").children('tbody')
						bound_manage.funcs.renderHandler($tbody, boundes)
						layui.laypage.render({
							elem: 'bound_page',
							count: 10 * page.totalPages //数据总数
								,
							jump: function(obj, first) {
								$.post(home.urls.bound.getAllByCodeLikeByPage(), {
									code: bound_name,
									page: obj.curr - 1,
									size: obj.limit
								}, function(result) {
									var boundes = result.data.content //获取数据
									const $tbody = $("#bound_table").children('tbody')
									bound_manage.funcs.renderHandler($tbody, boundes)
									bound_manage.pageSize = result.data.content.length
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
					bound_manage.init()
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
							var boundCodes = []
							$('.checkbox').each(function() {
								if($(this).prop('checked')) {
									boundCodes.push({
										code: $(this).val()
									})
								}
							})
							$.ajax({
								url: home.urls.bound.deleteByBatchCode(),
								contentType: 'application/json',
								data: JSON.stringify(boundCodes),
								dataType: 'json',
								type: 'post',
								success: function(result) {
									if(result.code === 0) {
										var time = setTimeout(function() {
											bound_manage.init()
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
					var boundCode = _selfBtn.attr('id').substr(5)
					$.post(home.urls.bound.getByCode(), {
						code: boundCode
					}, function(result) {
						var bound = result.data
						layer.open({
							type: 1,
							title: '编辑',
							content: "<div id='addModal'>" +
								"<div style='text-align: center;padding-top: 10px;'>" +
								"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编码:<input type='text' id='code' value='" + (bound.code) + "'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序号:<input type='text' id='num' value='" + (bound.num) + "'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;指标名称:<select id='indicator_code' style='width:174px;'><option value='+" + (bound.indicator && bound.indicator.code || '') + "'>" + (bound.indicator && bound.indicator.name || '') + "</option></select></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上界:<input type='text' id='upper' value='" + (bound.upperBound) + "'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上界:<input type='text' id='down' value='" + (bound.downBound) + "'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;均值:<input type='text' id='mean' value='" + (bound.mean) + "'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>3倍标准差上界:<input type='text' id='upper_standard' value='" + (bound.upperStandardDeviation) + "'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>3倍标准差下界:<input type='text' id='down_standard' value='" + (bound.downStandardDeviation) + "'/></p>" +
								"</div>" +
								"</div>",
							area: ['350px', '350px'],
							btn: ['确认', '取消'],
							offset: ['40%', '45%'],
							yes: function(index) {
								var code = $('#code').val()
								var num = $('#num').val()
								var indicator_code = $('#indicator_code').val()
								var upper = $('#upper').val()
								var down = $('#down').val()
								var mean = $('#mean').val()
								var upper_standard = $('#upper_standard').val()
								var down_standard = $('#down_standard').val()
								$.post(home.urls.bound.update(), {
									code: code,
									num: num,
									indicatorCode: indicator_code,
									upperBound: upper,
									downBound: down,
									mean: mean,
									upperStandardDeviation: upper_standard,
									downStandardDeviation: down_standard
								}, function(result) {
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											bound_manage.init()
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

						var indicator_select = $("#indicator_code");
						indicator_select.empty();
						indicator_result.forEach(function(indicator) {
							var option = $("<option>").val(indicator.code).text(indicator.name);
							indicator_select.append(option);

							if(bound && bound.indicator && indicator.code == bound.indicator.code) {
								indicator_select.val(indicator.code)
							}
						});
					})
				})
			} //$ bindEditEventListener——end$
			,
		renderHandler: function($tbody, boundes) {
			$tbody.empty() //清空表格
			boundes.forEach(function(e) {
				$('#checkAll').prop('checked', false)
				$tbody.append(
					"<tr>" +
					"<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
					"<td>" + (e.code) + "</td>" +
					"<td>" + (e.num) + "</td>" +
					"<td>" + (e.indicator && e.indicator.name || '') + "</td>" +
					"<td>" + (e.upperBound) + "</td>" +
					"<td>" + (e.downBound) + "</td>" +
					"<td>" + (e.mean) + "</td>" +
					"<td>" + (e.upperStandardDeviation) + "</td>" +
					"<td>" + (e.downStandardDeviation) + "</td>" +
					"<td><a href='#' class='editbound' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
					"<td><a href='#' class='deletebound' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
					"</tr>")
			}) //$数据渲染完毕
			var editBtns = $('.editbound')
			var deleteBtns = $('.deletebound')
			bound_manage.funcs.bindDeleteEventListener(deleteBtns)
			bound_manage.funcs.bindEditEventListener(editBtns)
			var selectAllBox = $('#checkAll')
			bound_manage.funcs.bindSelectAll(selectAllBox)
			var deleteBatchBtn = $('#model-li-hide-delete-60')
			bound_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
			var checkboxes = $('.checkbox')
			bound_manage.funcs.disselectAll(checkboxes, selectAllBox)
		},
		disselectAll: function(checkboxes, selectAllBox) {
			checkboxes.off('change')
			checkboxes.on('change', function() {
				var statusNow = $(this).prop('checked')
				if(statusNow === false) {
					selectAllBox.prop('checked', false)
				} else if(statusNow === true && $('.checkbox:checked').length === bound_manage.pageSize) {
					selectAllBox.prop('checked', true)
				}
			})
		}
	}
}