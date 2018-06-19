var art_manage = {
    init: function () {
        art_manage.funcs.renderTable()
        var out = $('#art_manage_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#art_manage').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {
        renderTable: function () {
            $.post(home.urls.productOrder.getAllByPage(), {}, function (res) {
                var $tbody = $("#art_manage_table").children('tbody')
                var items = res.data.content
                //console.log(items)
                art_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                art_manage.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'art_manage_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.productOrder.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#art_manage_table").children('tbody')
                                art_manage.funcs.renderHandler($tbody, items)
                                art_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            art_manage.funcs.bindDetailEventListener($('.detail'))
            art_manage.funcs.bindEditorEventListener($('.editor'))
            art_manage.funcs.bindDeleteEventListener($('.delete'))

            art_manage.funcs.bindAddEvent($('#model_li_hide_add_26'))
            art_manage.funcs.bindDeleteEvent($('#model_li_hide_delete_26'))

            var refreshBtn = $('#model_li_hide_refresh_26');
            art_manage.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_26')
            art_manage.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.art_manage_checkbox:checked').length
            home.funcs.bindSelectAll($("#plate_audit_checkAll"),$(".plate_audit_checkbox"),checkedBoxLen,$("#plate_audit_table"))


        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='art_manage_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + e.productLineCode.name + "</td>" +
                    "<td>" + e.inputPlan + "</td>" +
                    "<td>" + (new Date(e.inputDate).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + e.serial_number + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
                art_manage.funcs.bindDetailEventListener($('.detail'))
                art_manage.funcs.bindEditorEventListener($('.editor'))
                art_manage.funcs.bindDeleteEventListener($('.delete'))
            })

        }

        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                layer.open({
                    type: 1,
                    title: '新增工艺单',
                    content: $("#editor_modal"),
                    area: ['900px', '700px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        },
        fill_detail_data: function(div,items){
            var total_bs = 0
            /*  var bs_table = items.lossEntry
                 var $tbody = $("#detail_modal").children('tbody')
                  $tbody.empty() //清空表格
                  productSends.forEach(function(e){
                  total_amount += e.weight
                  $tbody.append(
                      "<tr>"+
                      "<td>"+ (e.code?e.code:' ') +"</td><td>"+ (e.batchNumber?e.batchNumber:' ') + "</td>"+
                      "<td>"+ (e.unit?e.unit:' ') + "</td>"+ "<td>"+ (e.weight?e.weight:' ') + "</td><td>" + (e.status?e.status:' ') + "</td>"+
                      "</tr>"
                  );
              })
 */
            $("#bs_num").text(items.code)
            $("#rawtype").text(items.rawType.material.name)
            $("#rawname").text(items.rawType.name)
            $("#plate_num").text(items.weight)
            $("#total").text(total_bs)
            $("#user").text(items.user.name)
            $("#audit_status").text(items.auditStatus)
            $("#bs_time").text(items.time?new Date(items.time).Format('yyyy-MM-dd'):'null')
        },
        bindEditorEventListener:function(editBtns) {
            editBtns.off('click').on('click',function() {
                layer.open({
                    type:1,
                    title:'新增工艺单',
                    content:$("#editor_modal"),
                    area:['900px','700px'],
                    btn:['保存','提交','返回'],
                    offset:"auto",
                    closeBtn:0,
                    yes: function(index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn2: function(index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn3: function(index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                })
            })
        }
        ,bindDeleteEventListener:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                var _this = $(this)
                layer.open({
                    type:1,
                    title:'删除',
                    content:"<h5 style='text-align:center;padding-top:8px'>确认要删除该记录吗?</h5>",
                    area:['180px','130px'],
                    btn:['确认','取消'],
                    offset:['40%','55%'],
                    yes:function(index) {
                        var Code = _this.attr('id').substr(7)
                        $.post(home.urls.productOut.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    pro_out_manage.init()
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
        ,bindAddEvent:function(addBtn){
            addBtn.off('click').on('click',function(){
                layer.open({
                    type:1,
                    title:"新增工艺单",
                    content:$("#editor_modal"),
                    area:['900px','700px'],
                    btn:['提交','取消'],
                    offset:'auto',
                    closeBtn:0,
                    yes:function(index) {
                        $("#editor_modal").css('display','none')
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#editor_modal").css('display','none')
                        layer.close(index)
                    }
                })
            })
        }
        ,bindDeleteEvent:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                if($('.plate_audit_checkbox:checked').length === 0) {
                    layer.msg('您还没有选中任何数据!',{
                        offset:['40%','55%'],
                        time:700
                    })
                }
                else {
                    layer.open({
                        type:1,
                        title:'批量删除',
                        content:"<h5 style='text-align: center;padding-top: 8px'>您确认要删除所有记录吗?</h5>",
                        area:['190px','130px'],
                        btn:['确认','取消'],
                        offset:['40%','55%'],
                        yes:function(index){
                            $('.plate_audit_checkbox').each(function() {
                                if($(this).prop('checked')) {
                                    plate_audit_codes.push({code:$(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.productOut.deleteByCodeBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(plate_audit_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            plate_audit.init()
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
                        } ,
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                }
            })
        }
        ,bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {
                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    art_manage.init()
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var batch_num = $('#input_batch_num').val()
                //console.log(batch_num)
                //var createDate = new Date(order_date.replace(new RegExp("-","gm"),"/")).getTime()
                //var createDate =order_date.getTime;//毫秒级; // date类型转成long类型
                $.post(home.urls.productOrder.getByBatchNumberLikeByPage(), {
                    batchNumber: batch_num
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#art_manage_table").children('tbody')
                    art_manage.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'art_manage_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.productOrder.getByBatchNumberLikeByPage(), {
                                    batchNumber: batch_num,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#art_manage_table").children('tbody')
                                    art_manage.funcs.renderHandler($tbody, items)
                                    art_manage.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}