var rawType = {
    pageSize: 0,        //initial page size

    materials: [],

    init: function () {
        rawType.funcs.renderTable()
    },

    funcs: {
        renderTable: function () {        //render all records to the table
            $.post(home.urls.rawType.getAllByPage(), {page: 0}, function (result) {
                var rawTypes = result.data.content    //get all raw types
                const $tbody = $("#rawType_table").children('tbody')
                rawType.funcs.renderHandler($tbody, rawTypes)
                rawType.pageSize = result.data.content.length
                var page = result.data
                layui.laypage.render({        //multi-page
                    elem: 'rawType_page',
                    count: 10 * page.totalPages,       //total record numbers
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.rawType.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var rawTypes = result.data.content
                                const $tbody = $("#rawType_table").children('tbody')
                                rawType.funcs.renderHandler($tbody, rawTypes)
                                rawType.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#rawType_page').css('padding-left', '37%')
            })        //$finishing rendering


            var addBtn = $("#model-li-hide-add-115")
            rawType.funcs.bindAddEventListener(addBtn)        //bind adding
            var refreshBtn = $('#model-li-hide-refresh-115')
            rawType.funcs.bindRefreshEventListener(refreshBtn)        //bind refreshing
            var searchBtn = $('#model-li-hide-search-115')
            rawType.funcs.bindSearchEventListener(searchBtn)        //bind searching
        },


        appendRecord: function ($tbody, e) {
            $tbody.append(
                "<tr>" +
                "<td><input type='checkbox' class='raw_type_checkbox' value='" + (e.code) + "'></td>" +
                "<td>" + (e.code) + "</td>" +
                "<td>" + (e.name) + "</td>" +
                "<td>" + (e.material ? e.material.name : '') + "</td>" +
                "<td>" + (e.dataTableName) + "</td>" +
                "<td>" + (e.stockUpper) + "</td>" +
                "<td>" + (e.stockBottom) + "</td>" +
                "<td><a href='#' class='edit' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                "<td><a href='#' class='delete' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                "</tr>")
        },        //append all records to the tbody


        bindAll: function ($tbody) {
            var editBtns = $('.edit')        //edit buttons
            var deleteBtns = $('.delete')        //delete buttons
            var deleteBatchBtn = $('#model-li-hide-delete-115')        //button for batch-deleting

            rawType.funcs.bindEditEventListener(editBtns)        //bind editing
            rawType.funcs.bindDeleteEventListener(deleteBtns)        //bind deleting
            rawType.funcs.bindDeleteBatchEventListener(deleteBatchBtn)        //bind deleting batch
            home.funcs.bindSelectAll($('#checkAll'), $('.raw_type_checkbox'), $tbody.children('tr').length, $("#rawType_table"))        //bind selecting all
        },        //bind all event listener


        renderHandler: function ($tbody, rawTypes) {
            $tbody.empty()        //clear the tbody every time you attend to append
            rawTypes.forEach(function (e) {
                $('#checkAll').prop('checked', false)
                rawType.funcs.appendRecord($tbody, e)
            })        //$rendering finished
            rawType.funcs.bindAll($tbody)
        },        //this is somewhere to truly append the records and bind all local events


        bindAddEventListener: function ($add) {
            function getOptions(data) {        //get all materials
                var options = ""
                data.forEach(function (e) {
                    options += "<option value='" + e.code + "'>" + e.name + "</option>"
                })
                return options
            }

            $add.off('click').on('click', function () {
                $.get(home.urls.material.getAll(), {}, function (result) {        //get all materials
                    var data = result.data        //all materials
                    rawType.materials = data        //store the material
                    layer.open({
                        type: 1,
                        title: '添加',
                        content: "<div id='addModal'>" +
                        "<div style='text-align: center;padding-top: 10px;'>" +
                        // "<p style='padding: 5px 0px 5px 0px;'>物料编码:<input type='text' id='rawType_code'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>物料名称:<input type='text' id='rawType_name'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>材料:<select id='rawType_material' style='width: 150px;'>" + getOptions(data) + "</select></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>数据表名:<input type='text' id='rawType_dataTableName'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>库存上限:<input type='text' id='rawType_stockUpper'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>库存下限:<input type='text' id='rawType_stockBottom'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '280px'],
                        btn: ['确认', '取消'],
                        offset: 'auto',
                        yes: function (index) {
                            // var code = $('#rawType_code').val()
                            var name = $('#rawType_name').val()
                            var material_code = $('#rawType_material').val()
                            var dataTableName = $("#rawType_dataTableName").val()
                            var stockUpper = $("#rawType_stockUpper").val()
                            var stockBottom = $("#rawType_stockBottom").val()
                            $.post(home.urls.rawType.add(), {
                                // code: code,
                                name: name,
                                'material.code': material_code,
                                dataTableName: dataTableName,
                                stockUpper: stockUpper,
                                stockBottom: stockBottom
                            }, function (result) {
                                layer.msg(result.message, {        //show message no matter what result it is
                                    offset: 'auto',
                                    time: 700
                                })
                                $.post(home.urls.rawType.getByCode(),{code:result.data.code},function(result) {
                                    console.log(result)
                                    rawType.funcs.appendRecord($("#rawType_table").children('tbody'), result.data)        //just append the record to the tbody
                                    rawType.funcs.bindAll($("#rawType_table").children('tbody'))        //the bind all sub event
                                })
                                layer.close(index)
                            })
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    });
                })
            })
        },        //bind adding


        bindRefreshEventListener: function (refreshBtn) {        //reinitialize the page
            refreshBtn.off('click').on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    rawType.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        },        //bind refreshing


        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click').on('click', function () {
                console.log('search')
                var rawtype_name = $('#rawtype_name_input').val()
                $.post(home.urls.rawType.getAllByLikeNameByPage(), {name: rawtype_name}, function (result) {
                    var page = result.data
                    var rawTypes = result.data.content
                    const $tbody = $("#rawType_table").children('tbody')
                    rawType.funcs.renderHandler($tbody, rawTypes)
                    layui.laypage.render({
                        elem: 'department_page'
                        , count: 10 * page.totalPages
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.rawType.getAllByLikeNameByPage(), {
                                    name: rawtype_name,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var rawTypes = result.data.content
                                    const $tbody = $("#department_table").children('tbody')
                                    rawType.funcs.renderHandler($tbody, rawTypes)
                                    rawType.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },        //bind searching


        bindEditEventListener: function (editBtns) {
            function getOptions(data) {        //get all materials
                console.log(data)
                var options = ""
                data.forEach(function (e) {
                    options += "<option value='" + e.code + "'>" + e.name + "</option>"
                })
                return options
            }
            editBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var rawType_code = _selfBtn.attr('id').substr(5)
                $.get(home.urls.material.getAll(), {}, function (result) {        //get all materials
                    rawType.materials = result.data
                    $.post(home.urls.rawType.getByCode(), {code: rawType_code}, function (result) {
                        var one = result.data
                        layer.open({
                            type: 1,
                            content: "<div id='addModal'>" +
                            "<div style='text-align: center;padding-top: 10px;'>" +
                            "<p style='padding: 5px 0px 5px 0px;'>物料编码:<input type='text' id='rawType_code' value='" + (one.code) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>物料名称:<input type='text' id='rawType_name' value='" + (one.name) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>材料:<select id='rawType_material' style='width: 150px;'>" + getOptions(rawType.materials) + "</select></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>数据表名:<input type='text' id='rawType_dataTableName' value='" + (one.dataTableName) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>库存上限:<input type='text' id='rawType_stockUpper' value='" + (one.stockUpper) + "'/></p>" +
                            "<p style='padding: 5px 0px 5px 0px;'>库存下限:<input type='text' id='rawType_stockBottom' value='" + (one.stockBottom) + "'/></p>" +
                            "</div>" +
                            "</div>",
                            area: ['350px', '320px'],
                            btn: ['确认', '取消'],
                            offset: ['40%', '45%'],
                            yes: function (index) {
                                var code = $('#rawType_code').val()
                                var name = $('#rawType_name').val()
                                var material_code = $('#rawType_material').val()
                                var dataTableName = $("#rawType_dataTableName").val()
                                var stockUpper = $("#rawType_stockUpper").val()
                                var stockBottom = $("#rawType_stockBottom").val()
                                $.post(home.urls.rawType.update(), {
                                    code: code,
                                    name: name,
                                    'material.code': material_code,
                                    dataTableName: dataTableName,
                                    stockUpper: stockUpper,
                                    stockBottom: stockBottom
                                }, function (result) {
                                    layer.msg(result.message, {
                                        offset: ['40%', '55%'],
                                        time: 700
                                    })
                                    $('#edit-'+code).parent('td').parent('tr').remove()
                                    rawType.funcs.appendRecord($("#rawType_table").children('tbody'), result.data)
                                    rawType.funcs.bindAll($("#rawType_table").children('tbody'))        //the bind all sub event
                                    layer.close(index)
                                })
                            },
                            btn2: function (index) {
                                layer.close(index)
                            }
                        })
                    })
                })

            })
        },        //bind editing


        bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click').on('click', function () {
                var _this = $(this)
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                    area: ['180px', '130px'],
                    btn: ['确认', '取消'],
                    offset: 'auto',
                    yes: function (index) {
                        var code = _this.attr('id').substr(3)
                        $.post(home.urls.rawType.deleteByCode(), {code: code}, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            _this.parent('td').parent('tr').remove();        //this is a fast way to delete
                            layer.close(index)
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
            })
        },        //bind deleting


        bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click').on('click', function () {
                if ($('.raw_type_checkbox:checked').length === 0) {
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
                            var raw_type_codes = []
                            $('.raw_type_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    raw_type_codes.push({code: $(this).val()})
                                    $(this).parent('td').parent('tr').remove();        //fast deleting
                                }
                            })
                            $.ajax({
                                url: home.urls.rawType.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(raw_type_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
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
        }        //bind deleting in batch
    }
}