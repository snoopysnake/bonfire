(function(){

    function init(){
        var count = 0;
        var sparkSize = 10;
        var fireCount = 1;
        var fireSrc = 'img/png/fire-' + fireCount + '.png';
        var fireMult = 1;
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
        var img = [{x:window.innerWidth/2,y:window.innerHeight/2,vx:5,vy:.3,direction:.5}
        ];

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
            ctx.fillStyle = 'gray';
            ctx.fillRect(container.x,container.y,container.width,container.height);

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

                ctx.globalAlpha = 0.6;
                ctx.fillStyle = 'yellow';
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
                    if (fireCount > 2)
                        fireCount = 1;
                }
                if (count >= 10 && count < 20) {
                    if (fireCount > 5)
                        fireCount = 3;
                }
                if (count >= 20 && count < 30) {
                    if (fireCount > 8)
                        fireCount = 5;
                }
                if (count >= 30) {
                    if (count >= 40 && count % 5 == 0) {
                        fireMult = 1 + .25*((count - 40)/5);
                    }
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
