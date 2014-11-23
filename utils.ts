module Utils {
    export function decodeHTML(text : string) : string {
        var characterMap = { "gt": ">", "lt": "<"};
        return text.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function ($0, $1) {
            if ($1[0] === "#") {
                return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16) : parseInt($1.substr(1), 10));
            } else {
                return characterMap.hasOwnProperty($1) ? characterMap[$1] : $0;
            }
        });
    }
}