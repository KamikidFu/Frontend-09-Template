var regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

var dictionary = ["Number", "Whitespace", "LineTerminator", "*", "/", "+", "-"];

function* tokenize(source) {
    var result = null;
    var lastIdx = 0;
    while (true) {
        lastIdx = regexp.lastIndex;
        result = regexp.exec(source);

        if (!result) break;
        if (regexp.lastIndex - lastIdx > result[0].length) break;

        let token = {
            type: null,
            value: null
        }

        for (var i = 1; i <= dictionary.length; i++) {
            if (result[i]) {
                token.type = dictionary[i - 1];
            }
        }
        token.value = result[0];
        yield token; // When return a serializable object, use yield
    }
    yield {
        type: 'EOF'
    }
}

let source = [];
let ExpressionLabel = {
    Number: "Number",
    Expression: "Expression",
    AdditiveExpression: "AdditiveExpression",
    MultiplicativeExpression: "MultiplicativeExpression"
}

for (let token of tokenize("1 + 2 * 5 + 3")) {
    if (token.type !== "Whitespace" && token.type !== "LineTerminator") {
        source.push(token);
    }
}

function Expression(tokens) {
    if (source[0].type === ExpressionLabel.AdditiveExpression
        && source[1] && source[1].type === "EOF") {
        let node = {
            type: ExpressionLabel.Expression,
            children: [source.shift(), source.shift()]
        }
        source.unshift(node);
        return node;
    }
    AdditiveExpression(source);
    return Expression(source);
}

function AdditiveExpression(source) {
    if (source[0].type === ExpressionLabel.MultiplicativeExpression) {
        let node = {
            type: ExpressionLabel.AdditiveExpression,
            children: [source[0]]
        }
        source[0] = node;
        return AdditiveExpression(source);
    }
    if (source[0].type === ExpressionLabel.AdditiveExpression
        && source[1] && source[1].type === "+") {
        let node = {
            type: ExpressionLabel.AdditiveExpression,
            operator: "+",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }
    if (source[0].type === ExpressionLabel.AdditiveExpression
        && source[1] && source[1].type === "-") {
        let node = {
            type: ExpressionLabel.AdditiveExpression,
            operator: "-",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }
    if (source[0].type === ExpressionLabel.AdditiveExpression) {
        return source[0];
    }
    MultiplicativeExpression(source);
    return AdditiveExpression(source);
}

function MultiplicativeExpression(source) {
    if (source[0].type === ExpressionLabel.Number) {
        let node = {
            type: ExpressionLabel.MultiplicativeExpression,
            children: [source[0]]
        }
        source[0] = node;
        return MultiplicativeExpression(source);
    }
    if (source[0].type === ExpressionLabel.MultiplicativeExpression
        && source[1] && source[1].type === "*") {
        let node = {
            type: ExpressionLabel.MultiplicativeExpression,
            operator: "*",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }
    if (source[0].type === ExpressionLabel.MultiplicativeExpression
        && source[1] && source[1].type === "/") {
        let node = {
            type: ExpressionLabel.MultiplicativeExpression,
            operator: "/",
            children: []
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }
    if (source[0].type === ExpressionLabel.MultiplicativeExpression) {
        return source[0];
    }

    return MultiplicativeExpression(source);
}

console.log(Expression(source));
