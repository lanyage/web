var art_manage = {
    init: function () {
        art_manage.funcs.renderTable()
        var out = $('#art_manage_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#art_manage_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },
    funcs: {
        renderTable: function () {
            $.post(home.urls.productOrder.getAllByPage(), {}, function (res) {
                var $tbody = $("#art_manage_table").children('tbody')
                var items = res.data.content
               // console.log(items)
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
            home.funcs.bindSelectAll($("#art_manage_checkAll"),$(".art_manage_checkbox"),checkedBoxLen,$("#art_manage_table"))

        }
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
           // console.log(items)
           var i = 1
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='art_manage_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (i++) + "</td>" +
                    "<td>" + e.batchNumber + "</td>" +
                    "<td>" + (e.productLineCode?e.productLineCode.name:'null')+ "</td>" +
                    "<td>" + e.inputPlan + "</td>" +
                    "<td>" + (new Date(e.inputDate).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.serialNumber) + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
                if(e.state===true){
                    $("#editor-"+(code)+"").removeClass('editor').addClass('disableHref')
                    $("#delete-"+(code)+"").removeClass('delete').addClass('disableHref')
                }
                art_manage.funcs.bindDetailEventListener($('.detail'))
                art_manage.funcs.bindEditorEventListener($('.editor'))
                art_manage.funcs.bindDeleteEventListener($('.delete'))
               
                var checkedBoxLen = $('.art_manage_checkbox:checked').length
                home.funcs.bindSelectAll($("#art_manage_checkAll"),$(".art_manage_checkbox"),checkedBoxLen,$("#art_manage_table"))

            })

        }

        , bindDetailEventListener: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOrder.getById(), {
                   code:code
                }, function (result) {
                    var items = result.data //获取数据
                    const div = $("#detail_modal")
                    art_manage.funcs.fill_detail_data(div,items)
                })
                layer.open({
                    type: 1,
                    title: '新增工艺单',
                    content: $("#detail_modal"),
                    area:['850px','500px'],
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
            $("#task_name").text(items.code)
            $("#make_batch").text(items.batchNumber)
            $("#make_man").text(items.compactor?items.compactor.name:'')
            $("#product_num").text(items.productLineCode.name)
            $("#audit_man").text(items.auditor?items.auditor.name:'')
            $("#plan_amount").text(items.inputPlan)
            $("#exec_man").text(items.executor?items.executor.name:'')
            $("#in_date").text(items.inputDate?new Date(items.inputDate).Format('yyyy-MM-dd'):'null')
            $("#pinguan").text(items.qc?items.qc.name:'')
            $("#make_num").text(items.serialNumber)
            $("#t1").text(items.presomaCode)
            $("#t2").text(items.presomaContent)
            $("#t3").text(items.presomaRatio)
            $("#t4").text(items.lithiumCode)
            $("#t5").text(items.lithiumContent)
            $("#t6").text(items.lithiumRatio)
            $("#t7").text(items.additiveCode)
            $("#t8").text(items.targetLithium)
            $("#t9").text(items.additiveWeight)
            $("#t11").text(items.presomaWeight)
            $("#t12").text(items.lithiumWeight)
            $("#t13").text(items.mixFrequency)
            $("#t14").text(items.mixDate?new Date(items.mixDate).Format('yyyy-MM-dd'):'null')
            $("#t15").text(items.mixRequirements)
            $("#t16").text(items.mixDetection)
            $("#t17").text(items.presinteringPlan)
            $("#t18").text(items.presinteringParameter)
            $("#t19").text(items.presinteringRequirements)
            $("#t20").text(items.presinteringDetection)

        },
        bindEditorEventListener:function(editBtns) {
            editBtns.off('click').on('click',function() {
                var _selfBtn = $(this)
                var code = _selfBtn.attr('id').substr(7)
                $.post(home.urls.productOrder.getById(), {
                   code:code
                }, function (result) {
                    var items = result.data //获取数据
                    const div = $("#editor_modal")
                   // console.log(items)
                    art_manage.funcs.fill_editor_data(div,items)
                layer.open({
                    type:1,
                    title:'编辑工艺单',
                    content:$("#editor_modal"),
                    area:['850px','500px'],
                    btn:['保存','提交','返回'],
                    offset:"auto",
                    closeBtn:0,
                    yes: function(index) {
                        $("#editor_modal").css('display', 'none')
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
                        var compileTime = new Date(items.compileTime).Format('yyyy-MM-dd hh:mm:ss')
                        var presinteringDetection = $("#t201").val()
                        $.post(home.urls.productOrder.update(),{
                            code:code,
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
                            state:0,
                            compileTime:compileTime,
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code === 0){
                                var time = setTimeout(function(){
                                    art_manage.init()
                                    clearTimeout(time)
                                },500)
                            }
                        })
                        layer.close(index)
                    }
                    ,btn2: function(index) {
                        $("#editor_modal").css('display', 'none')
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
                        var compileTime = new Date(items.compileTime).Format('yyyy-MM-dd hh:mm:ss')
                        var presinteringDetection = $("#t201").val()
                        
                        $.post(home.urls.productOrder.update(),{
                            code:code,
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
                            state:1,
                            compileTime:compileTime,
                        },function(result){
                            layer.msg(result.message,{
                                offset:['40%','55%'],
                                time:700
                            })
                            if(result.code === 0){
                                var time = setTimeout(function(){
                                    art_manage.init()
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
            $("#make_man1").empty()
            $("#audit_man1").empty()
            $("#exec_man1").empty()
            $("#pinguan1").empty()
            $("#product_num1").empty()
            $("#task_name1").val(items.code)
            $("#make_batch1").val(items.batchNumber)
            $("#make_man1").append("<option value="+items.compactor.code+">"+items.compactor.name+"</option>")
            $("#product_num1").append("<option value="+items.productLineCode.code+">"+items.productLineCode.name+"</option>")
            $("#audit_man1").append("<option value="+items.auditor.code+">"+items.auditor.name+"</option>")
            $("#plan_amount1").val(items.inputPlan)
            $("#exec_man1").append("<option value="+items.executor.code+">"+items.executor.name+"</option>")
            $("#in_date1").val(items.inputDate?new Date(items.inputDate).Format('yyyy-MM-dd'):'null')
            $("#pinguan1").append("<option value="+items.qc.code+">"+items.qc.name+"</option>")
            $("#make_num1").val(items.serialNumber)
            $("#t11").val(items.presomaCode)
            $("#t21").val(items.presomaContent)
            $("#t31").val(items.presomaRatio)
            $("#t41").val(items.lithiumCode)
            $("#t51").val(items.lithiumContent)
            $("#t61").val(items.lithiumRatio)
            $("#t71").val(items.additiveCode)
            $("#t81").val(items.targetLithium)
            $("#t91").val(items.additiveWeight)
            $("#t111").val(items.presomaWeight)
            $("#t121").val(items.lithiumWeight)
            $("#t131").val(items.mixFrequency)
            $("#t141").val(items.mixDate?new Date(items.mixDate).Format('yyyy-MM-dd hh:mm:ss'):'null')
            $("#t151").val(items.mixRequirements)
            $("#t161").val(items.mixDetection)
            $("#t171").val(items.presinteringPlan)
            $("#t181").val(items.presinteringParameter)
            $("#t191").val(items.presinteringRequirements)
            $("#t201").val(items.presinteringDetection)

            $.get(servers.backup()+'user/getAll',{},function(result){
                var user = result.data
                user.forEach(function(e){
                    if(items.compactor.code!=e.code){
                        $("#make_man1").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                    if(items.auditor.code!=e.code){
                        $("#audit_man1").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                    if(items.executor.code!=e.code){
                        $("#exec_man1").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                    if(items.qc.code!=e.code){
                        $("#pinguan1").append("<option value="+e.code+">"+e.name+"</option>")
                    }
                })
            })
            $.get(servers.backup()+'productLine/getAll',{},function(result){
                var productLine = result.data
                productLine.forEach(function(e){
                    if(items.productLineCode.code!=e.code){
                         $("#product_num1").append("<option value="+e.code+">"+e.name+"</option>")
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
                        $.post(home.urls.productOrder.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    art_manage.init()
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
                    area:['850px','500px'],
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
                        
                        $.post(home.urls.productOrder.add(),{
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
                                    art_manage.init()
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
                if($('.art_manage_checkbox:checked').length === 0) {
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
                            var art_manage_codes = []
                            $('.art_manage_checkbox').each(function() {
                                if($(this).prop('checked')) {
                                    art_manage_codes.push({code:$(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.productOut.deleteByCodeBatch(),
                                contentType: 'application/json',
                                data: JSON.stringify(art_manage_codes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            art_manage.init()
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