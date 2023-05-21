let units = null
let server_url = "http://127.0.0.1:5000"
let playerData = null

getUnitData()
async function getLocalUserdata() {
    let playerIdentity = localStorage.getItem("playerIdentity")
    if (playerIdentity == null) {
        console.log("Getting from server!")
        let username
        username = localStorage.getItem("tempUsername")
        playerIdentity = await fetch(server_url + "/add-new-user", {
            method: 'POST',
            mode:  'cors',
            headers:  {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        }).catch(err => {
            console.log(err)
        
        })
        playerIdentity = await playerIdentity.json()
        console.log(playerIdentity)
        localStorage.setItem("playerIdentity", JSON.stringify(playerIdentity))
    } else {
        console.log("Loaded from storage!")
        playerIdentity = JSON.parse(playerIdentity)

    }
    console.log(playerIdentity)
    return playerIdentity['id']
}
async function getPlayerData(id) {
    let playerData = await fetch(server_url + `/get-user-data?id=${id}`)
    playerData = await playerData.json()
    return playerData
}
async function getUnitData() {
    let id = await getLocalUserdata()
    console.log("id: " + id)
    playerData = await getPlayerData(id)
    console.log(playerData)
    units = parseCompressedUserdata(playerData)
    console.log(units)
    return units

}

function parseCompressedUserdata(playerData) {
    units = []
    owned_units = playerData['user_data']['owned_units']
    max_index = -1
    owned_units.forEach(unit => {
        index = unit[0]
        level = unit[1]
        amount = unit[2]
        if (index > max_index) {
            max_index = index
        };
        units.push(getAllUnits()[level][index])
    
    });
    let next_unit =null
    if (max_index == -1) {
        console.log("No units, adding")
        next_unit = 0
    } else {

        next_unit = max_index+1
    }
    let test = getAllUnits()[0][next_unit]
    units.push(test)
    console.log(units)
 
    return units
}
function Unit(name, description, price, gps, nextUpgrade) {
    //the image url is just the name but with no spaces, all lowercase
    let imageurl =  "./assets/imgs/" + name.replaceAll(" ", "").toLowerCase() + ".png"
 
    return {name:name, description:description, imageurl:imageurl, price:price, gps:gps,nextUpgrade:nextUpgrade}
}
function getAllUnits() {
    return [
        [
            Unit("Maties", "The more maties, the more you plunder!", 10, 0.1,"Quartermaster"),
            Unit("Cutlass", "Good for cuttin, good for plunderin\'", 100, 3,"Diamond Cutlass"),
            Unit("Flintlock", "Pew pew pew!", 3000, 20, "Stylish Flintlock"),
            Unit("Cannon", "Bam bam bam!", 50000, 200, "Big Cannon"),
            Unit("Captain", "Micromanage yer gold flow!", 150000, 500, "Fleet Captain"),
            Unit("Octopus", "Tear off yer legs the nasty critters will do!", 500000, 2500, "Kraken"),
            Unit("Shark", "Sharks be damned if thay eva get near ya!", 1500000, 20000, "Megalodon"),
            Unit("Sloop", "Sail to find treasure!", 10000000, 75000, "Brigand"),
            Unit("Ship Fleet", "Teamwork!", 50000000, 200000, "Manned Ship Fleet"),
            
        ],
        [
            Unit("Quartermaster", "The better the maties, the more you plunder!", 10, 1,""),
            Unit("Diamond Cutlass", "Even better for cuttin, amazing for plunderin\'!", 100, 1, ""),
            Unit("Stylish Flintlock", "Pew pew pew! (but with style)", 3000, 1, ""),
            Unit("Big Cannon", "Bigger bam bam bam!", 50000, 1, ""),
            Unit("Fleet Captain", "Macromanage yer gold flow!", 150000, 1, ""),
            Unit("Kraken", "Dreaded Kraken, sea beast, strikes fear with mighty tentacles.", 500000, 1, ""),
            Unit("Megalodon", "Beware the Megalodon, giant teeth, devours all in its path!", 1500000, 1, ""),
            Unit("Brigantine", "Sail more dangerous waters for better treasure!", 10000000, 1, ""),
            Unit("Manned Ship Fleet", "Add a crew to that fleet!", 50000000, 1, "")
        ]

    ]
}

window.onbeforeunload = (e) => {
    console.log(playerData)
    e.preventDefault()
    let playerID = localStorage.getItem("playerIdentity")
    playerID = JSON.parse(playerID)
  
    fetch(new URL(`/update-user-data?id=${playerData['id']}&token=${playerID['token']}`, server_url), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
    })
     // For IE and Firefox
    return event.returnValue = 'Are you sure you want to leave?'
}