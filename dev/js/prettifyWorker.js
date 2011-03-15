onmessage = function(evt) {    
    var length = evt.data.contents.length;

    if(length < 5){
        evt.contents.slide(0,5);
    }

    var newJson = prettyPrintOne(JSON.stringify(evt, 'null', '&nbsp;'));

    postMessage(newJson);
}