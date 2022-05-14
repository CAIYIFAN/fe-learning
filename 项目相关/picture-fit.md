### 分辨率切换：不同的尺寸

```
<img srcset="elva-fairy-320w.jpg,
					elva-fairy-480w.jpg,
					elva-fairy-800w.jpg"
		 sizes="(max-width:320px) 280px,
		 				(max-width:480px) 440px,
		 				800px"
		 src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">
```

以上方案在老旧的浏览器中不适用

### 分辨率切换：相同的尺寸，不同的分辨率

```
<img srcset="elva-fairy-320w.jpg,
					elva-fairy-480w.jpg 1.5x,
					elva-fairy-640w.jpg 2x"
		 src="elva-fairy-640w.jpg" alt="Elva dressed as a fairy">
```

### 使用picture实现

```
<picture>
	<source media="(max-width: 799px)" srcset="elva-480w-close-portrait.jpg">
	<source media="(min-width: 800px)" srcset="elva-800w.jpg">
	<img src="elva-800w.jpg" alt="Chris standing up holding gus daughter Elva">
</picture>
```

