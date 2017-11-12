# Do you want to deliver your dapp on mobile client?
## Stop writing your own wallet from scratch or fighting in order to make responsive your web dapp, simply write a UI for your smart contract and LETH’s run your code.
- - - -
# Store
Dappleth Store for Inzhoop mobile wallet LETH.
Inzhoop LETH mobile wallet is available in beta test on Google play store, TestFlight iOS and a live web demo (visit Inzhoop.com for details).
To help you develop and test your mobile dapp we provide a web environment running the wallet so you don’t need to install anything expect your preferred IDE.

Inzhoop mobile wallet provide an engine to run thirty part dapps (called Dappleth) without the need to reinvent the wheel.

All you need is the starter kit and a lot of imagination.
- - - -
# Starter Kit
1. Clone the Store folder on your PC.
2. Run a web server pointing to the cloned folder.
You can use [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) to run a local web server from the Store folder:
```
http://127.0.0.1:8887
```

3. Visit the [Leth Development page](http://leth.inzhoop.com/development.html) .
4. Create your wallet (only once).
5. Dappleths listed initially are loaded form official store endpoint.
   You need to use some plugin to enable [CORS-Origin](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) 
6. Input your local URL to setup the wallet pointing to your local store.
7. Now Dappleths are listed from your cloned local store.
8. Edit the Dappleths and refresh wallet page to watch your changes.
9. Just do It
10. [Contact us on gitter](https://gitter.im/inzhoop-leth/dappleths?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

```
We strongly suggest to use Chrome browser
``````

- - - -
# Core.Service (API draft)
Dappleth developers could use (and request for new) some API to use wallet core functions.  Looking into the js code of the starter kit 0 Dappleth, you can find a $service variable  pointing to the core service (API).
On the $service instance you could invoke the following methods:

- exit()
- storeData(GUID,key,value)
- clearData(GUID,key)
- getKey(GUID,key)
- removeKey(GUID,key)
- contractNew(params, abi, datacode, gasLimit, fee)
- address()
- idkey()
- balance ()
- swarmUpload(content)
- swarmDownload(hash) 
- readMessages()
- sendMessage(id,sender,message)
- transactionCall(contract, fname, params, value, gasLimit, gasPrice)
- transactionCallNoParam(contract, fname, value, gasLimit, gasPrice)
- popupConfirm(txtTitle, txtTemplate)
- popupPrompt(txtTitle, txtSubtitle, inputType, inputPlaceholder)
- popupAlert(txtTitle, txtTemplate)
- scanQR() 
- closeOptionButtons()
- actionSheet()
- loadingOn()
- loadingOff()
- loadingFade()
- nextSlide()
- prevSlide()
- toggleLeft()
- toggleRight()
- getPosition()
- loadScripts(list)
- loadCSS(list)
