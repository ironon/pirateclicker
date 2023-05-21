
function getUserData() {
    // fetch(http://127.0.0.1:5000/)
}
let url = "placeholder"
let userData = getUserData()
let gold_per_second = 0
let COMPOUND_INTEREST_RATE = 0.05

function onTreasureChestClick() {
    playerData['user_data']['gold'] += 1
    console.log(playerData['user_data']['gold'])
    
    document.querySelector(".gold-count").innerHTML = "Current Gold: " + parseInt(playerData['user_data']['gold'])
}



function registerUnit(unit, index) {
    //insert unit into .upgrade-panel from unitTemplate
    let upgradePanel = document.querySelector(".upgrade-panel")
    let unitTemplate = document.querySelector("#unit-template")
    let unitElement = unitTemplate.content.cloneNode(true)
    let owned_units = playerData['user_data']['owned_units']
    const divElement = document.createElement('div');

    while (unitElement.firstChild) {
        console.log(unitElement.firstChild)
        divElement.appendChild(unitElement.firstChild);
    }


    console.log(divElement)
    divElement.className = 'unit'
    divElement.querySelector("#uniticon").src = unit["imageurl"]
    divElement.querySelector(".upgrade-name").innerHTML = unit["name"]
    divElement.querySelector(".upgrade-desc").innerHTML = unit["description"]
    divElement.querySelector(".price").innerHTML = unit["price"]
    let buy = divElement.querySelector(".upgrade-buy")
    buy.id = index
    buy.addEventListener("click", onBuyClick)
    let upgrade = divElement.querySelector(".upgrade-upgrades")
    upgrade.id = index
    buy.addEventListener("click", onUpgradeClick)
    console.log(playerData)
    console.log(index)
    if(owned_units[index] != undefined) {
        
        divElement.querySelector(".pricediv").querySelector(".count").innerText = owned_units[index][2]
        divElement.querySelector(".pricediv").querySelector(".price").innerText = "$" + Math.round(parseInt(getModifiedPrice(units[index]["price"], owned_units[index][2])))
        divElement.querySelector(".upgrade-name").innerText = unit.name
    }
    


    upgradePanel.appendChild(divElement)

    console.log(upgradePanel)

}
function getModifiedPrice(originalPrice, count) {
    let dprice = originalPrice * Math.pow((1 + COMPOUND_INTEREST_RATE), count)
    console.log("modified price in calc: " + dprice)
    
    return dprice

}
function updateGold(unit, index, unitIndex, event, owned_units) {
    let mod_price = getModifiedPrice(units[unitIndex]["price"], unit[2])
    console.log("count: " + unit[2])
    console.log("price: " + units[unitIndex]["price"])
    console.log("mod_price: " + mod_price)

    if (playerData['user_data']['gold'] > mod_price) {
        owned_units[index] = [unitIndex, unit[1], unit[2] + 1]
        playerData['user_data']['gold'] -= mod_price
        document.querySelector(".gold-count").innerHTML = "Current Gold: " + Math.round(parseInt(playerData['user_data']['gold']))
        event.target.parentNode.parentNode.querySelector(".pricediv").querySelector(".count").innerText = owned_units[index][2]
        event.target.parentNode.parentNode.querySelector(".pricediv").querySelector(".price").innerText = "$" + Math.round(parseInt(getModifiedPrice(units[unitIndex]["price"], owned_units[index][2])))
    }else {
        angryButton(".upgrade-buy")
    }
}
function onBuyClick(event) {
    let unitIndex = parseInt(event.target.id)
    let owned_units = playerData['user_data']['owned_units']
   
    let contains = false
    owned_units.forEach((unit, index) => {
        if (unit[0] == unitIndex) {
            contains = true
            // console.log("price: " + units[unitIndex]["price"])
            updateGold(unit, index, unitIndex, event, owned_units)
        }
    })
    if (!contains) {

        let unit = [unitIndex, 0, 1]
        owned_units.push(unit)
        let mod_price = getModifiedPrice(units[unitIndex]["price"], unit[2])
        console.log("count: " + unit[2])
        console.log("price: " + units[unitIndex]["price"])
        console.log("mod_price: " + mod_price)
        if (playerData['user_data']['gold'] > mod_price) {
            let modified_price = getModifiedPrice(units[unitIndex]["price"], 1)
            console.log(modified_price)
            playerData['user_data']['gold'] -= modified_price
            document.querySelector(".gold-count").innerHTML = "Current Gold: " + Math.round(parseInt(playerData['user_data']['gold']))
            event.target.parentNode.parentNode.querySelector(".pricediv").querySelector(".count").innerText = 1
            event.target.parentNode.parentNode.querySelector(".pricediv").querySelector(".price").innerText = "$" + Math.round(parseInt(getModifiedPrice(units[unitIndex]["price"], 1)))

          //  if (document.querySelector());

        } else {
        angryButton(".upgrade-buy")
           
        }
    }

    refreshUnits()
    updateGPS(owned_units, units)
    updateView(owned_units, units)
}
function angryButton(buttonid) {
    document.querySelector(buttonid).classList.add("angry")
    setTimeout(() => {
        document.querySelector(buttonid).classList.remove("angry")
    }, 200)
}
function onUpgradeClick(event) {
    // let unitname = event.target.parentElement.parentElement.querySelector(".upgrade1").querySelector(".upgrade-name").innerText
}
function onDocLoad() {
    getUnitData().then(() => {
        let piratename = document.querySelector(".pirate-name")
         let username = JSON.parse(localStorage.getItem("playerIdentity"))['username']
    
        piratename.innerHTML = username+"'s Pirate Fleet"
        let buyButtons = document.querySelectorAll(".upgrade-buy")
        buyButtons.forEach((button) => {
            button.addEventListener("click", onBuyClick)
        
        })
        document.querySelector("#treasurechest").addEventListener("click", onTreasureChestClick)
        waitForUnits = setInterval(() => {
            if (units != null) {
                clearInterval(waitForUnits)
                units.forEach((unit, index) => registerUnit(unit, index))
                console.log("CLEARING INTERVAL")
            }
        }, 300)
        updateView(owned_units, units)
    })


}
window.onload = () => {
    onDocLoad()
    
    
    
}
function updateView(owned_units, units) {
    let view = document.querySelector(".misc-panel")
    let unitViewTemplate = view.querySelector(".unit-view")
    view.querySelectorAll("div").forEach((div) => {
        div.remove()
    })
    owned_units.forEach((unit, index) => {
        const divElement = document.createElement('div');
        divElement.classList.add("unit-view")
        while (unitViewTemplate.firstChild) {
            console.log(unitElement.firstChild)
            divElement.appendChild(unitElement.firstChild);
        }
        let amount = unit[2]
        for (let i = 0; i < amount; i++) {
            let img = document.createElement("img")
            img.src = units[unit[0]]["imageurl"]
            divElement.appendChild(img)
            
        }
        
        view.appendChild(divElement)
    })
}
function refreshUnits() {
    units = parseCompressedUserdata(playerData)
    console.log(units)
    let upgradePanel = document.querySelector(".upgrade-panel")
    upgradePanel.querySelectorAll("div").forEach((div) => {
        div.remove()
    })
    waitForUnits = setInterval(() => {
        if (units != null) {
            clearInterval(waitForUnits)
            units.forEach((unit, index) => registerUnit(unit, index))
            console.log("CLEARING INTERVAL")
        }
    }, 300)
}

function updateGPS(owned_units, units) {
    gold_per_second = get_gps(owned_units, units)
    document.querySelector(".gps").innerHTML = "Gold Per Second: " + Math.round(gold_per_second)
    console.log(gold_per_second)
}

function get_gps(owned_units, units) {
    let gold_per_second =0
    for (var i = 0; i < owned_units.length; i++) {
        gold_per_second += units[owned_units[i][0]]["gps"] * owned_units[i][2]
    }
    return gold_per_second
}
setInterval(() => {
    playerData['user_data']['gold'] += gold_per_second
    document.querySelector(".gold-count").innerHTML = "Current Gold: " + parseInt(playerData['user_data']['gold'])
    
}, 1000)