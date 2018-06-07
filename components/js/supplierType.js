var supplierType = {
    init: function () {
        /** 获取部门信息分页显示并展示 */
        supplierType.funcs.renderTable()
    } //$init end$
    ,
    pageSize: 0,
    funcs: {
        renderTable: function () {
            $.post(servers.backup() + 'supplierType/getAllByPage', {
                page: 0
            }, function (result) {
                var supplierTypes = result.data.content //获取数据
                const $tbody = $("#company_table").children('tbody')
                supplierType.funcs.renderHandler($tbody, supplierTypes)
                supplierType.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'company_page',
                    count: 10 * page.totalPages //数据总数
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(servers.backup() + 'supplierType/getAllByPage', {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var supplierTypes = result.data.content //获取数据
                                const $tbody = $("#company_table").children('tbody')
                                supplierType.funcs.renderHandler($tbody, supplierTypes)
                                supplierType.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#company_page').css('padding-left', '37%')
            })
            //$数据渲染完毕
            var addBtn = $("#model-li-hide-add-116")
            supplierType.funcs.bindAddEventListener(addBtn) //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-116')
            supplierType.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
            var searchBtn = $('#model-li-hide-search-116')
            supplierType.funcs.bindSearchEventListener(searchBtn)
        }

        , bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                //首先就是弹出一个弹出框
                layer.open({
                    type: 1,
                    title: '添加',
                    content: "<div id='addModal'>" +
                    "<div style='text-align: center;padding-top: 10px;'>" +
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;类型编号:<input type='text' id='code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;类型名称:<input type='text' id='type'/></p>" +
                    "</div>" +
                    "</div>",
                    area: ['280px', '180px'],
                    btn: ['确认', '取消'],
                    offset: 'auto',
                    yes: function (index) {
                        var code = $('#code').val()
                        var type = $('#type').val()
                        $.post(servers.backup() + 'supplierType/add', {
                            code: code,
                            type: type,
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    supplierType.init()
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
        } //$ bindAddEventListener——end$

        ,
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
                        var code = _this.attr('id').substr(3)
                        $.post(servers.backup() + 'supplierType/deleteByCode', {
                            code: code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    supplierType.init()
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
        } //$ bindDeleteEventListener_end$
        ,
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var company_name = $('#company_name_input').val()
                $.post(servers.backup() + 'supplierType/getAllByLikeNameByPage', {
                    name: company_name
                }, function (result) {
                    var page = result.data
                    var companyes = result.data.content //获取数据
                    const $tbody = $("#company_table").children('tbody')
                    supplierType.funcs.renderHandler($tbody, companyes)
                    layui.laypage.render({
                        elem: 'company_page',
                        count: 10 * page.totalPages //数据总数
                        ,
                        jump: function (obj, first) {
                            if(!first) {
                                $.post(servers.backup() + 'supplierType/getAllByLikeNameByPage', {
                                    name: company_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var companyes = result.data.content //获取数据
                                    const $tbody = $("#company_table").children('tbody')
                                    supplierType.funcs.renderHandler($tbody, companyes)
                                    supplierType.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$
        ,
        bindRefreshEventLisener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {
                    offset: ['40%', '58%']
                });
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: 'auto',
                        time: 700,
                    })
                    supplierType.init()
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
                            var companyCodes = []
                            $('.checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    companyCodes.push({
                                        code: $(this).val()
                                    })
                                }
                            })
                            console.log(companyCodes)
                            $.ajax({
                                url: servers.backup() + 'supplierType/deleteByBatchCode',
                                contentType: 'application/json',
                                data: JSON.stringify(companyCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            supplierType.init()
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
                var typeCode = _selfBtn.attr('id').substr(5)
                $.post(servers.backup() + 'supplierType/getByCode', {
                    code: typeCode
                }, function (result) {
                    var supplyType = result.data
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;类型编号:<input type='text' id='code' value='" + (supplyType.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;类型名称:<input type='text' id='type' value='" + (supplyType.type) + "'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['280px', '180px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#code').val()
                            var type = $('#type').val()
                            $.post(servers.backup() + 'supplierType/update', {
                                code: code,
                                type: type,
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        supplierType.init()
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
        } //$ bindEditEventListener——end$
        ,
        renderHandler: function ($tbody, companyes) {
            $tbody.empty() //清空表格
            companyes.forEach(function (e) {
                $('#checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.type) + "</td>" +
                    "<td><a href='#' class='editcompany' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deletecompany' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            }) //$数据渲染完毕
            var editBtns = $('.editcompany')
            var deleteBtns = $('.deletecompany')
            supplierType.funcs.bindDeleteEventListener(deleteBtns)
            supplierType.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#checkAll')
            supplierType.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-116')
            supplierType.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var checkboxes = $('.checkbox')
            supplierType.funcs.disselectAll(checkboxes, selectAllBox)
        },
        disselectAll: function (checkboxes, selectAllBox) {
            checkboxes.off('change')
            checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.checkbox:checked').length === supplierType.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}