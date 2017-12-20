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
		
		$scope.myAddress = $service.address();
		$scope.amount=0;
		$scope.listRates=[];
		$scope.availableTokens = [];
		$scope.logoToken = 'img/ethereum-icon.png'; //Dapp.Path + 'digix-logo.png';

		angular.extend($scope, context);
		_start();		
	}

	var _start = function(){
		//?
		$scope.listRates.push({'pair': 'ETH - GNT', 'rate': 1033.89046200, 'balance': 1.00});
		$scope.listRates.push({'pair': 'GNT - ETH', 'rate': 0.00096722, 'balance': 5.20});
		//!		

		$scope.availableTokens.push({'Name': 'DGD', 'Symbol': 'DGD', 'Decimals': 18, 'Logo': 'digix-logo.png', "Address":'0x62377e0fdb31709c945fc2846155c8aed70f676d'});

		/*
		OMG : 0xf26a8e0fa25fe9e750114e27a46777d49cb8063c
		DGD : 0x94dd60e21ea28c253259adabec45ecb7ccaaa1a2
		CVC : 0x561ef26735743ad6528d341e1ca6f4aaf1ab2482
		FUN : 0x9e5d1d621ef8f8dc12edc405fa285df0df01027f
		MCO : 0xc8d025a88c838819d1a1a2bde1bf101db6b8cbf8
		GNT : 0x3b05f2285125b673f75d035f75598ba120149ab9
		ADX : 0x0c9889bbade045431a3cf50c228f951ad411589e
		PAY : 0x8cf15b2824e98adf24e42f50083fe8f9f9fc6b2a
		BAT : 0x2cf1e1f23c8e3c55461a78b3d7ca106731c37861
		KNC : 0x0461d6ad4be491449aed5cec70528c4d53e6f5de
		EOS : 0x3dcb34be7215275b7036e4c3f16160ab28b1ed70
		LINK : 0x9575de7d78fe1438864cc678539ea86d21b8c7c7
		*/

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
			//console.log(token.Address, value);
			return value[2] * 1;
		},
		getPrice: function(token, amount){
			var res = dappContract.getPrice(dappContract.ETH_TOKEN_ADDRESS(), token.Address);
			res = res.toNumber() / ('1e' + token.Decimals);
			//console.log(res * amount);
			return (res * amount).toFixed(6); // * 1;
		},
		trade: function(token, amount){

			var source = dappContract.ETH_TOKEN_ADDRESS();
			var srcAmount = web3.toWei(amount);
            var dest = token.Address;
            var destAddress = $scope.myAddress;
            var maxDestAmount=250;
            var minConversionRate=1;
            var throwOnFailure=true;
            var walletId=19; 
            var value = web3.toWei(amount);
			var gasLimit = 3000000;
			var gasPrice = web3.eth.gasPrice;
			var params=[];

            params.push(source);
            params.push(srcAmount);
            params.push(dest);
            params.push(destAddress);
            params.push(maxDestAmount);
            params.push(minConversionRate);
            params.push(throwOnFailure);
            params.push(walletId);

            $service.transactionCall(dappContract, "walletTrade", params, value, gasLimit, gasPrice).then(function(res){
            	console.log(res);
            },function(err){
            	console.log(err.message);
            })

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

