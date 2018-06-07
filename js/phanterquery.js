var phanterQuery=function(seletor){
	var cm_car=['.', '\\', '#', '*', ',', '>', '+', '~', '[', ']', '=', '|', '^', '"', '$', ':', '(', ')'];
	
	var isID = seletor.startsWith("#");
	var isClass = seletor.startsWith(".");
	var hasCm_car = false;
	var hasSp_car = false;
	if (isID||isClass){
		for (var i = 0; i < cm_car.length; i++) {
			if (cm_car[i]==":"){
				if (seletor.slice(1).indexOf(cm_car[i])>=0){
					hasCm_car = true;
					hasSp_car = true;
				}
			} else if (cm_car[i]=="\\"){
				if (seletor.slice(1).indexOf(cm_car[i])>=0){
					hasCm_car = true;
					hasSp_car = true;
				}
			} else if (seletor.slice(1).indexOf(cm_car[i])>=0){
				hasCm_car = true;
			};
		};
	};
	var elements = undefined
	if (isID&&!hasCm_car){
		var result = document.getElementById(seletor.slice(1))
		if(result!=null){
			elements = [result]
		}
	} else if (isClass&&!hasCm_car){
		var result = document.getElementsByClassName(seletor.slice(1))
		if(result.length!=0){
			elements = result		
		}
	} else {
		if (hasSp_car){
			var transform="";
			for (var i = 0; i < seletor.length; i++) {
				if (seletor[i]==":"){
					transform=transform+"\\:"
				} else if (seletor[i]=="\\"){
					transform=transform+"\\\\"
				} else {
					transform=transform+seletor[i];
				};
			};
			seletor=transform
		}
		result = document.querySelectorAll(seletor)
		if(result.length!=0){
			elements = result		
		}
	}
	var phanterQueryElements=[]
	if (elements!=undefined){
		for (var i = 0; i < elements.length; i++) {
			phanterQueryElements.push(elements[i])
		}
	}
	var obj_result={
		0:phanterQueryElements, 
		seletor:seletor, 
		length:phanterQueryElements.length,
		on: function(comand, callback){
			for (var i = 0; i < this.length; i++) {
				var el=this[0][i];
				var comands={
					click: function(){console.log(el); console.log(callback); el.onclick = callback},
				};
				comands[comand](el, callback);
			};
			return this			
		},
		addClass: function(class_name){
			for (var i = 0; i < this.length; i++) {
				el=this[0][i];
				if (!el.classList.contains(class_name)){
					el.classList.add(class_name);
				};				

			};				
			return this
		},
		removeClass: function(class_name){
			for (var i = 0; i < this.length; i++) {
				el=this[0][i];
				if (el.classList.contains(class_name)){
					el.classList.remove(class_name);
				};
			};				
			return this
		},
		html: function(html){
			for (var i = 0; i < this.length; i++) {
				el=this[0][i];
				el.innerHTML = html
			};				
			return this
		}
	}
	return obj_result
};
