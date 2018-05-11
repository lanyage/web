var pro_out_manage = {
    pageSize: null,
    init:function(){

         /** 渲染表格 */
         pro_out_manage.funcs.renderTable()
         /** 渲染下拉菜单 */
         pro_out_manage.funcs.bindCreatoption()
        //////////////////////////////////
        //bind SelectAll for addModal checkBoxes 
        //////////////////////////////////
        var checkedBoxLen = $('.add_checkbox:checked').length
        home.funcs.bindSelectAll($("#add_checkAll"), $('.add_checkbox'), checkedBoxLen, $("#add_modal_table"))
        //bind selectAll
        var checkedBoxLen = $('.product_out_checkbox:checked').length
        home.funcs.bindSelectAll($("#product_out_checkAll"), $('.product_out_checkbox'), checkedBoxLen, $("#product_out_table"))
        var checkedBoxLen = $('.addModal_checkbox:checked').length
        home.funcs.bindSelectAll($("#addModal_checkALl"), $('.addModal_checkbox'), checkedBoxLen, $("#addModal_table"))
        /** 渲染表格 */
        pro_out_manage.funcs.renderTable()
        // pro_out_manage.funcs.checkboxEventBinding()
        /** 将分页居中 */
        var out = $('#product_out_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#product_out_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 30)
    },

    funcs:{
        renderTable: function () {

            $.post(home.urls.productOut.getAllByPage(), {}, function (res) {
                console.log(res.data.content)
                var $tbody = $("#product_out_table").children('tbody')
                /** 过滤返回的数据 */
                var items = res.data.content
                //console.log('AAAAAAAAAAAAAAAAAAAAAAAA')
                //console.log(items)
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
                            $.post(home.urls.department.getAllByPage(), {
                                page: obj.curr - 1,
                                size: obj.limit
                            }, function (result) {
                                var items = result.data.content //获取数据
                                const $tbody = $("#product_out_page").children('tbody')
                                pro_out_manage.funcs.renderHandler($tbody, items)
                                pro_out__manage.pageSize = result.data.content.length
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
            var verifyBtns = $(".verify")
            pro_out_manage.funcs.bindVerifyClick(verifyBtns)
            var detailBtns = $(".detail")
            pro_out_manage.funcs.bindDetailClick(detailBtns)
            var editorBtns = $(".editor")
            pro_out_manage.funcs.bindEditorClick(editorBtns)
            var deleteBtns = $(".delete")
            //pro_out_manage.funcs.bindDeleteClick(deleteBtns)
        }
        ,bindAddClick:function(addBtns){
            addBtns.off('click')
            addBtns.on('click',function(){
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    xccccc                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            c 
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#add_modal"),
                    area: ['800px', '400px'],
                    btn: ['保存','提交','返回'],
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
        }
        ,bindVerifyClick:function(verifyBtns){
            verifyBtns.off('click')
            verifyBtns.on('click',function(){
                //点击的时候需要弹出一个模态框
                // 而且要填充模态框里面的内容 todo
                layer.open({
                    type: 1,
                    title: '审核',
                    content: $("#verify_modal"),
                    area: ['800px', '400px'],
                    btn: ['通过','不通过'],
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
        }
    }
}