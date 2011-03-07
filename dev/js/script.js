var homePageTimer;

var queryBeg = 'http://otter.atlasapi.org/3.0/';

var clearTimer = function() {
    clearInterval(homePageTimer);
}

var apiFuncRun = false;

var Tabs = function() {
    this.tabHolder;
    this.count = 0;
    this.active;
    this.tab = [];
    this.page = [];
}

Tabs.prototype.init = function(e) {
    var tabs = this;
    tabs.tabHolder = e;
    e.find('.tab').each(function(i){
        if($(this).hasClass('tabExt')) {
            tabs.tab[i] = {'id': $(this).attr('data-tab'), 'li': $(this), 'a': $(this)};
        } else {
            tabs.tab[i] = {'id': $(this).find('a').attr('data-tab'), 'li': $(this), 'a': $(this).find('a')};
        }
        tabs.tab[i].a.click(function(){
            tabs.changeTab(i);
            //jQuery.history.load("apiExplorer");
        });
        tabs.count++;
    });
    
    e.find('.tabArea').each(function(i){
        tabs.page[i] = {'index': i, 'item': $(this)};
        tabs.page[i].item.hide();
    });
}

Tabs.prototype.changeTab = function(id) {
    var tabs = this;
    tabs.tabHolder.find('.tab.selected').removeClass('selected');
    tabs.tabHolder.find('.tabArea:visible').hide();
    tabs.tab[id].li.addClass('selected');
    tabs.page[id].item.show();
    
    tabs.active = id;
}

var PageInfo = function() {
    this.pageWidth;
    this.pageHeight;
    this.pageOffset;
    this.section = [];
    this.sections;
    this.currentSection;
    this.menuClick = false;
    this.currentEvent;
}

PageInfo.prototype.init = function() {
    var pageInfo = this;
    pageInfo.update(true,true,true);
    $('section').each(function(i) {
        pageInfo.section[i] = {'name': $(this).attr('class'), 'position': $(this).position().top-82};
    });
    pageInfo.sections = pageInfo.section.length-1;

   /*$.history.init(function(hash){
        if(hash == "") {
        } else {
            pageInfo.update(false,false,true);
        }
    },
    { unescape: ",/" });*/
}

PageInfo.prototype.update = function(width,height,offset) {
    var pageInfo = this;
    if(width) {
        pageInfo.pageWidth = $(window).width();
    }
    if(height) {
        pageInfo.pageHeight = $(window).height();
    }
    if(offset) {
        pageInfo.pageOffset = $(window).scrollTop();
        for(i=0; i<pageInfo.sections; i++) {
            if(i < pageInfo.sections) {
                var nextItem = i+1;
                if(pageInfo.pageOffset > pageInfo.section[i].position && pageInfo.pageOffset < pageInfo.section[nextItem].position) {
                    if(pageInfo.currentSection != i) {
                        //$.history.load(pageInfo.section[i].name);
                        pageInfo.changePage(i);
                    }
                } else if(pageInfo.pageOffset >= pageInfo.section[pageInfo.sections].position){
                    pageInfo.changePage(pageInfo.sections);
                }
            }
        }
    }
}

PageInfo.prototype.changePage = function(i) {
    var pageInfo = this;
    //var homeDemo = new HomeDemo();
    $('header a.selected').removeClass('selected');
    $('header a[href="#'+pageInfo.section[i].name+'"]').addClass('selected');
    // Change hash
    //pageInfo.changeHash(pageInfo.section[i].name);
    pageInfo.currentSection = i;
}

PageInfo.prototype.changeHash = function(n) {
    var pageInfo = this;
    pageInfo.currentEvent.preventDefault();
    window.location.hash = n;
}

var HomeDemo = function(item) {
    this.active = false;
    
    var array0 = [
        'discover.json?publisher=bbc.co.uk&available=true',
        'discover.json?publisher=bbc.co.uk&availableCountries=uk',
        'discover.json?title=east',
        'discover.json?title=news',
        'discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama',
        'discover.json?publisher=channel4.com&genre=http://ref.atlasapi.org/genres/atlas/drama',
        'discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/comedy',
        'discover.json?publisher=channel4.com&genre=http://ref.atlasapi.org/genres/atlas/comedy',
        'discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/factual',
        'discover.json?publisher=channel4.com&genre=http://ref.atlasapi.org/genres/atlas/factual'
        /* '1','2','3','4','5','6','7','8','9','10' */
    ];
    // Select Random Query to start on
    var randomQuery = Math.floor(Math.random()*array0.length);
    
    // Shift the query order
    var array1 = array0.slice(0,randomQuery);
    var array2 = array0.slice(randomQuery);
    this.query = array2.concat(array1);
    
    this.activeQuery = 0;
    this.marker = 0;
    
    this.time = 20000;
    this.timer;
    
    this.nav = item;
    this.item = [];
    this.width = $('.queryHolder').width();
    
    this.prevBtn = item.find('.cbtn.previous');
    this.nextBtn = item.find('.cbtn.next');
    this.scrolling = false;
}

