const api = 'https://api.coingecko.com/api/v3/exchange_rates'

const input = document.getElementById("searchValue")
const select = document.getElementById('searchItens')
const buttonSearch = document.getElementById('searchName')

const nameCripto = document.getElementById('nameCripto')
const simboloCripto = document.getElementById('simboloCripto')
const unit = document.getElementById('unit')
const price = document.getElementById('value')

async function rates(){

    const resolve = await fetch(api)
    const data = await resolve.json()

    const rates = data.rates
    const precoBTC = rates.brl.value
    
    const criptos = Object.keys(rates).map((key) => {
        return {
            name: `${rates[key].name} (${key.toUpperCase()})`, 
            value: (precoBTC / rates[key].value).toFixed(6),
            unit: rates[key].unit
        }
    })
    
    return criptos
        
}

function limparFilhos(elemento){
    while(elemento.firstChild){
        elemento.removeChild(elemento.firstChild)
    }
}

async function searchName (value) {

    let fail = true
    const criptos = await rates()

    // limpa o select
    limparFilhos(select)
    
    criptos.forEach((valor, index, array) => { 
        if(criptos[index].name.toUpperCase().includes(value.toUpperCase())){
            let option = document.createElement('option')
            option.append(criptos[index].name)
            select.append(option)
            //console.log(criptos[index].name)
            fail = false
        }
    })

    if(fail){
        let option = document.createElement('option')
        limparFilhos(select)
        option.append("Moeda não encontrada")
        select.append(option)
    }

}

async function searchCripto (name) {

    const criptos = await rates()

    const cripto = criptos.filter((valor, index, array) => {
        return criptos[index].name == name
    })

    const nome = cripto[0].name.split(' (')

    nameCripto.innerHTML = nome[0] + "&nbsp"
    simboloCripto.textContent = "(" + nome[1]
    unit.innerHTML = cripto[0].unit
    price.textContent = cripto[0].value

    document.title = `Cripto Price - ${cripto[0].name}`

}


input.addEventListener("input", () => {
    searchName(input.value)
})

buttonSearch.addEventListener('click', () => {
    searchCripto(select.value)
})

input.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
        searchCripto(select.value) 
    }
})