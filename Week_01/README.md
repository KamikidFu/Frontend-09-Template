# 学习笔记
> 第一周 ： 2月22日 - 2月28日

## Tic-tac-toe
### 全局变量
`pattern` 一维或二维数组，用来表示棋局局面。

`color` 用来表示执棋双方。`1`为⭕️方， `2` 为❌方。
通过 `color = 3 - color`的方式交换执棋者，满足加法交换律。

### 流程处理

`show()`

根据`pattern`绘制棋盘与棋子，为每个棋子处添加`EventListener`以方便处理玩家落子。

`userMove(x, y)`

玩家落子处理。
二维数组中，x，y代表棋盘横纵，一维数组中，可以通过x，y计算得到对应落子处的索引。
* 落子后判断是否获胜 - `check(pattern, color)`
* 交换执棋 - `color = 3 - color`
* 渲染新的棋局局面 - `show()`
* 触发电脑AI玩家落子 - `computerMove()`

`computerMove()`

AI玩家落子处理。
* 计算当前局面最优解 - `bestChoice(pattern, color)`
* 落子到最优解处后判断是否获胜 - `check(pattern, color)`
* 交换执棋 - `color = 3 - color`
* 渲染新的棋局局面 - `show()`

### 辅助方法

`clone(pattern)`

复制一份新的棋局局面对象。

`check(pattern, color)`

判断当前局面（横向、纵向、\斜向、/斜向），执棋方`color`是否获胜。

`bestChoice(pattern, color)`

AI玩家选择最佳落子点。
* 判断是否可以直接胜利 - `willWin(pattern, color)`
    * 如果是，则直接返回胜利落子点
  
* 如果不是，则遍历棋盘上每个可落子点，并递归调用`bestChoice(pattern, color)`得到对方最佳落子点
* 如果落子对情势带来好处，则先记录落子点与当前情势。
* 当某个落子点情势为胜利时，返回该落子点

`willWin(pattern, color)`

遍历棋盘检查空余落子点是否可以时执棋方`color`获胜。

* 如果是，则返回该落子点
* 如果不是，则返回`null`

## 异步编程
学习中模拟了红绿灯持续变换的过程。
### Callback
通过回调函数来实现异步编程。
> A callback function is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of routine or action.
> 
> 被作为实参传入另一个函数，并在该外部函数内被调用，用以来完成某些任务的函数，称为回调函数。
> 
> *[MDN Web Docs](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)*

> #### 提问？
>```JavaScript
>  function go() {
>      green(); // 执行green - 绿灯亮
>      setTimeout(function () {
>          yellow(); // 执行 yellow - 黄灯亮
>          setTimeout(function () {
>              red(); // 执行 red - 红灯亮
>              setTimeout(function () {
>                  go(); // 执行 go - 重新开始
>              }, 500); // 0.5s后执行
>          }, 200); // 0.2s后执行
>      }, 1000); // 1s后执行
>  }
>```
>这段代码中似乎没有一个函数被作为实参传入另一个函数。  
>而且感觉上代码像是同步执行的，因为`setTimeout(function, delay)`给我一种类似`Thread.Sleep(delay)`的感觉。  
>我们应该如何将上面的函数分块，以便于理解 **回调** 与 **异步** 两个概念呢？

### Promise
![Promise](https://mdn.mozillademos.org/files/8633/promises.png)  
红绿灯代码示例
```javascript
    function sleep(time){
        return new Promise(function(resolve, reject){
            setTimeout(resolve, time);
        });
    }

    function go() {
        green();
        sleep(1000).then(()=>{
            yellow();
            return sleep(200);
        }).then(()=>{
            red();
            return sleep(500);
        }).then(go);
    }   
```
`sleep(time)`函数返回一个Promise，这个Promise函数主体中有一个`setTimeout(function, delay)`,其中`function`是一个空函数`resolve`。  
通过Promise可以使用链式的方式处理异步函数，完成第一个`sleep(1000)`之后，便会运行第一个`.then(function(){})`。通过返回另一个Promise，这种链式关系就可以继续维持下去。  

这些API可以处理在多个Promise下如何返回结果。
* `Promise.race()` 返回第一个settled的Promise，即无论fulfill还是reject。
* `Promise.any()` 返回第一个fulfill的Promise

### async/await 关键字
语法糖，通过同步编程语法，快速方便地编写异步处理。
```javascript
async function go() {
        while(true){
            green();
            await sleep(1000);
            yellow();
            await sleep(200);
            red();
            await sleep(500);
        }
    }
```
### Generator
通过`function*`生成器函数搭配`yield`关键字模拟异步处理的同步写法。  
```javascript

    function* go() {
        while(true){
            green();
            yield sleep(1000);
            yellow();
            yield sleep(200);
            red();
            yield sleep(500);
        }
    }

    function run(iterator){
        let {value, done} = iterator.next();
        if(done) return;
        if(value instanceof Promise){
            value.then(function(){
                run(iterator);
            });
        }
    }

    function co(generator){
        return function(){
            return run(generator());
        }
    }

    go = co(go);
```
因属于没有Promise时的一种polyfill，所以不需要特别掌握。
