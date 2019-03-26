(function($){
	'use strict';

	/*
	Já temos as funcionalidades de adicionar e remover um carro. Agora, vamos persistir esses dados, 
	salvando-os temporariamente na memória de um servidor.
	Nesse diretório do `challenge-32` tem uma pasta `server`. É um servidor simples, em NodeJS, para 
	que possamos utilizar para salvar as informações dos nossos carros.
	Para utilizá-lo, você vai precisar fazer o seguinte:
	- Via terminal, acesse o diretório `server`;
	- execute o comando `npm install` para instalar as dependências;
	- execute `node app.js` para iniciar o servidor.
	Ele irá ser executado na porta 3000, que pode ser acessada via browser no endereço: 
	`http://localhost:3000`
	O seu projeto não precisa estar rodando junto com o servidor. Ele pode estar em outra porta.
	As mudanças que você irá precisar fazer no seu projeto são:
	- Para listar os carros cadastrados ao carregar o seu projeto, faça um request GET no endereço
	`http://localhost:3000/car`
	- Para cadastrar um novo carro, faça um POST no endereço `http://localhost:3000/car`, enviando
	os seguintes campos:
	  - `image` com a URL da imagem do carro;
	  - `brandModel`, com a marca e modelo do carro;
	  - `year`, com o ano do carro;
	  - `plate`, com a placa do carro;
	  - `color`, com a cor do carro.
	Após enviar o POST, faça um GET no `server` e atualize a tabela para mostrar o novo carro cadastrado.
	Crie uma branch `challenge-32` no seu projeto, envie um pull request lá e cole nesse arquivo a URL
	do pull request.
	*/

	var app = (function appController(){
		return {
			init: function init(){
				this.companyInfo();
				this.initEvents();
				this.postData();
				this.getData();
			},

			initEvents: function initEvents(){
				$('[data-js="form-register"]').on('submit', this.handleSubmit);
			},

			removeCar: function removeCar(id, table){
				Array.prototype.forEach.call(table.childNodes, function(item){
					if(item.id === id){
						item.remove();
					}
				});
			},

			handleSubmit: function handleSubmit(e){
				e.preventDefault();
				var $tableCar = $('[data-js="table-car"]').get();
				$tableCar.appendChild(app.createNewCar());
				var idButton = app.getIdButtonRemove($tableCar);

				var $buttonRemove = $('button[id="'+idButton+'"]');
				$buttonRemove.on('click', function(){
					app.removeCar(this.id, $tableCar);
				});
			},

			getIdButtonRemove: function getIdButtonRemove(table){
				var id = (table.childNodes.length)-1;
				table.lastChild.setAttribute('id', id);
				table.lastChild.childNodes[5].childNodes[0].setAttribute('id', id);
				return id;
			},

			createNewCar: function createNewCar(){
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

				$image.src = $('[data-js="image"]').get().value;
				$tdImage.appendChild($image);

				$remove.innerHTML = 'X';
				$remove.setAttribute('data-js', 'remove');

				$tdBrand.textContent = $('[data-js="brand-model"]').get().value;
				$tdYear.textContent = $('[data-js="year"]').get().value;
				$tdPlate.textContent = $('[data-js="plate"]').get().value;
				$tdColor.textContent = $('[data-js="color"]').get().value;
				$tdRemove.appendChild($remove);

				$tr.appendChild($tdImage);
				$tr.appendChild($tdBrand);
				$tr.appendChild($tdYear);
				$tr.appendChild($tdPlate);
				$tr.appendChild($tdColor);
				$tr.appendChild($tdRemove);

				//app.cleanInputs();
				return $fragment.appendChild($tr);
			},

			cleanInputs: function cleanInputs(){
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
			
			postData: function postData(){
				var ajax = new XMLHttpRequest();
				ajax.open('POST', 'http://localhost:3000/car', true);
				ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				ajax.send('brandModel=uno&year=2006&plate=hax8166&color=azul');
				ajax.addEventListener('readystatechange', function(){
					console.log('post com sucesso');
				});
			},

			getData: function getData(){
				var ajax = new XMLHttpRequest();
				ajax.open('GET', 'http://localhost:3000/car', true);
				ajax.send();
				ajax.addEventListener('readystatechange', this.showCar, false);
			},

			showCar: function showCar(){
				if(this.readyState === 4){
					console.log(JSON.parse(this.responseText));
				}
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