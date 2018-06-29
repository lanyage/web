var kiln_Order = {
    init: function () {
        kiln_Order.funcs.renderTable()
        var out = $('#kiln_Order_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#kiln_Order_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {
        renderTable: function () {
            $.post(home.urls.kilnParameter.getAllByPage(), {}, function (res) {
                var $tbody = $("#kiln_Order_table").children('tbody')
                var items = res.data.content
               // console.log(items)
                kiln_Order.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                kiln_Order.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'kiln_Order_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.kilnParameter.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#kiln_Order_table").children('tbody')
                                kiln_Order.funcs.renderHandler($tbody, items)
                                kiln_Order.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            kiln_Order.funcs.bindDetailEventListener($('.detail'))

            kiln_Order.funcs.bindAddEvent($('#model_li_hide_add_27'))
            kiln_Order.funcs.bindDeleteEvent($('#model_li_hide_delete_27'))

            var refreshBtn = $('#model_li_hide_refresh_27');
            kiln_Order.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_27')
            kiln_Order.funcs.bindSearchEventListener(searchBtn)

            var checkedBoxLen = $('.kiln_Order_checkbox:checked').length
            home.funcs.bindSelectAll($("#kiln_Order_checkAll"),$(".kiln_Order_checkbox"),checkedBoxLen,$("#kiln_Order_table"))

        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
           // console.log(items)
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='kiln_Order_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.kilnOrder?e.kilnOrder.kilnCode:'null') + "</td>" +
                    "<td>" + (e.kilnOrder?e.kilnOrder.effectiveDate:'') + "</td>" +
                    "<td>" + (e.kilnOrder?new Date(e.kilnOrder.compileTime).Format('yyyy-MM-dd'):'null')+ "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
                kiln_Order.funcs.bindDetailEventListener($('.detail'))
                kiln_Order.funcs.bindEditorEventListener($('.editor'))
                kiln_Order.funcs.bindDeleteEventListener($('.delete'))
               
                var checkedBoxLen = $('.kiln_Order_checkbox:checked').length
                home.funcs.bindSelectAll($("#kiln_Order_checkAll"),$(".kiln_Order_checkbox"),checkedBoxLen,$("#kiln_Order_table"))

            })

        }

        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.kilnParameter.getById(), {
                   code:code
                }, function (result) {
                    var items = result.data //获取数据
                    const div = $("#detail_modal")
                    kiln_Order.funcs.fill_detail_data(div,items)
                })
                layer.open({
                    type: 1,
                    title: '窑炉工艺单详情',
                    content: $("#detail_modal"),
                    area: ['900px', '560px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        },
        fill_detail_data: function(div,items){
            $("#code").text(items.kilnOrder?items.kilnOrder.code:'')
            $("#kilnCode").text(items.kilnOrder?items.kilnOrder.kilnCode:'')
            $("#effectiveDate").text(items.kilnOrder?items.kilnOrder.effectiveDate:'')
            $("#compactor").text(items.kilnOrder?items.kilnOrder.compactor.name:'')
            $("#compileTime").text(items.kilnOrder?new Date(items.kilnOrder.compileTime).Format('yyyy-MM-dd hh:mm:ss'):'null')
            $("#temRange").text(items.temRange?items.temRange:'')
            $("#length").text(items.length)
            $("#targetTem").text(items.targetTem)
            $("#topTem").text(items.topTem)
            $("#midTem").text(items.midTem)
            $("#botTem").text(items.botTem)

            $("#exhaust").text(items.kilnOrder?items.kilnOrder.exhaust:'')
            $("#exhaustType").text(items.kilnOrder?items.kilnOrder.exhaustType:'')
            $("#exhaustWeight").text(items.kilnOrder?items.kilnOrder.exhaustWeight:'')
            $("#exhaustTop").text(items.kilnOrder?items.kilnOrder.exhaustTop:'')
            $("#exhaustBottom").text(items.kilnOrder?items.kilnOrder.exhaustBottom:'')
            $("#note").text(items.kilnOrder?items.kilnOrder.note:'')
        },
        bindEditorEventListener:function(editBtns) {
            editBtns.off('click').on('click',function() {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.kilnParameter.getById(), {
                   code:code
                }, function (result) {
                    var items = result.data //获取数据
                    const div = $("#editor_modal")
                   // console.log(items)
                    kiln_Order.funcs.fill_editor_data(div,items)
                layer.open({
                    type:1,
                    title:'新增工艺单',
                    content:$("#editor_modal"),
                    area:['900px','560px'],
                    btn:['保存','提交','返回'],
                    offset:"auto",
                    closeBtn:0,
                    yes: function(index) {
                        $("#editor_modal").css('display', 'none')
                        var Code = $("#kilnCode1").val()
                        var kilnCode = $("#kilnCode1").val()
                        var effectiveDate = $("#effectiveDate1").val()
                        var compileTime = $("#compileTime1").val()
                        var compactor = $("#compactor1").val()

                        var temRange = $("#temRange1").val()
                        var length = $("#length1").val()
                        var targetTem = $("#targetTem1").val()
                        var topTem = $("#topTem1").val()
                        var midTem = $("#midTem1").val()
                        var botTem = $("#botTem1").val()

                        var exhaust = $("#exhaust1").val()
                        var exhaustType = $("#exhaustType1").val()
                        var exhaustWeight = $("#exhaustWeight1").val()
                        var exhaustTop = $("#exhaustTop1").val()
                        var exhaustBottom = $("#exhaustBottom1").val()
                        var note = $("#note1").val()
                       
                        var kilnOrder = {
                            code:Code,
                            kilnCode:kilnCode,
                            
                            effectiveDate:effectiveDate,
                            compileTime:compileTime,
                            'compactor.code':compactor,
                            exhaust:exhaust,
                            exhaustType:exhaustType,
                            exhaustWeight:exhaustWeight,
                            exhaustTop:exhaustTop,
                            exhaustBottom:exhaustBottom,
                            note:note,
                            status:0
                        }
                        $.post(home.urls.kilnParameter.update(),{
                            code:code,
                            exhaust:exhaust,
                            exhaustType:exhaustType,
                            exhaustWeight:exhaustWeight,
                            exhaustTop:exhaustTop,
                            exhaustBottom:exhaustBottom,
                            note:note,
                            'kilnOrder.code':code,
                           
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code === 0){
                                var time = setTimeout(function(){
                                    kiln_Order.init()
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        layer.close(index)
                    }
                    ,btn2: function(index) {
                        $("#editor_modal").css('display', 'none')
                        var Code = $("#kilnCode1").val()
                        var kilnCode = $("#kilnCode1").val()
                        var effectiveDate = $("#effectiveDate1").val()
                        var compileTime = $("#compileTime1").val()
                        var compactor = $("#compactor1").val()

                        var temRange = $("#temRange1").val()
                        var length = $("#length1").val()
                        var targetTem = $("#targetTem1").val()
                        var topTem = $("#topTem1").val()
                        var midTem = $("#midTem1").val()
                        var botTem = $("#botTem1").val()

                        var exhaust = $("#exhaust1").val()
                        var exhaustType = $("#exhaustType1").val()
                        var exhaustWeight = $("#exhaustWeight1").val()
                        var exhaustTop = $("#exhaustTop1").val()
                        var exhaustBottom = $("#exhaustBottom1").val()
                        var note = $("#note1").val()
                       
                        var kilnOrder = {
                            code:Code,
                            kilnCode:kilnCode,
                            effectiveDate:effectiveDate,
                            compileTime:compileTime,
                            'compactor.code':compactor,
                            exhaust:exhaust,
                            exhaustType:exhaustType,
                            exhaustWeight:exhaustWeight,
                            exhaustTop:exhaustTop,
                            exhaustBottom:exhaustBottom,
                            note:note,
                            status:1
                        }
                        $.post(home.urls.kilnParameter.update(),{
                            code:code,
                            exhaust:exhaust,
                            exhaustType:exhaustType,
                            exhaustWeight:exhaustWeight,
                            exhaustTop:exhaustTop,
                            exhaustBottom:exhaustBottom,
                            note:note,
                            kilnOrder:kilnOrder,
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code === 0){
                                var time = setTimeout(function(){
                                    kiln_Order.init()
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        layer.close(index)
                    }
                    ,btn3: function(index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                })
            })
        })
        }
        ,fill_editor_data: function(div,items){
            $("#compactor1").empty()
            $("#compactor1").append("<option value="+items.kilnOrder.compactor.code+">"+items.kilnOrder.compactor.name+"</option>")
            $("#code1").val(items.kilnOrder?items.kilnOrder.code:'')
            $("#kilnCode1").val(items.kilnOrder?items.kilnOrder.kilnCode:'')
            $("#effectiveDate1").val(items.kilnOrder?items.kilnOrder.effectiveDate:'')
            $("#compileTime1").val(items.kilnOrder?new Date(items.kilnOrder.compileTime).Format('yyyy-MM-dd hh:mm:ss'):'null')
            $("#temRange1").val(items.temRange?items.temRange:'')
            $("#length1").val(items.length)
            $("#targetTem1").val(items.targetTem)
            $("#topTem1").val(items.topTem)
            $("#midTem1").val(items.midTem)
            $("#botTem1").val(items.botTem)

            $("#exhaust1").val(items.kilnOrder?items.kilnOrder.exhaust:'')
            $("#exhaustType1").val(items.kilnOrder?items.kilnOrder.exhaustType:'')
            $("#exhaustWeight1").val(items.kilnOrder?items.kilnOrder.exhaustWeight:'')
            $("#exhaustTop1").val(items.kilnOrder?items.kilnOrder.exhaustTop:'')
            $("#exhaustBottom1").val(items.kilnOrder?items.kilnOrder.exhaustBottom:'')
            $("#note1").val(items.kilnOrder?items.kilnOrder.note:'')

            $.get(servers.backup()+'user/getAll',{},function(result){
                var user = result.data
                user.forEach(function(e){
                    if(items.kilnOrder.compactor.code!=e.code){
                        $("#compactor1").append("<option value="+e.code+">"+e.name+"</option>")
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
                        $.post(home.urls.kilnParameter.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    kiln_Order.init()
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
                $("#task_name1").val('')
                $("#make_batch1").val('')
                $("#make_man1").empty()
                $("#product_num1").empty()
                $("#audit_man1").empty()
                $("#plan_amount1").val('')
                $("#pinguan1").empty()
                $("#in_date1").val('')
                $("#exec_man1").empty()
                $("#make_num1").val('')
                $("#t11").val('')
                $("#t21").val('')
                $("#t31").val('')
                $("#t41").val('')
                $("#t51").val('')
                $("#t61").val('')
                $("#t71").val('')
                $("#t81").val('')
                $("#t91").val('') 
                $("#t111").val('')
                $("#t121").val('')
                $("#t131").val('')
                $("#t141").val('')
                $("#t151").val('')
                $("#t161").val('')
                $("#t171").val('')
                $("#t181").val('')
                $("#t191").val('')
                $("#t201").val('')
                $.get(servers.backup()+'user/getAll',{},function(result){
                    var user = result.data
                    user.forEach(function(e){
                            $("#make_man1").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#audit_man1").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#exec_man1").append("<option value="+e.code+">"+e.name+"</option>")
                            $("#pinguan1").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                })
                $.get(servers.backup()+'productLine/getAll',{},function(result){
                    var productLine = result.data
                    productLine.forEach(function(e){
                        $("#product_num1").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                })
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
                        var compactor = $("#make_man1").val()
                        var auditor = $("#audit_man1").val()
                        var executor = $("#exec_man1").val()
                        var qc = $("#pinguan1").val()
                        var batchNumber = $("#make_batch1").val()
                        var productLineCode = $("#product_num1").val()
                        var inputPlan = $("#plan_amount1").val()
                        
                        var inputDate = $("#in_date1").val()
                        var serialNumber = $("#make_num1").val()
            
                        var presomaCode = $("#t11").val()
                        var presomaContent = $("#t21").val()
                        var presomaRatio = $("#t31").val()
                        var lithiumCode = $("#t41").val()
                        var lithiumContent = $("#t51").val()
                        var lithiumRatio = $("#t61").val()
                        var additiveCode = $("#t71").val()
                        var targetLithium = $("#t81").val()
                        var additiveWeight = $("#t91").val()
                        
                        var presomaWeight = $("#t111").val()
                        var lithiumWeight = $("#t121").val()
                        var mixFrequency = $("#t131").val()
                        var mixDate = $("#t141").val()
                        var mixRequirements = $("#t151").val()
                        var mixDetection = $("#t161").val()
                        var presinteringPlan = $("#t171").val()
                        var presinteringParameter = $("#t181").val()
                        var presinteringRequirements = $("#t191").val()
                        var compileTime = new Date().Format('yyyy-MM-dd hh:mm:ss')
                        var presinteringDetection = $("#t201").val()
                        
                        $.post(home.urls.kilnParameter.add(),{
                            'compactor.code':compactor,
                            'auditor.code':auditor,
                            'executor.code':executor,
                            'qc.code':qc,
                            batchNumber:batchNumber,
                            'productLineCode.code':productLineCode,
                            inputPlan:inputPlan,
                            inputDate:inputDate,
                            serialNumber:serialNumber,
                            presomaCode:presomaCode,
                            presomaContent:presomaContent,
                            presomaRatio:presomaRatio,
                            lithiumCode:lithiumCode,
                            lithiumContent:lithiumContent,
                            lithiumRatio:lithiumRatio,
                            additiveCode:additiveCode,
                            targetLithium:targetLithium,
                            additiveWeight:additiveWeight,
                            presomaWeight:presomaWeight,
                            lithiumWeight:lithiumWeight,
                            mixFrequency:mixFrequency,
                            mixDate:mixDate,
                            mixRequirements:mixRequirements,
                            mixDetection:mixDetection,
                            presinteringPlan:presinteringPlan,
                            presinteringParameter:presinteringParameter,
                            presinteringRequirements:presinteringRequirements,
                            presinteringDetection:presinteringDetection,
                            status:0,
                            compileTime:compileTime,
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code === 0){
                                var time = setTimeout(function(){
                                    kiln_Order.init()
                                    clearTimeout(time)
                                },500)
                            }
                        })
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
                if($('.kiln_Order_checkbox:checked').length === 0) {
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
                            var kiln_Order_codes = []
                            $('.kiln_Order_checkbox').each(function() {
                                if($(this).prop('checked')) {
                                    kiln_Order_codes.push({code:$(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.productOut.deleteByCodeBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(kiln_Order_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            kiln_Order.init()
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
                    kiln_Order.init()
                    $('#input_batch_num').val('')
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        },
        bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var batch_num = $('#input_batch_num').val()
                $.post(home.urls.kilnParameter.getByBatchNumberLikeByPage(), {
                    batchNumber: batch_num
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#kiln_Order_table").children('tbody')
                    kiln_Order.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'kiln_Order_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.kilnParameter.getByBatchNumberLikeByPage(), {
                                    batchNumber: batch_num,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#kiln_Order_table").children('tbody')
                                    kiln_Order.funcs.renderHandler($tbody, items)
                                    kiln_Order.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }

    }
}