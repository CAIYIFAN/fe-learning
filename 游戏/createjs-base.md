### EaselJS创建图形

```javascript
var stage = new createjs.Stage("demoCanvas");

var circle = new createjs.Shape();

circle.graphics.beginFill("DeepSkyBlue").drawCircle(0,0,5);

circle.x = 100;

circle.y = 100;

stage.addChild(circle);

stage.update();
```

### EaselJS创建文字

```javascript
var stage = new createjs.Stage("demoCanvas");

var txt = new createjs.Text("HELLO", "20px Times", "#000");

txt.x = 100;

txt.y = 100;

txt.text = "hello,world!";

stage.addChild(txt);

stage.update();
```

### 容器

```javascript
var button  = new createjs.Container();

var label = new createjs.Text("OK","20px Times","#000");

label.textAlign = 'center';

label.texBaseLine = 'middle';

var shape = new createjs.Shape();
					
shape.graphics.beginFill('#ff0000').drawCircle(0,0,50);

button.addChild(shape,label);

button.regX = shape.width/2;

button.regY = shape.height/2;

button.x = 100;
					
button.y = 100;

button.cursor = "pointer";

label.x = button.regX;

label.y = 50;

stage.addChild(button);
```

### 添加事件监听和Ticker

```javascript
var stage;
function init(){
     stage = new createjs.Stage('game');
     stage.enableMouseOver();
        
     createjs.Ticker.setFPS(60);
     createjs.Ticker.addEventListener('tick',update);
}
 
function update(event){
     stage.update();
}
```

### 使用EaselJS处理图片

```javascript
<script>
    var stage;
    function init(){
        stage = new createjs.Stage("game");
        
        var bg = new createjs.Bitmap("./background.png");
        
        //只选取图片的一部分显示在页面
				var rect = new createjs.Rectangle(100,100,100,100);
      	bg.sourceRect = rect;
      
      	//遮罩Mask
      	var shape = new createjs.Shape();
      	shape.graphics.beginFill("#000").drawCircle(0,0,100);
      	shape.x = 200;
      	shape.y = 100;
      	bg.mask = shape;
      	stage.addChild(shape);
      
      	//图片滤镜
      	var blur = new createjs.BlurFilter(5,5,1);
      	bg.filters = [blur];
      
      	//图片cache
      	bg.cache(0,0,bg.image.width,bg.image.height);
      
      	stage.addChild(bg);
      
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener('tick',update);
    }
 
 
    function update(event){
      	shape.x +=5;
      	if(shape.x > bg.getBounds().width){
          shape.x = 0;
        }
        stage.update();
    }
</script>
```

### 使用Sprite制作动画

```javascript
var data = {
 
                "images":["./spritesheet_grant.png"],//图片路径
                "frames":{"height": 292, "width": 165, "count": 64,"regX": 82,  "regY": 0},//每帧的尺寸，count是总帧数
                "animations":{
                    "run": [0, 25, "run", 1.5],//[开始帧，结束帧，动画完成后的动作，速度]
                    "jump": [26, 63, "run"]
                }
}
var spriteSheet = new createjs.SpriteSheet(data);

//方法一
sprite = new createjs.Sprite(spriteSheet);
sprite.gotoAndPlay("run");
//方法二
sprite = new createjs.Sprite(spriteSheet，"run");
stage.addChild(sprite);

//删除动画
sprite.addEventListener('animationend',function(event){
                    stage.removeChild(event.target);
                });

```

### TweenJS和Tick动画

```javascript
createjs.Tween.get(circle, { loop: true })
					.to({ x: 400 }, 1000, createjs.Ease.getPowInOut(4))
					.to({ alpha: 0, y: 175 }, 500, createjs.Ease.getPowInOut(2))
					.to({ alpha: 0, y: 225 }, 100)
					.to({ alpha: 1, y: 200 }, 500, createjs.Ease.getPowInOut(2))
					.to({ x: 100 }, 800, createjs.Ease.getPowInOut(2));
					
					createjs.Ticker.setFPS(60);
					
					createjs.Ticker.addEventListener("tick", stage);
```

### PreloadJS和SoundJS

