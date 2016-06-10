onmessage = function(evt) {
    var newJson = evt.data;
    newJson = newJson.replace(/\</g, '&lt;');
    newJson = newJson.replace(/\>/g, '&gt;');
    postMessage(newJson);
};