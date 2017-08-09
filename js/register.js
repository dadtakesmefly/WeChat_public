/**
 * Created by cnaisin06 on 2017/8/4.
 */


//验证手机号
var usertel=document.getElementById("usertel");
var regPhone=/^0?(13|14|15|18)[0-9]{9}$/;
check(usertel,regPhone);
function check(inp, reg) {
    inp.onblur = function () {
        if (reg.test(this.value)) {
            return;
        } else {
            btn.value = "获取验证码";
            layer.open({
                skin:"demo-class",
                title:"提示",
                content:"手机号错误",
            })
        }
    };
}
var btn = document.getElementById("btn");
var timer = null;
var img =document.querySelector("img");
var password = document.getElementById("password");
var sbm =   document.querySelector("#sbm");
var nickname = document.getElementById("nickname");
nickname.onblur= function () {
    var val =this.value;
    var regnickname=/^(?=.*?[\u4E00-\u9FA5\-a-zA-Z\d])[\d\u4E00-\u9FA5\-a-zA-Z\d]+/;
    //console.log(regnickname.test(val));
    if(regnickname.test(val)){
        sbm.disabled = false;
    }
    else{
        sbm.disabled = "disabled"
    }
}
var isopen=true;
img.onclick= function () {
    if(isopen){
        this.src="images/eyesopen.png";
        password.setAttribute("type","text")
    }
    else{
        this.src="images/eyesclose.png";
        password.setAttribute("type","password")
    }
    isopen=!isopen;
}
password.onblur= function () {
    var val =this.value;
    //console.log(val);
    var regchildname=/[\u4e00-\u9fa5]{1,}$/;
    //console.log(regchildname.test(val));
    if(regchildname.test(val)){
        layer.open({
            skin:"demo-class",
            title:"提示",
            content:"请不要输入中文",
        })
        sbm.disabled = "disabled"
    }
    else{
        sbm.disabled = false;
    }
}

$("#usertel").die().live("change", function () {
    var val = this.value;
    //console.log(val);
    $("#btn").removeAttr("disabled");
    //获取验证码
    $("#btn").die().live("click", function () {
        this.disabled = true;
        $.ajax({
            url:urls.sendCodesMsgUrl,
            async: false,
            type:"post",
            data:{phone:val},
            success: function (data) {
                //console.log(data);
                if(data.ok == true){
                    btn.disabled = true;
                    var nun = 60;
                    timer = setInterval(function () {
                        nun--;
                        btn.disabled = true;
                        btn.value = nun + "秒";
                        if (nun === 0) {
                            clearInterval(timer);
                            btn.value = "获取验证码";
                            btn.disabled = false;
                            nun = 60;
                        }
                    }, 1000);
                }
                else if(data.exCode === "TimesExceeded"){
                    layer.open({
                        skin:"demo-class",
                        title:"提示",
                        content:"一个手机号一天只能获取3次验证码,请明天再试!"
                    })
                    btn.disabled = false;
                    return false
                }
                else{
                    layer.open({
                        skin:"demo-class",
                        title:"提示",
                        content:"手机号错误，请重新输入"
                    })
                    btn.disabled = false;
                    btn.value = "获取验证码";
                    return false
                }
            }
        })
    })

    var num;
    $("#test").die().live("change", function () {
        num = this.value;
        //console.log(num);
        //提交表单信息
        $("#sbm").die().live("click", function () {
            //先检查验证码
            $.ajax({
                url:urls.checkCodesUrl,
                type:"post",
                data:{phone:val,codes:num},
                success: function (data) {
                    //console.log(data);
                    if(data.ok == true){
                        //验证码正确后再把信息手机号、加密后的密码、昵称发送给后台
                        // 使用jsencrypt类库加密js方法，
                        function encryptRequest(reqUrl, data, publicKey) {
                            var encrypt = new JSEncrypt();
                            encrypt.setPublicKey(publicKey);
                            // ajax请求发送的数据对象
                            var sendData = new Object();
                            // 将data数组赋给ajax对象
                            for (var key in data) {
                                sendData[key] = encrypt.encrypt(data[key]);
                            }
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
                                    "password":sendData.password,
                                    "phone":$("#usertel").val(),
                                    "nickname":$('#nickname').val()}
                            }
                            $.ajax({
                                url: reqUrl,
                                type: 'post',
                                data: JSON.stringify(datas),
                                contentType: 'application/json; charset=utf-8',
                                success: function (data) {
                                    //console.log(data);
                                    if(data.ok == true){
                                        layer.open({
                                            skin:"demo-class",
                                            title:"提示",
                                            content:"注册成功",
                                            end: function () {
                                                window.location.href="./create.html"
                                            }
                                        })
                                    }
                                    else{
                                        layer.open({
                                            skin:"demo-class",
                                            title:"提示",
                                            content:data.msg,
                                            end: function () {

                                            }
                                        })
                                    }
                                },
                                error: function (data) {
                                    //console.log(data)
                                }
                            });
                        }
                        var data = [];
                        //data['phone'] = $("#usertel").val(); //手机号和昵称不用加密
                         data['password'] = $('#password').val();
                         var pkey = $('#pubkey').val();
                         encryptRequest(urls.registerUrl, data, pkey);
                    }
                    else{
                        layer.open({
                            skin:"demo-class",
                            title:"提示",
                            content:"短信验证码错误"
                        })
                        btn.disabled = false;
                        return false
                    }
                }
            })
        })
    })
})

