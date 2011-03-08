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
        'discover.json?publisher=bbc.co.uk&availableCountries=uk&offset=10',
        'discover.json?title=east',
        'discover.json?title=Britain',
        'discover.json?publisher=bbc.co.uk&genre=drama',
        'discover.json?publisher=seesaw.com',
        'discover.json?publisher=bbc.co.uk&genre=comedy',
        'discover.json?publisher=hulu.com',
        'discover.json?publisher=bbc.co.uk&genre=factual',
        'discover.json?publisher=archive.org'
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
        
    var item = homeDemo.nav.find('.queries');
    item.append('<a href="'+homeDemo.query[homeDemo.activeQuery]+'" class="query api apiDiscover">'+homeDemo.query[homeDemo.activeQuery]+'</a>');
    
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
					   clearInterval(homeDemo.timer);
					   homeDemo.activeQuery++;
					   if(homeDemo.activeQuery == 10){
    					   homeDemo.activequery = 0;
    					}
					   homeDemo.nextQuery();
					   if(homeDemo.activeQuery == homeDemo.marker) {
					       homeDemo.nextBtn.addClass('inactive');
					       homeDemo.prevBtn.removeClass('inactive');
					       homeDemo.countdown();
					       homeDemo.scrolling = false;
					   }
					}
				}
			}
		}
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
    
    // Make request
    $.ajax({
        url: queryBeg+homeDemo.query[homeDemo.activeQuery]+'&limit=10',
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        cache: true,
        timeout: 5000,
        context: homeDemo.item,
        success: function(data, textStatus, jqXHR){            
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
                    firstShow.find('img').attr('src',''+firstContent.image+'').bind('load', function(){
                        console.log($(this).height());
                        if($(this).height() > 0){
                            $(this).fadeIn('slow');
                        } else {
                            // Retry
                            console.log('Didnt work');
                        }
                        return false;
                    });
                    firstShow.find('.br').html(firstContent.title);
                    firstShow.find('.pub').html('('+firstContent.publisher.name+')');
                    firstShow.removeClass('loading');
                }
            });
            
            
            secondShow.addClass('loading').find('img').fadeOut('fast', function(){
                if(secondContent != undefined){
                    secondShow.find('img').attr('src',''+secondContent.image+'').bind('load', function(){
                        console.log($(this).height());
                        if($(this).height() > 0){
                            $(this).fadeIn('slow');
                        } else {
                            // Retry
                            console.log('Didnt work');
                        }
                        return false;
                    });
                    secondShow.find('.br').html(secondContent.title);
                    secondShow.find('.pub').html('('+secondContent.publisher.name+')');
                    secondShow.removeClass('loading');
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
        },
        complete: function(jqXHR, textStatus){
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
        var queryParent = {'item': $(this).parents('.tabArea'), 'name': $(this).parents('.tabArea').attr('id')};
        queryParent.name = queryParent.name.split('_');
        queryParent.name = queryParent.name[1];
        
        var query;
        
        if(queryParent.name != 'advanced'){
            query = queryParent.name+'.json?';
            // Gather query params from options
            var queryParam = [];
            var item1 = true;
            queryParent.item.find('input[type!="submit"]').each(function(i){
                if($(this).val()) {
                    queryParam[i] = {'item': $(this), 'title': $(this).attr('data-title'), 'val': $(this).val()};
                    if(item1 != true){
                        query += '&';
                    }
                    if(queryParam[i].title == 'to' || queryParam[i].title == 'from'){
                        queryParam[i].val = queryParam[i].val.split('/');
                        var newDate = new Date(queryParam[i].val[2], queryParam[i].val[1]-1, queryParam[i].val[0], 0, 0, 0, 0);
                        newDate = newDate.getTime()/1000;
                        newDate = Math.round(newDate);
                        queryParam[i].val = newDate;
                        //queryParam[i].val = Math.round(queryParam[i].val);
                    }
                    query += queryParam[i].title+'='+queryParam[i].val;
                    
                    var item1 = false;
                }
            });
        } else {
        
        }
        
        // Run query type
        switch(queryParent.name) {
            case 'advanced':
                apiExplorer.customQuery(query);
            break;
            case 'discover':
                apiExplorer.discoverQuery(query);
            break;
            case 'schedule':
                apiExplorer.scheduleQuery(query);
            break;
            case 'content':
                apiExplorer.contentQuery(query);
            break;
        }
        
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
    
    $('#discover_title').val(queryTitle).change();
    $('#discover_genre').val(queryGenre).change();
    $('#discover_publisher').val(queryPublisher).change();
    
    /* if(apiExplorer.timedOut == true){*/
        apiExplorer.query = queryBeg+query;
        apiExplorer.runQuery();
    /* } */
}

ApiExplorer.prototype.scheduleQuery = function(query){
    var apiExplorer = this;
    apiExplorer.queryType = 'schedule';
    var queryChannel = apiExplorer.getParamByName('channel',query);
    var queryFrom = apiExplorer.getParamByName('from',query);
    var queryTo = apiExplorer.getParamByName('to',query);
    
    // Convert to and from queries into timestamps
    if(isNaN(parseFloat(queryFrom))) {
        queryFrom = timeConvertor(queryFrom);
    }
    
    if(isNaN(parseFloat(queryTo))) {
        queryTo = timeConvertor(queryTo);
    }
        
    $('#schedule_channel').val(queryChannel).change();
    var d1 = new Date(queryFrom*1000);
    var d2 = new Date(queryTo*1000);
    $('#schedule_from').val(queryFrom).datepicker('setDate', d1);
    $('#schedule_to').val(queryTo).datepicker('setDate', d2);
    
    apiExplorer.query = queryBeg+query;
    apiExplorer.runQuery();
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
    var url = apiExplorer.query;
    if(apiExplorer.queryType != 'schedule'){
        url += '&limit=20';
    }
    $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        cache: true,
        timeout: 5000,
        context: apiExplorer.holder,
        success: function(data, textStatus, jqXHR){
            var results = processTheJson(data);
            
            results.clean(undefined);
            
            if(results.length > 0 && results[0] != undefined){
                $.each(results, function(i){
                    var child = i+1;
                    var item = apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .preview .showItem:nth-child('+child+')');
                    item.find('img').attr('src',''+results[i].image+'').bind('load', function(){
                        console.log($(this).height());
                        if($(this).height() > 0){
                            $(this).fadeIn('slow');
                        } else {
                            console.log('Didnt work');
                        }
                        return false;
                    });
                    item.find('.br').html(results[i].brand);
                    item.find('.pub').html('('+results[i].publisher+')');
                    item.find('.ep').html(results[i].episode);
                    item.removeAttr('style');
                });
            }
            
            apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .preview').slideDown();
            
            apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .output .pre').html(JSON.stringify(data, 'null', '&nbsp;'));
            //apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .output .pre').html(apiExplorer.prettyJson(data));
            
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
                if($(this).parent().hasClass('closed')){
                    $(this).parent().removeClass('closed');
                } else {
                    $(this).parent().addClass('closed');
                }
                return false;
            });
            
            $('.array .btn').click(function(e){
                e.stopImmediatePropagation();
                if($(this).parent().hasClass('closed')){
                    $(this).parent().removeClass('closed');
                } else {
                    $(this).parent().addClass('closed');
                }
                return false;
            });
        },
        error: function(jqXHR, textStatus, errorThrown){
            apiExplorer.msg('error','Sorry, the following error occured: '+errorThrown);
        },
        complete: function(jqXHR, textStatus){
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
    
    
    return newJson;
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

var timeConvertor = function(time){
    if(time == 'now') {
        var newTime = new Date().getTime()/1000;
        return Math.round(newTime);
    } else {
        time = time.split('.');
        if(time.length == 3){
            var modifier = time[2].match(/\D/i);
            switch(modifier[0]){
                case 's':
                case 'S':
                    modifier = 1;
                break;
                case 'm':
                case 'M':
                    modifier = 60;
                break;
                case 'h':
                case 'H':
                    modifier = 3600;
                break;
                case 'd':
                case 'D':
                    modifier = 86400;
                break;
                case 'w':
                case 'W':
                    modifier = 604800;
                break;
                case 'm':
                case 'M':
                    modifier = 2629743;
                break;
                case 'y':
                case 'Y':
                    modifier = 31556926;
                break;
                default:
                    modifier = 0;
                break;
            }
            
            var modifierAmount = time[2].match(/\d*/i);
            
            if(time[0] == 'now') {
                var newTime = new Date().getTime()/1000;
            }
            if(modifier > 0){
                if(time[1] == 'plus'){
                    newTime += modifier*modifierAmount;
                    return Math.round(newTime);
                } else if(time[1] == 'minus'){
                    newTime -= modifier*modifierAmount;
                    return Math.round(newTime);
                }
            }
        }
    }
}

var SelectBox = function(item) {
    this.item = item;
    this.option = [];
    this.current;
    this.input = item.siblings('input[type="hidden"]');
}

SelectBox.prototype.init = function() {
    var selectBox = this;
    
    // Get options
    selectBox.item.find('.option').each(function(i){
        selectBox.option[i] = {'item': $(this), 'name': $(this).html(), 'val': $(this).attr('data-value')};
    });
    
    selectBox.input.change(function(){
        var newValue = $(this).val();
        // Find the selectBox who's val = the input change and set current to that Object
        $.each(selectBox.option, function(i){
            if(selectBox.option[i].val == newValue){
                selectBox.current = selectBox.option[i];
            }
        });
        
        // changeSelection
        selectBox.changeSelection();
    });
}

SelectBox.prototype.changeSelection = function() {
    var selectBox = this;
    
    selectBox.item.find('.option.selected').removeClass('selected');
    
    if(selectBox.current.name != '--'){
        selectBox.item.find('.value').html(selectBox.current.name);
        selectBox.current.item.addClass('selected');
    } else {
        selectBox.item.find('.value').html('-- Please Select');
    }
    
    selectBox.input.val(selectBox.current.val);
}

var processTheJson = function(json){
    var item = [];
    
    // if 'contents' exists
    if(json.contents != undefined){
        if(json.contents.length > 0){
            // for each contents item
            $.each(json.contents, function(i){
                if(json.contents[i].image != undefined && json.contents[i].image != ''){
                    item[i] = {'brand': '', 'publisher': '', 'episode': '', 'series':'', 'image': ''};
                    
                    if(json.contents[i].title != undefined){
                        item[i].brand = json.contents[i].title;
                    }
                    if(json.contents[i].publisher.name != undefined) {
                        item[i].publisher = json.contents[i].publisher.name;
                    }
                    if(json.contents[i].image != undefined){
                        item[i].image = json.contents[i].image;
                    }
                    if(json.contents[i].content != undefined){
                        if(json.contents[i].content[0].title != undefined && json.contents[i].content[0].title != json.contents[i].title){
                            item[i].episode = json.contents[i].content[0].title;
                        }
                        if(json.contents[i].content[0].series_number != undefined){
                            item[i].series = json.contents[i].content[0].series_number;
                        }
                        if(json.contents[i].content[0].image != undefined){
                            item[i].image = json.contents[i].content[0].image;
                        }
                    }
                }
            });
        }
        
    // Else if 'schedule' exists
    } else if(json.schedule[0].items != undefined) {
        $.each(json.schedule[0].items, function(i){
            if(i <= 20 && json.schedule[0].items[i].image != undefined && json.schedule[0].items[i].image != ''){
                item[i] = {'brand': '', 'publisher': '', 'episode': '', 'series':'', 'image': ''};
                
                if(json.schedule[0].items[i].title != undefined){
                    item[i].brand = json.schedule[0].items[i].title;
                }
                if(json.schedule[0].items[i].publisher.name != undefined) {
                    item[i].publisher = json.schedule[0].items[i].publisher.name;
                }
                if(json.schedule[0].items[i].image != undefined){
                    item[i].image = json.schedule[0].items[i].image;
                }
                if(json.schedule[0].items[i].episode_number != undefined){
                    if(json.schedule[0].items[i].brand_summary != undefined && json.schedule[0].items[i].brand_summary.title != json.schedule[0].items[i].title){
                        item[i].brand = json.schedule[0].items[i].brand_summary.title;
                    }
                    if(json.schedule[0].items[i].title != undefined){
                        item[i].episode = json.schedule[0].items[i].title;
                    }
                }
                if(json.schedule[0].items[i].series_number != undefined){
                    item[i].series = json.schedule[0].items[i].series_number;
                }
                if(json.schedule[0].items[i].image != undefined){
                    item[i].image = json.schedule[0].items[i].image;
                }
            }
        });
    }
    
    return item;
}

$(document).ready(function(){
    var pageInfo = new PageInfo();
    pageInfo.init();
    
    $('section:last-child').css('min-height', pageInfo.pageHeight);
        
    var tabs = new Tabs();
    tabs.init($('#explorerWrapper'));
    tabs.changeTab(0);
    
    var apiExplorer = new ApiExplorer($('#explorerWrapper'));
    apiExplorer.buttonHandler();
    
    var selectBox = [];
    $('.select').each(function(i){
        selectBox[i] = new SelectBox($(this));
        selectBox[i].init();
        $(this).find('.option').click(function(){
            selectBox[i].current = {'item': $(this), 'name': $(this).html(), 'val': $(this).attr('data-value')};
            selectBox[i].changeSelection();
            selectBox[i].item.find('.options').hide();
        });
        $(this).hover(function(){
            $(this).find('.options').show();
        }, function() {
            $(this).find('.options').hide();
        });
    });
    
    var homeDemo = new HomeDemo($('.controlBar'));
    homeDemo.init();
    
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
