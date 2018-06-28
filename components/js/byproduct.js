// 副产品信息
var byproduct = {
    init: function () {
        /** 获取部门信息分页显示并展示 */
        byproduct.funcs.renderTable()
    } //$init end$
    , pageSize: 0
    , funcs: {
        renderTable: function () {
            $.post(home.urls.byproduct.getAllByPage(), {
                page: 0
            }, function (result) {
                var byproductes = result.data.content //获取数据
                const $tbody = $("#byproduct_table").children('tbody')
                byproduct.funcs.renderHandler($tbody, byproductes)
                byproduct.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'byproduct_page',
                    count: 10 * page.totalPages //数据总数
                    , jump: function (obj, first) {
                        if(!first) {
                            $.post(home.urls.byproduct.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var byproductes = result.data.content //获取数据
                                const $tbody = $("#byproduct_table").children('tbody')
                                byproduct.funcs.renderHandler($tbody, byproductes)
                                byproduct.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#byproduct_page').css('padding-left','37%')
            })
            //$数据渲染完毕
            var addBtn = $("#model-li-hide-add-139")
            byproduct.funcs.bindAddEventListener(addBtn) 
            //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-139')
            byproduct.funcs.bindRefreshEventLisener(refreshBtn) 
            //追加刷新事件
            var searchBtn = $('#model-li-hide-search-139')
            byproduct.funcs.bindSearchEventListener(searchBtn)
        }

        ,
        bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
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
                    yes: function (index) {
                        var code = $('#code').val()
                        var name = $('#name').val()
                        $.post(home.urls.byproduct.add(), {
                            code: code,
                            name: name
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    byproduct.init()
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
        } 

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
                        var byproductCode = _this.attr('id').substr(3)
                        $.post(home.urls.byproduct.deleteByCode(), {
                            code: byproductCode
                        }, function (result) {
                            console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    byproduct.init()
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
        }
        ,
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var byproduct_name = $('#byproduct_name_input').val()
                $.post(home.urls.byproduct.getAllByLikeNameByPage(), {
                    name: byproduct_name
                }, function (result) {
                    var page = result.data
                    var byproductes = result.data.content //获取数据
                    const $tbody = $("#byproduct_table").children('tbody')
                    byproduct.funcs.renderHandler($tbody, byproductes)
                    layui.laypage.render({
                        elem: 'byproduct_page',
                        count: 10 * page.totalPages //数据总数
                        ,jump: function (obj, first) {
                            $.post(home.urls.byproduct.getAllByLikeNameByPage(), {
                                name: byproduct_name,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var byproductes = result.data.content //获取数据
                                const $tbody = $("#byproduct_table").children('tbody')
                                byproduct.funcs.renderHandler($tbody, byproductes)
                                byproduct.pageSize = result.data.content.length
                            })
                            if (!first) {
                                console.log('not first')
                            }
                        }
                    })
                })
            })
        } 
        ,
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
                    byproduct.init()
                    $('#byproduct_name_input').val('')
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
                            var byproductCodes = []
                            $('.checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    byproductCodes.push({
                                        code: $(this).val()
                                    })
                                }
                            })
                            $.ajax({
                                url: home.urls.byproduct.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(byproductCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            byproduct.init()
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
                var byproductCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.byproduct.getByCode(), {
                    code: byproductCode
                }, function (result) {
                    var byproduct1 = result.data
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>产品编码:<input type='text' id='code' value='" + (byproduct1.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>产品名称:<input type='text' id='name' value='" + (byproduct1.name) + "'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '180px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#code').val()
                            var name = $('#name').val()
                            $.post(home.urls.byproduct.update(), {
                                code: code,
                                name: name
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        byproduct.init()
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
        } 
        ,
        renderHandler: function ($tbody, byproductes) {
            $tbody.empty() //清空表格
            byproductes.forEach(function (e) {
                $('#checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td><a href='#' class='editbyproduct' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deletebyproduct' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            }) //$数据渲染完毕
            var editBtns = $('.editbyproduct')
            var deleteBtns = $('.deletebyproduct')
            byproduct.funcs.bindDeleteEventListener(deleteBtns)
            byproduct.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#checkAll')
            byproduct.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-139')
            byproduct.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var checkboxes = $('.checkbox')
            byproduct.funcs.disselectAll(checkboxes, selectAllBox)
        },
        disselectAll: function (checkboxes, selectAllBox) {
            checkboxes.off('change')
            checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.checkbox:checked').length === byproduct.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}