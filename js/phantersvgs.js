var phanterSvgs={
	icons:{
		upload:'<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="50px" height="50px" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 50 50" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path class="phantergallery-icone-upload phantergallery-cinza" d="M30.2258 49.0363l0 -11.8596 4.44725 0 -8.8945 -11.8596 -8.89475 11.8596 4.44728 0 0 11.8596 8.89473 0zm-18.535 -15.7406c2.02332,0 3.90212,-0.5159 5.46185,-1.39878 0.114775,0.069675 0.230575,0.1386 0.348075,0.205325l8.27778 -11.0371 9.2794 12.3725 0.2134 0.0017c7.86005,0 14.234,-5.3431 14.234,-11.9314 0,-6.58833 -6.3739,-11.9314 -14.234,-11.9314 -0.340475,0 -0.678775,0.011275 -1.01312,0.030875 -2.08735,-3.91418 -6.77255,-6.6435 -12.2172,-6.6435 -7.38657,0 -13.3766,5.02128 -13.3766,11.2127 0,1.04283 0.171725,2.05325 0.48965,3.01145 -4.16808,0.936825 -7.2384,4.1249 -7.2384,7.91372 0,4.52453 4.37732,8.1939 9.77518,8.1939z"></path></g></svg>',

	},
	setIcon:function(name, svg){
		this.icons[name]=svg;
		this.update();
	},
	getIcon:function(name){
		return this.icons[name]
	},
	getClassName:function(name){
		hasName=false;
		for (var key in this.icons) {
			if(name==key){
				hasName=true
			}
		};
		if (hasName){
			return ".phantersvg."+name
		} else {
			throw "phantersvgs: there is no icon named '"+name+"'"
		};
	},
	update:function(){
		for (var key in this.icons) {
			phanterQuery(".phantersvg."+key).html(this.icons[key])
		};	
	}
}
phanterSvgs.update()