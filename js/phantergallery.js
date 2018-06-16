
var phanterGalleryObj = function(elementPhanterGalleryObj, config, messages){
    var el = elementPhanterGalleryObj
    var obj = {
        el:el,
        imageName: "",
        imageType: "",
        uploadArea: phanterQuery("#"+el.dataset["object"]),
        uploadFormContainer: phanterQuery("#"+el.dataset["uploadFormContainer"]),
        uploadInput: phanterQuery("#"+el.dataset["uploadInput"]),
        panelCutterContainer: phanterQuery("#"+el.dataset["panelCutterContainer"]),
        cutterShadow: phanterQuery("#"+el.dataset["cutterShadow"]),
        cutterControlClose: phanterQuery("#"+el.dataset["cutterControlClose"]),
        cutterControlView: phanterQuery("#"+el.dataset["cutterControlView"]),
        cutterControlCut: phanterQuery("#"+el.dataset["cutterControlCut"]),
        cutterPad: phanterQuery("#"+el.dataset["cutterPad"]),
        cutterBackground: phanterQuery("#"+el.dataset["cutterBackground"]),
        cutterZoomControl: phanterQuery("#"+el.dataset["cutterZoomControl"]),
        panelCutterSizeContainer: phanterQuery("#"+el.dataset["panelCutterSizeContainer"]),
        panelCutterImage: phanterQuery("#"+el.dataset["panelCutterImage"]),
        targetView: phanterQuery("#"+el.dataset["targetView"]),
        uploadMessages: phanterQuery("#"+el.dataset["uploadMessages"]),
        uploadAreaProgress: phanterQuery("#"+el.dataset["uploadAreaProgress"]),
        uploadImageButton: phanterQuery("#"+el.dataset["uploadImageButton"]),
        uploadTitleButton: phanterQuery("#"+el.dataset["uploadTitleButton"]),
        cutterSizeX: el.dataset["cutterSizeX"],
        cutterSizeY: el.dataset["cutterSizeY"],
        uploadUrl: el.dataset["uploadUrl"],
        config: config,
        messages:messages,
        phanterGalleryCutterObj: undefined,
        error:false,
        showProgress: function(){
            var MainObj = this
            MainObj.uploadAreaProgress.addClass("actived");
            return MainObj
        },
        hideProgress: function(){
            var MainObj = this
            MainObj.uploadAreaProgress.removeClass("actived");
            return MainObj
        },
        showMessage: function(message){
            var MainObj = this
            MainObj.uploadMessages.html(message);
            MainObj.uploadMessages.addClass("actived");
            return MainObj
        },
        hideMessage: function(){
            var MainObj = this
            MainObj.uploadMessages.html("");
            MainObj.uploadMessages.removeClass("actived");
            return MainObj
        },
        click: function(){
            var MainObj = this
            MainObj.setTitleButton(MainObj.config.titleButtonWaiting)
            MainObj.uploadInput.trigger('click')
            return MainObj
        },
        setImgButton:function(img){
            var MainObj = this
            MainObj.uploadImageButton.html(img);
            return MainObj
        },
        setTitleButton: function(title){
            var MainObj = this
            MainObj.uploadTitleButton.html(title);
            return MainObj
        },
        inputChange: function(){
            var MainObj = this
            MainObj.showProgress();
            var blob = MainObj.uploadInput[0][0].files;
            console.log(blob)
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
            //console.log(this.uploadInput)
            return MainObj
        },

    };
    obj.el=elementPhanterGalleryObj
    obj.uploadInput.on('change', function(){
        obj.inputChange();
    });
    obj.el.onclick = function(){
        obj.hideProgress();
        obj.hideMessage();
        obj.click();
    };

    return obj
}
var phanterGalleryCutterObj = function(base64data, MainObj){
    var MainObj=MainObj
    var base64data=base64data
    var img1=document.createElement("IMG");
    var img2=document.createElement("IMG");
    img1.src=base64data
    img2.src=base64data
    img1.onerror = function(){
        MainObj.error=true;
        throw "invalid image!"
    }
    MainObj.panelCutterImage.html("");
    MainObj.cutterBackground.html("");
    MainObj.panelCutterImage[0][0].appendChild(img1)
    MainObj.cutterBackground[0][0].appendChild(img2)
    var obj = {
        base64data:base64data,
        widthImg:0,
        heightImg:0,
        widthScreen:0,
        heightScreen:0,
        widthCutter:0,
        heightCutter:0,
        inicialPositionXBackground:0,
        inicialPositionYBackground:0,
        inicialPositionXImgToCut:0,
        inicialPositionYImgToCut:0, 
        deslocationPositionXBackground:0,
        deslocationPositionYBackground:0,
        deslocationPositionXImgToCut:0,
        deslocationPositionYImgToCut:0,
        deslocationPositionZoom:0,
        positionDefaultZoom:89.0,
        widthImgAfterZoom:0,
        heightImgAfterZoom:0,
        positionXAfterZoom:0,
        positionYAfterZoom:0,
        activeViewImage:false,
        calcMidPosition:function(sizeContainer, sizeContent, positionContent){
            var midsize1=sizeContainer/2.0
            var midsize2=sizeContent/2.0
            var relativeposition=midsize1-midsize2
            var finalPosition=relativeposition-positionContent
            return finalPosition
        },
        moveImage:function(x,y){
            var slaveObj=this;
            slaveObj.deslocationPositionXBackground=x*(-1)
            slaveObj.deslocationPositionYBackground=y*(-1)
            slaveObj.deslocationPositionXImgToCut=x*(-1)
            slaveObj.deslocationPositionYImgToCut=y*(-1)
            slaveObj.calcPosition()
        },
        viewImage:function(){
            var slaveObj=this;
            if (slaveObj.activeViewImage){
                slaveObj.activeViewImage=false
                MainObj.cutterControlView.removeClass("actived")
                MainObj.cutterShadow.removeClass("actived")
            } else{
                slaveObj.activeViewImage=true
                MainObj.cutterControlView.addClass("actived")
                MainObj.cutterShadow.addClass("actived")
            };
        },
        closeImage: function(){
            var slaveObj=this;
            MainObj.panelCutterContainer.removeClass("actived")
            MainObj.setTitleButton(MainObj.config.titleButton)
            MainObj.panelCutterContainer.addClass("close")
        },
        cutImage: function(){
            var slaveObj=this;
            var url = MainObj.uploadUrl
            var xhttp;
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    callback(this);
                } else{
                    console.log(this)
                }
            };
            var fd = new FormData();
            fd.append("imageBytes", MainObj.imageBlob);
            fd.append("imageName", MainObj.imageName);
            fd.append("imageType", MainObj.imageType);
            fd.append("cutterSizeX", MainObj.cutterSizeX);
            fd.append("cutterSizeY", MainObj.cutterSizeY);
            fd.append("positionX", slaveObj.positionXAfterZoom);
            fd.append("positionY", slaveObj.positionYAfterZoom);
            fd.append("newSizeX", slaveObj.widthImgAfterZoom);
            fd.append("newSizeY", slaveObj.heightImgAfterZoom);
            xhttp.open("POST", url, true);
            xhttp.send(fd,  MainObj.imageBlob);
        },
        movecutterZoom:function(x, zoominicial, width, height){
            var slaveObj=this;
            slaveObj.deslocationPositionZoom=x*(-1)
            slaveObj.calcZoomPosition(zoominicial, width, height)
        },
        changeSizeImage:function(ratio, width, height){
            var slaveObj=this;
            width = parseFloat(width)*ratio
            height =  parseFloat(height)*ratio
            img1.style.width=width+"px"
            img1.style.height=height+"px"
            img2.style.width=width+"px"
            img2.style.height=height+"px"
            slaveObj.widthImg=width
            slaveObj.heightImg=height
            slaveObj.widthImgAfterZoom=width
            slaveObj.heightImgAfterZoom=height
            slaveObj.calcPosition();
        },
        calcZoomPosition:function(zoominicial, width, height){
            var slaveObj=this;
            var position = slaveObj.positionDefaultZoom-slaveObj.deslocationPositionZoom
            var ratio=position/zoominicial
            slaveObj.changeSizeImage(ratio, width, height)
            MainObj.cutterZoomControl[0][0].style.left=position+"px"
        },
        calcPosition:function(){
            var slaveObj=this;
            var widthImg=slaveObj.widthImg;
            var heightImg=slaveObj.heightImg;
            console.log("x:"+widthImg+" y:"+heightImg)
            var widthScreen=window.innerWidth;
            var heightScreen=window.innerHeight
            var widthCutter=slaveObj.widthCutter;
            var heightCutter=slaveObj.heightCutter;
            if(widthImg>0&&heightImg>0&&widthScreen>0&&heightScreen>0){
                let f=slaveObj.calcMidPosition
                let iPXB = slaveObj.inicialPositionXBackground+slaveObj.deslocationPositionXBackground
                let iPYB = slaveObj.inicialPositionYBackground+slaveObj.deslocationPositionYBackground
                let iPXITC = slaveObj.inicialPositionXImgToCut+slaveObj.deslocationPositionXImgToCut
                let iPYITC = slaveObj.inicialPositionYImgToCut+slaveObj.deslocationPositionYImgToCut
                var relativePositionXBackground=f(widthScreen, widthImg, iPXB);
                var relativePositionYBackground=f(heightScreen, heightImg, iPYB);
                var relativePositionXImgToCut=f(widthCutter, widthImg, iPXITC);
                var relativePositionYImgToCut=f(heightCutter, heightImg, iPYITC);
                MainObj.panelCutterSizeContainer[0][0].style.left=f(widthScreen, widthCutter, 0)+"px";
                MainObj.panelCutterSizeContainer[0][0].style.top=f(heightScreen, heightCutter, 0)+"px";
                MainObj.cutterBackground[0][0].style.left=relativePositionXBackground+"px"
                MainObj.cutterBackground[0][0].style.top=relativePositionYBackground+"px"
                MainObj.panelCutterImage[0][0].style.left=relativePositionXImgToCut+"px"
                MainObj.panelCutterImage[0][0].style.top=relativePositionYImgToCut+"px"
                slaveObj.positionXAfterZoom=relativePositionXImgToCut
                slaveObj.positionYAfterZoom=relativePositionYImgToCut
            };
        },
        saveinicialPosition:function(){
            var slaveObj=this;
            slaveObj.inicialPositionXBackground+=slaveObj.deslocationPositionXBackground
            slaveObj.inicialPositionYBackground+=slaveObj.deslocationPositionYBackground
            slaveObj.inicialPositionXImgToCut+=slaveObj.deslocationPositionXImgToCut
            slaveObj.inicialPositionYImgToCut+=slaveObj.deslocationPositionYImgToCut
            slaveObj.deslocationPositionXBackground=0
            slaveObj.deslocationPositionYBackground=0
            slaveObj.deslocationPositionXImgToCut=0
            slaveObj.deslocationPositionYImgToCut=0
        },
        savePositionZoom: function(){
            var slaveObj=this;
            slaveObj.positionDefaultZoom-=slaveObj.deslocationPositionZoom
            slaveObj.deslocationPositionZoom=0;
        },
        setBase64: function(value){
            var slaveObj = this
            slaveObj.setBase64=value
        }
    }
    obj.activeViewImage=false
    MainObj.cutterControlView.removeClass("actived")
    MainObj.cutterShadow.removeClass("actived")
    MainObj.cutterZoomControl[0][0].style.left=89+"px"
    MainObj.cutterControlView.on('click', function(){
        obj.viewImage();
    });
    MainObj.cutterControlClose.on('click', function(){
        obj.closeImage();
    });
    MainObj.cutterControlCut.on('click', function(){
        console.log('clicado')
        obj.cutImage();
    });
    img1.onloadend = function(){
        imgWidth = this.width
        imgHeight = this.height
        console.log(MainObj.error)
        obj.widthImg = imgWidth
        obj.heightImg = imgHeight
        obj.widthImgAfterZoom = imgWidth
        obj.heightImgAfterZoom = imgHeight

        obj.widthCutter = parseFloat(MainObj.cutterSizeX)
        obj.heightCutter = parseFloat(MainObj.cutterSizeY)
        if (MainObj.error){
            MainObj.showMessage(MainObj.messages.invalidImage)
            MainObj.setTitleButton(MainObj.config.titleButton)
            MainObj.error=false
        } else {
            obj.calcPosition()
            MainObj.panelCutterContainer.removeClass("close")
            MainObj.panelCutterContainer.addClass("actived")

        }
    }
    window.addEventListener("resize", function(){
        obj.calcPosition()
    });
    MainObj.cutterPad.on('mousedown', function(event){
        var xInicial = event.clientX;
        var yInicial = event.clientY;
        MainObj.cutterPad.on('mousemove', function(event){
            var xDeslocamento = event.clientX-xInicial;
            var yDeslocamento = event.clientY-yInicial;
            obj.moveImage(xDeslocamento, yDeslocamento)
        });
        MainObj.cutterPad.on('mouseup', function(event){
            obj.saveinicialPosition()
            MainObj.cutterPad.on('mousemove', '');
            MainObj.cutterPad.on('mouseleave', '');
        });
        MainObj.cutterPad.on('mouseleave', function(event){
            obj.saveinicialPosition()
            MainObj.cutterPad.on('mousemove', '');
            MainObj.cutterPad.on('mouseleave', '');
        });
    });
    MainObj.cutterZoomControl.on('mousedown', function(event){
        var xInicial = event.clientX;
        var inicialPosition = obj.positionDefaultZoom;
        var width = obj.widthImg
        var height = obj.heightImg
        MainObj.cutterZoomControl.on('mousemove', function(event){
            var xDeslocamento = event.clientX-xInicial;
            if (((inicialPosition+xDeslocamento)>0)&&(inicialPosition+xDeslocamento)<179){
                obj.movecutterZoom(xDeslocamento, inicialPosition, width, height)
            }
        });
        MainObj.cutterZoomControl.on('mouseup', function(event){
            obj.savePositionZoom()
            MainObj.cutterZoomControl.on('mousemove', '');
            MainObj.cutterZoomControl.on('mouseleave', '');
        });
        MainObj.cutterZoomControl.on('mouseleave', function(event){
            obj.savePositionZoom()
            MainObj.cutterZoomControl.on('mousemove', '');
            MainObj.cutterZoomControl.on('mouseleave', '');
        });
    });
    return obj
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
    this._update = function(init=false){
        if (init){
            var elements = phanterQuery(".phantergallery_object")[0];
                for (var i = 0; i < elements.length; i++) {
                    var PG = new phanterGalleryObj(elements[i], this._config, this._messages)
                    var objArray = this.phanterGalleryObjs
                    objArray.push(PG);
                }
        } else {
            var elements = phanterQuery(".phantergallery_object")[0];
                for (var i = 0; i < elements.length; i++) {
                    var PG = new phanterGalleryObj(elements[i], this._config, this._messages)
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


