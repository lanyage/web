var batch_abnormal = {
    init: function () {
        batch_abnormal.funcs.renderTable()
        var out = $('#batch_abnormal_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#batch_abnormal_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 136 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.batchAbnormal.getAllByPage(), {}, function (res) {
                var $tbody = $("#batch_abnormal_table").children('tbody')
                var items = res.data.content
                //console.log(items)
               batch_abnormal.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                batch_abnormal.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'batch_abnormal_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.batchAbnormal.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#batch_abnormal_table").children('tbody')
                                batch_abnormal.funcs.renderHandler($tbody, items)
                                batch_abnormal.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            batch_abnormal.funcs.bindAddEvent($('#model_li_hide_add_136'))
            batch_abnormal.funcs.bindDeleteEvent($('#model_li_hide_delete_136'))

            var refreshBtn = $('#model_li_hide_refresh_136');
            batch_abnormal.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_136')
            batch_abnormal.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.batch_abnormal_checkbox:checked').length
            home.funcs.bindSelectAll($("#batch_abnormal_checkAll"),$(".batch_abnormal_checkbox"),checkedBoxLen,$("#batch_abnormal_table"))


        }
    , renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='batch_abnormal_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (new Date(e.date).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.dutyCode?e.dutyCode.code:' ') + "</td>" +
                    "<td>" + (e.batchNumber ? e.batchNumber : ' ') + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
            )
            $tbody.append(content)
        })
        batch_abnormal.funcs.bindDetailEventListener($('.detail'))
        batch_abnormal.funcs.bindEditorEventListener($('.editor'))
        batch_abnormal.funcs.bindDeleteEventListener($('.delete'))

        var checkedBoxLen = $('.batch_abnormal_checkbox:checked').length
        home.funcs.bindSelectAll($("#batch_abnormal_checkAll"),$(".batch_abnormal_checkbox"),checkedBoxLen,$("batch_abnormal_table"))
    }

    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.batchAbnormal.getById(),{
                    code:code
                },function (res) {
                    var items = res.data
                    $('#dutyCode').text(items.dutyCode?items.dutyCode.code:' ')
                    $('#Time').text(new Date(items.time).Format('yyyy-MM-dd'))
                    $('#batchNumber').text(items.batchNumber)
                    $('#abNumber').text(items.abNumber)
                    $('#abWeight').text(items.abWeight)
                    $('#operatorCode').text(items.operator?items.operator.name:' ')
                    $('#checkerCode').text(items.checker?items.checker.name:' ')
               
                    $("#detail_time").text(new Date().Format("yyyy-MM-dd"))
                   
                        layer.open({
                            type: 1,
                            title: '断批异常统计详情',
                            content: $("#batch_abnormal_detail_modal"),
                            area: ['700px', '300px'],
                            btn: ['返回'],
                            offset: "auto",
                            closeBtn: 0,
                            yes: function (index) {
                                $("#batch_abnormal_detail_modal").css('display', 'none')
                                layer.close(index)
                            }
                        });
                })
             })
        },
        
         bindEditorEventListener:function(editBtns) {
             editBtns.off('click').on('click',function() {
                var code = $(this).attr('id').substr(7)
                $.post(home.urls.batchAbnormal.getById(),{
                    code:code
                },function (res) {
                    var items = res.data
                    $tbody = $("#batch_abnormal_editor_modal").children('tbody')
                    $tbody.empty()
                    $("#duty_code").val(items.dutyCode?items.dutyCode.code:' ')
                    $("#E_time").val(new Date(items.time).Format('yyyy-MM-dd'))
                    $("#batch_Number").val(items.batchNumber)
                    $("#ab_number").val(items.abNumber)
                    $("#ab_weight").val(items.abWeight)
                    $("#operator_code").append("<option value="+items.operator.code+">"+items.operator.name+"</option>")
                    $("#checker_code").append("<option value="+items.checker.code+">"+items.checker.name+"</option>")
                    $("#editor_time").text(new Date().Format("yyyy-MM-dd"))
                    $.get(servers.backup()+"user/getAll",{ },function(result){
                        users = result.data
                        users.forEach(function(e){
                            if(items.operator.code!=users.code){
                                $("#operator_code").append(
                                "<option value="+(e.code)+">"+e.name+"</option>"
                            )
                            }
                            if(items.checker.code!=users.code){
                                $("#checker_code").append(
                                "<option value="+(e.code)+">"+e.name+"</option>"
                            )
                            }
                            
                        })
                    })
                 layer.open({
                     type:1,
                     title:'编辑断批异常统计',
                     content:$("#batch_abnormal_editor_modal"),
                     area: ['700px', '300px'],
                     btn:['保存','提交','返回'],
                     offset:"auto",
                     closeBtn:0,
                     yes: function(index) {
                        $("#batch_abnormal_editor_modal").css('display', 'none')
                         var  date = items.date
                         var dutyCode = $("#duty_code").val()
                         var time = new Date($("#E_time").val()).Format('yyyy-MM-dd hh:mm:ss')
                         var batchNumber = $("#batch_Number").val()
                         var abNumber = $("#ab_number").val()
                         var abWeight = $("#ab_weight").val()
                         var checker_code = $("#checker_code").val()
                         var operator_code = $("#operator_code").val()
                         $.post(home.urls.batchAbnormal.update(),{
                            code:code,
                            date: date,
                            'dutyCode.code': dutyCode,
                            time: time,
                            batchNumber: batchNumber,
                            abNumber: abNumber,
                            abWeight: abWeight,
                            'checker.code': checker_code,
                            'operator.code': operator_code,
                            state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    batch_abnormal.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                         })
                     }
                     ,btn2: function(index) {
                        $("#batch_abnormal_editor_modal").css('display', 'none')
                         var  date = items.date
                         var dutyCode = $("#duty_code").val()
                         var time = new Date($("#E_time").val()).Format('yyyy-MM-dd hh:mm:ss')
                         var batchNumber = $("#batch_Number").val()
                         var abNumber = $("#ab_number").val()
                         var abWeight = $("#ab_weight").val()
                         var checker_code = $("#checker_code").val()
                         var operator_code = $("#operator_code").val()
                         $.post(home.urls.batchAbnormal.update(),{
                            code:code,
                            date: date,
                            'dutyCode.code': dutyCode,
                            time: time,
                            batchNumber: batchNumber,
                            abNumber: abNumber,
                            abWeight: abWeight,
                            'checker.code': checker_code,
                            'operator.code': operator_code,
                            state:1
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    batch_abnormal.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                         })
                     }
                     ,btn3: function(index) {
                        $("#batch_abnormal_editor_modal").css('display', 'none')
                        layer.close(index)
                     }
                 })
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
                         $.post(home.urls.batchAbnormal.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    batch_abnormal.init()
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
                $("#duty_code").val('')
                $("#E_time").val('')
                $("#batch_Number").val('')
                $("#ab_number").val('')
                $("#ab_weight").val('')
                $("#editor_time").text(new Date().Format("yyyy-MM-dd"))
                $.get(servers.backup()+"user/getAll",{ },function(result){
                    users = result.data
                    users.forEach(function(e){
                        $("#operator_code").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                            )
                        $("#checker_code").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                        )     
                    })
                })  
                 layer.open({
                     type:1,
                     title:"新增断批异常统计",
                     content:$("#batch_abnormal_editor_modal"),
                     area: ['700px', '300px'],
                     btn:['提交','取消'],
                     offset:'auto',
                     closeBtn:0,
                     yes:function(index) {
                         $("#batch_abnormal_editor_modal").css('display','none')
                         var date = new Date().Format('yyyy-MM-dd')
                         var dutyCode = $("#duty_code").val()
                         var time = new Date().Format('yyyy-MM-dd hh:mm:ss')
                         var batchNumber = $("#batch_Number").val()
                         var abNumber = $("#ab_number").val()
                         var abWeight = $("#ab_weight").val()
                         var checker_code = $("#checker_code").val()
                         var operator_code = $("#operator_code").val()
                         $.post(home.urls.batchAbnormal.add(),{
                            date: date,
                            'dutyCode.code': dutyCode,
                            time: time,
                            batchNumber: batchNumber,
                            abNumber: abNumber,
                            abWeight: abWeight,
                            'checker.code': checker_code,
                            'operator.code': operator_code,
                            state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    batch_abnormal.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                         })
                        /* var data = {
                            date:new Date().Format('yyyy-MM-dd'),
                            dutyCode: {code:$("#duty_code").val()},
                            time:new Date($("#E_time").val()).getTime(),
                            batchNumber:$("#batch_Number").val(),
                            abNumber:$("#ab_number").val(),
                            abWeight:$("#ab_weight").val(),
                            checker:{code:$("#checker_code").val()},
                            operator:{code:$("#operator_code").val()},
                            state:0
                        }
                        $.ajax({
                            url:home.urls.batchAbnormal.add(),
                            contentType:'application/json',
                            data:JSON.stringify(data),
                            dataType:'json',
                            type:'post',
                            success:function(result) {
                                if(result.code === 0) {
                                    var time = setTimeout(function(){
                                        batch_abnormal.init()
                                        clearTimeout(time)
                                    },500)
                                }
                                layer.msg(result.message,{
                                    offset:['40%','55%'],
                                    time:700          
                              })  
                            }                       
                         })*/
                        
                     }
                     ,btn2:function(index){
                         $("#batch_abnormal_editor_modal").css('display','none')
                         layer.close(index)
                     }
                 })
             })
         }
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.batch_abnormal_checkbox:checked').length === 0) {
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
                             var batch_abnormal_codes = []
                             $('.batch_abnormal_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                     batch_abnormal_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.batchAbnormal.deleteByIdBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(batch_abnormal_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            batch_abnormal.init()
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
                     batch_abnormal.init()
                     $('#input_batch_num').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
         bindSearchEventListener: function (searchBtn) {
             searchBtn.off('click')
             searchBtn.on('click', function () {
                 var batch_Number = $('#input_batch_num').val();
                 $.post(home.urls.batchAbnormal.getByBatchNumberLikeByPage(), {
                     batchNumber: batch_Number
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#batch_abnormal_table").children('tbody')
                     batch_abnormal.funcs.renderHandler($tbody, items)
                     layui.laypage.render({
                         elem: 'batch_abnormal_page'
                         , count: 10 * page.totalPages//数据总数
                         , jump: function (obj, first) {
                             if (!first) {
                                 $.post(home.urls.batchAbnormal.getByBatchNumberLikeByPage(), {
                                     batchNumber: batch_Number,
                                     page: obj.curr - 1,
                                     size: obj.limit
                                 }, function (result) {
                                     var items = result.data.content //获取数据
                                     // var code = $('#model-li-select-48').val()
                                     const $tbody = $("#batch_abnormalt_table").children('tbody')
                                     batch_abnormal.funcs.renderHandler($tbody, items)
                                     batch_abnormal.pageSize = result.data.content.length
                                 })
                             }
                         }
                     })
                 })
             })
         }

    }
}