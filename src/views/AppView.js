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
    function AppView(data) {

        // Applies View's constructor function to AppView class
        View.apply(this,arguments);
        
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
        
        this.currentIndex=losers.length;
        // the container surface
        
        this.container = new ContainerSurface();
        
        this.candlesticks = [];
    
        for (var x = 0; x < this.dataPoints.length; x++) {
            var negative = false;
            var height = 0;
            if (this.dataPoints[x].change < 0) {
                negative = true;
                height = (this.dataPoints[x].change/floor) * 100;
            }
            else {
                height = (this.dataPoints[x].change/ceiling) * 100;
            }
            
            this.candlesticks.push(new Surface({
                content: this.dataPoints[x].symbol,
                size:[60,height],
                origin:[0.5,0.5],
                classes: ['candlestick',negative ? 'negative' : 'positive']
            }));
        }
        
        var firstCandlestick = this.currentIndex - 5;
        var lastCandlestick = this.currentIndex + 6;
        for ( var x = firstCandlestick; x < lastCandlestick; x++ ) {
            var classList = this.candlesticks[x].getClassList();
            var negative = false;
            if (classList.indexOf("negative") > -1) {
                negative = true;
            }
            
            var visiblePos = x - firstCandlestick;
            var pos = Math.abs(visiblePos-5);
            
            // INCREASE x where 2^(5-pos)+x to DECREASE arc
            
            var rotationFactor = Math.pow(2,(5-pos)+5);
            
            var rotation = 0;
            if ( (visiblePos - 5) < 0 ) {
                rotation = Math.PI/rotationFactor * -1;
            }
            else {
                rotation = Math.PI/rotationFactor;
            }
            if ( pos == 0 ) {
                rotation = 0;
            }
            this.candlesticks[x].translation = new StateModifier({
                transform: Transform.translate(10+(visiblePos*90), negative ? 110 + (pos * 15) : (100 - this.candlesticks[x].size[1]) + (pos * 10) + 10, 0)
            });
            
            // change x where (100-(pos*x)) to increase/decrease fadeout of the edges
            this.candlesticks[x].rotation = new StateModifier({
                transform: Transform.rotateZ(rotation),
                opacity: (100-(pos*10))/100
            });
            
            this.container.add(this.candlesticks[x].translation).add(this.candlesticks[x].rotation).add(this.candlesticks[x]);
        }
        
        this.rootModifier = new StateModifier({
            size: [400, 450]
        });

        this.mainNode = this.add(this.rootModifier);
        this.mainNode.add(this.container);
    }
    
    // Establishes prototype chain for AppView class to inherit from View
    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    // Default options for AppView class
    AppView.DEFAULT_OPTIONS = {
        transition:  { duration : 700, curve: 'easeInOut'}
    };

    // Define your helper functions and prototype methods here
    AppView.prototype._finishShift = function(forward,x) {
        var firstCandlestick = this.currentIndex - 5;
        var lastCandlestick = this.currentIndex + 5;
        if (forward && x == lastCandlestick) {
            //this.candlesticks[x].rotation.setOpacity(0.0);
            
            this.currentIndex -= 1;
            
            firstCandlestick = this.currentIndex - 5;
            lastCandlestick = this.currentIndex + 6;
            
            console.log("firstCandlestick: " + this.candlesticks[firstCandlestick].content);
            
            var negative = false;
            if (this.dataPoints[firstCandlestick].change < 0) {
                negative = true;
            }
            
            var pos = 5;
            var deltaX = 110;
            var deltaY = negative ? 110 : (100 - this.candlesticks[firstCandlestick].size[1]) + 10;
            
            if (this.candlesticks[firstCandlestick.translation]) {
                this.candlesticks[firstCandlestick].translation.setTransform(
                    Transform.translate(deltaX, deltaY, 0),
                    this.options.transition);
            }
            else {
                this.candlesticks[firstCandlestick].translation = new StateModifier({
                    transform: Transform.translate(10, negative ? 110 + (pos * 15) : (100 - candlesticks[x].size[1]) + (pos * 10) + 10, 0)
                });
            }
            
            if (this.candlesticks[firstCandlestick].rotation) {
                this.candlesticks[firstCandlestick].rotation.setTransform(
                    Transform.rotateZ(Math.PI/128),this.options.transition
                );
                this.candlesticks[firstCandlestick].rotation.setOpacity(.5,this.options.transition);
            }
            else {
                this.candlesticks[firstCandlestick].rotation = new StateModifier({
                    transform: Transform.rotateZ(Math.PI/-128),
                    opacity: 0.0
                });
                this.candlesticks[firstCandlestick].rotation.setOpacity(.5,this.options.transition);
            }
            this.container.add(this.candlesticks[firstCandlestick].translation
                               ).add(this.candlesticks[firstCandlestick].rotation).add(this.candlesticks[firstCandlestick]);
        }
        else if (!forward && x == firstCandlestick) {
            this.currentIndex += 1;
            
            firstCandlestick = this.currentIndex - 5;
            lastCandlestick = this.currentIndex + 6;
            
            if (lastCandlestick < this.candlesticks.length ) {
                console.log("lastCandlestick: " + this.candlesticks[lastCandlestick].content);
            }
        }
    }
    
    AppView.prototype.shiftCandlesticks = function (forward) {
        var firstCandlestick = this.currentIndex - 5;
        var lastCandlestick = this.currentIndex + 6;
        
        if (firstCandlestick < 0) {
            firstCandlestick = 0;
        }
        if (lastCandlestick >= this.candlesticks.length) {
            lastCandlestick = this.candlesticks.length;
        }
        for ( var x = firstCandlestick; x < lastCandlestick; x++ ) {
            var classList = this.candlesticks[x].getClassList();
            var negative = false;
            if (classList.indexOf("negative") > -1) {
                negative = true;
            }
            
            // x - 4: shift to the right
            // x - 6: shift to the left
            var visiblePos = x - firstCandlestick;
            var pos = Math.abs(forward ? visiblePos-4 : visiblePos-6);
            
            // INCREASE x where 2^(5-pos)+x to DECREASE arc
            
            var rotationFactor = Math.pow(2,(5-pos)+5);
            
            var rotation = 0;
            if ( (visiblePos - 5) < 0 ) {
                rotation = Math.PI/rotationFactor * -1;
            }
            else {
                rotation = Math.PI/rotationFactor;
            }
            // just an easy optimization
            if ( pos == 0 ) {
                rotation = 0;
            }
            
            //console.log("visiblePos: " + visiblePos + " x: " + x + " rotation: " + rotation);
            
            var deltaX = forward ? 10+(visiblePos*90) + 100 : 10+(visiblePos*90) - 100;
            var deltaY = negative ? 110 + (pos * 15) : (100 - this.candlesticks[x].size[1]) + (pos * 10) + 10;
            
            this.candlesticks[x].translation.setTransform(
            Transform.translate(deltaX, deltaY, 0),
            this.options.transition);
            this.candlesticks[x].rotation.setTransform(
                Transform.rotateZ(rotation),
                this.options.transition
            );
            if (forward) {
                if (x < lastCandlestick - 1) {
                    this.candlesticks[x].rotation.setOpacity((100-(pos*10))/100,
                        this.options.transition);
                }
                else {
                    this.candlesticks[x].rotation.setOpacity(0,
                        this.options.transition,this._finishShift(forward,x));
                }
            }
            else {
                if ( x == firstCandlestick) {
                    this.candlesticks[x].rotation.setOpacity(0,
                        this.options.transition,this._finishShift(forward,x));
                }
                else {
                    this.candlesticks[x].rotation.setOpacity((100-(pos*10))/100,
                        this.options.transition);
                }
            }
        }
    }

    module.exports = AppView;
});