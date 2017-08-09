/**
 * Created by cnaisin06 on 2017/7/19.
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
$("#usertel").die().live("change", function () {
    var val = this.value;
    //console.log(val);
    $("#btn").removeAttr("disabled");
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
        $("#sbm").die().live("click", function () {
            $.ajax({
                url:urls.checkCodesUrl,
                type:"post",
                data:{phone:val,codes:num},
                success: function (data) {
                    //console.log(data);
                    if(data.ok == true){
                        layer.open({
                            skin:"demo-class",
                            title:"提示",
                            content:"绑定成功",
                            end: function () {
                                //$(".tel").val("");
                                //$(".code").val("");
                                btn.value = "获取验证码";
                                $.ajax({
                                    url:urls.checkExists,
                                    type:"post",
                                    data:{phone:val},
                                    success: function (data) {
                                        if(data.ok == true){
                                            window.location.href="./create.html"
                                            //layer.open({
                                            //    skin:"demo-class",
                                            //    title:"提示",
                                            //    content:"您已是爱信用户，点击确定前往活动提议",
                                            //    end: function () {
                                            //        window.location.href="./create.html"
                                            //    }
                                            //})
                                        }
                                        else{
                                            window.location.href="./binding_app.html"+"?phone="+val
                                        }
                                    }
                                })
                            }
                        })
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

