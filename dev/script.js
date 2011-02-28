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

    $.history.init(function(hash){
        if(hash == "") {
        } else {
            pageInfo.update(false,false,true);
        }
    },
    { unescape: ",/" });
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
    var homeDemo = new HomeDemo();
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
    this.query = [
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
    ];
    this.activeQuery;
    this.time = 20000;
    this.timer;
    
    this.nav = item;
    this.currentPosition = 0;
    this.item = [];
    this.width = 0;
}

HomeDemo.prototype.init = function(){
    var homeDemo = this;
    
    // Select Random Query to start on
    homeDemo.activeQuery = Math.floor(Math.random()*homeDemo.query.length);
    
    // Add queries to UL
    $.each(homeDemo.query, function(i){
        $('.controlBar .queryHolder .queries').append('<li><a href="#">'+homeDemo.query[i]+'</a></li>');
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
				homeDemo.currentPosition++;
				homeDemo.scrollIt(homeDemo.currentPosition,0);
			} else if($(this).hasClass('next')) {
				if(!$(this).hasClass('wait')){
					clearInterval(homeDemo.timer);
					if(homeDemo.currentPosition != 0){
						homeDemo.currentPosition--;
						homeDemo.scrollIt(homeDemo.currentPosition,1);
					} else {
						homeDemo.countdown();
					}
				}
			}
		}
        return false;
    });
    
    // Make first request
    homeDemo.request();
}

HomeDemo.prototype.scrollIt = function(pos,mod) {
    var homeDemo = this;
    console.log(pos);
    homeDemo.countdown();
    if(mod==0){
    	if(pos > 0 && pos < 10) {
            homeDemo.nav.find('.queries').animate({
                right: -775*pos
            },500);
            homeDemo.item[pos-1].item.removeClass('current');
	    }
	    if(pos == 9) {
	    	homeDemo.nav.find('.previous').addClass('inactive');
	    }
	} else {
		homeDemo.nav.find('.queries').animate({
			right: -775*pos
		},500);
		homeDemo.item[pos+1].item.removeClass('current');
	}

    homeDemo.item[pos].item.addClass('current');
}

HomeDemo.prototype.request = function() {
    var homeDemo = this;
    // Clear timeout
    clearTimeout(homeDemo.timer);
    
    console.log(homeDemo.query[homeDemo.activeQuery]);
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
            if(homeDemo.activeQuery < homeDemo.query.length) {
                homeDemo.activeQuery++;
            } else {
                homeDemo.activeQuery = 0;
            }
            // Restart Countdown
            homeDemo.countdown();
        }
    });
}

HomeDemo.prototype.countdown = function() {
    var homeDemo = this;   
    clearInterval(homeDemo.timer); 
	var i = 20;
	var thisItem = homeDemo.nav.find('.js_txt');
	if(homeDemo.currentPosition == 0) {
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
}


$(document).ready(function(){
    var pageInfo = new PageInfo();
    pageInfo.init();
    
    $('section:last-child').css('min-height', pageInfo.pageHeight);
    
    var tabs = new Tabs();
    tabs.init($('#explorerWrapper'));
    tabs.changeTab(0);
    
    var homeDemo = new HomeDemo($('.controlBar'));
    homeDemo.init();
    
    
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