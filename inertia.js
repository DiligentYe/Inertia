// 按钮跟随以及吸边功能
function Inertia(ele, options) {
  this.options = options || {}
  // 需要操作元素
  this.ele = ele
  // 元素的宽度(包括padding)
  this.width = parseInt(computedStyle(this.ele, 'width')) + parseInt(computedStyle(this.ele, 'padding')) * 2
  // 可视区域宽高
  this.clientWidth = window.innerWidth
  this.clientHeight = window.innerHeight
  // 屏幕中元素可运行 上下左右 边界
  this.border = this.options.border ? this.options.border : {
    top: 80,
    bottom: 100,
    left: 20,
    right: 20 ,
  }
  // 计算后的border
  this.computedBorder = {
    top: this.border.top,
    bottom: this.clientHeight - this.border.bottom - this.width,
    left: this.border.left,
    right: this.clientWidth - this.width - this.border.right ,
  }
  // 元素初始化定位
  this.initPos = this.options.initPos || {
    posX : this.computedBorder.right,
    posY : 150,
  }
  // 当前transform X Y 的值
  this.curTransform = {}
  // 手指移动的上一个位置
  this.startPos = {}
  // 移动过程中, 此次手指所在的位置和上一次手指所在位置的距离
  this.dists = {
    x: 10,
    y: 10,
  }
  // transform X Y的值
  this.transformXY = {}
  // 触点位置
  this.touchPos = {}
  // 吸边的速度
  this.speed = this.options.speed || 10
}

Inertia.prototype.init = function() {
  this.initPostion()
  this.initEvent()
}

// 初始化元素位置
Inertia.prototype.initPostion = function() {
  this.ele.style.transform = 'translate3d('+ this.initPos.posX   + 'px, ' + this.initPos.posY + 'px, 0px)'
  this.ele.style.webkitTransform = 'translate3d('+ this.initPos.posX   + 'px, ' + this.initPos.posY + 'px, 0px)'
}

// 初始化元素事件
Inertia.prototype.initEvent = function() {
  var that = this
  // touchstart事件
  this.ele.addEventListener('touchstart', function(event) {
  // 设置当前触点的位置
  that.setStartPos(event)
})

  // touchmove事件 
  this.ele.addEventListener('touchmove', function(event) {
    event.preventDefault()
    // 设置两个触点之间的距离
    that.setDists(event)
    // 执行动画
    that.dragAnimation()
    // 重置开始位置
    that.setStartPos(event)
  })

  // touchend事件
  this.ele.addEventListener('touchend', function(event) {
    // 设置两个触点之间的距离
    that.setDists(event)
    // 执行动画
    that.dragAnimation()
    // 自动贴边
    that.autoMoveToBorder()
  })
}

// 吸边操作
Inertia.prototype.autoMoveToBorder = function autoMoveToBorder() {
  this.setXYTransformNum()
  var posX = this.curTransform.x
  var width = this.clientWidth - this.width / 2
  var timer = null

  if(posX >  width / 2 && posX < this.computedBorder.right) {
    this.step(this.speed, timer)
  }

  if(posX < width / 2 && posX > this.computedBorder.left) {
    this.step(-this.speed, timer)
  }
}

// 吸边操作轮训函数
Inertia.prototype.step = function step(speed, timer) {
  console.log('continue...')
  var that = this
  that.setXYTransformNum()

  var transX = speed + that.curTransform.x
  var transY = that.curTransform.y

  var shouldStop = false

  if(transX < that.computedBorder.left) {
    transX = that.computedBorder.left
    shouldStop = true
  } else if (transX > that.computedBorder.right) {
    transX = that.computedBorder.right
    shouldStop = true
  }

  that.ele.style.transform = 'translate3d('+ transX  + 'px, ' + transY + 'px, 0px)'
  that.ele.style.webkitTransform = 'translate3d('+ transX  + 'px, ' + transY + 'px, 0px)'

  window.cancelAnimationFrame(timer)

  if(shouldStop) return

  timer = window.requestAnimationFrame(function() {
    that.step(speed, timer)
  })
}

// 拖拽动画
Inertia.prototype.dragAnimation = function () {
  this.setXYTransformNum();

  var transX = this.dists.x + this.curTransform.x
  var transY = this.dists.y + this.curTransform.y

  transX < this.computedBorder.left ? transX = this.computedBorder.left : ''
  transX > this.computedBorder.right ? transX = this.computedBorder.right : ''

  transY < this.computedBorder.top ? transY = this.computedBorder.top : ''
  transY > this.computedBorder.bottom ? transY = this.computedBorder.bottom : ''

  this.ele.style.transform = 'translate3d('+ transX  + 'px, ' + transY + 'px, 0px)'
  this.ele.style.webkitTransform = 'translate3d('+ transX  + 'px, ' + transY + 'px, 0px)'
}

// 设置touchmove的上一个的触点
Inertia.prototype.setStartPos = function(event) {
  this.setTouchPos(event)
  this.startPos.posX = this.touchPos.clientX
  this.startPos.posY = this.touchPos.clientY
}

// 设置当前触点和上一次触点之间的距离
Inertia.prototype.setDists = function(event) {
  this.setTouchPos(event)
  this.dists.x = this.touchPos.clientX - this.startPos.posX
  this.dists.y = this.touchPos.clientY - this.startPos.posY
}

// 设置当前点的位置
Inertia.prototype.setTouchPos = function(event) {
  var touches = event.touches[0] || event
  this.touchPos.clientX = touches.clientX
  this.touchPos.clientY = touches.clientY
}

// 获取transform属性值函数
Inertia.prototype.setXYTransformNum = function() {
  var transformStyle = this.ele.style.transform;
  var matches = transformStyle.match(/.*\(([-,\.,\d]*)px, ([-,\.,\d]*)px/);
  this.curTransform.x = parseFloat(matches[1])
  this.curTransform.y = parseFloat(matches[2])
}

// 工具方法
function computedStyle(ele, propName) {
  return window.getComputedStyle(ele, null)[propName]
}