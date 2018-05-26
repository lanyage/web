var pro_out_manage = {
    pageSize: null,
    init: function () {

        /** 渲染下拉菜单 */
        pro_out_manage.funcs.renderTable()
        pro_out_manage.funcs.bindCreatoption()
        //////////////////////////////////
        //bind SelectAll for addModal checkBoxes  增加按钮里面的全选
        //////////////////////////////////
        /**  var checkedBoxLen = $('.add_checkbox:checked').length
         home.funcs.bindSelectAll($("#add_checkAll"), $('.add_checkbox'), checkedBoxLen, $("#add_modal_table"))

         //bind selectAll 产品出库全选实现
         var checkedBoxLen = $('.product_out_checkbox:checked').length
         home.funcs.bindSelectAll($("#product_out_checkAll"), $('.product_out_checkbox'), checkedBoxLen, $("#product_out_table"))

         var checkedBoxLen = $('.addModal_checkbox:checked').length
         home.funcs.bindSelectAll($("#addModal_checkALl"), $('.addModal_checkbox'), checkedBoxLen, $("#addModal_table"))**/
        /** 渲染表格 */
       
        // pro_out_manage.funcs.checkboxEventBinding()
        /** 将分页居中 */
        var out = $('#product_out_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#product_out_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },

    funcs: {
        bindCreatoption: function () {
            //todo
        },
        renderTable: function () {
             console.log(11111)
            $.post(home.urls.productOut.getAllByPage(), {}, function (res) {
                
                var $tbody = $("#product_out_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
               
                pro_out_manage.funcs.renderHandler($tbody, items)
                /** 渲染表格结束之后 */
                pro_out_manage.pageSize = res.data.content.length //该页的记录数
                var page = res.data //分页json
                /** 分页信息 */
                layui.laypage.render({
                    elem: 'product_out_page',
                    count: 10 * page.totalPages,//数据总数
                    /** 页面变化后的逻辑 */
                    jump: function (obj, first) {
                        if (!first) {
                            $.post(home.urls.productOut.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#product_out_page").children('tbody')
                                pro_out_manage.funcs.renderHandler($tbody, items)
                                pro_out_manage.pageSize = result.data.content.length
                            })
                        }
                    }
                })
            })

            // /** 绑定全选事件 */
            // pro_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var addBtns = $('#model-li-hide-add-51')
            pro_out_manage.funcs.bindAddClick(addBtns)


            //增加按钮里面增加按钮
            var checkedBoxLen = $('.add1_checkbox:checked').length
            home.funcs.bindSelectAll($("#add1_checkAll"), $('.add1_checkbox'), checkedBoxLen, $("#add_modal1_table"))

            var verifyBtns = $(".verify")
            pro_out_manage.funcs.bindVerifyClick(verifyBtns)
            var detailBtns = $(".detail")
            pro_out_manage.funcs.bindDetailClick(detailBtns)
            var editorBtns = $(".editor")
            pro_out_manage.funcs.bindEditorClick(editorBtns)
            var deleteBtns = $(".delete")
            pro_out_manage.funcs.bindDeleteClick(deleteBtns)

            //增加按钮全选
            checkedBoxLen = $(".add_checkbox:checked").length
            home.funcs.bindSelectAll($("#add_checkAll"), $(".add_checkbox"), checkedBoxLen, $("#add_modal_table"))


        }

        /**渲染表格 */
        , renderHandler: function ($tbody, items) {
            $tbody.empty() //清空表格
            items.forEach(function (e) {
                var code = e.code
                var content = (
                    "<tr>" +
                    "<td><input type='checkbox' class='product_out_checkbox' value='" + (e.code) + "'></td>" +
                    "<td>" + e.code + "</td>" +
                    "<td>" + (e.department ? e.department.name : null) + "</td>" +
                    "<td>" + (new Date(e.applyDate).Format('yyyy/MM/dd')) + "</td>" +
                    "<td>" + (e.processManage ? e.processManage.code : null) + "</td>" +
                    "<td>" + e.auditStatus + "</td>" +
                    "<td><a href=\"#\" class='verify'id='verify-" + (code) + "'><i class=\"layui-icon\">&#xe6b2;</i></a></td>" +
                    "<td><a href=\"#\" class='detail' id='detail-" + (code) + "'><i class=\"layui-icon\">&#xe60a;</i></a></td>" +
                    "<td><a href=\"#\" class='editor' id='editor-" + (code) + "'><i class=\"layui-icon\">&#xe642;</i></a></td>" +
                    "<td><a href=\"#\" class='delete' id='delete-" + (code) + "'><i class='fa fa-times-circle-o'></a></td>" +
                    "</tr>"
                )
                $tbody.append(content)
            })
            // /** 绑定全选事件 */
            // mat_out_manage.funcs.checkboxEventBinding()
            /** 数据渲染完毕之后,需要进行绑定详情点击按钮事件 */
            var verifyBtns = $(".verify")
            pro_out_manage.funcs.bindVerifyClick(verifyBtns)
            var detailBtns = $(".detail")
            pro_out_manage.funcs.bindDetailClick(detailBtns)
            var editorBtns = $(".editor")
            pro_out_manage.funcs.bindEditorClick(editorBtns)
            var deleteBtns = $(".delete")
            pro_out_manage.funcs.bindDeleteClick(deleteBtns)
            //产品出库全选
            var checkBoxLen = $(".product_out_checkbox:checked").length
            home.funcs.bindSelectAll($("#product_out_checkAll"), $(".product_out_checkbox"), checkBoxLen, $("#product_out_table"))
        }


        /**新增 */
        , bindAddClick: function (addBtns) {
            addBtns.off('click')
            addBtns.on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    xccccc                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            c 
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#add_modal"),
                    area: ['800px', '400px'],
                    btn: ['保存', '提交', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#add_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#add_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn3: function (index) {
                        $("#add_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })

            var add_addBtn = $('#add_addBtn')
            pro_out_manage.funcs.bindAddClick1(add_addBtn)
        }
        /**新增里面的新增 */
        , bindAddClick1: function (add_addBtn) {
            add_addBtn.off('click')
            add_addBtn.on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    xccccc                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            c 
                layer.open({
                    type: 1,
                    title: '查询',
                    content: $("#add_modal1"),
                    area: ['800px', '400px'],
                    btn: ['确定', '取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#add_modal1").css('display', 'none')

                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#add_modal1").css('display', 'none')
                        layer.close(index)
                    }
                });
            })

        }
        /**审核 */
        , bindVerifyClick: function (verifyBtns) {
            verifyBtns.off('click')
            verifyBtns.on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                layer.open({
                    type: 1,
                    title: '审核',
                    content: $("#verify_modal"),
                    area: ['800px', '400px'],
                    btn: ['通过', '不通过'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#verify_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#verify_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }

        /**详情 */
        , bindDetailClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
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
        }
        /**编辑 */
        , bindEditorClick: function (editBtns) {
            editBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '编辑',
                    content: $("#editor_modal"),
                    area: ['800px', '400px'],
                    btn: ['保存', '提交', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn3: function (index) {
                        $("#editor_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
            var edit_addBtn = $("#edit_addBtn")
            pro_out_manage.funcs.bindEditAddClick(edit_addBtn)

            //编辑按钮全选
            checkedBoxLen = $('.edit_checkbox:checked').length
            home.funcs.bindSelectAll($("#edit_checkAll"), $('.edit_checkbox'), checkedBoxLen, $("#edit_modal_table"))
        },
        /**编辑里面的增加按钮 */
        bindEditAddClick: function (detailBtns) {
            detailBtns.off('click').on('click', function () {
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                layer.open({
                    type: 1,
                    title: '详情',
                    content: $("#add_modal1"),
                    area: ['800px', '400px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#add_modal1").css('display', 'none')
                        layer.close(index)
                    }
                })
            })
        }
        /**删除对应记录 */
        , bindDeleteClick: function (deleteBtns) {
            deleteBtns.off('click')
            deleteBtns.on('click', function () {
                console.log(1)
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
                        $.post(home.urls.productOut.deleteByCode(), {
                            code: Code
                        }, function (result) {
                            layer.msg(result.message, {
                                offset: ['40%', '55%'],
                                time: 700
                            })
                            if (result.code === 0) {
                                var time = setTimeout(function () {
                                    pro_out_manage.init()
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
    }
}