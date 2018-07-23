var check_report = {
    pagesize:0,
    init:function(){
        
        $("#button").off('click').on('click',function(){
            var batchNumber = $("#input_batchNumber").val()
            $.post(home.urls.productPublish.getByLikeBatchNumberByPage(), {
                batchNumber: batchNumber,
                statusCode: 3
            }, function (result) {
                var product = result.data.content //获取数据
                if(product === null){
                    layer.open({
                        type: 1,
                        content: '未查到该产品批号',
                        area: ['100px', '50px'],
                        btn: ['关闭'],
                        offset: 'auto',   // ['10%', '40%'],
                        yes: function (index) {
                            layer.close(index);
                        }
                    })
                }else{
                    product.forEach(function(e){
                        if(e.status.code === 2){
                            $("#product").hide()
                            layer.open({
                                type: 1,
                                content: '暂未发布',
                                area: ['100px', '50px'],
                                btn: ['关闭'],
                                offset: 'auto',   // ['10%', '40%'],
                                btnAlign: 'c',
                                yes: function (index) {
                                    layer.close(index);
                                }
                            })
                        }else{
                            console.log(3)
                            $("#product").show()
                            $("#batchNumber").text(e.batchNumber)
                            $("#testDate").text(e.testDate?new Date(e.testDate).Format('yyyy-MM-dd'):'')
                            $("#number").text(e.number?e.number:'')
                            $("#judge").text(e.judge?e.judge.name:'')
                            $("#status").text(e.status?e.status.name:'')
                            $("#publisher").text(e.publisher?e.publisher.name:'')
    
                            $("#p1").text(e.p1?e.p1:'0')
                            $("#p2").text(e.p2?e.p2:'0')
                            $("#p3").text(e.p3?e.p3:'0')
                            $("#p4").text(e.p4?e.p4:'0')
                            $("#p5").text(e.p5?e.p5:'0')
                            $("#p6").text(e.p6?e.p6:'0')
                            // $("#p7").text(e.p7)
                            $("#p8").text(e.p8?e.p8:'0')
                            $("#p9").text(e.p9?e.p9:'0')
                            $("#p10").text(e.p10?e.p10:'0')
    
                            $("#p11").text(e.p11?e.p11:'0')
                            $("#p12").text(e.p12?e.p12:'0')
                            $("#p13").text(e.p13?e.p13:'0')
                            $("#p14").text(e.p14?e.p14:'0')
                            $("#p15").text(e.p15?e.p15:'0')
                            $("#p16").text(e.p16?e.p16:'0')
                            $("#p17").text(e.p17?e.p17:'0')
                            $("#p18").text(e.p18?e.p18:'0')
                            $("#p19").text(e.p19?e.p19:'0')
                            $("#p20").text(e.p20?e.p20:'0')
        
                            $("#p21").text(e.p21?e.p21:'0')
                            $("#p22").text(e.p22?e.p22:'0')
                            $("#p23").text(e.p23?e.p23:'0')
                            $("#p24").text(e.p24?e.p24:'0')
                            $("#p25").text(e.p25?e.p25:'0')
                            $("#p26").text(e.p26?e.p26:'0')
                            $("#p27").text(e.p27?e.p27:'0')
                            $("#p28").text(e.p28?e.p28:'0')
                            $("#p29").text(e.p29?e.p29:'0')
                            $("#p30").text(e.p30?e.p30:'0')
        
                            $("#p31").text(e.p31?e.p31:'0')
                            $("#p32").text(e.p32?e.p32:'0')
                            $("#p33").text(e.p33?e.p33:'0')
                            $("#p34").text(e.p34?e.p34:'0')
                            $("#p35").text(e.p35?e.p35:'0')
                            $("#p36").text(e.p36?e.p36:'0')
                            $("#p37").text(e.p37?e.p37:'0')
                            $("#p38").text(e.p38?e.p38:'0')
                            $("#p39").text(e.p39?e.p39:'0')
                        }
                        
                    })
                }  
           })
    })
    }
}