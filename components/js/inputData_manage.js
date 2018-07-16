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

              /** 获取取消选项 */
              var cancleBtn = $('#cancleBtn')
              inputData_manage.funcs.bindCancleData(cancleBtn)

             /** 选择不同的typeCode显示相应的表头 */
             var tabTop = $('#openBtn')
             inputData_manage.funcs.bindShowtabTitle(tabTop)
         },


          
        /** 选择不同的typeCode显示相应的表头 */
         bindShowtabTitle:function(tabTop){
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
               var a 
               var code = $("#selectoption option:selected").attr('id')
               code = parseInt(code)
               var length = returndata.data['length']
               var tbody_page = 'tbody_page'+code
               var bb = $('#tbody_page'+code)
               switch(code){
                   case 1: inputData_manage.funcs.bindProduct(returndata,bb);
                   break;
                   case 2: inputData_manage.funcs.bindJinchi622(returndata,bb) ;
                   break;
                   case 3: inputData_manage.funcs.bindTianQi(returndata,bb);
                   break;
                   case 4: a = 'pc';
                   break;
                   case 5: a = 'pc';
                   break;
                   case 6: inputData_manage.funcs.bindZhiChengLidu(returndata,bb);
                   break;
                   case 7: inputData_manage.funcs.bindZhiChengZongli(returndata,bb);
                   break;
                   case 8: inputData_manage.funcs.bindZhiChengKoudian(returndata,bb);
                   break;
                   default:
                   console.log('没有和以上的匹配上！！！')
                }
            },
            error:function(returndata,Ccode){
                //console.log(returndata)
                for(var i=0;i<length;i++){

                }
            }
        });

    })
         },

         /** 制程扣电添加Tbody */
         bindZhiChengKoudian:function(result,Tcode){
            $("#dataInOut").show()
            var length = result.data['length']
            //console.log(length)
            for(var i=0;i<length;i++){
                var operation = result.data[i]['operation']
                var publisher = result.data[i]['publisher']
                var auditDate = result.data[i]['auditDate']
                var batchNumber = result.data[i]['batchNumber']
                var furnaceNum = result.data[i]['furnaceNum']
                var pc1 = result.data[i]['pc1']//SSA
                var pc2 = result.data[i]['pc2']//扣电
                var pc3 = result.data[i]['pc3']//XRD

                Tcode.append("<tr>"+
                    "<td>"+ (operation?operation:'无') +"</td>"+
                    "<td>"+ (publisher?publisher.name:'无') +"</td>"+
                    "<td>"+ (auditDate?new Date(auditDate).Format('yyyy-MM-dd'):'无') +"</td>"+
                    "<td>"+ batchNumber +"</td>"+
                    "<td>"+ furnaceNum +"</td>"+
                    "<td>"+ pc1 +"</td>"+
                    "<td>"+ pc2 +"</td>"+
                    "<td>"+ pc3 +"</td>"+
                    "</tr>"
                )
            }
         },

         /** 产品添加Tbody */
         bindProduct:function(result,Tcode){
            $("#dataInOut").show()
            var length = result.data['length']
            console.log(length)
            for(var i=0;i<length;i++){
                var auditDate = result.data[i]['auditDate']
                var batchNumber = result.data[i]['batchNumber']
                var judge = result.data[i]['judge']?result.data[i]['judge']['name']:'null'
                var number = result.data[i]['number'] 
                var p1 = result.data[i]['p1']//振实密度
                var p2 = result.data[i]['p2']//水分
                var p3 = result.data[i]['p3']//SSA
                var p4 = result.data[i]['p4']//ph
                var p5 = result.data[i]['p5']//Lico3
                var p6 = result.data[i]['p6']//LiOH
                var p7 = result.data[i]['p7']//总LI含量
                var p8 = result.data[i]['p8']//D1
                var p9 = result.data[i]['p9']//D10
                var p10 = result.data[i]['p10']//D50
                var p11 = result.data[i]['p11']//D90
                var p12 = result.data[i]['p12']//D99
                var p13 = result.data[i]['p13']//颗粒度系数
                var p14 = result.data[i]['p14']//Fe
                var p15 = result.data[i]['p15']//Ni
                var p16 = result.data[i]['p16']//Cr
                var p17 = result.data[i]['p17']//Zn
                var p18 = result.data[i]['p18']//总量
                var p19 = result.data[i]['p19']//Co
                var p20 = result.data[i]['p20']//Mn
                var p21 = result.data[i]['p21']//Ni
                var p22 = result.data[i]['p22']//Li
                var p23 = result.data[i]['p23']//Co
                var p24 = result.data[i]['p24']//Mn
                var p25 = result.data[i]['p25']//Ni
                var p26 = result.data[i]['p26']//Na
                var p27 = result.data[i]['p27']//Mg
                var p28 = result.data[i]['p28']//Ca
                var p29 = result.data[i]['p29']//Fe
                var p30 = result.data[i]['p30']//Cu
                var p31 = result.data[i]['p31']//Zn
                var p32 = result.data[i]['p32']//S
                var p33 = result.data[i]['p33']//Al
                var p34 = result.data[i]['p34']//0.1C首次放电容量
                var p35 = result.data[i]['p35']//0.1C首次效率
                var p36 = result.data[i]['p36']//1C首次放电容量

                Tcode.append("<tr>"+
                    "<td>"+ (auditDate?new Date(auditDate).Format('yyyy-MM-dd'):'无') +"</td>"+
                    "<td>"+ batchNumber +"</td>"+
                    "<td>"+ judge +"</td>"+
                    "<td>"+ number +"</td>"+
                    "<td>"+ p1 +"</td>"+
                    "<td>"+ p2 +"</td>"+
                    "<td>"+ p3 +"</td>"+
                    "<td>"+ p4 +"</td>"+
                    "<td>"+ p5 +"</td>"+
                    "<td>"+ p6 +"</td>"+
                    "<td>"+ p7 +"</td>"+
                    "<td>"+ p8 +"</td>"+
                    "<td>"+ p9 +"</td>"+
                    "<td>"+ p10 +"</td>"+
                    "<td>"+ p11 +"</td>"+
                    "<td>"+ p12 +"</td>"+
                    "<td>"+ p13 +"</td>"+
                    "<td>"+ p14 +"</td>"+
                    "<td>"+ p15 +"</td>"+
                    "<td>"+ p16 +"</td>"+
                    "<td>"+ p17 +"</td>"+
                    "<td>"+ p18 +"</td>"+
                    "<td>"+ p19 +"</td>"+
                    "<td>"+ p20 +"</td>"+
                    "<td>"+ p21 +"</td>"+
                    "<td>"+ p22 +"</td>"+
                    "<td>"+ p23 +"</td>"+
                    "<td>"+ p24 +"</td>"+
                    "<td>"+ p25 +"</td>"+
                    "<td>"+ p26 +"</td>"+
                    "<td>"+ p27 +"</td>"+
                    "<td>"+ p28 +"</td>"+
                    "<td>"+ p29 +"</td>"+
                    "<td>"+ p30 +"</td>"+
                    "<td>"+ p31 +"</td>"+
                    "<td>"+ p32 +"</td>"+
                    "<td>"+ p33 +"</td>"+
                    "<td>"+ p34 +"</td>"+
                    "<td>"+ p35 +"</td>"+
                    "<td>"+ p36 +"</td>"+
                    "</tr>"
                )
            }
         },

           /** 金弛622添加Tbody */
        bindJinchi622:function(result,Tcode){
            $("#dataInOut").show()
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
                    "<td>"+ (operation?operation:'无') +"</td>"+
                    "<td>"+ (publisher?publisher.name:'无') +"</td>"+
                    "<td>"+ (auditDate?new Date(auditDate).Format('yyyy-MM-dd'):'无') +"</td>"+
                    "<td>"+ batchNumber +"</td>"+
                    "<td>"+ insideCode +"</td>"+
                    "<td>"+ (productDate?new Date(productDate).Format('yyyy-MM-dd'):'') +"</td>"+
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

         /** 制程总锂添加Tbody */
         bindZhiChengZongli:function(result,Tcode){
            $("#dataInOut").show()
            var length = result.data['length']
            console.log(length)
            for(var i=0;i<length;i++){
                var operation = result.data[i]['operation']
                var publisher = result.data[i]['publisher']
                var auditDate = result.data[i]['auditDate']
                var batchNumber = result.data[i]['batchNumber']
                var furnaceNum = result.data[i]['furnaceNum']//炉号
                var pc1 = result.data[i]['pc1']//Lico3
                var pc2 = result.data[i]['pc2']//LiOH
                var pc3 = result.data[i]['pc3']//总LI含量

                Tcode.append("<tr>"+
                    "<td>"+ (operation?operation:'无') +"</td>"+
                    "<td>"+ (publisher?publisher.name:'无') +"</td>"+
                    "<td>"+ (auditDate?new Date(auditDate).Format('yyyy-MM-dd'):'无') +"</td>" +"</td>"+
                    "<td>"+ batchNumber +"</td>"+
                    "<td>"+furnaceNum+"</td>"+
                    "<td>"+ pc1 +"</td>"+
                    "<td>"+ pc2 +"</td>"+
                    "<td>"+ pc3 +"</td>"+
                    "</tr>"
                )

            }
         },

         /** 制程粒度添加Tbody */
         bindZhiChengLidu:function(result,Tcode){
            $("#dataInOut").show()
            var length = result.data['length']
            console.log(length)
            for(var i=0;i<length;i++){
                var operation = result.data[i]['operation']
                var publisher = result.data[i]['publisher']
                var auditDate = result.data[i]['auditDate']
                var batchNumber = result.data[i]['batchNumber']
                var furnaceNum = result.data[i]['furnaceNum']
                var pc1 = result.data[i]['pc1']//D0
                var pc2 = result.data[i]['pc2']//D1
                var pc3 = result.data[i]['pc3']//D5
                var pc4 = result.data[i]['pc4']//D10
                var pc5 = result.data[i]['pc5']//D50
                var pc6 = result.data[i]['pc6']//D90
                var pc7 = result.data[i]['pc7']//D95
                var pc8 = result.data[i]['pc8']//D99
                var pc9 = result.data[i]['pc9']//D99.99
                var pc10 = result.data[i]['pc10']//宽度系数
                var pc10 = result.data[i]['pc10']//宽度系数

                Tcode.append("<tr>"+
                    "<td>"+ (operation?operation:'无') +"</td>"+
                    "<td>"+ (publisher?publisher.name:'无') +"</td>"+
                    "<td>"+ (auditDate?new Date(auditDate).Format('yyyy-MM-dd'):'无') +"</td>"+
                    "<td>"+ batchNumber +"</td>"+
                    "<td>"+ furnaceNum +"</td>"+
                    "<td>"+ pc1 +"</td>"+
                    "<td>"+ pc2 +"</td>"+
                    "<td>"+ pc3 +"</td>"+
                    "<td>"+ pc4 +"</td>"+
                    "<td>"+ pc5 +"</td>"+
                    "<td>"+ pc6 +"</td>"+
                    "<td>"+ pc7 +"</td>"+
                    "<td>"+ pc8 +"</td>"+
                    "<td>"+ pc9 +"</td>"+
                    "<td>"+ pc10 +"</td>"+
                    "<td>"+ pc10 +"</td>"+
                    "</td>"
                )

            }
         },

        /** 天齐碳酸锂添加Tbody */
        bindTianQi:function(result,Tcode){
            $("#dataInOut").show()
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
                    "<td>"+ (operation?operation:'无') +"</td>"+
                    "<td>"+ (publisher?publisher.name:'无') +"</td>"+
                    "<td>"+ (auditDate?new Date(auditDate).Format('yyyy-MM-dd'):'无') +"</td>"+
                    "<td>"+ batchNumber +"</td>"+
                    "<td>"+ (productDate?new Date(productDate).Format('yyyy-MM-dd'):'无') +"</td>"+
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

         /** 监听下拉菜单的option */
         bindCreatoption:function(){
            $.get(home.urls.fileUpload.getAllFileType(),{},function(result){
                var value = result.data
                //var length = value.length
                for(var i=1;i<9;i++){
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
        ,bindCancleData:function(cancleBtn){
            cancleBtn.off('click').on('click',function(){
                var ID = 'table'+$("#selectoption option:selected").attr('id')
                $('#model-li-hide-19 table').addClass('hide')
                $(ID).removeClass('show')
                $("#dataInOut").hide()
            })
        }
     }
}