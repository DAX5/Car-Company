(function($){
	'use strict';

	/*
	Hora de finalizar nosso projeto!

	Já temos o cadastro funcionando e persistindo em memória;
	Já estamos deletando o carro da tabela (no frontend).

	Mas se você perceber, se você recarregar a tela, o carro ainda vai estar lá.
	Agora você precisa fazer com que, ao clicar no botão de deletar, o carro seja
	removido da tabela e também seja deletado do servidor.

	Para fazer isso, você precisa enviar o verbo HTTP "DELETE" para a mesma URL
	que você faz o POST para cadastrar o carro:
	`http://localhost:3000/car`, só que, ao invés de enviar todas as informações
	do carro, como você faz para cadastrar, você deve enviar somente a placa
	do carro.

	Fazendo isso, ao recarregar a tela, a tabela deve mostrar os carros atualizados.

	A lógica do servidor que está criada nesso diretório desse desafio é o mesmo
	do desafio anterior, com a diferença que, nesse desafio, nós temos a
	implementação da regra para a deleção do carro =)

	A regra é a mesma das anteriores: crie uma branch `challenge-33` no seu
	repositório do GitHub, e envie o pull request para lá.

	Depois, envie um pull request no repositório do curso, colocando no console.log
	abaixo a URL do pull request no seu repositório.
	*/

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
				app.postData(car);
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