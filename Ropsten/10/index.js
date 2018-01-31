var dappleth = (function(){
	//global variables
	var Dapp;
	var dappContract;
	var favorToken;

	//init internal methods
	var _init = function(core) {
		//use menmonic $scope variable for core functions and scope
		$scope = core.scope;
		//use mnemonic $service variable for core API
		$service = core.service;
		//use mnemonic Dapp variable for current Dappleth
		Dapp = $scope.Dapp.activeApp;
		//install contract on global variable dappContract (could be an array of contracts)
		dappContract = web3.eth.contract(Dapp.Contracts[0].ABI).at(Dapp.Contracts[0].Address);
		//reference to token contract
		favorToken = web3.eth.contract(Dapp.Contracts[1].ABI).at(Dapp.Contracts[0].Address);
		//extend angular core scope with the scope of this Dapps		
		angular.extend($scope, context);		
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
		favorFriends: function(){
			//friend's list + flavor balance
			var list = [];
			$scope.friends.forEach(function(usr) {
				usr.favorBalance = $scope.getFavorBalance(usr.addr);
				list.push(usr);
			});

			var favList = dappContract.getUserFavors();
			console.log(favList);

			return list;
		},
		//basic void sample function
		getFavorBalance: function(addr){
			var bal = favorToken.balanceOf(addr).toNumber();
			return bal;
		},
		ownFavor: function(user){
			//dappContract.addFriend(user.addr, user.name);
			$service.popupAlert('OWN YOU FAVOR',"to do...");
		}
	};
	
	//don't edit: start and end functions called externally
	return {
		run: _init,
		exit: _exit
	};
})();

