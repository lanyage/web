var role_manage = {
    init: function () {
        // console.log('init')
        role_manage.funcs.renderTable()
        var out = $('#role_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#role_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    }
    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0

    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面 */
        renderTable: function () {
            /** 获取所有的记录 */
            $.post(home.urls.role.getAllByPage(), { page: 0 }, function (result) {
                var roles = result.data.content //获取数据
                const $tbody = $("#role_table").children('tbody')
                role_manage.funcs.renderHandler($tbody, roles)
                role_manage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'role_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.role.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var roles = result.data.content //获取数据
                                const $tbody = $("#role_table").children('tbody')
                                role_manage.funcs.renderHandler($tbody, roles)
                                role_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })//$数据渲染完毕

            /** 追加添加事件 */
            var addBtn = $("#model-li-hide-add-77")
            role_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-77')
            role_manage.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-77')
            role_manage.funcs.bindSearchEventListener(searchBtn)
        }
        /** 添加事件 */
        , bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                /** 弹出一个询问框 */
                layer.open({
                    type: 1,
                    title: '新增',
                    content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>角色名称:<input type='text' id='role_name'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>角色编码:<input type='text' id='role_code'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>角色描述:<input type='text' id='role_description'/></p>" +
                        "</div>" +
                        "</div>",
                    area: ['350px', '200px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var name = $('#role_name').val()
                        var code = $('#role_code').val()
                        var description = $('#role_description').val()
                        $.post(home.urls.role.add(), {
                            name: name,
                            code: code,
                            description: description
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    role_manage.init()
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
                        // console.log('yes')
                        var roleCode = _this.attr('id').substr(3)
                        $.post(home.urls.role.deleteByCode(), { code: roleCode }, function (result) {
                            // console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    role_manage.init()
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
                // console.log('search')
                var role_name = $('#role_name_input').val()
                $.post(home.urls.role.getAllByLikeNameByPage(), { name: role_name }, function (result) {
                    var page = result.data
                    var roles = result.data.content //获取数据
                    const $tbody = $("#role_table").children('tbody')
                    role_manage.funcs.renderHandler($tbody, roles)
                    layui.laypage.render({
                        elem: 'role_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            $.post(home.urls.role.getAllByLikeNameByPage(), {
                                name: role_name,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var roles = result.data.content //获取数据
                                const $tbody = $("#role_table").children('tbody')
                                role_manage.funcs.renderHandler($tbody, roles)
                                role_manage.pageSize = result.data.content.length
                            })
                            if (!first) {
                                console.log('not first')
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
                var index = layer.load(2, { offset: ['40%', '58%'] });
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    role_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        }
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.role_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }
        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.role_checkbox:checked').length === 0) {
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
                            var roleCodes = []
                            $('.role_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    roleCodes.push({ code: $(this).val() })
                                }
                            })
                            $.ajax({
                                url: home.urls.role.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(roleCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            role_manage.init()
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
                var roleCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.role.getByCode(), { code: roleCode }, function (result) {
                    var roles = result.data
                    layer.open({
                        type: 1,
                        content: "<div id='addModal'>" +
                            "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'>角色名称:<input type='text' id='role_name' value='" + (roles.name) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>角色编码:<input type='text' id='role_code' disabled='true' value='" + (roles.code) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>角色描述:<input type='text' id='role_description' value='" + (roles.description) + "'/></p>" +
                            "</div>" +
                            "</div>",
                        area: ['350px', '200px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#role_code').val()
                            var name = $('#role_name').val()
                            var description = $('#role_description').val()
                            $.post(home.urls.role.update(), {
                                code: code,
                                name: name,
                                description: description
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        role_manage.init()
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

        /** 编辑权限 */
        , bindEditLimitListener: function (limitBtns) {
            limitBtns.off('click')
            limitBtns.on('click', function () {
                var _selfBtn = $(this)
                var roleCode = _selfBtn.attr('id').substr(6)
                var operations = []
                    $.get(home.urls.role.getAllOperations(), function (op) {
                        operations = op.data
                    })
                $.post(home.urls.role.getByCode(), { code: roleCode }, function (result) {
                    var models = result.data.models
                    models.sort(function (a, b) {
                        return (a.menu2.code - b.menu2.code) && (a.code - b.code)
                    })
                    var flag1 = models[0].menu1.code
                    var flag2 = models[0].menu2.code
                    models.forEach(function (e) {
                        if (e.menu1.code == flag1) {
                            flag1++
                            $('#right_body_table').append(
                                "<tr><td>" +
                                "<i class='layui-icon' style='color:rgb(134,134,134)'>&#xe7a0;</i>" +
                                "<span>" + (e.menu1.name) + "</span>" +
                                "</td><td></td><td></td></tr>"
                            )
                        }
                        if (e.menu2.code == flag2) {
                            flag2++
                            $('#right_body_table').append(
                                "<tr><td>" +
                                "<i class='layui-icon' style='color:rgb(134,134,134); margin-left: 15px'>&#xe625;</i>" +
                                "<span>" + (e.menu2.name) + "</span>" +
                                "</td><td></td><td></td></tr>"
                            )
                        }
                        $('#right_body_table').append(
                            "<tr id='model_"+(e.code)+"' class='the_models'><td>" +
                            "<i class='layui-icon' style='color:rgb(134,134,134); margin-left: 30px'>&#xe623;</i>" +
                            "<span>" + (e.name) + "</span>" +
                            "<td style='text-align: center'><input class='all_operations' value='" + (e.code) + "' type='checkbox' />" +
                            "</td><td id='add_operatsion_"+(e.code)+"'>" +
                            "</td></tr>"
                        )
                        operations.forEach(function(ele){
                            $('#add_operation_'+e.code).append(
                                "&nbsp;&nbsp;&nbsp;&nbsp;<input id='the_operation_"+(e.code)+"' class='a_operation' type='checkbox' value='" + (ele.code) + "'/>" + (ele.name) + ""
                            )
                        })
                        /*
                        var the_operations = e.operations
                        the_operations.forEach(function (e) {
                            $('#the_operation_'+e.code).attr('chencked',true)
                        })
                        */
                    })
                    layer.open({
                        type: 1,
                        content: $('#right_body'),
                        area: ['700px', '650px'],
                        btn: ['确认', '取消'],
                        offset: ['12%', '30%'],
                        closeBtn: 0,
                        yes: function (index) {
                            var RoleModelOperations = []
                            $('.the_models').each(function() {
                                var model = $(this).attr('id').substr(6)
                                
                            })
                            $.ajax({
                                url: home.urls.role.updateRoleModelOperations(),
                                contentType: 'application/json',
                                data: JSON.stringify(RoleModelOperations),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {

                                    }
                                }
                            })
                            layer.close(index)
                            $("#right_body").css('display', 'none')
                        },
                        btn2: function (index) {
                            layer.close(index)
                            $("#right_body").css('display', 'none')
                        }
                    })
                    
                })
                var selectAllOperations = $('.all_operations')
                var addTheOperation = $('#the_operation')
                role_manage.funcs.bindSelectAllOperations(addTheOperation, selectAllOperations)
            })
        }
        /** 全选权限框 */
        , bindSelectAllOperations: function(addTheOperation, selectAllOperations) {
            addTheOperation.off('change')
            addTheOperation.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllOperations.prop('checked', false)
                } else if (statusNow === true && $('.role_checkbox:checked').length === role_manage.operations.length) {
                    selectAllOperations.prop('checked', true)
                }
            })
        }

        /** 渲染 */
        , renderHandler: function ($tbody, roles) {
            $tbody.empty() //清空表格
            roles.forEach(function (e) {
                $('#role_checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='role_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.description) + "</td>" +
                    "<td><a href='#' class='editRole' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='editLimit' id='limit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteRole' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕
            var editBtns = $('.editRole')
            var deleteBtns = $('.deleteRole')
            var limitBtns = $('.editLimit')
            role_manage.funcs.bindDeleteEventListener(deleteBtns)
            role_manage.funcs.bindEditEventListener(editBtns)
            role_manage.funcs.bindEditLimitListener(limitBtns)
            var selectAllBox = $('#role_checkAll')
            role_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-77')
            role_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var role_checkboxes = $('.role_checkbox')
            role_manage.funcs.disselectAll(role_checkboxes, selectAllBox)
        }
        /** 全选逻辑 */
        , disselectAll: function (role_checkboxes, selectAllBox) {
            role_checkboxes.off('change')
            role_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.role_checkbox:checked').length === role_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}