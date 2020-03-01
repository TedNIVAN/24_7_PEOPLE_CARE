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

$(document).ready(() => {

    setTimeout(() => {
        torus.setProvider({
            host: "ropsten" // default : 'mainnet'
        });
        myContract = torus.web3.eth.contract(abi);
        myContractInstance = myContract.at(address);
        console.log(myContractInstance);
        torus.web3.eth.defaultAccount = torus.web3.eth.coinbase;
    }, 4000);

    var refreshIntervalId = setInterval(() => {
        if (torus.isLoggedIn) {
            clearInterval(refreshIntervalId);
            console.log(torus.isLoggedIn);
            $("#alert").show();
            checkAlerts();
            torus.getUserInfo().then((res, err) => {
                console.log(res);
            })
        }
    }, 1000);

    $("#unlock").click(() => {

        myContractInstance.retrieveBalance((err, res) => {
            console.log(res);
            $("#checkAlert").removeClass("is-loading");
            $("#alert").show();
            $("#retrieve").hide();
        })

    });

    $("#checkAlert").click(() => {
        $("#checkAlert").addClass("is-loading");
        checkAlerts();
    });

});

function checkAlerts() {
    myContractInstance.needHelp((err, res) => {
        console.log(res);
        myContractInstance.people(res, (err, res) => {
            if (!err) {
                console.log(res);
                var latitude = res[0].s * res[0].c[0];
                var longitude = res[1].s * res[1].c[0];
                console.log("latitude: " + latitude);
                console.log("longitude: " + longitude);
                infoWindow = new google.maps.InfoWindow;

                var pos = {
                    lat: latitude / 10000,
                    lng: longitude / 10000
                };

                var contentString = '<div id="content">' +
                    '<center>' +
                    '<div id="siteNotice">' +
                    '<figure class="image is-64x64">' +
                    '<img class="is-rounded" src="' +
                    res[3] +
                    '">' +
                    '</figure>' +
                    res[2] +
                    '</div>' +
                    '</center>' +
                    '</div>';

                infoWindow.setPosition(pos);
                infoWindow.setContent(contentString);
                infoWindow.open(map);
                map.setCenter(pos);

                $("#alert").hide();
                $("#retrieve").show();
            } else {
                console.log(err);
            }
        });
    });
}

