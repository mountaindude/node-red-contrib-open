'use strict';

module.exports = function (RED) {
    const open = require('open');

    // --------------------------------------
    // Node used to open files using their default or specific apps
    // --------------------------------------
    function OpenNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;


        node.on('input', async function (msg) {
            // Message fields:
            // target: string
            // wait: true/false
            // app: string
            // urlencode: true/false

            try {
                node.options = {};

                node.target = msg.target ? msg.target : config.target;
                node.options.wait = msg.wait ? msg.wait : config.wait;
                node.options.app = msg.app ? msg.app : config.app;
                node.options.urlencode = msg.urlencode ? msg.urlencode : config.urlencode;

                node.debug('Open param: ' + JSON.stringify(node.options, null, 2));

                let res = await open(node.target, node.options);
                node.trace('Open result=' + JSON.stringify(res, null, 2));

                // Set outgoing message from the node
                msg.payload = {
                    pid: res.pid,
                    spawnargs: res.spawnargs,
                };

                msg.request = {
                    target: node.target,
                    options: node.options
                };

                // Remove all incoming parameters
                delete msg.target;
                delete msg.wait;
                delete msg.app;
                delete msg.urlencode;
                
                this.send(msg);
            } catch (err) {
                node.warn(`Error processing input to Open node: ${err}`);
            }
        });

        node.on('close', function (removed, done) {
            // Cleanup
            node.debug('Cleaning up Open node.');
            if (removed) {
                // This node has been disabled/deleted
            } else {
                // This node is being restarted
            }
            
            done();
        });
    }

    RED.nodes.registerType('open', OpenNode);
};
