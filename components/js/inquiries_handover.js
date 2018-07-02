var inquiries_handover = {
    init: function () {
        inquiries_handover.funcs.renderTable()
        var out = $('#inquiries_handover_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#inquiries_handover_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.handoverHeader.getAllByPage(), {page:0}, function (res) {
                var $tbody = $("#inquiries_handover_table").children('tbody')
                var items = res.data.content
                inquiries_handover.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                inquiries_handover.pageSize = res.data.content.length 
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'inquiries_handover_page',
                    count: 10 * page.totalPages,
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.handoverHeader.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content 
                                const $tbody = $("#inquiries_handover_table").children('tbody')
                                inquiries_handover.funcs.renderHandler($tbody, items)
                                inquiries_handover.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            inquiries_handover.funcs.bindSearchEventListener($("#model_li_hide_search_138"))
            inquiries_handover.funcs.bindRefreshEventListener($("#model_li_hide_refresh_138"))
            var checkedBoxLen = $('.inquiries_handover_checkbox:checked').length
            home.funcs.bindSelectAll($("#inquiries_handover_checkAll"),$(".inquiries_handover_checkbox"),checkedBoxLen,$("#inquiries_handover_table"))
        }
    , renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='inquiries_handover_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.jobsCode?e.jobsCode.name:' ') + "</td>" +
                    "<td>" + (e.handoverDate ? e.handoverDate: '')+ "</td>" +
                    "<td>" + (e.dutyCode?e.dutyCode.name:' ') + "</td>" +
                    "<td>" + (e.shifterCode? e.shifterCode.name: '')+ "</td>" +
                    "<td>" + (e.successorCode? e.successorCode.name: '')+ "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "</tr>"
            )
            $tbody.append(content)
        })
        inquiries_handover.funcs.bindDetailEventListener($('.detail'))

        var checkedBoxLen = $('.inquiries_handover_checkbox:checked').length
        home.funcs.bindSelectAll($("#inquiries_handover_checkAll"),$(".inquiries_handover_checkbox"),checkedBoxLen,$("inquiries_handover_table"))
    }
    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.handoverHeader.getByCode(),{
                    code:code
                },function(result){
                    var items = result.data
                    $("#date").text(items.handoverDate)
                    $("#dutyCode").text(items.dutyCode.name)
                    $("#shifterCode").text(items.shifterCode.name)
                    $("#successorCode").text(items.successorCode.name)
                    
                    inquiries_handover.funcs.fill_data(items)
                layer.open({
                    type: 1,
                    title: '交接记录内容详情',
                    content: $("#inquiries_handover_detail_modal"),
                    area: ['1200px', '500px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#inquiries_handover_detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });        
             }) 
        })    
        }
        ,fill_data:function(items){
            var handoverRecords = items.handoverRecords
            $tbody = $("#inquiries_handover_detail_table").children('tbody')
            $tbody.empty()
            var i = 1
            handoverRecords.forEach(function(e){
                $tbody.append(
                    "<tr>"+
                    "<td>"+(i++)+"</td>"+
                    "<td>"+(e.contentCode?e.contentCode.name:'')+"</td>"+
                    "<td>"+(e.stateCode?e.stateCode.name:'')+"</td>"+
                    "</tr>"
                )
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
                         $.post(home.urls.handoverHeader.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    inquiries_handover.init()
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
         
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.inquiries_handover_checkbox:checked').length === 0) {
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
                             var inquiries_handover_codes=[]
                             $('.inquiries_handover_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                    inquiries_handover_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.handoverHeader.deleteByIdBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(inquiries_handover_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            inquiries_handover.init()
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
                     inquiries_handover.init()
                     $('#input_name').val('')
                     $('#input_time').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         }
          /** 搜索事件 */
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var name = $('#input_name').val()
                var date = $("#input_time").val()
                $.post(home.urls.handoverHeader.getByJobsNameLikeAndHandoverDateByPage(), {
                    jobsName: name,
                    handoverDate: date
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#inquiries_handover_table").children('tbody')
                    inquiries_handover.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'inquiries_handover_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.handoverHeader.getByJobsNameLikeAndHandoverDateByPage(), {
                                    jobsName: name,
                                    handoverDate: date,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#inquiries_handover_table").children('tbody')
                                    inquiries_handover.funcs.renderHandler($tbody, items)
                                    inquiries_handover.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
    }
}