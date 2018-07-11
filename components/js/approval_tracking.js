var approval_tracking = {
    init: function () {
        approval_tracking.funcs.renderTable()
        var out = $('#approval_tracking_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#approval_tracking').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.approvalTracking.getAllByPage(), {page:0}, function (res) {
                var $tbody = $("#approval_tracking_table").children('tbody')
                var items = res.data.content
                approval_tracking.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                approval_tracking.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'approval_tracking_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.approvalTracking.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#approval_tracking_table").children('tbody')
                                approval_tracking.funcs.renderHandler($tbody, items)
                                approval_tracking.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            approval_tracking.funcs.bindAddEvent($('#model_li_hide_add_35'))
            approval_tracking.funcs.bindDeleteEvent($('#model_li_hide_delete_35'))

            var refreshBtn = $('#model_li_hide_refresh_35');
            approval_tracking.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_35')
            approval_tracking.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.approval_tracking_checkbox:checked').length
            home.funcs.bindSelectAll($("#approval_tracking_checkAll"),$(".approval_tracking_checkbox"),checkedBoxLen,$("#approval_tracking_table"))


        }
    , renderHandler: function ($tbody, items) {
        $tbody.empty() //清空表格
        var i = 1
        items.forEach(function (e) {
            var code = e.code
            var content = (
                "<tr>" +
                    "<td><input type='checkbox' class='approval_tracking_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + (e.packagingCode) + "</td>" +
                    "<td>" + (e.packagingWeight ? e.packagingWeight: '')+ "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
            )
            $tbody.append(content)
            if(e.state === true){
                $("#editor-"+(code)+"").removeClass("editor").addClass("disableHref")
                $("#delete-"+(code)+"").removeClass("delete").addClass("disableHref")
            } 
        })
        approval_tracking.funcs.bindDetailEventListener($('.detail'))
        approval_tracking.funcs.bindEditorEventListener($('.editor'))
        approval_tracking.funcs.bindDeleteEventListener($('.delete'))

        var checkedBoxLen = $('.approval_tracking_checkbox:checked').length
        home.funcs.bindSelectAll($("#approval_tracking_checkAll"),$(".approval_tracking_checkbox"),checkedBoxLen,$("approval_tracking_table"))
    }
    

    , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.approvalTracking.getById(),{
                    code:code
                },function(result){
                    var items = result.data
                    if(items.slotsNormal1===true){
                        slotsNormal1 = '正常'
                    }else{
                        slotsNormal1 = '异常'
                    }
                    if(items.slotsNormal2===true){
                        slotsNormal2 = '正常'
                    }else{
                        slotsNormal2 = '异常'
                    }
                    if(items.screenNormal===true){
                        screenNormal = '正常'
                    }else{
                        screenNormal = '异常'
                    }
                    $("#packagingCode").text(items.packagingCode?items.packagingCode:'')
                    $("#packagingWeight").text(items.packagingWeight)
                    $("#materialCode").text(items.materialCode)
                    $("#warehousingOperator").text(items.warehousingOperator?items.warehousingOperator.name:'')
                    $("#packagingOperator").text(items.packagingOperator?items.packagingOperator.name:'')
                   
                    $("#warehouseCode").text(items.warehouseCode)
                    $("#slotsNormal1").text(slotsNormal1)
                    $("#warehousingDate").text(items.warehousingDate?items.warehousingDate:'')
                    $("#warehousingWeight").text(items.warehousingWeight?items.warehousingWeight:'')
                    $("#slotsNormal2").text(slotsNormal2)

                    $("#packagingDate").text(items.packagingDate?items.packagingDate:'')
                    $("#mixTime").text(items.mixTime?new Date(items.mixTime).Format('yyyy-MM-dd hh:mm:ss'):'')
                    $("#chillerTemperature").text(items.chillerTemperature)
                    $("#packingroomTemperature").text(items.packingroomTemperature)
                    $("#packingroomHumidity").text(items.packingroomHumidity)

                    $("#defeWeight").text(items.defeWeight)
                    $("#slotsLeft").text(items.slotsLeft?items.slotsLeft:'')
                    $("#screenNormal").text(screenNormal)
                layer.open({
                    type: 1,
                    title: '合批详情',
                    content: $("#approval_tracking_detail_modal"),
                    area: ['1200px', '400px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#approval_tracking_detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });        
             }) 
        })    
        },
        
         bindEditorEventListener:function(editBtns) {
             editBtns.off('click').on('click',function() {
                 var code = $(this).attr('id').substr(7) 
                 $.post(home.urls.approvalTracking.getById(),{
                     code:code
                 },function(result){
                    items = result.data
                    var slotsNormal1,slotsNormal2,screenNormal
                    if(items.slotsNormal1===true){
                        slotsNormal1 = '正常'
                    }else{
                        slotsNormal1 = '异常'
                    }
                    if(items.slotsNormal2===true){
                        slotsNormal2 = '正常'
                    }else{
                        slotsNormal2 = '异常'
                    }
                    if(items.screenNormal===true){
                        screenNormal = '正常'
                    }else{
                        screenNormal = '异常'
                    }
                    
                    $("#packagingCode1").val(items.packagingCode?items.packagingCode:'')
                    $("#packagingWeight1").val(items.packagingWeight)
                    $("#materialCode1").val(items.materialCode)
                    $("#warehousingOperator1").append("<option value="+items.warehousingOperator.code+">"+items.warehousingOperator.name+"</option>")
                    $("#packagingOperator1").append("<option value="+items.packagingOperator.code+">"+items.packagingOperator.name+"</option>")
                    
                    $("#warehouseCode1").val(items.warehouseCode)
                    $("#slotsNormal11").val(slotsNormal1)
                    $("#warehousingDate1").val(items.warehousingDate?items.warehousingDate:'')
                    $("#warehousingWeight1").val(items.warehousingWeight?items.warehousingWeight:'')
                    $("#slotsNormal21").val(slotsNormal2)

                    $("#packagingDate1").val(items.packagingDate?items.packagingDate:'')
                    $("#mixTime1").val(items.mixTime?new Date(items.mixTime).Format('yyyy-MM-dd hh:mm:ss'):'')
                    $("#chillerTemperature1").val(items.chillerTemperature)
                    $("#packingroomTemperature1").val(items.packingroomTemperature)
                    $("#packingroomHumidity").val(items.packingroomHumidity)

                    $("#defeWeight1").val(items.defeWeight)
                    $("#slotsLeft1").val(items.slotsLeft?items.slotsLeft:'')
                    $("#screenNormal1").val(screenNormal)

                    $.get(servers.backup()+"user/getAll",{ },function(result){
                        users = result.data
                        users.forEach(function(e){
                            if(items.warehousingOperator.code!=users.code){
                                $("#warehousingOperator1").append(
                                "<option value="+(e.code)+">"+e.name+"</option>"
                            )
                            }
                            if(items.packagingOperator.code!=users.code){
                                $("#packagingOperator1").append(
                                "<option value="+(e.code)+">"+e.name+"</option>"
                            )
                            }
                            
                        })
                    })
                layer.open({
                    type: 1,
                    title: '编辑合批',
                    content: $("#approval_tracking_editor_modal"),
                    area: ['1200px', '430px'],
                    btn: ['确定','提交','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#approval_tracking_editor_modal").css('display', 'none')
                         var packagingCode = $("#packagingCode1").val()
                         var packagingWeight = $("#packagingWeight1").val()
                         var materialCode = $("#materialCode1").val()
                         var warehousingOperator =  $("#warehousingOperator1").val()
                         var packagingOperator =  $("#packagingOperator1").val()
                         var warehouseCode =  $("#warehouseCode1").val()
                         var slotsNormal1 = $("#slotsNormal11").val()
                         var warehousingDate = $("#warehousingDate1").val()
                         var warehousingWeight = $("#warehousingWeight1").val()
                         var slotsNormal2 =  $("#slotsNormal21").val()
                         var packagingDate =  $("#packagingDate1").val()
                         var mixTime =  $("#mixTime1").val()
                         var chillerTemperature =  $("#chillerTemperature1").val()
                         var packingroomTemperature = $("#packingroomTemperature1").val()
                         var packingroomHumidity =  $("#packingroomHumidity1").val()
                         var defeWeight =  $("#defeWeight1").val()
                         var slotsLeft =  $("#slotsLeft1").val()
                         var screenNormal =  $("#screenNormal1").val()
                         $.post(home.urls.approvalTracking.update(),{
                             code:code,
                             packagingCode:packagingCode,
                             packagingWeight:packagingWeight,
                             materialCode:materialCode,
                             'warehousingOperator.code':warehousingOperator,
                             'packagingOperator.code':packagingOperator,
                             warehouseCode:warehouseCode,
                             slotsNormal1:slotsNormal1,
                             warehousingDate:warehousingDate,
                             warehousingWeight:warehousingWeight,
                             slotsNormal2:slotsNormal2,
                             packagingDate:packagingDate,
                             mixTime:mixTime,
                             chillerTemperature:chillerTemperature,
                             packingroomTemperature:packingroomTemperature,
                             packingroomHumidity:packingroomHumidity,
                             defeWeight:defeWeight,
                             slotsLeft:slotsLeft,
                             screenNormal:screenNormal,
                             state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     approval_tracking.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                    }
                    ,btn2: function(index) {
                        $("#approval_tracking_editor_modal").css('display', 'none')
                        var packagingCode = $("#packagingCode1").val()
                        var packagingWeight = $("#packagingWeight1").val()
                        var materialCode = $("#materialCode1").val()
                        var warehousingOperator =  $("#warehousingOperator1").val()
                        var packagingOperator =  $("#packagingOperator1").val()
                        var warehouseCode =  $("#warehouseCode1").val()
                        var slotsNormal1 = $("#slotsNormal11").val()
                        var warehousingDate = $("#warehousingDate").val()
                        var warehousingWeight = $("#warehousingWeight1").val()
                        var slotsNormal2 =  $("#slotsNormal21").val()
                        var packagingDate =  $("#packagingDate1").val()
                        var mixTime =  $("#mixTime").val()
                        var chillerTemperature =  $("#chillerTemperature1").val()
                        var packingroomTemperature = $("#packingroomTemperature1").val()
                        var packingroomHumidity =  $("#packingroomHumidity").val()
                        var defeWeight =  $("#defeWeight1").val()
                        var slotsLeft =  $("#slotsLeft1").val()
                        var screenNormal =  $("#screenNormal1").val()
                        var entryTime = new Date().Format('yyyy-MM-dd')
                        $.post(home.urls.approvalTracking.update(),{
                            code:code,
                            packagingCode:packagingCode,
                            packagingWeight:packagingWeight,
                            materialCode:materialCode,
                            'warehousingOperator.code':warehousingOperator,
                            'packagingOperator.code':packagingOperator,
                            warehouseCode:warehouseCode,
                            slotsNormal1:slotsNormal1,
                            warehousingDate:warehousingDate,
                            warehousingWeight:warehousingWeight,
                            slotsNormal2:slotsNormal2,
                            packagingDate:packagingDate,
                            mixTime:mixTime,
                            chillerTemperature:chillerTemperature,
                            packingroomTemperature:packingroomTemperature,
                            packingroomHumidity:packingroomHumidity,
                            defeWeight:defeWeight,
                            slotsLeft:slotsLeft,
                            screenNormal:screenNormal,
                            state:1
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     approval_tracking.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                     }
                     ,btn3: function(index) {
                        $("#approval_tracking_editor_modal").css('display', 'none')
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
                         $.post(home.urls.approvalTracking.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    approval_tracking.init()
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
                 $("#packagingCode1").val('')
                 $("#packagingWeight1").val('')
                 $("#materialCode1").val('')
                 $("#warehousingOperator1").empty()
                 $("#packagingOperator1").empty()
                
                 $("#warehouseCode1").val('')
                 $("#slotsNormal11").val('')
                 $("#warehousingDate1").val('')
                 $("#warehousingWeight1").val('')
                 $("#slotsNormal21").val('')

                 $("#packagingDate1").val('')
                 $("#mixTime1").val('')
                 $("#chillerTemperature1").val('')
                 $("#packingroomTemperature1").val('')
                 $("#packingroomHumidity").val('')

                 $("#defeWeight1").val('')
                 $("#slotsLeft1").val('')
                 $("#screenNormal1").val('')     
                 $.get(servers.backup()+"user/getAll",{ },function(result){
                    users = result.data
                    users.forEach(function(e){
                        $("#warehousingOperator1").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                        )
                        $("#packagingOperator1").append(
                            "<option value="+(e.code)+">"+e.name+"</option>"
                        )
                    })
                })
                layer.open({
                    type: 1,
                    title: '新增合批',
                    content: $("#approval_tracking_editor_modal"),
                    area: ['1200px', '430px'],
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#approval_tracking_editor_modal").css('display', 'none')
                        var packagingCode = $("#packagingCode1").val()
                        var packagingWeight = $("#packagingWeight1").val()
                        var materialCode = $("#materialCode1").val()
                        var warehousingOperator =  $("#warehousingOperator1").val()
                        var packagingOperator =  $("#packagingOperator1").val()
                        var warehouseCode =  $("#warehouseCode1").val()
                        var slotsNormal1 = $("#slotsNormal11").val()
                        var warehousingDate = $("#warehousingDate1").val()
                        var warehousingWeight = $("#warehousingWeight1").val()
                        var slotsNormal2 =  $("#slotsNormal21").val()
                        var packagingDate =  $("#packagingDate1").val()
                        var mixTime =  $("#mixTime1").val()
                        var chillerTemperature =  $("#chillerTemperature1").val()
                        var packingroomTemperature = $("#packingroomTemperature1").val()
                        var packingroomHumidity =  $("#packingroomHumidity1").val()
                        var defeWeight =  $("#defeWeight1").val()
                        var slotsLeft =  $("#slotsLeft1").val()
                        var screenNormal =  $("#screenNormal1").val()
                        $.post(home.urls.approvalTracking.add(),{
                            packagingCode:packagingCode,
                            packagingWeight:packagingWeight,
                            materialCode:materialCode,
                            'warehousingOperator.code':warehousingOperator,
                            'packagingOperator.code':packagingOperator,
                            warehouseCode:warehouseCode,
                            slotsNormal1:slotsNormal1,
                            warehousingDate:warehousingDate,
                            warehousingWeight:warehousingWeight,
                            slotsNormal2:slotsNormal2,
                            packagingDate:packagingDate,
                            mixTime:mixTime,
                            chillerTemperature:chillerTemperature,
                            packingroomTemperature:packingroomTemperature,
                            packingroomHumidity:packingroomHumidity,
                            defeWeight:defeWeight,
                            slotsLeft:slotsLeft,
                            screenNormal:screenNormal,
                            state:0
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                             })
                             if(result.code===0){
                                 var time = setTimeout(function(){
                                     approval_tracking.init()
                                     clearTimeout(time)
                                 },500)
                             }
                         })
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#approval_tracking_editor_modal").css('display','none')
                        layer.close(index)
                    }
                }); 
             })
         }
         ,bindDeleteEvent:function(deleteBtn){
             deleteBtn.off('click').on('click',function(){
                 if($('.approval_tracking_checkbox:checked').length === 0) {
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
                             var approval_tracking_codes=[]
                             $('.approval_tracking_checkbox').each(function() {
                                 if($(this).prop('checked')) {
                                    approval_tracking_codes.push({code:$(this).val()})
                                 }
                             })
                             $.ajax({
                                url: home.urls.approvalTracking.deleteByIdBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(approval_tracking_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            approval_tracking.init()
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
                     approval_tracking.init()
                     $('#input_batch_num').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
         bindSearchEventListener: function (searchBtn) {
             searchBtn.off('click')
             searchBtn.on('click', function () {
                 var packagingCode = $('#input_batch_num').val()
                 //var createDate = new Date(order_date.replace(new RegExp("-","gm"),"/")).getTime()
                 //var createDate =order_date.getTime;//毫秒级; // date类型转成long类型
                 $.post(home.urls.approvalTracking.getByPackagingCodeLikeByPage(), {
                    packagingCode: packagingCode
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#approval_tracking_table").children('tbody')
                     approval_tracking.funcs.renderHandler($tbody, items)
                     layui.laypage.render({
                         elem: 'approval_tracking_page'
                         , count: 10 * page.totalPages//数据总数
                         , jump: function (obj, first) {
                             if (!first) {
                                 $.post(home.urls.approvalTracking.getByPackagingCodeLikeByPage(), {
                                    packagingCode: packagingCode,
                                     page: obj.curr - 1,
                                     size: obj.limit
                                 }, function (result) {
                                     var items = result.data.content //获取数据
                                     // var code = $('#model-li-select-48').val()
                                     const $tbody = $("#approval_tracking_table").children('tbody')
                                     approval_tracking.funcs.renderHandler($tbody, items)
                                     approval_tracking.pageSize = result.data.content.length
                                 })
                             }
                         }
                     })
                 })
             })
         }

    }
}