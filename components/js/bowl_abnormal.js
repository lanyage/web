var bowl_abnormal = {
    init: function () {
        bowl_abnormal.funcs.renderTable()
        var out = $('#bowl_abnormal_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#bowl_abnormal_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.plateAlarm.getAllByPage(), {}, function (res) {
                var $tbody = $("#bowl_abnormal_table").children('tbody')
                var items = res.data.content
                //console.log(items)
              //  bowl_abnormal.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                bowl_abnormal.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'bowl_abnormal_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.plateAlarm.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#bowl_abnormal_table").children('tbody')
                                bowl_abnormal.funcs.renderHandler($tbody, items)
                                bowl_abnormal.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            bowl_abnormal.funcs.bindDetailEventListener($('.detail'))
            bowl_abnormal.funcs.bindEditorEventListener($('.editor'))
            bowl_abnormal.funcs.bindDeleteEventListener($('.delete'))

            bowl_abnormal.funcs.bindAddEvent($('#model_li_hide_add_33'))
            bowl_abnormal.funcs.bindDeleteEvent($('#model_li_hide_delete_33'))

            var refreshBtn = $('#model_li_hide_refresh_33');
            bowl_abnormal.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_33')
            bowl_abnormal.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.bowl_abnormal_checkbox:checked').length
            home.funcs.bindSelectAll($("#bowl_abnormal_checkAll"),$(".bowl_abnormal_checkbox"),checkedBoxLen,$("#bowl_abnormal_table"))


        }
    , renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='bowl_abnormal_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.rawType ? e.rawType.code : null) + "</td>" +
                    "<td>" + (new Date(e.applyTime).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.processManage ? e.processManage.code : null) + "</td>" +
                    "<td>" + e.auditStatus + "</td>" +
                    "<td><a href=\"#\" class='verify'id='verify-" + (code) + "'><i class=\"layui-icon\">&#xe6b2;</i></a></td>" +
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
               /* $.post(home.urls.plateAlarm.getAllByPage(),{},function (res) {
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
                        //plate_audit.funcs.fill_detail_data($("#edtior_modal"), items,)
                      */
                        layer.open({
                            type: 1,
                            title: '装钵异常详情',
                            content: $("#bowl_abnormal_detail_modal"),
                            area: ['800px', '350px'],
                            btn: ['返回'],
                            offset: "auto",
                            closeBtn: 0,
                            yes: function (index) {
                                $("#bowl_abnormal_detail_modal").css('display', 'none')
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
                     title:'编辑装钵异常',
                     content:$("#bowl_abnormal_detail_modal"),
                     area: ['800px', '350px'],
                     btn:['保存','提交','返回'],
                     offset:"auto",
                     closeBtn:0,
                     yes: function(index) {
                        $("#bowl_abnormal_detail_modal").css('display', 'none')
                        layer.close(index)
                     }
                     ,btn2: function(index) {
                        $("#bowl_abnormal_detail_modal").css('display', 'none')
                        layer.close(index)
                     }
                     ,btn3: function(index) {
                        $("#bowl_abnormal_detail_modal").css('display', 'none')
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
                     title:"新增装钵异常",
                     content:$("#bowl_abnormal_detail_modal"),
                     area: ['800px', '350px'],
                     btn:['提交','取消'],
                     offset:'auto',
                     closeBtn:0,
                     yes:function(index) {
                         $("#bowl_abnormal_detail_modal").css('display','none')
                         layer.close(index)
                     }
                     ,btn2:function(index){
                         $("#bowl_abnormal_detail_modal").css('display','none')
                         layer.close(index)
                     }
                 })
             })
         }
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.bowl_abnormal_checkbox:checked').length === 0) {
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
                             $('.bowl_abnormal_checkbox').each(function() {
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
                     plate_audit.init()
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
                 $.post(home.urls.plateAlarm.getByStatusByPage(), {
                     status: auditStatus
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#bowl_abnormal_table").children('tbody')
                     bowl_abnormal.funcs.renderHandler($tbody, items)
                     layui.laypage.render({
                         elem: 'bowl_abnormal_page'
                         , count: 10 * page.totalPages//数据总数
                         , jump: function (obj, first) {
                             if (!first) {
                                 $.post(home.urls.plateAlarm.getByStatusByPage(), {
                                     status: auditStatus,
                                     page: obj.curr - 1,
                                     size: obj.limit
                                 }, function (result) {
                                     var items = result.data.content //获取数据
                                     // var code = $('#model-li-select-48').val()
                                     const $tbody = $("#bowl_abnormalt_table").children('tbody')
                                     bowl_abnormal.funcs.renderHandler($tbody, items)
                                     bowl_abnormal.pageSize = result.data.content.length
                                 })
                             }
                         }
                     })
                 })
             })
         }

    }
}