## 图片懒加载原理及实现

```javascript
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
    <title>图片懒加载</title>
</head>
<style>
    .container{
        max-width: 800px;
        margin: 0 auto;
    }
    .container::after {
        content: '';
        display: block;
        clear: both;
    }
    .container img{
        float: left;
        width: 50%;
       
    }
    /* 目标元素 */
    h1 {
        clear: both;
    }

</style>
<body>
    <div class="container">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="1"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/1.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="2"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/2.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="3"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/3.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="4"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/4.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="5"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/5.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="6"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/6.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="7"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/7.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="8"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/8.jpg">
            <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="9"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/15.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="10"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/16.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="11"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/17.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="12"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/18.jpg">       
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="13"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/17.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="14"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/18.jpg">     
        <!-- <h1 id="target">hello</h1> -->
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="15"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/15.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="16"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/16.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="17"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/17.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="18"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/18.jpg">  
            <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="15"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/15.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="16"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/16.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="17"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/17.jpg">
        <img src="http://smashinghub.com/wp-content/uploads/2014/08/cool-loading-animated-gif-3.gif" alt="18"
            data-src="http://cdn.jirengu.com/book.jirengu.com/img/18.jpg">            
    </div>
    <script>
        //滚动事件
          start () //打开页面 调用一次 
        $(window).on('scroll',function(){
            start () //滚动页面是 调用一次   方便管理 
        })
        //加载函数 
        function start (){
            $('.container img').not('[data-isLoaded]').each(function(){
                var $node = $(this)
               if( isShow( $node) ){
                   //缓冲效果 
                    setTimeout(function(){
                    loadIng( $node)
                    },500)
                
               }
            })
        }
        // 页面逻辑
        function isShow($node){
            // 当一个元素出现在我们眼前    小于 窗口高度 加上窗口滚动的高度的时候    就意味着  到达目标点 
            // 可以开始加载图片 或者其他内容
            return $node.offset().top <= $(window).height() + $(window).scrollTop()
            
        }
        // 显示状态
        function loadIng($img){
            // 获取目标元素 并替换 
            $img.attr('src', $img.attr('data-src'))
            //性能优化   进行判断   已经加载的  不会再进行加载  
            $img.attr('data-isLoaded', 1)
        }
    </script>
</body>

</html>
```

