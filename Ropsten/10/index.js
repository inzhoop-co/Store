var dappleth = (function(){
	//global variables
	var Dapp;
	var dappContract;
	var favorToken;
    var modalPage;
    var friendAddressMap;
    var friendList;
    var pendingTransactions; //pending transactions of received favors
    var receivedFavorEventTopic = "0xc660321bab577202f59dc91e94b154d169f03907e4bfa02a26d0dcdbcc0e0486";
    var addedFriendEventTopic = "0x0fbde3291bf3d63d0e6eb1ab37390f2d27b3eb91810b3274a9e7e2ea86272094";
    var requestedConfirmationEventTopic = "0x4f7b02ae16f4fbd991a7af310bb7a5f4d634d4657bea9833be197529ecdda3eb";
    var filterPrefix = "0x000000000000000000000000";
    var favorNames = [];
    var blockChainFavors = [];
    var currentPriceWei = 0;
    var currentPriceEth = 0;
    var friendsToLoad = [];
    var tips = [
        "Swipe left over a contact to see options or tap contact to see favors.",
        "When someone does you a favor, send them a Favor Token."
    ];
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
        friendList = [];
        $scope.friends.forEach(function(usr) {
            var frObj = {me:{}, them:{}, confirmations:{},name:usr.name, icon:usr.icon, addr:usr.addr};
            friendAddressMap[usr.addr] = frObj;
            friendList.push(frObj);
        });
        //context.getFavorNames();
        context.getFavorPrice();
        $service.loadingOn();
        //extend angular core scope with the scope of this Dapps
        angular.extend($scope, context);
        context.updatePendingTransactions(function() {
            continueInit($scope, $service);
            $service.loadingOff();
        });

	};

    var continueInit = function(scope, service) {
        favorNames = service.getKey(Dapp.GUID,'favorNames');
        if(!favorNames) {
            favorNames = ["Just a favor", "Paid for coffee"];
            tips.push("We have added a couple of common favors for you: 'Paid for coffee' and 'Just a favor', so you can get started. Tap 'Manage favors' to create your own.");
            currentTip = (tips.length - 1);
        } else {
            var cleanNames = [];
            for(var i in favorNames) {
                if(favorNames[i]) {
                    cleanNames.push(favorNames[i]);
                }
            }
            favorNames = cleanNames;
            service.storeData(Dapp.GUID, "favorNames", favorNames);
        }
        currentTip = service.getKey(Dapp.GUID,'currentTip') % tips.length;
        if(!currentTip) {
            currentTip = 0;
        }
    }

	//exit internal method
	var _exit = function(){
        //called externally on closing Dappleth
        //write here function to clean enviroment befor leave
        console.log('bye bye');
    };

    var loadNextFriendName = function(cb) {
        if(friendsToLoad.length > 0) {
            var nextAddr = friendsToLoad.pop();
            if(nextAddr) {
                $scope.loadFriendName(nextAddr, null, function(err, friendName) {
                    loadNextFriendName(cb);
                });
            } else {
                cb();
            }
        } else {
            cb();
        }
    };

    //container for function binded on UI 
	var context = {
		//generic function called on refresh
		dappRefresh: function(value){
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
        loadFriendName: function(addr, nameToAdd, cb) {
            dappContract.getFriend(addr, {'from':$service.address()}, function(error, friendName) {
                if(error) {
                    console.log("Error in getFriend: ", error)
                    if(cb) {
                        cb(error, null);
                    }
                } else {
                    console.log("Received friend name in hex", friendName);
                    var stringName = null;
                    if(friendName == "0x0000000000000000000000000000000000000000000000000000000000000000") {
                        console.log("Friend name not found for " + addr);
                        if(nameToAdd) {
                            var gasLimit = 3000000;
                            var gasPrice = web3.eth.gasPrice;
                            dappContract.addFriend(addr, web3.fromAscii(nameToAdd), {'from':$service.address(), 'gas': gasLimit, 'gasPrice' : gasPrice}, function(error, result) {
                                if(error) {
                                    if(cb) {
                                        cb(error, nameToAdd);
                                    }
                                } else if(result) {
                                    console.log("addFriend succeeded. Transaction hash", result);
                                    if(cb) {
                                        cb(null, nameToAdd);
                                    }
                                }
                            })
                        }
                    } else {
                        stringName = web3.toAscii(friendName).replace(/\0/g, '');
                        console.log("Found friend name " + stringName);
                        friendAddressMap[addr].name = stringName;
                        var found = false;
                        for(var i in friendList) {
                            if(friendList[i].name == stringName) {
                                found = true;
                                break;
                            }
                        }

                        if(!found) {
                            friendList.push(friendAddressMap[addr]);
                        }

                        if(cb) {
                            cb(null, stringName);
                        }
                    }

                }
            })
        },
		getFriends: function(){
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
        getFavorPrice: function(cb) {
		  var price = dappContract.price(function(error, result) {
		      if(error) {
                  $service.popupAlert("Error", "Failed to get current price for Favor Token " + error);
              } else {
		          currentPriceWei = result.toNumber();
                  currentPriceEth = web3.fromWei(result.toNumber(),'ether');
              }
              if(cb) {
		          cb(error, currentPriceEth);
              }
          });
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
        getPerformedFavors: function(favor) {
            return this.currentContact.me[favor] ? this.currentContact.me[favor] : "0";
        },
        getReceivedFavors: function(favor) {
            return this.currentContact.them[favor] ? this.currentContact.them[favor] : "0";
        },
        updatePendingTransactions: function(cb) {
			console.log("Will load transactions");
            $service.loadingOn();
            for(var i in friendAddressMap) {
                friendAddressMap[i].me = {};
                friendAddressMap[i].them = {};
            }
			try {
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
                            if(events[i].topics && events[i].topics[3]) {
                                var favorName = web3.toAscii(events[i].topics[3]).replace(/\0/g, '');
                                if(favorNames.indexOf(favorName) < 0) {
                                    favorNames.push(favorName);
                                    console.log("Added favor name ",favorName);
                                    $service.storeData(Dapp.GUID, "favorNames", favorNames);
                                }
                                blockChainFavors.push(favorName);
                                var numFavors = parseInt(events[i].data.replace(filterPrefix,""));
                                var friendAddress = events[i].topics[1].replace(filterPrefix, "0x");
                                console.log("Found transaction of giving ",numFavors,favorName, "to",friendAddress);
                                if (friendAddressMap) {
                                    var fObj = friendAddressMap[friendAddress];
                                    if (!fObj) {
                                        fObj = {me:{}, them:{}, confirmations:{},name:"", icon:"", addr:friendAddress};
                                        friendAddressMap[friendAddress] = fObj;
                                        friendsToLoad.push(friendAddress);
                                        //$scope.loadFriendName(friendAddress, null, null);
                                    }
                                    if(fObj.me[favorName]) {
                                        fObj.me[favorName] += numFavors;
                                    } else {
                                        fObj.me[favorName] = numFavors;
                                    }
                                }
                            }
                            //console.log("Hash of given favor TX ", txHash);
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
                                    if(events[i].topics && events[i].topics[3]) {
                                        var favorName = web3.toAscii(events[i].topics[3]).replace(/\0/g, '');
                                        if(favorNames.indexOf(favorName) < 0) {
                                            favorNames.push(favorName);
                                            console.log("Added favor name ",favorName);
                                            $service.storeData(Dapp.GUID, "favorNames", favorNames);
                                        }
                                        blockChainFavors.push(favorName);
                                        var numFavors = parseInt(events[i].data.replace(filterPrefix,""));
                                        var friendAddress = events[i].topics[2].replace(filterPrefix, "0x");
                                        console.log("Found transaction of receiving ",numFavors,favorName, "from",friendAddress);
                                        if (friendAddressMap) {
                                            var fObj = friendAddressMap[friendAddress];
                                            if (!fObj) {
                                                fObj = {me:{}, them:{}, confirmations:{},name:"", icon:"", addr:friendAddress};
                                                friendAddressMap[friendAddress] = fObj;
                                                friendsToLoad.push(friendAddress);
                                                //$scope.loadFriendName(friendAddress, null, null);
                                            }
                                            if(fObj.them[favorName]) {
                                                fObj.them[favorName] += numFavors;
                                            } else {
                                                fObj.them[favorName] = numFavors;
                                            }
                                        }
                                    }
                                    //console.log("Hash of received favor TX ", txHash);
                                    //console.log("Transaction details",JSON.stringify(events[i]));
                                    $scope.markTransactionComplete(txHash);
                                }
                                console.log("Finished loading transactions");
                                if(friendsToLoad.length > 0) {
                                    loadNextFriendName(cb);
                                } else {
                                    cb(null);
                                }
                            }
                        });
                    }
                });
            } catch (err) {
			    console.log("Failed to get pending events");
			    cb(err);
            }

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
                    cb(null);
                	//$scope.getScoresForOneFriendInternal(friendAddress, favorList, index, cb);
            	}
        	});
    	},
        buyTokens:function () {
            console.log("tapped buy tokens ",this.howMany,"at",currentPriceWei,"wei (",currentPriceEth," ETH)");
            var gasLimit = 3000000;
            var gasPrice = web3.eth.gasPrice;
            //var value = web3.toWei(currentPrice * this.howMany, 'ether');
            var amount = this.howMany;
            var value = currentPriceWei * amount;
            var params = [$service.address()];
            console.log("Sending ",value,"to Turnsy");
            /*dappContract.buyTokens($service.address(), {'value':value, 'gas': gasLimit, 'gasPrice' : gasPrice}, function(error, txHash) {
                if(error) {
                    console.log("Error", error);
                }
                if(txHash) {
                    console.log("transaction hash", txHash);
                } else {
                    console.log("Error: empty transaction hash");
                }
            });*/
            $service.transactionCall(dappContract, "buyTokens", params, value, gasLimit, gasPrice).then(
                function(txHash) {
                    if(!txHash) {
                        console.log("Error: empty transaction hash");
                        $service.popupAlert("Error", "Transaction failed");
                    } else if(txHash instanceof Array && txHash[0]) {
                        console.log("Error", txHash[0]);
                        $service.popupAlert("Error", txHash[0]);
                    } else if(txHash instanceof Array && txHash[1]) {
                        console.log("transaction hash", txHash[1]);
                        $service.popupAlert("Success", "You purchased " + amount + " Favor Tokens. Your balance may take a minute to update.");
                    } else {
                        $service.popupAlert("Error", "Transaction failed" + txHash);
                        console.log("transaction hash", txHash);
                    }
                },
                function(error) {
                    $service.loadingOff();
                    if(error) {
                        console.log("Error", error);
                        $service.popupAlert("Error", error);
                    }
                }
            );
        },
        sendToken: function(favor) {
            try {
                $service.closeOptionButtons();
            } catch (ex) {
                //ignore
            }
            $service.loadingOn();
            var selectedFavor = favor ? favor : this.selectedFavor;
            console.log("tapped send token for",selectedFavor);
            if(this.getMyFavorBalance() < 1) {
                $service.loadingOff();
                $service.popupAlert("Error", "You do not have a token to send. You need to earn or buy a token before you can send it.");
            } else {
               var gasLimit = 3000000;
               var gasPrice = web3.eth.gasPrice;
               var ctx = this;
               $scope.loadFriendName(ctx.currentContact.addr, ctx.currentContact.name, function(error, friendName) {
                   if(error) {
                       $service.loadingOff();
                       console.log("Error", error);
                       $service.popupAlert("Error", "Failed to load friend from blockchain:" + error);
                   } else {
                       dappContract.receiveFavor(ctx.currentContact.addr, web3.fromAscii(selectedFavor), 1, {'from':$service.address(), 'gas': gasLimit, 'gasPrice' : gasPrice}, function(error, txHash) {
                           if(error) {
                               $service.loadingOff();
                               console.log("Error", error);
                               $service.popupAlert("Error", "Transaction failed:" + error);
                           } else if(txHash) {
                               $service.loadingOff();
                               console.log("transaction hash", txHash);
                               if(!pendingTransactions) {
                                   pendingTransactions = {};
                               }
                               pendingTransactions[txHash] = ctx.currentContact.addr;
                               $service.storeData(Dapp.GUID, "pendingTransactions", pendingTransactions);
                               $service.popupAlert("Success", "You sent a Favor Token to " + ctx.currentContact.name + " for " + selectedFavor + ". Transaction hash:" + txHash);
                           } else {
                               $service.loadingOff();
                               console.log("Error: empty transaction hash");
                               $service.popupAlert("Error", "Transaction failed: 'Empty transaction hash'");
                           }
                       });
                   }

               })

            }
        },
        deleteFavorName: function(favorName, ctx) {
            $service.loadingOn();
            console.log("Deleting favor", favorName);
            var cleanFavorNames = [];
            for(var i in favorNames) {
                if(favorNames[i] && favorNames[i] != favorName) {
                    cleanFavorNames.push(favorNames[i]);
                }
            }
            favorNames = cleanFavorNames;
            this.favorNames = favorNames;
            $service.storeData(Dapp.GUID, "favorNames", favorNames);
            try {
                $service.closeOptionButtons();
            } catch (ex) {
                //ignore
            }
            this.closeFavorsDialog();
            this.openFavorsDialog();
            $service.loadingOff();
        },
        addNewFavorName: function() {
            console.log("Adding new favor", this.newFavorName);
            var cleanFavorNames = [];
            cleanFavorNames.push(this.newFavorName);
            for(var i in favorNames) {
                if(favorNames[i]) {
                    cleanFavorNames.push(favorNames[i]);
                }
            }
            favorNames = cleanFavorNames;
            this.favorNames = favorNames;
            $service.storeData(Dapp.GUID, "favorNames", favorNames);
            this.newFavorName = "";
        },
        getFavorNames: function() {
            $service.loadingOn();
            try {
                console.log(dappContract.getUserFavors());
            } catch (ex) {
                console.log(ex);
            }

            dappContract.getUserFavors({'from':$service.address()},
            	function(error, result) {
                    if(error) {
                        console.log("Failed to find user's favor names", error)
                        $service.loadingOff();
                    } else {
                        blockChainFavors = [];
                        console.log("Found favor names " + JSON.stringify(result))
                        if(result && result instanceof Array && result.length > 0) {
                            for(var i = 0; i < result.length; i++) {
                                var favorName = web3.toAscii(result[i]).replace(/\0/g, '');
                                if(favorNames.indexOf(favorName) < 0) {
                                    favorNames.push(favorName);
                                    console.log("Added favor name ",favorName);
                                }
                                blockChainFavors.push(favorName);
                            }
                            $service.storeData(Dapp.GUID, "favorNames", favorNames);
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
        openSendDialog: function(user) {
			try {
				modalPage = $service.pageModal();
				$scope.favorNames = favorNames;
				$scope.currentContact = friendAddressMap[user.addr];
                $scope.selectedFavor = favorNames[0];
                try {
                    $service.closeOptionButtons();
                } catch (ex) {
                    //ignore
                }
                modalPage.fromTemplateUrl(Dapp.Path + 'send.html', {
					scope: $scope,
					animation: 'slide-in-up'
				}).then(function (modal) {
                    modalPage = modal;
                    modalPage.show();
					console.log('opened send.html');
				});
			} catch (err) {
				$service.popupAlert("Error", "Something failed " + err);
			}
		},
		openUserDialog: function(user) {
            $service.loadingOn();
            $scope.getScoresForOneFriend(user.addr, favorNames, 0, function(err) {
                $service.loadingOff();
                try {
                    $service.closeOptionButtons();
                } catch (ex) {
                    //ignore
                }
            	if(err) {
                    $service.popupAlert("error", err);
				} else {
            	    try {
                        modalPage = $service.pageModal();
                        $scope.favorNames = favorNames;
                        $scope.currentContact = friendAddressMap[user.addr];
                        $scope.selectedFavor = favorNames[0];
                        modalPage.fromTemplateUrl(Dapp.Path + 'user.html', {
                            scope: $scope,
                            animation: 'slide-in-up'
                        }).then(function (modal) {
                            modalPage = modal;
                            modalPage.show();
                            console.log('opened user.html');
                        });
                    } catch (err) {
                        $service.popupAlert("Error", "Something failed " + err);
                    }
				}
            });
		},
        openFavorsDialog: function() {
            try {
                modalPage = $service.pageModal();
                $scope.favorNames = favorNames;
                $scope.newFavorName = "";
                $scope.blockChainFavors = blockChainFavors;
                try {
                    $service.closeOptionButtons();
                } catch (ex) {
                    //ignore
                }
                modalPage.fromTemplateUrl(Dapp.Path + 'favors.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    modalPage = modal;
                    modalPage.show();
                    console.log('opened favors.html');
                });
            } catch (err) {
                $service.popupAlert("Error", "Something failed " + err);
            }
        },
        openBuyDialog: function() {
            $service.loadingOn();
            $scope.getFavorPrice(function(err, priceEth) {
                $service.loadingOff();
                try {
                    $service.closeOptionButtons();
                } catch (ex) {
                    //ignore
                }

                try {
                    modalPage = $service.pageModal();
                    $scope.currentPriceEth = priceEth;
                    modalPage.fromTemplateUrl(Dapp.Path + 'buy.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        modalPage = modal;
                        modalPage.show();
                        console.log('opened buy.html');
                    });
                } catch (err) {
                    $service.popupAlert("Error", "Something failed " + err);
                }
            })
        },
        closeBuyDialog: function(){
            modalPage.hide();
            modalPage.remove();
        },
        closeUserDialog: function(){
            modalPage.hide();
            modalPage.remove();
        },
        closeFavorsDialog: function(){
            modalPage.hide();
            modalPage.remove();
        },
        closeSendDialog: function(){
            modalPage.hide();
            modalPage.remove();
        }
	};
	
	//don't edit: start and end functions called externally
	return {
		run: _init,
		exit: _exit
	};
})();

