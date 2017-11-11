var dappleth = (function(){
	var dappContract;
	var Dapp;
	var ABI;

	var _init = function(core) {
		$scope = core.scope;
		$service = core.service;

		Dapp = $scope.Dapp.activeApp;
		Dapp.Address = "0x241702db94b4ff17429c749925f16ae5f0929668";
		Dapp.ABI = '[{"constant":false,"inputs":[{"name":"reserve","type":"address"},{"name":"source","type":"address"},{"name":"dest","type":"address"},{"name":"add","type":"bool"}],"name":"listPairForReserve","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"upgrade","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"name":"","type":"address[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ETH_TOKEN_ADDRESS","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"reserves","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"source","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"throwOnFailure","type":"bool"}],"name":"trade","outputs":[{"name":"","type":"uint256"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"reserve","type":"address"},{"name":"add","type":"bool"}],"name":"addReserve","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"source","type":"address"},{"name":"dest","type":"address"}],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getNumReserves","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"source","type":"address"},{"name":"dest","type":"address"},{"name":"reserveIndex","type":"uint256"}],"name":"getRate","outputs":[{"name":"rate","type":"uint256"},{"name":"expBlock","type":"uint256"},{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"source","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"throwOnFailure","type":"bool"},{"name":"walletId","type":"bytes32"}],"name":"walletTrade","outputs":[{"name":"","type":"uint256"}],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"origin","type":"address"},{"indexed":false,"name":"error","type":"uint256"},{"indexed":false,"name":"errorInfo","type":"uint256"}],"name":"ErrorReport","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"source","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"actualSrcAmount","type":"uint256"},{"indexed":false,"name":"actualDestAmount","type":"uint256"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reserve","type":"address"},{"indexed":false,"name":"add","type":"bool"}],"name":"AddReserve","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"reserve","type":"address"},{"indexed":false,"name":"source","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"add","type":"bool"}],"name":"ListPairsForReserve","type":"event"}]';

		
		_start();		
	}

	var _exit = function(){
        //
    }

	var _start = function() {
		$scope.slideIndex=0;
		$scope.Dapp.read = true;

		$scope.dappRefresh = function(value){
			$D.scope.$broadcast('scroll.refreshComplete');
		}

		$scope.isRead = function(value){
			$scope.Dapp.read = value;
		}

		$scope.next = function() {
			$service.nextSlide();
		};

		$scope.previous = function() {
			$service.prevSlide();
			$scope.start= false;
		};

		$scope.startApp = function() {
			$scope.start= true;
		};

		$scope.slideChanged = function(index) {
		   $scope.slideIndex = index;
		};

		$scope.install = function() {
			$scope.Dapp.functions = JSON.parse(Dapp.ABI);
			dappContract = web3.eth.contract($scope.Dapp.functions).at(Dapp.Address);
			$service.nextSlide();
		};

		$scope.funCall = function(f) {
			if($scope.Dapp.read){
				var res = dappContract[f].apply();
				$service.popupAlert("Call " + f, res);
			}
		};
	}
	
	return {
		run: _init,
		exit: _exit
	};

})();

