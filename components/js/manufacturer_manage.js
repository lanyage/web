// 原料厂家
var manufacturer_manage = {

    init: function () {
        /** 获取部门信息分页显示并展示 */
        manufacturer_manage.funcs.renderTable()
        $("#manufacturer_name_input").empty()
        $.get(servers.backup()+'workshop/getAll',{},function(result){
            var res = result.data
            $("#manufacturer_name_input").html("<option value='-1'>请选择原料厂家名称</option>")
            res.forEach(function(e){
                $("#manufacturer_name_input").append("<option value="+e.name+">"+e.name+"</option>")
            })
        })
    }
    ,
    pageSize: 0,
    funcs: {
        renderTable: function () {
            $.post(home.urls.manufacturer.getAllByPage(), {
                page: 0
            }, function (result) {
                var manufactureres = result.data.content //获取数据
                const $tbody = $("#manufacturer_table").children('tbody')
                manufacturer_manage.funcs.renderHandler($tbody, manufactureres)
                manufacturer_manage.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'manufacturer_page',
                    count: 10 * page.totalPages //数据总数
                    ,
                    jump: function (obj, first) {
                        if(!first) {
                            $.post(home.urls.manufacturer.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var manufactureres = result.data.content //获取数据
                                const $tbody = $("#manufacturer_table").children('tbody')
                                manufacturer_manage.funcs.renderHandler($tbody, manufactureres)
                                manufacturer_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#manufacturer_page').css('padding-left','37%')
            })
            //$数据渲染完毕
            var addBtn = $("#model-li-hide-add-60")
            manufacturer_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-60')
            manufacturer_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
            var searchBtn = $('#model-li-hide-search-60')
            manufacturer_manage.funcs.bindSearchEventListener(searchBtn)
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
                    "<p style='padding: 5px 0px 5px 0px;'>原料厂家编码:<input type='text' id='code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>原料厂家名称:<input type='text' id='name'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>厂家联系方式:<input type='text' id='contact'/></p>" +
                    "</div>" +
                    "</div>",
                    area: ['350px', '200px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var code = $('#code').val()
                        var name = $('#name').val()
                        var contact = $('#contact').val()
                        $.post(home.urls.manufacturer.add(), {
                            code: code,
                            name: name,
                            contact: contact
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    manufacturer_manage.init()
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
                        var manufacturerCode = _this.attr('id').substr(3)
                        $.post(home.urls.manufacturer.deleteByCode(), {
                            code: manufacturerCode
                        }, function (result) {
                            console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    manufacturer_manage.init()
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
                console.log('search')
                var manufacturer_name = $('#manufacturer_name_input').val()
                $.post(home.urls.manufacturer.getAllByLikeNameByPage(), {
                    name: manufacturer_name
                }, function (result) {
                    var page = result.data
                    var manufactureres = result.data.content //获取数据
                    const $tbody = $("#manufacturer_table").children('tbody')
                    manufacturer_manage.funcs.renderHandler($tbody, manufactureres)
                    layui.laypage.render({
                        elem: 'manufacturer_page',
                        count: 10 * page.totalPages //数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.manufacturer.getAllByLikeNameByPage(), {
                                    name: manufacturer_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var manufactureres = result.data.content //获取数据
                                    const $tbody = $("#manufacturer_table").children('tbody')
                                    manufacturer_manage.funcs.renderHandler($tbody, manufactureres)
                                    manufacturer_manage.pageSize = result.data.content.length
                                })
                                if (!first) {
                                    console.log('not first')
                                }
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
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    manufacturer_manage.init()
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
                            var manufacturerCodes = []
                            $('.checkbox').each(function () {
                                if ($(this).prop('checked')) {
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
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            manufacturer_manage.init()
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
                var manufacturerCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.manufacturer.getByCode(), {
                    code: manufacturerCode
                }, function (result) {
                    var manufacturer = result.data
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>原料厂家编码:<input type='text' disabled='true' id='code' value='" + (manufacturer.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>原料厂家名称:<input type='text' id='name' value='" + (manufacturer.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>厂家联系方式:<input type='text' id='contact' value='" + (manufacturer.contact) + "'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '200px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#code').val()
                            var name = $('#name').val()
                            var contact = $('#contact').val()
                            $.post(home.urls.manufacturer.update(), {
                                code: code,
                                name: name,
                                contact: contact
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        manufacturer_manage.init()
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
        renderHandler: function ($tbody, manufactureres) {
            $tbody.empty() //清空表格
            manufactureres.forEach(function (e) {
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
            manufacturer_manage.funcs.bindDeleteEventListener(deleteBtns)
            manufacturer_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#checkAll')
            manufacturer_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-60')
            manufacturer_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var checkboxes = $('.checkbox')
            manufacturer_manage.funcs.disselectAll(checkboxes, selectAllBox)
        },
        disselectAll: function (checkboxes, selectAllBox) {
            checkboxes.off('change')
            checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.checkbox:checked').length === manufacturer_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}