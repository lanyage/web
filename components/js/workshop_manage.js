var workshop_manage = {
    department_result: [],
    init: function () {
        /** 获取部门信息分页显示并展示 */
        workshop_manage.funcs.renderTable()
        $.get(home.urls.department.getAll(), function (result) {
            workshop_manage.department_result = result.data;
        })
        $("#workshop_name_input").empty()
        $.get(servers.backup()+'workshop/getAll',{},function(result){
            var res = result.data
            $("#workshop_name_input").html("<option value='-1'>请选择车间名称</option>")
            res.forEach(function(e){
                $("#workshop_name_input").append("<option value="+e.name+">"+e.name+"</option>")
            })
        })
    },
    pageSize: 0,
    funcs: {
        renderTable: function () {
            $.post(home.urls.workshop.getAllByPage(), {
                page: 0
            }, function (result) {
                var workshopes = result.data.content //获取数据
                const $tbody = $("#workshop_table").children('tbody')
                workshop_manage.funcs.renderHandler($tbody, workshopes)
                workshop_manage.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'workshop_page',
                    count: 10 * page.totalPages //数据总数
                    , jump: function (obj, first) {
                        if(!first) {
                            $.post(home.urls.workshop.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var workshopes = result.data.content //获取数据
                                const $tbody = $("#workshop_table").children('tbody')
                                workshop_manage.funcs.renderHandler($tbody, workshopes)
                                workshop_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#workshop_page').css('padding-left','37%')
            })
            //$数据渲染完毕
            var addBtn = $("#model-li-hide-add-60")
            workshop_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-60')
            workshop_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
            var searchBtn = $('#model-li-hide-search-60')
            workshop_manage.funcs.bindSearchEventListener(searchBtn)
        },
        bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {

                //首先就是弹出一个弹出框
                layer.open({
                    type: 1,
                    title: '添加',
                    content: "<div id='addModal'>" +
                    "<div style='text-align: center;padding-top: 10px;'>" +
                    "<p style='padding: 5px 0px 5px 0px;'>车间编码:<input type='text' id='code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>车间名称:<input type='text' id='name'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>所属部门:<select id='department_code' style='width:174px;'></select></p>" +
                    "</div>" +
                    "</div>",
                    area: ['350px', '210px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var code = $('#code').val()
                        var name = $('#name').val()
                        var department_code = $('#department_code').val()
                        $.post(home.urls.workshop.add(), {
                            code: code,
                            name: name,
                            departmentCode: department_code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    workshop_manage.init()
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.close(index)
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                });

                var department_select = $("#department_code");
                department_select.empty();
                workshop_manage.department_result.forEach(function (department) {
                    var option = $("<option>").val(department.code).text(department.name);
                    department_select.append(option);
                });
            })
        },
        bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                //首先弹出一个询问框
                var _this = $(this)
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                    area: ['180px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        var workshopCode = _this.attr('id').substr(3)
                        $.post(home.urls.workshop.deleteByCode(), {
                            code: workshopCode
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    workshop_manage.init()
                                    clearTimeout(time)
                                }, 500)
                            }
                            layer.close(index)
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
            })
        },
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var workshop_name = $('#workshop_name_input').val()
                $.post(home.urls.workshop.getAllByLikeNameByPage(), {
                    name: workshop_name
                }, function (result) {
                    var page = result.data
                    var workshopes = result.data.content //获取数据
                    const $tbody = $("#workshop_table").children('tbody')
                    workshop_manage.funcs.renderHandler($tbody, workshopes)
                    layui.laypage.render({
                        elem: 'workshop_page',
                        count: 10 * page.totalPages //数据总数
                        ,
                        jump: function (obj, first) {
                            $.post(home.urls.workshop.getAllByLikeNameByPage(), {
                                name: workshop_name,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var workshopes = result.data.content //获取数据
                                const $tbody = $("#workshop_table").children('tbody')
                                workshop_manage.funcs.renderHandler($tbody, workshopes)
                                workshop_manage.pageSize = result.data.content.length
                            })
                        }
                    })
                })
            })
        },
        bindRefreshEventLisener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {
                    offset: ['40%', '58%']
                });
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    workshop_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },
        bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        },
        bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.checkbox:checked').length === 0) {
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
                        yes: function (index) {
                            var workshopCodes = []
                            $('.checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    workshopCodes.push({
                                        code: $(this).val()
                                    })
                                }
                            })
                            $.ajax({
                                url: home.urls.workshop.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(workshopCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            workshop_manage.init()
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
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                }
            })
        },
        bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var workshopCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.workshop.getByCode(), {
                    code: workshopCode
                }, function (result) {
                    var workshop = result.data;

                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>车间编码:<input type='text' id='code' value='" + (workshop.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>车间名称:<input type='text' id='name' value='" + (workshop.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>所属部门:<select id='department_code' style='width:174px;'><option value='" + (workshop.department && workshop.department.code || '') + "'>" + (workshop.department && workshop.department.name || '') + "</option></select></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '200px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#code').val()
                            var name = $('#name').val()
                            var department_code = $('#department_code').val()
                            $.post(home.urls.workshop.update(), {
                                code: code,
                                name: name,
                                departmentCode: department_code
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        workshop_manage.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.close(index)
                            })
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    });

                    var department_select = $("#department_code");
                    department_select.empty();
                    workshop_manage.department_result.forEach(function (department) {
                        var option = $("<option>").val(department.code).text(department.name);
                        department_select.append(option);
                        if (workshop && workshop.department && department.code == workshop.department.code) {
                            department_select.val(department.code)
                        }
                    });
                });
            });
        },
        renderHandler: function ($tbody, workshopes) {
            $tbody.empty() //清空表格
            workshopes.forEach(function (e) {
                $('#checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.department && e.department.name || '') + "</td>" +
                    "<td><a href='#' class='editworkshop' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteworkshop' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            }) //$数据渲染完毕
            var editBtns = $('.editworkshop')
            var deleteBtns = $('.deleteworkshop')
            workshop_manage.funcs.bindDeleteEventListener(deleteBtns)
            workshop_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#checkAll')
            workshop_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-60')
            workshop_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var checkboxes = $('.checkbox')
            workshop_manage.funcs.disselectAll(checkboxes, selectAllBox)
        },
        disselectAll: function (checkboxes, selectAllBox) {
            checkboxes.off('change')
            checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.checkbox:checked').length === workshop_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })

        }
    }
}