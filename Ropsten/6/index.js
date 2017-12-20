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

		$scope.myAddress = $service.address();
		$scope.orderType='state';
		//extend angular core scope with the scope of this Dapps
		angular.extend($scope, context);	

		_start();	
	}

	var _start= function(){
		$scope.fetchAllBOPs();
		$scope.dappRefresh()
	};

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
	    balance: new web3.BigNumber(state[4]).toNumber() / 1.0e18 ,
	    serviceDeposit: new web3.BigNumber(state[5]),
	    amountDeposited: new web3.BigNumber(state[6]),
	    amountBurned: new web3.BigNumber(state[7]),
	    amountReleased: new web3.BigNumber(state[8]),
	    autoreleaseInterval: new web3.BigNumber(state[9]),
	    autoreleaseTime: new web3.BigNumber(state[10])
	  };
	  listBOPs.push(BOP);
	};

	var _callNewBOP = function(valueInEth, payer, serviceDepositInEth, autoreleaseIntervalInDays, title, initialPayerStatement) {
	    var valueInWei = web3.toWei(valueInEth, 'ether');
	    var serviceDepositInWei = web3.toWei(serviceDepositInEth, 'ether');
	    var autoreleaseIntervalInSeconds = autoreleaseIntervalInDays*24*60*60;

		var gasPrice = web3.eth.gasPrice; 
		var gasLimit = 3000000;

	    BOPFactory.newBurnableOpenPayment(payer, serviceDepositInWei, 
	    			autoreleaseIntervalInSeconds, title, initialPayerStatement, 
					{'from': payer, 'value': valueInWei, 
					'gas': gasLimit, 'gasPrice' : gasPrice}, 
					_handleNewBOPResult);
	};

	var _handleNewBOPResult = function(err, res) {
	  if (err) 
	  	alert(err.message);
	  else {
	    console.log(res);
	  }
	};

	function _web3CallbackLogIfError(err, res) {
	  if (err) console.log(err.message);
	  $scope.dappRefresh();
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
		chooseSort: function(){
			var actionSheet = $service.actionSheet();
			var hideSheet = actionSheet.show({
		      buttons: [
		        { text: '<i class="ion-bag"></i> Balance'  },
		        { text: '<i class="ion-flag"></i> State' },
		        { text: '<i class="ion-help-buoy"></i> ...' }

		      ],
		      titleText: 'Sort by',
		      destructiveButtonClicked:  function() {
		        hideSheet();
		      },
		      buttonClicked: function(index) {
		      	switch(this.buttons[index].index){
		          case 0: // invite friend
		          	$scope.orderType = 'balance';
		            break;
		          case 1: // invite friend
		          	$scope.orderType = 'state';
		            break;
		        }
				hideSheet();

		        $scope.dappRefresh();
		      }
		    });
		},
		createBOP: function(form){
			console.log('create called!');
			var valueInEth = form.amount;
			var payer = $scope.myAddress;
			var serviceDepositInEth = form.deposit;
			var autoreleaseIntervalInDays = form.release;
			var title = form.title;
			var initialPayerStatement = form.statement;		

			_callNewBOP(valueInEth, payer, serviceDepositInEth, autoreleaseIntervalInDays, title, initialPayerStatement);

		},
		callCommit: function(address) {
			console.log(address);
			var BOP = web3.eth.contract(Dapp.Contracts[1].ABI).at(address);
		  	BOP.commit({'from': $scope.myAddress,'value': BOP.serviceDeposit(), 'gas':300000, 'gasPrice' : web3.eth.gasPrice}, _web3CallbackLogIfError);
		},
		callRelease: function(index,amountInWei) {
		  listBOPs[index].release(amountInWei, {'gas':300000}, web3CallbackLogIfError);
		},
	 	callBurn: function(index,amountInWei) {
		  listBOPs[index].burn(amountInWei, {'gas':300000}, web3CallbackLogIfError);
		},
		callBurn: function(index, amountInWei) {
		  listBOPs[index].burn(amountInWei, {'gas':300000}, web3CallbackLogIfError);
		},
		callAddFunds: function(index,includedEth) {
			listBOPs[index].addFunds({'value':web3.toWei(includedEth,'ether')}, web3CallbackLogIfError)
		},
		delayAutorelease: function(index) {
			listBOPs[index].delayAutorelease(web3CallbackLogIfError);
		},
		triggerAutorelease: function(index) {
	  		listBOPs[index].triggerAutorelease(web3CallbackLogIfError);
		},
		callRecoverFunds: function(index) {
		  listBOPs[index].recoverFunds(web3CallbackLogIfError);
		},
		callLogPayerStatement: function(index,statement) {
		  listBOPs[index].logPayerStatement(statement, web3CallbackLogIfError);
		},
		callLogWorkerStatement: function(index,statement) {
	  		listBOPs[index].logWorkerStatement(statement, web3CallbackLogIfError);
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
		openBOPInfo: function(BOP){
			$scope.BOP = BOP;
			infoModal = $service.pageModal();		
		    infoModal.fromTemplateUrl(Dapp.Path + 'info.html', {
		      scope: $scope,
		      animation: 'slide-in-up'
		    }).then(function (modal) {
		      infoModal = modal;
		      infoModal.show();
		      console.log('modal opened!');
		    });
		},
		closeInfoModal: function(){
			infoModal.hide();
		    infoModal.remove();
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

