function init(){
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    var host = location.origin.replace(/^http/, 'ws')
    var connection = new WebSocket(host);
    var count = -1;
    var countMult = 50;
    var fireCount = 0;
    var glowCount = -1;
    var fireSrc = 'img/png/fire-' + fireCount + '.png';
    var fireMult = 1;
    var glowMult = 1;
    const canvas = document.getElementById('background');
    const scheduleDiv = document.querySelector('.schedule-div');
    const announcementDiv = document.querySelector('.announcement-div');
    canvas.addEventListener('click',function() {
        connection.send('click');
    }, false);
    scheduleDiv.addEventListener('click',function() {
        connection.send('click');
    }, false);
    announcementDiv.addEventListener('click',function() {
        connection.send('click');
    }, false);
    connection.onopen = function(evt) {
        connection.send('update');
        canvas.click();
    }
    // TEMP FIX:
    const secret = document.querySelector('footer > a');
    secret.addEventListener('click', function() {
        var announcement = prompt('What would you like to announce?','');
        if (announcement) {
            connection.send(announcement);
        }
    });
    connection.onmessage = function(evt) {
        var spark = JSON.parse(evt.data);
        switch(spark['action']) {
            case 'update':
                console.log(spark);
                count = spark['count'];
                if (count < 30*countMult)
                    fireMult = 1;
                else fireMult = 1.125 + .05*((count - 30*countMult)/100);
                glowMult = 1 + .01*((count - 30*countMult)/100);
                break;
            case 'click':
                console.log(spark);
                count = spark['count'];
                img.push({x:window.innerWidth/2,y:window.innerHeight/2 + 36,vx:spark['vx'],vy:spark['vy'],direction:spark['direction'],sparkSize:spark['sparkSize']});
                break;
            // TEMP FIX:
            case 'announce':
                addMessage([spark],0);
                break;
        }
    }
    var ctx = canvas.getContext('2d');
    
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var container = {x:0,y:0,width:window.innerWidth,height:window.innerHeight};
    var img = [];
    // var img = [{x:window.innerWidth/2,y:window.innerHeight/2,vx:5,vy:.3,direction:.5}];
    var glow = [
        {x:370/2,y:120/2,maxX:370/2,maxY:120/2,rotationSpeed:Math.PI/10000,opacity:.1,clockwise:true,shrink:true},
        {x:400/2,y:150/2,maxX:400/2,maxY:150/2,rotationSpeed:Math.PI/10000,opacity:.1,clockwise:true,shrink:true},
        {x:380/2,y:130/2,maxX:380/2,maxY:130/2,rotationSpeed:Math.PI/10000,opacity:.15,clockwise:true,shrink:true},
        {x:430/2,y:165/2,maxX:430/2,maxY:165/2,rotationSpeed:Math.PI/10000,opacity:.125,clockwise:true,shrink:true},
        {x:440/2,y:140/2,maxX:440/2,maxY:140/2,rotationSpeed:Math.PI/10000,opacity:.175,clockwise:true,shrink:true},
        {x:500/2,y:180/2,maxX:500/2,maxY:180/2,rotationSpeed:Math.PI/10000,opacity:.15,clockwise:true,shrink:true}
        ];
    var brightGlow = [
        {x:525/2,y:190/2,maxX:525/2,maxY:190/2,rotationSpeed:Math.PI/10000,shift:125,color:'255,175,63',opacity:.15,clockwise:true,shrink:true},
        {x:500/2,y:180/2,maxX:500/2,maxY:180/2,rotationSpeed:Math.PI/10000,shift:133,color:'255,239,63',opacity:.125,clockwise:true,shrink:true},
        {x:450/2,y:160/2,maxX:450/2,maxY:160/2,rotationSpeed:Math.PI/10000,shift:120,color:'255,239,63',opacity:.125,clockwise:true,shrink:true}
    ];
    var rotation = [-1 * Math.PI / 400, Math.PI / 400, 0];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height  = window.innerHeight;
        container.width  = window.innerWidth;
        container.height  = window.innerHeight;
    }
    window.addEventListener('resize',resize,false);

    var logs = new Image();
    logs.src = 'img/png/logs.png';

    var fire = [];
    for (var i = 0; i <= 12; i++) {
        var fireImg = new Image();
        fireImg.src = 'img/png/fire-' + (i) + '.png';
        if (i == 0)
            fireImg.src = '';
        fire[i] = fireImg;
    }

    function drawSparks(){
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = '#1A2E33';
        ctx.fillRect(container.x,container.y,container.width,container.height);

        if (glowCount < 6 && glowCount >= 0) {
            for(var i=glowCount; i <glowCount+2; i++){
                ctx.beginPath();
                // ctx.globalAlpha = .3;
                if (i % 2 == 0) {
                    ctx.fillStyle = 'rgba(255,175,63,'+glow[i].opacity+')';
                    ctx.ellipse(window.innerWidth/2, window.innerHeight/2 + 120, glow[i].x, glow[i].y, rotation[i % 2], 0, 2 * Math.PI);
                }
                if (i % 2 == 1) {
                ctx.fillStyle = 'rgba(255,239,63,'+glow[i].opacity+')';
                    ctx.ellipse(window.innerWidth/2, window.innerHeight/2 + 130, glow[i].x, glow[i].y, rotation[i % 2], 0, 2 * Math.PI);
                }
                if (rotation[i % 2] >= Math.PI / 400) {
                    glow[i].clockwise = false;
                    rotation[i % 2] -= glow[i].rotationSpeed;
                }
                else if (rotation[i % 2] <= -1 * Math.PI / 400) {
                    glow[i].clockwise = true;
                    rotation[i % 2] += glow[i].rotationSpeed;
                }
                else if (rotation[i % 2] < Math.PI / 400 && glow[i].clockwise) {
                    rotation[i % 2] += glow[i].rotationSpeed;
                }
                else if (rotation[i % 2] > -1 * Math.PI / 400 && !glow[i].clockwise) {
                    rotation[i % 2] -= glow[i].rotationSpeed;
                }

                if (glow[i].x == glow[i].maxX - 10) {
                    glow[i].shrink = false;
                    glow[i].x+=.25;
                }
                else if (glow[i].x >= glow[i].maxX) {
                    glow[i].shrink = true;
                    glow[i].x-=.25;
                }
                else if (!glow[i].shrink && glow[i].x < glow[i].maxX)
                    glow[i].x+=.25;
                else if (glow[i].shrink && glow[i].x > glow[i].maxX - 10)
                    glow[i].x-=.25;
                ctx.fill();
            }
        }
        if (glowCount >= 6) {
            for(var i=0; i <3; i++){
                ctx.beginPath();
                ctx.fillStyle = 'rgba('+brightGlow[i].color+','+(brightGlow[i].opacity*glowMult*2)+')';
                if (i != 1)
                    ctx.ellipse(window.innerWidth/2, window.innerHeight/2 + brightGlow[i].shift, brightGlow[i].x*glowMult, brightGlow[i].y*glowMult, rotation[i % 3], 0, 2 * Math.PI);
                else ctx.ellipse(window.innerWidth/2, window.innerHeight/2 + brightGlow[i].shift, brightGlow[i].x*(glowMult+.25), brightGlow[i].y*(glowMult+.2), rotation[i % 3], 0, 2 * Math.PI);

                if (rotation[i % 3] >= Math.PI / 400) {
                    brightGlow[i].clockwise = false;
                    rotation[i % 3] -= brightGlow[i].rotationSpeed;
                }
                else if (rotation[i % 3] <= -1 * Math.PI / 400) {
                    brightGlow[i].clockwise = true;
                    rotation[i % 3] += brightGlow[i].rotationSpeed;
                }
                else if (rotation[i % 3] < Math.PI / 400 && brightGlow[i].clockwise) {
                    rotation[i % 3] += brightGlow[i].rotationSpeed;
                }
                else if (rotation[i % 3] > -1 * Math.PI / 400 && !brightGlow[i].clockwise) {
                    rotation[i % 3] -= brightGlow[i].rotationSpeed;
                }

                if (brightGlow[i].x == brightGlow[i].maxX - 10) {
                    brightGlow[i].shrink = false;
                    brightGlow[i].x+=.25;
                }
                else if (brightGlow[i].x >= brightGlow[i].maxX) {
                    brightGlow[i].shrink = true;
                    brightGlow[i].x-=.25;
                }
                else if (!brightGlow[i].shrink && brightGlow[i].x < brightGlow[i].maxX)
                    brightGlow[i].x+=.25;
                else if (brightGlow[i].shrink && brightGlow[i].x > brightGlow[i].maxX - 10)
                    brightGlow[i].x-=.25;
                ctx.fill();
            }
        }

        ctx.drawImage(logs,window.innerWidth/2 - logs.width/4,window.innerHeight/2 - logs.height/4 + 100, logs.width/2, logs.height/2);

        // fire.src = fireSrc;
        if (count >= 0) {
            ctx.drawImage(fire[fireCount],window.innerWidth/2 - fire[fireCount].width*fireMult/4,
                window.innerHeight/2 - fire[fireCount].height*fireMult/4 + 20 - (fire[fireCount].height*(fireMult-1))/7,
                    fire[fireCount].width*fireMult/2, fire[fireCount].height*fireMult/2);        
        }

        for(var i=0; i <img.length; i++){
            if (img[i].y >= window.innerHeight) {
                img.splice(i, 1);
                i = 0;
                continue;
            }

            ctx.beginPath();
            // ctx.globalAlpha = 0.6;
            ctx.fillStyle = 'rgba(255,239,63,.6)';
            ctx.fillRect(img[i].x,img[i].y,img[i].sparkSize,img[i].sparkSize);
            ctx.fill();

            if (img[i].direction >= .5) {
                img[i].x += img[i].vx;
            }
            else {
                img[i].x -= img[i].vx;
            }
            img[i].vy += .3;
            img[i].y += img[i].vy*img[i].vy - 5*img[i].vy;
        }
        requestAnimationFrame(drawSparks);
    }
    requestAnimationFrame(drawSparks);

    function drawFire() {
        setTimeout(function() {
            // if (count > 0)
                // count--;
            if (count < 10*countMult && count >= 0) {
                glowCount = 0;
                if (fireCount >= 2)
                    fireCount = 0;
            }
            if (count >= 10*countMult && count < 20*countMult) {
                glowCount = 2;
                if (fireCount >= 5)
                    fireCount = 2;
            }
            if (count >= 20*countMult && count < 30*countMult) {
                fireMult = 1;
                glowCount = 4;
                if (fireCount >= 8)
                    fireCount = 4;
            }
            if (count >= 30*countMult) {
                glowCount = 6;
                if (count == 30*countMult)
                    fireMult = 1.125;
                else if (count % 5 == 0) {
                    fireMult = 1.125 + .05*((count - 30*countMult)/100);
                    glowMult = 1 + .01*((count - 30*countMult)/100);
                }
                // fireMult = 1 + .1*((count - 30)/5);
                if (fireCount >= 12)
                    fireCount = 6;
            }
            requestAnimationFrame(drawFire);
            if (count >= 0)
                // fireSrc = 'img/png/fire-' + fireCount + '.png';
            fireCount++;
        },200);
    }
    requestAnimationFrame(drawFire);

}

window.addEventListener('load',init,false);