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
            }
            else {
                height = (dataPoints[ptr].change/ceiling) * 100;
            }
            
            candlesticks.push(new Surface({
                content: dataPoints[ptr].symbol,
                size:[60,height],
                origin:[0.5,0.5],
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
        
        var pos = Math.abs(x-5);
        
        // INCREASE x where 2^(5-pos)+x to DECREASE arc
        
        var rotationFactor = Math.pow(2,(5-pos)+5);
        
        var rotation = 0;
        if ( (x - 5) < 0 ) {
            rotation = Math.PI/rotationFactor * -1;
        }
        else {
            rotation = Math.PI/rotationFactor;
        }
        if ( pos == 0 ) {
            rotation = 0;
        }
        candlesticks[x].translation = new StateModifier({
            transform: Transform.translate(10+(x*100), negative ? 110 + (pos * 15) : (100 - candlesticks[x].size[1]) + (pos * 10) + 10, 0)
        });
        candlesticks[x].rotation = new StateModifier({
            transform: Transform.rotateZ(rotation),
            opacity: (100-(pos*10))/100
        });
        
        container.add(candlesticks[x].translation).add(candlesticks[x].rotation).add(candlesticks[x]);
    }

    mainContext.add(container);
    
    // move to the right...
    
    var shiftCandlesticks = function(forward) {
        for (var x = 0; x < candlesticks.length; x++ ) {
            var classList = candlesticks[x].getClassList();
            var negative = false;
            if (classList.indexOf("negative") > -1) {
                negative = true;
            }
            
            // x - 4: shift to the right
            // x - 6: shift to the left
    
            var pos = Math.abs(forward ? x-4 : x-6);
            
            // INCREASE x where 2^(5-pos)+x to DECREASE arc
            
            var rotationFactor = Math.pow(2,(5-pos)+5);
            
            var rotation = 0;
            if ( (x - 5) < 0 ) {
                rotation = Math.PI/rotationFactor * -1;
            }
            else {
                rotation = Math.PI/rotationFactor;
            }
            // just an easy optimization
            if ( pos == 0 ) {
                rotation = 0;
            }
            
            var deltaX = forward ? 10+(x*100) + 100 : 10+(x*100) - 100;
            var deltaY = negative ? 110 + (pos * 15) : (100 - candlesticks[x].size[1]) + (pos * 10) + 10;
            
            candlesticks[x].translation.setTransform(
            Transform.translate(deltaX, deltaY, 0),
            { duration : 1000, curve: 'easeInOut' });
            candlesticks[x].rotation.setTransform(
                Transform.rotateZ(rotation),
                 { duration : 1000, curve: 'easeInOut' }
            );
            candlesticks[x].rotation.setOpacity((100-(pos*10))/100,{ duration : 1000, curve: 'easeInOut'});
        }   
    }
    
    shiftCandlesticks(true);
});
