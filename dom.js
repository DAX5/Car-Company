(function(win, doc){
	'use strict';

	function DOM(elements){
		if(!(this instanceof DOM))
			return new DOM(elements);

		this.element = doc.querySelectorAll(elements);

		this.is = function is(content){
			return Object.prototype.toString.call(content);
		}
	}

	DOM.prototype.on = function on(eventType, callback){
		Array.prototype.forEach.call(this.element, function(element){
			element.addEventListener(eventType, callback, false);
		});
	}

	DOM.prototype.off = function off(eventType, callback){
		Array.prototype.forEach.call(this.element, function(element){
			element.removeEventListener(eventType, callback, false);
		});
	}

	DOM.prototype.get = function get(index){
		if(!index)
			return this.element[0];
		return this.element[index];
	}

	DOM.prototype.arrayMethods = function arrayMethods(met, func){
		switch(met){
			case 'forEach': return Array.prototype.forEach.call(this.element, func);
			case 'map': return Array.prototype.map.call(this.element, func);
			case 'filter': return Array.prototype.filter.call(this.element, func);			
			case 'reduce': return Array.prototype.reduce.call(this.element, func, '');
			case 'reduceRight': return Array.prototype.reduceRight.call(this.element, func, '');
			case 'every': return Array.prototype.every.call(this.element, func);
			case 'some': return Array.prototype.some.call(this.element, func);
		}
	}

	DOM.objectMethods = function objectMethods(conteudo, type){
		return Object.prototype.toString.call(conteudo) === '[object '+type+']';
	}

	DOM.isNull = function isNull(content){
		return Object.prototype.toString.call(content) === '[object Undefined]' ||
			Object.prototype.toString.call(content) === '[object Null]'
	}

	window.DOM = DOM;

})(window, document);