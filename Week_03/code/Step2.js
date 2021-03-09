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

for (let token of tokenize("1024 + 10 * 25")) {
    console.log(token);
}
