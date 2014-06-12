define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    // insert data to graph
    
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
    
    // sort data into correct display order
    var gainers=[];
    var losers=[];
    for(var x=0;x<data.length;x++){
        if(data[x].change>0) {
            gainers.push(data[x]);
        } else {
            losers.push(data[x]);
        }
    }
    gainers.sort(function(d,c){return c.change-d.change});
    losers.sort(function(d,c){return c.change-d.change});
    var dataPoints=losers.concat(gainers);
    var floor=losers[losers.length-1].change;
    var ceiling=gainers[0].change;
    var current=losers.length;
    
    // create the main context
    var mainContext = Engine.createContext();
    var container = new ContainerSurface({
        size: [1000,1000]   
    });

    // your app here
    
    var candlesticks = [];
    
    for (var x = 0; x < 11; x++) {
        var ptr = current + (-5+x);
        
        if (ptr > -1) {
            var negative = false;
            var height = 0;
            if (dataPoints[ptr].change < 0) {
                negative = true;
                height = (dataPoints[ptr].change/floor) * 100;
                console.log(height);
            }
            else {
                height = (dataPoints[ptr].change/ceiling) * 100;
            }
            
            candlesticks.push(new Surface({
                content: dataPoints[ptr].symbol,
                size:[60,height],
                origin:[0.5,0],
                classes: ['candlestick',negative ? 'negative' : 'positive']
            }))
        }
    }
    
    for ( var x = 0; x < candlesticks.length; x++ ) {
        var classList = candlesticks[x].getClassList();
        var negative = false;
        if (classList.indexOf("negative") > -1) {
            negative = true;
        }
        container.add(new StateModifier({
            transform: Transform.translate(10+(x*100), negative ? 100 : 100 - candlesticks[x].size[1], 0)
        })).add(candlesticks[x]);
    }

    mainContext.add(container);
});
