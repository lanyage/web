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

            var checkedBoxLen = $('.batching_record_checkbox:checked').length
            home.funcs.bindSelectAll($("#batching_record_checkAll"),$(".batching_record_checkbox"),checkedBoxLen,$("#batching_record_table"))


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
         })
            batching_record.funcs.bindDetailEventListener($('.detail'))
            batching_record.funcs.bindEditorEventListener($('.editor'))
            batching_record.funcs.bindDeleteEventListener($('.delete'))
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
                    $("#presomaWeigh").text(items.presomaWeigh)
                    $("#lithiumCode").text(items.lithiumCode)
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
                    area: ['850px', '450px'],
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
                    $("#ingredientsDate1").val(items.ingredientsDate)
                    $("#mixBegintime1").val(items.mixBegintime)
                    $("#mixTime1").val(items.mixTime)
                    $("#mixFrequency1").val(items.mixFrequency)
                    $("#batchNumber1").val(items.batchNumber)
                    $("#ingredientsWeight1").val(items.ingredientsWeight)
                    $("#presomaCode1").val(items.presomaCode)
                    $("#presomaWeigh1").val(items.presomaWeigh)
                    $("#lithiumCode1").val(items.lithiumCode)
                    $("#lithiumWeigh1").val(items.lithiumWeigh)
                    $("#presomaTare1").val(items.presomaTare)
                    $("#lithiumTare1").val(items.lithiumTare)
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
                    area: ['870px', '500px'],
                    btn:['保存','提交','返回'],
                    offset:"auto",
                    closeBtn:0,
                    yes: function(index) {
                       $("#batching_record_edtior_modal").css('display', 'none')
                       var ingredientsDate = $("#ingredientsDate1").val(items.ingredientsDate)
                       var mixBegintime = $("#mixBegintime1").val(items.mixBegintime)
                       var mixTime = $("#mixTime1").val(items.mixTime)
                       var mixFrequency = $("#mixFrequency1").val(items.mixFrequency)
                       var batchNumber = $("#batchNumber1").val(items.batchNumber)
                       var ingredientsWeight = $("#ingredientsWeight1").val(items.ingredientsWeight)
                       $("#presomaCode1").val(items.presomaCode)
                       $("#presomaWeigh1").val(items.presomaWeigh)
                       $("#lithiumCode1").val(items.lithiumCode)
                       $("#lithiumWeigh1").val(items.lithiumWeigh)
                       $("#presomaTare1").val(items.presomaTare)
                       $("#lithiumTare1").val(items.lithiumTare)
                       $("#presomaSuttle1").val(items.presomaSuttle)
                       $("#lithiumSuttle1").val(items.lithiumSuttle)
                       $("#presomaAdd1").val(items.presomaAdd)
                       $("#lithiumAdd1").val(items.lithiumAdd)
                       $("#additiveCode1").val(items.additiveCode)
                       $("#additiveModel1").val(items.additiveModel)
                       $("#additiveWeight1").val(items.additiveWeight)

                       //$.post(home.urls.batchingRecord.update()
                       layer.close(index)
                    }
                    ,btn2: function(index) {
                       $("#batching_record_edtior_modal").css('display', 'none')
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
                    title:"预烧记录详情",
                    content:$("#batching_record_detail_modal"),
                    area: ['1100px', '650px'],
                    btn:['提交','取消'],
                    offset:'auto',
                    closeBtn:0,
                    yes:function(index) {
                        $("#batching_record_detail_modal").css('display','none')
                        layer.close(index)
                    }
                    ,btn2:function(index){
                        $("#batching_record_detail_modal").css('display','none')
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
                            $('.batching_record_checkbox').each(function() {
                                if($(this).prop('checked')) {
                                    batching_record_codes.push({code:$(this).val()})
                                }
                            })
                            $.ajax({
                               url: home.urls.batchingRecord.deleteByCodeBatch(),
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
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        }
        ,bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var auditStatus = $('#audit_name option:selected').val();
                $.post(home.urls.batchingRecord.getByStatusByPage(), {
                    status: auditStatus
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
                                $.post(home.urls.plateAlarm.getByStatusByPage(), {
                                    status: auditStatus,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
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
