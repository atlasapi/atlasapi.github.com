var homePageTimer;

var queryBeg = 'http://otter.atlasapi.org/3.0/';

var clearTimer = function() {
    clearInterval(homePageTimer);
}

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
        'discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama',
        'discover.json?publisher=bbc.co.uk&available=true',
        'discover.json?publisher=bbc.co.uk&availableCountries=uk',
        'discover.json?title=eastender',
        'discover.json?title=Apprentice',
        'discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama',
        'discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama',
        'discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama',
        'discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama',
        'discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama'
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
    this.width = 0;
    
    this.prevBtn = item.find('.cbtn.previous');
    this.nextBtn = item.find('.cbtn.next');
}

HomeDemo.prototype.init = function(){
    var homeDemo = this;
    
    // Add queries to UL
    $.each(homeDemo.query, function(i){
        $('.controlBar .queryHolder .queries').append('<li><a href="'+homeDemo.query[i]+'" class="api">'+homeDemo.query[i]+'</a></li>');
    });
    
    // Add each query element to array
    $('.controlBar .queryHolder .queries li').each(function(i){
        /*homeDemo.width += $(this).outerWidth(true);
        console.log('+'+$(this).outerWidth(true));*/
        homeDemo.item[i] = {'item': $(this), 'width': $(this).outerWidth(true)};
    });
    
    // Add current class to first query
    homeDemo.item[0].item.addClass('current');
    
    // Set width of scroller
   /* console.log(homeDemo.width);
    $('.queries').css('width', homeDemo.width);*/
    
    // Add onclick event to buttons
    homeDemo.nav.find('.cbtn').click(function(){
    	if(!$(this).hasClass('inactive')) {
			if($(this).hasClass('previous')){
				clearInterval(homeDemo.timer);
				homeDemo.activeQuery++;
				if(homeDemo.activeQuery == 10) {
				    homeDemo.activeQuery = 0;
				}
				if(homeDemo.activeQuery > homeDemo.marker && homeDemo.nextBtn.hasClass('wait')) {
				    homeDemo.nextBtn.removeClass('inactive').removeClass('wait').find('.icn').css('width',16);
				    homeDemo.nextBtn.find('.js_txt').html('Next');
				}
				if(homeDemo.activeQuery >= homeDemo.marker){
				    homeDemo.nextQuery();
				    if(homeDemo.activeQuery == homeDemo.marker) {
                        homeDemo.nextBtn.addClass('inactive').addClass('wait');
	       				homeDemo.countdown();
				    }
                } else if(homeDemo.activeQuery < homeDemo.marker) {
                    homeDemo.nextQuery();
                }
			} else if($(this).hasClass('next')) {
				if(!$(this).hasClass('wait')){
					clearInterval(homeDemo.timer);
					homeDemo.activeQuery--;
					if(homeDemo.activeQuery == -1) {
					   homeDemo.activeQuery = 9;
					}
					if(homeDemo.activeQuery >= homeDemo.marker){
					   homeDemo.prevQuery();
					   if(homeDemo.activeQuery == homeDemo.marker) {
    					   homeDemo.nextBtn.addClass('inactive').addClass('wait');
	       				   homeDemo.countdown();
	       				}
					} else if(homeDemo.activeQuery > homeDemo.marker){
					   homeDemo.prevQuery();
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
    
    console.log('Active Query: '+homeDemo.activeQuery);
    
    console.log(homeDemo.query[homeDemo.activeQuery]+'&limit=2');
    // Make request
    $.ajax({
        url: queryBeg+homeDemo.query[homeDemo.activeQuery]+'&limit=2',
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        cache: true,
        timeout: 5000,
        context: homeDemo.item,
        success: function(data, textStatus, jqXHR){
            console.log('YAR', data, textStatus);
            // Add Image
            var firstShow = $('.slideShow .showItem:first-child');
            var secondShow = $('.slideShow .showItem:last-child');
            
            firstShow.addClass('loading').find('img').fadeOut('fast',function(){
                firstShow.find('img').attr('src',''+data.contents[0].image+'').fadeIn('slow');
                firstShow.find('.br').html(data.contents[0].title);
                firstShow.find('.pub').html('('+data.contents[0].publisher.name+')');
                firstShow.removeClass('loading');
            });
            
            
            secondShow.addClass('loading').find('img').fadeOut('fast', function(){
                secondShow.find('img').attr('src',''+data.contents[1].image+'').fadeIn('slow');
                secondShow.find('.br').html(data.contents[1].title);
                secondShow.find('.pub').html('('+data.contents[1].publisher.name+')');
                secondShow.removeClass('loading');
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
            
            // Scroll left 1. Remove the item from the list and add it to the end
            homeDemo.nextQuery();
            // Restart Countdown
            homeDemo.countdown();
            homeDemo.prevBtn.removeClass('inactive');
        }
    });
}

HomeDemo.prototype.nextQuery = function() {
    var homeDemo = this;
    
    if(homeDemo.activeQuery == 0){
        var item = homeDemo.item[9].item;
    } else {
        var item = homeDemo.item[homeDemo.activeQuery-1].item;
    }
    
    item.removeClass('current').detach().appendTo('.queries');
    homeDemo.item[homeDemo.activeQuery].item.addClass('current');
}

HomeDemo.prototype.prevQuery = function() {
    var homeDemo = this;
    if(homeDemo.activeQuery == 9){
        var item = homeDemo.item[0].item;
    } else {
        var item = homeDemo.item[homeDemo.activeQuery+1].item;
    }
    item.removeClass('current');
    homeDemo.item[homeDemo.activeQuery].item.addClass('current').detach().prependTo('.queries');
}

HomeDemo.prototype.countdown = function() {
    var homeDemo = this;   
    clearInterval(homeDemo.timer); 
	var i = 20;
	var thisItem = homeDemo.nav.find('.js_txt');
	if(homeDemo.buttonClicked) {
    	if(homeDemo.activeQuery == 0) {
    		if(!thisItem.hasClass('inactive')){
    			thisItem.parent('a').addClass('inactive');
    		}
    		homeDemo.timer = setInterval(function() {
    			thisItem.html(i+'s').siblings('.icn').css('width','16px').parent('a').addClass('wait');
    			i--;
    			if(i== -1){
    				thisItem.html('Loading').siblings('.icn').css('width','0');
    				clearTimer(homeDemo.timer);
    				homeDemo.request();
    			}
    		}, 1000);
    	} else {
    		thisItem.html('Next').siblings('.icn').css('width','16px').parent('a').removeClass('wait').removeClass('inactive');
    	}
    } else {
        homeDemo.timer = setInterval(function() {
            thisItem.html(i+'s').siblings('.icn').css('width','16px').parent('a').addClass('wait');
			i--;
			if(i== -1){
				thisItem.html('Loading').siblings('.icn').css('width','0');
				clearTimer(homeDemo.timer);
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
    apiExplorer.holder.find('#advanced_string').val(query);
    apiExplorer.query = queryBeg+query;
    apiExplorer.runQuery();
}

ApiExplorer.prototype.discoverQuery = function(){
    var apiExplorer = this;
    apiExplorer.queryType = 'discover';
}

ApiExplorer.prototype.scheduleQuery = function(){
    var apiExplorer = this;
    apiExplorer.queryType = 'schedule';
}

ApiExplorer.prototype.contentQuery = function(){
    var apiExplorer = this;
    apiExplorer.queryType = 'content';
}

ApiExplorer.prototype.runQuery = function(){
    var apiExplorer = this;
    if(apiExplorer.btn.siblings('.msg:visible')){
        apiExplorer.btn.siblings('.msg').fadeOut();
    }
    apiExplorer.btn.val('Please Wait').addClass('inactive');
    
    apiExplorer.queryBar.txt.html(apiExplorer.query);
    
    apiExplorer.holder.find('#explore_'+apiExplorer.queryType+' .preview').slideUp().find('.showItem').hide();
    
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
            apiExplorer.btn.val('Run').removeClass('inactive');
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
    
    var newJson = JSON.stringify(json)
    /*newJson = newJson.replace(/\//g,"%2F");
    newJson = newJson.replace(/\?/g,"%3F");
    newJson = newJson.replace(/=/g,"%3D");
    newJson = newJson.replace(/&/g,"%26");
    newJson = newJson.replace(/@/g,"%40"); */
    
    // for each {, :, [ and , - new line after
    newJson = newJson.replace(/</g, '&lt;');
    newJson = newJson.replace(/>/g, '&gt;');
    newJson = newJson.replace(/\{/g,'<span class="object"><a href="#" class="toggleBtn">-</a>{<br />');
    newJson = newJson.replace(/\}/g,'}</span>');
    newJson = newJson.replace(/\}\<\/span\>\,/g, '},</span>')
    /*newJson = newJson.replace(/\:/g,':\n');*/
    newJson = newJson.replace(/\[/g,'<span class="array"><a href="#" class="toggleBtn">-</a>[');
    newJson = newJson.replace(/\]/g,']</span>');
    newJson = newJson.replace(/\,/g,',<br />');
    newJson = newJson.replace(/\:\"/g, ': ');
    newJson = newJson.replace(/\"/g, '');
    
    return newJson;
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
    
    $('a.api').click(function(){
        tabs.changeTab(tabs.tab.length-1);
        apiExplorer.customQuery($(this).attr('href'));
        window.location.hash = 'apiExplorer';
        return false;
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
});