HomeDemo.prototype.init = function(){
    var homeDemo = this;
    
    
    console.log(homeDemo.query);
    
    var item = homeDemo.nav.find('.queries');
    item.append('<a href="'+homeDemo.query[homeDemo.activeQuery]+'" class="query api">'+homeDemo.query[homeDemo.activeQuery]+'</a>');
    
    // Add onclick event to buttons
    homeDemo.nav.find('.cbtn').click(function(){
    	if(!$(this).hasClass('inactive')) {
			if($(this).hasClass('previous')){
				if(homeDemo.activeQuery > 1 && item.children().length > 1){
				    homeDemo.scrolling = true;
				    clearInterval(homeDemo.timer);
				    homeDemo.activeQuery--;
    				homeDemo.prevQuery();
    				homeDemo.nextBtn.removeClass('inactive');
                }
			} else if($(this).hasClass('next')) {
				if(!$(this).hasClass('wait')){			
					if(homeDemo.activeQuery <= homeDemo.marker){
					   homeDemo.scrolling = true;
					   console.log('active is lower then or equal to marker');
					   clearInterval(homeDemo.timer);
					   homeDemo.activeQuery++;
					   if(homeDemo.activeQuery == 10){
    					   homeDemo.activequery = 0;
    					}
					   homeDemo.nextQuery();
					   if(homeDemo.activeQuery == homeDemo.marker) {
					       console.log('active is the same as marker');
					       homeDemo.nextBtn.addClass('inactive');
					       homeDemo.prevBtn.removeClass('inactive');
					       homeDemo.countdown();
					       homeDemo.scrolling = false;
					   }
					}
				}
			}
		}
		console.log(homeDemo.activeQuery, homeDemo.marker, item.children().length);
        return false;
    });
    
    // Make first request
    homeDemo.request();
}

