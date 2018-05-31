var lingliao_apply = {
    init: function () {

        //
            var apply = {
                rawType:"",
                department:"",
                date:"",
                applyType:"",
                applyStatus:0,
                applyStatus:0,
                pickingApplies: [
                    {

                    },
                    {

                    }
                ]
            }
        //


        /** 渲染表格 */
        lingliao_apply.funcs.renderTable()
        /** 渲染下拉菜单 */
        lingliao_apply.funcs.bindCreatoption()
      

        var checkedBoxLen = $(".add_checkbox:checked").length
        home.funcs.bindSelectAll($("#add_checkAll"), $(".add_checkbox"), checkedBoxLen, $("#add_modal_table"))
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
                lingliao_apply.funcs.renderHandler($tbody, items)
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
                                const $tbody = $("#lingLiao_page").children('tbody')
                                lingliao_apply.funcs.renderHandler($tbody, items)
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
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            for (var i = 0; i < items.length; i++) {
                e = items[i];
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='lingliao_apply_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.department ? e.department.name : null) + "</td>" +
                    "<td>" + (new Date(e.applyDate).Format('yyyy-MM-dd')) + "</td>" +
                    "<td>" + (e.processManage ? e.processManage.code : null) + "</td>" +
                    "<td>" + e.auditStatus + "</td>" +
                    "<td>" + e.pickingStatus + "</td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (e.code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (e.code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (e.code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
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
            $.get(home.urls.check.getAll(), {}, function (result) {
                var value = result.data
                var length = value.length
                $("#processtype").html("<option>请选择流程类型</option>")
                for (var i = 0; i < length; i++) {
                    var text = value[i].name
                    $("#processtype").append("<option id='" + value[i].code + "' value='" + value[i].code + "'>" + text + "</option>");
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
                        console.log('删除',Code)
                        $.post(home.urls.lingLiao.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            console.log(result.code)
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
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    //确定按钮 实现批量增加   问题：怎样将多条数据封装
                    yes: function(index) {
                        $("#normal_add_modal").css('display', 'none')
                        var Addinfos = []
                            $('.add_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    lingLiaoCodes.push({code: $(this).val()})
                                }
                            })
                        $.ajax({
                            url: home.urls.lingLiao.update(),
                            contentType: 'application/json',
                            data: JSON.stringify(Addinfos),
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
                    btn2:function(index){
                        $("#normal_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
            lingliao_apply.funcs.bindEditAddClick($("#normal_add_addBtn"))
           // lingliao_apply.funcs.bindEditDeleteClick($("#normal_delete_Btn"))
        }
        ,add_fillData:function(selectChoice){
            $.get(servers.backup() + "check/getByProcessCode", { processCode:1 }, function (result) {
                item = result.data
                console.log(item)
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
        /** 正常申请页面里的新增按钮 */
        , bindNorApplyAddModel: function (norApplyAddBtns) {
            norApplyAddBtns.off('click').on('click', function () {
                lingliao_apply.funcs.fillData_to_edit_add("#addModal");
                layer.open({
                    type: 1,
                    title: '正常申请-新增',
                    content: $("#addModal"),
                    area: ['800px', '400px'],
                    btn: ['确认', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        //将选择的数据append到normal_add_modal_table表中  怎么将数据封装起来？？
                        /***
                         * var pickingApplies = items.pickingApplies
                         * $tbody = $("normal_add_modal_table").tbody
                         * $tbody.empty
                         * pickingApplies.forEach(function(e){
                         *      $tbody.append(
                         *          "<tr>" +
                         *          "<td><input type='checkbox' class='normal_add_checkbox' value='" + (ele.code) + "'></td>" +
                                    "<td>" + (ele.rawType.name) + "</td>" +
                                    "<td>" + (ele.batchNumber) + "</td>" +
                                    "<td>" + (!ele.unit ? 'kg' : ele.unit) + "</td>" +
                                    "<td>" + (!ele.weight ? 0 : ele.weight) + "</td>" +
                                    "<td></td>" +
                                    "<td></td>" +
                                    "</tr>"
                         * )
                         * }) */
                        $("#addModal").css('display', 'none')
                        layer.close(index)
                    },
                    btn2: function (index) {
                        $("#addModal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
             /** 正常申请页面里的新增页面里的搜索事件 */
             var norApplyAddSearchBtns = $('#addModal_search')
             lingliao_apply.funcs.bindNorApplyAddSearchModel(norApplyAddSearchBtns)
        }
        /** 正常申请页面里的新增页面里的搜索事件 */

        , bindNorApplyAddSearchModel: function (norApplyAddSearchBtns) {
            norApplyAddSearchBtns.off('click')
            norApplyAddSearchBtns.on('click', function () {
                var status = $('#status').val()
                var process = $('#processtype option:selected').val();
                $.post(home.urls.lingLiao.getByProcessManageByPage(), {
                    auditStatus: status,
                    processManageCode: process
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    const $tbody = $("#lingliao_apply_table").children('tbody')
                    lingliao_apply.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'lingLiao_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.lingLiao.getAllByPage(), {
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#lingLiao_page").children('tbody')
                                    lingliao_apply.funcs.renderHandler($tbody, items)
                                    lingliao_apply.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
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
                    btn: ['确定','返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#urgent_add_modal").css('display', 'none')
                        layer.close(index)
                    },
                    btn2: function (index) {
                        $("#urgent_add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
            lingliao_apply.funcs.bindEditAddClick($("#urgent_add_addBtn"))
           // lingliao_apply.funcs.bindEditDeleteClick($("#urgent_delete_btn"))

            //全选
        }
     
        ,urgent_add_fillData:function(){
            $.get(servers.backup() + "check/getByProcessCode", { processCode:0 }, function (result) {
                item = result.data
                console.log(item)
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
        /** 紧急申请页面里的新增按钮 */
        , bindUrgApplyAddModel: function (urgApplyAddBtns) {
            urgApplyAddBtns.off('click').on('click', function () {
                lingliao_apply.funcs.fillData_to_edit_add("#addModal");
                layer.open({
                    type: 1,
                    title: '紧急申请-新增',
                    content: $("#addModal"),
                    area: ['800px', '400px'],
                    btn: ['确认', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        //将选择的数据append到urgent_add_modal_table表中  怎么将数据封装起来？？
                        /***
                         * var pickingApplies = items.pickingApplies
                         * $tbody = $("urgent_add_modal_table").tbody
                         * $tbody.empty
                         * pickingApplies.forEach(function(e){
                         *      $tbody.append(
                         *          "<tr>" +
                         *          "<td><input type='checkbox' class='urgent_add_checkbox' value='" + (ele.code) + "'></td>" +
                                    "<td>" + (ele.rawType.name) + "</td>" +
                                    "<td>" + (ele.batchNumber) + "</td>" +
                                    "<td>" + (!ele.unit ? 'kg' : ele.unit) + "</td>" +
                                    "<td>" + (!ele.weight ? 0 : ele.weight) + "</td>" +
                                    "<td></td>" +
                                    "<td></td>" +
                                    "</tr>"
                         * )
                         * }) */
                        $("#addModal").css('display', 'none')
                        layer.close(index)
                    },
                    btn2: function (index) {
                        $("#addModal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        , bindDetailClickInAddModal: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '详情',
                    content: "<div>todo...</div>",
                    area: ['800px', '400px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        layer.close(index)
                    }
                });
            })
        }

        /**填充详情表格的弹出表格 */
        , fillData_detail: function (table, items) {

            $.get(servers.backup() + "process/getAll", {}, function (result) {
                item = result.data
                console.log(item)
                $("#detail_select").html("<option>请选择审批流程</option>");
                item.forEach(function (e) {
                    $("#detail_select").append("<option value=" + e.code + ">" + (e.name) + "</option>");
                })

            })
            console.log(items)
            var pickingApplies = items.pickingApplies
            var $tbody = $('#detail-table').children('tbody')
            $tbody.empty() //清空表格
            pickingApplies.forEach(function (ele) {
                //console.log(ele)
                $tbody.append(
                    "<tr>" +
                    " <td>" + (ele.rawType.name) + "</td>" +
                    "<td>" + (ele.batchNumber) + "</td>" +
                    "<td>" + (!ele.unit ? 'kg' : ele.unit) + "</td>" +
                    "<td>" + (!ele.weight ? 0 : ele.weight) + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
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
            $.get(servers.backup() + "process/getAll", {}, function (result) {
                item = result.data
                console.log(item)
                $("#edit_select").html("<option>请选择审批流程</option>");
                item.forEach(function (e) {
                    $("#edit_select").append("<option value=" + e.code + ">" + (e.name) + "</option>");
                })

            })
            console.log(items)
            var pickingApplies = items.pickingApplies
            var $tbody = $('#edit_modal_table').children('tbody')
            $tbody.empty() //清空表格
            pickingApplies.forEach(function (ele) {
                console.log(ele)
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='delete_checkbox' value='" + (ele.code) + "'></td>" +
                    "<td>" + (ele.rawType.name) + "</td>" +
                    "<td>" + (ele.batchNumber) + "</td>" +
                    "<td>" + (!ele.unit ? 'kg' : ele.unit) + "</td>" +
                    "<td>" + (!ele.weight ? 0 : ele.weight) + "</td>" +
                    "<td></td>" +
                    "<td></td>" +
                    "</tr>"
                )
            })
            //实现全选
            var checkedBoxLen = $('.delete_checkbox:checked').length
            home.funcs.bindSelectAll($("#edit_checkAll"), $('.delete_checkbox'), checkedBoxLen, $("#edit_modal_table"))

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

        }
        , bindEditorClick: function (editBtns) {
            editBtns.off('click').on('click', function () {
                console.log($(this).attr('id'))
                var _selfBtn = $(this)
                var codeNumber = _selfBtn.attr('id').substr(7)
                $.post(home.urls.lingLiao.getByCode(), {
                    code: codeNumber
                }, function (result) {
                    var items = result.data//获取数据
                    //点击的时候需要弹出一个模态框
                    lingliao_apply.funcs.fillData_editor($("#editor_modal"), items)  //将获取的数据传到#detail_modal中
                    layer.open({
                        type: 1,
                        title: '编辑',
                        content: $("#edit_modal"),
                        area: ['800px', '400px'],
                        btn: ['保存', '提交', '返回'],
                        offset: "auto",
                        closeBtn: 0,
                        //保存  对应更新，将此条数据更新，并使删除和button全失效
                        yes: function (index) {
                            $("#edit_modal").css('display', 'none')
                            console.log($(this).find('td').eq(9).html())
                            $(this).find('td').eq(0).removeClass('lingliao_apply_checkbox').addClass('grey')
                            $(this).find('td').eq(9).removeClass('delete').addClass('grey')
                            layer.close(index)
                        },
                        //提交
                        btn2: function (index) {
                            //var Code = _selfBtn.attr('id').substr(7)
                            var department = _selfBtn.pickingApplies.$.post(home.urls.lingLiao.update(), {
                                code: codeNumber

                            }, function (result) {
                                layer.msg(result.message, {
                                    offset: ['40%', '55%'],
                                    time: 700
                                })
                                if (result.code === 0) {
                                    var time = setTimeout(function () {
                                        lingliao_apply.init()
                                        clearTimeout(time)
                                    }, 500)
                                }
                                $("#edit_modal").css('display', 'none')
                                layer.close(index)
                            })
                        }
                        , btn3: function (index) {
                            $("#edit_modal").css('display', 'none')
                            layer.close(index)
                        }
                    })
                })

            })
            //编辑里面新增按钮事件
            lingliao_apply.funcs.bindEditAddClick($("#edit_addBtn"))
          //  lingliao_apply.funcs.bindEditDeleteClick($("#edit_deleteBtn"));

            //实现全选
            var checkedBoxLen = $('.edit_add_search_checkbox:checked').length
            home.funcs.bindSelectAll($("#edit_add_search_checkAll"), $('.edit_add_search_checkbox'), checkedBoxLen, $("#edit_addModal_table"))

        }
        //编辑里面的新增按钮
        , bindEditAddClick: function (addBtn) {
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
                         //编辑-增加-确定 将勾选的数据append到上一个界面中去
                        /** if($(".addModal_checkbox:checked").length === 0) {
                             $("#addModal").css('display', 'none')
                             layer.close(index)
                         } else {
                            $("#addModal").css('display', 'none')
                            $('.addModal_checkbox').each(function () {
                                if ($(this).prop('checked')) {
                                    lingLiaoCodes.push({code: $(this).val()})
                                }
                            })*/
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

            var edit_add_search_detailBtn =  $(".edit_add_detail")
            lingliao_apply.funcs.edit_add_search_detail(edit_add_search_detailBtn);

            
        }
        //编辑里面的新增按钮数据读取操作
       ,fillData_to_edit_add:function(){
           $.get(home.urls.lingLiao.getAllrawType(),{
           },function(result){
               var items = result.data //获取数据
               console.log(items);
               $("#edit_add_select").html("<option>请选择原料类型</option>")
               items.forEach(function(e){
                    $("#edit_add_select").append(
                        "<option value='"+e.code+"'>" + e.name + "</option>"
                    )
               })
           })

          
       }
        //编辑里面的删除按钮
        ,bindEditDeleteClick:function(deleteBtns){
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                console.log('删除')
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
                                    console.log($(this).val())
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
        ,edit_add_search:function(searchBtn){
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var rawType = $('#edit_add_select option:selected').val()
                var process = $('#edit_add_input').val();
                console.log(rawType)
                console.log(process)
                $.post(home.urls.lingLiao.getDetail(), {
                    rawTypeCode: rawType,
                    batchNumber: process
                }, function (result) {
                    var items = result.data //获取数据
                    page = result.data
                    console.log(items)
                    const $tbody = $("#edit_addModal_table").children('tbody')
                    lingliao_apply.funcs.edit_renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'lingLiao_edit_add_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.lingLiao.getDetail(), {
                                    rawTypeCode: rawType,
                                    batchNumber: process,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data //获取数据
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
        } ,
        edit_renderHandler:function($tbody, items){
            $tbody.empty() //清空表格
            items.forEach(function(e){
                $tbody.append(
                    "<tr>" +
                    "<td><input type='checkbox' class='edit_add_search_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + (e.batchNumber?e.batchNumber:'null')+ "</td>" +
                    "<td>" + (e.currentAvailableMaterials?e.currentAvailableMaterials:'null') + "</td>" +
                    "<td>" + (e.meterialsUnit?e.meterialsUnit:'null') + "</td>" +
                    "<td>" + (e.judgeCode?e.judgeCode:'null') + "</td>" +
                    "<td><a href=\"#\" class='edit_add_detail' id='detail-" + (e.code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "</tr>"
                )
            })
                
            
            var edit_add_search_detailBtn =  $("#edit_add_detail")
            lingliao_apply.funcs.edit_add_search_detail(edit_add_search_detailBtn);
            
            
        }
        //编辑-新增-搜索-详情
        ,edit_add_search_detail:function(detailBtns){
                detailBtns.off('click')
                detailBtns.on('click', function () {
                    console.log(1111)
                    var _selfBtn = $(this)
                    var Code = _selfBtn.attr('id').substr(7)
                    var currId =$('#edit_add_select option:selected').val()
                    
                    $.post(currId === 1 ? home.urls.rawPresoma.getByCode() : home.urls.rawLithium.getByCode(), {code: Code}, function (result) {
                        console.log(currId)
                        console.log("查看" + Code)
                        var items = result.data
                        layer.open({
                            type: 1,
                            content:lingliao_apply.funcs.getData(items),
                            area: ['550px', '700px'],
                            btn: ['关闭'],
                            offset: 'auto',   // ['10%', '40%'],
                            btnAlign: 'c',
                            yes: function (index) {
                                layer.close(index);
                            }
                        })
                    })
                })
            },
            getData: function (items) {
                var currId =$('#edit_add_select option:selected').val()
                var data =
                    "<div id='auditModal'>" +
                    "<div class='arrow_div_left'>" +
                    "<span id='model-li-hide-left-113'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe603;</i></a></span>" +
                    "</div>" +
                    "<div class='arrow_div_right'>" +
                    "<span id='model-li-hide-right-113'><a href=\"#\"><i class=\"layui-icon\" style='font-size: 40px'>&#xe602;</i></a></span>" +
                    "</div>";
                if (currId === 2) {
                    data += lingliao_apply.funcs.getTableLithium(items);
                    console.log(currId)
                    console.log('Lithium')
                }
                else {
                    data += lingliao_apply.funcs.getTablePresoma(items);
                    console.log('Presoma')
                }
                return data;
            }

            ,getTablePresoma: function (presoma) {
                return (
                    "<div id='div_table' class='table_scroll'>" +
                    "<table id='audit_table_inner' class='table_inner' align='center'>" +
                    "<thead>" +
                    "<tr> <td colspan='2'>批号</td> <td>检测日期</td> <td>数量(t)</td> <td>判定</td></tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<tr> <td colspan='2'>" + presoma.batchNumber + "</td> <td>" + (new Date(presoma.testDate).Format('yyyy-MM-dd')) + "</td> <td>" + presoma.number + "</td> <td>" + (presoma.judge?presoma.judge.name:'无') + "</td></tr>" +
                    "</tbody>" +
                    "<thead>" +
                    "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td></tr>" +
                    "</thead>" +
                    "<tr> <td colspan='2'>" + presoma.status.name + "</td> <td>" + (presoma.publisher?presoma.publisher:'无') + "</td> <td></td> <td></td></tr>" +
                    "<thead>" +
                    "<tr> <td colspan='2'>检测项目</td> <td>控制采购标准-2016-11-21</td> <td>2017.07.01采购标准</td> <td>" + presoma.batchNumber + "</td></tr>" +
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
                    "</div>" +
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
                    "<div id='div_table' class='table_scroll'>" +
                    "<table id='audit_table_inner' class='table_inner' align='center'>" +
                    "<thead>" +
                    "<tr> <td colspan='2'>批号</td> <td>检测日期</td> <td>数量(t)</td> <td>判定</td></tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<tr> <td colspan='2'>" + (lithium.batchNumber?lithium.batchNumber:'null') + "</td> <td>" + (new Date(lithium.testDate).Format('yyyy-MM-dd')) + "</td> <td>" + lithium.number + "</td> <td>" + lithium.judge.name + "</td></tr>" +
                    "</tbody>" +
                    "<thead>" +
                    "<tr> <td colspan='2'>审核状态</td> <td>审核人</td> <td></td> <td></td></tr>" +
                    "</thead>" +
                    "<tr> <td colspan='2'>" + lithium.status.name + "</td> <td>" + (lithium.publisher?lithium.publisher:'无') + "</td> <td></td> <td></td></tr>" +
                    "<thead>" +
                    "<tr> <td colspan='2'>检测项目</td><td colspan='2'>原料技术标准<td>" + lithium.batchNumber + "</td></tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "<tr> <td colspan='2'>水分(%)</td> <td>&le;0.25</td> <td>&le;0.25</td> <td>" + lithium.c1 + "</td></tr>" +
                    "<tr> <td rowspan='5'>粒度(&mu;m)</td> <td>D1</td> <td></td> <td></td> <td>" + lithium.c2 + "</td></tr>" +
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
                    "</div>" +
                    "</div>"
                );
            }
    
        
        //详情按钮
        , bindDetailClick: function(detailBtns) {
            detailBtns.off('click').on('click', function () {
                console.log($(this).attr('id'))
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
        ,bindRefreshEventListener: function (refreshBtn) {
            refreshBtn.off('click')
            refreshBtn.on('click', function () {

                var index = layer.load(2, {offset: ['40%', '58%']});
                var time = setTimeout(function () {
                    layer.msg('刷新成功', {
                        offset: ['40%', '55%'],
                        time: 700
                    })
                    lingliao_apply.init()
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
        /** 搜索事件 */
        , bindSearchEventListener: function (searchBtn) {
            searchBtn.off('click')
            searchBtn.on('click', function () {
                var status = $('#status').val()
                var process = $('#processtype option:selected').val();
                console.log(status)
                console.log(process)
                $.post(home.urls.lingLiao.getByProcessManageByPage(), {
                    auditStatus: status,
                    processManageCode: process
                }, function (result) {
                    var items = result.data.content //获取数据
                    page = result.data
                    console.log(items)
                    const $tbody = $("#lingliao_apply_table").children('tbody')
                    lingliao_apply.funcs.renderHandler($tbody, items)
                    layui.laypage.render({
                        elem: 'lingLiao_page'
                        , count: 10 * page.totalPages//数据总数
                        , jump: function (obj, first) {
                            if (!first) {
                                $.post(home.urls.lingLiao.getByProcessManageByPage(), {
                                    auditStatus: status,
                                    processManageCode: process,
                                    page: obj.curr - 1,
                                    size: obj.limit
                                }, function (result) {
                                    var items = result.data.content //获取数据
                                    // var code = $('#model-li-select-48').val()
                                    const $tbody = $("#lingliao_apply_table").children('tbody')
                                    lingliao_apply.funcs.renderHandler($tbody, items)
                                    lingliao_apply.pageSize = result.data.content.length
                                })
                            }
                        }
                    })
                })
            })
        }
    }
}

