/**
 * Created by cnaisin06 on 2017/7/28.
 */

$(function () {

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    }
    var userId=GetQueryString("userId");


        //clone;
        $(".add").click(function(){
            $(".clone").first().clone(true).css({"display":"block"}).appendTo($("#editable"))
        })
        //上传图片
        $("li").on("click", function () {
            var index = $(this).index();
            //console.log(index);
            $(".file").eq(index).on("change", function () {
                // 获取第一个文件信息
                $(this).siblings(".img").css({"zIndex":"7"});

                var fileData = this.files[0];
                //console.log(fileData);

                //读取图片数据 base64

                var reader = new FileReader();
                reader.readAsDataURL(fileData);
                reader.onload = function (e) {
                    var data = e.target.result;
                    //加载图片获取图片真实宽度和高度
                    var image = new Image();
                    image.onload=function(){
                        var width = image.width;
                        var height = image.height;
                        //console.log(width);
                        //console.log(height);
                    };
                    image.src= data;
                    $("#editable li:eq("+(index)+")").find(".img").attr("src",this.result);
                    //base64去掉前缀
                    //var datas = data.substring(data.indexOf(",") + 1)
                    //base64转二进制blob
                    //function dataURItoBlob(dataURI) {
                    //    var byteString = atob(dataURI.split(',')[1]);
                    //    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                    //    var ab = new ArrayBuffer(byteString.length);
                    //    var ia = new Uint8Array(ab);
                    //    for (var i = 0; i < byteString.length; i++) {
                    //        ia[i] = byteString.charCodeAt(i);
                    //    }
                    //    return new Blob([ab], {type: mimeString});
                    //}
                    //var fd = new FormData();
                    ////console.log(fd);
                    //var blobs = dataURItoBlob(data);
                    ////console.log(blobs);
                    //fd.append("imagesFile", blobs);
                    //append方法添加的进去的 要用特殊的get方式才能读取到
                    //console.log(fd.get("imagesFile"));
                    var formdata = new FormData();
                    formdata.append("file", fileData)
                    //console.log(formdata.get("file"));
                    $.ajax({
                        url:urls.commonUpload,
                        data:formdata,
                        type:"post",
                        processData: false, // 不会将 data 参数序列化字符串 必不可少
                        contentType: false, // 必不可少
                        success: function (data) {
                            //console.log(data);
                            $("#editable li:eq("+(index)+")").find(".img").attr("src",data.data[0]);
                        }
                    })
                };
            })
        })
        //编辑文本
        $("li textarea").on("click", function () {
            var index = $(this).parent().index();
            var value = $(this).text()
            //console.log(index);
            layer.prompt({
                formType: 2,
                value: value,
                maxlength: 2000,
                title: '请输入文本',
            }, function(value,elem){
                    parent.$("#editable li:eq("+(index)+")").find("textarea").text(value)
                    layer.closeAll();
            });
        })
        // 拖动排序 设置拖动区域
        var editableList = Sortable.create(editable, {
            sort:"true",
            animation: 150,
            handle: '.my-handle',
            filter: '.js-remove',
            onFilter: function (evt) {
                var el = editableList.closest(evt.item); // get dragged item
                //console.log(typeof el);
                //console.log(evt.item);
                //console.log(evt.item.children);
                //console.log(evt.item.children[1]);
                //console.log(evt.item.children[1].currentSrc);
                //console.log(evt.item.children[5].innerHTML);
                if(evt.item.children[1].currentSrc != "" || evt.item.children[5].innerHTML != ""){
                    layer.open({
                        skin:"demo-class",
                        content: '确认删除？',
                        btn: ['确认', '取消'],
                        shadeClose: false,
                        yes: function(){
                            layer.open({content: '确认', time: 1});
                            el && el.parentNode.removeChild(el);
                        }, no: function(){
                            layer.open({content: '您选择了取消', time: 1});
                        }
                    })
                }
                else{
                    el && el.parentNode.removeChild(el);
                }
            },
        });

        //点击标签切换颜色背景
        $("label").on("click","input", function () {
            $(this).parent("label").toggleClass("red")
        })

        //上传封面图
        $(".upbtn").on("click", function () {
            layer.open({
                type: 2,
                title: '上传活动提议封面图',
                shadeClose: true,
                shade: false,
                maxmin: false, //开启最大化最小化按钮
                area: ['100%', '100%'],
                content: './ima_up/index.html',
            });
        })
        //提交数据
        var str3
        var str0;
        $("#sbm").on("click", function () {
            //获取图文混排的内容
            var html = $("#editable").html()
            //console.log(html);
            $(".hidden_data").html(html);
            str3 = toJsonlist();
            str0 = toJSONString();
            //标题不能为空
            if($(".title_top").val() == ""){
                layer.open({
                    skin:"demo-class",
                    title:"提示",
                    content:"提议名称不能为空"
                })
                return
            }
            //banner图不能为空
            else if ($(".src").val() == ""){
                layer.open({
                    skin:"demo-class",
                    title:"提示",
                    content:"请设置活动封面图"
                })
                return
            }
            //标签不能为空
            else if($('input[name="mark"]').is(':checked') == false){
                layer.open({
                    skin:"demo-class",
                    title:"提示",
                    content:"请选择活动标签"
                })
                return
            }
            else{
                layer.open({
                    skin:"demo-class",
                    content: '您确认提交？',
                    btn: ['确认', '取消'],
                    shadeClose: false,
                    yes: function(){
                        layer.open({content: '确认', time: 1});
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
                                "userId":userId,
                                "name":$(".title_top").val(),
                                "coverPhoto":$(".src").val(),
                                "tabs":str0,
                                "content":str3
                            }
                        }
                        //console.log(datas);
                        $.ajax({
                            url: urls.create,
                            type:"post",
                            "contentType":"application/json; charset=utf-8",
                            data:JSON.stringify(datas),
                            success: function (data) {
                                //console.log(data);
                                layer.open({
                                    skin:"demo-class",
                                    title:"提示",
                                    content:"提交成功",
                                    end: function () {
                                        window.location.href="./proposal_list.html?"+"userId="+userId
                                    }
                                })
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) {
                                layer.open({
                                    skin:"demo-class",
                                    title:"提示",
                                    content:"提交失败"
                                })
                            },
                        })

                    }, no: function(){
                        layer.open({content: '您选择了取消', time: 1});
                    }
                });
            }
        })
});

    //删除数组指定的内容的项
    Array.prototype.indexOf = function (val) {
        for(var i = 0; i < this.length; i++){
            if(this[i] == val){return i;}
        }
        return -1;
    }
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if(index > -1){this.splice(index,1);}
    }
    //数据转换
    function toJsonlist(){
        var obj={};
        var arr=[];
        for(var i =0 ;i< $("li").length;i++){
            var v = $(".hidden_data li").children().not("i").not(".file").not("a").not(".my-handle");
            $.each(v, function (i,v) {
                if( hasPrototype(v,"src")){
                    obj.imageUrl= $(this).attr("src");
                    obj.width= String(v.width);
                    obj.height=String(v.height);
                }
                else{
                    obj.content = $(this).html();
                    var obj1 =JSON.stringify(obj);
                    arr[i]=obj1
                }
            })
        }
        //去除undefined
        var a = arr;
        var b = [];
        for(var i=0;i<a.length;i++){
            if(typeof(a[i])!='undefined'){
                b.push(a[i]);
            }
        }
        //去重
        var s = [];
        for(var i = 0;i<b.length;i++){
            if(s.indexOf(b[i]) == -1){
                s.push(b[i]);
            }
        }
        //删除默认的第一项
        s.remove('{"imageUrl":"","width":"0","height":"0","content":""}');
        var str0 = s.toString()
        var str1 ="[";
        var str2 ="]";
        var str3 = str1.concat(str0,str2);
        return str3
    }
    //判断对象是否含有某个属性
    function hasPrototype(object,name){
        return !object.hasOwnProperty(name)&&(name in object);
    }
    //获取多选框选中的值转换为list
    function toJSONString(){
        var  check_val = {};
        var  arr= [];
        $('input[name="mark"]:checked').each(function (i,v) {
            var id = v.getAttribute("data-id")
            var value = v.getAttribute("data-value")
            check_val.id = id;
            check_val.name =value;
            var  check_valstr = JSON.stringify(check_val);
            arr[i]=check_valstr;
        })
        var str3 = arr.toString()
        var str1 ="[";
        var str2 ="]";
        var str0 = str1.concat(str3,str2);
        return str0
    }

