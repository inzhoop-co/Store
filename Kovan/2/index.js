var dappleth = (function(){
	var dappContract;
	var Dapp;
	var ABI;
	var reverseContract;

	var _init = function(core) {
		$scope = core.scope;
		$service = core.service;

		Dapp = $scope.Dapp.activeApp;
		dappContract = web3.eth.contract(Dapp.Contracts[0].ABI).at(Dapp.Contracts[0].Address);
		reverseContract = web3.eth.contract(Dapp.Contracts[1].ABI).at(Dapp.Contracts[1].Address);
		$scope.listRates=[];
		

		angular.extend($scope, context);
		_start();		
	}

	var _start = function(){
		$scope.listRates.push({'pair': 'ETH - GNT', 'rate': 1033.89046200, 'balance': 1.00});
		$scope.listRates.push({'pair': 'GNT - ETH', 'rate': 0.00096722, 'balance': 5.20});

	}

	var _exit = function(){
        //clean enviroment
    }

	var context = {
		dappRefresh: function(value){
			$scope.$broadcast('scroll.refreshComplete');
		},
		myBalance: function(){
			return $service.balance()
		},
		getETHPrice: function(tokenAddr){
			var pairs = dappContract.getPairInfo(0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee,tokenAddr);
			console.log(pairs);
			//var price = dappContract.getPairInfo(0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee,tokenAddr);
			//console.log(tokenAddr, price);
			//return price*1;
		},
		getPrice: function(source,dest){
			//var price = dappContract.getPrice(source,dest);
			//console.log(tokenAddr, price);
			//return price*1;
		},
		buy: function(coin){
			alert('to do...');
      		$service.closeOptionButtons();
		},
		openMenu: function(){
			$service.toggleRight();
		}
	}
	
	return {
		run: _init,
		exit: _exit
	};

})();

