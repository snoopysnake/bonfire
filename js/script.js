(function(){

    function init(){
        var count = 0;
        var sparkSize = 10;
        var fireCount = 1;
        var glowCount = 0;
        var fireSrc = 'img/png/fire-' + fireCount + '.png';
        var fireMult = 1;
        var glowMult = 1;
        var canvas = document.getElementById('background');
        canvas.onclick = function() {
            count++;
            sparkSize = 10 + count / 2;
            // if (count > 5 && count % 5 == 0)
            //     sparkSize++;
            var randVX = Math.random() * 10;
            var randVY = Math.random() * .5;
            var randDirection = Math.random();
            img.push({x:window.innerWidth/2,y:window.innerHeight/2,vx:randVX,vy:randVY,direction:randDirection});
        }

        var ctx = canvas.getContext('2d');

        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        var container = {x:0,y:0,width:window.innerWidth,height:window.innerHeight};
        // var img = [];
        var img = [{x:window.innerWidth/2,y:window.innerHeight/2,vx:5,vy:.3,direction:.5}];
        var glow = [
            {x:370,y:120,maxX:370,maxY:120,rotationSpeed:Math.PI/10000,opacity:.1,clockwise:true,shrink:true},
            {x:400,y:150,maxX:400,maxY:150,rotationSpeed:Math.PI/10000,opacity:.1,clockwise:true,shrink:true},
            {x:380,y:130,maxX:380,maxY:130,rotationSpeed:Math.PI/10000,opacity:.15,clockwise:true,shrink:true},
            {x:430,y:165,maxX:430,maxY:165,rotationSpeed:Math.PI/10000,opacity:.125,clockwise:true,shrink:true},
            {x:440,y:140,maxX:440,maxY:140,rotationSpeed:Math.PI/10000,opacity:.175,clockwise:true,shrink:true},
            {x:500,y:180,maxX:500,maxY:180,rotationSpeed:Math.PI/10000,opacity:.15,clockwise:true,shrink:true}
            ];
        var brightGlow = [
            {x:525,y:190,maxX:525,maxY:190,rotationSpeed:Math.PI/10000,shift:170,color:'255,175,63',opacity:.15,clockwise:true,shrink:true},
            {x:500,y:180,maxX:500,maxY:180,rotationSpeed:Math.PI/10000,shift:180,color:'255,239,63',opacity:.125,clockwise:true,shrink:true},
            {x:450,y:160,maxX:450,maxY:160,rotationSpeed:Math.PI/10000,shift:150,color:'255,239,63',opacity:.125,clockwise:true,shrink:true}
        ];
        var rotation = [-1 * Math.PI / 400, Math.PI / 400, 0];

        function resize() {
            canvas.width  = window.innerWidth;
            canvas.height  = window.innerHeight;
            container.width  = window.innerWidth;
            container.height  = window.innerHeight;
        }
        window.addEventListener('resize',resize,false);

        function drawSparks(){
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.fillStyle = '#1A2E33';
            ctx.fillRect(container.x,container.y,container.width,container.height);

            if (glowCount < 6) {
                for(var i=glowCount; i <glowCount+2; i++){
                    ctx.beginPath();
                    // ctx.globalAlpha = .3;
                    if (i % 2 == 0) {
                        ctx.fillStyle = 'rgb(255,175,63,'+glow[i].opacity+')';
                        ctx.ellipse(window.innerWidth/2, window.innerHeight/2 + 150, glow[i].x, glow[i].y, rotation[i % 2], 0, 2 * Math.PI);
                    }
                    if (i % 2 == 1) {
                    ctx.fillStyle = 'rgb(255,239,63,'+glow[i].opacity+')';
                        ctx.ellipse(window.innerWidth/2, window.innerHeight/2 + 170, glow[i].x, glow[i].y, rotation[i % 2], 0, 2 * Math.PI);
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
            else {
                for(var i=0; i <3; i++){
                    ctx.beginPath();
                    ctx.fillStyle = 'rgb('+brightGlow[i].color+','+(brightGlow[i].opacity*glowMult*2)+')';
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

            var logs = new Image();
            logs.src = 'img/png/logs.png';
            ctx.globalAlpha = 1;
            ctx.drawImage(logs,window.innerWidth/2 - logs.width/2,window.innerHeight/2 - logs.height/2 + 100);

            var fire = new Image();
            fire.src = fireSrc;
            ctx.globalAlpha = 1;
            ctx.drawImage(fire,window.innerWidth/2 - fire.width*fireMult/2,window.innerHeight/2 - fire.height*fireMult/2 - 50 - (fire.height*(fireMult-1))/4, fire.width*fireMult, fire.height*fireMult);

            for(var i=0; i <img.length; i++){
                if (img[i].y >= window.innerHeight) {
                    img.splice(i, 1);
                    i = 0;
                    continue;
                }

                ctx.beginPath();
                // ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'rgb(255,239,63,.6)';
                ctx.fillRect(img[i].x,img[i].y,sparkSize,sparkSize);
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
                if (count > 0)
                    count--;
                if (count < 10) {
                    glowCount = 0;
                    if (fireCount > 2)
                        fireCount = 1;
                }
                if (count >= 10 && count < 20) {
                    glowCount = 2;
                    if (fireCount > 5)
                        fireCount = 3;
                }
                if (count >= 20 && count < 30) {
                    glowCount = 4;
                    if (fireCount > 8)
                        fireCount = 5;
                }
                if (count >= 30) {
                    glowCount = 6;
                    if (count % 5 == 0) {
                        fireMult = 1 + .1*((count - 30)/5);
                        glowMult = 1 + .01*((count - 30)/5);
                    }
                    // fireMult = 1 + .1*((count - 30)/5);
                    if (fireCount > 12)
                        fireCount = 7;
                }
                requestAnimationFrame(drawFire);
                fireSrc = 'img/png/fire-' + fireCount + '.png';
                fireCount++;
            },200);
        }
        requestAnimationFrame(drawFire);

    }
    //invoke function init once document is fully loaded
    window.addEventListener('load',init,false);

}());  //self invoking function
