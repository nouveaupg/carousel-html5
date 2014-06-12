/*** AppView ***/

// define this module in Require.JS
define(function(require, exports, module) {

    // Import additional modules to be used in this view 
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    // Constructor function for our AppView class
    function AppView() {

        // Applies View's constructor function to AppView class
        View.apply(this,arguments);
        
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
        this.dataPoints=losers.concat(gainers);
        var floor=losers[losers.length-1].change;
        var ceiling=gainers[0].change;
        
        this.current=losers.length;
        // the container surface
        
        var container = new ContainerSurface();
        
        var candlesticks = [];
    
        for (var x = 0; x < 11; x++) {
            var ptr = this.current + (-5+x);
            
            if (ptr > -1) {
                var negative = false;
                var height = 0;
                if (this.dataPoints[ptr].change < 0) {
                    negative = true;
                    height = (this.dataPoints[ptr].change/floor) * 100;
                }
                else {
                    height = (this.dataPoints[ptr].change/ceiling) * 100;
                }
                
                candlesticks.push(new Surface({
                    content: this.dataPoints[ptr].symbol,
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
        
        this.rootModifier = new StateModifier({
            size: [400, 450]
        });

        this.mainNode = this.add(this.rootModifier);
        this.mainNode.add(container);
    }

    // Establishes prototype chain for AppView class to inherit from View
    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    // Default options for AppView class
    AppView.DEFAULT_OPTIONS = {};

    // Define your helper functions and prototype methods here

    module.exports = AppView;
});
