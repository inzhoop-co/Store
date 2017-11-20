var dappleth = (function(){
	//global variables
	var Dapp;
	var BOPFactory;
	var BOP_ABI;
	var myModal;
	var listBOPs=[];
	var load;

	//init internal methods
	var _init = function(core) {
		//use menmonic $scope variable for core functions and scope
		$scope = core.scope;
		//use mnemonic $service variable for core API
		$service = core.service;
		//use mnemonic Dapp variable for current Dappleth
		Dapp = $scope.Dapp.activeApp;
		//install contract on global variable dappContract (could be an array of contracts)
		BOPFactory = web3.eth.contract(Dapp.Contracts[0].ABI).at(Dapp.Contracts[0].Address);
		BOPContract = web3.eth.contract(Dapp.Contracts[1].ABI);
		//extend angular core scope with the scope of this Dapps
		angular.extend($scope, context);	

		_start();	
	}

	var _start= function(){
		$scope.fetchAllBOPs();
		$scope.dappRefresh()
	}

	//exit internal method
	var _exit = function(){
        //called externally on closing Dappleth
        //write here function to clean enviroment befor leave
        console.log('bye bye');
    };

	var _processAndAddBOP = function (address, state) {
	  var BOP = {
	    address: address,
	    payer: state[0].toString(),
	  	iconPayer: blockies.create({seed: state[0].toString()}).toDataURL("image/jpeg"),	    
	    title: state[1].toString(),
	    state: new web3.BigNumber(state[2]).toNumber(),
	    worker: state[3].toString(),
	  	iconWorker: blockies.create({seed: state[3].toString()}).toDataURL("image/jpeg"),	    
	    balance: new web3.BigNumber(state[4]).toNumber(),
	    serviceDeposit: new web3.BigNumber(state[5]),
	    amountDeposited: new web3.BigNumber(state[6]),
	    amountBurned: new web3.BigNumber(state[7]),
	    amountReleased: new web3.BigNumber(state[8]),
	    autoreleaseInterval: new web3.BigNumber(state[9]),
	    autoreleaseTime: new web3.BigNumber(state[10])
	  };
	  listBOPs.push(BOP);
	}

    //container for function binded on UI 
	var context = {
		//generic function called on refresh
		dappRefresh: function(value){
			//...
			$scope.$broadcast('scroll.refreshComplete');
		},
		//sample API call to get your balance from UI
		myBalance: function(){
			return $service.balance()
		},
		//exit and return to wallet
		close: function(){
			$service.exit();
		},
		//basic void sample function
		create: function(){
			console.log(dappContract);
			console.log('create called!');
		},
		createModal: function(){
			myModal = $service.pageModal();		
		    myModal.fromTemplateUrl(Dapp.Path + 'modal.html', {
		      scope: $scope,
		      animation: 'slide-in-up'
		    }).then(function (modal) {
		      myModal = modal;
		      myModal.show();
		      console.log('modal opened!');
		    });
		},
		closeModal: function(){
			myModal.hide();
		    myModal.remove();
		},
		getList: function(){
			return listBOPs;
		},
		fetchAllBOPs: function() {
		  //Find number of BOPs stored in Factory "BOPs" array
		  BOPFactory.getBOPCount(function(err,res){
		    if (err) {
		      console.log("Error calling BP method: " + err.message);
		    }
		    else {
		      console.log(res);
		      var numBOPs = new web3.BigNumber(res);
		      //Now we have the BOP count. Iterate through and get address and info for each BOP.
		      var BOPs = [];
		      for (var i=0; i<numBOPs; i++) {
		        BOPFactory.BOPs(i, function(err, res) {
		          if (err) {
		            console.log("Error calling BP method: " + err.message);
		          }
		          else{
		            var BOPAddress = res;
		            //With the address, we can now instantiate a contractInstance for the BOP and call getFullState.
		            (function(BOPAddress) {
		              web3.eth.getCode(BOPAddress, function(err, res){
		                if(err) {
		                  console.log("Error calling BP method: " + err.message);
		                }
		                else if(res !== "0x") {//Ignore all BOPs that have been recoverFunds'd (suicided)
		                  var BOPContractInstance = BOPContract.at(BOPAddress);
		                  BOPContractInstance.getFullState(function(err, res) {
		                    if(err) {
		                      console.log("Error calling BP method: " + err.message);
		                    }
		                    else {
		                      var BOPFullState = res;
		                      _processAndAddBOP(BOPAddress, BOPFullState);
		                    }
		                  });
		                }
		              });
		            })(BOPAddress);
		          }
		        });
		      }
		    }
		  });
		}

	};
	
	//don't edit: start and end functions called externally
	return {
		run: _init,
		exit: _exit
	};
})();

