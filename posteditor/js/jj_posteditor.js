/*! v1.0.0 - 2016-01-26 - 2j */
(function($ ){
    $.posteditor = function(el, options){
        var root = this;
        root.$el = $(el);
        root.$el.data("posteditor", root);
        var $post;

        /* init
            * eiting mode
        */
        root.init = function(){
            root.options = $.extend({},$.posteditor.defaultOptions, options);

            //root.createApiScript();
            root.createCanvas();
            //root.initSreen();
            root.initControls();
            root.initCanvas();
            root.initModal();
            root.log("Finished");
        };

        root.initSreen = function(){
            root.createViewcontrols();

            var canvas = $post.find("#" + root.options.canvasId);
            var cnavasWidth = canvas.innerWidth();
            root.log($("."+root.options.viewGroupClass).length);
            if(cnavasWidth > 320){
                $("."+root.options.viewGroupClass).find(".post-view-pc").addClass(root.options.viewButtonsOnClass);
            }else{
                $("."+root.options.viewGroupClass).find(".post-view-mobile").addClass(root.options.viewButtonsOnClass);
            }

            $(window).resize(function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var cnavasWidth = canvas.outerWidth();
                $("."+root.options.viewGroupClass).find("button").removeClass(root.options.viewButtonsOnClass);

                if(cnavasWidth > 320){
                    $("."+root.options.viewGroupClass).find(".post-view-pc").addClass(root.options.viewButtonsOnClass);
                }else{
                    $("."+root.options.viewGroupClass).find(".post-view-mobile").addClass(root.options.viewButtonsOnClass);
                }
            });
        };

        /* create div textarea id appenTo */
        root.createCanvas = function(){
            /* div
            var html = root.$el.html();
            root.$el.html("");
            $("<div/>", {
                'id': root.options.canvasId,
                'html': html
            }).appendTo(root.$el);
            */

            // textarea replaceWith div

            var contents = root.$el.val();
            if(!$.trim(contents)){
                var addElement = "post-text";
                contents = root.createRow(addElement).removeClass(root.options.rowAddClass).clone().wrap('<div>').parent().html();
            }

            var html = $("<div/>", {
                'id': root.options.canvasId,
                'html': contents
            });

            var elid = root.$el.attr("id");
            $post = $("<div/>",{
                'id':elid+"_postEditor",
                'class':root.options.canvasClass,
            });
            //root.$el.replaceWith($post);
            root.$el.hide();
            root.$el.after($post);
            $post.append(html);
        };

        root.createApiScript = function(){
            /*
            var script = $("<script />", {
                'id':root.options.mapApiId,
                'type':"text/javascript",
                'src':"//apis.daum.net/maps/maps3.js?autoload=false&apikey="+root.options.mapApiKey
            });
            $("head").append(script);
            */
            var headTag = document.getElementsByTagName("head")[0];
            var newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.src = "//apis.daum.net/maps/maps3.js?autoload=false&apikey="+root.options.mapApiKey;
            headTag.appendChild(newScript);
        };

        /* Control click fucntion */
        root.initControls = function () {
            var canvas = $post.find("#" + root.options.canvasId);

            //row click
            $post.on("click", ".post-moveRow", function(e){
                //if (e.target !== this) return;
                root.clearColControls();
                root.clearRowControls();

                var thisParent = $(this).parent();
                thisParent.find(".post-setRow").show();
                thisParent.find(".post-removeRow").show();
                thisParent.find(".post-moveRow").addClass("post-select-show");

            //row AddControls show
            }).on("click", ".post-setRow", function(){
                var addBtns = $(this).parent().next("." + root.options.addGroupClass);
                root.addGroupControls(addBtns);

            //row remove
            }).on("click", ".post-removeRow", function(){
                var rowLen = canvas.find("."+root.options.rowClass).length;
                var thisRow = $(this).closest("."+root.options.rowClass);
                var rowIndex = thisRow.index()+1;

                if(rowLen == "1"){
                    alert("컨텐츠가 혼자 있어 삭제 할수 없습니다.");
                }else{
                    if(rowLen == rowIndex){
                        thisRow.prev().find(".post-setRow").show();
                        thisRow.prev().find(".post-removeRow").show();
                    } else {
                        thisRow.next().find(".post-setRow").show();
                        thisRow.next().find(".post-removeRow").show();
                    }
                    thisRow.remove();
                }

            //add Text
            }).on("click", ".post-addText", function(){
                var selectThis = $(this);
                var addElement = "post-text";

                root.postAddButtonAction(selectThis, addElement);

            //edit Text
            }).on("click", ".post-text", function(){
                root.clearColControls();
                root.clearRowControls();
                root.showRowControls($(this));

                $(this).next().find(".post-moveRow").addClass("post-select-show");
                $(this).addClass(root.options.postupdateClass);

                if($(this).hasClass(root.options.postEmptyClass)){
                    $(this).text("");
                }
                root.editorControl("enable", $(this));

            //add img
            }).on("click", ".post-addImage", function(){
                var selectThis = $(this);
                var addElement = "post-image";

                root.postAddButtonAction(selectThis, addElement);

            //edit image
            }).on("click", ".post-image", function(){
                root.clearColControls();
                root.clearRowControls();
                root.showRowControls($(this));

                $(this).next().find(".post-moveRow").addClass("post-select-show");
                $(this).addClass(root.options.postupdateClass);
                $(this).append(root.editToolFactory(root.options.ImgButtonsAppend));

            }).on("click", ".post-editpicture", function(){
                $("#modalImg").modal("show");

            //align Left
            }).on("click", "button.post-alignLeft", function(){
                var thisCol = $(this).closest("."+root.options.colClass);
                var alignClass = thisCol.attr("class").match(/(post-align)\w+/g);

                if(alignClass != "null"){
                    thisCol.removeClass (function (index, css) {
                        return (css.match (/\post-align\S+/g) || []).join(' ');
                    });
                }
                thisCol.addClass("post-alignLeft");

            //align Center
            }).on("click", "button.post-alignCenter", function(){
                var thisCol = $(this).closest("."+root.options.colClass);
                var alignClass = thisCol.attr("class").match(/(post-align)\w+/g);

                if(alignClass != "null"){
                    thisCol.removeClass (function (index, css) {
                        return (css.match (/\post-align\S+/g) || []).join(' ');
                    });
                }
                thisCol.addClass("post-alignCenter");

            //align Right
            }).on("click", "button.post-alignRight", function(){
                var thisCol = $(this).closest("."+root.options.colClass);
                var alignClass = thisCol.attr("class").match(/(post-align)\w+/g);

                if(alignClass != "null"){
                    thisCol.removeClass (function (index, css) {
                        return (css.match (/\post-align\S+/g) || []).join(' ');
                    });
                }
                thisCol.addClass("post-alignRight");

            //img link
            }).on("click", "button.post-editlink", function(){
                $("#modalLink").modal("show");

            //add Video
            }).on("click", "button.post-addVideo", function(){
                var selectThis = $(this);
                var addElement = "post-video";

                root.postAddButtonAction(selectThis, addElement);

            //edit Video
            }).on("click", ".post-video", function(e){
                root.clearColControls();
                root.clearRowControls();
                root.showRowControls($(this));

                $(this).next().find(".post-moveRow").addClass("post-select-show");
                $(this).addClass(root.options.postupdateClass);
                $(this).append(root.editToolFactory(root.options.VideoButtonsAppend));

            //edit Video
            }).on("click", ".post-editvideo", function(){
                $("#modalVideo").modal("show");
                var videoUrl = canvas.find("."+root.options.postupdateClass).find("iframe").attr("src");
                $("#modalVideo").find('.note-video-url').val("https:"+videoUrl);

            //add map
            }).on("click", ".post-addDmap", function(){
                var selectThis = $(this);
                var addElement = "post-dmap";

                root.postAddButtonAction(selectThis, addElement);

            //edit map
            }).on("click", ".post-dmap", function(){
                root.clearColControls();
                root.clearRowControls();
                root.showRowControls($(this));

                $(this).next().find(".post-moveRow").addClass("post-select-show");
                $(this).addClass(root.options.postupdateClass);
                $(this).append(root.editToolFactory(root.options.DmapButtonsAppend));

            //edit map
            }).on("click", ".post-editdmap", function(){
                $("#modalDmap").modal("show");

            //add Line
            }).on("click", ".post-addLine", function(){
                var selectThis = $(this);
                var addElement = "post-line";

                root.postAddButtonAction(selectThis, addElement);


            //testLog root.log("rowLength: " + rowLen + "/" +"rowIndex: " + rowIndex);
            // prevent default.
            }).on("click", "a.post-moveRow, a.post-setRow, button.post-addText, div.post-text, button.post-addImage, div.post-image, button.post-image, button.post-addVideo, div.post-video, button.post-addDmap, button.post-addLine", function (e) {
                root.log("Clicked: " + $(this).attr("class"));
                e.preventDefault();

            });

        };

        //post Add Button click Action
        root.postAddButtonAction = function(selectThis, addElement){
            var canvas = $post.find("#" + root.options.canvasId);
            var thisRow = selectThis.closest("."+root.options.rowClass);
            root.clearColControls();
            root.clearRowControls();

            thisRow.after(root.createRow(addElement));
            root.activateRows($("."+root.options.rowAddClass));

            thisRow.find(".post-setRow").hide();
            thisRow.find(".post-removeRow").hide();
            thisRow.find("." + root.options.addGroupClass).css("height","0");

            $("."+root.options.rowAddClass).find(".post-moveRow").addClass("post-select-show");
            var selectThisClass = selectThis.attr("class");

            switch (selectThisClass) {
                case 'post-addText':
                    $("."+root.options.rowAddClass).removeClass(root.options.rowAddClass);
                    break;
                case 'post-addImage':
                    $("."+root.options.rowAddClass).find("."+addElement).addClass(root.options.postupdateClass);
                     $("#modalImg").modal("show");
                    break;
                case 'post-addVideo':
                    $("."+root.options.rowAddClass).find("."+addElement).addClass(root.options.postupdateClass);
                    $("#modalVideo").modal("show");

                    break;
                case 'post-addDmap':
                    $("."+root.options.rowAddClass).find("."+addElement).addClass(root.options.postupdateClass);
                    $("#modalDmap").modal("show");
                    break;

                case 'post-addLine':
                    $("."+root.options.rowAddClass).removeClass(root.options.rowAddClass);
                    break;
                default:
                    root.log("postAddButtonAction");
            }

            canvas.sortable('refresh');
        };

        /* createViewcontrols pc mobile */
        root.createViewcontrols = function(){
            $("body").prepend(
                $("<div />", {
                    "class":root.options.viewGroupClass
                }).html(root.options.viewButtonsPrepand)
            );
        };

        /* clearRowControls */
        root.addGroupControls = function(addBtns){
            var timer;

            if(addBtns.css("height").replace("px", "") == "0"){
                //show
                addBtns.css("height","48px");

                //hide time
                timer = setTimeout(function(){
                    addBtns.css("height","0");
                }, 5000);

                addBtns.mouseenter(function(){
                   timer = clearTimeout(timer);
                }).mouseleave(function(){
                    $(this).css("height","0");
                });
            }else{
                //hide
                addBtns.css("height","0");
            }
        };

        /* clearRowControls */
        root.clearRowControls = function(){
            var canvas = $post.find("#" + root.options.canvasId);
            var rows = canvas.find("."+root.options.rowClass);
            rows.find(".post-setRow").hide();
            rows.find(".post-removeRow").hide();
            rows.find("." + root.options.addGroupClass).css("height","0");
            canvas.find(".post-moveRow").removeClass("post-select-show");
        };

        /* showRowControls */
        root.showRowControls = function(element){
            var thisParent = element.parent();
            thisParent.find(".post-setRow").show();
            thisParent.find(".post-removeRow").show();
        };

        /* clearColControls */
        root.clearColControls = function(){
            var canvas = $post.find("#" + root.options.canvasId);
            var updateClass = "update-post-cont";
            //root.log("aaaa"+canvas.find("."+updateClass).attr("class"));
            if(canvas.find("."+updateClass).length > 0){
                if(canvas.find("."+updateClass).hasClass("post-text")){
                    root.editorControl("disable", $("."+updateClass));
                }
                canvas.find("."+updateClass).removeClass(updateClass);
            }
            canvas.find("." + root.options.postEditToolClass).remove();
        };

        /* initCanvas */
        root.initCanvas = function(){
            var canvas = $post.find("#" + root.options.canvasId);
            var rows = canvas.find("."+root.options.rowClass);
            var cols = canvas.find("."+root.options.colClass);

            root.activateRows(rows);
            root.activateCols(cols);
            //Make Rows sortable
            canvas.sortable({
                //items: rows,
                axis: 'y',
                handle: ".post-moveRow, .post-screen",
                placeholder: root.options.rowsortableClass,
                opacity: 0.7,
                tolerance: "pointer",
                cursor: "move",
                helper: function (e, item) {
                    return item.clone();
                    root.clearColControls();
                },
                start:function(e,ui){
                    $(ui.item).show().addClass("ui-sortable-this");
                    ui.placeholder.removeAttr("style");
                    clone = $(ui.item).clone();
                    //ui.helper.find("."+root.options.postToolClass).remove();
                },
                sort: function(e, ui) {
                    if(ui.item.next().hasClass(root.options.rowsortableClass)){
                        ui.item.next().hide();
                    }else{
                        ui.placeholder.show();
                    }
                },
                stop:function(e, ui){
                    $(ui.item).removeClass("ui-sortable-this");
                }
            });//.disableSelection();

            $.each(rows, function (i, val) {
                if(i == "0"){
                    $(val).find(".post-setRow").show();
                    $(val).find(".post-removeRow").show();
                }else{
                    $(val).find(".post-setRow").hide();
                    $(val).find(".post-removeRow").hide();
                }
            });

        };

        /*------------ rows ------------*/
        /* activateRows
            * add buttons
        */
        root.createRow = function(addElement){
            var row = $("<div/>").addClass(root.options.rowClass)
                                .addClass(root.options.rowAddClass)
                                .prepend(root.createCol(addElement));
            return row;
        };

        root.activateRows = function(rows){
            rows.append(root.toolFactory(root.options.rowButtonsAppend));
            rows.append(
                $("<div/>", {
                    'class': root.options.addGroupClass,
                    'html': root.buttonFactory(root.options.addButtonsAppend)
                })
            );
            root.log("activateRows"+rows.attr("class"));
        };

        root.deactivateRows = function(rows){
            rows.find("." + root.options.postToolClass).remove();
            rows.find("." + root.options.addGroupClass).remove();
            rows.find("." + root.options.rowAddClass).remove();
        };


        /*------------ cols ------------*/
        /* activateCows
            * switch contents html
        */
        root.createCol = function(addElement){
            var html = "";
            var addClass = "";
            var addScreen ="";
            switch (addElement) {
                case 'post-text':
                    html = root.options.postTextempty;
                    addClass = root.options.postEmptyClass;
                    break;
                case 'post-image':
                    html = $("<img />",{
                        'src': '',
                        'alt': ''
                    });
                    addScreen=$("<span/>", {'class': root.options.postScreenClass});
                    break;
                case 'post-video':
                    html = $("<iframe />",{
                        'frameborder': '0',
                        'src': ''
                    });
                    addScreen=$("<span/>", {'class': root.options.postScreenClass});
                    break;
                case 'post-dmap':
                    html = $("<div />",{
                        'class': 'post-dmap-map'
                    });
                    addScreen=$("<span/>", {'class': root.options.postScreenClass});
                    break;
                case 'post-line':
                    html = $("<div />",{
                        'class': 'post-horizontal-line1'
                    });
                    addScreen=$("<span/>", {'class': root.options.postScreenClass});
                    break;
                default:
                    root.log("add Col");
            }
            var col = $("<div/>").addClass(root.options.colClass)
                                .addClass(addElement)
                                .addClass(addClass)
                                .html(html)
                                .append(addScreen);
            return col;
        };

        root.activateCols = function(cols){
            /*
            var len = cols.length;
            if(len == 1 && cols.hasClass("post-text")){
                cols.addClass(root.options.postEmptyClass)
            }
            */
            $.each(cols, function (i, col) {
                if($(col).hasClass("post-text")){
                    if($(col).hasClass("."+root.options.postEmptyClass)){
                        $(col).append(root.options.postTextempty)
                    }
                }else{
                    $(col).append(
                        $("<span/>", {'class': root.options.postScreenClass})
                    );
                }

            });
            root.log("activateCols"+cols.attr("class"));
        };

        root.deactivateCols = function(cols){
            cols.find("." + root.options.postScreenClass).remove();
            cols.find("." + root.options.postEditToolClass).remove();
        };

        /*------------ wysiwyg editor ------------*/
        /*
            * summernote
            * http://summernote.org/
        */
        root.editorControl = function(action, element){
            var canvas = $post.find("#" + root.options.canvasId);
            switch(action){
                case 'enable':
                    element.summernote(root.options.summernote.config);
                break;
                case 'disable':
                    var markupStr = element.summernote('code');
                    var markupStrText = $("<div/>",{
                       html:markupStr
                    }).text();

                    element.summernote('destroy');

                    if(markupStrText == ""){
                        element.html("").append(root.options.postTextempty);
                        element.addClass(root.options.postEmptyClass);
                    }else{
                        //element.html("", markupStr);
                        element.removeClass(root.options.postEmptyClass);
                    }
                break;

                default:
                    root.log('editorControl default');

            }
        };

        /* toolFactory */
        root.toolFactory = function(btns){
            var tools = $("<div/>").addClass(root.options.postToolClass).html(root.buttonFactory(btns));
            return tools[0].outerHTML;
        };

        /* editToolFactory */
        root.editToolFactory = function(btns){
            var tools = $("<div/>").addClass(root.options.postEditToolClass).html(root.buttonFactory(btns));
            return tools[0].outerHTML;
        };

        /* buttonFactory */
        root.buttonFactory = function(btns){
            var buttons = [];
            $.each(btns, function(i, val){
                val.btnLabel = (typeof val.btnLabel === 'undefined') ? '' : val.btnLabel;
                val.title = (typeof val.title == 'undefined') ? '' : val.title;
                val.btntype = (typeof val.type == 'undefined') ? '' : " type='" + val.btntype + "'";
                buttons.push("<" + val.element + " title='" + val.title + "' class='" + val.btnClass + "'" + val.btntype + ">" + val.btnLabel  + "</"+ val.element + ">")
            });
            return buttons.join("");
        };

         root.modalFactory = function(modalContents){
            var tools = $("<div/>").html(root.modalsFactory(modalContents));
            return tools[0].innerHTML;
        };

        /* modalFactory */
        root.modalsFactory = function(modalContents){
            var modals = [];
            $.each(modalContents, function(i, val){
                val.id = (typeof val.id === 'undefined') ? '' : val.id;
                val.html = (typeof val.html === 'undefined') ? '' : val.html;

                modals.push('<div class="modal fade" id='+ val.id +' aria-hidden="false" tabindex="-1" style="display: none;"><div class="modal-dialog"><div class="modal-content">'+ val.html +'</div></div></div>');
            });
            return modals.join("")
        };

        root.modalsRemove = function(modalContents){
            $.each(modalContents, function(i, val){
                val.id = (typeof val.id === 'undefined') ? '' : val.id;
                $("#"+val.id).remove();
            });
        };

        /* initModal */
        root.initModal = function(){
            $("body").append(root.modalFactory(root.options.modaldefault));

            // img
            $("#modalImg").on("shown.bs.modal", function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var imageInput = $(this).find(".note-image-input"),
                    imageAlt = $(this).find(".note-image-alt-input"),
                    imageBtn = $(this).find(".note-image-btn"),
                    imgSrc;

                imageInput.on("change", function () {
                    // file format check
                    var file = imageInput.val();
                    var ext = file.split(".");
                    ext = ext[ext.length-1].toLowerCase();
                    var arrayExtensions = ["jpg" , "jpeg", "png", "bmp", "gif"];

                    if (arrayExtensions.lastIndexOf(ext) == -1) {
                        alert("JPG, GIF, PNG, BMP 확장자만 가능합니다");
                        imageInput.val("");
                    }

                    // Get the file size
                    var size;
                    var maxSize = 1024*1024;  //1MB

                    if (window.FileReader && window.File && window.FileList && window.Blob) {
                        // HTML5 File API Supported
                        size = imageInput[0].files[0].size;
                    } else {
                        // Need to use ActiveX to read the file size
                        var myFSO = new ActiveXObject("Scripting.FileSystemObject");
                        var filepath = imageInput.val();
                        var thefile = myFSO.getFile(filepath);
                        size = thefile.size;
                    }

                    if (size > maxSize) {
                        //var _size = size;
                        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
                        i=0;while(size>900){size/=1024;i++;}
                        var exactSize = (Math.round(size*100)/100)+' '+fSExt[i];

                        //var _sizeMax = maxSize;
                        j=0;while(maxSize>900){maxSize/=1024;j++;}
                        var limitSize = (Math.round(maxSize*100)/100)+' '+fSExt[i];

                        alert('The selected file is bigger than the maximum allowed file size.\r\n\r\nSelected file size: ' + exactSize+'\r\nMax allowed file size: ' + limitSize);
                        imageInput.val("");
                    }

                    //imageBtn disabled
                    var val = $(this).val();
                    var thisDom = $(this)[0];

                    if (thisDom.files && thisDom.files[0]) {
                        if(root.options.imageSaveAjax == false){
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                imgSrc = e.target.result;
                            }
                            reader.readAsDataURL(thisDom.files[0]);
                        }

                        imageBtn.removeClass("disabled").prop("disabled", false);
                    } else {
                        imageBtn.addClass("disabled").prop("disabled", true);
                    };
                });

                imageBtn.click(function(e){
                    e.preventDefault();
                    if(imageInput.val() != ""){

                        if(root.options.imageSaveAjax){
                            var form = new FormData(document.getElementById('uploadForm'));

                            $.ajax({
					        url: root.options.imgUploadUrl,
					        data: form,
					        dataType: 'json',
					        type: 'POST',
					        mimeType: "multipart/form-data",
					        processData: false,
					        contentType: false,
					        cache:false,
					        success: function (data) {
					        	root.log('success');
					        	root.log(data);
					        	imgSrc = data.result;
					          	canvas.find("."+root.options.postupdateClass).find("img").attr("src", imgSrc);
		                        canvas.find("."+root.options.postupdateClass).find("img").attr("alt", imageAlt.val());
					        },
					        error: function (jqXHR) {
					        	root.log('error');
					        }
					      });
                        } else {
                            canvas.find("."+root.options.postupdateClass).find("img").attr("src", imgSrc);                        canvas.find("."+root.options.postupdateClass).find("img").attr("alt", imageAlt.val());
                        }


                        imageBtn.addClass("uploadImg");

                        $("#modalImg").modal("hide");
                    }
                });
            });

            $("#modalImg").on("hidden.bs.modal", function () {
                var imageInput = $(this).find(".note-image-input"),
                    imageAlt = $(this).find(".note-image-alt-input"),
                    imageBtn = $(this).find(".note-image-btn");

                if(imageBtn.hasClass("uploadImg")){
                     $("."+root.options.rowAddClass).removeClass(root.options.rowAddClass);
                }else{
                    $("."+root.options.rowAddClass).remove();
                }
                imageBtn.removeClass("uploadImg");
                imageInput.val("");
                imageAlt.val("");
                imageBtn.addClass("disabled").prop("disabled", true);
            });

            // img link
            $("#modalLink").on("shown.bs.modal", function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var thisLink = canvas.find("."+root.options.postupdateClass).find("a");
                var thisLinkUrl, thisLinkTarget, newLink = false;
                var linkText = $(this).find(".note-link-text"),
                    linkUrl = $(this).find(".note-link-url"),
                    linkBtn = $(this).find(".note-link-btn"),
                    openInNewWindow = $(this).find("input[type=checkbox]");

                if(thisLink.length > 0){
                    $(this).find(".modal-title").text("링크 수정")
                    thisLinkUrl = thisLink.attr("href");
                    linkBtn.removeClass("disabled").prop("disabled", false);
                    if(thisLink.attr("target") == "_self"){
                        openInNewWindow.prop("checked", false);
                    }else{
                        openInNewWindow.prop("checked", true)
                    }
                    newLink = true;
                } else {
                    thisLinkUrl = "http://";
                }

                linkUrl.on('input', function () {
                    if (linkUrl.val() == "http://" || linkUrl.val() == "") {
                        linkBtn.addClass("disabled").prop("disabled", true);
                    } else {
                        linkBtn.removeClass("disabled").prop("disabled", false);
                    };
                }).val(thisLinkUrl).trigger('focus');

                linkBtn.click(function(e){
                    e.preventDefault();
                    if(openInNewWindow[0].checked){
                        thisLinkTarget = "_blank";
                    } else {
                        thisLinkTarget = "_self";
                    }

                    if(newLink){
                        thisLink.attr("href", linkUrl.val());
                        thisLink.attr("title", linkText.val());
                        thisLink.attr("target", thisLinkTarget);
                    } else {
                        canvas.find("."+root.options.postupdateClass).find("img").wrap("<a href='"+ linkUrl.val() +"' title='"+linkText.val()+"' target='"+thisLinkTarget+"'></a>");
                    }
                    $("#modalLink").modal("hide");
                });
            });

            $("#modalLink").on("hidden.bs.modal", function () {
                var linkText = $(this).find(".note-link-text"),
                    linkUrl = $(this).find(".note-link-url"),
                    linkBtn = $(this).find(".note-link-btn"),
                    openInNewWindow = $(this).find("input[type=checkbox]");

                linkUrl.val("");
                openInNewWindow.prop('checked', true);;
                linkBtn.addClass("disabled").prop("disabled", true);
            });

            // video
            $("#modalVideo").on("shown.bs.modal", function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var videoUrl = $(this).find('.note-video-url'),
                    videoBtn = $(this).find('.note-video-btn');
                var youtubeId;

                videoUrl.on('input', function () {
                    var ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
                    var ytMatch = videoUrl.val().match(ytRegExp);

                    if (ytMatch && ytMatch[1].length === 11) {
                        videoBtn.removeClass("disabled").prop("disabled", false);
                        youtubeId = ytMatch[1];
                    } else {
                        //$(this).find("small.text-muted").text("youtube 공유 url을 입력해주세요.")
                        videoBtn.addClass("disabled").prop("disabled", true);
                    };
                }).trigger('focus');

                videoBtn.click(function(e){
                    e.preventDefault();
                    canvas.find("."+root.options.postupdateClass).find("iframe").attr('src', '//www.youtube.com/embed/' + youtubeId);
                    videoBtn.addClass("uploadVideo");
                    $("#modalVideo").modal("hide");

                });
            });

            $("#modalVideo").on("hidden.bs.modal", function () {
                var videoUrl = $(this).find('.note-video-url'),
                    videoBtn = $(this).find('.note-video-btn');

                if(videoBtn.hasClass("uploadVideo")){
                     $("."+root.options.rowAddClass).removeClass(root.options.rowAddClass);
                }else{
                    $("."+root.options.rowAddClass).remove();
                }
                videoBtn.removeClass("uploadVideo");
                videoUrl.val("");
                videoBtn.addClass("disabled").prop("disabled", true);
            });

            // daum map
            $("#modalDmap").on("shown.bs.modal", function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var updateId = canvas.find("."+root.options.postupdateClass).find("div").attr("id");
                var dmapBtn = $(this).find('.note-dmap-btn');
                var dmapLat = $(this).find('.note-dmap-lat');
                var dmapLng = $(this).find('.note-dmap-lng');
                var dmapLatVal, dmapLngVal;

                if(updateId == "" || updateId == undefined ){
                    dmapLatVal = root.options.mapApiLat;
                    dmapLngVal = root.options.mapApiLng;

                    dmapLat.val(dmapLatVal);
                    dmapLng.val(dmapLngVal);
                } else {
                    dmapLat.val(canvas.find("."+root.options.postupdateClass).find("div").attr("data-dmapLat"));
                    dmapLng.val(canvas.find("."+root.options.postupdateClass).find("div").attr("data-dmapLng"));

                    dmapLatVal = dmapLat.val();
                    dmapLngVal = dmapLng.val();
                }
                root.log(updateId+"= lat:"+dmapLatVal+" lng:"+dmapLngVal);

                daum.maps.load(function() {
                    var mapContainer = document.getElementById("modalDaumMap"),
                        mapOption = {
                            center: new daum.maps.LatLng(dmapLatVal, dmapLngVal),
                            level: 3
                        };
                    var map = new daum.maps.Map(mapContainer, mapOption);
                    // 지도를 클릭한 위치에 표출할 마커입니다
                    var marker = new daum.maps.Marker({
                        // 지도 중심좌표에 마커를 생성합니다
                        position: map.getCenter()
                    });
                    // 지도에 마커를 표시합니다
                    marker.setMap(map);
                    // 지도에 클릭 이벤트를 등록합니다
                    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
                    daum.maps.event.addListener(map, 'click', function(mouseEvent) {
                        // 클릭한 위도, 경도 정보를 가져옵니다
                        var latlng = mouseEvent.latLng;
                        // 마커 위치를 클릭한 위치로 옮깁니다
                        marker.setPosition(latlng);
                        //var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
                        //message += '경도는 ' + latlng.getLng() + ' 입니다';
                        //var resultDiv = document.getElementById('modalDaumMapInfo');
                        //resultDiv.innerHTML = message;
                        dmapLat.val(latlng.getLat());
                        dmapLng.val(latlng.getLng());

                        dmapBtn.removeClass("disabled").prop("disabled", false);
                    });
                    map.relayout();

                    dmapLat.on('change' , function () {
                        // 이동할 위도 경도 위치를 생성합니다
                        var moveLatLon = new daum.maps.LatLng(dmapLat.val(), dmapLng.val());
                        // 지도 중심을 이동 시킵니다
                        map.setCenter(moveLatLon);
                        marker.setPosition(moveLatLon);
                        dmapBtn.removeClass("disabled").prop("disabled", false);
                    });
                    dmapLng.on('change' , function () {
                        // 이동할 위도 경도 위치를 생성합니다
                        var moveLatLon = new daum.maps.LatLng(dmapLat.val(), dmapLng.val());
                        // 지도 중심을 이동 시킵니다
                        map.setCenter(moveLatLon);
                        marker.setPosition(moveLatLon);
                        dmapBtn.removeClass("disabled").prop("disabled", false);
                    });

                });


                dmapBtn.click(function(e){
                    e.preventDefault();

                    if(updateId != ""){
                        canvas.find("."+root.options.postupdateClass).find("div").html("");
                    }

                    var dmapId = root.uniqID();
                    var dmapScript = "";
                    dmapScript += '<script>'
                    dmapScript += 'var markerPosition'+dmapId+'  = new daum.maps.LatLng('+dmapLat.val()+', '+dmapLng.val()+');'
                    dmapScript += 'var marker'+dmapId+' = {'
                    dmapScript += '    position: markerPosition'+dmapId+''
                    dmapScript += '};'
                    dmapScript += 'var staticMapContainer'+dmapId+'  = document.getElementById("'+dmapId+'"),'
                    dmapScript += '    staticMapOption'+dmapId+' = { '
                    dmapScript += '        center: new daum.maps.LatLng('+dmapLat.val()+', '+dmapLng.val()+'),'
                    dmapScript += '        level: 3,'
                    dmapScript += '        marker: marker'+dmapId+''
                    dmapScript += '    };'
                    dmapScript += 'var staticMap'+dmapId+' = new daum.maps.StaticMap(staticMapContainer'+dmapId+', staticMapOption'+dmapId+');'
                    dmapScript += '</script>'

                    canvas.find("."+root.options.postupdateClass).find("div").attr("id", dmapId);
                    canvas.find("."+root.options.postupdateClass).find("div").append(dmapScript);
                    canvas.find("."+root.options.postupdateClass).find("div").attr("data-dmapLat", dmapLat.val());
                    canvas.find("."+root.options.postupdateClass).find("div").attr("data-dmapLng", dmapLng.val());
                    dmapBtn.addClass("uploadDmap");
                    $("#modalDmap").modal("hide");

                });
            });

            $("#modalDmap").on("hidden.bs.modal", function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var dmapBtn = $(this).find('.note-dmap-btn');
                var dmapLat = $(this).find('.note-dmap-lat');
                var dmapLng = $(this).find('.note-dmap-lng');

                if(dmapBtn.hasClass("uploadDmap")){
                     $("."+root.options.rowAddClass).removeClass(root.options.rowAddClass);
                }else{
                    $("."+root.options.rowAddClass).remove();
                }
                dmapBtn.removeClass("uploadDmap");
                dmapLat.val("");
                dmapLng.val("");
                dmapBtn.addClass("disabled").prop("disabled", true);
            });

        };

        /* uniq ID */
        root.uniqID = function () {
            var charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
                charSetSize = charSet.length,
                charCount = 10;

            var id = '';
            for (var i = 1; i <= charCount; i++) {
                var randPos = Math.floor(Math.random() * charSetSize);
                id += charSet[randPos];
            }
            return id;
        };

        /* deinitCanvas
            * remove canvas eiting mode
        */
        root.deinitCanvas = function(){
            var canvas = $post.find("#" + root.options.canvasId);
            var rows = canvas.find("."+root.options.rowClass);
            var cols = canvas.find("."+root.options.colClass);
            root.deactivateRows(rows);
            root.deactivateCols(cols);
            root.clearRowControls();
            root.clearColControls();
            $("body").find("."+root.options.viewGroupClass).remove();
            root.modalsRemove(root.options.modaldefault);
            canvas.find("."+root.options.postEmptyClass).text("");
            canvas.find(".post-dmap-map").remove();
            canvas.find(".post-dmap-map").find("a").remove();
        };

        /* clean
            * remove
        */
        root.cleanup = function () {
            root.deinitCanvas();
        };

        /* saveremote
         */
        root.saveremote = function () {
        	var canvas = $post.find("#" + root.options.canvasId);
            root.deinitCanvas();
            root.$el.val(canvas.html());
            /*
            $.ajax({
                type: "POST",
                url: root.options.saveURL,
                data: {
                    content: canvas.html()
                }
            });
            */
            root.log("Save Function Called");
        };

        /* log */
        root.log = function(logvar){
            if(root.options.debug){
                if((window['console'] !== undefined)){
                    window.console.log(logvar);
                }
            }
        };

        // run
        root.init();

    };

    /* options */
    $.posteditor.defaultOptions = {
        debug: true, //console : true/fals
        canvasClass: "post-canvas-wrap",
        canvasId: "post-canvas", // Canvas ID
        rowClass :"postrow",
        rowAddClass: "post-add-row",
        rowsortableClass : "ui-sortable-placeholder",
        colClass: "postcol",
        postToolClass: "post-tool",
        postEditToolClass: "post-edit-tool",
        postupdateClass: "update-post-cont",
        postScreenClass: "post-screen",
        postEmptyClass: "post-empty",
        postTextempty: "내용을 입력하세요.",
        rowButtonsAppend:[
            {
                btnLabel: "",
                title: "move",
                element: "a",
                btnClass: "post-moveRow"
            },
            {
                btnLabel: "+",
                title: "row seting",
                element: "a",
                btnClass: "post-setRow"
            },
            {
                btnLabel: "-",
                title: "row remove",
                element: "a",
                btnClass: "post-removeRow"
            }
        ],
        addGroupClass: "post-add",
        addButtonsAppend:[
            {
                btnLabel: "텍스트",
                title: "add text",
                element: "button",
                btntype: "button",
                btnClass: "post-addText"
            },
            {
                btnLabel: "이미지",
                title: "add image",
                element: "button",
                btntype: "button",
                btnClass: "post-addImage"
            },
            {
                btnLabel: "동영상",
                title: "add youtube",
                element: "button",
                btntype: "button",
                btnClass: "post-addVideo"
            },
            {
                btnLabel: "지도",
                title: "add daum map",
                element: "button",
                btntype: "button",
                btnClass: "post-addDmap"
            },
            {
                btnLabel: "선",
                title: "add line",
                element: "button",
                btntype: "button",
                btnClass: "post-addLine"
            },
        ],
        ImgButtonsAppend:[
            {
                btnLabel: "왼쪽정렬",//"L",
                title: "alignLeft",
                element: "button",
                btntype: "button",
                btnClass: "post-alignLeft"
            },
            {
                btnLabel: "가운데정렬",//"C",
                title: "alignCenter",
                element: "button",
                btntype: "button",
                btnClass: "post-alignCenter"
            },
            {
                btnLabel: "오른쪽정렬",//"R",
                title: "alignRight",
                element: "button",
                btntype: "button",
                btnClass: "post-alignRight"
            },
            {
                btnLabel: "링크 설정",//"Link",
                title: "edit Link",
                element: "button",
                btntype: "button",
                btnClass: "post-editlink"
            },
            {
                btnLabel: "이미지 변경",
                title: "edit picture",
                element: "button",
                btntype: "button",
                btnClass: "post-editpicture"
            }
        ],
        VideoButtonsAppend:[
            {
                btnLabel: "동영상 변경",
                title: "edit video",
                element: "button",
                btntype: "button",
                btnClass: "post-editvideo"
            }
        ],
        DmapButtonsAppend:[
            {
                btnLabel: "지도 변경",
                title: "edit dmap",
                element: "button",
                btntype: "button",
                btnClass: "post-editdmap"
            }
        ],

        summernote: {
            config: {
                focus: true,
                //airMode: true,
                lang: 'ko-KR',
                dialogsInBody: true,
                dialogsFade: true,
                disableDragAndDrop: true,
                //toolbarContainer: '.post-addText'
                fontNames: ['굴림', '돋움','Arial', 'Arial Black', 'Comic Sans MS', 'Courier New'],
                toolbar: [
                          ['fontname', ['fontname']],
                          ['fontsize', ['fontsize']],
                          ['font', ['bold', 'italic', 'underline']],
                          ['color', ['color']],
                          ['para', ['ul', 'ol', 'paragraph']],
                          ['height', ['height']],
                          ['insert', ['link']]
                        ],
                popover: {
                  link: [
                    ['link', ['linkDialogShow', 'unlink']]
                  ],
                  air: [
                    ['fontname', ['fontname']],
                    ['fontsize', ['fontsize']],
                    ['font', ['bold', 'italic', 'underline']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['insert', ['link']]
                  ]
                },
                callbacks: {
                    onInit: function() {
                        console.log('Summernote is launched');
                    }
                }

            }
        },

        /*
        hallo:{
            config: {
                plugins: {
                    //'hallosize': {},
                    'halloblock': {},
                    'hallocolor':{},
                    'hallobackcolor':{},
                    //'hallocolorpicker': {},
                    'hallofontfamily': {},
                    'halloformat': {},
                    //'halloheadings': {},
                    'hallojustify': {},
                    'hallolists': {},
                    'hallolink': {},
                    'halloreundo': {}
                },
                toolbar: 'halloToolbarFixed',
                editable: true,
                showAlways: true
            }
        }
        */
        viewGroupClass: "post-view-controls",
        viewButtonsPrepand:
            '   <button type="button" class="post-view-pc">pc</button>'+
            '   <button type="button" class="post-view-mobile">mobile</button>',
        viewButtonsOnClass: "post-view-on",
        modaldefault:[
            {
                id:"modalImg",
                html:
                '            <div class="modal-header">'+
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                '                <h4 class="modal-title">이미지 추가</h4>'+
                '            </div>'+
                '            <div class="modal-body">'+
                '                <div>'+
                '                ※ 이미지는. 원 사이즈 그대로 웹페이지에 적용되며,<br />웹페이지 가로 사이즈보다 추가하는 이미지의 가로 사이즈가 더 큰 경우에는<br />웹페이지 제한된 가로 사이즈(스킨에 따라 700~800픽셀)에 꽉 차게 적용됩니다'+
                '                </div>'+
                '                <form id="uploadForm" method="post" enctype="multipart/form-data">'+
                '                <div class="form-group note-group-select-from-files">'+
                '                    <label>추가 파일 선택</label><input class="note-image-input form-control" type="file" name="files" accept="image/*" multiple="multiple">'+
                '                </div>'+
                '                <div class="form-group note-group-select-from-files" style="display:none">'+
                '                    <label>대체텍스트</label><input class="note-image-alt-input form-control" type="text" name="alt" multiple="multiple">'+
                '                </div>'+
                '                </form>'+
                '            </div>'+
                '            <div class="modal-footer">'+
                '                <button href="#" class="btn btn-primary note-image-btn disabled" disabled="">이미지 추가</button>'+
                '                <div>'+
                '               [주의] 이미지 추가 시 저작권자의 사전 허락 없이 도용한 경우에는 법적인 처벌이 발생할 수 '+
                '               있으니 주의해주십시오.'+
                '               포털사이트에서 검색한 이미지, 의학서적에서 스캔한 이미지, 다른 웹사이트에서 캡쳐한'+
                '               이미지 등 타인(타사, 타 병원)의 이미지는 모두 저작권이 있으니 주의해주십시오.'+
                '                </div>'+
                '            </div>'
            },
            {
                id:"modalLink",
                html:
                '            <div class="modal-header">'+
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button><h4 class="modal-title">링크 추가</h4>'+
                '            </div>'+
                '            <div class="modal-body">'+
                '                <div class="form-group">'+
                '                    <label>링크에 표시할 내용</label><input class="note-link-text form-control" type="text">'+
                '                </div>'+
                '                <div class="form-group">'+
                '                    <label>이동할 URL</label><input class="note-link-url form-control" type="text" value="http://">'+
                '                </div>'+
                '                <div class="checkbox">'+
                '                    <label><input type="checkbox" checked=""> 새창으로 열기</label>'+
                '                </div>'+
                '            </div>'+
                '            <div class="modal-footer">'+
                '                <button href="#" class="btn btn-primary note-link-btn disabled" disabled="">링크 추가</button>'+
                '            </div>'
            },
            {
                id:"modalVideo",
                html:
                '            <div class="modal-header">'+
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                '                <h4 class="modal-title">동영상 추가</h4>'+
                '            </div>'+
                '            <div class="modal-body">'+
                '                <div>'+
                '                ※ 동영상 파일(avi, wmv) 자체를 업로드 하는 방식은 지원이 불가합니다.<br />동영상은 유투브(youtube) 또는 비메오(vimeo)의 동영상 주소를 입력해주세요.'+
                '                </div>'+
                '                <div class="form-group row-fluid">'+
                '                    <label>동영상 URL (http://~)<small class="text-muted"></small></label><input class="note-video-url form-control span12" type="text">'+
                '                </div>'+
                '            </div>'+
                '            <div class="modal-footer">'+
                '            <button href="#" class="btn btn-primary note-video-btn disabled" disabled="">동영상 추가</button>'+
                '                <div>'+
                '                [주의] 동영상 추가 시 저작권자의 사전 허락 없이 도용한 경우에는 법적인 처벌이 발생할 수 '+
                '                있으니 주의해주십시오.'+
                '                병원의 의료진이 TV방송에 출연했거나 병원의 장소를 협찬한 경우라고 하더라도 '+
                '                동영상의 저작권은 방송국에 귀속됩니다. 그러므로 동영상 추가 시 방송국 측의 사전 허락을'+
                '                받으셔야 합니다.'+
                '                </div>'+
                '            </div>'
            },
            {
                id:"modalDmap",
                html:
                '            <div class="modal-header">'+
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                '                <h4 class="modal-title">지도 위치 설정</h4>'+
                '            </div>'+
                '            <div class="modal-body">'+
                '                <div id="modalDaumMapInfo">'+
                '                <div class="form-group">'+
                '                <label>위도</label><input class="note-dmap-lat form-control" type="text" value="">'+
                '                </div>'+
                '                <div class="form-group">'+
                '                <label>경도</label><input class="note-dmap-lng form-control" type="text" value="">'+
                '                </div>'+
                '                </div>'+
                '                <div class="modalDaumlabel">※ 좀더 정확한 지도 위치 안내를 위해 아래 지도에서 직접 위치를 클릭·선택하시면 그 위치로 적용됩니다.</div>'+
                '                <div id="modalDaumMap"></div>'+
                '            </div>'+
                '            <div class="modal-footer">'+
                '                <button href="#" class="btn btn-primary note-dmap-btn disabled" disabled="">지도 추가</button>'+
                '            </div>'
            }

        ],
        mapApiId:"daumMap",
        mapApiKey:"",
        mapApiLat:"37.514833658289106",
        mapApiLng:"127.06574351895208",
        imageSaveAjax:false,
        saveURL:""

    };

    $.posteditor = function(el, options){

    $.fn.posteditor = function(options){
        return this.each(function(){
            var element = $(this);
            var posteditor = new $.posteditor(this, options);
            element.data('posteditor', posteditor);

        });
    };

})(jQuery );
