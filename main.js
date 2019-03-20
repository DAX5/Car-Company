(function($){
	'use strict';

	/*
	Agora vamos criar a funcionali dade de "remover" um carro. Adicione uma nova
	coluna na tabela, com um botão de remover.
	Ao clicar nesse botão, a linha da tabela deve ser removi da.
	Faça um pull request no seu repositório, na branch `challenge-31`, e cole
	o link do pull request no `console.log` abaixo.
	Faça um pull request, também com a branch `challenge-31`, mas no repositório
	do curso, para colar o link do pull request do seu repo.
	*/

	var app = (function appController(){
		return {
			init: function init(){
				this.companyInfo();
				this.initEvents();
			},

			initEvents: function initEvents(){
				$('[data-js="form-register"]').on('submit', this.handleSubmit);
			},

			handleSubmit: function handleSubmit(e){
				e.preventDefault();
				var $tableCar = $('[data-js="table-car"]').get();
				var index = app.getIndexTr($tableCar);
				$tableCar.appendChild(app.createNewCar(index));

				var $buttonRemove = $('button[id="'+index+'"]');
				$buttonRemove.on('click', function(){
					app.removeCar(this.id, $tableCar);
				});
			},

			getIndexTr: function getIndexTr(table){
				var index = 0;
				if(table.lastChild)
					index = Number(table.lastChild.id) +1;
				return index;
			},

			createNewCar: function createNewCar(index){
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

				$tr.setAttribute('id', index);

				$image.src = $('[data-js="image"]').get().value;
				$tdImage.appendChild($image);

				$tdBrand.textContent = $('[data-js="brand-model"]').get().value;
				$tdYear.textContent = $('[data-js="year"]').get().value;
				$tdPlate.textContent = $('[data-js="plate"]').get().value;
				$tdColor.textContent = $('[data-js="color"]').get().value;

				$remove.innerHTML = 'X';
				$remove.setAttribute('data-js', 'remove');
				$remove.setAttribute('id', index);
				$tdRemove.appendChild($remove);

				$tr.appendChild($tdImage);
				$tr.appendChild($tdBrand);
				$tr.appendChild($tdYear);
				$tr.appendChild($tdPlate);
				$tr.appendChild($tdColor);
				$tr.appendChild($tdRemove);

				return $fragment.appendChild($tr);
			},

			removeCar: function removeCar(index, table){
				Array.prototype.forEach.call(table.childNodes, function(item){
					if(item.id === index){
						item.remove();
					}
				});
			},

			companyInfo: function companyInfo(){
				var ajax = new XMLHttpRequest();
				ajax.open('GET', '/company.json', true);
				ajax.send();
				ajax.addEventListener('readystatechange', this.getCompanyInfo, false);

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