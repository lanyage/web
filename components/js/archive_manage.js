var archive_manage = {
    equipments: [],
    suppliers: [],
    formData: null,
    fileCode: null,
    init: function () {
        // console.log(archive_manage.suppliers)
        // console.log(archive_manage.equipments)
        $("#arc_eqname").empty()
        archive_manage.equipments.forEach(function (e) {
            $("#arc_eqname").append("<option value='" + e.code + "'>" + e.name + "</option>")
        })
        $("#arc_supfac").empty()
        $("#arc_ref").empty()
        archive_manage.suppliers.forEach(function (e) {
            $("#arc_supfac").append("<option value='" + e.code + "'>" + e.name + "</option>")
            $("#arc_ref").append("<option value='" + e.code + "'>" + e.name + "</option>")
        })
        $("#arc_supfac").off('change').on('change', function () {
            var _this = $(this)
            var now = archive_manage.suppliers.filter(function (e) {
                return e.code === _this.val()
            })[0]
            $("#arc_supcon").val(now.contact)
        })
        $("#arc_ref").off('change').on('change', function () {
            var _this = $(this)
            var now = archive_manage.suppliers.filter(function (e) {
                // console.log(e.code, _this.val())
                return e.code === _this.val()
            })[0]
            // console.log(now.contact)
            $("#arc_refac").val(now.contact)
        })
        $("#arc_supcon").val(archive_manage.suppliers[0].contact)
        $("#arc_refac").val(archive_manage.suppliers[0].contact)


        $("#arc_eqdoc").off('change').on('change', function () {
            var _self = $(this)
            if (_self.val() != null) {
                var form = _self.parent("form")
                var formData = new FormData(form[0]);
                var file = _self[0].files[0]
                // console.log(file)
                formData.append('file', file)
                archive_manage.formData = formData
            }
        })


        /** 获取部门信息分页显示并展示 */
        archive_manage.funcs.renderTable()
        var out = $('#archive_page').width()
        var time = setTimeout(function () {
                var inside = $('.layui-laypage').width()
                $('#archive_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
                clearTimeout(time)
            }//$init end$50
            , 30)
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
                        if (!first) {
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
            var addBtn = $("#model-li-hide-add-40")
            archive_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            var refreshBtn = $('#model-li-hide-refresh-40')
            archive_manage.funcs.bindRefreshEventLisener(refreshBtn)//追加刷新事件
            var searchBtn = $('#model-li-hide-search-40')
            archive_manage.funcs.bindSearchEventListener(searchBtn)
            // 批量删除 分页逻辑  todo
        }

        , bindAddEventListener: function (addBtn) {
            addBtn.off('click').on('click', function () {
                archive_manage.funcs.clearAddModal()
                //首先就是弹出一个弹出框
                layer.open({
                    type: 1,
                    title: '添加',
                    content: $('#add-doc-modal'),
                    area: ['700px', '240px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '38%'],
                    closeBtn: 0,
                    yes: function (index) {
                        //todo传入的参数
                        var eqcode = $('#arc_eqname').val()
                        var installTime = $('#arc_eqinstalltime').val()
                        var defectPeriod = $('#arc_eqdeadline').val()
                        var repairFactory = $('#arc_ref').val()
                        var repairContact = $('#arc_refac').val()
                        var supplyFactory = $('#arc_supfac').val()
                        var supplyContact = $('#arc_supcon').val()
                        var eq = archive_manage.equipments.filter(function (e) {
                            return e.code == eqcode
                        })[0].name

                        var supply = archive_manage.suppliers.filter(function (e) {
                            return e.code == supplyFactory
                        })[0].name

                        var repair = archive_manage.suppliers.filter(function (e) {
                            return e.code == repairFactory
                        })[0].name
                        $.ajax({
                            url: servers.backup() + "pdf/upload",
                            type: 'POST',
                            data: archive_manage.formData,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (result) {
                                archive_manage.fileCode = result.data.code
                                var document = result.data.code
                                var obj = {
                                    equipmentCode: {code: eqcode},
                                    installTime: installTime,
                                    defectPeriod: defectPeriod,
                                    document: document,
                                    supplyFactory: {code: supplyFactory},
                                    supplyContact: supplyContact,
                                    repairFactory: {code: repairFactory},
                                    repairContact: repairContact,
                                }
                                $.post(home.urls.archive.add(), {                   //add new archive
                                    name: obj.document,
                                    equipmentCode: obj.equipmentCode.code,
                                    installTime: obj.installTime,
                                    equipmentName: eq,
                                    defectPeriod: obj.defectPeriod,
                                    supplyFactory: supply,
                                    repairFactory: repair,
                                    document: obj.document,
                                    supplyContact: obj.supplyContact,
                                    repairContact: obj.repairContact,
                                }, function (result) {
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                    $("#arc_checkbox").prop('checked', false)
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            archive_manage.init()
                                            clearTimeout(time)
                                        }, 500)
                                    }
                                    layer.close(index)
                                    archive_manage.funcs.clearAddModal()
                                    $("#arc_eqdoc").val('')
                                    archive_manage.fileCode = null
                                    archive_manage.formData = null
                                    $("#add-doc-modal").css('display', 'none')
                                })
                            }
                        })
                    },
                    btn2: function (index) {
                        archive_manage.funcs.clearAddModal()
                        $("#arc_eqdoc").val('')
                        layer.close(index)
                        archive_manage.fileCode = null
                        archive_manage.formData = null
                        $("#add-doc-modal").css('display', 'none')
                    }
                })
            })
        }//$ bindAddEventListener——end$

        , bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click').on('click', function () {
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
                        $.post(home.urls.archive.getByCode(), {code: archiveCode}, function (res) {
                            var fileCode = res.data.document
                            console.log(fileCode)
                            $.post(servers.backup() + "pdf/deleteByCode", {code: fileCode}, function (res) {
                            })
                        })
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
        }//**$ bindDeleteEventListener_end$
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
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var archiveCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.archive.getByCode(), {code: archiveCode}, function (result) {
                    var archive = result.data
                    // console.log('archives', archive)
                    //you need to render the table firstly  todo
                    $("#arc_eqname").empty()
                    archive_manage.equipments.forEach(function (e) {
                        if (e.code == archive.equipmentCode.code)
                            $("#arc_eqname").prepend("<option value='" + e.code + "'>" + e.name + "</option>")
                        else
                            $("#arc_eqname").append("<option value='" + e.code + "'>" + e.name + "</option>")
                    })
                    $("#arc_supfac").empty()
                    $("#arc_ref").empty()
                    archive_manage.suppliers.forEach(function (e) {
                        if (e.name == archive.supplyFactory)
                            $("#arc_supfac").prepend("<option value='" + e.code + "'>" + e.name + "</option>")
                        else
                            $("#arc_supfac").append("<option value='" + e.code + "'>" + e.name + "</option>")
                        if (e.name == archive.repairFactory)
                            $("#arc_ref").prepend("<option value='" + e.code + "'>" + e.name + "</option>")
                        else
                            $("#arc_ref").append("<option value='" + e.code + "'>" + e.name + "</option>")
                    })
                    $('#arc_eqdeadline').val(archive.defectPeriod)
                    $('input[type="date"]').val(new Date(archive.installTime).Format('yyyy-MM-dd'))
                    $('#arc_supcon').val(archive.supplyContact)
                    $('#arc_refac').val(archive.repairContact)

                    var form = $("#arc_eqdoc").parent('form')
                    var upload = $("#arc_eqdoc").detach()
                    form.append("<input type='button' value='更换文件' id='changeBtn'/>")
                    $('#changeBtn').one('click', function () {
                        form.empty().append(upload)
                    })
                    var eqcode = $('#arc_eqname').val()

                    var eq = archive_manage.equipments.filter(function (e) {
                        return e.code == eqcode
                    })[0].name

                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $('#add-doc-modal'),
                        area: ['700px', '240px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '38%'],
                        closeBtn: 0,
                        yes: function (index) {
                            var code = _selfBtn.attr('id').substr(5)
                            var eqname = $('#arc_eqname').val()
                            var installtime = $('#arc_eqinstalltime').val()
                            var deadline = $('#arc_eqdeadline').val()
                            var supfac = $('#arc_supfac').val()
                            var supcon = $('#arc_supcon').val()
                            var refac = $('#arc_ref').val()
                            var recon = $('#arc_refac').val()
                            var eqdoc = archive.document
                            console.log($('#arc_eqdoc').val())
                            if ($('#arc_eqdoc').val() == undefined || $('#arc_eqdoc').val() == '') {
                                console.log('上')
                                $.post(home.urls.archive.update(), {
                                    code: code,
                                    name: archive.document,
                                    equipmentCode: eqname,
                                    installTime: installtime,
                                    equipmentName: eq,
                                    defectPeriod: deadline,
                                    supplyFactory: supfac,
                                    repairFactory: refac,
                                    document: eqdoc,
                                    supplyContact: supcon,
                                    repairContact: recon,
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
                                    archive_manage.funcs.clearAddModal()
                                    layer.close(index)
                                    $("#add-doc-modal").css('display', 'none')
                                })
                            } else {
                                console.log('下')
                                var form = $('#arc_eqdoc').parent("form")
                                var formData = new FormData(form[0]);
                                var file = $('#arc_eqdoc')[0].files[0]
                                console.log(file)
                                formData.append('file', file)
                                archive_manage.formData = formData
                                $.ajax({
                                    url: servers.backup() + "pdf/upload",
                                    type: 'POST',
                                    data: archive_manage.formData,
                                    async: false,
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    success: function (result) {
                                        archive_manage.fileCode = result.data.code
                                        var document = result.data.code
                                        $.post(home.urls.archive.update(), {
                                            code: code,
                                            name: document,
                                            equipmentCode: eqname,
                                            installTime: installtime,
                                            equipmentName: eq,
                                            defectPeriod: deadline,
                                            supplyFactory: supfac,
                                            repairFactory: refac,
                                            document: document,
                                            supplyContact: supcon,
                                            repairContact: recon,
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
                                            $.post(servers.backup() + "pdf/deleteByCode", {code: archive.document}, function (res) {
                                            })
                                            archive_manage.funcs.clearAddModal()
                                            layer.close(index)
                                            $("#add-doc-modal").css('display', 'none')
                                        })
                                    }
                                })
                            }
                        },
                        btn2: function (index) {
                            archive_manage.funcs.clearAddModal()
                            layer.close(index)
                            $("#add-doc-modal").css('display', 'none')
                        }

                    })
                })
            })
        }//$ bindEditEventListener——end$
        , clearAddModal: function () {
            $('#arc_eqname').val('')
            $('#arc_eqinstalltime').val('')
            $('#arc_eqdeadline').val('')
            $('#arc_supfac').val('')
            $('#arc_supcon').val('')
            $('#arc_ref').val('')
            $('#arc_refac').val('')
            $('#arc_eqdoc').val('')
        }
        , renderHandler: function ($tbody, archives) {
            // console.log(archives)
            $tbody.empty() //清空表格
            archives.forEach(function (e) {
                var installTime = ('' + e.installTime).substr(0, 10)
                $('#arc_checkAll').prop('checked', false)
                // console.log(e)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='arc_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.code) + "</td>" +
                    "<td><strong><del>" + "文档"+e.document + "</del></strong></td>" +
                    "<td>" + (e.equipmentCode ? e.equipmentCode.name : '') + "</td>" +
                    "<td>" + (new Date(e.installTime).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.defectPeriod) + "</td>" +
                    "<td>" + (e.supplyFactory) + "</td>" +
                    "<td>" + (e.supplyContact) + "</td>" +
                    "<td>" + (e.repairFactory) + "</td>" +
                    "<td>" + (e.repairContact) + "</td>" +
                    "<td><a href='" + servers.backup() + 'pdf/download/' + e.document + "' target='_blank'>打开手册</a></td>" +
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