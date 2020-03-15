(function($){
	'use strict';
	
	var app = (function appController(){
		return {
			init: function init(){
				this.companyInfo();
				this.initEvents();
				this.getData();
			},

			initEvents: function initEvents(){
				$('[data-js="form-register"]').on('submit', this.handleSubmit);
			},

			handleSubmit: function handleSubmit(e){
				e.preventDefault();
				var car = app.createNewCar();
				if(!app.validatesCar(car.plate)){
					app.postData(car);
				}
				else{
					alert('Veículo já cadastrado');
					app.clearInputs();
				}
			},

			createNewCar: function createNewCar(){
				var car = {
					image: $('[data-js="image"]').get().value,
					brandModel: $('[data-js="brand-model"]').get().value,
					year: $('[data-js="year"]').get().value,
					plate: $('[data-js="plate"]').get().value,
					color: $('[data-js="color"]').get().value
				}
				return car;
			},

			clearInputs: function clearInputs(){
				$('[data-js="image"]').get().value = '';
				$('[data-js="brand-model"]').get().value = '';
				$('[data-js="year"]').get().value = '';
				$('[data-js="plate"]').get().value = '';
				$('[data-js="color"]').get().value = '';
			},

			companyInfo: function companyInfo(){
				var ajax = new XMLHttpRequest();
				ajax.open('GET', '/company.json', true);
				ajax.send();
				ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
			},
			
			postData: function postData(car){
				var ajax = new XMLHttpRequest();
				ajax.open('POST', 'http://localhost:3000/car', true);
				ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				ajax.send('image='+car.image+'&brandModel='+car.brandModel+'&year='+car.year+
					'&plate='+car.plate+'&color='+car.color);
				ajax.addEventListener('readystatechange', app.getData, false);
			},

			getData: function getData(){
				var ajax = new XMLHttpRequest();
				ajax.open('GET', 'http://localhost:3000/car', true);
				ajax.send();
				ajax.addEventListener('readystatechange', app.hasCar, false);
			},

			validatesCar: function validatesCar(plate){
				var $tableCar = $('[data-js="table-car"]').get();
				if($tableCar.childElementCount){
					var $plateExisting = $('tr').element;
					for(var i=1; i<$plateExisting.length; i++){
						if($plateExisting[i].cells[3].innerText == plate){
							return true;
						}
					}
					return false;
				}
			},

			hasCar: function hasCar(){
				if(app.isReady.call(this)){
					var cars = JSON.parse(this.responseText);
					if(cars.length !== 0){
						var $tableCar = $('[data-js="table-car"]').get();
						$tableCar.innerHTML = '';
						
						cars.forEach(function(car){
							var $fragment = app.showCars(car);
							$tableCar.appendChild($fragment);
						});
					}
				}
			},

			showCars: function showCars(car){
				var $fragment = document.createDocumentFragment();
				var $tr = document.createElement('tr');
				var $tdImage = document.createElement('td');
				var $image = document.createElement('img');
				var $tdBrand = document.createElement('td');
				var $tdYear = document.createElement('td');
				var $tdPlate = document.createElement('td');
				var $tdColor = document.createElement('td');
				var $tdRemove = document.createElement('td');
				var $remove = document.createElement('button');

				$image.src = car.image;
				$tdImage.appendChild($image);

				$remove.textContent = 'X';
				$remove.addEventListener('click', function(){
					app.removeData(car.plate);
				}, false);

				$tdBrand.textContent = car.brandModel;
				$tdYear.textContent = car.year;
				$tdPlate.textContent = car.plate;
				$tdColor.textContent = car.color;
				$tdRemove.appendChild($remove);

				$tr.appendChild($tdImage);
				$tr.appendChild($tdBrand);
				$tr.appendChild($tdYear);
				$tr.appendChild($tdPlate);
				$tr.appendChild($tdColor);
				$tr.appendChild($tdRemove);

				app.clearInputs();
				return $fragment.appendChild($tr);
			},

			removeData: function removeData(plate){
				var ajax = new XMLHttpRequest();
				ajax.open('DELETE', 'http://localhost:3000/car', true);
				ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				ajax.send('plate='+plate);
				ajax.addEventListener('readystatechange', app.getData, false);
			},

			getCompanyInfo: function getCompanyInfo(){
				if(!app.isReady.call(this))
					return;

				var data = JSON.parse(this.responseText);
				var $companyName = $('[data-js="company-name"]').get();
				var $companyPhone = $('[data-js="company-phone"]').get();
				$companyName.textContent = data.name;
				$companyPhone.textContent = data.phone;
			},

			isReady: function isReady(){
				return this.readyState === 4 && this.status === 200;
			}
		};
	})();

	app.init();

})(window.DOM);