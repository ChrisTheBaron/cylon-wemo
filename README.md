# Cylon.js For WeMo
Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and
physical computing using Node.js

This repository contains the Cylon adaptor for WeMo.

For more information about Cylon, check out the repo at
https://github.com/hybridgroup/cylon

It uses code originally found in this module: [node-wemo](https://github.com/AdamMagaluk/node-wemo)
## How to Install
Install the module with:
``` bash
$ npm install cylon-wemo
```
## How to Use
```javascript
'use strict';

var Cylon = require('cylon');

Cylon.robot({

    connections: {
        wemo: {
            adaptor: 'wemo', ip: "192.168.0.4", port: 49153
        }
    },

    devices: {
        switch: {
            driver: 'wemo'
        }
    },

    work: function (my) {

        my.switch.setBinaryState(0, function (err, result) {
            console.log(err, result);

            my.switch.getBinaryState(function (err, result) {
                console.log(err, result);

                setTimeout(function () {

                    my.switch.setBinaryState(1, function (err, result) {
                        console.log(err, result);

                        my.switch.getBinaryState(function (err, result) {
                            console.log(err, result);

                        })

                    });

                }, 5000);

            })

        });
    }
}).start();
```
## How to Connect
You will need to be able to access the WeMo switch from your device, either online or on your local network.

To discover your devices run `node tools\discovery.js`

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!
## Contributing
* Put your contribution guidelines here
* Submit a Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & lint and test your code using `make test` and `make lint`.
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git
  
## Release History
1.0.0 - Can get and state of light.
## License
Copyright (c) 2015 Chris Taylor. See `LICENSE` for more details
