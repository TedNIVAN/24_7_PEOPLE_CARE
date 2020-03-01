var address = '0x83479Eb6E53c0d5e09b66Ff975C08E91D3797F9a';
var abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "int32",
                "name": "latitude",
                "type": "int32"
            },
            {
                "indexed": false,
                "internalType": "int32",
                "name": "longitude",
                "type": "int32"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "picture",
                "type": "string"
            }
        ],
        "name": "addPerson",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "minEthToStake",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "needHelp",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "people",
        "outputs": [
            {
                "internalType": "int32",
                "name": "latitude",
                "type": "int32"
            },
            {
                "internalType": "int32",
                "name": "longitude",
                "type": "int32"
            },
            {
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "picture",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "amountOfEthStaked",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrieveBalance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "int32",
                "name": "_latitude",
                "type": "int32"
            },
            {
                "internalType": "int32",
                "name": "_longitude",
                "type": "int32"
            },
            {
                "internalType": "string",
                "name": "_username",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_picture",
                "type": "string"
            }
        ],
        "name": "setAlert",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

var myContract;
var myContractInstance;
var username;
var picture;

$(document).ready(() => {
    setTimeout(() => {
        torus.setProvider({
            host: "ropsten" // default : 'mainnet'
        });
    }, 4000)

    var refreshIntervalId = setInterval(() => {
        if (torus.isLoggedIn) {
            clearInterval(refreshIntervalId);
            console.log(torus.isLoggedIn);
            $("#alert").show();
            torus.getUserInfo().then((res, err) => {
                $("#message").html("<center>" + res.name + "</center>");
                $(".navbar-menu").show();
                username = res.name;
                picture = res.profileImage;
                console.log(res);
            })
        }
    }, 1000);

    $("#setAlert").click(() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

        myContract = torus.web3.eth.contract(abi);
        myContractInstance = myContract.at(address);
        console.log(myContractInstance);

        torus.web3.eth.defaultAccount = torus.web3.eth.coinbase;

        myContractInstance.people(torus.web3.eth.defaultAccount, (err, res) => {
            if (!err) {
                console.log(res);
            } else {
                console.log(err);
            }
        });

    })
})

function showPosition(position) {

    console.log("Latitude: " + position.coords.latitude +
        "Longitude: " + position.coords.longitude);

    var latitude = Math.ceil(position.coords.latitude * 10000);
    var longitude = Math.ceil(position.coords.longitude * 10000);

    console.log("Latitude: " + latitude +
        "Longitude: " + longitude);

    myContractInstance.setAlert(latitude, longitude, username, picture, {
        from: torus.web3.eth.defaultAccount, value: torus.web3.toWei(0.1, "ether"), gasPrice: 2000000000,
        gas: 6000000
    }, (err, res) => {
        if (!err) {
            console.log(res);
            $("#alert").hide();
            $("#confirmed").show();
        } else {
            console.log(err);
        }
    })
}