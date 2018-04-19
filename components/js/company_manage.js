var company_manage = {
    init: function () {
        /** 获取部门信息分页显示并展示 */
        company_manage.funcs.renderTable()
        var out = $('#company_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#company_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    } //$init end$
    ,
    pageSize: 0,
    funcs: {
        renderTable: function () {
            $.post(home.urls.company.getAllByPage(), {
                page: 0
            }, function (result) {
                var companyes = result.data.content //获取数据
                const $tbody = $("#company_table").children('tbody')
                company_manage.funcs.renderHandler($tbody, companyes)
                company_manage.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'company_page',
                    count: 10 * page.totalPages //数据总数
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.company.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var companyes = result.data.content //获取数据
                                const $tbody = $("#company_table").children('tbody')
                                company_manage.funcs.renderHandler($tbody, companyes)
                                company_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })
            //$数据渲染完毕
            var addBtn = $("#model-li-hide-add-60")
            company_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-60')
            company_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
            var searchBtn = $('#model-li-hide-search-60')
            company_manage.funcs.bindSearchEventListener(searchBtn)
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
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公司编号:<input type='text' id='code'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公司名称:<input type='text' id='name'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>统一社会信用代码:<input type='text' id='cocode'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公司地址:<input type='text' id='coaddress'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系人:<input type='text' id='cokeeper'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话:<input type='text' id='cophone'/></p>" +
                    "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公司类型:<input type='text' id='cotype'/></p>" +
                    "</div>" +
                    "</div>",
                    area: ['350px', '320px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var code = $('#code').val()
                        var name = $('#name').val()
                        var cocode = $('#cocode').val()
                        var coaddress = $('#coaddress').val()
                        var cokeeper = $('#cokeeper').val()
                        var cophone = $('#cophone').val()
                        var cotype = $('#cotype').val()
                        $.post(home.urls.company.add(), {
                            code: code,
                            name: name,
                            cocode: cocode,
                            coaddress: coaddress,
                            cokeeper: cokeeper,
                            cophone: cophone,
                            cotype: cotype
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    company_manage.init()
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
                        var companyCode = _this.attr('id').substr(3)
                        $.post(home.urls.company.deleteByCode(), {
                            code: companyCode
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    company_manage.init()
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
                $.post(home.urls.company.getAllByLikeNameByPage(), {
                    name: company_name
                }, function (result) {
                    var page = result.data
                    var companyes = result.data.content //获取数据
                    const $tbody = $("#company_table").children('tbody')
                    company_manage.funcs.renderHandler($tbody, companyes)
                    layui.laypage.render({
                        elem: 'company_page',
                        count: 10 * page.totalPages //数据总数
                        ,
                        jump: function (obj, first) {
                            if(!first) {
                                $.post(home.urls.company.getAllByLikeNameByPage(), {
                                    name: company_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var companyes = result.data.content //获取数据
                                    const $tbody = $("#company_table").children('tbody')
                                    company_manage.funcs.renderHandler($tbody, companyes)
                                    company_manage.pageSize = result.data.content.length
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
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    company_manage.init()
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
                            $.ajax({
                                url: home.urls.company.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(companyCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            company_manage.init()
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
                var companyCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.company.getByCode(), {
                    code: companyCode
                }, function (result) {
                    var company = result.data
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公司编号:<input type='text' id='code' value='" + (company.code) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公司名称:<input type='text' id='name' value='" + (company.name) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>统一社会信用代码:<input type='text' id='cocode' value='" + (company.cocode) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公司地址:<input type='text' id='coaddress' value='" + (company.coaddress) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系人:<input type='text' id='cokeeper' value='" + (company.cokeeper) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系电话:<input type='text' id='cophone' value='" + (company.cophone) + "'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;公司类型:<input type='text' id='cotype' value='" + (company.cotype) + "'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '320px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            var code = $('#code').val()
                            var name = $('#name').val()
                            var cocode = $('#cocode').val()
                            var coaddress = $('#coaddress').val()
                            var cokeeper = $('#cokeeper').val()
                            var cophone = $('#cophone').val()
                            var cotype = $('#cotype').val()
                            $.post(home.urls.company.update(), {
                                code: code,
                                name: name,
                                cocode: cocode,
                                coaddress: coaddress,
                                cokeeper: cokeeper,
                                cophone: cophone,
                                cotype: cotype
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        company_manage.init()
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
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.cocode) + "</td>" +
                    "<td>" + (e.coaddress) + "</td>" +
                    "<td>" + (e.cokeeper) + "</td>" +
                    "<td>" + (e.cophone) + "</td>" +
                    "<td>" + (e.cotype) + "</td>" +
                    "<td><a href='#' class='editcompany' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deletecompany' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            }) //$数据渲染完毕
            var editBtns = $('.editcompany')
            var deleteBtns = $('.deletecompany')
            company_manage.funcs.bindDeleteEventListener(deleteBtns)
            company_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#checkAll')
            company_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-60')
            company_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var checkboxes = $('.checkbox')
            company_manage.funcs.disselectAll(checkboxes, selectAllBox)
        },
        disselectAll: function (checkboxes, selectAllBox) {
            checkboxes.off('change')
            checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                console.log(this)
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.checkbox:checked').length === company_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}