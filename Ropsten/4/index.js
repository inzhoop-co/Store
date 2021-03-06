var dappleth = (function(){
    var dappContract;
    var Dapp;
    var $scope;
    var $service;
    var contractsList=[];
    var data;
    var myEvents=[];
    var $q;



    
    var _init = function(core) {
        $scope = core.scope;
        $service = core.service;
        //$q = $service.q();
        Dapp = $scope.Dapp.activeApp;
        myAddress = $service.address();
        $scope.qrcodeString = myAddress;
        $scope.visibleQR= false;
        data = {events: []};
        
        angular.extend($scope, data);
        angular.extend($scope, context);    

        _start();
    }

    var _start = function(){
      //v0.26.11 fix null key
      fetch(Dapp.Path + 'eventsData.json').then(function(response) {
        response.json().then(function(res){
          console.log(res);
          var listA = res;
          var locals=[];

          try{
            locals = $service.getKey(Dapp.GUID,'localEvents'); 
            for(var i=0; i< locals.length; i++){
              Dapp.Contracts.push({"Address": locals[i].address, "ABI": [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"participants","outputs":[{"name":"participantName","type":"string"},{"name":"addr","type":"address"},{"name":"attended","type":"bool"},{"name":"paid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_confirmation","type":"bytes32"}],"name":"attendWithConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ended","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registered","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"endedAt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"clear","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_participant","type":"string"},{"name":"_encrypted","type":"string"}],"name":"registerWithEncryption","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"payout","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"payoutAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"limitOfParticipants","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isPaid","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"confirmation","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"payback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"coolingPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"}],"name":"attend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_limitOfParticipants","type":"uint256"}],"name":"setLimitOfParticipants","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cancelled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"participantsIndex","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isAttended","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"encryption","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"confirmationRepository","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"attended","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isRegistered","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"cancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_participant","type":"string"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_deposit","type":"uint256"},{"name":"_limitOfParticipants","type":"uint256"},{"name":"_coolingPeriod","type":"uint256"},{"name":"_confirmation_repository_address","type":"address"},{"name":"_encryption","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"participantName","type":"string"},{"indexed":false,"name":"_encryption","type":"string"}],"name":"RegisterEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"}],"name":"AttendEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_payout","type":"uint256"}],"name":"PaybackEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"_payout","type":"uint256"}],"name":"WithdrawEvent","type":"event"},{"anonymous":false,"inputs":[],"name":"CancelEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"leftOver","type":"uint256"}],"name":"ClearEvent","type":"event"}]});
            }           
          }catch(e){
            console.log('no events');
          }

          myEvents = listA.concat(locals);

          for(var i=0; i< Dapp.Contracts.length; i++){
            var c = web3.eth.contract(Dapp.Contracts[i].ABI).at(Dapp.Contracts[i].Address);
            //init contract and add to list
            contractsList.push(c);
            var info = myEvents[i];
            //var participants = $scope.listParticipants(i);
            var idStatus = $scope.getStatus(i,myAddress);
            $scope.isOwner = myAddress==c.owner();
            data.events.push({
              id: i,
              name: c.name(),
              description: c.Address,
              status: { id: idStatus },
              position: info.position,
              date: info.date,
              time: info.time,
              deposit: c.deposit().toNumber(),
              limit: c.limitOfParticipants().toNumber(),
              users: c.registered().toNumber(),
              participants: [], //participants,
              assets: info.assets
            });
            
            $scope.$broadcast('scroll.refreshComplete');
          }

        });
      }).then(function(e) {
          console.log(e);
      });

    };

    var _exit = function(){
        //clean enviroment
    };
    

    var context = {
        dappRefresh: function(value){
          $scope.$broadcast('scroll.refreshComplete');
        },
        showDetails: function(idEvent, event) {
          var ctx = this;
          if(!$scope.detailsOn){
            event.currentTarget.classList.add('opened');
            document.querySelector('.eventscontainer').classList.add('hasOpenedEvent');
            data.events[idEvent].status.id = $scope.getStatus(idEvent,myAddress);
            data.events[idEvent].participants = $scope.listParticipants(idEvent);
            $scope.detailsOn = true;            
          }
                    
          /*
          $scope.listParticipants(idEvent).then(function(end){
            console.log("end: " + end);
            data.events[idEvent].participants = end;
          },function(update){
            console.log("update: " + update);

            data.events[idEvent].participants = update;
          },function(final){
            console.log("final: " + final);

            data.events[idEvent].participants = final;
          });
          */
          //ctx.updateParticipants(idEvent);
        },
        hideDetails: function(idEvent, event) {
          var ctx = this;
          document.querySelector('[data-id-event="' + idEvent + '"]').classList.remove('opened');
          document.querySelector('.eventscontainer').classList.remove('hasOpenedEvent');
          event.stopPropagation();
          ctx.QRVisible(false);
          $scope.showNewForm=false;
          $scope.detailsOn = false;
        },
        attend: function(index){
          $service.scanQR().then(function(addr){
            console.log(addr);
            var gasLimit = 3000000; // gas limit
            var gasPrice = 50000000000; //gas price in wei
            $service.transactionCall(contractsList[index],'attend',addr, 0, gasLimit, gasPrice).then(function(res){
              console.log(res);
              if(res[0])
                $service.popupAlert('Something is wrong!',res[0].message);
              if(res[1])
                console.log(res[1]);
            });

          })
        },
        getStatus: function(index, addr){
          var contract = contractsList[index];
          var isRegistered = contract.isRegistered(addr);
          var isAttended = contract.isAttended(addr);
          var payout = contract.payout().toNumber();
          var isPaid = contract.isPaid(addr);
          var isEnded = contract.ended();

          var status = 0;
          if(isRegistered) status = 1; //registered
          if(isAttended || isEnded){
            if(isAttended && !isEnded) status = 2; //attended
            if(isAttended && !isPaid && isEnded) status = 3; //won
            if(!isAttended && isEnded) status = 5; //lost
            if(isAttended && isPaid) status = 4; //earned
          }else{
            console.log("should not be here")
          }
          console.log("hello", status, addr, isRegistered, isAttended, isPaid, isEnded);
          

          return status;

        },
        updateParticipants: function(index){
          data.events[index].participants = $scope.listParticipants(i);
          var peoples = data.events[index].participants;
          for(var i=0; i< peoples.length; i++){
            data.events[index].participants[i].status = $scope.getStatus(index,peoples[i].address);
          };
        },
        listParticipants_new: function(index){
          var q = $q.defer(); 
          var contract = contractsList[index];
          var list=[];
          var count = contract.registered().toNumber();
          for(var i=1;i<=count;i++){
              var addr = contract.participantsIndex(i); //iterate for list
              var user = contract.participants(addr);
              $scope.getStatus(index,addr).then(function(idStatus){
                list.push({name:user[0], address:user[1], status: idStatus, isAttended: user[2], isPaid: user[3]});             
              });
              
              q.notify(list);

          }
          q.resolve(list);
          return q.promise;
        },
        listParticipants: function(index){
          var contract = contractsList[index];
          var list=[];
          var count = contract.registered().toNumber();
          for(var i=1;i<=count;i++){
              var addr = contract.participantsIndex(i); //iterate for list
              var user = contract.participants(addr);
              var idStatus = $scope.getStatus(index,addr);

              list.push({name:user[0], address:user[1], status: idStatus, isAttended: user[2], isPaid: user[3]});             
          
          }
          return list;
        },
        getInfo: function(index){
          fetch(Dapp.Path + index + '_info.json').then(function(response) {
              return response.json().then(function(res){
                  return res;
              });
          });
        },
        register: function(index,nickname){
          var deposit = web3.toWei(0.05);
          var name = nickname;
          var gasLimit = 3000000; // gas limit
          var gasPrice = 50000000000; //gas price in wei
          $service.transactionCall(contractsList[index],'register',name, deposit, gasLimit, gasPrice).then(function(res){
            console.log(res);
            if(res[0])
              $service.popupAlert('Something is wrong!',res[0].message);
            if(res[1])
              console.log(res[1]);

          });
        },
        QRVisible: function(value){
          $scope.visibleQR= value;
        },
        newEvent: function(){
          var idCount = myEvents.length+1;
          $scope.newEvent = {
              id: idCount,
              name: "",
              description: "",
              status: { id: 0 },
              position: { location: "", city: "", lat: "", long: "" },
              date: "",
              time: "",
              deposit: "",
              limit: "",
              users: 0,
              participants: [],
              assets: { banner: "http://www.inzhoop.com/repository/assets/blockParty.png", logo: "info.logo" }
          };

          $scope.showNewForm=true;
        },
        withdraw: function(index){
          var gasLimit = 3000000; // gas limit
          var gasPrice = 50000000000; //gas price in wei
          $service.transactionCallNoParam(contractsList[index],'withdraw', 0, gasLimit, gasPrice).then(function(res){
            console.log(res);
          });
        },
        addLocalEvent: function(event){
          $service.loadingOn();
          var indexOfEvent = myEvents.findIndex(e => e.address === event.address);
          if(indexOfEvent==-1)
            myEvents.push(event);
          else
            myEvents[indexOfEvent] = event;

          $service.storeData(Dapp.GUID, 'localEvents', myEvents);
          $service.loadingOff();

        },
        createEvent: function(event){
          var ctx = this;
          var _name = event.name ;
          var _deposit = event.deposit ;
          var _limitOfParticipants = event.limit ;
          var _coolingPeriod = 1 ;
          var _confirmation_repository_address = myAddress ;
          var _encryption = "leth" ;
          
          var param = [];
          param.push(_name);
          param.push(_deposit);
          param.push(_limitOfParticipants);
          param.push(_coolingPeriod);
          param.push(_confirmation_repository_address);
          param.push(_encryption);

          var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"participants","outputs":[{"name":"participantName","type":"string"},{"name":"addr","type":"address"},{"name":"attended","type":"bool"},{"name":"paid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_confirmation","type":"bytes32"}],"name":"attendWithConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ended","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registered","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"endedAt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"clear","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_participant","type":"string"},{"name":"_encrypted","type":"string"}],"name":"registerWithEncryption","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"payout","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"payoutAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"limitOfParticipants","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isPaid","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"confirmation","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"payback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"coolingPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"}],"name":"attend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_limitOfParticipants","type":"uint256"}],"name":"setLimitOfParticipants","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cancelled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"participantsIndex","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isAttended","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"encryption","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"confirmationRepository","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"attended","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isRegistered","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"cancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_participant","type":"string"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_deposit","type":"uint256"},{"name":"_limitOfParticipants","type":"uint256"},{"name":"_coolingPeriod","type":"uint256"},{"name":"_confirmation_repository_address","type":"address"},{"name":"_encryption","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"participantName","type":"string"},{"indexed":false,"name":"_encryption","type":"string"}],"name":"RegisterEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"}],"name":"AttendEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_payout","type":"uint256"}],"name":"PaybackEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"_payout","type":"uint256"}],"name":"WithdrawEvent","type":"event"},{"anonymous":false,"inputs":[],"name":"CancelEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"leftOver","type":"uint256"}],"name":"ClearEvent","type":"event"}];
          var code = '0x606060405234156200001057600080fd5b6040516200218a3803806200218a83398101604052808051820191906020018051906020019091908051906020019091908051906020019091908051906020019091908051820191905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008651141515620000c6578560019080519060200190620000bf92919062000215565b5062000115565b6040805190810160405280600481526020017f5465737400000000000000000000000000000000000000000000000000000000815250600190805190602001906200011392919062000215565b505b6000851415156200012d57846002819055506200013c565b66b1a2bc2ec500006002819055505b6000841415156200015457836003819055506200015d565b60146003819055505b60008314151562000175578260088190555062000180565b62093a806008819055505b60008151141515620001a65780600b9080519060200190620001a492919062000215565b505b60008273ffffffffffffffffffffffffffffffffffffffff16141515620002095781600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b505050505050620002c4565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200025857805160ff191683800117855562000289565b8280016001018555821562000289579182015b82811115620002885782518255916020019190600101906200026b565b5b5090506200029891906200029c565b5090565b620002c191905b80821115620002bd576000816000905550600101620002a3565b5090565b90565b611eb680620002d46000396000f30060606040523615610194576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde031461019957806309e69ede146102275780630bfcbc5d1461033f57806312fa6feb146103665780632de40ce3146103935780633ccfd60b146103bc5780633d6a71e4146103d157806352efea6e146103fa5780635d27bff31461040f57806363bd1d4a146104a45780636b46c8c3146104cd5780636d006ae8146104f65780636ded82f81461051f5780637eef61771461057057806383197ef01461059d578063854bec87146105b25780638da5cb5b146105c75780639328beee1461061c578063982495c7146106455780639989a5ae1461069f5780639a82a09a146106c25780639b25cacb146106ef578063a07f3a5614610752578063a531d362146107a3578063a5bc1e8414610831578063ad7a672f14610886578063b5e10e9a146108af578063c3c5a547146108d8578063d0e30db014610929578063ea8a1af014610952578063f2c298be14610967578063f2fde38b146109b9575b600080fd5b34156101a457600080fd5b6101ac6109f2565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101ec5780820151818401526020810190506101d1565b50505050905090810190601f1680156102195780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561023257600080fd5b61025e600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610a90565b60405180806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001841515151581526020018315151515815260200182810382528681815460018160011615610100020316600290048152602001915080546001816001161561010002031660029004801561032d5780601f106103025761010080835404028352916020019161032d565b820191906000526020600020905b81548152906001019060200180831161031057829003601f168201915b50509550505050505060405180910390f35b341561034a57600080fd5b610364600480803560001916906020019091905050610af9565b005b341561037157600080fd5b610379610d0c565b604051808215151515815260200191505060405180910390f35b341561039e57600080fd5b6103a6610d1f565b6040518082815260200191505060405180910390f35b34156103c757600080fd5b6103cf610d25565b005b34156103dc57600080fd5b6103e4610f3a565b6040518082815260200191505060405180910390f35b341561040557600080fd5b61040d610f40565b005b6104a2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506110e1565b005b34156104af57600080fd5b6104b7611247565b6040518082815260200191505060405180910390f35b34156104d857600080fd5b6104e0611277565b6040518082815260200191505060405180910390f35b341561050157600080fd5b61050961127d565b6040518082815260200191505060405180910390f35b341561052a57600080fd5b610556600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611283565b604051808215151515815260200191505060405180910390f35b341561057b57600080fd5b6105836112ed565b604051808215151515815260200191505060405180910390f35b34156105a857600080fd5b6105b0611346565b005b34156105bd57600080fd5b6105c56113db565b005b34156105d257600080fd5b6105da6114bd565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561062757600080fd5b61062f6114e2565b6040518082815260200191505060405180910390f35b341561065057600080fd5b61069d6004808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919050506114e8565b005b34156106aa57600080fd5b6106c06004808035906020019091905050611695565b005b34156106cd57600080fd5b6106d5611716565b604051808215151515815260200191505060405180910390f35b34156106fa57600080fd5b6107106004808035906020019091905050611729565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561075d57600080fd5b610789600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061175c565b604051808215151515815260200191505060405180910390f35b34156107ae57600080fd5b6107b66117c6565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156107f65780820151818401526020810190506107db565b50505050905090810190601f1680156108235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561083c57600080fd5b610844611864565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561089157600080fd5b61089961188a565b6040518082815260200191505060405180910390f35b34156108ba57600080fd5b6108c26118a9565b6040518082815260200191505060405180910390f35b34156108e357600080fd5b61090f600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506118af565b604051808215151515815260200191505060405180910390f35b341561093457600080fd5b61093c61194a565b6040518082815260200191505060405180910390f35b341561095d57600080fd5b610965611950565b005b6109b7600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050611a3b565b005b34156109c457600080fd5b6109f0600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611b47565b005b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a885780601f10610a5d57610100808354040283529160200191610a88565b820191906000526020600020905b815481529060010190602001808311610a6b57829003601f168201915b505050505081565b600c60205280600052604060002060009150905080600001908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160149054906101000a900460ff16908060010160159054906101000a900460ff16905084565b600660009054906101000a900460ff16151515610b1557600080fd5b610b1e336118af565b1515610b2957600080fd5b610b323361175c565b151515610b3e57600080fd5b600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166396c144f082336000604051602001526040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050602060405180830381600087803b1515610c1357600080fd5b6102c65a03f11515610c2457600080fd5b505050604051805190501515610c3957600080fd5b6001600c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160146101000a81548160ff0219169083151502179055506005600081548092919060010191905055507f1c5e7a37dd4095194684d8f835d2c81b686d64d685032055a7cd02edc7c49ed833604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150565b600660009054906101000a900460ff1681565b60045481565b6000600660009054906101000a900460ff161515610d4257600080fd5b6000600954111515610d5357600080fd5b600c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090503373ffffffffffffffffffffffffffffffffffffffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610df257600080fd5b600660019054906101000a900460ff1680610e1b57508060010160149054906101000a900460ff165b1515610e2657600080fd5b600015158160010160159054906101000a900460ff161515141515610e4a57600080fd5b60018160010160156101000a81548160ff0219169083151502179055508060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6009549081150290604051600060405180830381858888f193505050501515610eca57fe5b7f5dba113b49cfa7c90315e8e604e6b506f7abcb909b01dcb19ec39005086e68fc33600954604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a150565b60075481565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f9d57600080fd5b600660009054906101000a900460ff161515610fb857600080fd5b6008546007540142111515610fcc57600080fd5b600660009054906101000a900460ff161515610fe757600080fd5b610fef61188a565b90506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151561105257600080fd5b7f61355a34c3bc2e502a24eba7ad2fb0fd0d05c4f71de8cb041fbe39cd3649665e6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a150565b600660009054906101000a900460ff161515156110fd57600080fd5b61110682611c21565b7f8d272c75acbe64f584f00b43ea2e4ac139abac8e8b8f118e5588e14bbb5c4031338383604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156111a0578082015181840152602081019050611185565b50505050905090810190601f1680156111cd5780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156112065780820151818401526020810190506111eb565b50505050905090810190601f1680156112335780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a15050565b600080600554141561125c5760009050611274565b60055461126761188a565b81151561127057fe5b0490505b90565b60095481565b60035481565b600061128e826118af565b80156112e65750600c60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160159054906101000a900460ff165b9050919050565b60008073ffffffffffffffffffffffffffffffffffffffff16600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156113a157600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561143657600080fd5b600660009054906101000a900460ff1615151561145257600080fd5b61145a611247565b6009819055506001600660006101000a81548160ff021916908315150217905550426007819055507fb7152de35affc741a6b2355d37e9caf51fe847cacfccd414be5e15996ff7e6c66009546040518082815260200191505060405180910390a1565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60085481565b6000806000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561154657600080fd5b600660009054906101000a900460ff1615151561156257600080fd5b600091505b825182101561169057828281518110151561157e57fe5b906020019060200201519050611593816118af565b151561159e57600080fd5b6115a78161175c565b1515156115b357600080fd5b7f1c5e7a37dd4095194684d8f835d2c81b686d64d685032055a7cd02edc7c49ed881604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001600c60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160146101000a81548160ff0219169083151502179055506005600081548092919060010191905055508180600101925050611567565b505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156116f057600080fd5b600660009054906101000a900460ff1615151561170c57600080fd5b8060038190555050565b600660019054906101000a900460ff1681565b600d6020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000611767826118af565b80156117bf5750600c60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff165b9050919050565b600b8054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561185c5780601f106118315761010080835404028352916020019161185c565b820191906000526020600020905b81548152906001019060200180831161183f57829003601f168201915b505050505081565b600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b60055481565b60008073ffffffffffffffffffffffffffffffffffffffff16600c60008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b60025481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156119ab57600080fd5b600660009054906101000a900460ff161515156119c757600080fd5b6002546009819055506001600660016101000a81548160ff0219169083151502179055506001600660006101000a81548160ff021916908315150217905550426007819055507faac5ae2dfd439bb6c2f88b2d8af5b285cfee7584ad0d13ae7c00c1226c7c4c7b60405160405180910390a1565b600660009054906101000a900460ff16151515611a5757600080fd5b611a6081611c21565b7f8d272c75acbe64f584f00b43ea2e4ac139abac8e8b8f118e5588e14bbb5c40313382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835284818151815260200191508051906020019080838360005b83811015611af9578082015181840152602081019050611ade565b50505050905090810190601f168015611b265780820380516001836020036101000a031916815260200191505b5083810382526000815260200160200194505050505060405180910390a150565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611ba257600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515611bde57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60025434141515611c3157600080fd5b600354600454101515611c4357600080fd5b611c4c336118af565b151515611c5857600080fd5b60046000815480929190600101919050555033600d6000600454815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506080604051908101604052808281526020013373ffffffffffffffffffffffffffffffffffffffff16815260200160001515815260200160001515815250600c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000019080519060200190611d57929190611de5565b5060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160010160146101000a81548160ff02191690831515021790555060608201518160010160156101000a81548160ff02191690831515021790555090505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611e2657805160ff1916838001178555611e54565b82800160010185558215611e54579182015b82811115611e53578251825591602001919060010190611e38565b5b509050611e619190611e65565b5090565b611e8791905b80821115611e83576000816000905550600101611e6b565b5090565b905600a165627a7a72305820f861ace657b3f38eb82ec8c7a6f61ffe7e05549b0bef82047c0a6c8421b5fd150029';
          var gas = 2700000;
          var fee = 2060020000000000;
          $service.contractNew(param,abi,code,gas,fee).then(function (addr){
            console.log(addr);
            event.address = addr;

            ctx.addLocalEvent(event);

            $service.popupAlert('Deploy Ok','Contract create at <br/>' + addr).then(function(res){
              
            });

          }, function(err){
              $service.popupAlert('Error','Something is wrong! <br/>' + err.message);
          }, function(tx){
            console.log(tx);
            event.transaction = tx;
            ctx.addLocalEvent(event);
          });
        }
    }

    return {
        run: _init,
        exit: _exit
    };

})();