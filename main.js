document.addEventListener("DOMContentLoaded", () => {
    
    fetch("fut.php?q=rarities")
        .then(res => res.json())
        .then(data => { 
            console.log(data)
        })

    // VARS
    const body = document.querySelector("body")
    const dateNow = new Date().toLocaleString()
    
    // FUNCTIONS
    

    function addTypeCard() {

        const select = document.querySelector("select");

        fetch("card.json")
        .then(res => res.json())
        .then(data => { 
            data.forEach((type) => {
                var option = document.createElement("option");
                option.text = type.name;
                option.value = type.name;
                select.add(option);
            })
        })
        
    } 

    function displayPlayer(player, i) {
        
        let article = _("article", section, null, null, player.type)

        let updateInput = _("input", article, null, null, "hidden")
        updateInput.value = player.minPrice

        let h2 = _("h2", article, (player.name).toUpperCase())
        _("p", article, "Note : "+player.average)
        _("p", article, "Type : "+player.type)
        let price = _("p", article, "Prix Minimum : "+player.minPrice, null, "price")
        _("p", article, "Prix de revente : "+Math.round(parseInt(player.minPrice)*1.13), null, "priceSell")
        _("p", article, "Date : "+player.date)
        
        
        let delButton = _("button", article, "X", null, "delButton")
        delButton.addEventListener("click", () => {
            
            ajax("services.php", { action: "delete", id: player.id })
            .then((data) => {
                if (data.success)
                article.remove()
            })
        })


//UPDATE

        price.addEventListener("click", () => {
            price.classList.add("hidden")
            updateInput.classList.remove("hidden")
            updateInput.focus()
        })
        updateInput.addEventListener("keyup", (event) => {
            if(event.key == 'Enter' || event.key == 'Escape'){
                
                ajax("services.php", { action: "update", id: player.id, minPrice:updateInput.value, date: dateNow})
                .then((data) => {
                    displayPlayer(data.object)
                }) 

                price.classList.remove("hidden")
                updateInput.classList.add("hidden")
                document.location.reload();
            }
        })
// FIN UPDATE

    }

    function ajax(url, params) {
        
        let parametrizedUrl = url+"?";
        
        for (const [k, v] of Object.entries(params)) {
            parametrizedUrl +=k+"="+v+"&"
        }
        return fetch(parametrizedUrl).then((response) => {
            return response.json()
        })
    }
    
    // ACTIONS
    
    let header = _("header", body)
    _("h1", header, "Joueurs FUT 21", header)
    
    // FORMULAIRE
    _("span", body, "Ajouter un joueur", "linkForm")
    
    let formDiv = _("div", body, null, "formDiv")
    
    let p = _("p", formDiv)
    _("span", p, "Nom")
    let nameInput = _("input", p)
    
    p = _("p", formDiv)
    _("span", p, "Note")
    let noteInput = _("input", p, null, "inputNote")
    jQuery('#inputNote').attr('type', 'number');
    
    p = _("p", formDiv)
    _("span", p, "Type de carte")
    let typeInput = _("select", p)
    
    p = _("p", formDiv)
    _("span", p, "Prix minimum")
    let priceInput = _("input", p, null, "inputPrice")
    jQuery('#inputPrice').attr('type', 'number');
    
    p = _("p", formDiv)
    _("span", p)
    let addButton = _("button", p, "Ajouter")
    
    addButton.addEventListener("click", () => {
        ajax("services.php", { action: "add", name: nameInput.value, average: noteInput.value, type: typeInput.value, minPrice: priceInput.value, date: dateNow})
        .then((data) => {
            displayPlayer(data.object)
        }) 
    })
    
    addTypeCard()
    jQuery( "#linkForm" ).click(function() {
        jQuery( "#formDiv" ).slideToggle();
    });
    let section = _("section", body)
    
    ajax("services.php", { action: "list" }).then((players) => {
        players.forEach(displayPlayer)
    })
})



// Fonction de factorisation de la création d'éléments DOM
function _(tag, parent, text=null, id=null, classs=null) {

    // Créer en mémoire un objet de type tag
    let element = document.createElement(tag)
    if (text)
        element.appendChild(document.createTextNode(text))
    parent.appendChild(element)
    if (id)
        element.id = id
    if (classs)
        element.classList.add(classs)
    return element

}

function __(tag, parent, type=null, text=null, id=null, classs=null) {

    // Créer en mémoire un objet de type tag
    let element = document.createElement(tag)
    if (text)
        element.appendChild(document.createTextNode(text))
    parent.appendChild(element)
    if (type)
        element.type = type
    if (id)
        element.id = id
    if (classs)
        element.classList.add(classs)
    return element

}