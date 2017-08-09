$(document).ready(function(){
        $("#up-img-touch").click(function(){
        		  $("#up-modal-frame").modal({});
        });
});
$(function() {
    'use strict';
    // 初始化
    var $image = $('#up-img-show');
    $image.cropper({
        //aspectRatio: 3 / 1,//裁剪框比例 1：1
        preview: '.up-pre-after',
        //responsive:true,
        aspectRatio:2/1,//宽高比
        //preview: '.prev',  //预览窗口
        guides: false,  //裁剪框的虚线
        autoCropArea: 0.8,  //0-1之间的数值，定义自动剪裁区域的大小，默认0.8
        dragCrop: true,  //是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
        movable: true,  //是否允许移动剪裁框
        resizable: true,  //是否允许改变裁剪框的大小
        zoomable: true,  //是否允许缩放图片大小
        mouseWheelZoom: true,  //是否允许通过鼠标滚轮来缩放图片
        touchDragZoom: true,  //是否允许通过触摸移动来缩放图片
        rotatable: true,  //是否允许旋转图片
        minContainerWidth: 200,  //容器的最小宽度
        minContainerHeight: 100,  //容器的最小高度
        minCanvasWidth: 0,  //canvas 的最小宽度（image wrapper）
        minCanvasHeight: 0,  //canvas 的最小高度（image wrapper）
    });

    // 上传图片
    var $inputImage = $('.up-modal-frame .up-img-file');
    var URL = window.URL || window.webkitURL;
    var blobURL;

    if (URL) {
        $inputImage.change(function () {
        	
            var files = this.files;
            var file;

            if (files && files.length) {
               file = files[0];

               if (/^image\/\w+$/.test(file.type)) {
                    blobURL = URL.createObjectURL(file);
                    $image.one('built.cropper', function () {
                        // Revoke when load complete
                       URL.revokeObjectURL(blobURL);
                    }).cropper('reset').cropper('replace', blobURL);
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }
    
    //绑定上传事件
    $('.up-modal-frame .up-btn-ok').on('click',function(){
    	var $modal_loading = $('#up-modal-loading');
    	var $modal_alert = $('#up-modal-alert');
    	var img_src=$image.attr("src");
    	if(img_src==""){
    		set_alert_info("没有选择上传的图片");
    		$modal_alert.modal();
    		return false;
    	}
    	
    	$modal_loading.modal();
    	
        var url=$(this).attr("url");
        //console.log(url);
        //parameter
    	var parameter=$(this).attr("parameter");
    	//console.log(parameter);
    	var parame_json = eval('(' + parameter + ')');
    	var width=parame_json.width;
    	var height=parame_json.height;
    	//console.log(parame_json.width);
    	//console.log(parame_json.height);

    	//控制裁剪图片的大小
    	var canvas=$image.cropper('getCroppedCanvas',{width: "750",height: "375"});
    	var data=canvas.toDataURL(); //转成base64
        //console.log(data);
        //console.log(data.substring(data.indexOf(",") + 1));
        var data = data.substring(data.indexOf(",") + 1)
        console.log(url);
        $.ajax( {  
                url:url,
                type: "POST",
                contentType:"application/x-www-form-urlencoded",
                data: {"image":data,fileName:""},
                success: function(data, textStatus){
                    console.log(data);
                    console.log(data.ok);
                    console.log(data.data.url);
                    window.parent.$(".src").attr("value",data.data.url)
                    $modal_loading.modal('close');
                	set_alert_info(data.result);
                	$modal_alert.modal();
                    $("#up-modal-frame").modal('close');
                	if(data.ok==="true"){
                        $("#up-img-touch img").attr("src",data.file);
                		var img_name=data.file.split('/')[2];
                		//console.log(img_name);
                		$(".up-img-txt a").text(img_name);
                		$("#up-modal-frame").modal('close');

                	}
                },
                error: function(){
                	$modal_loading.modal('close');
                	set_alert_info("上传文件失败了！");
                	$modal_alert.modal();
                	//console.log('Upload error');  
                }  
         });  
    	
    });
    
    $('#up-btn-left').on('click',function(){
    	$("#up-img-show").cropper('rotate', 90);
    });
    $('#up-btn-right').on('click',function(){
    	$("#up-img-show").cropper('rotate', -90);
    });
});


function set_alert_info(content){
	$("#alert_content").html(content);
}


 
