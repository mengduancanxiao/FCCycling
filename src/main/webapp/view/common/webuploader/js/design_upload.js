// WebUploader实例
var uploader;
var fileNum = 1;
var uptype = 1;
var fileAllSize = 200 * 1024 * 1024; //200M
var fileSingleSize = 100 * 1024 * 1024    // 100 M
var fileCount = 0; // 添加的文件数量
var fileSize = 0; // 添加的文件总大小
var picList = new Array(); //初始绑定的图片列表
var picList_source = new Array(); //初始绑定的图片原名
var addBoxSize = 0;

function getAddBoxSize() {
    var addBoxSize = 0;
    var divArr = $('#addBoxes').children('div');
    $.each(divArr, function (i, n) {
        addBoxSize = i;
    });
    return addBoxSize;
}

function webuploadInit(t) {
    if (t != null) {
        uptype = t;
    }
    var $ = jQuery,    // just in case. Make sure it's not an other libaray.
        $wrap = $('#uploader'),
        // 图片容器
        $queue = $('<ul class="filelist"></ul>').appendTo($wrap.find('.queueList')),
        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar'),
        // 文件总体选择信息。
        $info = $statusBar.find('.info'),
        // 上传按钮
        $upload = $wrap.find('.uploadBtn'),
        // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),
        // 总体进度条
        $progress = $statusBar.find('.progress').hide(),
        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,
        // 缩略图大小
        thumbnailWidth = 110 * ratio,
        thumbnailHeight = 110 * ratio,
        // 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',
        // 所有文件的进度信息，key为file id
        percentages = {},
        supportTransition = (function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })();

    if (!WebUploader.Uploader.support()) {
        alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error('WebUploader does not support the browser you are using.');
    }
    GUID = WebUploader.Base.guid(); //当前页面是生成的GUID作为标示
    // 实例化
    var ext;
    var mimetyep;
    switch (uptype) {
        case 1:
            ext = 'gif,jpg,jpeg,bmp,png';
            mimetyep = 'image/jps,image/jpeg,/image/png';
            break;
        case 2:
            ext = 'mp4,avi';
            mimetyep = 'video/mp4,video/avi';
            break;
        case 3:
            ext = 'apk';
            mimetyep = 'application/vnd.android.package-archive';
            break;
        default:
            break;
    }
    uploader = WebUploader.create({
        formData: {guid: GUID},
        threads: 1, //上传并发数
        pick: {
            id: '#filePicker',
            label: (uptype == '1' ? 'click to select a picture' : 'click to select a picture')
        },
        dnd: '#uploader .queueList',
        paste: document.body,

        accept: {
            title: 'Images',
            extensions: ext,
            mimeTypes: mimetyep
        },

        // swf文件路径
        swf: 'Uploader.swf',

        disableGlobalDnd: true,

        chunked: true,
        chunkSize: 2 * 1024 * 1024,
        // server: 'http://webuploader.duapp.com/server/fileupload.php',
        server: '/API/Plug/UpLoad.ashx?action=UpLoadFile&uptype=' + uptype,
        fileNumLimit: fileNum,
        fileSizeLimit: fileAllSize,    // 200 M
        fileSingleSizeLimit: fileSingleSize   // 100 M
    });

    // 添加"添加文件"的按钮，
    uploader.addButton({
        id: '#filePicker2',
        label: '继续添加'
    });


    // 当有文件添加进来时执行，负责view的创建
    function addFile(file) {
        // console.log("fileCount = " + fileCount + " addBoxSize = " + addBoxSize);
        var $li = $('<li id="' + file.id + '">' +
            '<p class="title">' + file.name + '</p>' +
            '<p class="imgWrap"></p>' +
            '<p class="progress"><span></span></p>' +
            '</li>'),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span>' +
                '<span class="down" onclick="downFile(\'' + file.name + '\')">下载</span>' +
                '</div>').appendTo($li),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>'),

            showError = function (code) {
                switch (code) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text(text).appendTo($li);
            };

        if (file.getStatus() === 'invalid') {
            showError(file.statusText);
        } else {
            // @todo lazyload
            $wrap.text('预览中');
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $wrap.text('不能预览');
                    return;
                }
                var count = $(".filelist").find("li").length;
                console.log("filelist size = " + count + " file_id = " + file.id);

                var img = $(' <img id="111" + src="' + src + '" /> ');
                //var img = $('<div id="box1" class="box"> <img src="' + src + '" /> <div id="scale1" class="scale"></div> </div>');
                $wrap.empty().append(img);

                var html = '<div id="Box_' + file.id + '" class="box">  <img src="' + src + '" />  <div id="Scale_' + file.id + '" class="scale"></div> </div>';
                var addBox;
                if($("#addBox1").children("div").length == 0){
                    addBox = "addBox1"
                } else if($("#addBox2").children("div").length == 0){
                    addBox = "addBox2";
                } else{

                }
                $("#" + addBox).append(html);

                // console.log("file length = " + uploader.getFile("WU_FILE_0").size);

                var box = document.getElementById("Box_" + file.id);
                var fa = document.getElementById(addBox);
                var scale = document.getElementById("Scale_" + file.id);
                // 图片移动效果
                box.onmousedown = function (ev) {
                    var oEvent = ev;
                    // 浏览器有一些图片的默认事件,这里要阻止
                    oEvent.preventDefault();
                    // console.log("", "left:" + box.offsetLeft + " top:" + box.offsetTop);
                    var disX = oEvent.clientX - box.offsetLeft;
                    var disY = oEvent.clientY - box.offsetTop;
                    fa.onmousemove = function (ev) {
                        oEvent = ev;
                        oEvent.preventDefault();
                        var x = oEvent.clientX - disX;
                        var y = oEvent.clientY - disY;

                        // 图形移动的边界判断
                        x = x <= 0 ? 0 : x;
                        x = x >= fa.offsetWidth - box.offsetWidth ? fa.offsetWidth - box.offsetWidth : x;
                        y = y <= 0 ? 0 : y;
                        y = y >= fa.offsetHeight - box.offsetHeight ? fa.offsetHeight - box.offsetHeight : y;
                        box.style.left = x + 'px';
                        box.style.top = y + 'px';
                    }
                    // 图形移出父盒子取消移动事件,防止移动过快触发鼠标移出事件,导致鼠标弹起事件失效
                    fa.onmouseleave = function () {
                        fa.onmousemove = null;
                        fa.onmouseup = null;
                    }
                    // 鼠标弹起后停止移动
                    fa.onmouseup = function () {
                        fa.onmousemove = null;
                        fa.onmouseup = null;
                    }
                }
                // 图片缩放效果
                scale.onmousedown = function (e) {
                    // 阻止冒泡,避免缩放时触发移动事件
                    e.stopPropagation();
                    e.preventDefault();
                    var pos = {
                        'w': box.offsetWidth,
                        'h': box.offsetHeight,
                        'x': e.clientX,
                        'y': e.clientY
                    };
                    fa.onmousemove = function (ev) {
                        ev.preventDefault();
                        // 设置图片的最小缩放为30*30
                        var w = Math.max(30, ev.clientX - pos.x + pos.w)
                        var h = Math.max(30, ev.clientY - pos.y + pos.h)
                        // console.log(w,h)

                        // 设置图片的最大宽高
                        w = w >= fa.offsetWidth - box.offsetLeft ? fa.offsetWidth - box.offsetLeft : w
                        h = h >= fa.offsetHeight - box.offsetTop ? fa.offsetHeight - box.offsetTop : h
                        box.style.width = w + 'px';
                        box.style.height = h + 'px';
                        // console.log(box.offsetWidth,box.offsetHeight)
                    }
                    fa.onmouseleave = function () {
                        fa.onmousemove = null;
                        fa.onmouseup = null;
                    }
                    fa.onmouseup = function () {
                        fa.onmousemove = null;
                        fa.onmouseup = null;
                    }
                }
            }, thumbnailWidth, thumbnailHeight);

            percentages[file.id] = [file.size, 0];
            file.rotation = 0;
        }

        file.on('statuschange', function (cur, prev) {
            if (prev === 'progress') {
                $prgress.hide().width(0);
            } else if (prev === 'queued') {
                //$li.off( 'mouseenter mouseleave' );
                //$btns.remove();
            }

            // 成功
            if (cur === 'error' || cur === 'invalid') {
                showError(file.statusText);
                percentages[file.id][1] = 1;
            } else if (cur === 'interrupt') {
                showError('interrupt');
            } else if (cur === 'queued') {
                percentages[file.id][1] = 0;
            } else if (cur === 'progress') {
                $info.remove();
                $prgress.css('display', 'block');
            } else if (cur === 'complete') {
                $li.append('<span class="success"></span>');
                percentages[file.id][1] = 1;
            }

            $li.removeClass('state-' + prev).addClass('state-' + cur);
        });

        $li.on('mouseenter', function () {
            $btns.stop().animate({height: 30});
        });

        $li.on('mouseleave', function () {
            $btns.stop().animate({height: 0});
        });

        $btns.on('click', 'span', function () {
            var index = $(this).index(),
                deg;

            switch (index) {
                case 0:
                    uploader.removeFile(file);
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if (supportTransition) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                // use jquery animate to rotation
                // $({
                //     rotation: rotation
                // }).animate({
                //     rotation: file.rotation
                // }, {
                //     easing: 'linear',
                //     step: function( now ) {
                //         now = now * Math.PI / 180;

                //         var cos = Math.cos( now ),
                //             sin = Math.sin( now );

                //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
                //     }
                // });
            }


        });

        $li.appendTo($queue);
    }

    // 负责view的销毁
    function removeFile(file) {
        var $li = $('#' + file.id);
        // console.log("$li" + $li + " #ss_" + file.id);

        delete percentages[file.id];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();

        $("#s_" + file.id).remove();
        $("#ss_" + file.id).remove();
        $("#Box_" + file.id).remove();//删除logo区域对应的图片
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each(percentages, function (k, v) {
            total += v[0];
            loaded += v[0] * v[1];
        });

        percent = total ? loaded / total : 0;

        spans.eq(0).text(Math.round(percent * 100) + '%');
        spans.eq(1).css('width', Math.round(percent * 100) + '%');
        updateStatus();
    }

    function updateStatus() {
        var text = '', stats;
        if (state === 'ready') {
            text = '选中' + fileCount + '个文件';
        } else if (state === 'confirm') {
            stats = uploader.getStats();
            if (stats.uploadFailNum) {
                text = '已成功上传' + stats.successNum + '个文件，' +
                    stats.uploadFailNum + '个文件上传失败，<a class="retry" href="#">重新上传</a>失败文件'
            }

        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + '个文件（' + WebUploader.formatSize(fileSize) + '），已上传' + stats.successNum + '个';

            if (stats.uploadFailNum) {
                text += '，失败' + stats.uploadFailNum + '个';
            }
        }

        $info.html(text);
    }

    function setState(val) {
        var file, stats;

        if (val === state) {
            return;
        }

        $upload.removeClass('state-' + state);
        $upload.addClass('state-' + val);
        state = val;

        switch (state) {
            case 'pedding':
                $placeHolder.removeClass('element-invisible');
                $queue.parent().removeClass('filled');
                $queue.hide();
                $statusBar.addClass('element-invisible');
                uploader.refresh();
                $upload.text('开始上传').removeClass('disabled');
                break;

            case 'ready':
                $placeHolder.addClass('element-invisible');
                $('#filePicker2').removeClass('element-invisible');
                $queue.parent().addClass('filled');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                $('#filePicker2').addClass('element-invisible');
                $progress.show();
                $upload.text('暂停上传');
                break;

            case 'paused':
                $progress.show();
                $upload.text('继续上传');
                break;

            case 'confirm':
                $progress.hide();
                $upload.text('开始上传').addClass('disabled');

                stats = uploader.getStats();
                if (stats.successNum && !stats.uploadFailNum) {
                    setState('finish');
                    return;
                }
                break;
            case 'finish':
                stats = uploader.getStats();
                if (stats.successNum) {
                    //alert('上传成功');
                    $upload.removeClass('disabled');
                } else {
                    // 没有成功的图片，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }

    uploader.onUploadProgress = function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        $percent.css('width', percentage * 100 + '%');
        percentages[file.id][1] = percentage;
        updateTotalProgress();
    };

    //弹出框选择完图片后处理逻辑
    uploader.onFileQueued = function (file) {
        // console.log("onFileQueued size = " + file.size + " filecount = " + fileCount);
        if (fileCount >= addBoxSize) {
            alert("上传图片数不能大于logo区域数");
        }else {
            fileCount++;
            fileSize += file.size;

            if (fileCount > 0) {
                $placeHolder.addClass('element-invisible');
                $statusBar.show();
            }

            addFile(file);      //生成图片
            setState('ready');  //设置状态
            updateTotalProgress();
        }
    };

    //点击删除图片后处理逻辑
    uploader.onFileDequeued = function (file) {
        fileCount--;
        fileSize -= file.size;

        if (!fileCount) {
            setState('pedding');
        }

        removeFile(file);
        updateTotalProgress();

    };

    uploader.on('all', function (type) {
        var stats;
        switch (type) {
            case 'uploadFinished':
                setState('confirm');
                break;

            case 'startUpload':
                setState('uploading');
                break;

            case 'stopUpload':
                setState('paused');
                break;

        }
    });

    // 文件上传成功,合并文件。
    uploader.on('uploadSuccess', function (file, response) {
        if (response.chunked) {
            $.post("/API/Plug/UpLoad.ashx?action=MergeFiles", {guid: GUID, fileExt: response.f_ext, uptype: uptype},
                function (data) {
                    if (data.hasError) {
                        alert('文件合并失败！');
                    } else {
                        $("#upSuccessList").append("<input type='hidden' name='successfile' value='" + data.filename + "' id='s_" + file.id + "'>");
                        $("#upSuccessList").append("<input type='hidden' name='successfile_source' value='" + data.filename_source + "' id='ss_" + file.id + "'>");
                    }

                });
        }
        else {
            $("#upSuccessList").append("<input type='hidden' name='successfile' value='" + response.filename + "' id='s_" + file.id + "'>");
            $("#upSuccessList").append("<input type='hidden' name='successfile_source' value='" + response.filename_source + "' id='ss_" + file.id + "'>");
        }

    });

    //获取服务器返回的信息，return false触发uploadError事件
    uploader.on('uploadAccept', function (file, response) {
        if (response.hasError) {
            // 通过return false来告诉组件，此文件上传有错。
            return false;
        }
    });

    uploader.onError = function (code) {
        if (code == "Q_EXCEED_NUM_LIMIT")
            alert("上传文件数量超过" + fileNum + "个");
        else if (code == "Q_EXCEED_SIZE_LIMIT")
            alert("上传文件总大小超过" + fileAllSize + "KB");
        else if (code == "Q_TYPE_DENIED")
            alert("不允许上传的文件类型");
        else
            alert('Eroor: ' + code);
    };

    $upload.on('click', function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }
        if (state === 'ready') {
            uploader.upload();
        } else if (state === 'paused') {
            uploader.upload();
        } else if (state === 'uploading') {
            uploader.stop();
        }
    });

    $info.on('click', '.retry', function () {
        uploader.retry();
    });

    $info.on('click', '.ignore', function () {

    });

    $upload.addClass('state-' + state);
    updateTotalProgress();

    //已下3个函数用来实现编辑时的图片初始化
    var getFileBlob = function (url, cb) {
        if ('gif,jpg,jpeg,bmp,png'.split(',').indexOf(url.split('.')[url.split('.').length - 1]) < 0) {
            url = '/common/webuploader/images/oge.png';
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function () {
            cb(xhr.response);
        });
        xhr.send();
    };

    var blobToFile = function (blob, name) {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
    };

    var getFileObject = function (filePathOrUrl, cb) {
        getFileBlob(filePathOrUrl, function (blob) {
            cb(blobToFile(blob, filePathOrUrl.substring(filePathOrUrl.lastIndexOf('/') + 1)));
        });
    };

    //图片初始化
    var ImgInit = function (picList) {
        $.each(picList, function (index, item) {
            var f = item + "";
            if (f != "") {
                getFileObject(f + "", function (fileObject) {
                    var wuFile = new WebUploader.Lib.File(WebUploader.guid('rt_'), fileObject);
                    var file = new WebUploader.File(wuFile);

                    uploader.addFiles(file)

                    file.setStatus("complete");

                    $("#upSuccessList").append("<input type='hidden' name='successfile' value='" + f.substr(f.lastIndexOf('/') + 1) + "' id='s_" + file.id + "'>");
                    if (picList_source.length > index) {
                        $("#upSuccessList").append("<input type='hidden' name='successfile_source' value='" + picList_source[index] + "' id='ss_" + file.id + "'>");
                        $("#" + file.id + " .title").html(picList_source[index]);
                    }
                })
            }
        });
    }
    //需要编辑的图片列表
    //var picList = ['/UploadFile/Temp/201711161736461018.jpg'];
    if (picList.length > 0)
        ImgInit(picList);

};

var downPath = "";

function downFile(name) {
    var url = downPath + name;
    //location.href = url;
    window.open(url);
}