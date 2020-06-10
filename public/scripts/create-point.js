function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]");
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados") //buscar recursos de forma assíncrona através da rede.
    .then( res => res.json())
    .then(states => { //res => função anonima
        for(const state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`; //interpolar com o valor do objeto para pegar o "dado" necessario
        }  
    });
}

populateUFs();

function getCities(event){
    const citySelect = document.querySelector("select[name=city]");
    const stateInput = document.querySelector("input[name=state]");
    const ufValue = event.target.value;
    const indexOfSelectedState = event.target.selectedIndex; //guarda a posicao da selecao (estados)
    stateInput.value = event.target.options[indexOfSelectedState].text; //atualiza o hidden dinamicamente
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>";
    citySelect.disabled = true;
    fetch(url)
    .then(res => res.json())
    .then(cities => { //res => função anonima
        for(const city of cities){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`; //interpolar com o valor do objeto para pegar o "dado" necessario
        }  
        citySelect.disabled = false;
    });
}

document.querySelector("select[name=uf]").addEventListener("change", getCities); //sem parenteses por referencia

const itemsToCollect = document.querySelectorAll(".itens-grid li");
for(const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem); //callback function
}

const collectedItems = document.querySelector("input[name=items]");

let selectedItems = [];

function handleSelectedItem(event){
    const itemLi = event.target;
    itemLi.classList.toggle("selected"); //toggle adicionar ou remover a classe (aplicar o estilo)
    const itemId = itemLi.dataset.id; //pega o valor que foi definido no html data-id="1"
    
    //verifica se existe itens selecionados, se sim, pegar os itens
    const alreadySelected = selectedItems.findIndex(item => { //pode ser reduzido selectedItems.findIndex(item => item == itemId);
        const itemFound = item == itemId; //retorna true ou false
        return itemFound;
    });
    
    //se ja tiver selecionado tira da selecao
    if(alreadySelected >= 0){
        const filteredItems = selectedItems.filter(item => { //filter adiciona e remove ao novo array
            const itemIsDifferent = item != itemId;
            return itemIsDifferent;
        });
        selectedItems = filteredItems;
    } else { //se nao estiver selecionado, adicionar
        selectedItems.push(itemId);
    }
    collectedItems.value = selectedItems;
}

//filter() chama a função callback fornecida, uma vez para cada elemento do array, e constrói um novo array 
//com todos os valores para os quais o callback retornou o valor true ou  um valor que seja convertido para true.

//O exemplos a seguir usam filter() para criar um array filtrado em que todos os elementos com valores 
//menores que 10 são removidos.

//function isBigEnough(value) {
//    return value >= 10;
//  }
//  var filtered = [12, 5, 8, 130, 44].filter(isBigEnough);
  // filtered is [12, 130, 44]