```javascript
//声音的使用
createjs.Sound.registerSound("assets/sound.mp3", "soundname");
createjs.Sound.play("soundname");
//PreloadJS
var queue = new createjs.loadQueue(false); //本地开发使用false即可。
queue.installPlugin(createjs.Sound); //如果载入声音，必须先注册createjs.Sound
queue.on("complete", handleComplete, this); //载入完成后调用
queue.loadFile({id:"sound", src:"sound.mp3"}); //载入单个文件
//载入一个文件列表
queue.loadManifest([{id: "myImage1", src:"Image1.jpg"}，
 {id: "myImage2", src:"Image2.jpg"}
 {id: "myImage3", src:"Image3.jpg"}
 {id: "myImage4", src:"Image4.jpg"}]);
function handleComplete() {
  createjs.Sound.play("sound");
  var image = queue.getResult("myImage1");
  var bitmap = new createjs.Bitmap(image);
}
```

### createjs获取dom

```javascript
<div id="test" style="..."></div>

var rect = new createjs.DOMElement("test");
```

### hitTest碰撞检测

```javascript
//1.全局点坐标判断，例如当前鼠标的位置坐标是否与stage中的一个图形Shape发生碰撞
var stage, circle, loader;
		function init() {
				stage = new createjs.Stage(document.getElementById('game'));
				createjs.Ticker.addEvenetListener("tick", handleTick);
				createjs.Ticker.setFPS(60);
      
      	circle = new createjs.Shape();
      	circle.graphics.beginFill("red").dc(100,100,50);
      	stage.addChild(circle);
      
      	function handleTick(event){
        		circle.alpha = 0.2;
        		if (circle.hitTest(stage.mouseX, stage.mouseY)) {//直接使用circle的hitTest碰撞检测方法
            		circle.alpha = 1; }
        		stage.update();
    		}
		}

//2.把全局坐标转化为本地坐标
var stage, holder;
    function init() {
        stage = new createjs.Stage("game");
        holder = stage.addChild(new createjs.Container());
        holder.x = holder.y = 150;
 
        for (var i=0; i<25; i++) {
            var shape = new createjs.Shape();
          	shape.graphics
            .beginFill(createjs.Graphics.getHSL(Math.random()*360,100,50))
            .drawCircle(0,0,30);
            shape.x = Math.random()*300-150;
            shape.y = Math.random()*300-150;
            holder.addChild(shape);
        }
        createjs.Ticker.on("tick", tick);
    }
 
    function tick(event) {
        holder.rotation += 3;
        var l = holder.getNumChildren();
        for (var i=0; i<l; i++) {
            var child = holder.getChildAt(i);
            child.alpha = 0.1;
            var pt = child.globalToLocal(stage.mouseX, stage.mouseY);
          	//先使用元素的globalToLocal做坐标的转换
            console.log(pt.x, pt.y);
            if (stage.mouseInBounds && child.hitTest(pt.x, pt.y)) { child.alpha = 1; }
          //碰撞判断，使用转换后的本地坐标
        }
 
        stage.update(event);
    }
//3.LocalTOLocal,判断页面中的两个元素是否碰撞
var stage, arm, target;
    function init() {
        stage = new createjs.Stage("game");
				//红色目标
        target = stage.addChild(new createjs.Shape());
        target.graphics.beginFill("red").drawCircle(0,0,45)
                .beginFill("white").drawCircle(0,0,30)
                .beginFill("red").drawCircle(0,0,15);
        target.x = 100;
        target.y = 180;
 
        arm = stage.addChild(new createjs.Shape());
        arm.graphics.beginFill("black").drawRect(-2,-2,100,4)//黑色方形
                .beginFill("blue").drawCircle(100,0,8);//蓝色球
        
        arm.x = 180;
        arm.y = 100;
 
        createjs.Ticker.on("tick", tick);
    }
 
    function tick(event) {
        arm.rotation += 5;
 
        target.alpha = 0.2;
        var pt = arm.localToLocal(100,0,target);
      	//碰撞检测前，先把arm图形中的某点的坐标跟目标target做一个转化，这里是（100，0），也就是蓝球中心
        if (target.hitTest(pt.x, pt.y)) { target.alpha = 1; }
      	//使用转化后的坐标进行检测即可判断两个物体是否相交。
        stage.update(event);
    }
```