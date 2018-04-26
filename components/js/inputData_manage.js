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
               var a 
               var code = $("#selectoption option:selected").attr('id')
               code = parseInt(code)
               console.log(code)
              
                console.log(returndata)
                var length = returndata.data['length']
                console.log(length)
                var tbody_page = 'tbody_page'+code
                console.log(tbody_page)
                var bb = $('#tbody_page'+code)
                console.log(bb)
                switch(code){
                    case 1: a = 'p';
                    break;
                    case 2: inputData_manage.funcs.bindJinchi622(returndata,bb) ;
                    break;
                    case 3: inputData_manage.funcs.bindTianQi(returndata,bb);
                    break;
                    case 4: a = 'pc';
                    break;
                    case 5: a = 'pc';
                    break;
                    case 6: a = 'pc';
                    break;
                    case 7: a = 'pc';
                    break;
                    default:
                    console.log('没有和以上的匹配上！！！')
                }
            },
            error:function(returndata,Ccode){
                console.log(returndata)
            }
        });

    })
         },

        /** 天齐碳酸锂添加Tbody */
        bindTianQi:function(result,Tcode){
            var length = result.data['length']
            console.log(length)
            for(var i=0;i<length;i++){
                var operation = result.data[i]['operation']
                var publisher = result.data[i]['publisher']
                var auditDate = result.data[i]['auditDate']
                var batchNumber = result.data[i]['batchNumber']
                var productDate = result.data[i]['productDate'] 
                var judge = result.data[i]['judge']?result.data[i]['judge']['name']:'null'
                var number = result.data[i]['number'] 
                var c1 = result.data[i]['c1']//水分
                var c2 = result.data[i]['c2']//D1
                var c3 = result.data[i]['c3']//D10
                var c4 = result.data[i]['c4']//D50
                var c5 = result.data[i]['c5']//D90
                var c6 = result.data[i]['c6']//D99
                var c7 = result.data[i]['c7']//筛上物
                var c8 = result.data[i]['c8']//Fe
                var c9 = result.data[i]['c9']//Ni
                var c10 = result.data[i]['c10']//Cr
                var c11 = result.data[i]['c11']//Zn
                var c12 = result.data[i]['c12']//总量
                var c13 = result.data[i]['c13']//LiCo3
                var c14 = result.data[i]['c14']//Na
                var c15 = result.data[i]['c15']//Mg
                var c16 = result.data[i]['c16']//Ca
                var c17 = result.data[i]['c17']//Fe

                Tcode.append("<tr>"+
                    "<td>"+ operation +"</td>"+
                    "<td>"+ publisher +"</td>"+
                    "<td>"+ auditDate +"</td>"+
                    "<td>"+ batchNumber +"</td>"+
                    "<td>"+ productDate +"</td>"+
                    "<td>"+ judge +"</td>"+
                    "<td>"+ number +"</td>"+
                    "<td>"+ c1 +"</td>"+
                    "<td>"+ c2 +"</td>"+
                    "<td>"+ c3 +"</td>"+
                    "<td>"+ c4 +"</td>"+
                    "<td>"+ c5 +"</td>"+
                    "<td>"+ c6 +"</td>"+
                    "<td>"+ c7 +"</td>"+
                    "<td>"+ c8 +"</td>"+
                    "<td>"+ c9 +"</td>"+
                    "<td>"+ c10 +"</td>"+
                    "<td>"+ c11 +"</td>"+
                    "<td>"+ c12 +"</td>"+
                    "<td>"+ c13 +"</td>"+
                    "<td>"+ c14 +"</td>"+
                    "<td>"+ c15 +"</td>"+
                    "<td>"+ c16 +"</td>"+
                    "<td>"+ c17 +"</td>"+
                    "</tr>"
                )
            }
        },


        /** 金弛622添加Tbody */
        bindJinchi622:function(result,Tcode){
            var length = result.data['length']
            console.log(length)
            for(var i=0;i<length;i++){
                var operation = result.data[i]['operation']
                var publisher = result.data[i]['publisher']
                var auditDate = result.data[i]['auditDate']
                var batchNumber = result.data[i]['batchNumber']
                var insideCode = result.data[i]['insideCode']
                var productDate = result.data[i]['productDate']   
                var number = result.data[i]['number']  
                var judge = result.data[i]['judge']?result.data[i]['judge']['name']:'null'     
                var c1 = result.data[i]['c1']//振实密度
                var c2 = result.data[i]['c2']//水分
                var c3 = result.data[i]['c3']//SSA
                var c4 = result.data[i]['c4']//ph
                //var c5 = result.data[i]['c5']//D1
                //var c6 = result.data[i]['c6']//D10
                var c7 = result.data[i]['c7']//D50
                //var c8 = result.data[i]['c8']//D90
                //var c9 = result.data[i]['c9']//D99
                var c10 = result.data[i]['c10']//筛上物
                var c16 = result.data[i]['c16']//Ni+Mn+Co
                var c17 = result.data[i]['c17']//Co
                var c18 = result.data[i]['c18']//Mn
                var c19 = result.data[i]['c19']//Ni
                var c20 = result.data[i]['c20']//Na
                var c21 = result.data[i]['c21']//Mg
                var c22 = result.data[i]['c22']//Ca
                var c23 = result.data[i]['c23']//Fe
                var c24 = result.data[i]['c24']//Cu
                //var c11 = result.data[i]['c11']//Fe
                //var c12 = result.data[i]['c12']//Ni
               // var c13 = result.data[i]['c13']//Cr
                //var c14 = result.data[i]['c14']//Zn
                //var c15 = result.data[i]['c15']//总量
                
                Tcode.append("<tr>"+
                    "<td>"+ operation +"</td>"+
                    "<td>"+ publisher +"</td>"+
                    "<td>"+ auditDate +"</td>"+
                    "<td>"+ batchNumber +"</td>"+
                    "<td>"+ insideCode +"</td>"+
                    "<td>"+ productDate +"</td>"+
                    "<td>"+ number +"</td>"+
                    "<td>"+ judge +"</td>"+
                    "<td>"+ c1 +"</td>"+
                    "<td>"+ c2 +"</td>"+
                    "<td>"+ c3 +"</td>"+
                    "<td>"+ c4 +"</td>"+
                    "<td>"+ c7 +"</td>"+
                    "<td>"+ c10 +"</td>"+
                    "<td>"+ c16 +"</td>"+
                    "<td>"+ c17 +"</td>"+
                    "<td>"+ c18 +"</td>"+
                    "<td>"+ c19 +"</td>"+
                    "<td>"+ c20 +"</td>"+
                    "<td>"+ c21 +"</td>"+
                    "<td>"+ c22 +"</td>"+
                    "<td>"+ c23 +"</td>"+
                    "<td>"+ c24 +"</td>"+
                    "</tr>"
                )
                      

            }
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