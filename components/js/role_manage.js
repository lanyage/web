var role_manage = {
    modelOperations: [],
    roleModelOperation: [],
    operationMap: [],
    init: function () {
        var operations = JSON.parse(localStorage.getItem('operations'))
        operations.forEach(function (e) {
            role_manage.operationMap[e.code] = e
        })
        /////////////////////
        //Table Rendering
        role_manage.funcs.renderTable()
        /////////////////////
    }
    /** 当前总记录数,用户控制全选逻辑 */
    , pageSize: 0
    /** 逻辑方法 */
    , funcs: {
        /** 渲染页面 */
        renderTable: function () {
            /** 获取所有的记录 */
            $.post(home.urls.role.getAllByPage(), {page: 0}, function (result) {

                var roles = result.data.content //获取数据
                const $tbody = $("#role_table").children('tbody')
                /////////////////
                //RenderHandler
                role_manage.funcs.renderHandler($tbody, roles)
                ////////////////
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
                $('#role_page').css('padding-left', '37%')
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
                        $.post(home.urls.role.deleteByCode(), {code: roleCode}, function (result) {
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
                $.post(home.urls.role.getAllByLikeNameByPage(), {name: role_name}, function (result) {
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
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    role_manage.init()
                    $("#role_name_input").val('')
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
                                    roleCodes.push({code: $(this).val()})
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
            editBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var roleCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.role.getByCode(), {code: roleCode}, function (result) {
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
            limitBtns.off('click').on('click', function () {
                var $innerTable = $('#right_body_table')
                $innerTable.empty().hide()
                /** 获取当前角色的code */
                var _selfBtn = $(this)
                var roleCode = _selfBtn.attr('id').substr(6)
                /** 添加表头 */
                $innerTable.append(
                    "<tr style='background:#f8f8f8'>" +
                    "<td style='text-align: center;max-width: 20%'>导航名称</td>" +
                    "<td style='text-align: center;max-width: 5%'>选择</td>" +
                    "<td style='text-align: center'>操作</td>" +
                    "</tr>"
                )
                home.menu3s.sort(function (a, b) {
                    return a.code - b.code
                })
                // console.log('home.menu3s=',home.menu3s.length)
                /** 获取当前角色 */
                $.post(home.urls.role.getByCode(), {code: roleCode}, function (result) {
                    /** 当前角色并且携带所有的三级菜单 */
                    var role = result.data
                    var roleCode = role.code
                    /** 获取当前角色所写带的三级菜单,并且按照code排序*/
                    var role_models = role.models.sort(function (a, b) {
                        return a.code - b.code
                    })
                    /** 存储当前Role下的所有三级菜单的code,用于后期做比较 */
                    var role_model_codes = []
                    role_models.forEach(function (ele) {
                        var modelCode = ele.code
                        role_model_codes.push(modelCode)
                    })
                    // console.log('当前角色下的三级菜单主键=',role_model_codes)
                    /** 获取实际存在的所有的三级菜单*/
                    // console.log('localstorage_all_menu3s',JSON.parse(localStorage.getItem('all_menu3s')))        //todo
                    $.get(home.urls.menus.getAllMenu3(), {}, function (result) {
                        /** 获取所有的三级菜单 */
                        var all_models = result.data.sort(function (a, b) {
                            return a.code - b.code
                        })
                        // console.log('所有的三级菜单=',all_models)
                        var all_models_codes = []
                        all_models.forEach(function (ele) {
                            var modelCode = ele.code
                            all_models_codes.push(modelCode)
                        })
                        /** 获取所有的一级菜单和二级菜单 */
                        var menu1codes = []//用户一级菜单去重
                        var menu2codes = []//用于二级菜单去重
                        var menu1s = []
                        var menu2s = []
                        all_models.forEach(function (ele) {
                            var menu1code = ele.menu1.code
                            var menu2code = ele.menu2.code
                            /**去重menu1*/
                            if (menu1codes.indexOf(menu1code) == -1) {
                                menu1codes.push(menu1code)
                                menu1s.push(ele.menu1)
                            }
                            /**去重menu2*/
                            if (menu2codes.indexOf(menu2code) == -1) {
                                menu2codes.push(menu2code)
                                menu2s.push(ele.menu2)
                            }
                        })
                        menu2s = menu2s.sort(function (a, b) {
                            return a.menu1.rank - b.menu1.rank
                        })
                        menu2s.forEach(function (menu2) {
                            var menu1 = menu2.menu1;
                            var menu1Code = menu2.menu1.code
                            var menu1Row = $innerTable.children('#modal-menu1-' + menu1Code)[0]     //看是存在一级菜单这一行
                            console.log('menu1Row= ',menu1Row,'menu2',menu2.name)
                            if (!menu1Row) {
                                //添加一级菜单
                                $innerTable.append(
                                    "<tr id='modal-menu1-" + (menu1Code) + "'+><td>" +
                                    "<i class='layui-icon' style='color:rgb(134,134,134)'>&#xe7a0;</i>" +
                                    "<span>" + (menu1.name) + "</span>" +
                                    "</td><td></td><td></td></tr>"
                                )
                                //一级菜单后面添加二级菜单
                                $("#modal-menu1-" + (menu1Code)).after(
                                    "<tr id='modal-menu2-" + (menu2.code) + "' class='modal-menu1-" + (menu1Code) + "-sub'><td>" +
                                    "<i class='layui-icon' style='color:rgb(134,134,134); margin-left: 15px'>&#xe625;</i>" +
                                    "<span>" + (menu2.name) + "</span>" +
                                    "</td><td></td><td></td></tr>"
                                )
                            } else {
                                //给一级菜单下的二级菜单的后面追加新的二级菜单
                                var subs = $(".modal-menu1-" + (menu1Code) + "-sub")
                                var subLen = subs.length
                                var last = $(subs[subLen - 1])
                                last.after("<tr id='modal-menu2-" + (menu2.code) + "' class='modal-menu1-" + (menu1Code) + "-sub'><td>" +
                                    "<i class='layui-icon' style='color:rgb(134,134,134); margin-left: 15px'>&#xe625;</i>" +
                                    "<span>" + (menu2.name) + "</span>" +
                                    "</td><td></td><td></td></tr>")
                            }
                        })
                        /** 遍历所有的三级菜单,把三级菜单添加到二级菜单的后面去 */
                        all_models.forEach(function (e) {
                            /** 获取当前三级菜单的code */
                            var modelCode = e.code
                            var menu2Code = e.menu2.code


                            var subs = $('.modal-menu2-' + menu2Code + 'sub')
                            var subLen = subs.length
                            // console.log('sublen=',subLen)
                            var menu3Bar = subLen == 0 ? $("#modal-menu2-" + menu2Code) : $(subs[subLen - 1])
                            /** 如果当前角色的所包含的三级菜单包含当前三级菜单 */
                            if (role_model_codes.indexOf(modelCode) > -1) {
                                menu3Bar.after("<tr id='model_" + (e.code) + "' class='the_models modal-menu2-" + (menu2Code) + "-sub'><td>" +
                                    "<i class='layui-icon' style='color:rgb(134,134,134); margin-left: 30px'>&#xe623;</i>" +
                                    "<span>" + (e.name) + "</span>" +
                                    "<td style='text-align: center'><input id='all_operations_" + (e.code) + "' class='all_operations' value='" + (e.code) + "' type='checkbox' checked/>" +
                                    "</td><td id='add_operation_" + (e.code) + "'>" +
                                    "</td></tr>")
                            }
                            /** 如果当前角色的所包含的三级菜单不包含当前三级菜单 */
                            else {
                                menu3Bar.after(
                                    "<tr id='model_" + (e.code) + "' class='the_models modal-menu2-" + (menu2Code) + "-sub'><td>" +
                                    "<i class='layui-icon' style='color:rgb(134,134,134); margin-left: 30px'>&#xe623;</i>" +
                                    "<span>" + (e.name) + "</span>" +
                                    "<td style='text-align: center'><input id='all_operations_" + (e.code) + "' class='all_operations' value='" + (e.code) + "' type='checkbox' />" +
                                    "</td><td class = 'add_operation' id='add_operation_" + (e.code) + "'>" +
                                    "</td></tr>"
                                )
                            }
                            // var subs = $('.modal-menu2-' + menu2Code + 'sub')
                            // var subLen = subs.length
                            // console.log(subLen)
                            console.log(JSON.parse(localStorage.getItem('roleModelOperation')))         //all roleModelOperations
                            $.get(home.urls.role.getOperationsByRoleCodeAndModelCode(), {
                                roleCode: roleCode,
                                modelCode: modelCode
                            }, function (result) {
                                var roleModelOperations = result.data
                                /** 添加当前三级菜单下的所有operations */
                                var modelOperations = JSON.parse(localStorage.getItem('modelOperations'))
                                var the_modelOperations = modelOperations.filter(function (e) {
                                    return e.modelCode == modelCode
                                })
                                the_modelOperations.forEach(function (ele) {
                                    var operation = role_manage.operationMap[ele.operationCode]
                                    /** 获取到role下的三级菜单下的所有operations后然后去查找是否存在,存在就打勾 */
                                    var theOperation = roleModelOperations.find(function (e) {
                                        return e.code == operation.code
                                    })
                                    if (theOperation) {
                                        $('#add_operation_' + e.code).append(
                                            "&nbsp;&nbsp;&nbsp;&nbsp;<input class='a_operation_box' type='checkbox' value='" + (operation.code) + "' checked/>&nbsp;" + (operation.name) + ""
                                        )
                                    } else {
                                        $('#add_operation_' + e.code).append(
                                            "&nbsp;&nbsp;&nbsp;&nbsp;<input class='a_operation_box' type='checkbox' value='" + (operation.code) + "'/>&nbsp;" + (operation.name) + ""
                                        )
                                    }
                                })
                                var time = setTimeout(function() {
                                    $innerTable.show(0)
                                    clearTimeout(time)
                                },1000)
                                /////////////////////////////////
                                //绑定checkbox事件
                                ////////////////////////////////
                                $('.all_operations').off('change').on('change', function () {
                                    var _selfBtn = $(this)
                                    var statusNow = _selfBtn.prop('checked')
                                    var modelCode = _selfBtn.val()
                                    $('#add_operation_' + modelCode).children(".a_operation_box").prop('checked', statusNow)
                                })
                                /** 单选权限框 */
                                $('.a_operation_box').off('change').on('change', function () {
                                    var _selfBtn = $(this)
                                    var statusNow = _selfBtn.prop('checked')
                                    var modelCode = _selfBtn.parent().attr('id').substr(14)
                                    if (statusNow) {
                                        $('#all_operations_' + modelCode).prop('checked', true)
                                    } else if (_selfBtn.parent().children('.a_operation_box:checked').length == 0) {
                                        $('#all_operations_' + modelCode).prop('checked', false)
                                    }
                                })
                            })//$get operations by menu3
                        })//$forEach
                    })
                    layer.open({
                        type: 1,
                        content: $('#right_body'),
                        area: ['700px', '650px'],
                        btn: ['确认', '取消'],
                        offset: "auto",
                        closeBtn: 0,
                        yes: function (index) {
                            var RoleModelOperations = []

                            var container = []
                            $('.all_operations:checked').each(function () {
                                container.push($(this).parent('td').next('td'))
                            })
                            // console.log(container.length)
                            container.forEach(function (ele) {
                                var modelCode = ele.attr('id').substr(14)
                                var subCheckedBox = ele.children('.a_operation_box:checked')
                                subCheckedBox.each(function () {
                                    RoleModelOperations.push({
                                        roleCode: roleCode,
                                        modelCode: modelCode,
                                        operationCode: $(this).val()
                                    })
                                })
                            })
                            // console.log(RoleModelOperations)
                            $.ajax({
                                url: home.urls.role.updateRoleModelOperations(),
                                contentType: 'application/json',
                                data: JSON.stringify(RoleModelOperations),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        layer.msg(result.message, {
                                            offset: ['40%', '55%'],
                                            time: 700
                                        })
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
                    "<td><a href='#' class='editRole' id='edit-" + (e.code) + "'><i class='fa fa-user' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class='editLimit' id='limit-" + (e.code) + "'><i class='fa fa-key fa-rotate-90' aria-hidden='true'></i></a></td>" +
                    "<td><a href='#' class='deleteRole' id='de-" + (e.code) + "'><i class='fa fa-times-circle-o' aria-hidden='true'></i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕

            var editBtns = $('.editRole')
            var deleteBtns = $('.deleteRole')
            var limitBtns = $('.editLimit')
            var time = setTimeout(function () {
                ///////////////////////////////////
                //Re-allocate Operations For Roles
                role_manage.funcs.bindEditLimitListener(limitBtns)
                ///////////////////////////////////
                clearTimeout(time)
            }, 0)
            role_manage.funcs.bindEditEventListener(editBtns)
            role_manage.funcs.bindDeleteEventListener(deleteBtns)

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