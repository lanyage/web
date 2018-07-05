var iron_remove = {
    init: function () {
        iron_remove.funcs.renderTable()
    },
     funcs: {
        renderTable: function () {
            $.post(home.urls.byproductCount.getByByproductCodeByPage(), {
                byproductCode:3
            }, function (res) {
                var $tbody = $("#iron_remove_table").children('tbody')
                var items = res.data.content
               iron_remove.funcs.renderHandler($tbody, items)
            })
            iron_remove.funcs.bindAddEvent($('#model_li_hide_add_38'))

            var refreshBtn = $('#model_li_hide_refresh_38');
            iron_remove.funcs.bindRefreshEventListener(refreshBtn);

            //追加搜索事件
            var searchBtn = $('#model_li_hide_search_38')
            iron_remove.funcs.bindSearchEventListener(searchBtn)

        }
    , renderHandler: function ($tbody, items) {
        //$tbody.empty() //清空表格
        for(var i=1; i <=16; i++){
            $("#row1").find('td').eq(i).text('')  
            $("#row2").find('td').eq(i).text('')  
            $("#row3").find('td').eq(i).text('') 
            $("#row4").find('td').eq(i).text('')   
            $("#row5").find('td').eq(i).text('')

            $("#row11").find('td').eq(i).text('')  
            $("#row12").find('td').eq(i).text('')  
            $("#row13").find('td').eq(i).text('') 
            $("#row14").find('td').eq(i).text('')   
            $("#row15").find('td').eq(i).text('')
        }

        items.forEach(function (e) {
            var code = e.code
            var date = e.date.split('-')
            if(date[2]<17){
                $("#row1").find('td').eq(date[2]).text(e.batchNumber)  
                $("#row2").find('td').eq(date[2]).text(e.dutyCode?e.dutyCode.name:' ')  
                $("#row3").find('td').eq(date[2]).text(e.weight) 
                $("#row4").find('td').eq(date[2]).text(e.proportion)   
                $("#row5").find('td').eq(date[2]).text(e.recorderCode?e.recorderCode.name:'')   
            }else{
                $("#row11").find('td').eq(date[2]+1).text(e.batchNumber)  
                $("#row12").find('td').eq(date[2]+1).text(e.dutyCode?e.dutyCode.name:' ')  
                $("#row13").find('td').eq(date[2]+1).text(e.weight) 
                $("#row14").find('td').eq(date[2]+1).text(e.proportion)   
                $("#row15").find('td').eq(date[2]+1).text(e.recorderCode?e.recorderCode.name:'')   
            }
  
        })
    }
         ,bindAddEvent:function(addBtn){
             addBtn.off('click').on('click',function(){
                $("#batchNumber").val('')
                $("#date").val('')
                $("#dutyCode").empty()
                $("#weight").val('')
                $("#proportion").val('')
                $("#rescorderCode").empty()
                $.get(servers.backup()+'duty/getAll',{},function(result){
                    var duty = result.data
                    duty.forEach(function(e){
                        $("#dutyCode").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                })
                $.get(servers.backup()+'user/getAll',{},function(result){
                    var user = result.data
                    user.forEach(function(e){
                        $("#rescorderCode").append("<option value="+e.code+">"+e.name+"</option>")
                    })
                })
                 layer.open({
                     type:1,
                     title:"新增车间除铁记录",
                     content:$("#add_modal"),
                     area: ['370px', '370px'],
                     btn:['提交','取消'],
                     offset:'auto',
                     closeBtn:0,
                     yes:function(index) {
                         $("#add_modal").css('display','none')
                         var dutyCode = $('#dutyCode').val()
                         var batchNumber = $('#batchNumber').val()
                         var date = $('#date').val()
                         var weight = $('#weight').val()
                         var proportion = $('#proportion').val()
                         var recorderCode = $('#rescorderCode').val()
                         $.post(home.urls.byproductCount.add(),{
                            'byproductCode.code':1,
                            'dutyCode.code': dutyCode,
                            'recorderCode.code': recorderCode,
                            batchNumber: batchNumber,
                            date: date,
                            weight: weight,
                            proportion: proportion,
                         },function(result){
                             layer.msg(result.message,{
                                 offset:['40%','55%'],
                                 time:700
                             })
                            if(result.code === 0) {
                                var time = setTimeout(function(){
                                    iron_remove.init()
                                    clearTimeout(time)
                                },500)
                            }
                            layer.close(index)
                         })    
                     }
                     ,btn2:function(index){
                         $("#add_modal").css('display','none')
                         layer.close(index)
                     }
                 })
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
                     iron_remove.init()
                     $('#input_batch_num').val('')
                     layer.close(index)
                     clearTimeout(time)
                 }, 200)

             })
         },
         bindSearchEventListener: function (searchBtn) {
             searchBtn.off('click')
             searchBtn.on('click', function () {
                 var batchNumber = $('#input_batch_num').val();
                 $.post(home.urls.byproductCount.getByBatchNumberLikeByPage(), {
                    batchNumber: batchNumber
                 }, function (result) {
                     var items = result.data.content //获取数据
                     page = result.data
                     const $tbody = $("#iron_remove_table").children('tbody')
                     iron_remove.funcs.renderHandler($tbody, items)
                
                 })
             })
         }

    }
}