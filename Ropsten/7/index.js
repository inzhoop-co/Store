var dappleth = (function(){
	//global variables
	var Dapp;
	var dappContract;

	//init internal methods
	var _init = function(core) {
		//use menmonic $scope variable for core functions and scope
		$scope = core.scope;
		//use mnemonic $service variable for core API
		$service = core.service;
		//use mnemonic Dapp variable for current Dappleth
		Dapp = $scope.Dapp.activeApp;

		$scope.myAddress = $service.address();
		
		//install contract on global variable dappContract (could be an array of contracts)
		tokenContract = web3.eth.contract(Dapp.Contracts[0].ABI).at(Dapp.Contracts[0].Address);
		saleContract = web3.eth.contract(Dapp.Contracts[1].ABI).at(Dapp.Contracts[1].Address);
		//pre sale
		tokenGenesisContract = web3.eth.contract(Dapp.Contracts[2].ABI).at(Dapp.Contracts[2].Address);
		claimContract = web3.eth.contract(Dapp.Contracts[3].ABI).at(Dapp.Contracts[3].Address);

		$scope.preSymbol = tokenGenesisContract.symbol(); 
		$scope.saleSymbol = tokenContract.symbol(); 
		$scope.formData = {};
		
		_update();
		
		//extend angular core scope with the scope of this Dapps		
		angular.extend($scope, context);		
	}

	var _balanceHbg = function(){
		var unit = '1e+' + tokenGenesisContract.decimals();
		var balance = parseFloat(tokenGenesisContract.balanceOf($scope.myAddress).toNumber()/ unit).toFixed(tokenGenesisContract.decimals());
		$scope.balanceHbg = balance;
	};

	var	_balanceHbz = function(){
		var unit = '1e+' + tokenContract.decimals();
		var balance = parseFloat(tokenContract.balanceOf($scope.myAddress).toNumber()/ unit).toFixed(tokenContract.decimals());
		$scope.balanceHbz = balance;
	};

	var _update = function(){
		$scope.toClaim = parseFloat(claimContract.tokenHoldersTotal($scope.myAddress).toNumber()/ ('1e+' + tokenGenesisContract.decimals())).toFixed(tokenGenesisContract.decimals());
		$scope.saleState = saleContract.stage().toNumber();
		$scope.claimReady = claimContract.isReady();
		console.log($scope.saleState);

		$scope.tokenPrice = saleContract.finalPrice().toNumber() / 1e18;
		$scope.endDate = saleContract.endTime().toNumber() * 1000;
		$scope.startDate = saleContract.endTime().toNumber() * 1000;
		$scope.endDatePresale = new Date('12/8/2017');

		if(!$scope.claimReady && $scope.saleState<2){
			$scope.saleState=-2;
			$scope.labelSale = "Sale unvailable";
		}else if($scope.claimReady && $scope.saleState<2){
			$scope.saleState=-1;
			$scope.labelSale = "Presale stage";
		}else if(!$scope.claimReady && $scope.saleState>1){
			$scope.labelSale = "Sale stage";
		}

		var amountPresale = saleContract.preSaleTokens().toNumber();
		var reserve = saleContract.RESERVED_TOKENS().toNumber();
		var onsale = saleContract.MAX_TOKENS_SOLD().toNumber();
		var amountPre = reserve + onsale + amountPresale;
		$scope.totAmount = parseFloat(amountPre).toFixed(tokenContract.decimals());
		
		var sold = tokenContract.totalSupply() - amountPresale;
		var onsale = saleContract.MAX_TOKENS_SOLD().toNumber()*('1e' + tokenContract.decimals());
		var amountSale = (onsale - sold) /  ('1e' + tokenContract.decimals());
		$scope.onSale = parseFloat(amountSale).toFixed(tokenContract.decimals());
		
		_balanceHbg();
		_balanceHbz();
	};

	//exit internal method
	var _exit = function(){
        //called externally on closing Dappleth
        //write here function to clean enviroment befor leave
        console.log('bye bye');
    };

    //container for function binded on UI 
	var context = {
		//generic function called on refresh
		dappRefresh: function(value){
			//...
			_update();
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
		buy: function(value){
			var gasLimit = 3000000;
			var gasPrice = web3.eth.gasPrice;

			web3.eth.sendTransaction({
            from: $scope.myAddress,
            to: saleContract.address,
            value: web3.toWei(value),
            gasPrice: gasPrice,
            gas: gasLimit
          }, function (err, hash) {
          	console.log(err,hash);
          });
		},
		claim: function(){
			var gasLimit = 3000000;
			var gasPrice = web3.eth.gasPrice;

			web3.eth.sendTransaction({
            from: $scope.myAddress,
            to: claimContract.address,
            value: web3.toWei(0),
            gasPrice: gasPrice,
            gas: gasLimit
          }, function (err, hash) {
          	console.log(err,hash);
          });
		}
	};
	
	//don't edit: start and end functions called externally
	return {
		run: _init,
		exit: _exit
	};
})();

