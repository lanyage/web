var plate_manage={
    init: function () {

        //////////////////////////////////
        //bind SelectAll for editModal checkBoxes
        //////////////////////////////////
        //////////////////////////////////
        //render table
        //////////////////////////////////
        plate_manage.funcs.renderTable()

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

            //////////////////////////////////
            //bind editModal
            //////////////////////////////////
            plate_manage.funcs.bindEditEventListener($('.detail'))

            //////////////////////////////////
            //bind editModal's addBtn click
            //////////////////////////////////

        }
        , bindEditEventListener: function (editBtns) {
            editBtns.off('click').on('click', function () {
                layer.open({
                    type: 1,
                    title: '报损单申请',
                    content: $("#detail_modal"),
                    area: ['800px', '500px'],
                    btn: ['提交', '取消'],
                    offset: "auto",
                    closeBtn: 0,
                    yes: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn1: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                    , btn2: function (index) {
                        $("#detail_modal").css('display', 'none')
                        layer.close(index)
                    }
                });
            })
        }
    }
}