HomeDemo.prototype.request = function() {
    var homeDemo = this;
    // Clear timeout
    clearTimeout(homeDemo.timer);
    
    homeDemo.prevBtn.addClass('inactive');
    homeDemo.nextBtn.addClass('inactive');
    
    console.log('Active Query: '+homeDemo.activeQuery);
    
    console.log(homeDemo.query[homeDemo.activeQuery]+'&limit=4');
    // Make request
    $.ajax({
        url: queryBeg+homeDemo.query[homeDemo.activeQuery]+'&limit=4',
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        cache: true,
        timeout: 5000,
        context: homeDemo.item,
        success: function(data, textStatus, jqXHR){
            console.log('YAR', data, textStatus);
            
            homeDemo.nav.find('.timer').fadeOut();
            
            // Add Image
            var firstShow = $('.slideShow .showItem:first-child');
            var secondShow = $('.slideShow .showItem:last-child');
            
            if(data.contents[0] != undefined && data.contents[0].image != undefined) {
                var firstContent = data.contents[0];
            }
            if(data.contents[1] != undefined && data.contents[1].image != undefined) {
                if(firstContent == undefined){
                    var firstContent = data.contents[1];
                } else {
                    var secondContent = data.contents[1];
                }
            }
            if(data.contents[2] != undefined && data.contents[2].image != undefined) {
                if(firstContent == undefined){
                    var firstContent = data.contents[2];
                } else if(secondContent == undefined) {
                    var secondContent = data.contents[2];
                }
            }
            
            if(data.contents[3] != undefined && data.contents[3].image != undefined) {
                if(firstContent == undefined){
                    var firstContent = data.contents[3];
                } else if(secondContent == undefined) {
                    var secondContent = data.contents[3];
                }
            }
            
            firstShow.addClass('loading').find('img').fadeOut('fast',function(){
                if(firstContent != undefined){
                    firstShow.find('img').attr('src',''+firstContent.image+'').bind('load', function(){$(this).fadeIn('slow'); return false;});
                    firstShow.find('.br').html(firstContent.title);
                    firstShow.find('.pub').html('('+firstContent.publisher.name+')');
                    firstShow.removeClass('loading');
                }
            });
            
            
            secondShow.addClass('loading').find('img').fadeOut('fast', function(){
                if(secondContent != undefined){
                    secondShow.find('img').attr('src',''+secondContent.image+'').bind('load', function(){$(this).fadeIn('slow'); return false;});
                    secondShow.find('.br').html(secondContent.title);
                    secondShow.find('.pub').html('('+secondContent.publisher.name+')');
                    secondShow.removeClass('loading');
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('NAY', textStatus, errorThrown);
        },
        complete: function(jqXHR, textStatus){
            console.log(textStatus);
            // Set activeQuery to next in list
            if(homeDemo.activeQuery < homeDemo.query.length-1) {
                homeDemo.activeQuery++;
                homeDemo.marker++;
            } else {
                homeDemo.activeQuery = 0;
                homeDemo.marker = 0;
            }
            
            // Restart Countdown
            homeDemo.countdown();
            
            if(homeDemo.marker > 1){
                homeDemo.prevBtn.removeClass('inactive');
            }
        }
    });
}

HomeDemo.prototype.nextQuery = function() {
    var homeDemo = this;
        
    var item = homeDemo.nav.find('.queries');
    if(homeDemo.activeQuery != 0) {
        if(item.children().length < 10 && homeDemo.scrolling == false){
            var clone = item.children('a:last-child').clone();
            clone.attr('href',homeDemo.query[homeDemo.activeQuery]).html(homeDemo.query[homeDemo.activeQuery]);
            clone.appendTo(item);
            /*var href = '<a href="'+homeDemo.query[homeDemo.activeQuery]+'" class="query api">'+homeDemo.query[homeDemo.activeQuery]+'</a>';
            item.append(href);
            console.log(href);*/
        }
        item.animate({'left': '-='+homeDemo.width},1000);
    } else {
        item.animate({'left': '0'},1000);
    }
    
    if(homeDemo.activeQuery <= homeDemo.marker && homeDemo.prevBtn.hasClass('inactive')){
        homeDemo.prevBtn.removeClass('inactive');
    }
}

HomeDemo.prototype.prevQuery = function() {
    var homeDemo = this;
    
    var item = homeDemo.nav.find('.queries');
    
    homeDemo.nav.find('.timer').fadeOut();
    
    if(homeDemo.activeQuery != 9) {
        item.animate({'left': '+='+homeDemo.width}, 1000);
    }  
    if(homeDemo.activeQuery == 1) {
        homeDemo.prevBtn.addClass('inactive');
    }
}

HomeDemo.prototype.countdown = function() {
    var homeDemo = this;   
    clearInterval(homeDemo.timer); 
	var i = 20;
	var thisItem = homeDemo.nav.find('.timer');
	if(homeDemo.buttonClicked) {
    	if(homeDemo.activeQuery == homeDemo.marker) {
            thisItem.fadeIn();
    		homeDemo.timer = setInterval(function() {
    			thisItem.find('.js_txt').html(i+'s');
    			i--;
    			if(i== -1){
    				thisItem.find('.js_txt').html('Loading');
    				clearTimer(homeDemo.timer);
    				homeDemo.request();
    			}
    		}, 1000);
    	} else {
    		thisItem.fadeOut();
    	}
    } else {
        homeDemo.timer = setInterval(function() {
            if(!thisItem.is(':visible')){
                thisItem.fadeIn();
            }
            thisItem.find('.js_txt').html(i+'s');
			i--;
			if(i== -1){
				thisItem.find('.js_txt').html('Loading');
				clearTimer(homeDemo.timer);
				homeDemo.nextQuery();
				homeDemo.request();
			}
        }, 1000);
    }
}

var ApiExplorer = function(item) {
    this.holder = item;
    this.queryType;
    this.query;
    this.btn = $('.btn[value="Run"]');
    this.queryBar = {'txt': $('.urlCopy').find('.urlTxt'), 'btn': $('.urlCopy').find('.btnCopy')};
    this.timedOut = false;
}

ApiExplorer.prototype.buttonHandler = function(){
    var apiExplorer = this;
    $('a.btnCopy').click(function(){
        var clip = new ZeroClipboard.Client();
        clip.glue('queryCopyBtn');
        clip.setHandCursor(true);
        clip.setText(apiExplorer.query);
        return false;
    });
    
    $('input[value="Run"]').click(function(){
        console.log('Run');
        return false;
    });
}

ApiExplorer.prototype.customQuery = function(query){
    var apiExplorer = this;
    apiExplorer.queryType = 'advanced';
    var queryHolder = apiExplorer.holder.find('#advanced_string');
    if(queryHolder.val() != query){
        queryHolder.val(query);
        apiExplorer.query = queryBeg+query;
        apiExplorer.runQuery();
    }
}

ApiExplorer.prototype.discoverQuery = function(query){
    var apiExplorer = this;
    apiExplorer.queryType = 'discover';
    var queryTitle = apiExplorer.getParamByName('title',query);
    var queryGenre = apiExplorer.getParamByName('genre',query);
    var queryPublisher = apiExplorer.getParamByName('publisher',query);
    
    $('#discover_title').val(queryTitle);
    
    /* if(apiExplorer.timedOut == true){*/
        apiExplorer.query = queryBeg+query;
        apiExplorer.runQuery();
    /* } */
}

ApiExplorer.prototype.scheduleQuery = function(){
    var apiExplorer = this;
    apiExplorer.queryType = 'schedule';
}

ApiExplorer.prototype.contentQuery = function(){
    var apiExplorer = this;
    apiExplorer.queryType = 'content';
}

ApiExplorer.prototype.getParamByName = function(name,string){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( string );
    if( results == null )
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

ApiExplorer.prototype.runQuery = function(){
    var apiExplorer = this;
    if(apiExplorer.btn.siblings('.msg:visible')){
        apiExplorer.btn.siblings('.msg').fadeOut();
    }
    apiExplorer.btn.val('Please Wait').addClass('inactive');
    
    apiExplorer.queryBar.txt.html(apiExplorer.query);
    
    apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .preview').slideUp().find('.showItem').hide();
    apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .output').slideUp();
    
    // Make request
    $.ajax({
        url: apiExplorer.query+'&limit=5',
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        cache: true,
        timeout: 5000,
        context: apiExplorer.holder,
        success: function(data, textStatus, jqXHR){
            console.log(data);
            $.each(data.contents, function(i){
                var child = i+1;
                var item = apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .preview .showItem:nth-child('+child+')');
                console.log(item);
                console.log(data.contents[i].image);
                if(data.contents[i].image){
                    item.removeClass('loading');
                    item.find('img').attr('src',data.contents[i].image);
                    item.find('.br').html(data.contents[i].title);
                    item.find('.pub').html('('+data.contents[i].publisher.name+')');
                    item.removeAttr('style');
                }
            });
            apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .preview').slideDown();
            
            apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .output .pre').html(apiExplorer.prettyJson(data));
            
        	$('.preToggle').click(function(){
                if(!$(this).parent().hasClass('shrunk')){
                    $(this).html('+').parent().addClass('shrunk').animate({
                        'height' : '15'
                    });
                } else {
                    $(this).html('-').parent().removeClass('shrunk').css({
                        'height' : 'auto'
                    });
                }
                return false;
            });
            apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .output').slideDown();
            
            $('.object .btn').click(function(e){
                e.stopImmediatePropagation();
                console.log($(this).parent());
                if($(this).parent().hasClass('closed')){
                    $(this).parent().removeClass('closed');
                } else {
                    $(this).parent().addClass('closed');
                }
                return false;
            });
            
            $('.array .btn').click(function(e){
                e.stopImmediatePropagation();
                console.log($(this).parent());
                if($(this).parent().hasClass('closed')){
                    $(this).parent().removeClass('closed');
                } else {
                    $(this).parent().addClass('closed');
                }
                return false;
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('NAY', textStatus, errorThrown);
            apiExplorer.msg('error','Sorry, the following error occured: '+errorThrown);
        },
        complete: function(jqXHR, textStatus){
            console.log(textStatus);
            if(textStatus == 'timeout') {
                apiExplorer.timedOut = true;
            }
            apiExplorer.btn.val('Run').removeClass('inactive');
            apiFuncRun = false;
        }
    });
}

ApiExplorer.prototype.msg = function(type, message){
    var apiExplorer = this;
    console.log(apiExplorer.queryType, type, message);
    var msgPane = $('#explore_'+apiExplorer.queryType).find('.msg');
    msgPane.addClass(type).html(message).fadeIn();
}

ApiExplorer.prototype.prettyJson = function(json) {
    var apiExplorer = this;
    
    var p = [],
		push = function( m ) { return '\\' + p.push( m ) + '\\'; };
		pop = function( m, i ) { return p[i-1] };
		tabs = function( count ) { return new Array( count + 1 ).join( '\t' ); };
    
    // Extract backslashes and strings
    console.log(JSON.stringify(json));
    json = JSON.stringify(json);
    
    p = [];
		var out = "",
			indent = 0;
	json = json
		.replace( /\\./g, push )
		.replace( /(".*?"|'.*?')/g, push )
		.replace( /\s+/, '' );		

	// Indent and insert newlines
	for( var i = 0; i < json.length; i++ ) {
		var c = json.charAt(i);

		switch(c) {
			case '{':
			case '[':
				/*out += c + "\n<div class=\"content\"><a href=\"#\" class=\"preToggle\">-</a>" + tabs(++indent);*/
				out += c + "\n" + tabs(++indent);
				break;
			case '}':
			case ']':
				/*out += "</div>\n" + tabs(--indent) + c;*/
				out += "\n" + tabs(--indent) + c;
				break;
			case ',':
				out += ",\n" + tabs(indent);
				break;
			case ':':
				out += ": ";
				break;
			default:
				out += c;
				break;      
		}					
	}

	// Strip whitespace from numeric arrays and put backslashes 
	// and strings back in
	out = out
		.replace( /\[[\d,\s]+?\]/g, function(m){ return m.replace(/\s/g,''); } ) 
		.replace( /\\(\d+)\\/g, pop );

	return out;
    
    var newJson = JSON.stringify(json, null, '\t');
    /*newJson = newJson.replace(/\//g,"%2F");
    newJson = newJson.replace(/\?/g,"%3F");
    newJson = newJson.replace(/=/g,"%3D");
    newJson = newJson.replace(/&/g,"%26");
    newJson = newJson.replace(/@/g,"%40"); */
    
    // for each {, :, [ and , - new line after
   /* newJson = newJson.replace(/</g, '&lt;');
    newJson = newJson.replace(/>/g, '&gt;');
    newJson = newJson.replace(/\{/g,'<span class="object"><a href="#" class="toggleBtn">-</a>{<br />');
    newJson = newJson.replace(/\}/g,'}</span>');
    newJson = newJson.replace(/\}\<\/span\>\,/g, '},</span>')*/
    /*newJson = newJson.replace(/\:/g,':\n');*/
    /*newJson = newJson.replace(/\[/g,'<span class="array"><a href="#" class="toggleBtn">-</a>[');
    newJson = newJson.replace(/\]/g,']</span>');
    newJson = newJson.replace(/\,/g,',<br />');
    newJson = newJson.replace(/\:\"/g, ': ');
    newJson = newJson.replace(/\"/g, ''); */
    
    console.log(newJson);
    
    return newJson;
}

ApiExplorer.prototype.selectBoxes = function() {
    
}

$(document).ready(function(){
    var pageInfo = new PageInfo();
    pageInfo.init();
    
    $('section:last-child').css('min-height', pageInfo.pageHeight);
    
    var homeDemo = new HomeDemo($('.controlBar'));
    homeDemo.init();
    
    var tabs = new Tabs();
    tabs.init($('#explorerWrapper'));
    tabs.changeTab(0);
    
    var apiExplorer = new ApiExplorer($('#explorerWrapper'));
    apiExplorer.buttonHandler();    
    
    $('a.apiDiscover').click(function(){
        if(apiFuncRun == false) {
            tabs.changeTab(0);
            apiExplorer.discoverQuery($(this).attr('href'));
            window.location.hash = 'apiExplorer';
            apiFuncRun = true;
            return false;
        }
    });
    
    $('a.apiSchedule').click(function(){
        if(apiFuncRun == false) {
            tabs.changeTab(1);
            apiExplorer.scheduleQuery($(this).attr('href'));
            window.location.hash = 'apiExplorer';
            apiFuncRun = true;
            return false;
        }
    });
    
    $('a.api').click(function(){
        if(apiFuncRun == false) {
            tabs.changeTab(tabs.tab.length-1);
            apiExplorer.customQuery($(this).attr('href'));
            window.location.hash = 'apiExplorer';
            apiFuncRun = true;
            return false;
        }
    });
    
    $('input.date').datepicker({
        showOn: "button",
        buttonImage: "images/date.gif",
        buttonImageOnly: true,
        dateFormat: 'dd/mm/yy'
    });
    
    $('.mainMenu a').click(function(){
        pageInfo.menuClick = true;
    });
    
    /* $('.hov').each(function(){
        console.log('Found');
        console.log($(this).position().left+$(this).width(), $(this).html());
    }); */
    
    $(window).scroll(function(e){
        pageInfo.currentEvent = e;
        pageInfo.update(false,false,true);
    });
    
    var hoverTimer;
    $('.hov').bind('mouseover',function() {
        var that = $(this);
        hoverTimer = setTimeout(function(){
            if(that.find('.hover').length == 0) {
                $('.hover[data-title="'+that.attr('data-title')+'"]').clone().appendTo(that).fadeIn('fast');
            } else {
                that.find('.hover').fadeIn('fast');
            }
        }, 1000);
    $('.hov').bind('mouseout',function(){
            clearTimeout(hoverTimer);
            that.find('.hover').fadeOut('fast');
        });
    });
});