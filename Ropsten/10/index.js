var dappleth = (function(){
	//global variables
	var Dapp;
	var dappContract;
	var favorToken;
    var modalUserPage;
    var friendAddressMap;
    var friendList;
    var pendingTransactions; //pending transactions of received favors
    var receivedFavorEventTopic = "0xc660321bab577202f59dc91e94b154d169f03907e4bfa02a26d0dcdbcc0e0486";
    var addedFriendEventTopic = "0x0fbde3291bf3d63d0e6eb1ab37390f2d27b3eb91810b3274a9e7e2ea86272094";
    var requestedConfirmationEventTopic = "0x4f7b02ae16f4fbd991a7af310bb7a5f4d634d4657bea9833be197529ecdda3eb";
    var filterPrefix = "0x000000000000000000000000";
    var favorNames = [];
    var selectedFavor = "";
    var tips = ["Swipe left over a contact to see options or tap contact to see favors.","When someone does you a favor, send them a Favor Token.","We have added a couple of common favors for you: 'Paid for coffee' and 'Just a favor', so you can get started."];
    var currentTip = 0;
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
		//create local copy of friend objects to store scores
        friendAddressMap = {};
        pendingTransactions = $service.getKey(Dapp.GUID,'pendingTransactions');
        favorNames = $service.getKey(Dapp.GUID,'favorNames');
        if(!favorNames) {
            favorNames = ["Just a favor", "Paid for coffee"];
		}
        friendList = [];
        currentTip = $service.getKey(Dapp.GUID,'currentTip');
        if(!currentTip) {
            currentTip = 0;
        }
		//extend angular core scope with the scope of this Dapps		
		angular.extend($scope, context);
        $scope.getFavorNames();
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
		getFriends: function(){
			if(!friendList || friendList.length == 0) {
                $scope.friends.forEach(function(usr) {
                    var frObj = {me:0, them:0, confirmations:{},name:usr.name, icon:usr.icon, addr:usr.addr};
                    friendAddressMap[usr.addr] = frObj;
                    friendList.push(frObj);
                });
            }
            return friendList;
		},
        nextTip: function() {
            currentTip++;
            currentTip = currentTip % tips.length;
            $service.storeData(Dapp.GUID, "currentTip", currentTip);

        },
        getCurrentTip: function() {
		  return tips[currentTip];
        },
		getMyFavorBalance: function(addr){
			var bal = favorToken.balanceOf($service.address()).toNumber();
			return bal;
		},
        /**
         * fetch number of favors that I need to confirm for this favorName from friendAddress
         * @param friendAddress
         * @param favorName
         * @returns {Promise<never>|Promise<T>}
         */
        getRequestedConfirmations: function(friendAddress, favorName, cb) {
            dappContract.getRequestedConfirmations(friendAddress, $service.address(), web3.fromAscii(favorName),
            	function(error, result) {
                    if(error) {
                        console.log(error);
                        cb(error, 0);
                    } else {
                        var requested = result.toNumber();
                        console.log("Found that I need to confirm",requested,"favors for", favorName);
                        cb(null, requested);
                    }
                });
		},
        updatePendingTransactions: function(cb) {
			var context = this;
			console.log("Will load transactions");
			web3.eth.filter({
				address: Dapp.Contracts[0].Address,
				fromBlock: 0,
				toBlock: 'latest',
				topics: [receivedFavorEventTopic, null, filterPrefix + $service.address().substr(2)]
			}).get(function(error, events) {
                    if (error) {
                        console.log("Failed to load friend scores", error);
                        cb(error);
                    } else {
                        var numEvents = events.length;
                		console.log("Found",numEvents,"given favor transactions")
                		for (var i = 0; i < numEvents; i++) {
                    		var txHash = events[i].transactionHash;
							console.log("Hash of given favor TX ", txHash);
							$scope.markTransactionComplete(txHash);
                		}
					web3.eth.filter({
						address: Dapp.Contracts[0].Address,
						fromBlock: 0,
						toBlock: 'latest',
						topics: [receivedFavorEventTopic, filterPrefix + $service.address().substr(2), null]
					}).get(function(error, events) {
						if (error) {
							cb(error);
						} else {
							var numEvents = events.length;
							console.log("Found",numEvents,"received favor transactions");
							for (var i = 0; i < numEvents; i++) {
								var txHash = events[i].transactionHash;
								console.log("Hash of received favor TX ", txHash);
								$scope.markTransactionComplete(txHash);
							}
							console.log("Finished loading transactions");
							cb(null);
						}
					});
            	}
            });
		},
        markTransactionComplete: function(txHash) {
        	try {
				if(!pendingTransactions) {
					pendingTransactions = {}; //new Map<string /* txhash */,string /* friend address */>();
				}
				if(pendingTransactions) {
					if(pendingTransactions[txHash]) {
						pendingTransactions[txHash] = null;
						console.log("Marked pending transaction complete",txHash);
					}
         	   }
			} catch (error) {
				console.error("failed to mark pending transactions complete");
			}
            $service.storeData(Dapp.GUID, "pendingTransactions", pendingTransactions);
    	},
        getScoresForOneFriend: function(friendAddress, favorList, index, cb) {
        	$scope.updatePendingTransactions(function(error) {
            	if(error) {
            		console.log("failed to update pending transactions", error);
                	cb(error);
            	} else {
            		console.log("Updated pending transactions");
                	$scope.getScoresForOneFriendInternal(friendAddress, favorList, index, cb);
            	}
        	});
    	},
        receiveFavor: function() {

        },
        getFavorNames: function() {
            $service.loadingOn();
            dappContract.getUserFavors(
            	function(error, result) {
                    if(error) {
                        console.log("Failed to find user's favor names", error)
                        $service.loadingOff();
                    } else {
                        console.log("Found favor names " + JSON.stringify(result))
                        if(result && result instanceof Array) {
                            for(var i = 0; i < result.length; i++) {
                                var favorName = web3.toAscii(result[i]).replace(/\0/g, '');
                                if(favorNames.indexOf(favorName) < 0) {
                                    favorNames.push(favorName);
                                    console.log("Added favor name ",favorName);
                                }
                            }
                        }
                        $service.loadingOff();
					}
        		});
    	},
		/**
		 * Computes scores for one friend recursing through the list of favors. To compute the score for a given favor:
		 *  1. fetch received favors from contract
		 *  2. fetch given favors from contract
		 *  3. subtract received favors from given favors
		 *  4. subtract pending transactions from given favors
		 *  5. add 0 balances for any outstanding confirmation requests
		 * @param friendAddress
		 * @param favorList
		 * @param index
		 * @param cb
		 */
        getScoresForOneFriendInternal: function(friendAddress, favorList, index, cb) {
			if(favorList && favorList.length && (index < favorList.length) && favorList[index]) {
            	var favorName = favorList[index];
            	dappContract.getPerformedFavors($service.address(), friendAddress, web3.fromAscii(favorName),
            		function(error, result) {
            			if(error) {
            				console.log("Failed to get received favors", error)
						} else {
                            var toMe = result.toNumber();
                            console.log("I received", toMe, "favors from ", friendAddress, "for", favorName, "on", Dapp.Contracts[0].Address);
                            dappContract.getPerformedFavors(friendAddress, $service.address(), web3.fromAscii(favorName),
                                function (error, result) {
                                    if (error) {
                                        console.log("Failed to get given favors", error)
                                    } else {
                                        var fromMe = result.toNumber();
                                        console.log("I gave", fromMe, "favors to ", friendAddress, "for", favorName, "on", Dapp.Contracts[0].Address);
                                        $scope.getRequestedConfirmations(friendAddress, favorName,
                                            function (error, requestedConfirmations) {
                                                if (error) {
                                                    console.log("Failed to get requested confirmations", error)
                                                } else {
                                                    if (friendAddressMap) {
                                                        var fObj = friendAddressMap[friendAddress];
                                                        if (fObj) {
                                                            if (!fObj.them) {
                                                                fObj.them = {};
                                                            }
                                                            if (!fObj.me) {
                                                                fObj.me = {};
                                                            }
                                                            fObj.them[favorName] = toMe;
                                                            fObj.me[favorName] = fromMe;
                                                            fObj.confirmations[favorName] = requestedConfirmations;
                                                            console.log("Set friend's score for", favorName, "to me:", fObj.me[favorName], " x them:", fObj.them[favorName]);
                                                            if (pendingTransactions) {
                                                                for (var k in pendingTransactions) {
                                                                    var v = pendingTransactions[k];
                                                                    if (v == friendAddress) {
                                                                        var score = fObj.them[favorName] + 1;
                                                                        fObj.them[favorName] = score;
                                                                        friendAddressMap[friendAddress] = fObj;
                                                                        console.log("Updated friend's score for", favorName, "to", fObj.them[favorName]);
                                                                    }
                                                                }
                                                            }
                                                            index++;
                                                            if (favorList.length > index) {
                                                                $scope.getScoresForOneFriendInternal(friendAddress, favorList, index, cb);
                                                            } else {
                                                                cb(null);
                                                            }
                                                        } else {
                                                            console.log("Error! Friend object is null");
                                                            cb(null);
                                                        }
                                                    } else {
                                                        console.log("Error! friendAddressMap is null");
                                                        cb(null);
                                                    }
												}

                                            });
									}
                                });
                        }
                	});
                } else {
                    cb(null);
                }
        },
        openSendTokenDialog: function(user) {
			try {
				modalUserPage = $service.pageModal();
				$scope.favorNames = favorNames;
				$scope.currentContact = friendAddressMap[user.addr];
             //   $service.closeOptionButtons();
				modalUserPage.fromTemplateUrl(Dapp.Path + 'send.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function (modal) {
					modalUserPage = modal;
					modalUserPage.show();
					console.log('opened send.html');
				});
			} catch (err) {
				$service.popupAlert("Error", "Something failed " + err);
			}
		},
		openUser: function(user) {
            $service.loadingOn();
            $scope.getScoresForOneFriend(user.addr, favorNames, 0, function(err) {
                $service.loadingOff();
                //$service.closeOptionButtons();
            	if(err) {
                    $service.popupAlert("error", err);
				} else {
            	    try {
                        modalUserPage = $service.pageModal();
                        $scope.favorNames = favorNames;
                        $scope.currentContact = friendAddressMap[user.addr];
                        $scope.selectedFavor = favorNames[0];
                        modalUserPage.fromTemplateUrl(Dapp.Path + 'user.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            modalUserPage = modal;
                            modalUserPage.show();
                            console.log('opened user.html');
                        });
                    } catch (err) {
                        $service.popupAlert("Error", "Something failed " + err);
                    }

				}

            });
		},
        closerUserPage: function(){
            modalUserPage.hide();
            modalUserPage.remove();
        },
	};
	
	//don't edit: start and end functions called externally
	return {
		run: _init,
		exit: _exit
	};
})();

