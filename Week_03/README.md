# 学习笔记
> 第三周 ： 3月8日 - 3月14日

## LL算法
Left-Left算法
* 从左到右扫描
* 从左到右规约

### 四则运算分析
#### 词法定义
* TokenNumber (Number):
  * `1` `2` `3` `4` `5` `6` `7` `8` `9` `0` 数字的组合
    
* Operator：
  * `+` `-` `*` `/` 运算符的组合
    
#### 语法定义
```text
<Expression> ::= <AdditiveExpression><EOF>

<AdditiveExpression> ::=
    <MultiplicationExpression>
    |<AdditiveExpression><+><MultiplicativeExpression>
    |<AdditiveExpression><-><MultiplicativeExpression>
    
<MultiplicativeExpression> ::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>
```
* 终结符 (直接通过词法扫描得来) Terminal Symbol：
  * `<EOF>` End of File
  * `<Number>`
  *  `<*>` `</>` `<+>` `<->`
    
* 非终结符 Non-terminal Symbol： 通过终结符的组合而来
