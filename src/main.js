define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    
    // create the main context
    var mainContext = Engine.createContext();
    
    // AppView
    var AppView = require('views/AppView');
    
    // inject datapoints to graph here
    
    var data = [
            {"symbol":"P","change":1.0},
            {"symbol":"PEGA","change":-1.0},
            {"symbol":"WIX","change":0.7},
            {"symbol":"BLK","change":-0.3},
            {"symbol":"MSFT","change":-0.9},
            {"symbol":"MHF","change":3.72},
            {"symbol":"GOOG","change":3.53},
            {"symbol":"JBLU","change":-4.30},
            {"symbol":"GAS","change":2.65},
            {"symbol":"ABT","change":2.02},
            {"symbol":"YUM","change":-3.72},
            {"symbol":"APD","change":-3.53},
            {"symbol":"AES","change":-3.30},
            {"symbol":"AMD","change":-3.48},
            {"symbol":"ABT","change":-2.27}
        ];
    
    mainContext.add(new AppView(data));
});
