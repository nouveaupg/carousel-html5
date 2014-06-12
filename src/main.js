define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

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
    
    var stateModifier = new StateModifier({
        transform: Transform.translate(150, 100, 0)
    });
    
    var secondModifier = new StateModifier({
        transform: Transform.rotateZ(Math.PI/-24)
    })
    
    var candlestick = new Surface({
        content: "GOOG",
        size:[60,100],
        classes: ['candlestick','negative']
    });
    
    var logo = new ImageSurface({
        size: [200, 200],
        content: 'http://code.famo.us/assets/famous_logo.svg',
        classes: ['double-sided']
    });

    var initialTime = Date.now();
    var centerSpinModifier = new Modifier({
        origin: [0.5, 0.5],
        transform : function(){
            return Transform.rotateZ(.002 * (Date.now() - initialTime));
        }
    });

    container.add(stateModifier).add(secondModifier).add(candlestick);
    
    container.add(new StateModifier({
        transform: Transform.translate(250, 80, 0)
    })).add(new StateModifier({
        transform: Transform.rotateZ(Math.PI/-32)
    })).add(new Surface({
        origin: [0.5,1],
        content: "AMD",
        size:[60,120],
        classes: ['candlestick','negative']
    }));
    
    container.add(new StateModifier({
        transform: Transform.translate(350, 60, 0)
    })).add(new StateModifier({
        transform: Transform.rotateZ(Math.PI/-64)
    })).add(new Surface({
        origin: [0.5,1],
        content: "FB",
        size:[60,150],
        classes: ['candlestick','negative']
    }));
    
    container.add(new StateModifier({
        transform: Transform.translate(450, 50, 0)
    })).add(new StateModifier({
        transform: Transform.rotateZ(Math.PI/-128)
    })).add(new Surface({
        origin: [0.5,1],
        content: "AAPL",
        size:[60,200],
        classes: ['candlestick','negative']
    }));
    
    container.add(new StateModifier({
        transform: Transform.translate(550, 0, 0)
    })).add(new Surface({
        origin: [0.5,0],
        content: "MHF",
        size:[60,150],
        classes: ['candlestick','positive']
    }));
    
    container.add(new StateModifier({
        transform: Transform.translate(650, 10, 0)
    })).add(new StateModifier({
        transform: Transform.rotateZ(Math.PI/128)
    })).add(new Surface({
        origin: [0.5,0],
        content: "KO",
        size:[60,140],
        classes: ['candlestick','positive']
    }));
    
    container.add(new StateModifier({
        transform: Transform.translate(750, 45, 0)
    })).add(new StateModifier({
        transform: Transform.rotateZ(Math.PI/64)
    })).add(new Surface({
        origin: [0.5,0],
        content: "TOT",
        size:[60,110],
        classes: ['candlestick','positive']
    }));
    
    container.add(new StateModifier({
        transform: Transform.translate(850, 70, 0)
    })).add(new StateModifier({
        transform: Transform.rotateZ(Math.PI/32)
    })).add(new Surface({
        origin: [0.5,0],
        content: "AA",
        size:[60,90],
        classes: ['candlestick','positive']
    }));
    
    var lastChild = new Surface({
        origin: [0.5,0],
        content: "AA",
        size:[60,70],
        classes: ['candlestick','positive']
    });
    
    var lastChildTransform = new StateModifier({
        transform: Transform.translate(950, 100, 0)
    });
    
    var lastChildRotation =  new StateModifier({
        transform: Transform.rotateZ(Math.PI/16)
    });
    
    container.add(lastChildTransform).add(lastChildRotation).add(lastChild);
    
    lastChildTransform.setTransform(Transform.translate(1050, 150, 0),{
        duration: 1000, curve: "easeInOut" });
    
    lastChildRotation.setTransform(Transform.rotateZ(Math.PI/8),{duration:1000,curve: "easeInOut"});
    
    mainContext.add(container);
});
