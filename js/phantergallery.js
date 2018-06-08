

var phanterGalleryObj=function(elementPhanterGalleryObj, config){
	var el = elementPhanterGalleryObj
	var obj = {
		el:el,
		uploadArea: phanterQuery("#"+el.dataset["object"]),
		uploadFormContainer: phanterQuery("#"+el.dataset["uploadFormContainer"]),
		uploadInput: phanterQuery("#"+el.dataset["uploadInput"]),
		uploadAreaPanelCutter: phanterQuery("#"+el.dataset["uploadAreaPanelCutter"]),
		uploadAreaTargetView: phanterQuery("#"+el.dataset["uploadAreaTargetView"]),
		uploadMessages: phanterQuery("#"+el.dataset["uploadMessages"]),
		uploadAreaProgress: phanterQuery("#"+el.dataset["uploadAreaProgress"]),
		uploadImageButton: phanterQuery("#"+el.dataset["uploadImageButton"]),
		uploadTitleButton: phanterQuery("#"+el.dataset["uploadTitleButton"]),
		config: config,
		showProgress: function(){
			this.uploadAreaProgress.addClass("actived");
			return this
		},
		hideProgress: function(){
			this.uploadAreaProgress.removeClass("actived");
			return this
		},
		showMessage: function(message){
			this.uploadMessages.html(message);
			this.uploadMessages.addClass("actived");
			return this
		},
		hideMessage: function(){
			this.uploadMessages.html("");
			this.uploadMessages.removeClass("actived");
			return this
		},
		click: function(){
			console.log(this.uploadInput)
			this.uploadInput.trigger('click')
			return this
		},
		setImgButton:function(img){
			this.uploadImageButton.html(img);
			return this
		},
		setTitleButton: function(title){
			this.uploadTitleButton.html(title);
			return this
		},
		inputChange: function(){
			this.showProgress();
            var blob = this.uploadInput[0][0].files;
            var fileslength = blob.length;
            for (var i = fileslength - 1; i >= 0; i--) {
                var img_type = blob[i]['type'];
                var img_name= blob[i]['name'];
                if (img_type=="image/png"||img_type=="image/bmp"||img_type=="image/gif"||img_type=="image/jpeg"){
	                if(img_name.length<50){
	                    this.setTitleButton(this.config.titleButtonProcessing)
	                    var reader = new FileReader();
	                    console.log(blob)
	                    reader.readAsDataURL(blob[0])
	                    var el = this.uploadAreaTargetView
	                    el.html("")
	                    var width = 0;
	                    reader.onloadend = function(){
	                    	base64data = reader.result;
	                    	console.log(base64data);
	                    	var img=document.createElement("IMG");
	                    	img.onloadend = function(){
	                    		console.log([this.width, this.height])
	                    		return [this.width, this.height]
	                    	}
	                    	img.src=base64data
	                    	console.log(img)
	                    	el[0][0].appendChild(img)

	                    }
	                } else {
	                	var message = this.config.messages.nameOfFileLong
	                    this.showMessage(message);
	                };
                } else{
                	var message = this.config.messages.FileCouldNotBeUploaded.replace("%(name_file)s", img_name);
                    throw message
                    this.showMessage(message);
                }
            }
			console.log(this.uploadInput)
			return this
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

var initPhanterGallery = function(){
	var obj_phanterGallery={
		config:{
			messages:{
				nameOfFileLong:"The filename is too long! Please demote before upload",
				FileCouldNotBeUploaded:"File could not be uploaded: %(name_file)s",
			},
			titleButton:"Upload Image",
			titleButtonSend:"Send Image",
			titleButtonProcessing:"Process...",
			imgButton:"<i class=\"phantersvg upload\"></i>",
		},
		update: function(){
			var elements = phanterQuery(".phantergallery_object")[0];
			for (var i = 0; i < elements.length; i++) {
				var element=phanterGalleryObj(elements[i], this.config)
			}			
		}
	}
	obj_phanterGallery.update()
	return obj_phanterGallery
}
var phanterGallery = initPhanterGallery()
