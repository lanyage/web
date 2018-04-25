var inputData_manage = {
    init: function () {


        inputData_manage.funcs.bindCreatoption()
        // display
        inputData_manage.funcs.renderTable()
        var out = $('#tbody_page').width()
        var time = setTimeout(function () {
            var inside = $('.layui-laypage').width()
            $('#tbody_page').css('padding-left', 100 * ((out - inside) / 2 / out) > 33 ? 100 * ((out - inside) / 2 / out) + '%' : '35.5%')
            clearTimeout(time)
        }, 50)
    }
     /** 当前总记录数,用户控制全选逻辑 */
     , pageSize: 0
     /** 逻辑方法 */
     ,funcs : {
         //渲染页面
         renderTable:function () {
             

             /** 追加上传选项事件 */
             var fileUploadBtn = $('#fileUpload')
             inputData_manage.funcs.bindOpendialog(fileUploadBtn)
 
             
             /** 追加添加事件 */
             var openBtn = $('#openBtn')
             inputData_manage.funcs.bindOpendialog(openBtn)

        
             /** 获取提交选项 */
             var submitBtn = $('#submitBtn')
             inputData_manage.funcs.bindSubmitData(submitBtn)

             /** 选择不同的typeCode显示相应的表头 */
             var tabTop = $('#openBtn')
             inputData_manage.funcs.bindShowtabTitle(tabTop)
         },


          
        /** 选择不同的typeCode显示相应的表头 */
         bindShowtabTitle:function(tabTop){
             console.log(tabTop)
             console.log('aaaa')
             var ID = 'table'+$("#selectoption option:selected").attr('id')
            $('#model-li-hide-19 table').addClass('hide')

            $(ID).removeClass('hide')
         },

         /** 点击选择Excle文件按钮 弹出文件框，让选择文件 */
        bindOpendialog : function(fileUploadBtn){
             fileUploadBtn.off('click')
             fileUploadBtn.on('click',function(){
            //    var file = $('#file-input-name').val()
            var formData = new FormData($('#uploadForm')[0]);
        var typeCode = $("#selectoption option:selected").val();
        formData.append('typeCode',typeCode)
        $.ajax({
            url:home.urls.fileUpload.open(),
            type:'POST',
            data:formData,
            async:false,
            cache:false,
            contentType:false,
            processData:false,
            success:function(returndata){
               // console.log('aaaaaaaaaaaaaaa')
                console.log(returndata)
                var length = returndata.data['length']
                console.log(length)
                var bb = $('#tbody_page')
                for(var i=0;i<length;i++){
                var c1 = returndata.data[i]['c1']
                var c2 = returndata.data[i]['c2']
                var c3 = returndata.data[i]['c3']
                var c4 = returndata.data[i]['c4']
                var c5 = returndata.data[i]['c5']
                var c6 = returndata.data[i]['c6']
                var c7 = returndata.data[i]['c7']
                var c8 = returndata.data[i]['c8']
                var c9 = returndata.data[i]['c9']
                var c10 = returndata.data[i]['c10']
                var c11= returndata.data[i]['c11']
                var c12 = returndata.data[i]['c12']
                var c13 = returndata.data[i]['c13']
                var c14= returndata.data[i]['c14']
                var c15 = returndata.data[i]['c15']
                var c16 = returndata.data[i]['c16']
                var c17 = returndata.data[i]['c17']
                var c18 = returndata.data[i]['c18']
                var c19 = returndata.data[i]['c19']
                var c20 = returndata.data[i]['c20']
                var c21 = returndata.data[i]['c21']
                var c22 = returndata.data[i]['c22']
                var c23 = returndata.data[i]['c23']
                var c24= returndata.data[i]['c24']
                var c25= returndata.data[i]['c25']
                var c26= returndata.data[i]['c26']
                var c27= returndata.data[i]['c27']
                var c28= returndata.data[i]['c28']
                var c29= returndata.data[i]['c29']
                var c30= returndata.data[i]['c30']
                var c31= returndata.data[i]['c31']
                var c32= returndata.data[i]['c32']
                var c33= returndata.data[i]['c33']
                var c34= returndata.data[i]['c34']
                var c35= returndata.data[i]['c35']
                var c36= returndata.data[i]['c36']
                var c37= returndata.data[i]['c37']
                var c38= returndata.data[i]['c38']
                var c39= returndata.data[i]['c39']
                var c40= returndata.data[i]['c40']
                var testDate = returndata.data[i]['testDate']
                var batchNumber = returndata.data[i]['batchNumber']
                var judge_name = returndata.data[i]['judge']?returndata.data[i]['judge']['name']:'null'
                var number = returndata.data[i]['number']
                //console.log(judge_name)

               
                bb.append(" <tr>"+
                " <td>"+(new Date(testDate).Format('yyyy/MM/dd')) +"</td>"+
                " <td>"+ batchNumber +"</td>"+
                " <td>"+ judge_name +"</td>"+
                " <td>"+ number +"</td>"+
                " <td style='width:90px;'>"+ c1 +"</td>"+
                " <td>"+ c2 +"</td>"+
                " <td>"+ c3 +"</td>"+
                " <td>"+ c4 +"</td>"+
                
               
                " <td></td>"+
                " <td></td>"+
                " <td></td>"+
                " <td>"+ c5 +"</td>"+
                " <td>"+ c6 +"</td>"+
                " <td>"+ c7 +"</td>"+
                " <td>"+ c8 +"</td>"+
                " <td>"+ c9 +"</td>"+
                " <td></td>"+
                " <td>"+ c11 +"</td>"+
                " <td>"+ c12 +"</td>"+
                " <td>"+ c13 +"</td>"+
                " <td>"+ c14 +"</td>"+
                " <td>"+ c15 +"</td>"+
                " <td></td>"+
                " <td></td>"+
                " <td></td>"+
                " <td></td>"+
                " <td>"+ c17 +"</td>"+
                " <td>"+ c18 +"</td>"+
                " <td>"+ c19 +"</td>"+
    
                " <td>"+ c20 +"</td>"+
                " <td>"+ c21 +"</td>"+
                " <td>"+ c22 +"</td>"+
                " <td>"+ c23 +"</td>"+
                " <td>"+ c24 +"</td>"+
                " <td>"+ c26 +"</td>"+
                " <td></td>"+
                " <td></td>"+
                " <td></td>"+
                " <td></td>"+
                " <td></td>"+
                " <td></td>"+
               
               "</tr> ")


                }

                //console.log(c23)
               
                //console.log(testDate)
            },
            error:function(returndata){
                console.log(returndata)
            }
        });

    })
         },

         /** 监听下拉菜单的option */
         bindCreatoption:function(){
            $.get(home.urls.fileUpload.getAllFileType(),{},function(result){
                var value = result.data
                console.log(value)
                //var length = value.length
                for(var i=1;i<9;i++){
                    console.log(value[i])
                    var text = value[i]
                $("#selectoption").append("<option id='"+ i +"' value='"+i+"'>"+text+"</option>");
               }
            })
         },

         /** 监听提交按钮 */
         bindSubmitData:function(submitBtn){
            submitBtn.off('click')
            submitBtn.on('click',function(){
                var typeCode = $("#selectoption option:selected").val();
                $.post(home.urls.fileUpload.submit(),{typeCode:typeCode},function(result){
                    console.log(result)
                    
                        layer.msg('添加成功', {
                            offset: ['40%', '55%'],
                            time: 700
                        })
                    // layer.open({
                    //     type: 1,
                    //     title: '添加成功',
                    //     content: "<h5 style='text-align: center;padding-top: 8px'>添加成功！！！</h5>",
                    //     area: ['190px', '130px'],
                    //     offset: ['40%', '55%'],
                    //     time: 700
                    // });
                })
            })
         }
     }
}