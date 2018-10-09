### Inertia
移动端页面元素拖动吸附功能

### 基本用法
1. 在页面上引入inertia.js文件
```
<script src="./ObjectFollow.js"></script>
```

2. 获取需要绑定拖动吸附功能的元素
```
var ele = document.getElementById('ele')
```

3. 创建一个Inertia对象
```
var obf = new Inertia(ele)
```

4. 调用初始化方法
```
obf.init()
```
### 可选项
可以通过Inertia构造函数传入第二个参数options
```
new Inertia(ele, options)
```
其中options包括一下可配置属性:
1. border: 
object, 包括 top, bottom, left, right四个选项, 控制可拖动元素的上下左右的边界, 默认值为
```
top: 80,
bottom: 100,
left: 20,
right: 20 ,

```

2. initPos:
可拖动元素的初始位置, 包括posX, posY, 水平方向和垂直方向上的位置, 默认值为
```
posX : this.computedBorder.right, // 可移动的最右侧
posY : 150,
```

3. speed:
自动吸附的速度, 默认值为10

### 注意事项
1. 物体一定要设置transform属性, 最好设置为transform: translate3d(0px, 0px, 0px)
2. 物体设置定位, 定位在 左上角, 即top: 0; left: 0;
3. 建议物体为正方行或者圆形, 如不是, 请设置padding属性, 再单独设置其他属性
4. 如自行设置options中border属性, 需要top, bottom, left, right都设置
5. 如自行设置options中initPos属性, 需要posX, posY都设置

### 不足之处
1. requestAnimationFrame未做兼容
2. touchmove未做截流


