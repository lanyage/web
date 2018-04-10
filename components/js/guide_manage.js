var guide_manage = {
    init: function () {
        /** 获取部门信息分页显示并展示 */
        guide_manage.funcs.renderTable()
        var out = $('#guide_page').width()
        var time = setTimeout(function () {
                var inside = $('.layui-laypage').width()
                $('#guide_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
                clearTimeout(time)
            }//$init end$50
        )
    }//$init end$
    , pageSize: 0
    , funcs: {
        renderTable: function () {
            $.post(home.urls.guideHeader.getAllByPage(), {page: 0}, function (result) {
                var guides = result.data.content //获取数据
                const $tbody = $("#guide_table").children('tbody')
                guide_manage.funcs.renderHandler($tbody, guides)
                guide_manage.pageSize = result.data.content.length
                var page = result.data

                layui.laypage.render({
                    elem: 'guide_page'
                    , count: 10 * page.totalPages
                    , jump: function (obj, first) {
                        if(!first) {
                            $.post(home.urls.guideHeader.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var guides = result.data.content //获取数据
                                const $tbody = $("#guide_table").children('tbody')
                                guide_manage.funcs.renderHandler($tbody, guides)
                                guide_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })//$数据渲染完毕


            var addBtn = $("#model-li-hide-add-43")
            guide_manage.funcs.bindAddEventListener(addBtn) //追加增加事件

            var refreshBtn = $('#model-li-hide-refresh-43')
            guide_manage.funcs.bindRefreshEventListener(refreshBtn)//追加刷新事件

            var searchBtn = $('#model-li-hide-search-43')
            guide_manage.funcs.bindSearchEventListener(searchBtn)

        }


        , bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                layer.open({
                    type: 1,
                    title: '添加',
                    content: $('#provider_info'),
                    area: ['350px', '200px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '45%'],
                    yes: function (index) {
                        var code = $('#gui_code').val()
                        var gname = $('#gui_gname').val()
                        var efftime = $('#gui_efftime').val()
                        var cmname = $('#gui_cmname').val()
                        var auname = $('#gui_auname').val()
                        var apname = $('#gui_apname').val()
                        $.post(home.urls.guideHeader.add(), {
                            code: code,
                            name: gname,
                            effectivedate: edate,
                            'compactorcode.name': cmname,
                            'auditorcode.name': auname,
                            'approvercode.name': apname,

                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    guide_manage.init()
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
                首先弹出一个询问框
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
                        var guideCode = _this.attr('id').substr(3)
                        $.post(home.urls.guideHeader.deleteByCode(), {code: guideCode}, function (result) {
                            console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    guide_manage.init()
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
        }//**$ bindDeleteEventListener_end$


        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                console.log('search')
                var guide_name = $('#guide_name_input').val()
                $.post(home.urls.guideHeader.getAllByLikeNameByPage(), {name: guide_name}, function (result) {
                    var page = result.data
                    var guides = result.data.content //获取数据
                    const $tbody = $("#guide_table").children('tbody')
                    guide_manage.funcs.renderHandler($tbody, guides)
                    layui.laypage.render({
                        elem: 'guide_page'
                        , count: 10 * page.totalPages数据总数
                        , jump: function (obj, first) {
                            $.post(home.urls.guideHeader.getAllByLikeNameByPage(), {
                                name: guide_name,
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var guides = result.data.content //获取数据
                                const $tbody = $("#guide_table").children('tbody')
                                guide_manage.funcs.renderHandler($tbody, guides)
                                guide_manage.pageSize = result.data.content.length
                            })
                            if (!first) {
                                console.log('not first')
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$


        , bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    guide_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        }
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.gui_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }

        , bindEditEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var guideCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.guideHeader.getByCode(), {code: guideCode}, function (result) {
                    var guide = result.data
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
                            var code = $('#gui_code').val()
                            var gname = $('#gui_gname').val()
                            var efftime = $('#gui_efftime').val()
                            var cmname = $('#gui_cmname').val()
                            var auname = $('#gui_auname').val()
                            var apname = $('#gui_apname').val()
                            $.post(home.urls.guideHeader.update(), {
                                code: code,
                                name: gname,
                                effectivedate: edate,
                                'compactorcode.name': cmname,
                                'auditorcode.name': auname,
                                'approvercode.name': apname,
                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        guide_manage.init()
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
        }  //$ bindEditEventListener——end$
        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.gui_checkbox:checked').length === 0) {
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
                            var guideCodes = []
                            $('.gui_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    guideCodes.push({code: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.guideHeader.deleteByCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(guideCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            guide_manage.init()
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

        , renderHandler: function ($tbody, guides) {
            $tbody.empty() //清空表格
            guides.forEach(function (e) {
                $('#gui_checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='gui_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.name) + "</td>" +
                    "<td>" + (e.effectivedate) + "</td>" +
                    "<td>" + (e.compactorcode ? e.compactorcode.name : 'null') + "</td>" +
                    "<td>" + (e.auditorcode ? e.auditorcode.name : 'null') + "</td>" +
                    "<td>" + (e.approvercode ? e.approvercode.name : 'null') + "</td>" +
                    "<td><a href='#' class='editGuide' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteGuide' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "<td><a href='#' class='detailGuide' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })//数据渲染完毕
            var editBtns = $('.editGuide')
            var deleteBtns = $('.deleteGuide')
            guide_manage.funcs.bindDeleteEventListener(deleteBtns)
            guide_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#gui_checkAll')
            guide_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-43')
            guide_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var gui_checkboxes = $('.gui_checkbox')
            guide_manage.funcs.disselectAll(gui_checkboxes, selectAllBox)
        }
        , disselectAll: function (gui_checkboxes, selectAllBox) {
            gui_checkboxes.off('change')
            gui_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.gui_checkbox:checked').length === guide_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}