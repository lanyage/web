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
                                var rawTypes = result.data.conten
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
            console.log('bind all') // todo
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
                        "<p style='padding: 5px 0px 5px 0px;'>物料编码:<input type='text' id='rawType_code'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>物料名称:<input type='text' id='rawType_name'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>材料:<select id='rawType_material' style='width: 150px;'>" + getOptions(data) + "</select></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>数据表名:<input type='text' id='rawType_dataTableName'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>库存上限:<input type='text' id='rawType_stockUpper'/></p>" +
                        "<p style='padding: 5px 0px 5px 0px;'>库存下限:<input type='text' id='rawType_stockBottom'/></p>" +
                        "</div>" +
                        "</div>",
                        area: ['350px', '320px'],
                        btn: ['确认', '取消'],
                        offset: 'auto',
                        yes: function (index) {
                            var code = $('#rawType_code').val()
                            var name = $('#rawType_name').val()
                            var material_code = $('#rawType_material').val()
                            var dataTableName = $("#rawType_dataTableName").val()
                            var stockUpper = $("#rawType_stockUpper").val()
                            var stockBottom = $("#rawType_stockBottom").val()

                            rawType.funcs.appendRecord($("#rawType_table").children('tbody'), {        //just append the record to the tbody
                                code: code,
                                name: name,
                                material: rawType.materials.filter(function (e) {
                                    return e.code = material_code
                                })[0],
                                dataTableName: dataTableName,
                                stockBottom: stockBottom,
                                stockUpper: stockUpper
                            })
                            rawType.funcs.bindAll($("#rawType_table").children('tbody'))        //the bind all sub event

                            $.post(home.urls.rawType.add(), {
                                code: code,
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
                                layer.close(index)
                            })
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    });
                })
            })
        },

        bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
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
        },

        bindSearchEventListener: function () {
            /** code,dataTableName,material {code: 1, name: "原料"},name,stockBottom,stockUpper */
            //todo
        },

        bindEditEventListener: function () {
            /** code,dataTableName,material {code: 1, name: "原料"},name,stockBottom,stockUpper */
            //todo
        },

        bindDeleteEventListener: function (deleteBtns) {
            deleteBtns.off('click').on('click', function() {
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
                        _this.parent('td').parent('tr').remove();        //this is a fast way to delete
                        $.post(home.urls.rawType.deleteByCode(), {code: code}, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            layer.close(index)
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                    }
                })
            })
        },

        bindDeleteBatchEventListener: function () {
            /** code,dataTableName,material {code: 1, name: "原料"},name,stockBottom,stockUpper */
            //todo
        },

    }
}