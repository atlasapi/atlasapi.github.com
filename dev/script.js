var homePageTimer;

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
    console.log(pageInfo.currentEvent.isDefaultPrevented());
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
    console.log('add queries to dom');
    $.each(homeDemo.query, function(i){
        $('.controlBar .queryHolder .queries').append('<li><a href="#" class="api">'+homeDemo.query[i]+'</a></li>');
    });
    
    // Add each query element to array
    console.log('create array of said elements');
    $('.controlBar .queryHolder .queries li').each(function(i){
        /*homeDemo.width += $(this).outerWidth(true);
        console.log('+'+$(this).outerWidth(true));*/
        homeDemo.item[i] = {'item': $(this), 'width': $(this).outerWidth(true)};
    });
    
    // Add current class to first query
    console.log('add current class to first item');
    homeDemo.item[0].item.addClass('current');
    
    // Set width of scroller
   /* console.log(homeDemo.width);
    $('.queries').css('width', homeDemo.width);*/
    
    // Add onclick event to buttons
    homeDemo.nav.find('.cbtn').click(function(){
    	if(!$(this).hasClass('inactive')) {
    	   console.log('home demo marker='+homeDemo.marker);
			if($(this).hasClass('previous')){
				clearInterval(homeDemo.timer);
				homeDemo.activeQuery++;
				if(homeDemo.activeQuery == 10) {
				    homeDemo.activeQuery = 0;
				}
				console.log(homeDemo.activeQuery);
				if(homeDemo.activeQuery > homeDemo.marker && homeDemo.nextBtn.hasClass('wait')) {
				    console.log('Active query is above 0');
				    homeDemo.nextBtn.removeClass('inactive').removeClass('wait').find('.icn').css('width',16);
				    homeDemo.nextBtn.find('.js_txt').html('Next');
				}
				if(homeDemo.activeQuery >= homeDemo.marker){
				    console.log('greater');
				    homeDemo.nextQuery();
				    if(homeDemo.activeQuery == homeDemo.marker) {
                        homeDemo.nextBtn.addClass('inactive').addClass('wait');
	       				homeDemo.countdown();
				    }
                } else if(homeDemo.activeQuery < homeDemo.marker) {
                    console.log('less');
                    homeDemo.nextQuery();
                }
			} else if($(this).hasClass('next')) {
				if(!$(this).hasClass('wait')){
					clearInterval(homeDemo.timer);
					homeDemo.activeQuery--;
					if(homeDemo.activeQuery == -1) {
					   homeDemo.activeQuery = 9;
					}
					console.log(homeDemo.activeQuery);
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
    console.log('make first request');
    homeDemo.request();
}

HomeDemo.prototype.request = function() {
    var homeDemo = this;
    // Clear timeout
    console.log('clear timeout');
    clearTimeout(homeDemo.timer);
    
    homeDemo.prevBtn.addClass('inactive');
    
    console.log('active query='+homeDemo.activeQuery);
    // Make request
    $.ajax({
        url: 'http://otter.atlasapi.org/3.0/'+homeDemo.query[homeDemo.activeQuery]+'&limit=2',
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        timeout: 5000,
        context: homeDemo.item,
        success: function(data, textStatus, jqXHR){
            console.log('YAR', data, textStatus);
            
            data = JSON.parse(data);
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
                console.log('new active query='+homeDemo.activeQuery);
            } else {
                console.log('new active query=0');
                homeDemo.activeQuery = 0;
                homeDemo.marker = 0;
            }
            
            // Scroll left 1. Remove the item from the list and add it to the end
            console.log('next query');
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


$(document).ready(function(){
    var pageInfo = new PageInfo();
    pageInfo.init();
    
    $('section:last-child').css('min-height', pageInfo.pageHeight);
    
    var homeDemo = new HomeDemo($('.controlBar'));
    homeDemo.init();
    
    var tabs = new Tabs();
    tabs.init($('#explorerWrapper'));
    tabs.changeTab(0);
    
    
    $('input.date').datepicker({
        showOn: "button",
        buttonImage: "images/date.gif",
        buttonImageOnly: true,
        dateFormat: 'dd/mm/yy'
    });
    
    $('.mainMenu a').click(function(){
        pageInfo.menuClick = true;
    });
    
    $(window).scroll(function(e){
        pageInfo.currentEvent = e;
        pageInfo.update(false,false,true);
    });
});