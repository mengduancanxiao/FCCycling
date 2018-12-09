$(function () {
    //字体更改选择
    $("#font-family").change(function () {
        var input = $("#addBox1").text("");
        var logovalue = $("#logovalue").val();
        var font_family = $(this).find("option:selected").text();
        var font_size = $("#font-size option:selected").text();

        var lable = '<label style="font-family: ' + font_family + ';font-size:' + font_size + 'px;">' + logovalue + '</label>';
        // alert(font_family + " " + lable);
        $("#addBox1").append(lable);
    });

    //字体大小更改选择
    $("#font-size").change(function () {
        var input = $("#addBox1").text("");
        var logovalue = $("#logovalue").val();
        var font_family = $("#font-family option:selected").text();
        var font_size = $(this).find("option:selected").text();

        var lable = '<label style="font-family: ' + font_family + ';font-size:' + font_size + 'px;">' + logovalue + '</label>';
        // alert(font_family + " " + lable);
        $("#addBox1").append(lable);
    });
    addBoxSize = getAddBoxSize(); //logo填充div数量
});

//显示与下载png
//输入文字logo，更改logo区域
function OnInput(event) {
    var logovalue = event.target.value;
    var font_family = $("#font-family option:selected").text();
    var font_size = $("#font-size").find("option:selected").text();

    var id = $("#addBox1").find("div").attr("id");
    if (typeof id != "undefined" && id != null && id != "") {
        var file_id = id.slice(4);
        var file = uploader.getFile(file_id);
        // console.log("===================file_id = " + file_id + " " + file.id + " size = " + file.size);
        uploader.onFileDequeued(file);
    }

    var lable = '<label style="font-family: ' + font_family + ';font-size:' + font_size + 'px;">' + logovalue + '</label>';
    var input = $("#addBox1").text("");
    input.append(lable);
}

function Show4() {
    $("#watch").html("");
    var svgXml = $('#addBoxes').html();

    var data = "data:image/svg+xml," +
        "<svg xmlns='http://www.w3.org/2000/svg' width='500' height='429'>" +
        "<foreignObject width='100%' height='100%'>" +
        "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:16px;font-family:Helvetica'>" +
        svgXml +
        "</div>" +
        "</foreignObject>" +
        "</svg>";
    var img = new Image();
    img.src = data;
    $("#watch").append('<img id="iimg" src="' + img.src + '" style="max-width:500px;max-heigth:429px;" />');
    // $("#watch").append(data);
    // document.getElementsByTagName('body')[0].appendChild(img);
    // console.log("data = " + window.btoa(unescape(encodeURIComponent(svgXml))));
}

function Show3() {
    $("#watch").html("");
    var svgXml = $('#addBoxes').html();
    var data = "data:image/svg+xml," +
        "<svg xmlns='http://www.w3.org/2000/svg' width='500' height='429'>" +
        "<foreignObject width='100%' height='100%'>" +
        "<div xmlns='http://www.w3.org/1999/xhtml' style='font-size:16px;font-family:Helvetica'>" +
        // "<div id='addBoxes' style='float:left; width: 40%;height: 533px; border:thin solid black; text-align:center;'>" +
        svgXml +
        // "</div>" +
        "</div>" +
        "</foreignObject>" +
        "</svg>";

    // console.log("data = " + data);

    // //旧版图片预览
    // var svgXml2 = $('.svggroup').html();
    // var image = new Image();
    // image.width = "500px";
    // image.height = "428px";
    // image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml2))); //给图片对象写入base64编码的svg流
    // $("#watch").append('<img id="iimg" src="' + image.src + '" style="max-width:500px;max-heigth:428px;" />');

    //新版图片预览
    $("#watch").append('<img id="iimg" src="' + data + '" />');
    // $("#watch").append(data);

    // var image = new Image();
    // image.src = data;
    // $("#watch").append(image);
}

function Down() {
    var sampleImage = $("#iimg");
    if (sampleImage == null) {
        layer.msg("请先预览效果图（点击ShowImg） ");
        return false;
    }
    var canvas = convertImageToCanvas(sampleImage);

    url = canvas.toDataURL("image/png");//PNG格式
    //以下代码为下载此图片功能
    var triggerDownload = $("#tttt").attr("href", url).attr("download", "设计图" + new Date().getMilliseconds() + ".png");
    triggerDownload[0].click();
    //triggerDownload.remove();
}

function convertImageToCanvas(image) {
    console.log(image.html());
    var canvas = document.createElement("canvas");
    canvas.width = image.width * 1.5;
    canvas.height = image.height * 1.5;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
}