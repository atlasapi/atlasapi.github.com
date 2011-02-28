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
    var homePage = new HomePage();
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

var HomePage = function() {
    this.active = false;
    this.query = [
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2',
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2',
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2',
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2',
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2',
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2',
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2',
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2',
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2',
        'http://otter.atlasapi.org/3.0/discover.json?publisher=bbc.co.uk&genre=http://ref.atlasapi.org/genres/atlas/drama&limit=2'
    ];
    this.activeQuery;
    this.timer;
    this.time = 20000;
}

HomePage.prototype.init = function() {
    console.log('INIT');
    var homePage = this;
    
    // Get number of queries in list, pick one at random and start from there.
    homePage.activeQuery = Math.floor(Math.random()*homePage.query.length);
    
    // Do ajax request
    homePage.request();
    
    homePage.active = true;
}

HomePage.prototype.request = function() {
    var homePage = this;
    // Clear timeout
    clearTimeout(homePage.timer);
    
    console.log(homePage.query[homePage.activeQuery]);
    // Make request
    $.ajax({
        url: homePage.query[homePage.activeQuery],
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        timeout: 5000,
        context: homePage.item,
        success: function(data, textStatus, jqXHR){
            console.log('YAR', data, textStatus);
            
            data = JSON.parse(data);
            
            // Restart Countdown
            homePage.countdown();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('NAY', textStatus, errorThrown);
        },
        complete: function(jqXHR, textStatus){
            console.log(textStatus);
            // Set activeQuery to next in list
            if(homePage.activeQuery < homePage.query.length) {
                homePage.activeQuery++;
            } else {
                homePage.activeQuery = 0;
            }
            // Restart Countdown
            homePage.countdown();
        }
    });
}

HomePage.prototype.countdown = function() {
    var homePage = this;
    /*homePage.timer = setTimeout(function() {
        homePage.request();
        var timer = setInterval(function() {
            for(i=20; i<0; i--){
                console.log(i);
            }
            clearInterval(timer);
        }, 1000);
    }, homePage.time);*/
    
    var i = 20;
    homePage.timer = setInterval(function() {
        $('.controlBar .js_txt').html(i+'s').siblings('.icn').css('width','16px');
        i--;
        if(i== -1){
            $('.controlBar .js_txt').html('Loading').siblings('.icn').css('width','0');
            clearInterval(homePage.timer);
            homePage.request();
        }
    }, 1000);
    /*
    } else {
            clearInterval(homePage.timer);
            homePage.request();
        }*/
}

$(document).ready(function(){
    var pageInfo = new PageInfo();
    pageInfo.init();
    
    $('section:last-child').css('min-height', pageInfo.pageHeight);
    
    var tabs = new Tabs();
    tabs.init($('#explorerWrapper'));
    tabs.changeTab(0);
    
    var homePage = new HomePage();
    homePage.init();
    
    
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