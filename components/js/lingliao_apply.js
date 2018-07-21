var lingliao_apply = {
    res:[],
    init: function () {

        /** 渲染表格 */
        lingliao_apply.funcs.renderTable()
        /** 渲染下拉菜单 */
        lingliao_apply.funcs.bindCreatoption()

        var checkedBoxLen = $(".add_checkbox:checked").length
        home.funcs.bindSelectAll($("#add_checkAll"), $(".add_checkbox"), checkedBoxLen, $("#add_modal_table"))
        $.get(servers.backup()+'check/getAll',{},function(result){
            lingliao_apply.res = result.data
        })
        //将分页居中
        var out = $('#lingLiao_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#lingLiao_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    }
    , funcs: {
        renderTable: function () {
            //post here to getAll
            $.post(home.urls.lingLiao.getAllByPage(), {}, function (res) {
                var $tbody = $("#lingliao_apply_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                lingliao_apply.funcs.renderHandler($tbody, items,0)
                /** 渲染表格结束之后 */
                lingliao_apply.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'lingLiao_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.lingLiao.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                var page = obj.curr - 1
                                const $tbody = $("#lingliao_apply_table").children('tbody')
                                lingliao_apply.funcs.renderHandler($tbody, items,page)
                                lingliao_apply.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            //编辑-新增-搜索-全选
            var checkedBoxLen = $('.addModal_checkbox:checked').length
            home.funcs.bindSelectAll($("#addModal_checkAll"), $('.addModal_checkbox'), checkedBoxLen, $("#addModal_table"))

            // 追加刷新事件
            var refreshBtn = $('#model-li-hide-refresh-113');
            lingliao_apply.funcs.bindRefreshEventListener(refreshBtn);

            //追加审核状态搜索事件
            var status_searchBtn = $('#status')
            lingliao_apply.funcs.bindstatusSearchEventListener(status_searchBtn)

            //追加流程类型搜索事件
            var process_searchBtn = $('#processtype')
            lingliao_apply.funcs.bindProcessSearchEventListener(process_searchBtn)

            //追加搜索事件
            var searchBtn = $('#model-li-hide-search-113')
            lingliao_apply.funcs.bindSearchEventListener(searchBtn)

            /** 正常申请的事件 */
            var norApplyBtns = $('#model-li-hide-normal_add-113')
            lingliao_apply.funcs.bindNorApplyModel(norApplyBtns)

            /** 紧急申请的事件 */
            var urgApplyBtns = $('#model-li-hide-urgent_add-113')
            lingliao_apply.funcs.bindUrgApplyModel(urgApplyBtns)

            /** 批量删除 也是根据code删除*/
            var norApplyDeleteBtns = $('#model-li-hide-delete-113')
            lingliao_apply.funcs.bindDeleteEventListener(norApplyDeleteBtns)

            lingliao_apply.funcs.bindEditDeleteClick($(".delete_roundBtn"))

        }
        , renderHandler: function ($tbody, items,page) {
            $tbody.empty() //清空表格
            var t = 1 + page * 10
            for (var i = 0; i < items.length; i++) {
                e = items[i];
                var auditStatus
                var pickingStatus
                if(e.pickingStatus===0){
                    pickingStatus = '待出库'
                }else{
                    pickingStatus = '已出库'
                }
                switch(e.auditStatus){
                    case 0:
                        auditStatus = '未提交';
                        break;
                    case 1:
                        auditStatus = '待审核';
                        break;  
                    case 2:
                        auditStatus = '通过';
                        break;
                    case 3:
                        auditStatus = '未通过';
                        break;    
                }
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='lingliao_apply_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (t++) + "</td>" +
                    "<td>" + (e.department ? e.department.name : '') + "</td>" +
                    "<td>" + (new Date(e.applyDate).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.processManage ? e.processManage.name : '') + "</td>" +
                    "<td>" + auditStatus + "</td>" +
                    "<td>" + pickingStatus + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (e.code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (e.code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (e.code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                if(e.auditStatus!=0){
                    $("#editor-"+e.code+"").removeClass('editor').addClass('disableHref')
                    $("#delete-"+e.code+"").removeClass('delete').addClass('disableHref')
                }
            }
            // /** 绑定全选事件 */
            // mat_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var detailBtns = $(".detail")
            lingliao_apply.funcs.bindDetailClick(detailBtns)
            var editorBtns = $('.editor')
            lingliao_apply.funcs.bindEditorClick(editorBtns)
            var deleteBtns = $('.delete')
            lingliao_apply.funcs.bindDeleteClick(deleteBtns)

            //实现领料表的全选
            var checkedBoxLen = $('.lingliao_apply_checkbox:checked').length
            home.funcs.bindSelectAll($("#lingliao_apply_checkAll"), $('.lingliao_apply_checkbox'), checkedBoxLen, $("#lingliao_apply_table"))

            var deleteBatchBtn = $('#model-li-hide-delete-113')
            lingliao_apply.funcs.bindDeleteEventListener(deleteBatchBtn)


        }
        /** 监听下拉菜单的option */
        , bindCreatoption: function () {
            $("#status").empty()
            $("#status").append("<option selected value='-1'>选择审核状态</option><option value='0'>未提交</option>s<option value='1'>在审</option><option value='2'>通过</option><option value='3'>不通过</option>")
            $.get(home.urls.check.getAll(), {}, function (result) {
                var value = result.data
                var length = value.length
                $("#processtype").html("<option value='-1'>请选择流程类型</option>")
                for (var i = 0; i < length; i++) {
                    var text = value[i].name
                    $("#processtype").append("<option value='" + value[i].code + "'>" + text + "</option>");
                }
            })
        }

        /** 删除事件 */
        , bindDeleteClick: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                //首先弹出一个询问框
                var _this = $(this)
                layer.open({
                    type: 1,
                    title: '删除',
                    content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除该记录?</h5>",
                    area: ['180px', '130px'],
                    btn: ['确认', '取消'],
                    offset: ['40%', '55%'],
                    yes: function (index) {
                        var Code = _this.attr('id').substr(7)
                        //console.log('删除',Code)
                        $.post(home.urls.lingLiao.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            // console.log(result.code)
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    _this.parent('td').parent('tr').remove();
                                    //lingliao_apply.init()
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
        /** 正常申请事件 */
        , bindNorApplyModel: function (norApplyBtns) {
            norApplyBtns.off('click').on('click', function () {
                lingliao_apply.funcs.add_fillData($("#normal_add_select"));
                layer.open({
                    type: 1,
                    title: '正常申请',
                    content: $("#normal_add_modal"),
                    area: ['800px', '400px'],
                    btn: ['确定', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    //确定按钮 实现批量增加   问题：怎样将多条数据封装
                    yes: function (index) {
                        $("#normal_add_modal").css('display', 'none')
                        var pickingApplies = [];
                        $('.delete_checkbox').each(function () {
                            var e = $(this).parent('td').parent('tr').children('td')
                            switch (e.eq(1).text()) {
                                case '前驱体' :
                                    rawTypeCode = 1;
                                    break;
                                case '碳酸锂' :
                                    rawTypeCode = 2;
                                    break;
                                case '正极材料520' :
                                    rawTypeCode = 3;
                                    break;
                                case '正极材料306' :
                                    rawTypeCode = 4;
                                    break;
                            }
                            if(e.eq(6).children('input').val()===null){
                                alert("请输入申请数量!")
                                return
                            }
                            pickingApplies.push({
                                batchNumber: e.eq(2).text(),
                                rawType: {code: rawTypeCode},  //应该是要传rawType.code
                                unit: e.eq(5).text(),
                                weight: e.eq(6).children('input').val()
                            })
                        })
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)
                        var data = {
                            department: {code: userJson.department.code},
                            applyDate: new Date().getTime(),
                            processManage: {code: $("#normal_add_select").val()},
                            process: {code: 1},
                            auditStatus: 0,
                            pickingStatus: 0,
                            user: {code: userJson.code},
                            applicant: {code: userJson.code},
                            curAuditorCode: userJson.code,
                            pickingTime: new Date().getTime(),
                            pickingApplies: []
                        }
                        data.pickingApplies = pickingApplies
                        $.ajax({
                            url: home.urls.lingLiao.add(),
                            contentType: 'application/json',
                            data: JSON.stringify(data),
                            dataType: 'json',
                            type: 'post',
                            success: function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        lingliao_apply.init()
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
                    },
                    //返回
                    btn2: function (index) {
                        $("#normal_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
            const $tbody = $("#normal_add_modal_table").children('tbody')
            lingliao_apply.funcs.bindEditAddClick($("#normal_add_addBtn"), $tbody)
            //lingliao_apply.funcs.bindEditDeleteClick($("#normal_delete_Btn"))
        }
        , add_fillData: function (selectChoice) {
            $.get(servers.backup() + "check/getByProcessCode", {processCode: 1}, function (result) {
                item = result.data
                //console.log(item)
                selectChoice.html("<option>请选择审批流程</option>");
                item.forEach(function (e) {
                    selectChoice.append("<option value=" + e.code + ">" + (e.name) + "</option>");
                })
            })
            //实现全选
            var checkedBoxLen = $('.delete_checkbox:checked').length
            home.funcs.bindSelectAll($("#normal_add_checkAll"), $('.delete_checkbox'), checkedBoxLen, $("#normal_add_modal_table"))

            var userStr = $.session.get('user')
            var userJson = JSON.parse(userStr)

            $("#nor_appl_date").text(new Date().Format("yyyy-MM-dd hh:mm:ss"))
            $("#nor_app_dep").text(userJson.department.name)
            $("#nor_cur_user").text(userJson.name)
        }

        //编辑里面的新增按钮
        , bindNorAddClick: function (addBtn) {
            addBtn.off('click').on('click', function () {
                lingliao_apply.funcs.fillData_to_edit_add("#edit_addModal");
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#edit_addModal"),
                    area: ['800px', '400px'],
                    btn: ['确认', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        //编辑-增加-确定 将勾选的数据append到上一个界面中去/***/
                        var batch_Number = $('#edit_add_input').val();
                        var rawType = $('#edit_add_select option:selected').val()
                        var $tbody = $('#normal_add_modal_table').children('tbody')

                        if ($(".edit_add_search_checkbox:checked").length === 0) {
                            $("#edit_addModal").css('display', 'none')
                            layer.close(index)

                        } else {
                            //console.log($(".edit_add_search_checkbox:checked").length)
                            $('.edit_add_search_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    var e = $(this).parent('td').parent('tr').children('td') //取到选中的一行
                                    $tbody.append(
                                        "<tr>" +
                                        "<td><input type='checkbox' class='delete_checkbox' ></td>" +
                                        "<td>" + (rawType) + "</td>" +
                                        "<td>" + (e.eq(1).text()) + "</td>" +
                                        "<td>" + (e.eq(3).text()) + "</td>" +
                                        "<td>" + (e.eq(2).text()) + "</td>" +
                                        "<td>kg</td>" +
                                        "<td><input type='text' id='input_apply_amount' class='provider_input' placeholder='请输入申请数量'/></td>" +
                                        "</tr>"
                                    )
                                }
                            })
                            $("#edit_addModal").css('display', 'none')
                            layer.close(index)
                        }
                    }
                    , btn2: function (index) {
                        $("#edit_addModal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
            //编辑-增加-搜索
            var edit_add_searchBtns = $("#edit_addModal_search");
            lingliao_apply.funcs.edit_add_search(edit_add_searchBtns)

            var edit_add_search_detailBtn = $(".edit_add_detail")
            lingliao_apply.funcs.edit_add_search_detail(edit_add_search_detailBtn);

            //实现全选
            var checkedBoxLen = $('.edit_add_search_checkbox:checked').length
            home.funcs.bindSelectAll($("#edit_add_search_checkAll"), $('.edit_add_search_checkbox'), checkedBoxLen, $("#edit_addModal_table"))
        }

        /** 紧急申请事件 */
        , bindUrgApplyModel: function (urgApplyBtns) {
            urgApplyBtns.off('click').on('click', function () {
                lingliao_apply.funcs.urgent_add_fillData();
                layer.open({
                    type: 1,
                    title: '紧急申请',
                    content: $("#urgent_add_modal"),
                    area: ['800px', '400px'],
                    btn: ['确定', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#urgent_add_modal").css('display', 'none')
                        var pickingApplies = [];
                        $('.delete_checkbox').each(function () {
                            var e = $(this).parent('td').parent('tr').children('td')
                            var rawTypeCode
                            switch (e.eq(1).text()) {
                                case '前驱体' :
                                    rawTypeCode = 1;
                                    break;
                                case '碳酸锂' :
                                    rawTypeCode = 2;
                                    break;
                                case '正极材料520' :
                                    rawTypeCode = 3;
                                    break;
                                case '正极材料306' :
                                    rawTypeCode = 4;
                                    break;
                            }
                            if(e.eq(6).children('input').val()===null){
                                alert("请输入申请数量!")
                                return
                            }
                            pickingApplies.push({
                                batchNumber: e.eq(2).text(),
                                rawType: {code: rawTypeCode},  //应该是要传rawType.code
                                unit: e.eq(5).text(),
                                weight: e.eq(6).children('input').val()
                            })

                        })
                        var userStr = $.session.get('user')
                        var userJson = JSON.parse(userStr)
                        var data = {
                            department: {code: userJson.department.code},
                            applyDate: new Date().getTime(),
                            processManage: {code: $("#urgent_add_select").val()},
                            process: {code: 0},
                            auditStatus: 0,
                            pickingStatus: 0,
                            user: {code: userJson.code},
                            applicant: {code: userJson.code},
                            curAuditorCode: userJson.code,
                            pickingTime: new Date().getTime(),
                            pickingApplies: []
                        }
                        data.pickingApplies = pickingApplies

                        $.ajax({
                            url: home.urls.lingLiao.add(),
                            contentType: 'application/json',
                            data: JSON.stringify(data),
                            dataType: 'json',
                            type: 'post',
                            success: function (result) {
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        lingliao_apply.init()
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
                    },
                    btn2: function (index) {
                        $("#urgent_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
            const $tbody = $("#urgent_add_modal_table").children('tbody')
            lingliao_apply.funcs.bindEditAddClick($("#urgent_add_addBtn"), $tbody)
        }

        , urgent_add_fillData: function () {
            $.get(servers.backup() + "check/getByProcessCode", {processCode: 0}, function (result) {
                item = result.data
                //console.log(item)
                $("#urgent_add_select").html("<option>请选择审批流程</option>");
                item.forEach(function (e) {
                    $("#urgent_add_select").append("<option value=" + e.code + ">" + (e.name) + "</option>");
                })
            })
            //实现全选
            var checkedBoxLen = $('.delete_checkbox:checked').length
            home.funcs.bindSelectAll($("#urgent_add_checkAll"), $('.delete_checkbox'), checkedBoxLen, $("#urgent_add_modal_table"))

            var userStr = $.session.get('user')
            var userJson = JSON.parse(userStr)

            $("#urg_appl_date").text(new Date().Format("yyyy-MM-dd hh:mm:ss"))
            $("#urg_app_dep").text(userJson.department.name)
            $("#urg_cur_user").text(userJson.name)
        }

        /**填充详情表格的弹出表格 */
        , fillData_detail: function (table, items) {
           /* $.get(servers.backup() + "process/getAll", {}, function (result) {
                item = result.data
                //console.log(item)
                
                item.forEach(function (e) {
                    $("#detail_select").append("<option value=" + e.code + ">" + (e.name) + "</option>");
                })

            })*/
            $("#detail_select").empty()
            $("#detail_select").append("<option>"+items.processManage.name+"</option>");
            var pickingApplies = items.pickingApplies
            var $tbody = $('#detail-table').children('tbody')
            $tbody.empty() //清空表格
            pickingApplies.forEach(function (ele) {
                //console.log(ele)
                $tbody.append(
                    "<tr>" +
                    "<td>" + (ele.rawType.name) + "</td>" +
                    "<td>" + (ele.batchNumber) + "</td>" +
                    "<td>" + (!ele.unit ? 'kg' : ele.unit) + "</td>" +
                    "<td>" + (!ele.weight ? 0 : ele.weight) + "</td>" +
                    "</tr>"
                )
            })
            var userStr = $.session.get('user')
            var userJson = JSON.parse(userStr)
            //todo
            $.get(servers.backup() + "check/getAll", {}, function (res) {
                res.data.forEach(function (e, index) {
                    $("#process_type").append(
                        "<option value='" + (e.code) + "'>" + (e.name) + "</option>"
                    )
                })
            })
            $("#appl_date").text(new Date().Format("yyyy-MM-dd hh:mm:ss"))
            $("#app_dep").text(userJson.department.name)
            $("#cur_user").text(userJson.name)
        }
        /** 填充编辑按钮的表格 */
        , fillData_editor: function (table, items) {
            $("#edit_select").empty()
            $.get(home.urls.check.getAll(), {}, function (result) {
                item = result.data
                // console.log(item)
                $("#edit_select").append("<option value="+items.processManage.code+">"+items.processManage.name+"</option>");
                item.forEach(function (e) {
                    if(e.code!=items.processManage.code)
                    $("#edit_select").append("<option value=" + e.code + ">" + (e.name) + "</option>");
                })

            })
            //console.log(items)
            var pickingApplies = items.pickingApplies
            var $tbody = $('#edit_modal_table').children('tbody')
            $tbody.empty() //清空表格
            pickingApplies.forEach(function (ele) {
                //console.log(ele)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='delete_checkbox' value='" + (ele.code) + "'></td>" +
                    "<td id="+ele.rawType.code+">" + (ele.rawType.name) + "</td>" +
                    "<td>" + (ele.batchNumber) + "</td>" +
                    "<td>kg</td>" +
                    "<td></td>" +
                    "<td>kg</td>" +
                    "<td><input type='text' style='text-align:center;' id='input_apply_amount' class='provider_input'  placeholder='请输入申请数量' value="+ (!ele.weight ? 0 : ele.weight) +" /></td>" +
                    "</tr>"
                )
            })

            var userStr = $.session.get('user')
            var userJson = JSON.parse(userStr)
            //todo
            $.get(servers.backup() + "check/getAll", {}, function (res) {
                res.data.forEach(function (e, index) {
                    $("#process_type").append(
                        "<option value='" + (e.code) + "'>" + (e.name) + "</option>"
                    )
                })
            })
            $("#ed_appl_date").text(new Date().Format("yyyy-MM-dd hh:mm:ss"))
            $("#ed_app_dep").text(userJson.department.name)
            $("#ed_cur_user").text(userJson.name)

            //实现全选
            var checkedBoxLen = $('.delete_checkbox:checked').length
            home.funcs.bindSelectAll($("#edit_checkAll"), $('.delete_checkbox'), checkedBoxLen, $("#edit_modal_table"))
        }
        , bindEditorClick: function (editBtns) {
            editBtns.off('click').on('click', function () {
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.lingLiao.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data//获取数据
                    number = items.number
                    //点击的时候需要弹出一个模态框
                    lingliao_apply.funcs.fillData_editor($("#edit_modal"), items)  //将获取的数据传到#detail_modal中
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#edit_modal"),
                        area: ['800px', '400px'],
                        btn: ['保存', '提交', '返回'],
                        offset: "auto",
                        closeBtn: 0,
                        /**保存和提交都要更新数据
                         * 但是区别在保存的auditStatus = 0
                         * 而 提交的auditStatus = 1，并使删除和button全失效
                         */
                        //保存 
                        yes: function (index) {
                            $("#edit_modal").css('display', 'none')
                            var pickingApplies = [];

                            $('.delete_checkbox').each(function () {
                                // console.log($(".delete_checkbox:checked").length)
                                var e = $(this).parent('td').parent('tr').children('td')
                                var rawTypeCode = e.attr('id')
                                
                                pickingApplies.push(
                                    {
                                        batchNumber: e.eq(2).text(),
                                        rawType: {code: rawTypeCode},  //应该是要传rawType.code
                                        unit: e.eq(5).text(),
                                        weight: e.eq(6).children('input').val()
                                    })
                            })
                            var processManageCode = $("#edit_select").val()
                            var processCode
                            console.log(processManageCode)
                            console.log(lingliao_apply.res)
                            lingliao_apply.res.forEach(function(e){
                                if(processManageCode === e.code){
                                    console.log(e.process.code)
                                    processCode = e.process.code
                                }
                            })
                            var userStr = $.session.get('user')
                            var userJson = JSON.parse(userStr)
                            var data = {
                                code: codeNumber,
                                number: number,
                                department: {code: items.department.code},
                                applyDate: new Date().getTime(),
                                processManage: {code: $("#edit_select").val()},
                                process: {code: processCode},
                                auditStatus: 0,
                                pickingStatus: items.pickingStatus,
                                user: {code: userJson.code},
                                applicant: {code: items.applicant.code},
                                curAuditorCode: userJson.code,
                                pickingTime: items.pickingTime,
                                pickingApplies: []
                            }
                            data.pickingApplies = pickingApplies
                            console.log(data)
                            $.ajax({
                                url: home.urls.lingLiao.update(),
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            lingliao_apply.init()
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
                        },
                        //提交
                        btn2: function (index) {
                            $("#edit_modal").css('display', 'none')
                            lingliao_apply.flag = 1;
                            var pickingApplies = [];
                            $('.delete_checkbox').each(function () {
                                var e = $(this).parent('td').parent('tr').children('td')
                                var rawTypeCode
                                switch (e.eq(1).text()) {
                                    case '前驱体' :
                                        rawTypeCode = 1;
                                        break;
                                    case '碳酸锂' :
                                        rawTypeCode = 2;
                                        break;
                                    case '正极材料520' :
                                        rawTypeCode = 3;
                                        break;
                                    case '正极材料306' :
                                        rawTypeCode = 4;
                                        break;
                                    default:
                                        break;
                                }
                                pickingApplies.push(
                                    {
                                        batchNumber: e.eq(2).text(),
                                        rawType: {code: rawTypeCode},  //应该是要传rawType.code
                                        unit: e.eq(5).text(),
                                        weight: e.eq(6).children('input').val()
                                    })
                            })
                            var processManageCode = $("#edit_select").val()
                            var processCode
                            lingliao_apply.res.forEach(function(e){
                                if(processManageCode === e.code){
                                    processCode = e.process.code
                                }
                            })
                            var userStr = $.session.get('user')
                            var userJson = JSON.parse(userStr)
                            var data = {
                                code: codeNumber,
                                number: number,
                                department: {code: items.department.code},
                                applyDate: new Date().getTime(),
                                processManage: {code: $("#edit_select").val()},
                                process: {code: processCode},
                                auditStatus: 1,
                                pickingStatus: items.pickingStatus,
                                user: {code: items.user.code},
                                applicant: {code: items.applicant.code},
                                pickingTime: items.pickingTime,
                                pickingApplies: []
                            }
                            data.pickingApplies = pickingApplies

                            $.ajax({
                                url: home.urls.lingLiao.update(),
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            lingliao_apply.init()
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

                        }
                        , btn3: function (index) {
                            $("#edit_modal").css('display', 'none')
                            layer.close(index)
                        }
                    })
                })
            })


            //编辑里面新增按钮事件
            const $tbody = $("#edit_modal_table").children('tbody')
            lingliao_apply.funcs.bindEditAddClick($("#edit_addBtn"), $tbody)

            //实现全选
            var checkedBoxLen = $('.delete_checkbox:checked').length
            home.funcs.bindSelectAll($("#edit_checkAll"), $('.delete_checkbox'), checkedBoxLen, $("#edit_modal_table"))

        }

        //编辑里面的新增按钮
        , bindEditAddClick: function (addBtn, $tbody) {
            addBtn.off('click').on('click', function () {
                lingliao_apply.funcs.fillData_to_edit_add("#edit_addModal");
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#edit_addModal"),
                    area: ['800px', '400px'],
                    btn: ['确认', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        //编辑-增加-确定 将勾选的数据append到上一个界面中去/***/
                        var batch_Number = $('#edit_add_input').val();
                        var rawTypeCode = $('#edit_add_select option:selected').val()
                        // var $tbody = $('#edit_modal_table').children('tbody')

                        if ($(".edit_add_search_checkbox:checked").length === 0) {
                            $("#addModal").css('display', 'none')
                            layer.close(index)
                            //console.log('length===0')
                        } else {
                            //将被选中的数据封装到data_availble中
                            var add_length = $(".edit_add_search_checkbox:checked").length
                            var rawType
                            $('.edit_add_search_checkbox').each(function () {
                                var text = $("#edit_add_select").options[$("#edit_add_select").selectedIndex].text()
                                console.log(text)
                                if ($(this).prop('checked')) {
                                    var e = $(this).parent('td').parent('tr').children('td') //取到选中的一行
                                    //console.log(e.eq(1).text())
                                    
                                    $tbody.append(
                                        "<tr>" +
                                        "<td><input type='checkbox' class='delete_checkbox' ></td>" +
                                        "<td id="+rawTypeCode+">" + (text) + "</td>" +
                                        "<td>" + (e.eq(1).text()) + "</td>" +
                                        "<td>" + (e.eq(3).text()) + "</td>" +
                                        "<td>" + (e.eq(2).text()) + "</td>" +
                                        "<td>kg</td>" +
                                        "<td><input type='text' id='input_apply_amount' style='text-align:center;' class='provider_input' placehodler='请输入申请数量' /></td>" +
                                        "</tr>"
                                    )
                                    var checkedBoxLen = $('.delete_checkbox:checked').length
                                    home.funcs.bindSelectAll($("#edit_checkAll"), $('.delete_checkbox'), checkedBoxLen, $("#edit_modal_table"))
                                }
                            })
                        }

                        $("#edit_addModal").css('display', 'none')
                        layer.close(index)
                    }

                    , btn2: function (index) {
                        $("#edit_addModal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
            //编辑-增加-搜索
            var edit_add_searchBtns = $("#edit_addModal_search");
            lingliao_apply.funcs.edit_add_search(edit_add_searchBtns)

            var edit_add_search_detailBtn = $(".edit_add_detail")
            lingliao_apply.funcs.edit_add_search_detail(edit_add_search_detailBtn);

            


        }
        //编辑里面的新增按钮数据读取操作
        , fillData_to_edit_add: function () {
            const $tbody = $("#edit_addModal_table").children('tbody')
            $tbody.empty()
           // $.get(home.urls.lingLiao.getAllrawType(), {}, function (result) {
            $.post(home.urls.lingLiao.getRawTypeByMaterialCode(), {
                materialCode:1
            }, function (result){
                var items = result.data //获取数据
                $("#edit_add_select").html("<option value='-1'>请选择物料名称</option>")
                items.forEach(function (e) {
                    $("#edit_add_select").append(
                        "<option value='" + e.code + "'>" + e.name + "</option>"
                    )
                })
            })
        }
        //编辑里面的删除按钮
        , bindEditDeleteClick: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                if ($('.delete_checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '批量删除',
                        content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除所有记录吗?</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            $('.delete_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    // console.log($(this).val())
                                    $(this).parent('td').parent('tr').remove();
                                }
                            })
                            layer.close(index)
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                }
            })
        }
        //编辑-新增-搜索
        , edit_add_search: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var rawType = $('#edit_add_select option:selected').val()
                var process = $('#edit_add_input').val();
                $.post(home.urls.lingLiao.getByRawTypeCodeAndBatchNumberLikeByPage(), {
                    rawTypeCode: rawType,
                    batchNumber: process
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#edit_addModal_table").children('tbody')
                    lingliao_apply.funcs.edit_renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'lingLiao_edit_add_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.lingLiao.getByRawTypeCodeAndBatchNumberLikeByPage(), {
                                    rawTypeCode: rawType,
                                    batchNumber: process,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#edit_addModal_table").children('tbody')
                                    lingliao_apply.funcs.edit_renderHandler($tbody, items)
                                    lingliao_apply.pageSize = result.data.length
                                })
                            }
                        }
                    })
                })
            })
        },
        edit_renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            if(items!=null){
            items.forEach(function (e) {
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='edit_add_search_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.batchNumber ? e.batchNumber : '') + "</td>" +
                    "<td>" + (e.currentAvailableMaterials ? e.currentAvailableMaterials : '0') + "</td>" +
                    "<td>" + (e.materialsUnit ? e.materialsUnit : 'kg') + "</td>" +
                    "<td>" + (e.judgeCode ? e.judgeCode : '') + "</td>" +
                    "<td><a href=\"#\" class='edit_add_detail' id='detail-" + (e.batchNumber) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "</tr>"
                )
            })
       }

            var edit_add_search_detailBtn = $(".edit_add_detail")
            lingliao_apply.funcs.edit_add_search_detail(edit_add_search_detailBtn);
            //实现全选
            var checkedBoxLen = $('.edit_add_search_checkbox:checked').length
            home.funcs.bindSelectAll($("#edit_add_search_checkAll"), $('.edit_add_search_checkbox'), checkedBoxLen, $("#edit_addModal_table"))


        }
        //编辑-新增-搜索-详情
        , edit_add_search_detail: function (detailBtns) {
            detailBtns.off('click')
            detailBtns.on('click', function () {
                //console.log(1111)
                var _selfBtn = $(this)
                var batchNumber = _selfBtn.attr('id').substr(7)
                var currId = parseInt($('#edit_add_select option:selected').val()) 
                lingliao_apply.res = []

                if(currId===1){
                    $.post(home.urls.rawPresoma.getByBatchNumber(),{
                        batchNumber:batchNumber
                    },function(result){
                        var res = result.data
                        //console.log(res)
                        //console.log(currId)
                        //console.log('Presoma')
                        layer.open({
                            type: 1,
                            content: lingliao_apply.funcs.getData(res),
                            area: ['720px', '700px'],
                            btn: ['关闭'],
                            offset: 'auto',   // ['10%', '40%'],
                            btnAlign: 'c',
                            yes: function (index) {
                                layer.close(index);
                            }
                        })
                    })
                }else if(currId===2){
                    $.post(home.urls.rawLithium.getByBatchNumber(),{
                        batchNumber:batchNumber
                    },function(result){
                        var res = result.data
                        //console.log(res)
                        //console.log(currId)
                        //console.log('Lithium')
                        layer.open({
                            type: 1,
                            content: lingliao_apply.funcs.getData(res),
                            area: ['720px', '700px'],
                            btn: ['关闭'],
                            offset: 'auto',   // ['10%', '40%'],
                            btnAlign: 'c',
                            yes: function (index) {
                                layer.close(index);
                            }
                        })
                    })
                }else{
                    $.post(home.urls.product.getByBatchNumber(),{
                        batchNumber:batchNumber
                    },function(result){
                        var res = result.data
                        //console.log(res) 
                        // console.log(currId)
                        //console.log('Product')
                        layer.open({
                            type: 1,
                            content: lingliao_apply.funcs.getData(res),
                            area: ['720px', '700px'],
                            btn: ['关闭'],
                            offset: 'auto',   // ['10%', '40%'],
                            btnAlign: 'c',
                            yes: function (index) {
                                layer.close(index);
                            }
                        })
                    })                
                }   
                })

        },
        getData: function (items) {
            var currId = parseInt($('#edit_add_select option:selected').val()) 
            if(currId === 1) {
                data = lingliao_apply.funcs.getTablePresoma(items);
            }
            else if(currId === 2){
                data = lingliao_apply.funcs.getTableLithium(items);
               // console.log('Lithium')
            }else{
                data = lingliao_apply.funcs.getTableProduct(items);
               // console.log('Product')
            }    
            return data;
        }
        , getTableProduct: function (product) {
            return (
                "<div id='auditModal' style='padding:20px;'>"+
                "<table id='audit_table_inner' class='table_inner' align='center' width='100%'>" +
                "<thead>" +
                " <tr> <td colspan='2'>批号</td><td>检测日期</td> <td>数量(t)</td> <td>判定</td> <td></td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + (product.batchNumber) + "</td><td>" + (new Date(product.testDate).Format('yyyy-MM-dd')) + "</td> <td>" + (product.number) + "</td> <td>" + (product.judge ? product.judge.name : null) + "</td> <td></td> </tr>" +
                " </tbody>" +
                "<thead>" +
                " <tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td> <td></td> </tr>" +
                "</thead>" +
                "<tbody>" +
                " <tr> <td colspan='2'>" + (product.status ? product.status.name : '') + "</td> <td>" + (product.publisher ? product.publisher.name : '') + "</td> <td></td> <td></td> <td></td> </tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td> <td>三级控制标准</td> <td>2016-3-2三级控制标准</td> <td>" + (product.batchNumber) + "</td> <td>编辑</td> </tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>振实密度(g/cm3)</td><td>≥2.0</td><td>2.3~2.7</td> <td>" + (product.p1) + "</td><td></td></tr>" +
                " <tr> <td colspan='2'>水分（ppm）</td>  <td>≤500</td>  <td>≤200</td>  <td>" + (product.p2) + "</td>  <td></td> </tr>" +
                "<tr> <td colspan='2'>SSA（m2/g）</td> <td>0.20~0.40</td> <td>0.22~0.48</td> <td>" + (product.p3) + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>pH值</td> <td>&le;11.80</td> <td>&le;11.80</td> <td>" + (product.p4) + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Li2CO3（%）</td> <td></td> <td>&le;0.25</td> <td>" + (product.p5) + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>LiOH（%）</td> <td></td> <td>&le;0.20</td> <td>" + (product.p6) + "</td> <td></td> </tr>" +
                "<tr> <td rowspan='5'>粒度（um）</td> <td>D1</td> <td></td> <td>&ge;3.00</td> <td>" + (product.p8) + "</td> <td></td> </tr>" +
                "<tr> <td>D10</td> <td>&ge;6.00</td> <td>&ge;5.00</td> <td>" + (product.p9) + "</td> <td></td> </tr>" +
                "<tr> <td>D50</td> <td>11.00~14.00</td> <td>11.30~13.3</td> <td>" + product.p10 + "</td> <td></td> </tr>" +
                "<tr> <td>D90</td> <td>&le;30.00</td> <td>&le;30.00</td> <td>" + product.p11 + "</td> <td></td> </tr>" +
                " <tr> <td>D99</td> <td></td> <td>&le;40.00</td> <td>" + product.p12 + "</td> <td></td> </tr>" +
                "<tr> <td rowspan='5'>磁性物质检测（ppb）</td> <td>粒度宽度系数</td> <td></td> <td></td> <td>" + product.p13 + "</td> <td></td> </tr>" +
                "<tr> <td>Fe</td> <td></td> <td></td> <td></td> <td></td> </tr>" +
                " <tr> <td>Ni</td> <td></td> <td></td> <td>" + product.p15 + "</td> <td></td> </tr>" +
                "<tr> <td>Cr</td> <td></td> <td></td> <td>" + product.p15 + "</td> <td></td> </tr>" +
                "<tr> <td>Zn</td> <td></td> <td></td> <td>" + product.p17 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>总量</td> <td>&le;50</td> <td>&le;50</td> <td>" + product.p18 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Co（mol%）</td> <td>12.20&plusmn;1.0</td> <td>19.7&plusmn;0.5</td> <td>" + product.p19 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Mn（ppm）</td> <td></td> <td>19.9&plusmn;0.5</td> <td>" + product.p20 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Ni（ppm）</td> <td></td> <td>60.4&plusmn;0.5</td> <td>" + product.p21 + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>Li（%）</td> <td>7.0&plusmn;0.5</td> <td>7.0&plusmn;0.5</td> <td>" + product.p22 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Co （%）</td> <td>12.20&plusmn;1.0</td> <td>12.20&plusmn;1.0</td> <td>" + product.p23 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Mn（%）</td> <td>11.4&plusmn;1.0</td> <td>11.4&plusmn;1.0</td> <td>" + product.p24 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Ni（%）</td> <td>36.2&plusmn;1.0</td> <td>36.2&plusmn;1.0</td> <td>" + product.p25 + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>Na （ppm）</td> <td>&le;200</td> <td>&le;200</td> <td>" + product.p26 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Mg （ppm）</td> <td>&le;200</td> <td>&le;200</td> <td>" + product.p27 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Ca （ppm）</td> <td>&le;200</td> <td>&le;200</td> <td>" + product.p28 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Fe（ppm）</td> <td>&le;50</td> <td>&le;30</td> <td>" + product.p29 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Cu（ppm）</td> <td>&le;50</td> <td>&le;20</td> <td>" + product.p30 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Zn（ppm）</td> <td>&le;50</td> <td>&le;30</td> <td>" + product.p31 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>S（ppm）</td> <td></td> <td>&le;1500</td> <td>" + product.p32 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>Al（ppm）</td> <td></td> <td></td> <td>" + product.p33 + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>0.1C放电容量（mAh/g）</td> <td>1000&plusmn;300</td> <td>1000&plusmn;300</td> <td>" + product.p34 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>0.1C首次放电效率（%）</td> <td></td> <td>&ge;177.5</td> <td>" + product.p35 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>1C放电容量（mAh/g）</td> <td></td> <td>&ge;88.0</td> <td>" + product.p36 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>主原料</td> <td></td> <td>&ge;162</td> <td>" + product.p37 + "</td> <td></td> </tr>" +
                "<tr> <td colspan='2'>成品外观、重量抽查结果</td> <td></td> <td></td> <td>" + product.p38 + "</td> <td></td> </tr>" +
                " <tr> <td colspan='2'>产线</td> <td></td> <td></td> <td>" + product.p39 + "</td> <td></td> </tr>" +
                "</tbody>" +
                "</table>"+
                "</div>"
            )
        }
        , getTablePresoma: function (presoma) {
            return (
                "<div id='div_table' style='padding:20px;'>" +
                "<table id='audit_table_inner' class='table_inner' align='center' width='100%'>" +
                "<thead>" +
                "<tr> <td colspan='2'>批号</td> <td>检测日期</td> <td>数量(t)</td> <td>判定</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + (presoma.batchNumber) + "</td> <td>" + (new Date(presoma.testDate).Format('yyyy-MM-dd')) + "</td> <td>" + (presoma.number) + "</td> <td>" + (presoma.judge ? presoma.judge.name : '无') + "</td></tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td></tr>" +
                "</thead>" +
                "<tr> <td colspan='2'>" + (presoma.status?presoma.status.name:'') + "</td> <td>" + (presoma.publisher ? presoma.publisher : '') + "</td> <td></td> <td></td></tr>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td> <td>控制采购标准-2016-11-21</td> <td>2017.07.01采购标准</td> <td>" + (presoma.batchNumber) + "</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>振实密度(g/cm3)</td> <td>&ge;2.0</td> <td></td> <td>" + presoma.c1 + "</td></tr>" +
                "<tr> <td colspan='2'>水分(ppm)</td> <td>&le;1.0</td> <td></td> <td>" + presoma.c2 + "</td></tr>" +
                "<tr> <td colspan='2'>SSA(m2/g)</td> <td>4.0~7.0</td> <td></td> <td>" + presoma.c3 + "</td></tr>" +
                "<tr> <td colspan='2'>pH值</td> <td>7.0~9.0</td> <td></td> <td>" + presoma.c4 + "</td></tr>" +
                "<tr> <td rowspan='5'>粒度(&mu;m)</td> <td>&ge;2.5</td> <td></td> <td></td> <td>" + presoma.c5 + "</td></tr>" +
                "<tr> <td>D10</td> <td>&ge;5.0</td> <td></td> <td>" + presoma.c6 + "</td></tr>" +
                "<tr> <td>D50</td> <td>9.8~10.5</td> <td></td> <td>" + presoma.c7 + "</td></tr>" +
                "<tr> <td>D90</td> <td>&le;22</td> <td></td> <td>" + presoma.c8 + "</td></tr>" +
                "<tr> <td>D99</td> <td>&le;35</td> <td></td> <td>" + presoma.c9 + "</td></tr>" +
                "<tr> <td colspan='2'>筛上物</td> <td>&le;0.3</td> <td></td> <td>" + presoma.c10 + "</td></tr>" +
                "<tr> <td rowspan='5'>磁性物质检测(ppb)</td> <td>Fe</td> <td></td> <td></td> <td>" + presoma.c11 + "</td></tr>" +
                "<tr> <td>Ni</td> <td></td> <td></td> <td>" + presoma.c12 + "</td></tr>" +
                "<tr> <td>Cr</td> <td></td> <td></td> <td>" + presoma.c13 + "</td></tr>" +
                "<tr> <td>Zn</td> <td></td> <td></td> <td>" + presoma.c14 + "</td></tr>" +
                "<tr> <td>总量</td> <td>&le;100</td> <td></td> <td>" + presoma.c15 + "</td></tr>" +
                "<tr> <td colspan='2'>Ni+Co+Mn(%)</td> <td>60~64</td> <td>19.7&plusmn;0.5</td> <td>" + presoma.c16 + "</td></tr>" +
                "<tr> <td colspan='2'>Co(%)</td> <td>12.2~13.0</td> <td></td> <td>" + presoma.c17 + "</td></tr>" +
                "<tr> <td colspan='2'>Mn(%)</td> <td>11.6~12.2</td> <td></td> <td>" + presoma.c18 + "</td></tr>" +
                "<tr> <td colspan='2'>Ni(%)</td> <td>37.6~38.8</td> <td></td> <td>" + presoma.c19 + "</td></tr>" +
                "<tr> <td colspan='2'>Na(ppm)</td> <td>&le;120</td> <td></td> <td>" + presoma.c20 + "</td></tr>" +
                "<tr> <td colspan='2'>Mg(ppm)</td> <td>&le;100</td> <td></td> <td>" + presoma.c21 + "</td></tr>" +
                "<tr> <td colspan='2'>Ca(ppm)</td> <td>&le;100</td> <td></td> <td>" + presoma.c22 + "</td></tr>" +
                "<tr> <td colspan='2'>Fe(ppm)</td> <td>&le;50</td> <td></td> <td>" + presoma.c23 + "</td></tr>" +
                "<tr> <td colspan='2'>Cu(ppm)</td> <td>&le;50</td> <td></td> <td>" + presoma.c24 + "</td></tr>" +
                "<tr> <td colspan='2'>Cd(ppm)</td> <td>&le;20</td> <td></td> <td>" + presoma.c25 + "</td></tr>" +
                "<tr> <td colspan='2'>Zn(ppm)</td> <td>&le;40</td> <td></td> <td>" + presoma.c26 + "</td></tr>" +
                "<tr> <td colspan='2'>S(ppm)</td> <td>&le;1000</td> <td>&le;1300</td> <td>" + presoma.c27 + "</td></tr>" +
                "<tr> <td colspan='2'>Cl-(%)</td> <td>&le;0.03</td> <td></td> <td>" + presoma.c28 + "</td></tr>" +
                "<tr> <td colspan='2'>Zr(ppm)</td> <td></td> <td></td> <td>" + presoma.c29 + "</td></tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" 
            );
        },
        getIcon: function (status, code) {
            if (status == 1) {
                return "<a href=\"#\" class='audit' id='audit-" + code + "'><i class=\"layui-icon\">&#xe6b2;";
            }
            else {
                return "<a href=\"#\" class='detail' id='check-" + code + "'><i class=\"layui-icon\">&#xe60a;";
            }
        },

        /**
         * lithium表格-已完成
         * @param lithium
         * @returns {string}
         */
        getTableLithium: function (lithium) {
            return (
                "<div id='div_table' style='padding:20px;'>" +
                "<table id='audit_table_inner' class='table_inner' align='center' width='100%'>" +
                "<thead>" +
                "<tr> <td colspan='2'>批号</td> <td>检测日期</td> <td>数量(t)</td> <td>判定</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>" + (lithium.batchNumber ? lithium.batchNumber : '') + "</td> <td>" + (new Date(lithium.testDate).Format('yyyy-MM-dd')) + "</td> <td>" + (lithium.number) + "</td> <td>" + (lithium.judge?lithium.judge.name:'') + "</td></tr>" +
                "</tbody>" +
                "<thead>" +
                "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td></tr>" +
                "</thead>" +
                "<tr> <td colspan='2'>" + (lithium.status?lithium.status.name:'')+ "</td> <td>" + (lithium.publisher ? lithium.publisher : '') + "</td> <td></td> <td></td></tr>" +
                "<thead>" +
                "<tr> <td colspan='2'>检测项目</td><td colspan='2'>原料技术标准<td>" + (lithium.batchNumber) + "</td></tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr> <td colspan='2'>水分(%)</td> <td>&le;0.25</td> <td>&le;0.25</td> <td>" + (lithium.c1) + "</td></tr>" +
                "<tr> <td rowspan='5'>粒度(&mu;m)</td> <td>D1</td> <td></td> <td></td> <td>" + (lithium.c2) + "</td></tr>" +
                "<tr> <td>D10</td> <td></td> <td></td> <td>" + lithium.c3 + "</td></tr>" +
                "<tr> <td>D50</td> <td>3~7</td> <td>3~7</td> <td>" + lithium.c4 + "</td></tr>" +
                "<tr> <td>D90</td> <td>&le;30</td> <td>&le;30</td> <td>" + lithium.c5 + "</td></tr>" +
                "<tr> <td>D99</td> <td></td> <td></td> <td>" + lithium.c6 + "</td></tr>" +
                "<tr> <td colspan='2'>筛上物</td> <td>&le;0.3</td> <td>&le;0.3</td> <td>" + lithium.c7 + "</td></tr>" +
                "<tr> <td rowspan='5'>磁性物质检测(ppb)</td> <td>Fe</td> <td></td> <td></td> <td>" + lithium.c8 + "</td></tr>" +
                "<tr> <td>Ni</td> <td></td> <td></td> <td>" + lithium.c9 + "</td></tr>" +
                "<tr> <td>Cr</td> <td></td> <td></td> <td>" + lithium.c10 + "</td></tr>" +
                "<tr> <td>Zn</td> <td></td> <td></td> <td>" + lithium.c11 + "</td></tr>" +
                "<tr> <td>总量</td> <td>&le;800</td> <td>&le;500</td> <td>" + lithium.c12 + "</td></tr>" +
                "<tr> <td colspan='2'>Li2CO3(%)</td> <td>&ge;18.66</td> <td>&ge;18.66</td> <td>" + lithium.c13 + "</td></tr>" +
                "<tr> <td colspan='2'>Na(ppm)</td> <td>&le;250</td> <td>&le;250</td> <td>" + lithium.c14 + "</td></tr>" +
                "<tr> <td colspan='2'>Mg(ppm)</td> <td>&le;80</td> <td>&le;80</td> <td>" + lithium.c15 + "</td></tr>" +
                "<tr> <td colspan='2'>Ca(ppm)</td> <td>&le;50</td> <td>&le;50</td> <td>" + lithium.c16 + "</td></tr>" +
                "<tr> <td colspan='2'>Fe(ppm)</td> <td>&le;10</td> <td>&le;10</td> <td>" + lithium.c17 + "</td></tr>" +
                "</tbody>" +
                "</table>" +
                "</div>" 
            );
        }


        //详情按钮
        , bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                //console.log($(this).attr('id'))
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.lingLiao.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data//获取数据
                    //点击的时候需要弹出一个模态框
                    lingliao_apply.funcs.fillData_detail($("#detail_modal"), items)  //将获取的数据传到#detail_modal中
                    layer.open({
                        type: 1,
                        title: '详情',
                        content: $("#detail_modal"),
                        area: ['800px', '400px'],
                        btn: ['返回'],
                        offset: "auto",
                        closeBtn: 0,
                        yes: function (index) {
                            $("#detail_modal").css('display', 'none')
                            layer.close(index)
                        }
                    });
                })
            })
        }

        /** 刷新事件 */
        , bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {

                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    lingliao_apply.init()
                   // $("#status option[]")
                    layer.close(index)
                    clearTimeout(time)
                }, 200)

            })
        }
        /** 批量删除事件 */
        , bindDeleteEventListener: function (deleteBatchBtn) {
            deleteBatchBtn.off('click')
            deleteBatchBtn.on('click', function () {
                if ($('.lingliao_apply_checkbox:checked').length === 0) {
                    layer.msg('亲,您还没有选中任何数据！', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                } else {
                    layer.open({
                        type: 1,
                        title: '批量删除',
                        content: "<h5 style='text-align: center;padding-top: 8px'>确认要删除所有记录吗?</h5>",
                        area: ['190px', '130px'],
                        btn: ['确认', '取消'],
                        offset: ['40%', '55%'],
                        yes: function (index) {
                            var lingLiaoCodes = []
                            $('.lingliao_apply_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    lingLiaoCodes.push({code: $(this).val()})
                                }
                            })
                            $.ajax({
                                url: home.urls.lingLiao.deleteByBatchCodeBatchCode(),
                                contentType: 'application/json',
                                data: JSON.stringify(lingLiaoCodes),
                                dataType: 'json',
                                type: 'post',
                                success: function (result) {
                                    if (result.code === 0) {
                                        var time = setTimeout(function () {
                                            lingliao_apply.init()
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
                        },
                        btn2: function (index) {
                            layer.close(index)
                        }
                    })
                }
            })
        }

        /**根据审核状态搜索*/
        ,bindstatusSearchEventListener:function(searchBtn){
            searchBtn.off('change').on('change',function(){
                var status = $(this).val()
                $.post(home.urls.lingLiao.getByAuditStatusByPage(), {
                    auditStatus: status,
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#lingliao_apply_table").children('tbody')
                    lingliao_apply.funcs.renderHandler($tbody, items,0)
                    layui.laypage.render({
                        elem: 'lingLiao_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.lingLiao.getByAuditStatusByPage(), {
                                    auditStatus: status,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    var page = obj.curr - 1
                                    const $tbody = $("#lingliao_apply_table").children('tbody')
                                    lingliao_apply.funcs.renderHandler($tbody, items,page)
                                    lingliao_apply.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
         /** 根据流程类型搜索 */
         , bindProcessSearchEventListener: function (searchBtn) {
            searchBtn.off('change')
            searchBtn.on('change', function () {
                var process = $('#processtype option:selected').val();
                $.post(home.urls.lingLiao.getByProcessManageByPage(), {
                    processManageCode: process
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#lingliao_apply_table").children('tbody')
                    lingliao_apply.funcs.renderHandler($tbody, items,0)
                    layui.laypage.render({
                        elem: 'lingLiao_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.lingLiao.getByProcessManageByPage(), {
                                    processManageCode: process,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    var page = obj.curr - 1
                                    const $tbody = $("#lingliao_apply_table").children('tbody')
                                    lingliao_apply.funcs.renderHandler($tbody, items,page)
                                    lingliao_apply.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
        /** 根据审核状态和流程类型搜索 */
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var status = $('#status').val()
                var process = $('#processtype option:selected').val();
                $.post(home.urls.lingLiao.getByAuditStatusAndProcessManageByPage(), {
                    auditStatus: status,
                    processManageCode: process
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    //console.log(items)
                    const $tbody = $("#lingliao_apply_table").children('tbody')
                    lingliao_apply.funcs.renderHandler($tbody, items,0)
                    layui.laypage.render({
                        elem: 'lingLiao_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.lingLiao.getByAuditStatusAndProcessManageByPage(), {
                                    auditStatus: status,
                                    processManageCode: process,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    var page = obj.curr - 1
                                    const $tbody = $("#lingliao_apply_table").children('tbody')
                                    lingliao_apply.funcs.renderHandler($tbody, items,page)
                                    lingliao_apply.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        },
    }
}

