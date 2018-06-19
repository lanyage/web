var casket_sampling = {
    init: function () {
        casket_sampling.funcs.renderTable()
        var out = $('#casket_sampling_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#casket_sampling').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.bowlAbnormal.getAllByPage(), {page:0}, function (res) {
                console.log(res)
                var $tbody = $("#casket_sampling_table").children('tbody')
                var items = res.data.content
                //console.log(items)
                casket_sampling.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                casket_sampling.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'casket_sampling_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.casketSampling.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#casket_sampling_table").children('tbody')
                                casket_sampling.funcs.renderHandler($tbody, items)
                                casket_sampling.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            casket_sampling.funcs.bindDetailEventListener($('.detail'))
            casket_sampling.funcs.bindEditorEventListener($('.editor'))
            casket_sampling.funcs.bindDeleteEventListener($('.delete'))

            casket_sampling.funcs.bindAddEvent($('#model_li_hide_add_32'))
            casket_sampling.funcs.bindDeleteEvent($('#model_li_hide_delete_32'))

            var refreshBtn = $('#model_li_hide_refresh_32');
            casket_sampling.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_32')
            casket_sampling.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.casket_sampling_checkbox:checked').length
            home.funcs.bindSelectAll($("#casket_sampling_checkAll"),$(".casket_sampling_checkbox"),checkedBoxLen,$("#casket_sampling_table"))


        }
    , renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='casket_sampling_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (new Date(e.date).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.duty_code ? e.duty_code : null) + "</td>" +
                    "<td>" + e.bowl_code + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
            )
            $tbody.append(content)
        })
       
    }

    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
               /* $.post(home.urls.casketSampling.getAllByPage(),{},function (res) {
                    var items = res.data.content
                    var rawType = null
                    items.forEach(function (e) {
                        if(e.code == code){
                           // console.log(e.rawType)
                            rawType = e.rawType
                        }
                    })

                    $.post(home.urls.plateAudit.getByRawType(),{
                        code:rawType.code
                    }, function(result) {
                       // console.log(rawType)
                        var items = result.data //获取数据
                       // console.log(items)
                        plate_audit.funcs.fill_detail_data($("#edtior_modal"), items,)
                      */
                     casket_sampling.funcs.fill_detail_data($("#casket_sampling_detail_modal"))
                        layer.open({
                            type: 1,
                            title: '闸钵抽检详情',
                            content: $("#casket_sampling_detail_modal"),
                            area: ['710px', '500px'],
                            btn: ['返回'],
                            offset: "auto",
                            closeBtn: 0,
                            yes: function (index) {
                                $("#casket_sampling_detail_modal").css('display', 'none')
                                layer.close(index)
                            }
                        });
                    })
        },
         fill_detail_data: function(div,items){
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
              
                $("#time").text(new Date().Format('yyyy-MM-dd'))
         },
         bindEditorEventListener:function(editBtns) {
             editBtns.off('click').on('click',function() {
                layer.open({
                    type: 1,
                    title: '闸钵抽检详情',
                    content: $("#casket_sampling_detail_modal"),
                    area: ['710px', '500px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#casket_sampling_detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn2: function(index) {
                        $("#casket_sampling_detail_modal").css('display', 'none')
                        layer.close(index)
                     }
                     ,btn3: function(index) {
                        $("#casket_sampling_detail_modal").css('display', 'none')
                        layer.close(index)
                     }
                }); 
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
                                    casket_sampling.init()
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
                    type: 1,
                    title: '闸钵抽检详情',
                    content: $("#casket_sampling_detail_modal"),
                    area: ['710px', '500px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#casket_sampling_detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#casket_sampling_detail_modal").css('display','none')
                        layer.close(index)
                    }
                }); 
             })
         }
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.casket_sampling_checkbox:checked').length === 0) {
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
                             $('.casket_sampling_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                    casket_sampling_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.productOut.deleteByCodeBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(casket_sampling_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            casket_sampling.init()
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
                     casket_sampling.init()
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
         bindSearchEventListener: function (searchBtn) {
             searchBtn.off('click')
             searchBtn.on('click', function () {
                 var auditStatus = $('#audit_name option:selected').val();
                 //var createDate = new Date(order_date.replace(new RegExp("-","gm"),"/")).getTime()
                 //var createDate =order_date.getTime;//毫秒级; // date类型转成long类型
                 $.post(home.urls.casketSampling.getByStatusByPage(), {
                     status: auditStatus
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#plate_audit_table").children('tbody')
                     plate_audit.funcs.renderHandler($tbody, items)
                     layui.laypage.render({
                         elem: 'plate_audit_page'
                         , count: 10 * page.totalPages//数据总数
                         , jump: function (obj, first) {
                             if (!first) {
                                 $.post(home.urls.casketSampling.getByStatusByPage(), {
                                     status: auditStatus,
                                     page: obj.curr - 1,
                                     size: obj.limit
                                 }, function (result) {
                                     var items = result.data.content //获取数据
                                     // var code = $('#model-li-select-48').val()
                                     const $tbody = $("#plate_audit_table").children('tbody')
                                     plate_audit.funcs.renderHandler($tbody, items)
                                     plate_audit.pageSize = result.data.content.length
                                 })
                             }
                         }
                     })
                 })
             })
         }

    }
}