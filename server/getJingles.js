const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.decenter.com'));

const db = require('./db');
const routes = require('./routes');

const marketplaceAbi = require("../build/contracts/Marketplace");
const marketplaceAddress = "0xc7ec37cd0d01a0c3c9000e97c942b82bd09323b7";
const marketplaceContract = web3.eth.contract(marketplaceAbi.abi).at(marketplaceAddress);

const jinglesAbi = require("../build/contracts/Jingle");
const jinglesAddress = "0xb5840ed01397573f2112c3f254302d779b749025";
const jinglesContract = web3.eth.contract(jinglesAbi.abi).at(jinglesAddress);
const jingleCtrl = require('./controllers/jingles.controller');

async function update() {
  jinglesContract.Composed({}, { fromBlock: '5025886', toBlock: 'latest' })
    .get(async (error, event) => {
      if (error) {
        console.log('GET JINGLES ERROR', error);
        return;
      }

      console.log(event);

      let mined = event.filter(_jingle => _jingle.type === 'mined');

      const numJinglesInDb = await jingleCtrl.jingleNum();

      console.log("Trying");

      if(mined.length > numJinglesInDb) {

        const newOnes = mined.length - numJinglesInDb;

        const jingles = 
                        mined
                        .map(_jingle => _jingle.args)
                        .map(_jingle => ({ ..._jingle, jingleId: parseFloat(_jingle.jingleId.valueOf()), }))
                        .map(_jingle => new Promise(async (resolve) => {

                          const samples = _jingle.samples.map(s => s.valueOf());
                          const sampleTypes = _jingle.jingleTypes.map(s => s.valueOf());

                          if (_jingle.jingleId.valueOf() > numJinglesInDb) {
                          const saved = await jingleCtrl.addJingle({
                              jingleId: _jingle.jingleId.valueOf(),
                              name: _jingle.name,
                              author: _jingle.author,
                              owner: _jingle.owner,
                              samples,
                              sampleTypes,
                              onSale: false,
                              price: 0
                          });
                          resolve(saved);}
                        }));

        //console.log('GET JINGLES SUCCESS', jingles);

        Promise.all(jingles).then((_jingles) => {
          console.log('WROTE TO DB SUCCESS', _jingles);
        });
      } else {
        return;
      }
    });


    const marketplace = {};

    marketplaceContract.allEvents({ fromBlock: '5025886', toBlock: 'latest' }).get(async (err, events) => {
        addMarketplaceEvents(events, marketplace);

        for (const key of Object.keys(marketplace)) {
            const eventList = marketplace[key];

            let numOrders = 0;
            let numCancels = 0;

            eventList.forEach(e => {
                if(e.event === 'SellOrder') {
                    numOrders++;
                } else {
                    numCancels++;
                }
            });

            const e = eventList[eventList.length - 1];

            if (numOrders > numCancels) {
                //add
                await putOnSale(eventList[eventList.length - 1]);
            } else {
                // cancel

                if(e.event === 'Bought') {
                    await boughtJingle(e);
                } else {
                    await cancelJingle(e);
                }
            }

        }
    });
}

async function boughtJingle(res) {
  const jingleId = res.args.jingleId.valueOf();
  const buyer = res.args.buyer;

  const updated = await jingleCtrl.removeFromSale(jingleId, buyer);

  if (updated) {
      console.log('Sell Order removed (bought)');
  }
}

async function putOnSale(res) {
  const order = {
      jingleId: res.args.jingleId.valueOf(),
      price: res.args.price.valueOf(),
  };

 const updated = await jingleCtrl.setForSale(order);

 if (updated) {
     console.log('Jingle set for sale');
 }
}

async function cancelJingle(res) {
  const jingleId = res.args.jingleId.valueOf();
  const owner = res.args.owner;

  const updated = await jingleCtrl.removeFromSale(jingleId, owner);

  if (updated) {
      console.log('Sell Order removed (canceled)');
  }
}


function addMarketplaceEvents(events, marketplace) {
  events.forEach(event => {
      const jingleId = event.args.jingleId.valueOf();

      if (marketplace[jingleId]) {
          marketplace[jingleId].push(event);
      } else {
          marketplace[jingleId] = [];
          marketplace[jingleId].push(event);
      }
  });
}

(async () => {
setInterval(async () => {
  update();
}, 1000*6);
})();
