(function(){

    function init(){
        var canvas = document.getElementById('background');
        canvas.onclick = function() {
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

        function draw(){
            ctx.fillStyle = 'gray';
            ctx.strokeStyle = 'white';
            ctx.fillRect(container.x,container.y,container.width,container.height);
            //ctx.clearRect(container.x,container.y,container.width,container.height);
            //ctx.strokeRect(container.x,container.y,container.width,container.height);

            for(var i=0; i <img.length; i++){
                // ctx.fillStyle = 'hsl(' + img[i].color + ',100%,50%)';

                ctx.globalAlpha = 0.6;
                // var drawing = new Image(); // Using optional size for image
                // if (i < 8)
                //     drawing.src = 'img/img'+(i+1)+'.png';
                // else drawing.src = 'img/img8.png';
                ctx.beginPath();
                // if (i < 8)
                    // ctx.drawImage(drawing,img[i].x,img[i].y);
                // else ctx.drawImage(drawing,img[i].x,img[i].y, 200, 200);
                ctx.fillStyle = 'yellow';
                ctx.fillRect(img[i].x,img[i].y,10,10);
                ctx.fill();

                // if((img[i].x + img[i].vx  > container.x + container.width) || (img[i].x + img[i].vx < container.x)){
                //     img[i].vx = - img[i].vx;
                // }
                // if((img[i].y + img[i].vy > container.y + container.height) || (img[i].y + img[i].vy < container.y)){
                //     img[i].vy = - img[i].vy;
                // }
                console.log(img[i].x);
                if (img[i].direction >= .5) {
                    img[i].x += img[i].vx;
                }
                else {
                    img[i].x -= img[i].vx;
                }
                img[i].vy += .3;
                img[i].y += img[i].vy*img[i].vy - 5*img[i].vy;
                if (img[i].y >= window.innerHeight)
                    img.pop();
            }
            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw);
    }
    //invoke function init once document is fully loaded
    window.addEventListener('load',init,false);

}());  //self invoking function
