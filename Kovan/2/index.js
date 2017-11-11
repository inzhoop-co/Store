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
		$scope.logoToken = 'img/ethereum-icon.png'; //Dapp.Path + 'digix-logo.png';

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
		rates: function(token){
			var value = dappContract.getRate(dappContract.ETH_TOKEN_ADDRESS(), token.Address, 1);
			console.log(token.Address, value);
			return value[2] * 1;
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

