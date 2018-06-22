
var phanterGalleryObj = function(elementPhanterGalleryObj, config, messages){
    var MainObj = this
    MainObj.el = elementPhanterGalleryObj;
    MainObj.imageName = "";
    MainObj.imageType = "";
    MainObj.uploadArea = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-object"));
    MainObj.uploadFormContainer = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-upload-form-container"));
    MainObj.uploadInput = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-upload-input"));
    MainObj.panelCutterContainer = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-panel-cutter-container"));
    MainObj.cutterShadow = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-cutter-shadow"));
    MainObj.cutterControlClose = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-cutter-control-close"));
    MainObj.cutterControlView = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-cutter-control-view"));
    MainObj.cutterControlCut = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-cutter-control-cut"));
    MainObj.cutterPad = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-cutter-pad"));
    MainObj.cutterBackground = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-cutter-background"));
    MainObj.cutterZoomControl = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-cutter-zoom-control"));
    MainObj.panelCutterSizeContainer = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-panel-cutter-size-container"));
    MainObj.panelCutterImage = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-panel-cutter-image"));
    MainObj.targetView = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-target-view"));
    MainObj.targetViewContainer = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-target-view-container"));
    MainObj.imagecutedControlErase = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-imagecuted-control-erase"));
    MainObj.imagecutedControlChange = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-imagecuted-control-change"));
    MainObj.uploadMessages = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-upload-messages"));
    MainObj.uploadAreaProgress = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-upload-area-progress"));
    MainObj.uploadImageButton = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-upload-image-button"));
    MainObj.uploadTitleButton = phanterQuery("#"+elementPhanterGalleryObj.getAttribute("data-upload-title-button"));
    MainObj.cutterSizeX = elementPhanterGalleryObj.getAttribute("data-cutter-size-x");
    MainObj.cutterSizeY = elementPhanterGalleryObj.getAttribute("data-cutter-size-y");
    MainObj.uploadSrcImg = elementPhanterGalleryObj.getAttribute("data-upload-src-img");
    MainObj.config = config;
    MainObj.messages = messages;
    MainObj.phanterGalleryCutterObj = undefined;
    MainObj.error = false;
    MainObj._callAfterCut = "";
    MainObj.showProgress = function(){
        MainObj.uploadAreaProgress.addClass("actived");
        return MainObj
    };
    MainObj.hideProgress = function(){
        MainObj.uploadAreaProgress.removeClass("actived");
        return MainObj
    };
    MainObj.showMessage = function(message){
        MainObj.uploadMessages.html(message);
        MainObj.uploadMessages.addClass("actived");
        return MainObj
    };
    MainObj.hideMessage = function(){
        MainObj.uploadMessages.html("");
        MainObj.uploadMessages.removeClass("actived");
        return MainObj
    };
    MainObj.click = function(){
        MainObj.setTitleButton(MainObj.config.titleButtonWaiting)
        MainObj.uploadInput.trigger('click')
        return MainObj
    };
    MainObj.setImgButton = function(img){
        MainObj.uploadImageButton.html(img);
        return MainObj
    };
    MainObj.setTitleButton = function(title){
        MainObj.uploadTitleButton.html(title);
        return MainObj
    };
    MainObj.inputChange = function(){
        MainObj.showProgress();
        var blob = MainObj.uploadInput[0][0].files;
        MainObj.imageBlob = blob[0]
        var fileslength = blob.length;
        for (var i = fileslength - 1; i >= 0; i--) {
            var img_type = blob[i]['type'];
            var img_name= blob[i]['name'];
            MainObj.imageName = img_name;
            MainObj.imageType = img_type;
            if (img_type=="image/png"||img_type=="image/bmp"||img_type=="image/gif"||img_type=="image/jpeg"){
                if(img_name.length<50){
                    var reader = new FileReader();

                    reader.readAsDataURL(blob[0])
                    MainObj.targetView.html("")
                    MainObj.hideProgress()
                    reader.onloadend = function(){
                        var base64data = reader.result;
                        MainObj.phanterGalleryCutterObj= new phanterGalleryCutterObj(base64data, MainObj)
                        window.onresize = function(event){
                        }
                    }
                } else {
                    var message = MainObj.messages.nameOfFileLong
                    MainObj.showMessage(message);
                };
            } else{
                var message = MainObj.messages.FileCouldNotBeUploaded.replace("%(name_file)s", img_name);
                throw message
                MainObj.showMessage(message);
            }
        }
        return MainObj
    };
    MainObj.el=elementPhanterGalleryObj
    MainObj.uploadInput.on('change', function(){
        MainObj.inputChange();
    });
    MainObj.el.onclick = function(){
        MainObj.hideProgress();
        MainObj.hideMessage();
        MainObj.click();
    };
    return MainObj
}
var phanterGalleryCutterObj = function(base64data, PG){
    var selfObj = this
    var PG=PG
    var base64data=base64data
    var img1=document.createElement("IMG");
    var img2=document.createElement("IMG");
    img1.onerror = function(){
        PG.error=true;
        throw "invalid image!"
    }
    PG.panelCutterImage.html("");
    PG.cutterBackground.html("");
    PG.panelCutterImage[0][0].appendChild(img1)
    PG.cutterBackground[0][0].appendChild(img2)
    selfObj.base64data = base64data;
    selfObj.originalWidthImg = 0;
    selfObj.originalHeightImg = 0;
    selfObj.widthImg = 0;
    selfObj.heightImg = 0;
    selfObj.widthScreen = 0;
    selfObj.heightScreen = 0;
    selfObj.widthCutter = 0;
    selfObj.heightCutter = 0;
    selfObj.inicialPositionXBackground = 0;
    selfObj.inicialPositionYBackground = 0;
    selfObj.inicialPositionXImgToCut = 0;
    selfObj.inicialPositionYImgToCut = 0;
    selfObj.deslocationPositionXBackground = 0;
    selfObj.deslocationPositionYBackground = 0;
    selfObj.deslocationPositionXImgToCut = 0;
    selfObj.deslocationPositionYImgToCut = 0;
    selfObj.deslocationPositionZoom = 0;
    selfObj.positionDefaultZoom = 89.0;
    selfObj.widthImgAfterZoom = 0;
    selfObj.heightImgAfterZoom = 0;
    selfObj.positionXAfterZoom = 0;
    selfObj.positionYAfterZoom = 0;
    selfObj.activeViewImage = false;
    selfObj.calcMidPosition =function(sizeContainer, sizeContent, positionContent){
        var midsize1=sizeContainer/2.0
        var midsize2=sizeContent/2.0
        var relativeposition=midsize1-midsize2
        var finalPosition=relativeposition-positionContent
        return finalPosition
    };
    selfObj.moveImage =function(x,y){
        selfObj.deslocationPositionXBackground=x*(-1)
        selfObj.deslocationPositionYBackground=y*(-1)
        selfObj.deslocationPositionXImgToCut=x*(-1)
        selfObj.deslocationPositionYImgToCut=y*(-1)
        selfObj.calcPosition()
    };
    selfObj.viewImage =function(){
        if (selfObj.activeViewImage){
            selfObj.activeViewImage=false
            PG.cutterControlView.removeClass("actived")
            PG.cutterShadow.removeClass("actived")
        } else{
            selfObj.activeViewImage=true
            PG.cutterControlView.addClass("actived")
            PG.cutterShadow.addClass("actived")
        };
    };
    selfObj.closeImage = function(){
        PG.panelCutterContainer.removeClass("actived")
        PG.setTitleButton(PG.config.titleButton)
        PG.panelCutterContainer.addClass("close")
    };
    selfObj.cutImage = function(){
        var canvas = PG.targetView[0][0]
        canvas.width = selfObj.widthCutter
        canvas.height = selfObj.heightCutter
        var ctx = canvas.getContext('2d');
        var ratio = selfObj.originalWidthImg/parseFloat(selfObj.widthImgAfterZoom)
        var positionX = selfObj.positionXAfterZoom * (-1) * ratio
        var positionY = selfObj.positionYAfterZoom * (-1) * ratio
        var wX = PG.cutterSizeX * ratio
        var wY = PG.cutterSizeY * ratio
        PG.uploadArea.removeClass("actived")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img1, positionX, positionY, wX, wY, 0, 0, selfObj.widthCutter, selfObj.widthCutter)
        if (PG._callAfterCut){
            var imageCutObj={
                originalImage:{
                    imageName:PG.imageName,
                    imageType:PG.imageType,
                    imageBytes:PG.imageBlob,
                    imagemBase64Data:selfObj.base64data,
                    cutterSizeX:PG.cutterSizeX, 
                    cutterSizeY:PG.cutterSizeY,
                    positionX:selfObj.positionXAfterZoom,
                    positionY:selfObj.positionYAfterZoom,
                    newSizeX:selfObj.widthImgAfterZoom,
                    newSizeY:selfObj.heightImgAfterZoom, 
                },
                cuttedImage:{
                    imageName:PG.imageName,
                    imageType:PG.imageType,
                    imageBase64Data:canvas.toDataURL(),
                    imageBytes:"",
                }
            }
            canvas.toBlob(function(blob){
                var new_name = imageCutObj.originalImage.imageName
                var pos = new_name.lastIndexOf(".");
                new_name = new_name.substr(0, pos < 0 ? new_name.length : pos) + ".png";
                imageCutObj.cuttedImage.imageName = new_name
                imageCutObj.cuttedImage.imageType = "image/png"
                var file = new File([blob], new_name)
                imageCutObj.cuttedImage.imageBytes=file
                PG._callAfterCut(imageCutObj)
            })
        }
        PG.panelCutterContainer.removeClass("actived")
        PG.setTitleButton(PG.config.titleButton)
        PG.panelCutterContainer.addClass("close")
        PG.targetViewContainer.addClass("actived")
        PG.imagecutedControlErase.on('click', function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            PG.targetViewContainer.removeClass("actived")                
            PG.uploadArea.addClass("actived")
        });
        PG.imagecutedControlChange.on('click', function(){
            PG.uploadArea.trigger('click');
        });
    };
    selfObj.movecutterZoom =function(x, zoominicial, width, height){
        selfObj.deslocationPositionZoom=x*(-1)
        selfObj.calcZoomPosition(zoominicial, width, height)
    };
    selfObj.changeSizeImage =function(ratio, width, height){
        width = parseFloat(width)*ratio
        height = parseFloat(height)*ratio
        img1.style.width=width+"px"
        img1.style.height=height+"px"
        img2.style.width=width+"px"
        img2.style.height=height+"px"
        selfObj.widthImg=width
        selfObj.heightImg=height
        selfObj.widthImgAfterZoom=width
        selfObj.heightImgAfterZoom=height
        selfObj.calcPosition();
    };
    selfObj.calcZoomPosition =function(zoominicial, width, height){
        var position = selfObj.positionDefaultZoom-selfObj.deslocationPositionZoom
        var ratio=position/zoominicial
        selfObj.changeSizeImage(ratio, width, height)
        PG.cutterZoomControl[0][0].style.left=position+"px"
    };
    selfObj.calcPosition =function(){
        var widthImg=selfObj.widthImg;
        var heightImg=selfObj.heightImg;
        var widthScreen=window.innerWidth;
        var heightScreen=window.innerHeight
        var widthCutter=selfObj.widthCutter;
        var heightCutter=selfObj.heightCutter;
        if((widthImg>0)&&(heightImg>0)&&(widthScreen>0)&&(heightScreen>0)){
            var fCalc = selfObj.calcMidPosition;
            var iPXB = selfObj.inicialPositionXBackground+selfObj.deslocationPositionXBackground;
            var iPYB = selfObj.inicialPositionYBackground+selfObj.deslocationPositionYBackground;
            var iPXITC = selfObj.inicialPositionXImgToCut+selfObj.deslocationPositionXImgToCut;
            var iPYITC = selfObj.inicialPositionYImgToCut+selfObj.deslocationPositionYImgToCut;
            var relativePositionXBackground=fCalc(widthScreen, widthImg, iPXB);
            var relativePositionYBackground=fCalc(heightScreen, heightImg, iPYB);
            var relativePositionXImgToCut=fCalc(widthCutter, widthImg, iPXITC);
            var relativePositionYImgToCut=fCalc(heightCutter, heightImg, iPYITC);
            PG.panelCutterSizeContainer[0][0].style.left=fCalc(widthScreen, widthCutter, 0)+"px";
            PG.panelCutterSizeContainer[0][0].style.top=fCalc(heightScreen, heightCutter, 0)+"px";
            PG.cutterBackground[0][0].style.left=relativePositionXBackground+"px";
            PG.cutterBackground[0][0].style.top=relativePositionYBackground+"px";
            PG.panelCutterImage[0][0].style.left=relativePositionXImgToCut+"px";
            PG.panelCutterImage[0][0].style.top=relativePositionYImgToCut+"px";
            selfObj.positionXAfterZoom=relativePositionXImgToCut;
            selfObj.positionYAfterZoom=relativePositionYImgToCut;
        };
    };
    selfObj.saveinicialPosition =function(){
        selfObj.inicialPositionXBackground+=selfObj.deslocationPositionXBackground
        selfObj.inicialPositionYBackground+=selfObj.deslocationPositionYBackground
        selfObj.inicialPositionXImgToCut+=selfObj.deslocationPositionXImgToCut
        selfObj.inicialPositionYImgToCut+=selfObj.deslocationPositionYImgToCut
        selfObj.deslocationPositionXBackground=0
        selfObj.deslocationPositionYBackground=0
        selfObj.deslocationPositionXImgToCut=0
        selfObj.deslocationPositionYImgToCut=0
    };
    selfObj.savePositionZoom = function(){
        selfObj.positionDefaultZoom-=selfObj.deslocationPositionZoom
        selfObj.deslocationPositionZoom=0;
    };
    selfObj.setBase64 = function(value){
        selfObj.setBase64=value
    };
    selfObj.activeViewImage = false
    PG.cutterControlView.removeClass("actived")
    PG.cutterShadow.removeClass("actived")
    PG.cutterZoomControl[0][0].style.left=89+"px"
    PG.cutterControlView.on('click', function(){
        selfObj.viewImage();
    });
    PG.cutterControlClose.on('click', function(){
        selfObj.closeImage();
    });
    PG.cutterControlCut.on('click', function(){
        selfObj.cutImage();
    });
    img1.onload = function(){
        imgWidth = this.width
        imgHeight = this.height
        selfObj.widthImg = imgWidth
        selfObj.heightImg = imgHeight
        selfObj.originalWidthImg = imgWidth
        selfObj.originalHeightImg = imgHeight
        selfObj.widthImgAfterZoom = imgWidth
        selfObj.heightImgAfterZoom = imgHeight

        selfObj.widthCutter = parseFloat(PG.cutterSizeX)
        selfObj.heightCutter = parseFloat(PG.cutterSizeY)
        if (PG.error){
            PG.showMessage(PG.messages.invalidImage)
            PG.setTitleButton(PG.config.titleButton)
            PG.error=false
        } else {
            selfObj.calcPosition()
            PG.panelCutterContainer.removeClass("close")
            PG.panelCutterContainer.addClass("actived")

        }
    }
    img1.src=base64data
    img2.src=base64data
    window.addEventListener("resize", function(){
        selfObj.calcPosition()
    });
    PG.cutterPad.on('mousedown', function(event){
        var xInicial = event.clientX;
        var yInicial = event.clientY;
        PG.cutterPad.on('mousemove', function(event){
            var xDeslocamento = event.clientX-xInicial;
            var yDeslocamento = event.clientY-yInicial;
            selfObj.moveImage(xDeslocamento, yDeslocamento)
        });
        PG.cutterPad.on('mouseup', function(event){
            selfObj.saveinicialPosition()
            PG.cutterPad.on('mousemove', '');
            PG.cutterPad.on('mouseleave', '');
        });
        PG.cutterPad.on('mouseleave', function(event){
            selfObj.saveinicialPosition()
            PG.cutterPad.on('mousemove', '');
            PG.cutterPad.on('mouseleave', '');
        });
    });
    PG.cutterZoomControl.on('mousedown', function(event){
        var xInicial = event.clientX;
        var inicialPosition = selfObj.positionDefaultZoom;
        var width = selfObj.widthImg
        var height = selfObj.heightImg
        PG.cutterZoomControl.on('mousemove', function(event){
            var xDeslocamento = event.clientX-xInicial;
            if (((inicialPosition+xDeslocamento)>0)&&(inicialPosition+xDeslocamento)<179){
                selfObj.movecutterZoom(xDeslocamento, inicialPosition, width, height)
            }
        });
        PG.cutterZoomControl.on('mouseup', function(event){
            selfObj.savePositionZoom()
            PG.cutterZoomControl.on('mousemove', '');
            PG.cutterZoomControl.on('mouseleave', '');
        });
        PG.cutterZoomControl.on('mouseleave', function(event){
            selfObj.savePositionZoom()
            PG.cutterZoomControl.on('mousemove', '');
            PG.cutterZoomControl.on('mouseleave', '');
        });
    });
    return selfObj
}
var phanterGallery = new (function(){
    this.phanterGalleryObjs=[]
    this._config = {
            titleButton:"Upload Image",
            titleButtonSend:"Send Image",
            titleButtonProcessing:"Process...",
            titleButtonWaiting:"Waiting...",
            imgButton:"<i class=\"phantersvg upload-cloud\"></i>",
        };
    this._messages = {
            invalidImage:"The image is invalid!",
            nameOfFileLong:"The filename is too long! Please demote before upload",
            fileCouldNotBeUploaded:"File could not be uploaded: %(name_file)s",
        };
    this._callAfterCut = ""
    this.setCallAfterCut = function(script){
        this._callAfterCut = script
        this._update();
    };
    this.config = function(obj){
        for (x in obj) {
                this._config[x]=obj[x]
        }
        this._update();
        return this._config          
    };
    this.messages = function(obj){
        for (y in obj) {
                this._messages[y]=obj[y]
        }
        this._update();
        return this._messages   
    };
    this._update = function(init){
        if (init===false){
            var elements = phanterQuery(".phantergallery_object")[0];
                for (var i = 0; i < elements.length; i++) {
                    var PG = new phanterGalleryObj(elements[i], this._config, this._messages)
                    if(PG.uploadSrcImg!=""){
                        var img = new Image;
                        img.src = PG.uploadSrcImg
                        img.onload = function(){
                            var canvas = PG.targetView[0][0]
                            canvas.width = PG.cutterSizeX
                            canvas.height = PG.cutterSizeY
                            var ctx = canvas.getContext("2d")
                            ctx.drawImage(img, 0, 0)
                            PG.imagecutedControlErase.on('click', function(){
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                PG.targetViewContainer.removeClass("actived")                
                                PG.uploadArea.addClass("actived")
                            });
                            PG.imagecutedControlChange.on('click', function(){
                                PG.uploadArea.trigger('click');
                            });
                        }
                    } 
                    var objArray = this.phanterGalleryObjs
                    objArray.push(PG);
                }
        } else {
            var elements = phanterQuery(".phantergallery_object")[0];
                for (var i = 0; i < elements.length; i++) {
                    var PG = new phanterGalleryObj(elements[i], this._config, this._messages)
                    PG._callAfterCut = this._callAfterCut
                    PG.setImgButton(this._config.imgButton)
                    PG.setTitleButton(this._config.titleButton)
                    phanterSvgs.update()
                    var objArray = this.phanterGalleryObjs
                    objArray.push(PG);
                }
        }
    }
    this._update(true)
    return this
})();

var phanterGalleryAjaxObj = function(url, objectToSend, callback){         
    var xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this);
        } else{
            throw "error in ajax send"
        }
    };
    var imageBlob = ""
    var fd = new FormData();
    for (x in objectToSend){
        if (objectToSend[x] instanceof Blob){
            imageBlob=objectToSend[x]
        } else {
            fd.append(x, objectToSend[x]);
        }
    }
    xhttp.open("POST", url, true);
    xhttp.send(fd,  imageBlob);
}
