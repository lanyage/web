var department_manage = {
    init: function () {
        /** 获取部门信息分页显示并展示 */
        department_manage.funcs.renderTable()
        $("#department_name_input").empty()
        $.get(servers.backup()+'department/getAll',{},function(result){
            var res = result.data
            //$("#department_name_input").html("<option value='-1>请选择部门名称</option>")
            $("#department_name_input").html("<option value='-1'>请选择部门名称</option>")
            res.forEach(function(e){
                $("#department_name_input").append("<option value="+e.name+">"+e.name+"</option>")
            })
        })
    }
    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0
    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面 */
        renderTable: function () {
            /** 获取所有的记录 */
            $.post(home.urls.department.getAllByPage(), {page: 0}, function (result) {
                var departments = result.data.content //获取数据
                const $tbody = $("#department_table").children('tbody')
                department_manage.funcs.renderHandler($tbody, departments)
                department_manage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'department_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            //console.log('不是首次,可以执行')
                            $.post(home.urls.department.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var departments = result.data.content //获取数据
                                const $tbody = $("#department_table").children('tbody')
                                department_manage.funcs.renderHandler($tbody, departments)
                                department_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#department_page').css('padding-left', '37%')
            })//$数据渲染完毕

            /** 追加添加事件 */
            var addBtn = $("#model-li-hide-add-60")
            department_manage.funcs.bindAddEventListener(addBtn)
             //追加增加事件
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-60')
            department_manage.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-60')
            department_manage.funcs.bindSearchEventListener(searchBtn)
        }

        /** 添加事件 */
        , bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                /** 弹出一个询问框 */
                layer.open({
                    type: 1,
                    title: '添加',
                    content: "<div id='addModal'>" +
                    "<div style='text-align: center;padding-top: 10px;'>" +
                    "<p style='padding: 5px 0px 5px 0px;'>部门编码:<input type='text' id='dep_code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>部门名称:<input type='text' id='dep_name'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>部门信息:<input type='text' id='dep_info'/></p>" +
                    "</div>" +
                    "</div>",
                    area: ['350px', '200px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var code = $('#dep_code').val()
                        var name = $('#dep_name').val()
                        var info = $('#dep_info').val()
                        $.post(home.urls.department.add(), {
                            code: code,
                            name: name,
                            info: info
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    department_manage.init()
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
            })
        }//$ bindAddEventListener——end$

        /** 删除事件 */
        , bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click').on('click', function () {
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
                        console.log('yes')
                        var departmentCode = _this.attr('id').substr(3)
                        $.post(home.urls.department.deleteByCode(), {code: departmentCode}, function (result) {
                            console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    _this.parent('td').parent('tr').remove();
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
        }//$ bindDeleteEventListener_end$

        /** 搜索事件绑定 */
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                console.log('search')
                var department_name = $('#department_name_input').val()
                $.post(home.urls.department.getAllByLikeNameByPage(), {name: department_name}, function (result) {
                    var page = result.data
                    var departments = result.data.content //获取数据
                    const $tbody = $("#department_table").children('tbody')
                    department_manage.funcs.renderHandler($tbody, departments)
                    layui.laypage.render({
                        elem: 'department_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.department.getAllByLikeNameByPage(), {
                                    name: department_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var departments = result.data.content //获取数据
                                    const $tbody = $("#department_table").children('tbody')
                                    department_manage.funcs.renderHandler($tbody, departments)
                                    department_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$

        /** 绑定刷新事件 */
        , bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    department_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        }
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.dep_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }
        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.dep_checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '批量删除',
                        content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除所有记录吗?</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var departmentCodes = []
                            $('.dep_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    departmentCodes.push({code: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.department.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(departmentCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            department_manage.init()
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
        }
        /** 编辑事件 */
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var departmentCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.department.getByCode(), {code: departmentCode}, function (result) {
                    var department = result.data
                    layer.open({
                        type: 1,
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>部门编码:<input type='text' disabled='true' id='dep_code' value='" + (department.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>部门名称:<input type='text' id='dep_name' value='" + (department.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>部门信息:<input type='text' id='dep_info' value='" + (department.info) + "'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '200px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#dep_code').val()
                            var name = $('#dep_name').val()
                            var info = $('#dep_info').val()
                            $.post(home.urls.department.update(), {
                                code: code,
                                name: name,
                                info: info
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        department_manage.init()
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
            })
        }//$ bindEditEventListener——end$
        /** 渲染 */
        , renderHandler: function ($tbody, departments) {
            $tbody.empty() //清空表格
            departments.forEach(function (e) {
                $('#dep_checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='dep_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.info) + "</td>" +
                    "<td><a href='#' class='editDepartment' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteDepartment' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕

            var editBtns = $('.editDepartment')
            var deleteBtns = $('.deleteDepartment')
            department_manage.funcs.bindDeleteEventListener(deleteBtns)
            department_manage.funcs.bindEditEventListener(editBtns)

            var selectAllBox = $('#dep_checkAll')
            department_manage.funcs.bindSelectAll(selectAllBox)

            var deleteBatchBtn = $('#model-li-hide-delete-60')
            department_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)

            var dep_checkboxes = $('.dep_checkbox')
            department_manage.funcs.disselectAll(dep_checkboxes, selectAllBox)
        }
        /** 全选逻辑 */
        , disselectAll: function (dep_checkboxes, selectAllBox) {
            dep_checkboxes.off('change')
            dep_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.dep_checkbox:checked').length === department_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}