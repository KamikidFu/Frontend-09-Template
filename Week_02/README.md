# 学习笔记
> 第二周 ： 3月1日 - 3月7日

## Map Editor 地图编辑器
![MapEditor](img/MapEditor.png)  
第一个小目标是制作一个地图编辑器，大小为100x100单位。地图将被绘制在一个`div#container`之中，搭配一个按钮用于保存。  
### 保存地图
```html
<button onclick="localStorage['map'] = JSON.stringify(map)">save</button>
```
通过`localStorage`来保存当前地图对象`map`。
### 变量
`mousedown`  
布尔变量，用于监听鼠标是否被按下。  

`clear`  
布尔变量，用于监听是否为鼠标右键被按下，以清除地图中的点。

`map`  
数组，用来保存地图数据，初始值为带有10000个0的数组。

`container`  
HTML元素，通过`document.getElementById`获取

### 绘制方式
* 通过嵌套迭代，画出其x与y轴上各点。
* 地图对象中0为灰色，1为黑色以区分。
* 为每一个点添加鼠标落下事件监听。
  * 鼠标任意键落下，`mousedown`状态为`true`
  * 鼠标右键落下，`clear`状态为`true`
  * 鼠标收起，`mousedown`状态为`false`
* 屏蔽鼠标右键弹出菜单
```javascript
for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');

        if (map[100 * y + x] === 1) {
            cell.style.backgroundColor = 'black';
        }

        cell.addEventListener("mousemove", () => {
            if (mousedown) {
                if (clear) {
                    cell.style.backgroundColor = "";
                    map[100 * y + x] = 0;
                } else {
                    cell.style.backgroundColor = "black";
                    map[100 * y + x] = 1;
                }
            }
        });
        container.appendChild(cell);
    }
}

document.addEventListener("mousedown", e => {
    mousedown = true;
    clear = (e.button === 2); //.which is non-standard, so use .button
});
document.addEventListener("mouseup", () => mousedown = false);
document.addEventListener("contextmenu", e => e.preventDefault());
```
### 风格样式
因为地图中每个小点都是一个简单的`div`，所以添加风格样式以能更好的可视化。
```css
.cell {
    display: inline-block; /* 因为需要将多个div横排显示 */
    width: 6px;
    height: 6px;
    background-color: gray;
    border-bottom: solid 1px white;
    border-right: solid 1px white;
    vertical-align: top;
}

#container {
    width: 700px; /* min: (6+1)*100 = 700px ~ max: 700+6=706 */
    line-height: 1px; /* 设置行高使得每个div左右上下间距一致 */
}
```

## Path find 寻路

