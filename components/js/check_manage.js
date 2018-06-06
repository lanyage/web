var check_manage = {
    init: function () {
        check_manage.funcs.renderTable()
    } //$init end$
    ,
    pageSize: 0,
    funcs: {
        renderTable: function () {
            $.post(home.urls.check.getAllByPage(), {
                page: 0
            }, function (result) {
                var checks = result.data.content //获取数据
                const $tbody = $("#checkprocess_table").children('tbody')
                check_manage.funcs.renderHandler($tbody, checks)
                check_manage.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'checkprocess_page',
                    count: 10 * page.totalPages //数据总数
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.check.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var checks = result.data.content //获取数据
                                const $tbody = $("#checkprocess_table").children('tbody')
                                check_manage.funcs.renderHandler($tbody, checks)
                                check_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#checkprocess_page').css('padding-left', '37%')
            })
            //$数据渲染完毕
            var addBtn = $("#model-li-hide-add-75")
            check_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-75')
            check_manage.funcs.bindRefreshEventLisener(refreshBtn) //追加刷新事件
            var searchBtn = $('#model-li-hide-search-75')
            check_manage.funcs.bindSearchEventListener(searchBtn)
        },

        bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                //首先就是弹出一个弹出框
                layer.open({
                    type: 1,
                    title: '添加',
                    content: "<div id='addModal'>" +
                    '<div style="text-align:center;padding-top:10px">' +
                    '<ul style="line-height:30px">' +
                    '<li>流程编码: &nbsp;<input type="text" id="chp_code"></li>' +
                    '<li>编码名称: &nbsp;<input type="text" id="chp_name" ></li>' +
                    '<li>流程类型: &nbsp;<input type="text" id="process_code" placeholder="0代表紧急,1代表正常"></li>' +
                    '<li>负责人1:&nbsp;&nbsp;&nbsp;<input type="text"id="chp_leader1code" placeholder="负责人工号"></li>' +
                    '<li>负责人2:&nbsp;&nbsp;&nbsp;<input type="text"id="chp_leader2code" placeholder="负责人工号"></li>' +
                    '<li>负责人3:&nbsp;&nbsp;&nbsp;<input type="text"id="chp_leader3code" placeholder="负责人工号"></li>' +
                    '<li>负责人4:&nbsp;&nbsp;&nbsp;<input type="text"id="chp_leader4code" placeholder="负责人工号"></li>' +
                    '<li>负责人5:&nbsp;&nbsp;&nbsp;<input type="text"id="chp_leader5code" placeholder="负责人工号"></li>' +
                    '</ul>' +
                    '</div>' +
                    "</div>",
                    area: ['400px', '380px'],
                    btn: ['确认', '取消'],
                    offset: 'auto',
                    yes: function (index) {
                        var code = $('#chp_code').val()
                        var name = $('#chp_name').val()
                        var processcode = $('#process_code').val()
                        var leader1code = $('#chp_leader1code').val()
                        var leader2code = $('#chp_leader2code').val()
                        var leader3code = $('#chp_leader3code').val()
                        var leader4code = $('#chp_leader4code').val()
                        var leader5code = $('#chp_leader5code').val()
                        // console.log('leader1code', leader1code)
                        // console.log('leader2code', leader2code)
                        // console.log('leader3code', leader3code)
                        // console.log('leader4code', leader4code)
                        // console.log('leader5code', leader5code)
                        $.post(home.urls.check.add(), {
                            code: code,
                            name: name,
                            'leader1.code': leader1code,
                            'leader2.code': leader2code,
                            'leader3.code': leader3code,
                            'leader4.code': leader4code,
                            'leader5.code': leader5code,
                            'process.code': processcode,
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    check_manage.init()
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
                        var checkprocessCode = _this.attr('id').substr(3)
                        $.post(home.urls.check.deleteByCode(), {
                            code: checkprocessCode
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    check_manage.init()
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
                var checkprocess_name = $('#checkprocess_name_input').val()
                $.post(home.urls.check.getAllByLikeNameByPage(), {
                    name: checkprocess_name
                }, function (result) {
                    var page = result.data
                    var checks = result.data.content //获取数据
                    const $tbody = $("#checkprocess_table").children('tbody')
                    check_manage.funcs.renderHandler($tbody, checks)
                    layui.laypage.render({
                        elem: 'checkprocess_page',
                        count: 10 * page.totalPages //数据总数
                        ,
                        jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.check.getAllByLikeNameByPage(), {
                                    name: checkprocess_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var checks = result.data.content //获取数据
                                    const $tbody = $("#checkprocess_table").children('tbody')
                                    check_manage.funcs.renderHandler($tbody, checks)
                                    check_manage.pageSize = result.data.content.length
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
                    check_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },


        bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.chp_checkbox:checked').length === 0) {
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
                            var checkprocessCodes = []
                            $('chp_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    checkprocessCodes.push({
                                        code: $(this).val()
                                    })
                                }
                            })
                            $.ajax({
                                url: home.urls.check.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(checkprocessCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            check_manage.init()
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
                var checkprocessCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.check.getByCode(), {
                    code: checkprocessCode
                }, function (result) {
                    var check = result.data
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: "<div id='addModal'>" +
                        '<div style="text-align:center;padding-top:10px">' +
                        '<ul style="line-height:30px" >' +
                        '<li>流程编码: &nbsp;<input type="text"id="chp_code" value="' + (check.code) + '"></li>' +
                        '<li>编码名称: &nbsp;<input type="text"id="chp_name" value="' + (check.name) + '"></li>' +
                        '<li>流程类型: &nbsp;<input type="text"id="process_code" value="' + (check.process != null ? check.process.code : '') + '"></li>' +
                        '<li>负责人1:&nbsp;&nbsp;&nbsp;<input type="text" id="chp_leader1code" value="' + (check.leader1 != null ? check.leader1.code : '') + '"/></li>' +
                        '<li>负责人2:&nbsp;&nbsp;&nbsp;<input type="text" id="chp_leader2code" value="' + (check.leader2 != null ? check.leader2.code : '') + '"/></li>' +
                        '<li>负责人3:&nbsp;&nbsp;&nbsp;<input type="text" id="chp_leader3code" value="' + (check.leader3 != null ? check.leader3.code : '') + '"/></li>' +
                        '<li>负责人4:&nbsp;&nbsp;&nbsp;<input type="text" id="chp_leader4code" value="' + (check.leader4 != null ? check.leader4.code : '') + '"/></li>' +
                        '<li>负责人5:&nbsp;&nbsp;&nbsp;<input type="text" id="chp_leader5code" value="' + (check.leader5 != null ? check.leader5.code : '') + '"/></li>' +
                        '</ul>' +
                        '</div>' +
                        "</div>",
                        area: ['400px', '380px'],
                        btn: ['确认', '取消'],
                        offset: 'auto',
                        yes: function (index) {
                            var code = $('#chp_code').val()
                            var name = $('#process_code').val()
                            var processcode = $('#process_code').val()
                            var leader1code = $('#chp_leader1code').val()
                            var leader2code = $('#chp_leader2code').val()
                            var leader3code = $('#chp_leader3code').val()
                            var leader4code = $('#chp_leader4code').val()
                            var leader5code = $('#chp_leader5code').val()

                            console.log('leader1code', leader1code)
                            console.log('leader2code', leader2code)
                            console.log('leader3code', leader3code)
                            console.log('leader4code', leader4code)
                            console.log('leader5code', leader5code)
                            $.post(home.urls.check.update(), {
                                code: code,
                                name: name,
                                'leader1.code': leader1code,
                                'leader2.code': leader2code,
                                'leader3.code': leader3code,
                                'leader4.code': leader4code,
                                'leader5.code': leader5code,
                                'process.code': processcode
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        check_manage.init()
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
        }, //$ bindEditEventListener——end$

        renderHandler: function ($tbody, checks) {
            $tbody.empty() //清空表格
            console.log(checks)
            checks.forEach(function (e) {
                $('#check_checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='chp_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.process != null ? e.process.code : '') + "</td>" +
                    "<td>" + (e.leader1 != null ? e.leader1.name : '') + "</td>" +
                    "<td>" + (e.leader2 != null ? e.leader2.name : '') + "</td>" +
                    "<td>" + (e.leader3 != null ? e.leader3.name : '') + "</td>" +
                    "<td>" + (e.leader4 != null ? e.leader4.name : '') + "</td>" +
                    "<td>" + (e.leader5 != null ? e.leader5.name : '') + "</td>" +
                    "<td><a href='#' class='editcheckprocess' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deletecheckprocess' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            }) //$数据渲染完毕
            var editBtns = $('.editcheckprocess')
            var deleteBtns = $('.deletecheckprocess')
            check_manage.funcs.bindDeleteEventListener(deleteBtns)
            check_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#check_checkAll')
            check_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-75')
            check_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var checkboxes = $('.chp_checkbox')
            check_manage.funcs.disselectAll(checkboxes, selectAllBox)
        },


        bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.chp_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        },


        disselectAll: function (checkboxes, selectAllBox) {
            checkboxes.off('change')
            checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.chp_checkbox:checked').length === check_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }


    }
}