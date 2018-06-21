var process_tracking = {
    init: function () {
        process_tracking.funcs.renderTable()
        var out = $('#process_tracking_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#process_tracking_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.processTracking.getAllByPage(), {page:0}, function (res) {
                console.log(res)
                var $tbody = $("#process_tracking_table").children('tbody')
                var items = res.data.content
                //console.log(items)
                process_tracking.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                process_tracking.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'process_tracking_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.processTracking.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#process_tracking_table").children('tbody')
                                process_tracking.funcs.renderHandler($tbody, items)
                                process_tracking.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            process_tracking.funcs.bindAddEvent($('#model_li_hide_add_34'))
            process_tracking.funcs.bindDeleteEvent($('#model_li_hide_delete_34'))

            var refreshBtn = $('#model_li_hide_refresh_34');
            process_tracking.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_34')
            process_tracking.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.process_tracking_checkbox:checked').length
            home.funcs.bindSelectAll($("#process_tracking_checkAll"),$(".process_tracking_checkbox"),checkedBoxLen,$("#process_tracking_table"))


        }
    , renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='process_tracking_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.premixed_code) + "</td>" +
                    "<td>" + (e.dutyCode ? e.dutyCode.code : '')+ "</td>" +
                    "<td>" + (e.bowlCode ? e.bowlCode : '') + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
            )
            $tbody.append(content)
        })
        process_tracking.funcs.bindDetailEventListener($('.detail'))
        process_tracking.funcs.bindEditorEventListener($('.editor'))
        process_tracking.funcs.bindDeleteEventListener($('.delete'))

        var checkedBoxLen = $('.process_tracking_checkbox:checked').length
        home.funcs.bindSelectAll($("#process_tracking_checkAll"),$(".process_tracking_checkbox"),checkedBoxLen,$("process_tracking_table"))
    }
    

    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.processTracking.getById(),{
                    code:code
                },function(result){
                    var items = result.data
                    $("#dutyCode").text(items.dutyCode?items.dutyCode.code:'')
                    $("#bowlCode").text(items.bowlCode)
                    $("#tare").text(items.tare)
                    $("#total").text(items.total)
                    $("#net").text(items.net)
                    $("#randomCode").text(items.random?items.random.name:'')
                    $("#randomTime").text(new Date(items.randomTime).Format('yyyy-MM-dd hh:mm:ss'))
                    $("#inspectorCode").text(items.inspector?items.inspector.name:'')
                    $("#inspectorTime").text(new Date(items.inspectorTime).Format('yyyy-MM-dd hh:mm:ss'))
                    $('#detail_time').text(new Date().Format('yyyy-MM-dd'))  
               
                //process_tracking.funcs.fill_detail_data($("#process_tracking_detail_modal"))
                layer.open({
                    type: 1,
                    title: '闸钵抽检详情',
                    content: $("#process_tracking_detail_modal"),
                    area: ['1000px', '280px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#process_tracking_detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });        
             }) 
        })    
        },
        
         bindEditorEventListener:function(editBtns) {
             editBtns.off('click').on('click',function() {
                 var code = $(this).attr('id').substr(7) 
                 $.post(home.urls.processTracking.getById(),{
                     code:code
                 },function(result){
                     items = result.data
                $("#dutyCode1").val(items.dutyCode?items.dutyCode.code:'')
                $("#bowlCode1").val(items.bowlCode)
                $("#tare1").val(items.tare)
                $("#total1").val(items.total)
                $("#net1").val(items.net)
                $("#randomCode1").append("<option value="+items.random.code+">"+items.random.name+"</option>")
                $("#randomTime1").val(new Date(items.randomTime).Format('yyyy-MM-dd hh:mm:ss'))
                $("#inspectorCode1").append("<option value="+items.inspector.code+">"+items.inspector.name+"</option>")
                $("#inspectorTime1").val(new Date(items.inspectorTime).Format('yyyy-MM-dd hh:mm:ss'))
                $('#editor_time').text(new Date().Format('yyyy-MM-dd'))  

                $.get(servers.backup()+"user/getAll",{ },function(result){
                    users = result.data
                    users.forEach(function(e){
                        if(items.random.code!=users.code){
                            $("#randomCode1").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                        )
                        }
                        if(items.inspector.code!=users.code){
                            $("#inspectorCode1").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                        )
                        }
                        
                    })
                })
                layer.open({
                    type: 1,
                    title: '编辑匣钵抽检',
                    content: $("#process_tracking_editor_modal"),
                    area: ['1000px', '280px'],
                    btn: ['确定','提交','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#process_tracking_editor_modal").css('display', 'none')
                         var dutyCode = $("#dutyCode1").val()
                         var bowlCode = $("#bowlCode1").val()
                         var tare = $("#tare1").val()
                         var total =  $("#total1").val()
                         var net =  $("#net1").val()
                         var randomCode =  $("#randomCode1").val()
                         var randomTime =  new Date($("#randomTime1").val()).Format('yyyy-MM-dd hh:mm:ss')
                         var inspectorCode =  $("#inspectorCode1").val()
                         var inspectorTime =  new Date($("#inspectorTime1").val()).Format('yyyy-MM-dd hh:mm:ss')
                         console.log(randomCode)
                         console.log(inspectorCode)
                         $.post(home.urls.processTracking.update(),{
                             code:code,
                             date:new Date(items.date).Format('yyyy-MM-dd'),
                             dutyCode:dutyCode,
                             bowlCode:bowlCode,
                             tare:tare,
                             total:total,
                             net:net,
                             'random.code':randomCode,
                             randomTime:randomTime,
                             'inspector.code':inspectorCode,
                             inspectorTime:inspectorTime,
                             state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     process_tracking.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                    }
                    ,btn2: function(index) {
                        $("#process_tracking_editor_modal").css('display', 'none')
                         var dutyCode = $("#dutyCode1").val()
                         var bowlCode = $("#bowlCode1").val()
                         var tare = $("#tare1").val()
                         var total =  $("#total").val()
                         var net =  $("#net1").val()
                         var randomCode =  $("#randomCode1").val()
                         var randomTime =  $("#randomTime1").val()
                         var inspectorCode =  $("#inspectorCode1").val()
                         var inspectorTime =  $("#inspectorTime1").val()
                         $.post(home.urls.processTracking.update(),{
                             code:code,
                             date:new Date(items.date).Format('yyyy-MM-dd'),
                             dutyCode:dutyCode,
                             bowlCode:bowlCode,
                             tare:tare,
                             total:total,
                             net:net,
                             randomCode:randomCode,
                             randomTime:new Date(randomTime).Format('yyyy-MM-dd hh:mm:ss'),
                             inspectorCode:inspectorCode,
                             inspectorTime:new Date(inspectorTime).Format('yyyy-MM-dd hh:mm:ss'),
                             state:1
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     process_tracking.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                     }
                     ,btn3: function(index) {
                        $("#process_tracking_editor_modal").css('display', 'none')
                        layer.close(index)
                     }
                }); 
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
                         $.post(home.urls.processTracking.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    process_tracking.init()
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
                $("#dutyCode1").val('')
                $("#bowlCode1").val('')
                $("#tare1").val('')
                $("#total1").val('')
                $("#net1").val('')
                //$("#randomCode1").val('')
                $("#randomTime1").val('')
                $("#inspectorCode1").val('')
                //$("#inspectorTime1").val('')
                $('#editor_time').text(new Date().Format('yyyy-MM-dd'))  
                $.get(servers.backup()+"user/getAll",{ },function(result){
                    users = result.data
                    users.forEach(function(e){
                        $("#randomCode1").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                        )
                        $("#inspectorCode1").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                        )
                    })
                })
                layer.open({
                    type: 1,
                    title: '新增匣钵抽检',
                    content: $("#process_tracking_editor_modal"),
                    area: ['1000px', '280px'],
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#process_tracking_editor_modal").css('display', 'none')
                         var dutyCode = $("#dutyCode1").val()
                         var bowlCode = $("#bowlCode1").val()
                         var tare = $("#tare1").val()
                         var total =  $("#total1").val()
                         var net =  $("#net1").val()
                         var randomCode =  $("#randomCode1").val()
                         var randomTime =  new Date($("#randomTime1").val()).Format('yyyy-MM-dd hh:mm:ss')
                         var inspectorCode =  $("#inspectorCode1").val()
                         var inspectorTime =  new Date($("#inspectorTime1").val()).Format('yyyy-MM-dd hh:mm:ss')
                         $.post(home.urls.processTracking.add(),{
                             date:new Date().Format('yyyy-MM-dd'),
                             dutyCode:dutyCode,
                             bowlCode:bowlCode,
                             tare:tare,
                             total:total,
                             net:net,
                             'random.code':randomCode,
                             randomTime:randomTime,
                             'inspector.code':inspectorCode,
                             inspectorTime:inspectorTime,
                             state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     process_tracking.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#process_tracking_editor_modal").css('display','none')
                        layer.close(index)
                    }
                }); 
             })
         }
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.process_tracking_checkbox:checked').length === 0) {
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
                             var process_tracking_codes=[]
                             $('.process_tracking_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                    process_tracking_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.processTracking.deleteByIdBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(process_tracking_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            process_tracking.init()
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
                     process_tracking.init()
                     $('#input_batch_num').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
         bindSearchEventListener: function (searchBtn) {
             searchBtn.off('click')
             searchBtn.on('click', function () {
                 var premixedCode = $('#input_batch_num').val()
                 //var createDate = new Date(order_date.replace(new RegExp("-","gm"),"/")).getTime()
                 //var createDate =order_date.getTime;//毫秒级; // date类型转成long类型
                 $.post(home.urls.processTracking.getByPremixedCodeLikeByPage(), {
                    premixedCode: premixedCode
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#process_tracking_table").children('tbody')
                     process_tracking.funcs.renderHandler($tbody, items)
                     layui.laypage.render({
                         elem: 'process_tracking_page'
                         , count: 10 * page.totalPages//数据总数
                         , jump: function (obj, first) {
                             if (!first) {
                                 $.post(home.urls.processTracking.getByPremixedCodeLikeByPage(), {
                                    premixedCode: premixedCode,
                                     page: obj.curr - 1,
                                     size: obj.limit
                                 }, function (result) {
                                     var items = result.data.content //获取数据
                                     // var code = $('#model-li-select-48').val()
                                     const $tbody = $("#process_tracking_table").children('tbody')
                                     process_tracking.funcs.renderHandler($tbody, items)
                                     process_tracking.pageSize = result.data.content.length
                                 })
                             }
                         }
                     })
                 })
             })
         }

    }
}