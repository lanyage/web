var user_manage = {
    init: function () {
        /** 获取部门信息分页显示并展示 */
        user_manage.funcs.renderOption()
        var out = $('#user_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#user_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    }//$init end$
    , the_departmentcode : '001'
    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0

    /** 逻辑方法 */
    , funcs: {
        /** 渲染左侧选择 */
        renderOption: function () {
            $.get(home.urls.department.getAll(), function (result) {
                var departments = result.data
                const $ul = $("#user_department").children('ul')
                $ul.append(
                    "<li style='background: #666666; color :white;'>部门</li>"
                )
              
                departments.forEach(function (e) {
                    $ul.append(
                        "<li class='setdepartment' id='setdepart-" + (e.code) + "'>" + (e.name) + "</li>"
                    )
                })
               $($('.setdepartment')[0]).addClass('selected_department').css('color',' #ffffff')
                var set_department = $('.setdepartment')
                user_manage.funcs.changeDepart(set_department)
            })
        }
        /** 选择部门 */
        , changeDepart: function (set_department) {
            set_department.off('click')
            
            set_department.on('click', function () {
                console.log($(this).attr('style'))  
                var _self = $(this)
                
                $('.setdepartment').removeClass('selected_department').css('color','')
                 _self.addClass('selected_department').css('color','#ffffff')
               
                var id_name = $(this).attr('id')
                var new_id = '#'+id_name
                user_manage.the_departmentcode = id_name.substr(10)
               
                user_manage.funcs.department_Set()
            })
            user_manage.funcs.department_Set()
        }
        /** 渲染 */
        , department_Set: function () {
            $.post(home.urls.user.getByDepartmentCodeByPage(), {
                departmentCode: user_manage.the_departmentcode,
                page: 0
            }, function (result) {
                var users = result.data.content //获取数据
                const $tbody = $("#user_table").children('tbody')
                user_manage.funcs.renderHandler($tbody, users)
                user_manage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'user_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if(!first) {
                            $.post(home.urls.user.getByDepartmentCodeByPage(), {
                                departmentCode: user_manage.the_departmentcode,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var users = result.data.content //获取数据
                                const $tbody = $("#user_table").children('tbody')
                                user_manage.funcs.renderHandler($tbody, users)
                                user_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
            /** 追加添加事件 */
            var addBtn = $("#model-li-hide-add-78")
            user_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            /** 追加刷新事件 */
            var refreshBtn = $('#model-li-hide-refresh-78')
            user_manage.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
            /** 追加搜索事件 */
            var searchBtn = $('#model-li-hide-search-78')
            user_manage.funcs.bindSearchEventListener(searchBtn)
            /** 追加重置密码事件 */
            var resetBtn = $('#model-li-hide-reset-78')
            user_manage.funcs.bindResetEventListener(resetBtn)
            /** 追加修改密码事件 */
            var modifyBtn = $('#model-li-hide-modify-78')
            user_manage.funcs.bindModifyEventListener(modifyBtn)
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
                        "<p style='padding: 5px 0px 5px 0px;'>用户名称:<input type='text' id='user_name'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>用户工号:<input type='text' id='user_code'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>手机号码:<input type='text' id='user_contact'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>描述说明:<input type='text' id='user_description'/></p>" +
                        "</div>" +
                        "</div>",
                    area: ['350px', '300px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var code = $('#user_code').val()
                        var name = $('#user_name').val()
                        var contact = $('#user_contact').val()
                        var description = $('#user_description').val()
                        var departmentCode = user_manage.the_departmentcode
                        $.post(home.urls.user.add(), {
                            code: code,
                            name: name,
                            contact: contact,
                            description: description,
                            departmentCode: departmentCode
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    user_manage.funcs.department_Set()
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
                        console.log('yes')
                        var userCode = _this.attr('id').substr(3)
                        $.post(home.urls.user.deleteByCode(), { code: userCode }, function (result) {
                            console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                console.log()
                                user_manage.funcs.department_Set()
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
                var user_name = $('#user_name_input').val()
                $.post(home.urls.user.getAllByLikeNameByPage(), { name: user_name }, function (result) {
                    var page = result.data
                    var users = result.data.content //获取数据
                    const $tbody = $("#user_table").children('tbody')
                    user_manage.funcs.renderHandler($tbody, users)
                    layui.laypage.render({
                        elem: 'user_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            $.post(home.urls.user.getAllByLikeNameByPage(), {
                                name: user_name,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var users = result.data.content //获取数据
                                const $tbody = $("#user_table").children('tbody')
                                user_manage.funcs.renderHandler($tbody, users)
                                user_manage.pageSize = result.data.content.length
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
                    user_manage.funcs.department_Set()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        }
        /** 全选*/
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.user_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }
        /** 批量删除*/
        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.user_checkbox:checked').length === 0) {
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
                            var userCodes = []
                            $('.user_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    userCodes.push({ code: $(this).val() })
                                }
                            })
                            $.ajax({
                                url: home.urls.user.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(userCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            user_manage.funcs.department_Set()
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
                var userCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.user.getByCode(), { code: userCode }, function (result) {
                    var user = result.data
                    layer.open({
                        type: 1,
                        content: "<div id='addModal'>" +
                            "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'>用户名称:<input type='text' id='user_name' value='" + (user.name) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>用户工号:<input type='text' id='user_code' value='" + (user.code) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>手机号码:<input type='text' id='user_contact' value='" + (user.contact) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>描述说明:<input type='text' id='user_description' value='" + (user.description) + "'/></p>" +
                            "</div>" +
                            "</div>",
                        area: ['350px', '300px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#user_code').val()
                            var name = $('#user_name').val()
                            var contact = $('#user_contact').val()
                            var description = $('#user_description').val()
                            $.post(home.urls.user.update(), {
                                code: code,
                                name: name,
                                description: description,
                                contact: contact
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        user_manage.funcs.department_Set()
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

        /** 重置密码 */
        , bindResetEventListener: function (resetBtns) {
            resetBtns.off('click')
            resetBtns.on('click', function () {
                if ($('.user_checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '重置密码',
                        content: "<h5 style='text-align: center;padding-top: 8px'>确认要重置密码吗?</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var userCodes = []
                            $('.user_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    userCodes.push({ code: $(this).val() })
                                }
                            })
                            console.log(userCodes)
                            $.ajax({
                                url: home.urls.user.resetPassword(),
                                contentType: 'application/json',
                                data: JSON.stringify(userCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            user_manage.funcs.department_Set()
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
        /** 修改初始密码 */
        , bindModifyEventListener: function (modifyBtns) {
            modifyBtns.off('click')
            modifyBtns.on('click', function () {
                if ($('.user_checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '修改初始密码',
                        content: "<div id='changeModal'>" +
                            "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'>原密码:<input type='text' id='old_password' /></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>新密码:<input type='text' id='new_password' placeholder='至少6位'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>确认密码:<input type='text' id='renew_password' placeholder='至少6位'/></p>" +
                            "</div>" +
                            "</div>",
                        area: ['350px', '200px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var userCode
                            $('.user_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    userCode = $(this).val()
                                }
                            })
                            var oldPassword = $('#old_password').val()
                            var newPassword = $('#new_password').val()
                            var reNewPassword = $('#renew_password').val()
                            $.post(home.urls.user.updatePassword(), {
                                code: userCode,
                                oldPassword: oldPassword,
                                newPassword: newPassword,
                                reNewPassword: reNewPassword
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        user_manage.funcs.department_Set()
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
                }
            })
        }

        /** 渲染 */
        , renderHandler: function ($tbody, users) {
            $tbody.empty() //清空表格
            users.forEach(function (e) {
                $('#user_checkAll').prop('checked', false)
                var str
                if (e.enable == 1)
                    str = "checked='checked'"
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='user_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.inteCircCard) + "</td>" +
                    "<td>" + (e.description) + "</td>" +
                    "<td>" + (e.department.name) + "</td>" +
                    "<td>" + (e.contact) + "</td>" +
                    "<td><input type='checkbox' class='if_checkbox'" + str + " value='" + (e.code) + "'></td>" +
                    "<td><a href='#' class='editdepart' id='depart-" + (e.code) + "'><i class='layui-icon'>&#xe620;</i></a></td>" +
                    "<td><a href='#' class='editrole' id='role-" + (e.code) + "'><i class='layui-icon'>&#xe620;</i></a></td>" +
                    "<td><a href='#' class='editic' id='ic-" + (e.code) + "'><i class='layui-icon'>&#xe620;</i></a></td>" +
                    "<td><a href='#' class='edituser' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteuser' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕
            var departBtns = $('.editdepart')
            var roleBtns = $('.editrole')
            var icBtns = $('.editic')
            var editBtns = $('.edituser')
            var deleteBtns = $('.deleteuser')
            user_manage.funcs.bindDepartEventListener(departBtns)
            user_manage.funcs.bindRoleEventListener(roleBtns)
            user_manage.funcs.bindIcEventListener(icBtns)
            user_manage.funcs.bindDeleteEventListener(deleteBtns)
            user_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#user_checkAll')
            user_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-78')
            user_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var user_checkboxes = $('.user_checkbox')
            user_manage.funcs.disselectAll(user_checkboxes, selectAllBox)
            var if_checkboxes = $('.if_checkbox')
            user_manage.funcs.selectIf(if_checkboxes)
        }
        /** 全选逻辑 */
        , disselectAll: function (user_checkboxes, selectAllBox) {
            user_checkboxes.off('change')
            user_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.user_checkbox:checked').length === user_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
        /** 是否启用 */
        , selectIf: function (if_checkboxes) {
            if_checkboxes.off('change')
            if_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    $.post(home.urls.user.updateEnable(), {
                        code: $(this).val(),
                        enable: 0
                    }, function (result) {
                        layer.msg(result.message, {
                            offset: ['40%', '55%'],
                            time: 700
                        })
                    })
                }
                else {
                    $.post(home.urls.user.updateEnable(), {
                        code: $(this).val(),
                        enable: 1
                    }, function (result) {
                        layer.msg(result.message, {
                            offset: ['40%', '55%'],
                            time: 700
                        })
                    })
                }
            })
        }
        /** 设置部门 */
        , bindDepartEventListener: function (departBtns) {
            departBtns.off('click')
            departBtns.on('click', function () {
                var _selfBtn = $(this)
                var userCode = _selfBtn.attr('id').substr(7)
                layer.open({
                    type: 1,
                    title: '设置部门',
                    content: "<div style='text-align: center;padding-top: 10px;'>" +
                        "<select id='set_depart' style='padding: 3px 33px;'>" +
                        "</select>" +
                        "</div>",
                    area: ['350px', '200px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        departmentCode = $('#set_depart').val()
                        $.post(home.urls.user.updateDepartmentCode(), {
                            code: userCode,
                            departmentCode: departmentCode
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    user_manage.funcs.department_Set()
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
                $.get(home.urls.department.getAll(), function (result) {
                    var departments = result.data
                    departments.forEach(function (e) {
                        $('#set_depart').append(
                            "<option value='" + (e.code) + "'>" + (e.name) + "</option>"
                        )
                    })
                })
            })
        }
        /** 设置角色 */
        , bindRoleEventListener: function (roleBtns) {
            roleBtns.off('click')
            roleBtns.on('click', function () {
                var _selfBtn = $(this)
                var userCode = _selfBtn.attr('id').substr(5)
                layer.open({
                    type: 1,
                    title: '设置角色',
                    content: "<div style='text-align: center;padding-top: 10px;'>" +
                        "<select style='padding: 3px 10px 3px 10px;'></select>" +
                        "</div>",
                    area: ['350px', '200px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {

                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                });
            })
        }
        /** 设置IC卡 */
        , bindIcEventListener: function (icBtns) {
            icBtns.off('click')
            icBtns.on('click', function () {
                var _selfBtn = $(this)
                var userCode = _selfBtn.attr('id').substr(3)
                $.post(home.urls.user.getByCode(), { code: userCode }, function (result) {
                    var user = result.data
                    var str1, str2
                    if (user.enableIc == 1)
                        str1 = "checked='checked'"
                    else
                        // str2 = "disabled='disabled'"
                    layer.open({
                        type: 1,
                        content: "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p stylr='padding: 5px 0px 5px 0px;'>启用IC卡登录:<input type='checkbox' id='ic_checkbox' " + str1 + "/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>卡号:<input type='text' id='ic_num' disabled/></p>" +
                            "</div>",
                        area: ['350px', '250px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var ic_ifcheck = $('#ic_checkbox')
                            user_manage.funcs.icIfcheck(ic_ifcheck)
                            var enableIc = (($('#ic_checkbox').prop('checked')) ? 1 : 0)
                            var inteCircCard = $('#ic_num').val()
                            $.post(home.urls.user.updateInteCircCard(), {
                                code: userCode,
                                enableIc: enableIc,
                                inteCircCard: inteCircCard
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        user_manage.funcs.department_Set()
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
                    $('#ic_checkbox').prop('checked') ? (function(){$('#ic_num').attr('disabled', false)})():(function(){
                        console.log('因为checked为false,所以将其设置为黑色')
                        console.log($('#ic_num').attr('disabled'))
                        $('#ic_num').attr('disabled', true)
                    })()
                    
                    $('#ic_checkbox').on('change', function() {
                        var status = $('#ic_checkbox').prop('checked')
                        !status ?  (function(){$('#ic_num').attr('disabled', true)})() : (function(){$('#ic_num').attr('disabled', false)})()
                    })
                })
            })
        }
        ,icIfcheck: function(ic_ifcheck) {
            ic_ifcheck.off('change')
            ic_ifcheck.on('change', function() {
                alert(111)
                if(ic_ifcheck.prop('checked'))
                    $('#ic_num').attr("disabled",false)
                $('#ic_num').attr("disabled",true)
            })
        }
    }
}

