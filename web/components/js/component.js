var components = {

    /**
     * 部门管理模块
     */
    department_manage: {

        init: function () {
            /** 获取部门信息分页显示并展示 */
            components.department_manage.funcs.renderTable()
        }//$init end$

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
                    components.department_manage.funcs.renderHandler($tbody, departments)
                    components.department_manage.pageSize = result.data.content.length
                    var page = result.data
                    /** @namespace page.totalPages 这是返回数据的总页码数 */
                    /** 分页信息 */
                    layui.laypage.render({
                        elem: 'department_page'
                        , count: 10 * page.totalPages//数据总数
                        /** 页面变化后的逻辑 */
                        , jump: function (obj) {
                            $.post(home.urls.department.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var departments = result.data.content //获取数据
                                const $tbody = $("#department_table").children('tbody')
                                components.department_manage.funcs.renderHandler($tbody, departments)
                                components.department_manage.pageSize = result.data.content.length
                            })
                        }
                    })
                })//$数据渲染完毕

                /** 追加添加事件 */
                var addBtn = $("#model-li-hide-add-60")
                components.department_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
                /** 追加刷新事件 */
                var refreshBtn = $('#model-li-hide-refresh-60')
                components.department_manage.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
                /** 追加搜索事件 */
                var searchBtn = $('#model-li-hide-search-60')
                components.department_manage.funcs.bindSearchEventListener(searchBtn)
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
                                        components.department_manage.init()
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
                            var departmentCode = _this.attr('id').substr(3)
                            $.post(home.urls.department.deleteByCode(), {code: departmentCode}, function (result) {
                                console.log(result.message)
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        components.department_manage.init()
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
                        components.department_manage.funcs.renderHandler($tbody, departments)
                        layui.laypage.render({
                            elem: 'department_page'
                            , count: 10 * page.totalPages//数据总数
                            , jump: function (obj, first) {
                                $.post(home.urls.department.getAllByLikeNameByPage(), {
                                    name: department_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var departments = result.data.content //获取数据
                                    const $tbody = $("#department_table").children('tbody')
                                    components.department_manage.funcs.renderHandler($tbody, departments)
                                    components.department_manage.pageSize = result.data.content.length
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
                        components.department_manage.init()
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
                                                components.department_manage.init()
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
                            "<p style='padding: 5px 0px 5px 0px;'>部门编码:<input type='text' id='dep_code' value='" + (department.code) + "'/></p>" +
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
                                            components.department_manage.init()
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
                components.department_manage.funcs.bindDeleteEventListener(deleteBtns)
                components.department_manage.funcs.bindEditEventListener(editBtns)
                var selectAllBox = $('#dep_checkAll')
                components.department_manage.funcs.bindSelectAll(selectAllBox)
                var deleteBatchBtn = $('#model-li-hide-delete-60')
                components.department_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
                var dep_checkboxes = $('.dep_checkbox')
                components.department_manage.funcs.disselectAll(dep_checkboxes, selectAllBox)
            }
            /** 全选逻辑 */
            , disselectAll: function (dep_checkboxes, selectAllBox) {
                dep_checkboxes.off('change')
                dep_checkboxes.on('change', function () {
                    var statusNow = $(this).prop('checked')
                    if (statusNow === false) {
                        selectAllBox.prop('checked', false)
                    } else if (statusNow === true && $('.dep_checkbox:checked').length === components.department_manage.pageSize) {
                        selectAllBox.prop('checked', true)
                    }
                })
            }
        }
    },
    supply_manage:{
        init: function () {
            console.log('supplyinfo')
            /** 获取供应商信息分页显示并展示 */
            components.supply_manage.funcs.renderTable()
        }//$init end$
        , pageSize: 0
        , funcs: {
            renderTable: function () {
                $.post(home.urls.supplyman.getAllByPage(), {page: 0}, function (result) {
                    var supplymans = result.data.content //获取数据
                    const $tbody = $("#supplier_table").children('tbody')
                    components.supply_manage.funcs.renderHandler($tbody, supplymans)
                    components.supply_manage.pageSize = result.data.content.length

                    var page = result.data
                    /** @namespace page.totalPages 这是返回数据的总页码数 */
                    layui.laypage.render({
                        elem: 'supplyman_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            $.post(home.urls.supplyman.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var supplymans = result.data.content //获取数据
                                const $tbody = $("#supplier_table").children('tbody')
                                components.supply_manage.funcs.renderHandler($tbody, supplymans)
                                components.supply_manage.pageSize = result.data.content.length
                            })
                        }
                    })
                })
                //$数据渲染完毕
                /** 新增*/
                var addBtn = $("#model-li-hide-add-80")
                components.supply_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
                /** 刷新*/
                var refreshBtn = $('#model-li-hide-refresh-80')
                components.supply_manage.funcs.bindRefreshEventLisener(refreshBtn)//追加刷新事件
                /** 搜索*/
                var searchBtn = $('#model-li-hide-search-80')
                components.supply_manage.funcs.bindSearchEventListener(searchBtn)
            }
            /*add*/
            , bindAddEventListener: function (addBtn) {
                addBtn.off('click')
                addBtn.on('click', function () {
                    //首先就是弹出一个弹出框
                    layer.open({
                        type: 1,
                        title: '新增',
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
                            $.post(home.urls.supplyman.add(), {
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
                                        components.supply_manage.init()
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
            /**删除 */
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
                            var supplymanCode = _this.attr('id').substr(3)
                            console.log('supplymanCode',supplymanCode)
                            $.post(home.urls.supplyman.deleteByCode(), {code: supplymanCode}, function (result) {
                                console.log(result.message)
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        components.supply_manage.init()
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
            /** 搜索*/
            , bindSearchEventListener: function (searchBtn) {
                searchBtn.off('click')
                searchBtn.on('click', function () {
                    console.log('search')
                    var supplyman_name = $('#supplyman_name_input').val()
                    $.post(home.urls.supplyman.getAllByLikeNameByPage(), {name: supplyman_name}, function (result) {
                        var page = result.data
                        var supplymans = result.data.content //获取数据
                        const $tbody = $("#supplier_table").children('tbody')
                        components.supply_manage.funcs.renderHandler($tbody, supplymans)
                        layui.laypage.render({
                            elem: 'supplyman_page'
                            , count: 10 * page.totalPages//数据总数
                            , jump: function (obj, first) {
                                $.post(home.urls.supplyman.getAllByLikeNameByPage(), {
                                    name: supplyman_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var supplymans = result.data.content //获取数据
                                    const $tbody = $("#supplier_table").children('tbody')
                                    components.supply_manage.funcs.renderHandler($tbody, supplymans)
                                    components.supply_manage.pageSize = result.data.content.length
                                })
                                if (!first) {
                                    console.log('not first')
                                }
                            }
                        })
                    })
                })
            } //$bindSearchEventListener_end$
            /** 刷新*/
            , bindRefreshEventLisener: function (refreshBtn) {
                refreshBtn.off('click')
                refreshBtn.on('click', function () {
                    var index = layer.load(2, {offset: ['40%', '58%']});
                    var time = setTimeout(function () {
                        layer.msg('刷新成功', {
                            offset: ['40%', '55%'],
                            time: 700
                        })
                        components.supply_manage.init()
                        layer.close(index)
                        clearTimeout(time)
                    }, 200)
                })
            }
            , bindSelectAll: function (selectAllBox) {
                selectAllBox.off('change')
                selectAllBox.on('change', function () {
                    var status = selectAllBox.prop('checked')
                    $('.sup_checkbox').each(function () {
                        $(this).prop('checked', status)
                    })
                })
            }
            , bindDeleteBatchEventListener: function (deleteBatchBtn) {
                deleteBatchBtn.off('click')
                deleteBatchBtn.on('click', function () {
                    if ($('.sup_checkbox:checked').length === 0) {
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
                                var supplymanCodes = []
                                $('.sup_checkbox').each(function () {
                                    if ($(this).prop('checked')) {
                                        supplymanCodes.push({code: $(this).val()})
                                    }
                                })
                                $.ajax({
                                    url: home.urls.supplyman.deleteByBatchCode(),
                                    contentType: 'application/json',
                                    data: JSON.stringify(supplymanCodes),
                                    dataType: 'json',
                                    type: 'post',
                                    success: function (result) {
                                        if (result.code === 0) {
                                            var time = setTimeout(function () {
                                                components.supply_manage.init()
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
            /** 编辑*/
            , bindEditEventListener: function (editBtns) {
                editBtns.off('click')
                editBtns.on('click', function () {
                    var _selfBtn = $(this)
                    var supplymanCode = _selfBtn.attr('id').substr(5)
                    $.post(home.urls.supplyman.getByCode(), {code: supplymanCode}, function (result) {
                        var supplyman = result.data
                        layer.open({
                            type: 1,
                            title: '编辑',
                            content: "<div id='addModal'>" +
                            "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'>部门编码:<input type='text' id='dep_code' value='" + (supplyman.code) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>部门名称:<input type='text' id='dep_name' value='" + (supplyman.name) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>部门信息:<input type='text' id='dep_info' value='" + (supplyman.info) + "'/></p>" +
                            "</div>" +
                            "</div>",
                            area: ['350px', '200px'],
                            btn: ['确认', '取消'],
                            offset: ['40%', '45%'],
                            yes: function (index) {
                                var code = $('#dep_code').val()
                                var name = $('#dep_name').val()
                                var info = $('#dep_info').val()
                                $.post(home.urls.supplyman.update(), {
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
                                            components.supply_manage.init()
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
            , renderHandler: function ($tbody, supplymans) {
                $tbody.empty() //清空表格
                supplymans.forEach(function (e) {
                    $('#sup_checkAll').prop('checked', false)
                    $tbody.append(
                        "<tr>" +
                        "<td><input type='checkbox' class='sup_checkbox' value='" + (e.code) + "'></td>" +
                        "<td>" + (e.code) + "</td>" +
                        "<td>" + (e.header.supplyTime) + "</td>" +
                        "<td>" + (e.header.total) + "</td>" +
                        "<td>" + (e.header.customer.name) + "</td>" +
                        "<td>" + (e.header.contact) + "</td>" +
                        "<td><a href='#' class='detailSupplyman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe63c;</i></a></td>"+
                        "<td><a href='#' class='editSupplyman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                        "<td><a href='#' class='deleteSupplyman' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                        "</tr>")
                })//$数据渲染完毕
                var editBtns = $('.editSupplyman')
                var deleteBtns = $('.deleteSupplyman')
                /** 删除事件*/
                components.supply_manage.funcs.bindDeleteEventListener(deleteBtns)
                /** 编辑事件*/
                components.supply_manage.funcs.bindEditEventListener(editBtns)
                var selectAllBox = $('#sup_checkAll')
                components.supply_manage.funcs.bindSelectAll(selectAllBox)
                var deleteBatchBtn = $('#model-li-hide-delete-60')
                /** 批量删除*/
                components.supply_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
                var sup_checkboxes = $('.sup_checkbox')
                components.supply_manage.funcs.disselectAll(sup_checkboxes, selectAllBox)
            }
            , disselectAll: function (sup_checkboxes, selectAllBox) {
                sup_checkboxes.off('change')
                sup_checkboxes.on('change', function () {
                    var statusNow = $(this).prop('checked')
                    if (statusNow === false) {
                        selectAllBox.prop('checked', false)
                    } else if (statusNow === true && $('.sup_checkbox:checked').length === components.supply_manage.pageSize) {
                        selectAllBox.prop('checked', true)
                    }
                })
            }
        }
    },
    archive_manage: {

        init: function () {
            /** 获取部门信息分页显示并展示 */
            components.archive_manage.funcs.renderTable()
        }//$init end$
        , pageSize: 0
        ,funcs: {
            renderTable: function () {
                console.log('render啦@@@@@！！！')
                $.post(home.urls.archive.getAllByPage(), {}, function (result) {
                    var archives = result.data.content //获取数据

                    const $tbody = $("#archive_table").children('tbody')

                    components.archive_manage.funcs.renderHandler($tbody, archives)

                    var page = result.data
                    /** @namespace page.totalPages 这是返回数据的总页码数 */
                    layui.laypage.render({
                        elem: 'archive_page'
                        , count: 10 * page.totalPages//数据总数
                    })
                    var editBtns = $('.editArchive')
                    var deleteBtns = $('.deleteArchive')

                    components.archive_manage.funcs.bindDeleteEventListener(deleteBtns)
                    components.archive_manage.funcs.bindEditEventListener(editBtns)
                })

                //$数据渲染完毕
                var addBtn = $("#model-li-hide-add-40")
                components.archive_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
                var refreshBtn = $('#model-li-hide-refresh-40')
                components.archive_manage.funcs.bindRefreshEventLisener(refreshBtn)//追加刷新事件
                var searchBtn = $('#model-li-hide-search-40')
                components.archive_manage.funcs.bindSearchEventListener(searchBtn)
                //批量删除 分页逻辑  todo
            }

            , bindAddEventListener: function (addBtn) {
                addBtn.off('click')
                addBtn.on('click', function () {
                    //首先就是弹出一个弹出框
                    layer.open({
                        type: 1,
                        title: '添加',
                        content: "<div id='addArchive'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>部门编码:<input type='text' id='arc_code'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>部门名称:<input type='text' id='arc_name'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>部门信息:<input type='text' id='arc_info'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '200px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            console.log('yes')
                            var code = $('#arc_code').val()
                            var ename = $('#arc_name').val()
                            var intime = $('#arc_intime').val()
                            var depe = $('#arc_depe').val()
                            var supfac = $('#arc_supfac').val()
                            var supcon = $('#arc_supcon').val()
                            var refac = $('#arc_refac').val()
                            var recon = $('#arc_recon').val()
                            var doc = $('#arc_doc').val()
                            $.post(home.urls.archive.add(), {
                                code: code,
                                equipmentCode: name,
                                installTime: intime,
                                defectPeriod: depe,
                                supplyFactory: supfac,
                                supplyContact: supcon,
                                repairFactory: refac,
                                repairContact: recon,
                                document:doc,
                                
                            }, function (result) {
                                console.log(result.message)
                                layer.msg(result.message, {
                                    offset: ['40%', '55%']
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        components.archive_manage.init()
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
                            var archiveCode = _this.attr('id').substr(3)
                            $.post(home.urls.archive.deleteByCode(), {code: archiveCode}, function (result) {
                                console.log(result.message)
                                layer.msg(result.message, {
                                    offset: ['40%', '55%']
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        components.archive_manage.init()
                                        clearTimeout(time)
                                    }, 1000)
                                }
                                layer.close(index)
                            })
                        },
                        btn2: function (index) {
                            console.log('no')
                            layer.close(index)
                        }
                    })
                })
            }//$ bindDeleteEventListener_end$
            , bindSearchEventListener: function (searchBtn) {
                console.log(searchBtn)
                searchBtn.off('click')
                searchBtn.on('click', function () {
                    console.log('search')
                    var archive_name = $('#archive_name_input').val()
                    $.post(home.urls.archive.getAllByLikeNameByPage(), {name: archive_name}, function (result) {
                        var archives = result.data.content //获取数据
                        const $tbody = $("#archive_table").children('tbody')
                        components.archive_manage.funcs.renderHandler($tbody, archives)
                    })
                })
            } //$bindSearchEventListener_end$
            , bindRefreshEventLisener: function (refreshBtn) {
                console.log(refreshBtn)
                refreshBtn.off('click')
                refreshBtn.on('click', function () {
                    var index = layer.load(2, {offset: ['40%', '58%']});
                    var time = setTimeout(function () {
                        console.log('refresh doing')
                        layer.msg('刷新成功', {
                            offset: ['40%', '55%']
                        })
                        components.archive_manage.init()
                        layer.close(index)
                        clearTimeout(time)
                    }, 1000)
                })
            }
            , bindEditEventListener: function (editBtns) {
                editBtns.off('click')
                editBtns.on('click', function () {
                    var _selfBtn = $(this)
                    var archiveCode = _selfBtn.attr('id').substr(5)
                    $.post(home.urls.archive.getByCode(), {code: archiveCode}, function (result) {
                        var archive = result.data
                        layer.open({
                            type: 1,
                            title: '编辑',
                            content: "<div id='addModal'>" +
                            "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'>部门编码:<input type='text' id='dep_code' value='" + (department.code) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>部门名称:<input type='text' id='dep_name' value='" + (department.name) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>部门信息:<input type='text' id='dep_info' value='" + (department.info) + "'/></p>" +
                            "</div>" +
                            "</div>",
                            area: ['350px', '200px'],
                            btn: ['确认', '取消'],
                            offset: ['40%', '45%'],
                            yes: function (index) {
                                console.log('yes')
                                var code = $('#arc_code').val()
                                var ename = $('#arc_name').val()
                                var intime = $('#arc_intime').val()
                                var depe = $('#arc_depe').val()
                                var supfac = $('#arc_supfac').val()
                                var supcon = $('#arc_supcon').val()
                                var refac = $('#arc_refac').val()
                                var recon = $('#arc_recon').val()
                                var doc = $('#arc_doc').val()
                                $.post(home.urls.archive.update(), {
                                    code: code,
                                    equipmentCode: name,
                                    installTime: intime,
                                    defectPeriod: depe,
                                    supplyFactory: supfac,
                                    supplyContact: supcon,
                                    repairFactory: refac,
                                    repairContact: recon,
                                    document:doc,
                                }, function (result) {
                                    console.log(result.message)
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%']
                                    })
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            components.archive_manage.init()
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
            , renderHandler: function ($tbody, archives) {
                $tbody.empty() //清空表格
               archives.forEach(function (e) {
                    $('#arc_checkAll').prop('checked', false)
                    $tbody.append(
                        "<tr>" +
                        "<td><input type='checkbox' class='dep_checkbox' value='" + (e.code) + "'></td>" +
                        "<td>" + (e.code) + "</td>" +
                        "<td>" + (e.equipmentName) + "</td>" +
                        "<td>" + (e.installTime) + "</td>" +
                        "<td>" + (e.defectPeriod) + "</td>" +
                        "<td>" + (e.supplyFactory) + "</td>" +
                        "<td>" + (e.supplyContact) + "</td>" +
                        "<td>" + (e.repairFactory) + "</td>" +
                        "<td>" + (e.repairContact) + "</td>" +
                        "<td>" + (e.document) + "</td>" +
                        "<td><a href='#' class='editArchive' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                        "<td><a href='#' class='deleteArchive' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                        "</tr>")
                })//$数据渲染完毕
                var editBtns = $('.editArchive')
                var deleteBtns = $('.deleteArchive')
                components.archive_manage.funcs.bindDeleteEventListener(deleteBtns)
                components.archive_manage.funcs.bindEditEventListener(editBtns)
                var selectAllBox = $('#arc_checkAll')
                components.archive_manage.funcs.bindSelectAll(selectAllBox)
                var deleteBatchBtn = $('#model-li-hide-delete-40')
                components.archive_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
                var arc_checkboxes = $('.arc_checkbox')
                components.archive_manage.funcs.disselectAll(arc_checkboxes, selectAllBox)
            }
            , disselectAll: function (arc_checkboxes, selectAllBox) {
                arc_checkboxes.off('change')
                arc_checkboxes.on('change', function () {
                    var statusNow = $(this).prop('checked')
                    if (statusNow === false) {
                        selectAllBox.prop('checked', false)
                    } else if (statusNow === true && $('.arc_checkbox:checked').length === components.archive_manage.pageSize) {
                        selectAllBox.prop('checked', true)
                    }
                })
            }
        }
    },
    role_manage:{
        init: function() {
            console.log('init')
            components.role_manage.funcs.renderTable()
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
                    components.role_manage.funcs.renderHandler($tbody, roles)
                    components.role_manage.pageSize = result.data.content.length
                    var page = result.data
                    /** @namespace page.totalPages 这是返回数据的总页码数 */
                    /** 分页信息 */
                    layui.laypage.render({
                        elem: 'role_page'
                        , count: 10 * page.totalPages//数据总数
                        /** 页面变化后的逻辑 */
                        , jump: function (obj, first) {
                            $.post(home.urls.role.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var roles = result.data.content //获取数据
                                const $tbody = $("#role_table").children('tbody')
                                components.role_manage.funcs.renderHandler($tbody, roles)
                                components.role_manage.pageSize = result.data.content.length
                            })
                        }
                    })
                })//$数据渲染完毕

                /** 追加添加事件 */
                var addBtn = $("#model-li-hide-add-77")
                components.role_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
                /** 追加刷新事件 */
                var refreshBtn = $('#model-li-hide-refresh-77')
                components.role_manage.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件
                /** 追加搜索事件 */
                var searchBtn = $('#model-li-hide-search-77')
                components.role_manage.funcs.bindSearchEventListener(searchBtn)
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
                        "<p style='padding: 5px 0px 5px 0px;'>角色描述:<input type='text' id='role_info'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '200px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var name = $('#role_name').val()
                            var code = $('#role_code').val()
                            var info = $('#role_info').val()
                            $.post(home.urls.role.add(), {
                                name: name,
                                code: code,
                                info: info
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        components.role_manage.init()
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
                            var roleCode = _this.attr('id').substr(3)
                            $.post(home.urls.role.deleteByCode(), {code: roleCode}, function (result) {
                                console.log(result.message)
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        components.role_manage.init()
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
                    var role_name = $('#role_name_input').val()
                    $.post(home.urls.role.getAllByLikeNameByPage(), {name: role_name}, function (result) {
                        var page = result.data
                        var roles = result.data.content //获取数据
                        const $tbody = $("#role_table").children('tbody')
                        components.role_manage.funcs.renderHandler($tbody, roles)
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
                                    components.role_manage.funcs.renderHandler($tbody, roles)
                                    components.role_manage.pageSize = result.data.content.length
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
                        components.role_manage.init()
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
                                                components.role_manage.init()
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
                    $.post(home.urls.role.getByCode(), {code: roleCode}, function (result) {
                        var roles = result.data
                        layer.open({
                            type: 1,
                            content: "<div id='addModal'>" +
                            "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'>角色名称:<input type='text' id='role_name' value='" + (roles.name) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>角色编码:<input type='text' id='role_code' value='" + (roles.code) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>角色描述:<input type='text' id='role_info' value='" + (roles.info) + "'/></p>" +
                            "</div>" +
                            "</div>",
                            area: ['350px', '200px'],
                            btn: ['确认', '取消'],
                            offset: ['40%', '45%'],
                            yes: function (index) {
                                var code = $('#role_code').val()
                                var name = $('#role_name').val()
                                var info = $('#role_info').val()
                                $.post(home.urls.role.update(), {
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
                                            components.role_manage.init()
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
            , renderHandler: function ($tbody, roles) {
                $tbody.empty() //清空表格
                roles.forEach(function (e) {
                    $('#role_checkAll').prop('checked', false)
                    $tbody.append(
                        "<tr>" +
                        "<td><input type='checkbox' class='role_checkbox' value='" + (e.code) + "'></td>" +
                        "<td>" + (e.name) + "</td>" +
                        "<td>" + (e.code) + "</td>" +
                        "<td>" + (e.info) + "</td>" +
                        "<td><a href='#' class='editRole' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                        "<td><a href='#' class='changeRole' id='change-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                        "<td><a href='#' class='deleteRole' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                        "</tr>")
                })//$数据渲染完毕
                var editBtns = $('.editRole')
                var deleteBtns = $('.deleteRole')
                components.role_manage.funcs.bindDeleteEventListener(deleteBtns)
                components.role_manage.funcs.bindEditEventListener(editBtns)
                var selectAllBox = $('#role_checkAll')
                components.role_manage.funcs.bindSelectAll(selectAllBox)
                var deleteBatchBtn = $('#model-li-hide-delete-77')
                components.role_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
                var role_checkboxes = $('.role_checkbox')
                components.role_manage.funcs.disselectAll(role_checkboxes, selectAllBox)
            }
            /** 全选逻辑 */
            , disselectAll: function (role_checkboxes, selectAllBox) {
                role_checkboxes.off('change')
                role_checkboxes.on('change', function () {
                    var statusNow = $(this).prop('checked')
                    if (statusNow === false) {
                        selectAllBox.prop('checked', false)
                    } else if (statusNow === true && $('.role_checkbox:checked').length === components.role_manage.pageSize) {
                        selectAllBox.prop('checked', true)
                    }
                })
            }            
        }
    }
	// 工序信息
	,
	process_manage: {

		init: function() {
				/** 获取部门信息分页显示并展示 */
				components.process_manage.funcs.renderTable()
			} //$init end$
			,
		pageSize: 0,
		funcs: {
			renderTable: function() {
					$.post(home.urls.process.getAllByPage(), {
						page: 0
					}, function(result) {
						var processes = result.data.content //获取数据
						const $tbody = $("#process_table").children('tbody')
						components.process_manage.funcs.renderHandler($tbody, processes)
						components.process_manage.pageSize = result.data.content.length

						var page = result.data
						/** @namespace page.totalPages 这是返回数据的总页码数 */
						layui.laypage.render({
							elem: 'process_page',
							count: 10 * page.totalPages //数据总数
								,
							jump: function(obj, first) {
								$.post(home.urls.process.getAllByPage(), {
									page: obj.curr - 1,
									size: obj.limit
								}, function(result) {
									var processes = result.data.content //获取数据
									const $tbody = $("#process_table").children('tbody')
									components.process_manage.funcs.renderHandler($tbody, processes)
									components.process_manage.pageSize = result.data.content.length
								})
							}
						})
					})
					//$数据渲染完毕
					var addBtn = $("#model-li-hide-add-60")
					components.process_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
					var refreshBtn = $('#model-li-hide-refresh-60')
					components.process_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
					var searchBtn = $('#model-li-hide-search-60')
					components.process_manage.funcs.bindSearchEventListener(searchBtn)
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
								"<p style='padding: 5px 0px 5px 0px;'>工序编码:<input type='text' id='code'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>工序名称:<input type='text' id='name'/></p>" +
								"</div>" +
								"</div>",
							area: ['350px', '180px'],
							btn: ['确认', '取消'],
							offset: ['40%', '45%'],
							yes: function(index) {
								var code = $('#code').val()
								var name = $('#name').val()
								$.post(home.urls.process.add(), {
									code: code,
									name: name
								}, function(result) {
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.process_manage.init()
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
								var processCode = _this.attr('id').substr(3)
								$.post(home.urls.process.deleteByCode(), {
									code: processCode
								}, function(result) {
									console.log(result.message)
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.process_manage.init()
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
						console.log('search')
						var process_name = $('#process_name_input').val()
						$.post(home.urls.process.getAllByLikeNameByPage(), {
							name: process_name
						}, function(result) {
							var page = result.data
							var processes = result.data.content //获取数据
							const $tbody = $("#process_table").children('tbody')
							components.process_manage.funcs.renderHandler($tbody, processes)
							layui.laypage.render({
								elem: 'process_page',
								count: 10 * page.totalPages //数据总数
									,
								jump: function(obj, first) {
									$.post(home.urls.process.getAllByLikeNameByPage(), {
										name: process_name,
										page: obj.curr - 1,
										size: obj.limit
									}, function(result) {
										var processes = result.data.content //获取数据
										const $tbody = $("#process_table").children('tbody')
										components.process_manage.funcs.renderHandler($tbody, processes)
										components.process_manage.pageSize = result.data.content.length
									})
									if(!first) {
										console.log('not first')
									}
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
						components.process_manage.init()
						layer.close(index)
						clearTimeout(time)
					}, 200)
				})
			},
			bindSelectAll: function(selectAllBox) {
				selectAllBox.off('change')
				selectAllBox.on('change', function() {
					var status = selectAllBox.prop('checked')
					$('.dep_checkbox').each(function() {
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
								var processCodes = []
								$('.checkbox').each(function() {
									if($(this).prop('checked')) {
										processCodes.push({
											code: $(this).val()
										})
									}
								})
								$.ajax({
									url: home.urls.process.deleteByBatchCode(),
									contentType: 'application/json',
									data: JSON.stringify(processCodes),
									dataType: 'json',
									type: 'post',
									success: function(result) {
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.process_manage.init()
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
						var processCode = _selfBtn.attr('id').substr(5)
						$.post(home.urls.process.getByCode(), {
							code: processCode
						}, function(result) {
							var process = result.data
							layer.open({
								type: 1,
								title: '编辑',
								content: "<div id='addModal'>" +
									"<div style='text-align: center;padding-top: 10px;'>" +
									"<p style='padding: 5px 0px 5px 0px;'>工序编码:<input type='text' id='code' value='" + (process.code) + "'/></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>工序名称:<input type='text' id='name' value='" + (process.name) + "'/></p>" +
									"</div>" +
									"</div>",
								area: ['350px', '180px'],
								btn: ['确认', '取消'],
								offset: ['40%', '45%'],
								yes: function(index) {
									var code = $('#code').val()
									var name = $('#name').val()
									$.post(home.urls.process.update(), {
										code: code,
										name: name
									}, function(result) {
										layer.msg(result.message, {
											offset: ['40%', '55%'],
											time: 700
										})
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.process_manage.init()
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
			renderHandler: function($tbody, processes) {
				$tbody.empty() //清空表格
				processes.forEach(function(e) {
					$('#checkAll').prop('checked', false)
					$tbody.append(
						"<tr>" +
						"<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
						"<td>" + (e.code) + "</td>" +
						"<td>" + (e.name) + "</td>" +
						"<td><a href='#' class='editprocess' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
						"<td><a href='#' class='deleteprocess' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
						"</tr>")
				}) //$数据渲染完毕
				var editBtns = $('.editprocess')
				var deleteBtns = $('.deleteprocess')
				components.process_manage.funcs.bindDeleteEventListener(deleteBtns)
				components.process_manage.funcs.bindEditEventListener(editBtns)
				var selectAllBox = $('#checkAll')
				components.process_manage.funcs.bindSelectAll(selectAllBox)
				var deleteBatchBtn = $('#model-li-hide-delete-60')
				components.process_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
				var checkboxes = $('.checkbox')
				components.process_manage.funcs.disselectAll(checkboxes, selectAllBox)
			},
			disselectAll: function(checkboxes, selectAllBox) {
				checkboxes.off('change')
				checkboxes.on('change', function() {
					var statusNow = $(this).prop('checked')
					if(statusNow === false) {
						selectAllBox.prop('checked', false)
					} else if(statusNow === true && $('.dep_checkbox:checked').length === components.process_manage.pageSize) {
						selectAllBox.prop('checked', true)
					}
				})
			}
		}
	}

	// 设备信息信息
	,
	equipment_manage: {

		init: function() {
				/** 获取部门信息分页显示并展示 */
				components.equipment_manage.funcs.renderTable()
			} //$init end$
			,
		pageSize: 0,
		funcs: {
			renderTable: function() {
					$.post(home.urls.equipment.getAllByPage(), {
						page: 0
					}, function(result) {
						var equipmentes = result.data.content //获取数据
						const $tbody = $("#equipment_table").children('tbody')
						components.equipment_manage.funcs.renderHandler($tbody, equipmentes)
						components.equipment_manage.pageSize = result.data.content.length

						var page = result.data
						/** @namespace page.totalPages 这是返回数据的总页码数 */
						layui.laypage.render({
							elem: 'equipment_page',
							count: 10 * page.totalPages //数据总数
								,
							jump: function(obj, first) {
								$.post(home.urls.equipment.getAllByPage(), {
									page: obj.curr - 1,
									size: obj.limit
								}, function(result) {
									var equipmentes = result.data.content //获取数据
									const $tbody = $("#equipment_table").children('tbody')
									components.equipment_manage.funcs.renderHandler($tbody, equipmentes)
									components.equipment_manage.pageSize = result.data.content.length
								})
							}
						})
					})
					//$数据渲染完毕
					var addBtn = $("#model-li-hide-add-60")
					components.equipment_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
					var refreshBtn = $('#model-li-hide-refresh-60')
					components.equipment_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
					var searchBtn = $('#model-li-hide-search-60')
					components.equipment_manage.funcs.bindSearchEventListener(searchBtn)
				}

				,
			bindAddEventListener: function(addBtn) {
					addBtn.off('click')
					addBtn.on('click', function() {
						$.get(home.urls.department.getAll(), function(result) {
							var departments = result.data
							//首先就是弹出一个弹出框
							layer.open({
								type: 1,
								title: '添加',
								content: "<div id='addModal'>" +
									"<div style='text-align: center;padding-top: 10px;'>" +
									"<p style='padding: 5px 0px 5px 0px;'>设备编码:&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' id='code'/></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>设备名称:&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' id='name'/></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>所属部门:&nbsp;&nbsp;&nbsp;&nbsp;<select id='department_name' style='width:174px;'></select></p>" + 
									"<p style='padding: 5px 0px 5px 0px;'>所属产品线:<select id='productline_name' style='width:174px;'></select></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>巡检人:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<select id='user_name' style='width:174px;'></select></p>" +
									"</div>" +
									"</div>",
								area: ['350px', '260px'],
								btn: ['确认', '取消'],
								offset: ['30%', '35%'],
								yes: function(index) {
									var code = $('#code').val()
									var name = $('#name').val()
									$.post(home.urls.equipment.add(), {
										code: code,
										name: name
									}, function(result) {
										layer.msg(result.message, {
											offset: ['40%', '55%'],
											time: 700
										})
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.equipment_manage.init()
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

							var department_select = $("#department_name");
							department_select.empty();
//							for (var i = 0; i < departments.length; i++) {
//								var department = departments[i];
//							}
							departments.forEach(function(department){
								console.log("for")
								var option = $("<option>").val(department.code).text(department.name); 
								department_select.append(option);	
							});
//							console.log(departments)
//							for(var i = 0; i < departments.size(); i++) {								
//								var opt = document.createElement("option");
//								department_select.options.add(opt);
//								opt.text = departments[i].name;
//								opt.value = departments[i].code;
//							}
						})
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
								var equipmentCode = _this.attr('id').substr(3)
								$.post(home.urls.equipment.deleteByCode(), {
									code: equipmentCode
								}, function(result) {
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.equipment_manage.init()
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
						console.log('search')
						var equipment_name = $('#equipment_name_input').val()
						$.post(home.urls.equipment.getAllByLikeNameByPage(), {
							name: equipment_name
						}, function(result) {
							var page = result.data
							var equipmentes = result.data.content //获取数据
							const $tbody = $("#equipment_table").children('tbody')
							components.equipment_manage.funcs.renderHandler($tbody, equipmentes)
							layui.laypage.render({
								elem: 'equipment_page',
								count: 10 * page.totalPages //数据总数
									,
								jump: function(obj, first) {
									$.post(home.urls.equipment.getAllByLikeNameByPage(), {
										name: equipment_name,
										page: obj.curr - 1,
										size: obj.limit
									}, function(result) {
										var equipmentes = result.data.content //获取数据
										const $tbody = $("#equipment_table").children('tbody')
										components.equipment_manage.funcs.renderHandler($tbody, equipmentes)
										components.equipment_manage.pageSize = result.data.content.length
									})
									if(!first) {
										console.log('not first')
									}
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
						components.equipment_manage.init()
						layer.close(index)
						clearTimeout(time)
					}, 200)
				})
			},
			bindSelectAll: function(selectAllBox) {
				selectAllBox.off('change')
				selectAllBox.on('change', function() {
					var status = selectAllBox.prop('checked')
					$('.dep_checkbox').each(function() {
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
								var equipmentCodes = []
								$('.checkbox').each(function() {
									if($(this).prop('checked')) {
										equipmentCodes.push({
											code: $(this).val()
										})
									}
								})
								$.ajax({
									url: home.urls.equipment.deleteByBatchCode(),
									contentType: 'application/json',
									data: JSON.stringify(equipmentCodes),
									dataType: 'json',
									type: 'post',
									success: function(result) {
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.equipment_manage.init()
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
						var equipmentCode = _selfBtn.attr('id').substr(5)
						$.post(home.urls.equipment.getByCode(), {
							code: equipmentCode
						}, function(result) {
							var equipment = result.data
							layer.open({
								type: 1,
								title: '编辑',
								content: "<div id='addModal'>" +
									"<div style='text-align: center;padding-top: 10px;'>" +
									"<p style='padding: 5px 0px 5px 0px;'>工序编码:<input type='text' id='code' value='" + (equipment.code) + "'/></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>工序名称:<input type='text' id='name' value='" + (equipment.name) + "'/></p>" +
									"</div>" +
									"</div>",
								area: ['350px', '180px'],
								btn: ['确认', '取消'],
								offset: ['40%', '45%'],
								yes: function(index) {
									var code = $('#code').val()
									var name = $('#name').val()
									$.post(home.urls.equipment.update(), {
										code: code,
										name: name
									}, function(result) {
										layer.msg(result.message, {
											offset: ['40%', '55%'],
											time: 700
										})
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.equipment_manage.init()
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
			renderHandler: function($tbody, equipmentes) {
				$tbody.empty() //清空表格
				equipmentes.forEach(function(e) {
					$('#checkAll').prop('checked', false)
					$tbody.append(
						"<tr>" +
						"<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
						"<td>" + (e.code) + "</td>" +
						"<td>" + (e.name) + "</td>" +
						"<td>" + (e.department && e.department.name || '') + "</td>" +
						"<td>" + (e.productLine && e.productLine.name || '') + "</td>" +
						"<td>" + (e.user && e.user.name || '') + "</td>" +
						"<td><a href='#' class='editequipment' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
						"<td><a href='#' class='deleteequipment' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
						"</tr>")
				}) //$数据渲染完毕
				var editBtns = $('.editequipment')
				var deleteBtns = $('.deleteequipment')
				components.equipment_manage.funcs.bindDeleteEventListener(deleteBtns)
				components.equipment_manage.funcs.bindEditEventListener(editBtns)
				var selectAllBox = $('#checkAll')
				components.equipment_manage.funcs.bindSelectAll(selectAllBox)
				var deleteBatchBtn = $('#model-li-hide-delete-60')
				components.equipment_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
				var checkboxes = $('.checkbox')
				components.equipment_manage.funcs.disselectAll(checkboxes, selectAllBox)
			},
			disselectAll: function(checkboxes, selectAllBox) {
				checkboxes.off('change')
				checkboxes.on('change', function() {
					var statusNow = $(this).prop('checked')
					if(statusNow === false) {
						selectAllBox.prop('checked', false)
					} else if(statusNow === true && $('.dep_checkbox:checked').length === components.equipment_manage.pageSize) {
						selectAllBox.prop('checked', true)
					}
				})
			}
		}
	}

	// 产品信息
	,
	goods_manage: {

		init: function() {
				/** 获取部门信息分页显示并展示 */
				components.goods_manage.funcs.renderTable()
			} //$init end$
			,
		pageSize: 0,
		funcs: {
			renderTable: function() {
					$.post(home.urls.goods.getAllByPage(), {
						page: 0
					}, function(result) {
						var goodses = result.data.content //获取数据
						const $tbody = $("#goods_table").children('tbody')
						components.goods_manage.funcs.renderHandler($tbody, goodses)
						components.goods_manage.pageSize = result.data.content.length

						var page = result.data
						/** @namespace page.totalPages 这是返回数据的总页码数 */
						layui.laypage.render({
							elem: 'goods_page',
							count: 10 * page.totalPages //数据总数
								,
							jump: function(obj, first) {
								$.post(home.urls.goods.getAllByPage(), {
									page: obj.curr - 1,
									size: obj.limit
								}, function(result) {
									var goodses = result.data.content //获取数据
									const $tbody = $("#goods_table").children('tbody')
									components.goods_manage.funcs.renderHandler($tbody, goodses)
									components.goods_manage.pageSize = result.data.content.length
								})
							}
						})
					})
					//$数据渲染完毕
					var addBtn = $("#model-li-hide-add-60")
					components.goods_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
					var refreshBtn = $('#model-li-hide-refresh-60')
					components.goods_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
					var searchBtn = $('#model-li-hide-search-60')
					components.goods_manage.funcs.bindSearchEventListener(searchBtn)
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
								"<p style='padding: 5px 0px 5px 0px;'>产品编码:<input type='text' id='code'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>产品名称:<input type='text' id='name'/></p>" +
								"</div>" +
								"</div>",
							area: ['350px', '180px'],
							btn: ['确认', '取消'],
							offset: ['40%', '45%'],
							yes: function(index) {
								var code = $('#code').val()
								var name = $('#name').val()
								$.post(home.urls.goods.add(), {
									code: code,
									name: name
								}, function(result) {
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.goods_manage.init()
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
								var goodsCode = _this.attr('id').substr(3)
								$.post(home.urls.goods.deleteByCode(), {
									code: goodsCode
								}, function(result) {
									console.log(result.message)
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.goods_manage.init()
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
						console.log('search')
						var goods_name = $('#goods_name_input').val()
						$.post(home.urls.goods.getAllByLikeNameByPage(), {
							name: goods_name
						}, function(result) {
							var page = result.data
							var goodses = result.data.content //获取数据
							const $tbody = $("#goods_table").children('tbody')
							components.goods_manage.funcs.renderHandler($tbody, goodses)
							layui.laypage.render({
								elem: 'goods_page',
								count: 10 * page.totalPages //数据总数
									,
								jump: function(obj, first) {
									$.post(home.urls.goods.getAllByLikeNameByPage(), {
										name: goods_name,
										page: obj.curr - 1,
										size: obj.limit
									}, function(result) {
										var goodses = result.data.content //获取数据
										const $tbody = $("#goods_table").children('tbody')
										components.goods_manage.funcs.renderHandler($tbody, goodses)
										components.goods_manage.pageSize = result.data.content.length
									})
									if(!first) {
										console.log('not first')
									}
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
						components.goods_manage.init()
						layer.close(index)
						clearTimeout(time)
					}, 200)
				})
			},
			bindSelectAll: function(selectAllBox) {
				selectAllBox.off('change')
				selectAllBox.on('change', function() {
					var status = selectAllBox.prop('checked')
					$('.dep_checkbox').each(function() {
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
								var goodsCodes = []
								$('.checkbox').each(function() {
									if($(this).prop('checked')) {
										goodsCodes.push({
											code: $(this).val()
										})
									}
								})
								$.ajax({
									url: home.urls.goods.deleteByBatchCode(),
									contentType: 'application/json',
									data: JSON.stringify(goodsCodes),
									dataType: 'json',
									type: 'post',
									success: function(result) {
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.goods_manage.init()
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
						var goodsCode = _selfBtn.attr('id').substr(5)
						$.post(home.urls.goods.getByCode(), {
							code: goodsCode
						}, function(result) {
							var goods = result.data
							layer.open({
								type: 1,
								title: '编辑',
								content: "<div id='addModal'>" +
									"<div style='text-align: center;padding-top: 10px;'>" +
									"<p style='padding: 5px 0px 5px 0px;'>产品编码:<input type='text' id='code' value='" + (goods.code) + "'/></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>产品名称:<input type='text' id='name' value='" + (goods.name) + "'/></p>" +
									"</div>" +
									"</div>",
								area: ['350px', '180px'],
								btn: ['确认', '取消'],
								offset: ['40%', '45%'],
								yes: function(index) {
									var code = $('#code').val()
									var name = $('#name').val()
									$.post(home.urls.goods.update(), {
										code: code,
										name: name
									}, function(result) {
										layer.msg(result.message, {
											offset: ['40%', '55%'],
											time: 700
										})
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.goods_manage.init()
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
			renderHandler: function($tbody, goodses) {
				$tbody.empty() //清空表格
				goodses.forEach(function(e) {
					$('#checkAll').prop('checked', false)
					$tbody.append(
						"<tr>" +
						"<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
						"<td>" + (e.code) + "</td>" +
						"<td>" + (e.name) + "</td>" +
						"<td><a href='#' class='editgoods' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
						"<td><a href='#' class='deletegoods' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
						"</tr>")
				}) //$数据渲染完毕
				var editBtns = $('.editgoods')
				var deleteBtns = $('.deletegoods')
				components.goods_manage.funcs.bindDeleteEventListener(deleteBtns)
				components.goods_manage.funcs.bindEditEventListener(editBtns)
				var selectAllBox = $('#checkAll')
				components.goods_manage.funcs.bindSelectAll(selectAllBox)
				var deleteBatchBtn = $('#model-li-hide-delete-60')
				components.goods_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
				var checkboxes = $('.checkbox')
				components.goods_manage.funcs.disselectAll(checkboxes, selectAllBox)
			},
			disselectAll: function(checkboxes, selectAllBox) {
				checkboxes.off('change')
				checkboxes.on('change', function() {
					var statusNow = $(this).prop('checked')
					if(statusNow === false) {
						selectAllBox.prop('checked', false)
					} else if(statusNow === true && $('.dep_checkbox:checked').length === components.goods_manage.pageSize) {
						selectAllBox.prop('checked', true)
					}
				})
			}
		}
	}

	// 物资信息
	,
	material_manage: {

		init: function() {
				/** 获取部门信息分页显示并展示 */
				components.material_manage.funcs.renderTable()
			} //$init end$
			,
		pageSize: 0,
		funcs: {
			renderTable: function() {
					$.post(home.urls.material.getAllByPage(), {
						page: 0
					}, function(result) {
						var materiales = result.data.content //获取数据
						const $tbody = $("#material_table").children('tbody')
						components.material_manage.funcs.renderHandler($tbody, materiales)
						components.material_manage.pageSize = result.data.content.length

						var page = result.data
						/** @namespace page.totalPages 这是返回数据的总页码数 */
						layui.laypage.render({
							elem: 'material_page',
							count: 10 * page.totalPages //数据总数
								,
							jump: function(obj, first) {
								$.post(home.urls.material.getAllByPage(), {
									page: obj.curr - 1,
									size: obj.limit
								}, function(result) {
									var materiales = result.data.content //获取数据
									const $tbody = $("#material_table").children('tbody')
									components.material_manage.funcs.renderHandler($tbody, materiales)
									components.material_manage.pageSize = result.data.content.length
								})
							}
						})
					})
					//$数据渲染完毕
					var addBtn = $("#model-li-hide-add-60")
					components.material_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
					var refreshBtn = $('#model-li-hide-refresh-60')
					components.material_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
					var searchBtn = $('#model-li-hide-search-60')
					components.material_manage.funcs.bindSearchEventListener(searchBtn)
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
								"<p style='padding: 5px 0px 5px 0px;'>物资编码:<input type='text' id='code'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>物资名称:<input type='text' id='name'/></p>" +
								"</div>" +
								"</div>",
							area: ['350px', '180px'],
							btn: ['确认', '取消'],
							offset: ['40%', '45%'],
							yes: function(index) {
								var code = $('#code').val()
								var name = $('#name').val()
								$.post(home.urls.material.add(), {
									code: code,
									name: name
								}, function(result) {
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.material_manage.init()
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
								var materialCode = _this.attr('id').substr(3)
								$.post(home.urls.material.deleteByCode(), {
									code: materialCode
								}, function(result) {
									console.log(result.message)
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.material_manage.init()
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
						console.log('search')
						var material_name = $('#material_name_input').val()
						$.post(home.urls.material.getAllByLikeNameByPage(), {
							name: material_name
						}, function(result) {
							var page = result.data
							var materiales = result.data.content //获取数据
							const $tbody = $("#material_table").children('tbody')
							components.material_manage.funcs.renderHandler($tbody, materiales)
							layui.laypage.render({
								elem: 'material_page',
								count: 10 * page.totalPages //数据总数
									,
								jump: function(obj, first) {
									$.post(home.urls.material.getAllByLikeNameByPage(), {
										name: material_name,
										page: obj.curr - 1,
										size: obj.limit
									}, function(result) {
										var materiales = result.data.content //获取数据
										const $tbody = $("#material_table").children('tbody')
										components.material_manage.funcs.renderHandler($tbody, materiales)
										components.material_manage.pageSize = result.data.content.length
									})
									if(!first) {
										console.log('not first')
									}
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
						components.material_manage.init()
						layer.close(index)
						clearTimeout(time)
					}, 200)
				})
			},
			bindSelectAll: function(selectAllBox) {
				selectAllBox.off('change')
				selectAllBox.on('change', function() {
					var status = selectAllBox.prop('checked')
					$('.dep_checkbox').each(function() {
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
								var materialCodes = []
								$('.checkbox').each(function() {
									if($(this).prop('checked')) {
										materialCodes.push({
											code: $(this).val()
										})
									}
								})
								$.ajax({
									url: home.urls.material.deleteByBatchCode(),
									contentType: 'application/json',
									data: JSON.stringify(materialCodes),
									dataType: 'json',
									type: 'post',
									success: function(result) {
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.material_manage.init()
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
						var materialCode = _selfBtn.attr('id').substr(5)
						$.post(home.urls.material.getByCode(), {
							code: materialCode
						}, function(result) {
							var material = result.data
							layer.open({
								type: 1,
								title: '编辑',
								content: "<div id='addModal'>" +
									"<div style='text-align: center;padding-top: 10px;'>" +
									"<p style='padding: 5px 0px 5px 0px;'>物资编码:<input type='text' id='code' value='" + (material.code) + "'/></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>物资名称:<input type='text' id='name' value='" + (material.name) + "'/></p>" +
									"</div>" +
									"</div>",
								area: ['350px', '180px'],
								btn: ['确认', '取消'],
								offset: ['40%', '45%'],
								yes: function(index) {
									var code = $('#code').val()
									var name = $('#name').val()
									$.post(home.urls.material.update(), {
										code: code,
										name: name
									}, function(result) {
										layer.msg(result.message, {
											offset: ['40%', '55%'],
											time: 700
										})
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.material_manage.init()
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
			renderHandler: function($tbody, materiales) {
				$tbody.empty() //清空表格
				materiales.forEach(function(e) {
					$('#checkAll').prop('checked', false)
					$tbody.append(
						"<tr>" +
						"<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
						"<td>" + (e.code) + "</td>" +
						"<td>" + (e.name) + "</td>" +
						"<td><a href='#' class='editmaterial' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
						"<td><a href='#' class='deletematerial' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
						"</tr>")
				}) //$数据渲染完毕
				var editBtns = $('.editmaterial')
				var deleteBtns = $('.deletematerial')
				components.material_manage.funcs.bindDeleteEventListener(deleteBtns)
				components.material_manage.funcs.bindEditEventListener(editBtns)
				var selectAllBox = $('#checkAll')
				components.material_manage.funcs.bindSelectAll(selectAllBox)
				var deleteBatchBtn = $('#model-li-hide-delete-60')
				components.material_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
				var checkboxes = $('.checkbox')
				components.material_manage.funcs.disselectAll(checkboxes, selectAllBox)
			},
			disselectAll: function(checkboxes, selectAllBox) {
				checkboxes.off('change')
				checkboxes.on('change', function() {
					var statusNow = $(this).prop('checked')
					if(statusNow === false) {
						selectAllBox.prop('checked', false)
					} else if(statusNow === true && $('.dep_checkbox:checked').length === components.material_manage.pageSize) {
						selectAllBox.prop('checked', true)
					}
				})
			}
		}
	}

	// 产品线信息
	,
	productline_manage: {

		init: function() {
				/** 获取部门信息分页显示并展示 */
				components.productline_manage.funcs.renderTable()
			} //$init end$
			,
		pageSize: 0,
		funcs: {
			renderTable: function() {
					$.post(home.urls.productline.getAllByPage(), {
						page: 0
					}, function(result) {
						var productlinees = result.data.content //获取数据
						const $tbody = $("#productline_table").children('tbody')
						components.productline_manage.funcs.renderHandler($tbody, productlinees)
						components.productline_manage.pageSize = result.data.content.length

						var page = result.data
						/** @namespace page.totalPages 这是返回数据的总页码数 */
						layui.laypage.render({
							elem: 'productline_page',
							count: 10 * page.totalPages //数据总数
								,
							jump: function(obj, first) {
								$.post(home.urls.productline.getAllByPage(), {
									page: obj.curr - 1,
									size: obj.limit
								}, function(result) {
									var productlinees = result.data.content //获取数据
									const $tbody = $("#productline_table").children('tbody')
									components.productline_manage.funcs.renderHandler($tbody, productlinees)
									components.productline_manage.pageSize = result.data.content.length
								})
							}
						})
					})
					//$数据渲染完毕
					var addBtn = $("#model-li-hide-add-60")
					components.productline_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
					var refreshBtn = $('#model-li-hide-refresh-60')
					components.productline_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
					var searchBtn = $('#model-li-hide-search-60')
					components.productline_manage.funcs.bindSearchEventListener(searchBtn)
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
								"<p style='padding: 5px 0px 5px 0px;'>产品线编码:<input type='text' id='code'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>产品线名称:<input type='text' id='name'/></p>" +
								"</div>" +
								"</div>",
							area: ['350px', '180px'],
							btn: ['确认', '取消'],
							offset: ['40%', '45%'],
							yes: function(index) {
								var code = $('#code').val()
								var name = $('#name').val()
								$.post(home.urls.productline.add(), {
									code: code,
									name: name
								}, function(result) {
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.productline_manage.init()
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
								var productlineCode = _this.attr('id').substr(3)
								$.post(home.urls.productline.deleteByCode(), {
									code: productlineCode
								}, function(result) {
									console.log(result.message)
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.productline_manage.init()
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
						console.log('search')
						var productline_name = $('#productline_name_input').val()
						$.post(home.urls.productline.getAllByLikeNameByPage(), {
							name: productline_name
						}, function(result) {
							var page = result.data
							var productlinees = result.data.content //获取数据
							const $tbody = $("#productline_table").children('tbody')
							components.productline_manage.funcs.renderHandler($tbody, productlinees)
							layui.laypage.render({
								elem: 'productline_page',
								count: 10 * page.totalPages //数据总数
									,
								jump: function(obj, first) {
									$.post(home.urls.productline.getAllByLikeNameByPage(), {
										name: productline_name,
										page: obj.curr - 1,
										size: obj.limit
									}, function(result) {
										var productlinees = result.data.content //获取数据
										const $tbody = $("#productline_table").children('tbody')
										components.productline_manage.funcs.renderHandler($tbody, productlinees)
										components.productline_manage.pageSize = result.data.content.length
									})
									if(!first) {
										console.log('not first')
									}
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
						components.productline_manage.init()
						layer.close(index)
						clearTimeout(time)
					}, 200)
				})
			},
			bindSelectAll: function(selectAllBox) {
				selectAllBox.off('change')
				selectAllBox.on('change', function() {
					var status = selectAllBox.prop('checked')
					$('.dep_checkbox').each(function() {
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
								var productlineCodes = []
								$('.checkbox').each(function() {
									if($(this).prop('checked')) {
										productlineCodes.push({
											code: $(this).val()
										})
									}
								})
								$.ajax({
									url: home.urls.productline.deleteByBatchCode(),
									contentType: 'application/json',
									data: JSON.stringify(productlineCodes),
									dataType: 'json',
									type: 'post',
									success: function(result) {
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.productline_manage.init()
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
						var productlineCode = _selfBtn.attr('id').substr(5)
						$.post(home.urls.productline.getByCode(), {
							code: productlineCode
						}, function(result) {
							var productline = result.data
							layer.open({
								type: 1,
								title: '编辑',
								content: "<div id='addModal'>" +
									"<div style='text-align: center;padding-top: 10px;'>" +
									"<p style='padding: 5px 0px 5px 0px;'>产品线编码:<input type='text' id='code' value='" + (productline.code) + "'/></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>产品线名称:<input type='text' id='name' value='" + (productline.name) + "'/></p>" +
									"</div>" +
									"</div>",
								area: ['350px', '180px'],
								btn: ['确认', '取消'],
								offset: ['40%', '45%'],
								yes: function(index) {
									var code = $('#code').val()
									var name = $('#name').val()
									$.post(home.urls.productline.update(), {
										code: code,
										name: name
									}, function(result) {
										layer.msg(result.message, {
											offset: ['40%', '55%'],
											time: 700
										})
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.productline_manage.init()
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
			renderHandler: function($tbody, productlinees) {
				$tbody.empty() //清空表格
				productlinees.forEach(function(e) {
					$('#checkAll').prop('checked', false)
					$tbody.append(
						"<tr>" +
						"<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
						"<td>" + (e.code) + "</td>" +
						"<td>" + (e.name) + "</td>" +
						"<td><a href='#' class='editproductline' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
						"<td><a href='#' class='deleteproductline' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
						"</tr>")
				}) //$数据渲染完毕
				var editBtns = $('.editproductline')
				var deleteBtns = $('.deleteproductline')
				components.productline_manage.funcs.bindDeleteEventListener(deleteBtns)
				components.productline_manage.funcs.bindEditEventListener(editBtns)
				var selectAllBox = $('#checkAll')
				components.productline_manage.funcs.bindSelectAll(selectAllBox)
				var deleteBatchBtn = $('#model-li-hide-delete-60')
				components.productline_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
				var checkboxes = $('.checkbox')
				components.productline_manage.funcs.disselectAll(checkboxes, selectAllBox)
			},
			disselectAll: function(checkboxes, selectAllBox) {
				checkboxes.off('change')
				checkboxes.on('change', function() {
					var statusNow = $(this).prop('checked')
					if(statusNow === false) {
						selectAllBox.prop('checked', false)
					} else if(statusNow === true && $('.dep_checkbox:checked').length === components.productline_manage.pageSize) {
						selectAllBox.prop('checked', true)
					}
				})
			}
		}
	}

	// 原料厂家信息
	,
	manufacturer_manage: {

		init: function() {
				/** 获取部门信息分页显示并展示 */
				components.manufacturer_manage.funcs.renderTable()
			} //$init end$
			,
		pageSize: 0,
		funcs: {
			renderTable: function() {
					$.post(home.urls.manufacturer.getAllByPage(), {
						page: 0
					}, function(result) {
						var manufactureres = result.data.content //获取数据
						const $tbody = $("#manufacturer_table").children('tbody')
						components.manufacturer_manage.funcs.renderHandler($tbody, manufactureres)
						components.manufacturer_manage.pageSize = result.data.content.length

						var page = result.data
						/** @namespace page.totalPages 这是返回数据的总页码数 */
						layui.laypage.render({
							elem: 'manufacturer_page',
							count: 10 * page.totalPages //数据总数
								,
							jump: function(obj, first) {
								$.post(home.urls.manufacturer.getAllByPage(), {
									page: obj.curr - 1,
									size: obj.limit
								}, function(result) {
									var manufactureres = result.data.content //获取数据
									const $tbody = $("#manufacturer_table").children('tbody')
									components.manufacturer_manage.funcs.renderHandler($tbody, manufactureres)
									components.manufacturer_manage.pageSize = result.data.content.length
								})
							}
						})
					})
					//$数据渲染完毕
					var addBtn = $("#model-li-hide-add-60")
					components.manufacturer_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
					var refreshBtn = $('#model-li-hide-refresh-60')
					components.manufacturer_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
					var searchBtn = $('#model-li-hide-search-60')
					components.manufacturer_manage.funcs.bindSearchEventListener(searchBtn)
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
								"<p style='padding: 5px 0px 5px 0px;'>原料厂家编码:<input type='text' id='code'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>原料厂家名称:<input type='text' id='name'/></p>" +
								"<p style='padding: 5px 0px 5px 0px;'>厂家联系方式:<input type='text' id='contact'/></p>" +
								"</div>" +
								"</div>",
							area: ['350px', '200px'],
							btn: ['确认', '取消'],
							offset: ['40%', '45%'],
							yes: function(index) {
								var code = $('#code').val()
								var name = $('#name').val()
								var contact = $('#contact').val()
								$.post(home.urls.manufacturer.add(), {
									code: code,
									name: name,
									contact: contact
								}, function(result) {
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.manufacturer_manage.init()
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
								var manufacturerCode = _this.attr('id').substr(3)
								$.post(home.urls.manufacturer.deleteByCode(), {
									code: manufacturerCode
								}, function(result) {
									console.log(result.message)
									layer.msg(result.message, {
										offset: ['40%', '55%'],
										time: 700
									})
									if(result.code === 0) {
										var time = setTimeout(function() {
											components.manufacturer_manage.init()
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
						console.log('search')
						var manufacturer_name = $('#manufacturer_name_input').val()
						$.post(home.urls.manufacturer.getAllByLikeNameByPage(), {
							name: manufacturer_name
						}, function(result) {
							var page = result.data
							var manufactureres = result.data.content //获取数据
							const $tbody = $("#manufacturer_table").children('tbody')
							components.manufacturer_manage.funcs.renderHandler($tbody, manufactureres)
							layui.laypage.render({
								elem: 'manufacturer_page',
								count: 10 * page.totalPages //数据总数
									,
								jump: function(obj, first) {
									$.post(home.urls.manufacturer.getAllByLikeNameByPage(), {
										name: manufacturer_name,
										page: obj.curr - 1,
										size: obj.limit
									}, function(result) {
										var manufactureres = result.data.content //获取数据
										const $tbody = $("#manufacturer_table").children('tbody')
										components.manufacturer_manage.funcs.renderHandler($tbody, manufactureres)
										components.manufacturer_manage.pageSize = result.data.content.length
									})
									if(!first) {
										console.log('not first')
									}
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
						components.manufacturer_manage.init()
						layer.close(index)
						clearTimeout(time)
					}, 200)
				})
			},
			bindSelectAll: function(selectAllBox) {
				selectAllBox.off('change')
				selectAllBox.on('change', function() {
					var status = selectAllBox.prop('checked')
					$('.dep_checkbox').each(function() {
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
								var manufacturerCodes = []
								$('.checkbox').each(function() {
									if($(this).prop('checked')) {
										manufacturerCodes.push({
											code: $(this).val()
										})
									}
								})
								$.ajax({
									url: home.urls.manufacturer.deleteByBatchCode(),
									contentType: 'application/json',
									data: JSON.stringify(manufacturerCodes),
									dataType: 'json',
									type: 'post',
									success: function(result) {
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.manufacturer_manage.init()
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
						var manufacturerCode = _selfBtn.attr('id').substr(5)
						$.post(home.urls.manufacturer.getByCode(), {
							code: manufacturerCode
						}, function(result) {
							var manufacturer = result.data
							layer.open({
								type: 1,
								title: '编辑',
								content: "<div id='addModal'>" +
									"<div style='text-align: center;padding-top: 10px;'>" +
									"<p style='padding: 5px 0px 5px 0px;'>原料厂家编码:<input type='text' id='code' value='" + (manufacturer.code) + "'/></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>原料厂家名称:<input type='text' id='name' value='" + (manufacturer.name) + "'/></p>" +
									"<p style='padding: 5px 0px 5px 0px;'>厂家联系方式:<input type='text' id='contact' value='" + (manufacturer.contact) + "'/></p>" +
									"</div>" +
									"</div>",
								area: ['350px', '200px'],
								btn: ['确认', '取消'],
								offset: ['40%', '45%'],
								yes: function(index) {
									var code = $('#code').val()
									var name = $('#name').val()
									var contact = $('#contact').val()
									$.post(home.urls.manufacturer.update(), {
										code: code,
										name: name,
										contact: contact
									}, function(result) {
										layer.msg(result.message, {
											offset: ['40%', '55%'],
											time: 700
										})
										if(result.code === 0) {
											var time = setTimeout(function() {
												components.manufacturer_manage.init()
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
			renderHandler: function($tbody, manufactureres) {
				$tbody.empty() //清空表格
				manufactureres.forEach(function(e) {
					$('#checkAll').prop('checked', false)
					$tbody.append(
						"<tr>" +
						"<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
						"<td>" + (e.code) + "</td>" +
						"<td>" + (e.name) + "</td>" +
						"<td>" + (e.contact) + "</td>" +
						"<td><a href='#' class='editmanufacturer' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
						"<td><a href='#' class='deletemanufacturer' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
						"</tr>")
				}) //$数据渲染完毕
				var editBtns = $('.editmanufacturer')
				var deleteBtns = $('.deletemanufacturer')
				components.manufacturer_manage.funcs.bindDeleteEventListener(deleteBtns)
				components.manufacturer_manage.funcs.bindEditEventListener(editBtns)
				var selectAllBox = $('#checkAll')
				components.manufacturer_manage.funcs.bindSelectAll(selectAllBox)
				var deleteBatchBtn = $('#model-li-hide-delete-60')
				components.manufacturer_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
				var checkboxes = $('.checkbox')
				components.manufacturer_manage.funcs.disselectAll(checkboxes, selectAllBox)
			},
			disselectAll: function(checkboxes, selectAllBox) {
				checkboxes.off('change')
				checkboxes.on('change', function() {
					var statusNow = $(this).prop('checked')
					if(statusNow === false) {
						selectAllBox.prop('checked', false)
					} else if(statusNow === true && $('.dep_checkbox:checked').length === components.manufacturer_manage.pageSize) {
						selectAllBox.prop('checked', true)
					}
				})
			}
		}
	}
}