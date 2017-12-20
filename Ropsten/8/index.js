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
		//install contract on global variable dappContract (could be an array of contracts)
		tokenContract = web3.eth.contract(Dapp.Contracts[0].ABI).at(Dapp.Contracts[0].Address);
		saleContract = web3.eth.contract(Dapp.Contracts[1].ABI).at(Dapp.Contracts[1].Address);

		$scope.tokenPrice = saleContract.finalPrice().toNumber() / 1e18;
		$scope.endDate = saleContract.endTime().toNumber() * 1000;
		$scope.state = saleContract.stage().toNumber();

		$scope.myAddress = $service.address();

		//extend angular core scope with the scope of this Dapps		
		angular.extend($scope, context);	
		$scope.dappRefresh();
			
	}

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
			$scope.totTokens();
			$scope.onSaleTokens();
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
		balanceToken: function(){
			var unit = '1e+' + tokenContract.decimals();
			var balance = parseFloat(tokenContract.balanceOf($scope.myAddress).toNumber()/ unit).toFixed(tokenContract.decimals());
			return balance;
		},
		buy: function(val){
			var gasLimit = 3000000;
			var gasPrice = web3.eth.gasPrice;
			var amount = web3.toWei(val);
			$service.transactionCallNoParam(saleContract,"bid",amount,gasLimit,gasPrice).then(function(res){
				$service.popupAlert("OK","Transaction sent. Wait and check your balance");
				$scope.dappRefresh();
			});
		},
		sendEth: function(val){
			var gasLimit = 3000000;
			var gasPrice = web3.eth.gasPrice;

			web3.eth.sendTransaction({
            from: $scope.myAddress,
            to: tokenContract.Address,
            value: web3.toWei(val),
            gasPrice: gPrice,
            gas: gasLimit
          }, function (err, hash) {
          	console.log(err,hash);
          });
		},
		totTokens: function(){
			var reserve =saleContract.RESERVED_TOKENS().toNumber();
			var onsale = saleContract.MAX_TOKENS_SOLD().toNumber();
			var amount = reserve + onsale;
			$scope.totAmount = parseFloat(amount).toFixed(tokenContract.decimals());
		},
		onSaleTokens: function(){
			var sold = tokenContract.totalSupply();
			var onsale = saleContract.MAX_TOKENS_SOLD().toNumber()*('1e' + tokenContract.decimals());
			var amount=(onsale - sold) /  ('1e' + tokenContract.decimals());
			$scope.onSale = parseFloat(amount).toFixed(tokenContract.decimals());
		}
	};
	
	//don't edit: start and end functions called externally
	return {
		run: _init,
		exit: _exit
	};
})();

