(function(d){var f={put:function(h,g){(g||window).location.hash=this.encoder(h)},get:function(i){var h=((i||window).location.hash).replace(/^#/,"");try{return d.browser.mozilla?h:decodeURIComponent(h)}catch(g){return h}},encoder:encodeURIComponent};var c={id:"__jQuery_history",init:function(){var g='<iframe id="'+this.id+'" style="display:none" src="javascript:false;" />';d("body").prepend(g);return this},_document:function(){return d("#"+this.id)[0].contentWindow.document},put:function(h){var g=this._document();g.open();g.close();f.put(h,g)},get:function(){return f.get(this._document())}};function e(h){h=d.extend({unescape:false},h||{});f.encoder=i(h.unescape);function i(j){if(j===true){return function(k){return k}}if(typeof j=="string"&&(j=g(j.split("")))||typeof j=="function"){return function(k){return j(encodeURIComponent(k))}}return encodeURIComponent}function g(k){var j=new RegExp(d.map(k,encodeURIComponent).join("|"),"ig");return function(l){return l.replace(j,decodeURIComponent)}}}var b={};b.base={callback:undefined,type:undefined,check:function(){},load:function(g){},init:function(h,g){e(g);a.callback=h;a._options=g;a._init()},_init:function(){},_options:{}};b.timer={_appState:undefined,_init:function(){var g=f.get();a._appState=g;a.callback(g);setInterval(a.check,100)},check:function(){var g=f.get();if(g!=a._appState){a._appState=g;a.callback(g)}},load:function(g){if(g!=a._appState){f.put(g);a._appState=g;a.callback(g)}}};b.iframeTimer={_appState:undefined,_init:function(){var g=f.get();a._appState=g;c.init().put(g);a.callback(g);setInterval(a.check,100)},check:function(){var h=c.get(),g=f.get();if(g!=h){if(g==a._appState){a._appState=h;f.put(h);a.callback(h)}else{a._appState=g;c.put(g);a.callback(g)}}},load:function(g){if(g!=a._appState){f.put(g);c.put(g);a._appState=g;a.callback(g)}}};b.hashchangeEvent={_init:function(){a.callback(f.get());d(window).bind("hashchange",a.check)},check:function(){a.callback(f.get())},load:function(g){f.put(g)}};var a=d.extend({},b.base);if(d.browser.msie&&(d.browser.version<8||document.documentMode<8)){a.type="iframeTimer"}else{if("onhashchange" in window){a.type="hashchangeEvent"}else{a.type="timer"}}d.extend(a,b[a.type]);d.history=a})(jQuery);