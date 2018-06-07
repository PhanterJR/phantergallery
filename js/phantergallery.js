message={

}
function verifyFileName(filename){
    var arr_ext=['jpg', 'jpeg', 'bmp', 'gif', 'png']
    var arr_size=filename.split('.').length;
    if (arr_size>1){
        var ext=filename.split('.').pop();
        ext=ext.toLowerCase();
        if (arr_ext.indexOf(ext)<0){
            $("#phantergallery_upload-area-panel-cutter").html("<div style='color:red; text-align: center;'>Probably the file is not valid image.</div>");
            return false
        } else{
            if(filename.length<58){
                $('.phantergallery_titulo_botao_padrao').text('Fazendo Upload');
                return true;
            } else{
                $("#phantergallery_upload-area-panel-cutter").html("<div style='color:red; text-align: center;'>The filename is too long! Please demote before upload.</div>");
                return false;
            }
        }
    } else{
        $("#phantergallery_upload-area-panel-cutter").html("<div style='color:red; text-align: center;'>Probably the file is not valid image.</div>");
        return false
    }
};
function addClass(element, class_name){
	if (!element.classList.contains(class_name)){
		element.classList.add(class_name);
	};
}
function removeClass(element, class_name){
	if (element.classList.contains(class_name)){
		element.classList.remove(class_name);
	};
};
function phantergalleryUpload(element){
	var id_progress = element.attributes['data-upload-area-progress'].value
	var area_progress = document.getElementById(id_progress)
	addClass(area_progress, "actived")
}
var phantergalleryObj=function(el){
	var el = el
}
function phantergalleryInit(){
	var elements = document.getElementsByClassName("phantergallery_container-upload_area");
	for (var i = 0; i < elements.length; i++) {
		var element=elements[i]
		element.onclick = function(){phantergalleryUpload(this)};
	}
}
phantergalleryInit();
