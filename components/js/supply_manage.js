var supply_manage = {
    init: function () {
        /** 获取供应商信息分页显示并展示 */
        supply_manage.funcs.renderTable()
    }//$init end$
    , pageSize: 0
    , funcs: {
        renderTable: function () {
            $.post(home.urls.supplyman.getAllByPage(), {page: 0}, function (result) {
                var supplymans = result.data.content //获取数据
                const $tbody = $("#supplier_table").children('tbody')
                supply_manage.funcs.renderHandler($tbody, supplymans)
                supply_manage.pageSize = result.data.content.length
                var page = result.data
                /** @namespace page.totalPages 这是返回数据的总页码数 */
                layui.laypage.render({
                    elem: 'supplyman_page'
                    , count: 10 * page.totalPages//数据总数
                    , jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.supplyman.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var supplymans = result.data.content //获取数据
                                const $tbody = $("#supplier_table").children('tbody')
                                supply_manage.funcs.renderHandler($tbody, supplymans)
                                supply_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
                $('#supplyman_page').css('padding-left','37%')
            })
            //$数据渲染完毕
            /** 新增*/
            var addBtn = $("#model-li-hide-add-80")
            supply_manage.funcs.bindAddEventListener(addBtn) //追加增加事件
            /** 刷新*/
            var refreshBtn = $('#model-li-hide-refresh-80')
            supply_manage.funcs.bindRefreshEventLisener(refreshBtn)//追加刷新事件
            /** 搜索*/
            var searchBtn = $('#model-li-hide-search-80')
            supply_manage.funcs.bindSearchEventListener(searchBtn)
        }

        /**新增*/
        , bindAddEventListener: function (addBtn) {
            addBtn.off('click')
            addBtn.on('click', function () {
                /** 新增默认输入框为空*/
                $('#header_inp').val('')
                $('#dilivery_time_inp').val('')
                $('#diliverer_inp').val('')
                $('#contact_inp').val('')
                $('#total_inp').val('')

                $('#name_inp').val('')
                $('#specifications_inp').val('')
                $('#number_inp').val('')
                $('#batch_number_inp').val('')

                /** 初始化输入栏 */
                var trcount = $('#provider_body_downtable tr').length
                if(trcount > 3){
                    var temp = 0
                    $('#provider_body_downtable tr').each(function(){
                        if(temp!=0 && temp!=1 && temp!=(trcount-1)){
                            $(this).remove()
                        }
                        temp++
                    })
                    trcount = 3
                }
                else if(trcount == 2){
                    $('#addb').before("<tr id='inputcontent' class='addline'><td><input class='provider_input'></td>" +
                        "<td style='padding: 0;'><input class='provider_input'></td>" +
                        "<td><input class='provider_input'></td>" +
                        "<td><input class='provider_input'></td>" +
                        "<td>" +
                        "<button type='button' id='close_btn' onclick='del()' title='close it' style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;'>" +
                        " &times;  "
                        + " </button>" + "</td></tr>")
                }
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $('#provider_info'),
                    area: ['800px', '600px'],
                    btn: ['确认', '取消'],
                    offset: ['20%', '28%'],
                    closeBtn : 0,
                    yes: function (index) {
                        var code = $('#header_inp').val()
                        var customerName = $('#diliverer_inp').val()
                        var supplyTime = $('#dilivery_time_inp').val()
                        var contact = $('#contact_inp').val()
                        var total = $('#total_inp').val()

                        var data = []
                        $('.addline').each(function () {
                            var row = $(this)
                                var valsContainer = row.children('td').children('.provider_input')
                                var batchNumber =  $(valsContainer[0]).val()
                                var  name = $(valsContainer[1]).val()
                                var specifications = $(valsContainer[2]).val()
                                var number = $(valsContainer[3]).val()

                            data.push({
                                header: {
                                    code: code,
                                    supplyTime: supplyTime,
                                    total: total,
                                    contact: contact,
                                    customer:{
                                        name: customerName,
                                    }
                                },
                                batchNumber : batchNumber,
                                name : name,
                                specifications : specifications,
                                number : number
                            })
                        })

                        $.ajax({
                            url: home.urls.supplyman.saveInBatch(),
                            contentType: 'application/json',
                            data: JSON.stringify(data),
                            type: 'post',
                            success: function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        supply_manage.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                layer.close(index)
                                $("#provider_info").css('display', 'none')
                            }
                        })
                    },
                    btn2: function (index) {
                        layer.close(index)
                        $("#provider_info").css('display', 'none')
                    }
                });
                $('#close_btn').click(function(){
                    $('.addline').remove()
                })


            })
        }//$ bindAddEventListener——end$

        /**删除 */
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
                        var supplymanCode = _this.attr('id').substr(3)
                        $.post(home.urls.supplyman.deleteByCode(), {code: supplymanCode}, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    supply_manage.init()
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
        /** 搜索*/
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var supply_code = $('#supplyman_name_input').val()

                $.post(home.urls.supplyman.getAllInfo(), {headCode: supply_code}, function (result) {
                    var page = []
                    page = result.data
                    const $tbody = $("#supplier_table").children('tbody')
                    supply_manage.funcs.renderHandler($tbody, page)
                    const pageNumber = page.length % 10 !== 0 ? parseInt(page.length / 10) + 1 : parseInt(page.length) / 10
                    layui.laypage.render({
                        elem: 'supplyman_page'
                        , count: 10 * pageNumber//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.supplyman.getAllInfo(), {
                                    headCode: supply_code,
                                }, function (result) {
                                    var page = []
                                    page.push(result.data) //获取数据
                                    const $tbody = $("#supplier_table").children('tbody')
                                    supply_manage.funcs.renderHandler($tbody, page)
                                    supply_manage.pageSize = result.data.length
                                })
                            }
                        }
                    })
                })
            })
        } //$bindSearchEventListener_end$

        /** 刷新*/
        , bindRefreshEventLisener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    supply_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)
            })
        }
        /**选择所有 */
        , bindSelectAll: function (selectAllBox) {
            selectAllBox.off('change')
            selectAllBox.on('change', function () {
                var status = selectAllBox.prop('checked')
                $('.sup_checkbox').each(function () {
                    $(this).prop('checked', status)
                })
            })
        }
        /**批量删除 */
        , bindDeleteBatchEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.sup_checkbox:checked').length === 0) {
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
                            var supplymanCodes = []
                            $('.sup_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    supplymanCodes.push({code: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.supplyman.deleteByBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(supplymanCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            supply_manage.init()
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
        /** 编辑*/
        , bindEditEventListener: function (editBtns) {
            var add_btn_number = 1
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var supplymanCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.supplyman.getByCode(), {code: supplymanCode}, function (result) {

                    var trcount = $('#provider_body_downtable tr').length
                    if(trcount > 3){
                        var temp = 0
                        $('#provider_body_downtable tr').each(function(){
                            if(temp!=0 && temp!=1 && temp!=(trcount-1)){
                                $(this).remove()
                            }
                            temp++
                        })
                        trcount = 3
                    }
                    else if(trcount == 2){
                        /**新增初始化*/
                        $('#addb').before("<tr id='inputcontent' class='addline'><td><input class='provider_input' id='batch_number_inp'></td>" +
                            "<td style='padding: 0;'><input class='provider_input' id='name_inp'></td>" +
                            "<td><input class='provider_input' id='specifications_inp'></td>" +
                            "<td><input class='provider_input' id='number_inp'></td>" +
                            "<td>" +
                            "<button type='button' id='close_btn' title='close it' onclick='del()' style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;'>" +
                            " &times;  "
                            + " </button>" + "</td></tr>")
                    }
                    else if(trcount == 3){
                        var temp = 0
                        $('#provider_body_downtable tr').each(function(){
                            if(temp==1){
                                $(this).remove()
                            }
                            temp++
                        })
                        $('#addb').before("<tr id='inputcontent' class='addline'><td><input class='provider_input' id='batch_number_inp'></td>" +
                            "<td style='padding: 0;'><input class='provider_input' id='name_inp'></td>" +
                            "<td><input class='provider_input' id='specifications_inp'></td>" +
                            "<td><input class='provider_input' id='number_inp'></td>" +
                            "<td>" +
                            "<button type='button' id='close_btn' title='close it' onclick='del()' style='border:none;outline:none;font-size: 20px;color:#00A99D;background:white;'>" +
                            " &times;  "
                            + " </button>" + "</td></tr>")
                    }
                    var dt = new Date(result.data.header.supplyTime).Format("yyyy/MM/dd")
                    /** 编辑框默认值*/
                    $('#header_inp').val(result.data.header.code)
                    $('#diliverer_inp').val(result.data.header.customer.name)
                    $('#dilivery_time_inp').val(dt.toLocaleString())
                    $('#contact_inp').val(result.data.header.contact)
                    $('#total_inp').val(result.data.header.total)

                    $('#name_inp').val(result.data.name)
                    $('#specifications_inp').val(result.data.specifications)
                    $('#number_inp').val(result.data.number)
                    $('#batch_number_inp').val(result.data.batchNumber)
                    /**初始化新增框*/
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $('#provider_info'),
                        area: ['800px', '600px'],
                        btn: ['确认', '取消'],
                        offset: ['20%', '28%'],
                        closeBtn : 0,
                        yes: function (index) {
                            var codeBefore = result.data.code
                            var code = $('#header_inp').val()
                            var customerName = $('#diliverer_inp').val()
                            var supplyTime = $('#dilivery_time_inp').val()
                            var contact = $('#contact_inp').val()
                            var total = $('#total_inp').val()

                            var pcount = $('.addline').length
                            var data = []
                            $('.addline').each(function(a,b) {
                                if(a == 0) {
                                    var name = $('#name_inp').val()
                                    var specification = $('#specifications_inp').val()
                                    var number = $('#number_inp').val()
                                    var batchNumber = $('#batch_number_inp').val()
                                    $.post(home.urls.supplyman.update(), {
                                        codeBefore: codeBefore,
                                        'header.code': code,
                                        'header.customer.name': customerName,
                                        'header.supplyTime': supplyTime,
                                        'header.contact': contact,
                                        'header.total': total,

                                        name: name,
                                        specifications: specification,
                                        number: number,
                                        batchNumber: batchNumber
                                    }, function (result) {
                                        layer.msg(result.message, {
                                            offset: ['40%', '55%'],
                                            time: 700
                                        })
                                        if (result.code === 0) {
                                            var time = setTimeout(function () {
                                                supply_manage.init()
                                                clearTimeout(time)
                                            }, 500)
                                        }
                                        layer.close(index)
                                        $("#provider_info").css('display', 'none')
                                    })
                                }
                                else{
                                    var dt = new Date(result.data.header.supplyTime).Format("yyyy-MM-dd")
                                    $('#dilivery_time_inp').val(dt.toLocaleString())
                                    var csupplyTime = $('#dilivery_time_inp').val()
                                    var row = $(this)
                                    var valsContainer = row.children('td').children('.provider_input')
                                    var batchNumber =  $(valsContainer[0]).val()
                                    var  name = $(valsContainer[1]).val()
                                    var specifications = $(valsContainer[2]).val()
                                    var number = $(valsContainer[3]).val()
                                    data.push({
                                        header: {
                                            code: code,
                                            supplyTime: csupplyTime,
                                            total: total,
                                            contact: contact,
                                            customer:{
                                                name: customerName,
                                            }
                                        },
                                        batchNumber : batchNumber,
                                        name : name,
                                        specifications : specifications,
                                        number : number
                                    })
                                }
                            })
                            if(pcount > 1){
                                $.ajax({
                                    url: home.urls.supplyman.saveInBatch(),
                                    contentType: 'application/json',
                                    data: JSON.stringify(data),
                                    type: 'post',
                                    success: function (result) {
                                        if (result.code === 0) {
                                            var time = setTimeout(function () {
                                                supply_manage.init()
                                                clearTimeout(time)
                                            }, 500)
                                        }
                                        layer.msg(result.message, {
                                            offset: ['40%', '55%'],
                                            time: 700
                                        })
                                        layer.close(index)
                                        $("#provider_info").css('display', 'none')
                                    }
                                })
                            }
                        },
                        btn2: function (index) {
                            layer.close(index)
                            $("#provider_info").css('display', 'none')
                        }
                    })
                })

            })
        }//$ bindEditEventListener——end$

        /** 详情*/
        , bindDetailEventListener: function (editBtns) {
            editBtns.off('click')
            editBtns.on('click', function () {
                var _selfBtn = $(this)
                var supplymanCode = _selfBtn.attr('id').substr(5)
                $.post(home.urls.supplyman.getByCode(), {code: supplymanCode}, function (result) {
                    var page = result.data
                    var dt = new Date(page.header.supplyTime).Format("yyyy-MM-dd")
                    /** 详情框默认值*/
                    $('#header_inp1').val(page.header.code)
                    $('#diliverer_inp1').val(page.header.customer.name)
                    $('#dilivery_time_inp1').val(dt.toLocaleString())
                    $('#contact_inp1').val(page.header.contact)
                    $('#total_inp1').val(page.header.total)

                    $('#name_inp1').val(page.name)
                    $('#specifications_inp1').val(page.specifications)
                    $('#number_inp1').val(page.number)
                    $('#batch_number_inp1').val(page.batchNumber)
                    layer.open({
                        type: 1,
                        title: '详情',
                        content: $('#provider_info1'),
                        area: ['800px', '600px'],
                        btn: ['确认', '取消'],
                        offset: ['20%', '28%'],
                        closeBtn : 0,
                        yes: function (index) {
                            layer.close(index)
                            $("#provider_info1").css('display', 'none')
                        },
                        btn2: function (index) {
                            layer.close(index)
                            $("#provider_info1").css('display', 'none')
                        }
                    })
                })
            })
        }//$ bindEditEventListener——end$
        , renderHandler: function ($tbody, supplymans) {
            $tbody.empty() //清空表格
            supplymans.forEach(function (e) {
                $('#sup_checkAll').prop('checked', false)
                var dt = new Date(e.header.supplyTime).Format("yyyy-MM-dd")
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='sup_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.header.code) + "</td>" +
                    "<td>" + dt.toLocaleString() + "</td>" +
                    "<td>" + (e.header.total) + "</td>" +
                    "<td>" + (e.header.customer.name) + "</td>" +
                    "<td>" + (e.header.contact) + "</td>" +
                    "<td><a href='#' class='detailSupplyman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe63c;</i></a></td>" +
                    "<td><a href='#' class='editSupplyman' id='edit-" + (e.code) + "'><i class='layui-icon'>&#xe642;</i></a></td>" +
                    "<td><a href='#' class='deleteSupplyman' id='de-" + (e.code) + "'><i class='layui-icon'>&#xe640;</i></a></td>" +
                    "</tr>")
            })//$数据渲染完毕
            var editBtns = $('.editSupplyman')
            var deleteBtns = $('.deleteSupplyman')
            var detailBtns = $('.detailSupplyman')
            /** 详情事件*/
            supply_manage.funcs.bindDetailEventListener(detailBtns)
            /** 删除事件*/
            supply_manage.funcs.bindDeleteEventListener(deleteBtns)
            /** 编辑事件*/
            supply_manage.funcs.bindEditEventListener(editBtns)
            var selectAllBox = $('#sup_checkAll')
            supply_manage.funcs.bindSelectAll(selectAllBox)
            var deleteBatchBtn = $('#model-li-hide-delete-80')
            /** 批量删除*/
            supply_manage.funcs.bindDeleteBatchEventListener(deleteBatchBtn)
            var sup_checkboxes = $('.sup_checkbox')
            supply_manage.funcs.disselectAll(sup_checkboxes, selectAllBox)
        }
        , disselectAll: function (sup_checkboxes, selectAllBox) {
            sup_checkboxes.off('change')
            sup_checkboxes.on('change', function () {
                var statusNow = $(this).prop('checked')
                if (statusNow === false) {
                    selectAllBox.prop('checked', false)
                } else if (statusNow === true && $('.sup_checkbox:checked').length === supply_manage.pageSize) {
                    selectAllBox.prop('checked', true)
                }
            })
        }
    }
}