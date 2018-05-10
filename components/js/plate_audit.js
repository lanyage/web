var plate_audit = {
    init: function () {

        //////////////////////////////////
        //render table
        //////////////////////////////////
        plate_audit.funcs.renderTable()

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
            plate_audit.funcs.bindDetailEventListener($('.plate_detail'))
            //////////////////////////////////
            //bind editModal
            //////////////////////////////////
            //////////////////////////////////
            //bind editModal's addBtn click
            //////////////////////////////////


        }
        , bindDetailEventListener: function (detailBtns) {
            //点击的时候需要弹出一个模态框
            // 而且要填充模态框里面的内容 todo
            detailBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    content: $("#detail_modal"),
                    area: ['800px', '400px'],
                    btn: ['提交', '取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }

    }
}