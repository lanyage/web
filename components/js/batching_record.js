var batching_record = {
    init: function () {
        batching_record.funcs.renderTable()
        var out = $('#batching_record_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#batching_record_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 29)
    },
     funcs: {
        renderTable: function () 
        {
            $.post(home.urls.batchingRecord.getAllByPage(), {}, function (res) {
                var $tbody = $("#batching_record_table").children('tbody')
                var items = res.data.content
                batching_record.funcs.renderHandler($tbody, items)
                batching_record.pageSize = res.data.content.length 
                var page = res.data 
                layui.laypage.render({
                    elem: 'batching_record_page',
                    count: 10 * page.totalPages,
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.batchingRecord.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content 
                                const $tbody = $("#batching_record_table").children('tbody')
                                batching_record.funcs.renderHandler($tbody, items)
                                batching_record.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            batching_record.funcs.bindAddEvent($('#model_li_hide_add_29'))
            batching_record.funcs.bindDeleteEvent($('#model_li_hide_delete_29'))

            var refreshBtn = $('#model_li_hide_refresh_29');
            batching_record.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_29')
            batching_record.funcs.bindSearchEventListener(searchBtn)

        },
         renderHandler: function ($tbody,items) {
             $tbody.empty() //清空表格
             items.forEach(function (e) {
                     var code = e.code
                     var content = (
                         "<tr>" +
                         "<td><input type='checkbox' class='batching_record_checkbox' value='" + (e.code) + "'></td>" +
                         "<td>" + e.code + "</td>" +
                         "<td>" + (new Date(e.ingredientsDate).Format('yyyy-MM-dd')) + "</td>" +
                         "<td>" + e.batchNumber + "</td>" +
                         "<td>" + e.ingredientsWeight + "</td>" +
                         "<td>" + e.mixBegintime + "</td>" +
                         "<td>" + e.mixTime + "</td>" +
                         "<td>" + e.mixFrequency + "</td>" +
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
            batching_record.funcs.bindDetailEventListener($('.detail'))
            batching_record.funcs.bindEditorEventListener($('.editor'))
            batching_record.funcs.bindDeleteEventListener($('.delete'))

            var checkedBoxLen = $('.batching_record_checkbox:checked').length
            home.funcs.bindSelectAll($("#batching_record_checkAll"),$(".batching_record_checkbox"),checkedBoxLen,$("#batching_record_table"))
         }
        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.batchingRecord.getById(),{
                    code:code
                },function(result){
                    var items = result.data
                    
                    $("#ingredientsDate").text(items.ingredientsDate)
                    $("#mixBegintime").text(items.mixBegintime)
                    $("#mixTime").text(items.mixTime)
                    $("#mixFrequency").text(items.mixFrequency)
                    $("#batchNumber").text(items.batchNumber)
                    $("#ingredientsWeight").text(items.ingredientsWeight)
                    $("#presomaCode").text(items.presomaCode)
                    $("#presomaWeight").text(items.presomaWeight)
                    $("#lithiumCode").text(items.lithiumCode)
                    $("#lithiumWeight").text(items.lithiumWeight)
                    $("#presomaWeigh").text(items.presomaWeigh)
                    $("#lithiumWeigh").text(items.lithiumWeigh)
                    $("#presomaTare").text(items.presomaTare)
                    $("#lithiumTare").text(items.lithiumTare)
                    $("#presomaSuttle").text(items.presomaSuttle)
                    $("#lithiumSuttle").text(items.lithiumSuttle)
                    $("#presomaAdd").text(items.presomaAdd)
                    $("#lithiumAdd").text(items.lithiumAdd)

                    $("#additiveCode").text(items.additiveCode)
                    $("#additiveModel").text(items.additiveModel)

                    $("#additiveWeight").text(items.additiveWeight)
                    $("#operator").text(items.operator?items.operator.name:'')
                    $("#supervisor").text(items.supervisor?items.supervisor.name:'')
                })
                layer.open({
                    type: 1,
                    title: '配料记录详情',
                    content: $("#batching_record_detail_modal"),
                    area: ['850px', '500px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#batching_record_detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        ,bindEditorEventListener:function(editBtns) {
            editBtns.off('click').on('click',function() {
                var code = $(this).attr('id').substr(7)
                $.post(home.urls.batchingRecord.getById(),{
                    code:code
                },function(result){
                    var items = result.data
                    $("#operator1").empty()
                    $("#supervisor1").empty()
                    $("#ingredientsDate1").val(items.ingredientsDate)
                    $("#mixBegintime1").val(items.mixBegintime)
                    $("#mixTime1").val(items.mixTime)
                    $("#mixFrequency1").val(items.mixFrequency)
                    $("#batchNumber1").val(items.batchNumber)
                    $("#ingredientsWeight1").val(items.ingredientsWeight)
                    $("#presomaCode1").val(items.presomaCode)
                    $("#presomaWeight1").val(items.presomaWeight)
                    $("#lithiumCode1").val(items.lithiumCode)
                    $("#lithiumWeight1").val(items.lithiumWeight)
                    $("#presomaTare1").val(items.presomaTare)
                    $("#lithiumTare1").val(items.lithiumTare)
                    $("#presomaWeigh1").val(items.presomaWeigh)
                    $("#lithiumWeigh1").val(items.lithiumWeigh)
                    $("#presomaSuttle1").val(items.presomaSuttle)
                    $("#lithiumSuttle1").val(items.lithiumSuttle)
                    $("#presomaAdd1").val(items.presomaAdd)
                    $("#lithiumAdd1").val(items.lithiumAdd)
                    $("#additiveCode1").val(items.additiveCode)
                    $("#additiveModel1").val(items.additiveModel)
                    $("#additiveWeight1").val(items.additiveWeight)
               
                    $("#operator1").append("<option value="+items.operator.code+">"+items.operator.name+"</option>")
                    $("#supervisor1").append("<option value="+items.supervisor.code+">"+items.supervisor.name+"</option>")
                
                    $.get(servers.backup()+'user/getAll',{},function(result){
                        var user = result.data
                        user.forEach(function(e){
                            if(items.operator.code!=e.code){
                                $("#operator1").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                            if(items.supervisor.code!=e.code){
                                $("#supervisor1").append("<option value="+e.code+">"+e.name+"</option>")
                            }
                        })
                    })
                layer.open({
                    type:1,
                    title:'编辑预烧记录',
                    content:$("#batching_record_edtior_modal"),
                    area: ['870px', '530px'],
                    btn:['保存','提交','返回'],
                    offset:"auto",
                    closeBtn:0,
                    yes: function(index) {
                       $("#batching_record_edtior_modal").css('display', 'none')
                       var ingredientsDate = $("#ingredientsDate1").val()
                       var mixBegintime = $("#mixBegintime1").val()
                       var mixTime = $("#mixTime1").val()
                       var mixFrequency = $("#mixFrequency1").val()
                       var batchNumber = $("#batchNumber1").val()
                       var ingredientsWeight = $("#ingredientsWeight1").val()
                       var presomaCode = $("#presomaCode1").val()
                       var presomaWeight = $("#presomaWeight1").val()
                       var lithiumCode = $("#lithiumCode1").val()
                       var lithiumWeight = $("#lithiumWeight1").val()
                       var presomaTare = $("#presomaTare1").val()
                       var lithiumTare = $("#lithiumTare1").val()
                       var presomaWeigh = $("#presomaWeigh1").val()
                       var lithiumWeigh = $("#lithiumWeigh1").val()
                       var presomaSuttle = $("#presomaSuttle1").val()
                       var lithiumSuttle = $("#lithiumSuttle1").val()
                       var presomaAdd = $("#presomaAdd1").val()
                       var lithiumAdd = $("#lithiumAdd1").val()
                       var additiveCode = $("#additiveCode1").val()
                       var additiveModel = $("#additiveModel1").val()
                       var additiveWeight = $("#additiveWeight1").val()

                       var operator = $("#operator1").val()
                       var supervisor = $("#supervisor1").val()
                       $.post(home.urls.batchingRecord.update(),{
                           code:code,
                           ingredientsDate:ingredientsDate,
                           mixBegintime:mixBegintime,
                           mixTime:mixTime,
                           mixFrequency:mixFrequency,
                           batchNumber:batchNumber,
                           ingredientsWeight:ingredientsWeight,
                           presomaCode:presomaCode,
                           presomaWeigh:presomaWeigh,
                           presomaWeight:presomaWeight,
                           lithiumCode:lithiumCode,
                           lithiumWeigh:lithiumWeigh,
                           lithiumWeight:lithiumWeight,
                           presomaTare:presomaTare,
                           lithiumTare:lithiumTare,
                           presomaSuttle:presomaSuttle,
                           lithiumSuttle:lithiumSuttle,
                           presomaAdd:presomaAdd,
                           lithiumAdd:lithiumAdd,
                           additiveCode:additiveCode,
                           additiveModel:additiveModel,
                           additiveWeight:additiveWeight,
                           'supervisor.code':supervisor,
                           'operator.code':operator,
                           state:0,
                       },function(result){
                           layer.msg(result.message,{
                               offset:['40%','55%'],
                               time:700
                           })
                           if(result.code===0){
                               var time = setTimeout(function(){
                                   batching_record.init()
                                   clearTimeout(time)
                               },500)
                           }
                       })
                       layer.close(index)
                    }
                    ,btn2: function(index) {
                       $("#batching_record_edtior_modal").css('display', 'none')
                       var ingredientsDate = $("#ingredientsDate1").val()
                       var mixBegintime = $("#mixBegintime1").val()
                       var mixTime = $("#mixTime1").val()
                       var mixFrequency = $("#mixFrequency1").val()
                       var batchNumber = $("#batchNumber1").val()
                       var ingredientsWeight = $("#ingredientsWeight1").val()
                       var presomaCode = $("#presomaCode1").val()
                       var presomaWeight = $("#presomaWeight1").val()
                       var lithiumCode = $("#lithiumCode1").val()
                       var lithiumWeight = $("#lithiumWeight1").val()
                       var presomaTare = $("#presomaTare1").val()
                       var lithiumTare = $("#lithiumTare1").val()
                       var presomaWeigh = $("#presomaWeigh1").val()
                       var lithiumWeigh = $("#lithiumWeigh1").val()
                       var presomaSuttle = $("#presomaSuttle1").val()
                       var lithiumSuttle = $("#lithiumSuttle1").val()
                       var presomaAdd = $("#presomaAdd1").val()
                       var lithiumAdd = $("#lithiumAdd1").val()
                       var additiveCode = $("#additiveCode1").val()
                       var additiveModel = $("#additiveModel1").val()
                       var additiveWeight = $("#additiveWeight1").val()

                       var operator = $("#operator1").val()
                       var supervisor = $("#supervisor1").val()
                       $.post(home.urls.batchingRecord.update(),{
                           code:code,
                           ingredientsDate:ingredientsDate,
                           mixBegintime:mixBegintime,
                           mixTime:mixTime,
                           mixFrequency:mixFrequency,
                           batchNumber:batchNumber,
                           ingredientsWeight:ingredientsWeight,
                           presomaCode:presomaCode,
                           presomaWeigh:presomaWeigh,
                           presomaWeight:presomaWeight,
                           lithiumCode:lithiumCode,
                           lithiumWeigh:lithiumWeigh,
                           lithiumWeight:lithiumWeight,
                           presomaTare:presomaTare,
                           lithiumTare:lithiumTare,
                           presomaSuttle:presomaSuttle,
                           lithiumSuttle:lithiumSuttle,
                           presomaAdd:presomaAdd,
                           lithiumAdd:lithiumAdd,
                           additiveCode:additiveCode,
                           additiveModel:additiveModel,
                           additiveWeight:additiveWeight,
                           'supervisor.code':supervisor,
                           'operator.code':operator,
                           state:1,
                       },function(result){
                           layer.msg(result.message,{
                               offset:['40%','55%'],
                               time:700
                           })
                           if(result.code===0){
                               var time = setTimeout(function(){
                                   batching_record.init()
                                   clearTimeout(time)
                               },500)
                           }
                       })
                       layer.close(index)
                    }
                    ,btn3: function(index) {
                       $("#batching_record_edtior_modal").css('display', 'none')
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
                    area:['180px','129px'],
                    btn:['确认','取消'],
                    offset:['40%','55%'],
                    yes:function(index) {
                        var Code = _this.attr('id').substr(7)
                        $.post(home.urls.batchingRecord.deleteByCode(),{
                            code:Code
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code===0){
                                var time = setTimeout(function(){
                                    batching_record.init()
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        layer.close(index)
                    },
                    btn2: function (index) {
                       layer.close(index)
                   }
                })         
            })
        }
        ,bindAddEvent:function(addBtn){
            addBtn.off('click').on('click',function(){
                $("#ingredientsDate1").val('')
                $("#mixBegintime1").val('')
                $("#mixTime1").val('')
                $("#mixFrequency1").val('')
                $("#batchNumber1").val('')
                $("#ingredientsWeight1").val('')
                $("#presomaCode1").val('')
                $("#presomaWeight1").val('')
                $("#lithiumCode1").val('')
                $("#lithiumWeight1").val('')
                $("#presomaTare1").val('')
                $("#lithiumTare1").val('')
                $("#presomaWeigh1").val('')
                $("#lithiumWeigh1").val('')
                $("#presomaSuttle1").val('')
                $("#lithiumSuttle1").val('')
                $("#presomaAdd1").val('')
                $("#lithiumAdd1").val('')
                $("#additiveCode1").val('')
                $("#additiveModel1").val('')
                $("#additiveWeight1").val('')
           
                $("#operator1").empty()
                $("#supervisor1").empty()
                $.get(servers.backup()+'user/getAll',{},function(result){
                    var user = result.data
                    user.forEach(function(e){
                            $("#operator1").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#supervisor1").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                })
                layer.open({
                    type:1,
                    title:"预烧记录详情",
                    content:$("#batching_record_edtior_modal"),
                    area: ['870px', '530px'],
                    btn:['提交','取消'],
                    offset:'auto',
                    closeBtn:0,
                    yes:function(index) {
                        $("#batching_record_edtior_modal").css('display','none')
                        var ingredientsDate = $("#ingredientsDate1").val()
                        var mixBegintime = $("#mixBegintime1").val()
                        var mixTime = $("#mixTime1").val()
                        var mixFrequency = $("#mixFrequency1").val()
                        var batchNumber = $("#batchNumber1").val()
                        var ingredientsWeight = $("#ingredientsWeight1").val()
                        var presomaCode = $("#presomaCode1").val()
                        var presomaWeight = $("#presomaWeight1").val()
                        var lithiumCode = $("#lithiumCode1").val()
                        var lithiumWeight = $("#lithiumWeight1").val()
                        var presomaTare = $("#presomaTare1").val()
                        var lithiumTare = $("#lithiumTare1").val()
                        var presomaWeigh = $("#presomaWeigh1").val()
                        var lithiumWeigh = $("#lithiumWeigh1").val()
                        var presomaSuttle = $("#presomaSuttle1").val()
                        var lithiumSuttle = $("#lithiumSuttle1").val()
                        var presomaAdd = $("#presomaAdd1").val()
                        var lithiumAdd = $("#lithiumAdd1").val()
                        var additiveCode = $("#additiveCode1").val()
                        var additiveModel = $("#additiveModel1").val()
                        var additiveWeight = $("#additiveWeight1").val()

                       var operator = $("#operator1").val()
                       var supervisor = $("#supervisor1").val()
                       $.post(home.urls.batchingRecord.add(),{
                           ingredientsDate:ingredientsDate,
                           mixBegintime:mixBegintime,
                           mixTime:mixTime,
                           mixFrequency:mixFrequency,
                           batchNumber:batchNumber,
                           ingredientsWeight:ingredientsWeight,
                           presomaCode:presomaCode,
                           presomaWeigh:presomaWeigh,
                           presomaWeight:presomaWeight,
                           lithiumCode:lithiumCode,
                           lithiumWeigh:lithiumWeigh,
                           lithiumWeight:lithiumWeight,
                           presomaTare:presomaTare,
                           lithiumTare:lithiumTare,
                           presomaSuttle:presomaSuttle,
                           lithiumSuttle:lithiumSuttle,
                           presomaAdd:presomaAdd,
                           lithiumAdd:lithiumAdd,
                           additiveCode:additiveCode,
                           additiveModel:additiveModel,
                           additiveWeight:additiveWeight,
                           'supervisor.code':supervisor,
                           'operator.code':operator,
                           state:0,
                       },function(result){
                           layer.msg(result.message,{
                               offset:['40%','55%'],
                               time:700
                           })
                           if(result.code===0){
                               var time = setTimeout(function(){
                                   batching_record.init()
                                   clearTimeout(time)
                               },500)
                           }
                       })
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#batching_record_edtior_modal").css('display','none')
                        layer.close(index)
                    }
                })
            })
        }
        ,bindDeleteEvent:function(deleteBtn){
            deleteBtn.off('click').on('click',function(){
                if($('.batching_record_checkbox:checked').length === 0) {
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
                        area:['190px','129px'],
                        btn:['确认','取消'],
                        offset:['40%','55%'],
                        yes:function(index){
                            var batching_record_codes=[]
                            $('.batching_record_checkbox').each(function() {
                                if($(this).prop('checked')) {
                                    batching_record_codes.push({code:$(this).val()})
                                }
                            })
                            $.ajax({
                               url: home.urls.batchingRecord.deleteByIdBatch(),
                               contentType: 'application/json',
                               data: JSON.stringify(batching_record_codes),
                               dataType: 'json',
                               type: 'post',
                               success: function (result) {
                                   if (result.code === 0) {
                                       var time = setTimeout(function () {
                                           batching_record.init()
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
                    batching_record.init()
                    $("#input_batch_num").val('')
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        }
        ,bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var batchNumber =  $("#input_batch_num").val()
                console.log(batchNumber)
                $.post(home.urls.batchingRecord.getByBatchNumberLikeByPage(), {
                    batchNumber: batchNumber
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#batching_record_table").children('tbody')
                    batching_record.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'batching_record_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.batchingRecord.getByBatchNumberLikeByPage(), {
                                    batchNumber: batchNumber,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    const $tbody = $("#batching_record_table").children('tbody')
                                    batching_record.funcs.renderHandler($tbody, items)
                                    batching_record.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}
