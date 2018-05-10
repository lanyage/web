var product_out = {
    init: function () {

        //////////////////////////////////
        //bind SelectAll for editModal checkBoxes
        //////////////////////////////////
        //////////////////////////////////
        //render table
        //////////////////////////////////
        product_out.funcs.renderTable()

    }
    , funcs: {
        renderTable: function () {
            //post here to getAll     $todo


            //////////////////////////////////
            //after renderHandler
            //////////////////////////////////

            //bind selectAll
            //////////////////////////////////
            //bind detailModal
            //////////////////////////////////
            product_out.funcs.bindDetailEventListener($('.detailBtn'))
            //////////////////////////////////
            //bind editModal
            //////////////////////////////////
            product_out.funcs.bindEditEventListener($('.editBtn'))

            //////////////////////////////////
            //bind editModal's addBtn click
            //////////////////////////////////
            product_out.funcs.bindAddClick($("#addBtn"))

            //////////////////////////////////
            //bind auditModal click
            /////////////////////////////////
            product_out.funcs.bindAuditEventListener($(".auditBtn"))

            /////////////////////////////////
            //bin deletebtn click
            ////////////////////////////////
            product_out.funcs.bindDeleteEventListener($(".deleteBtn"))
        }
        , bindAddClick: function (addBtn) {
            addBtn.off('click').on('click', function() {
                layer.open({
                    type: 1,
                    title: '出库单申请',
                    content: $("#add_Modal"),
                    area: ['800px', '400px'],
                    btn: ['保存','提交','取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#add_Modal").css('display', 'none')
                        layer.close(index)
                    },
                    btn1: function (index) {
                        $("#add_Modal").css('display', 'none')
                        layer.close(index)
                    },
                    btn2: function (index) {
                        $("#add_Modal").css('display', 'none')
                        layer.close(index)
                    }
                    ,btn3: function (index) {
                        $("#add_Modal").css('display', 'none')
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
                    title: '出库单申请审批',
                    content: $("#detail_Modal"),
                    area: ['800px', '400px'],
                    offset: "auto",
                    yes: function (index) {
                        $("#detail_Modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }, bindDeleteEventListener: function (deleteBtns) {
            //点击的时候需要弹出一个模态框
            // 而且要填充模态框里面的内容 todo
            deleteBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    content:['确认要删除该条数据吗？'],
                    area: ['800px', '400px'],
                    offset: "auto",
                    btn:['确定','取消']
                });
            })
        },bindAuditEventListener:function (auditBtns) {
            auditBtns.off('click').on('click',function(){
                layer.open({
                    type:1,
                    title:'出库单申请审批',
                    content:$('#audit_Modal'),
                    area:['800px','400px'],
                    btn:['不通过','通过'],
                    offset:'auto',
                    closeBtn:0
                    , btn1: function (index) {
                        $("#audit_Modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#audit_Modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '出库单申请',
                    content: $("#edit_Modal"),
                    area: ['800px', '400px'],
                    btn: ['保存', '提交', '取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#edit_Modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#edit_Modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn3: function (index) {
                        $("#edit_Modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
    }
}