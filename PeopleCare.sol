pragma solidity >=0.4.22 <0.7.0;

contract PeopleCare {
    address payable public needHelp;
    uint256 public minEthToStake = 100000000000000000; // 0.1 ETH

    struct Person {
        int32 latitude;
        int32 longitude;
        string username;
        string picture;
        uint256 amountOfEthStaked;
    }

    event addPerson(
        int32 latitude,
        int32 longitude,
        string username,
        string picture
    );

    mapping(address => Person) public people;

    function setAlert(
        int32 _latitude,
        int32 _longitude,
        string memory _username,
        string memory _picture
    ) public payable {
        if (msg.value >= minEthToStake) {
            people[msg.sender].latitude = _latitude;
            people[msg.sender].longitude = _longitude;
            people[msg.sender].username = _username;
            people[msg.sender].picture = _picture;
            people[msg.sender].amountOfEthStaked = msg.value;
            needHelp = msg.sender;
            emit addPerson(_latitude, _longitude, _username, _picture);
        }
    }

    function retrieveBalance() public {
        if (msg.sender != needHelp) {
            needHelp.transfer(people[needHelp].amountOfEthStaked);
            people[needHelp].amountOfEthStaked = 0;
        }
    }
}
