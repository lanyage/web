var lingliao_apply = {
    init: function () {

        //////////////////////////////////
        //bind SelectAll for editModal checkBoxes
        //////////////////////////////////
        var checkedBoxLen = $('.edit_checkbox:checked').length
        home.funcs.bindSelectAll($("#edit_checkAll"), $('.edit_checkbox'), checkedBoxLen, $("#edit_modal_table"))

        //////////////////////////////////
        //render table
        //////////////////////////////////
        lingliao_apply.funcs.renderTable()

    }
    , funcs: {
        renderTable: function () {
            //post here to getAll     $todo


            //////////////////////////////////
            //after renderHandler
            //////////////////////////////////

            //bind selectAll
            var checkedBoxLen = $('.lingliao_apply_checkbox:checked').length
            home.funcs.bindSelectAll($("#lingliao_apply_checkAll"), $('.lingliao_apply_checkbox'), checkedBoxLen, $("#lingliao_apply_table"))
            var checkedBoxLen = $('.addModal_checkbox:checked').length
            home.funcs.bindSelectAll($("#addModal_checkALl"), $('.addModal_checkbox'), checkedBoxLen, $("#addModal_table"))

            //////////////////////////////////
            //bind detailModal
            //////////////////////////////////
            lingliao_apply.funcs.bindDetailEventListener($('.detailLingdaoApply'))
            //////////////////////////////////
            //bind editModal
            //////////////////////////////////
            lingliao_apply.funcs.bindEditEventListener($('.editLingdaoApply'))

            //////////////////////////////////
            //bind editModal's addBtn click
            //////////////////////////////////
            lingliao_apply.funcs.bindAddClick($("#edit_addBtn"))

            //////////////////////////////////
            //bind detailBtn clicks in addModal
            //////////////////////////////////
            lingliao_apply.funcs.bindDetailClickInAddModal($(".addModal_detail"))


        }
        ,bindDetailClickInAddModal : function(detailBtns) {
            detailBtns.off('click').on('click', function() {
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
        , bindAddClick: function (addBtn) {
            addBtn.off('click').on('click', function() {
                layer.open({
                    type: 1,
                    title: '新增',
                    content: $("#addModal"),
                    area: ['800px', '400px'],
                    btn: ['返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#addModal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        , bindDetailEventListener: function (detailBtns) {
            //点击的时候需要弹出一个模态框
            // 而且要填充模态框里面的内容 todo
            detailBtns.off('click').on('click', function () {
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
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '编辑',
                    content: $("#edit_modal"),
                    area: ['800px', '400px'],
                    btn: ['保存', '提交', '返回'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#edit_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#edit_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn3: function (index) {
                        $("#edit_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
    }
}