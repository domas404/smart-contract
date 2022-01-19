const name="John";
const address = "0x12DD56C868B1e80d0a12BDBB2c806EB7e4040b24";

var imageInfo = [{}]

var web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));
var account;
var id = 0;

contract = new web3.eth.Contract(abi, address);

async function getBal(account) {
    const balance = await web3.eth.getBalance(account);
    return balance;
}
async function getAccount(id) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[id];
    return account;
}

getAccount(1).then(function(result){
    account = result;
    console.log(account);

    getBal(account).then(function(bal) {
        document.getElementById("account-balance").innerHTML = Math.round(web3.utils.fromWei(bal) * 100)/100;
    });
});

getAccount(0).then(function(result){
    owner_account = result;

    getBal(owner_account).then(function(bal) {
        document.getElementById("account-balance-owner").innerHTML = Math.round(web3.utils.fromWei(bal) * 100)/100;
    });
});

document.getElementById("submit").addEventListener("click", function(){
    var link = document.getElementById("url").value;
    var size = document.getElementById("size").value;
    var height = document.getElementById("height").value;
    var width = document.getElementById("width").value;
    var sender;

    imageInfo[id].link = link;
    imageInfo[id].size = size;
    imageInfo[id].height = height;
    imageInfo[id].width = width;

    getAccount().then(function(result){
        sender = result;
        contract.methods.sendProposal(link, id, size, width, height, name)
        .send({ from: sender, gasPrice: '1000' })
        .on("receipt", function() {
            id++;
            // document.getElementById("side-nav").innerHTML = "success";
        });
        
        var x = document.createElement("div");
        x.innerHTML = "#"+id+" Pending";
        x.setAttribute("id", "prop"+id);
        x.setAttribute("class", "props");
        x.setAttribute("onclick", "displayImage(id)");
        x.setAttribute("class", "prop-list");
        var y = x.cloneNode(true);
        document.getElementById("side-nav").appendChild(x);
        document.getElementById("new-p").appendChild(y);
    });
    
});

function displayImage(image_id){
    var size, height, width, value;
    var _id = image_id.slice(-1);

    var new_image = document.createElement("img");
    new_image.setAttribute("src", imageInfo[_id].link);
    new_image.style.height = "300px";
    new_image.style.width = "400px";
    new_image.style.objectFit = "cover";
    new_image.style.objectPosition = "0 0";
    new_image.style.borderRadius = "15px";

    new_image_owner = new_image.cloneNode(true);    

    if(which_account == 0){
        console.log(which_account);
        document.getElementById("existing-proposal").style.visibility = "visible";
        document.getElementById("owner-container").style.visibility = "hidden";
        document.getElementById("image-container").appendChild(new_image);
        document.getElementById("set-size").innerHTML = imageInfo[_id].size;
        document.getElementById("set-height").innerHTML = imageInfo[_id].height;
        document.getElementById("set-width").innerHTML = imageInfo[_id].width;
        document.getElementById("set-value").innerHTML = imageInfo[_id].value;
    }
    else{
        document.getElementById("owner-container").style.visibility = "visible";
        document.getElementById("image-container-owner").appendChild(new_image_owner);
        document.getElementById("own-size").innerHTML = imageInfo[_id].size;
        document.getElementById("own-height").innerHTML = imageInfo[_id].height;
        document.getElementById("own-width").innerHTML = imageInfo[_id].width;
    }
    
}

/* HTML control */

document.getElementById("add-proposal").addEventListener("click", function(){
    document.getElementById("new-proposal-content").style.visibility = "visible";
})

var which_account=0; // 0 seller, 1 - owner

document.getElementById("owner").addEventListener("click", function(){
    document.getElementById("container").style.visibility = "hidden";
    document.getElementById("ownerUI").style.visibility = "visible";
    which_account = 1;
})

document.getElementById("seller").addEventListener("click", function(){
    document.getElementById("container").style.visibility = "visible";
    document.getElementById("ownerUI").style.visibility = "hidden";
    document.getElementById("owner-container").style.visibility = "hidden";
    which_account = 0;
})

document.getElementById("accept-prop").addEventListener("click", function(){
    var value = document.getElementById("value-input").value;
    imageInfo[0].value = value;
    document.getElementById("set-value").innerHTML = value;
})