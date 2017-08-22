/**
 * Created by cnaisin06 on 2017/8/11.
 */

//渲染
$(function(){
    function getData(config, offset,size){
        config.isAjax = true;

        var datas = {
            "common": {//公共参数
                "v": "1.0",
                "sign": "",
                "appversion": "1.0",
                "timestamp": "1425185923140",
                "deviceType": "3",
                "deviceVersion": "6.1",
                "deviceNo": ""
            },
            "params":{
                "userId":"Localhost_TAU60y8k5uWl",
                "city":"",
                "type":"join",
                "province":"",
                "timestamp":"",
                "requestType":"",
                "pagesize":"10000",
                "filter":""
            }
        }
        $.ajax({
            type: 'post',
            //url: './querylist.json',
            url:urls.actLsit,
            data:JSON.stringify(datas),
            success: function(reponse){
                console.log(reponse);
                config.isAjax = false;
                var data = reponse.data;
                var sum = data.length;
                //console.log(data);
                if( sum > 0){
                    //document.title = teamName+"团队的活动经历"
                    var result = '';
                    $("h3").show(0)
                    //时长
                    //$("h3 span").html(reponse.totaltime);
                    //活动状态
                    $.each(data, function (k,v) {
                        if(v.actState == "Preparation"){
                            v.actState = "报名中";
                        }
                        if(v.actState == "Finish"){
                            v.actState = "已结束";
                        }
                        if(v.actState == "Archived"){
                            v.actState = "已结束";
                        }
                        if(v.actState == "Processing"){
                            v.actState = "进行中";
                        }
                    })
                    /************业务逻辑块：实现拼接html内容并append到页面*****************/
                    //console.log(offset , size, sum);
                    /*如果剩下的记录数不够分页，就让分页数取剩下的记录数
                     * 例如分页数是5，只剩2条，则只取2条
                     */
                    if(sum - offset < size ){
                        size = sum - offset;
                    }
                    /*使用for循环模拟SQL里的limit(offset,size)*/
                    for(var i=offset; i< (offset+size); i++){
                        result +=  ' <li>'  +
                            '<img class="banner" src=" '+data[i].actLogo+ '"  alt=/>'+
                            '<p class="status">'+data[i].actState+'</p>'+
                            ' <div>'+
                            ' <h4>'+data[i].actName+'</h4>'+
                            ' <img class="adresspic" src="images/本地活动地址.png" alt=/><span class="team_adress">'+data[i].location+'</span>'+
                            ' <img src="images/本地活动时间.png" /><span class="time">'+dateConverts(data[i].startTime)+'</span>'+
                            ' <img class="teampic" src=" '+ data[i].teamLogo +' " alt=/>' +
                            '</div>'+
                            ' </li>';

                    }
                    $('ul').append(result);
                    //背景
                    $.each($(".status"), function (i,v) {
                        if($(this).html() == "已结束"){
                            $(this).css({"background-color":"#f5f5f5","color":"#666"})
                        }

                    })
                    /*******************************************/
                    /*隐藏more*/
                    if ( (offset + size) >= sum){
                        $(".js-load-more").hide();
                        //$(".js-load-more").html("到底啦")
                        config.isEnd = true; /*停止滚动加载请求*/
                        //提示没有了

                    }else{
                        $(".js-load-more").show();
                    }
                }
                else{
                    $('section').html("您还没有参与过活动</br> 您可以在爱信公益app中寻找活动报名加入").css({
                        "position": "absolute",
                        "top":"50%",
                        "left":"50%",
                        "transform":"translate(-50%,-50%)",
                        "font-Size":"0.30rem",
                        "text-Align":"center",
                        "width":"90%"
                    })
                }
            },
            error: function(xhr, type){
                alert('Ajax error!');
            }
        });
    }
    $.loadmore.get(getData, {scroll: true, size:5});
    //时间转换 年/月/日
    function dateConvert(dateStr){
        var da = Number(dateStr);
        da = new Date(da);
        var year = da.getFullYear();
        var month = da.getMonth()+1;
        var date = da.getDate();
        var hour = da.getHours();
        var minute = da.getMinutes() < 10 ? "0" + da.getMinutes() : da.getMinutes() ;
        month = month < 10 ? "0" +month : month ;
        date = date < 10 ? "0" + date : date ;
        return [year,month,date].join('-');
    }
//时间转换 月/日 时/分
    function dateConverts(dateStr){
        var da = Number(dateStr);
        da = new Date(da);
        var year = da.getFullYear();
        var month = da.getMonth()+1;
        var date = da.getDate();
        var hour = da.getHours();
        var minute = da.getMinutes() < 10 ? "0" + da.getMinutes() : da.getMinutes() ;
        var second =da.getSeconds() <10 ?"0"+ da.getSeconds() : da.getSeconds();
        month = month < 10 ? "0" +month : month ;
        date = date < 10 ? "0" + date : date ;
        return [month,date].join('/')+" "+hour+":"+minute;
    }
});

