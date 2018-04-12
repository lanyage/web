var archive_manage = {
    init: function () {
        /** 获取部门信息分页显示并展示 */
        archive_manage.funcs.renderTable()
        var out = $('#archive_page').width()
        var time = setTimeout(function () {
                var inside = $('.layui-laypage').width()
                $('#archive_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
                clearTimeout(time)
            }//$init end$50
        ,30)
    }//$init end$
    , pageSize: 0
    , funcs: {
        renderTable: function () {
            $.post(home.urls.archive.getAllByPage(), {}, function (result) {
                var archives = result.data.content //获取数据
                const $tbody = $("#archive_table").children('tbody')
                archive_manage.funcs.renderHandler($tbody, archives)
                archive_manage.pageSize = result.data.content.length

                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'archive_page'
                    , count: 10 * page.totalPages//数据总数
                    /** 页面变化后的逻辑 */
                    , jump: function (obj, first) {
                        if(!first) {
                            $.post(home.urls.archive.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var archives = result.data.content //获取数据
                                const $tbody = $("#archive_table").children('tbody')
                                archive_manage.funcs.renderHandler($tbody, archives)
                                archive_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                var editBtns = $('.editArchive')
                var deleteBtns = $('.deleteArchive')

                archive_manage.funcs.bindDeleteEventListener(deleteBtns)
                archive_manage.funcs.bindEditEventListener(editBtns)
            })
            var selectAllBtn = $("#arc_checkbox")
            archive_manage.funcs.bindSelectAll(selectAllBtn)
            // // var disselectAllBtn = $("#arc_checkbox")
            // console.log($('.arc_checkbox'))
            // archive_manage.funcs.disselectAll($('.arc_checkbox'),selectAllBtn)
            //$数据渲染完毕
            var addBtn = $("#model-li-hide-add-40")
            archive_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-40')
            archive_manage.funcs.bindRefreshEventLisener(refreshBtn)//追加刷新事件
            var searchBtn = $('#model-li-hide-search-40')
            archive_manage.funcs.bindSearchEventListener(searchBtn)

            // 批量删除 分页逻辑  todo
        }

        , bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                console.log(($('.right').width() - 520) / 2 / $('.right').width() * 100)
                //首先就是弹出一个弹出框
                layer.open({
                    type: 1,
                    title: '添加',
                    content: $('#add-doc-modal'),
                    area: ['700px', '240px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '38%'],
                    closeBtn : 0,
                    yes: function (index) {
                        //todo
                        var code = $('#arc_ecode').val()
                        var intime = $('#arc_intime').val()
                        var depe = $('#arc_deadend').val()
                        var supfac = $('#arc_code').val()
                        var supcon = $('#arc_supfac').val()
                        var refac = $('#arc_supcon').val()
                        var recon = $('#arc_ref').val()
                        var ecode = $('#arc_refac').val()
                        console.log(code,intime,depe,supfac,supcon,supcon,refac,recon,ecode)
                        // $.post(home.urls.archive.add(), {code: code}, function (result) {
                        //     if (result.code === 0) {
                        //         var time = setTimeout(function () {
                        //             archive_manage.init()
                        //             clearTimeout(time)
                        //         }, 500)
                        //     }
                        //     layer.close(index)
                        //     $("#add-doc-modal").css('display', 'none')
                        // })
                    },
                    btn2: function (index) {
                        layer.close(index)
                        $("#add-doc-modal").css('display', 'none')
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
                        var archiveCode = _this.attr('id').substr(3)
                        $.post(home.urls.archive.deleteByCode(), {code: archiveCode}, function (result) {
                            console.log(result.message)
                            layer.msg(result.message, {
                                offset: ['40%', '55%']
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    archive_manage.init()
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
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var archive_name = $('#archive_name_input').val()
                $.post(home.urls.archive.getAllByLikeNameByPage(), {name: archive_name}, function (result) {
                    var archives = result.data.content //获取数据
                    const $tbody = $("#archive_table").children('tbody')
                    archive_manage.funcs.renderHandler($tbody, archives)
                    archive_manage.pageSize = result.data.content.length
                })
            })
        } //$bindSearchEventListener_end$
        , bindRefreshEventLisener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%']
                    })
                    archive_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 1000)
            })
        }
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.arc_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }
        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.arc_checkbox:checked').length === 0) {
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
                            var archiveCodes = []
                            $('.arc_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    archiveCodes.push({code: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.archive.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(archiveCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            archive_manage.init()
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
        , bindDeleteEventListener: function (deleteBtns) {
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
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    archive_manage.init()
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
                        content: "<table id='editArchive' style='text-align: center;padding-top: 10px;'>" +
                        "<tr>" +
                        "<td>设备名称<input type=text id='arc_ename'/></td>" +
                        "<td style='text-align:right'>供货厂家<input type=text id='arc_supfac'/></td>" +
                        "</tr>" +
                        "<td>安装时间<input type=text id='arc_intime'/></td>" +
                        "<td style='text-align:right'>供货厂家电话<input type=text id='arc_supcon'/></td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td>保修期限<input type=text id='arc_depe'/></td>" +
                        "<td style='text-align:right'>维护厂家<input type=text id='arc_refac'/></td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td>档案编码<input type=text id='arc_code'/></td>" +
                        "<td style='text-align:right'>维护厂家电话<input type=text id='arc_refac'/></td>" +
                        "</tr>" +
                        "</table>",

                        area: ['600px', '400px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '45%'],
                        yes: function (index) {
                            console.log('yes')
                            var code = $('#arc_code').val()
                            var ename = $('#arc_ename').val()
                            var intime = $('#arc_intime').val()
                            var depe = $('#arc_depe').val()
                            var supfac = $('#arc_supfac').val()
                            var supcon = $('#arc_supcon').val()
                            var refac = $('#arc_refac').val()
                            var recon = $('#arc_recon').val()
                            var doc = $('#arc_doc').val()
                            $.post(home.urls.archive.update(), {
                                code: code,
                                equipmentName: name,
                                installTime: intime,
                                defectPeriod: depe,
                                supplyFactory: supfac,
                                supplyContact: supcon,
                                repairFactory: refac,
                                repairContact: recon,
                                document: doc,
                            }, function (result) {
                                console.log(result.message)
                                layer.msg(result.message, {
                                    offset: ['40%', '55%']
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        archive_manage.init()
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
            // console.log(archives)
            $tbody.empty() //清空表格
            archives.forEach(function (e) {
                var installTime = ('' + e.installTime).substr(0, 10)
                $('#arc_checkAll').prop('checked', false)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='arc_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td>" + (e.equipmentName) + "</td>" +
                    "<td>" + (e.equipmentName) + "</td>" +
                    "<td>" + (installTime) + "</td>" +
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
            archive_manage.funcs.bindDeleteEventListener(deleteBtns)
            archive_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#arc_checkbox')
            archive_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-40')
            archive_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)

            var arc_checkboxes = $('.arc_checkbox')
            var selectAllBtn = $("#arc_checkbox")
            archive_manage.funcs.disselectAll(arc_checkboxes, selectAllBtn)
        }

        , disselectAll: function (arc_checkboxes, selectAllBox) {
            arc_checkboxes.off('change')
            arc_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                console.log(archive_manage.pageSize)
                console.log($('.arc_checkbox:checked').length)


                if (statusNow === false) {

                    selectAllBox.prop('checked', false)

                } else if (statusNow === true && $('.arc_checkbox:checked').length === archive_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}