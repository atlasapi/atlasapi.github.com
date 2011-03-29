var homePageTimer;

var queryBeg = 'http://atlasapi.org/3.0/';

var clearTimer = function() {
    clearInterval(homePageTimer);
}

var apiFuncRun = false;

var message = false;

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
    
    var tempTab = [];
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
    
    var clip = new ZeroClipboard.Client();
    clip.glue(tabs.page[tabs.active].item.find('.urlCopy .btnCopy').attr('id'), tabs.page[tabs.active].item.find('.urlCopy').attr('id'));
    
    clip.addEventListener('mouseDown', function(){
        clip.setText(tabs.page[tabs.active].item.find('.urlCopy .urlTxt').val());
    });
}

var SubTabs = function() {
    this.tabHolder;
    this.count = 0;
    this.active;
    this.tab = [];
    this.page = [];
}

SubTabs.prototype.init = function(e) {
    var tabs = this;
    tabs.tabHolder = e;
    
    var tempTab = [];
    e.find('.subTab').each(function(i){
        if($(this).hasClass('subTabExt')) {
            tabs.tab[i] = {'id': $(this).attr('data-tab'), 'li': $(this), 'a': $(this)};
        } else {
            tabs.tab[i] = {'id': $(this).find('a').attr('data-tab'), 'li': $(this), 'a': $(this).find('a')};
        }
        tabs.tab[i].a.click(function(){
            tabs.changeTab(i);
            //jQuery.history.load("apiExplorer");
            window.location.hash = 'apiExplorer';
            return false;
        });
        tabs.count++;
    });
    
    e.find('.subTabArea').each(function(i){
        tabs.page[i] = {'index': i, 'item': $(this)};
        tabs.page[i].item.hide();
    });
}

SubTabs.prototype.changeTab = function(id) {
    var tabs = this;
    tabs.tabHolder.find('.subTab.selected').removeClass('selected');
    tabs.tabHolder.find('.subTabArea:visible').hide();
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
    this.subSection = [];
    this.subSections;
    this.currentSection;
    this.currentSubSection;
    this.menuClick = false;
    this.currentEvent;
    this.changePageTimer = false;
}

PageInfo.prototype.init = function() {
    var pageInfo = this;
    pageInfo.update(true,true,true);
    $('section:not(.subSection)').each(function(i) {
        pageInfo.section[i] = {'item': $(this), 'name': $(this).attr('class'), 'position': $(this).find('.marker').offset().top, 'subSection': [], 'subSections': ''};
        $(this).find('.subSection').each(function(ii) {
            pageInfo.section[i].subSection[ii] = {'item': $(this), 'name': $(this).attr('data-title'), 'position': $(this).find('.marker').offset().top};
            var leftPos = $('.mainMenu a[href="#'+pageInfo.section[i].name+'"]').offset().left;
            pageInfo.section[i].item.find('.subNav').css({
                'left': leftPos-2
            });
        });
        pageInfo.section[i].subSections = pageInfo.section[i].subSection.length;
    });
    pageInfo.sections = pageInfo.section.length-1;
    
    $('section.subSection').each(function(i) {
        pageInfo.subSection[i] = {'name': $(this).attr('data-title'), 'position': $(this).find('.marker').offset().top, 'parent': $(this).parent().attr('class')};
    });
    pageInfo.subSections = pageInfo.subSection.length;
    
    $('body').keyup(function(e){
        /*if($(':focus').length == 0) {
            if(pageInfo.currentSection == undefined){
                pageInfo.currentSection = 0;
            }
            if(pageInfo.section[pageInfo.currentSection].subSections > 0) {
                if(pageInfo.currentSubSection == undefined){
                    pageInfo.currentSubSection = 0;
                }
            }
            switch(e.keyCode) {
                case 76:
                    if(pageInfo.section[pageInfo.currentSection].subSections > 0) {
                        if(pageInfo.currentSubSection < pageInfo.section[pageInfo.currentSection].subSections){
                            pageInfo.currentSubSection++;
                            window.location.hash = pageInfo.section[pageInfo.currentSection].subSection[pageInfo.currentSubSection].name;
                            pageInfo.changeSubSection(pageInfo.currentSubSection);
                        }
                    }
                break;
                case 75:
                    if(pageInfo.currentSection < pageInfo.sections){
                        pageInfo.currentSection++;
                        window.location.hash = pageInfo.section[pageInfo.currentSection].name;
                        pageInfo.changePage(pageInfo.currentSection);
                        if(pageInfo.section[pageInfo.currentSection].subSections > 0) {
                            pageInfo.currentSubSection = 0;
                        }
                    }
                break;
                case 74:
                    if(pageInfo.currentSection > 0){
                        pageInfo.currentSection--;
                        window.location.hash = pageInfo.section[pageInfo.currentSection].name;
                        pageInfo.changePage(pageInfo.currentSection);
                        if(pageInfo.section[pageInfo.currentSection].subSections > 0) {
                            pageInfo.currentSubSection = 0;
                        }
                    }
                break;
                case 72:
                    if(pageInfo.section[pageInfo.currentSection].subSections > 0) {
                        if(pageInfo.currentSubSection > 0){
                            pageInfo.currentSubSection--;
                            window.location.hash = pageInfo.section[pageInfo.currentSection].subSection[pageInfo.currentSubSection].name;
                            pageInfo.changeSubSection(pageInfo.currentSubSection);
                        }
                    }
                break;
                default:
                
                break;
            }
        }*/
    });
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
                        if(pageInfo.section[i].subSection.length-1 > 0){
                            pageInfo.changeSubSection(0);
                        }
                    }
                    
                    if(pageInfo.section[i].subSections > 0){
                        var subLength = pageInfo.section[i].subSection.length-1
                        for(ii=0; ii<subLength; ii++){
                            var nextItem2 = ii+1;
                            if(pageInfo.pageOffset > pageInfo.section[i].subSection[ii].position && pageInfo.pageOffset < pageInfo.section[i].subSection[nextItem2].position){
                                if(pageInfo.currentSubSection != ii){
                                    pageInfo.changeSubSection(ii);
                                }
                            } else if(pageInfo.pageOffset >= pageInfo.section[i].subSection[subLength].position) {
                                if(pageInfo.currentSubSection != subLength){
                                    pageInfo.changeSubSection(subLength);
                                }
                            }
                        }
                    }
                } else if(pageInfo.pageOffset >= pageInfo.section[pageInfo.sections].position){
                    if(pageInfo.currentSection != pageInfo.sections) {
                        pageInfo.changePage(pageInfo.sections);
                    }
                }
            }
        }
    }
}

PageInfo.prototype.changePage = function(i) {
    var pageInfo = this;
    if(pageInfo.changePageTimer != false){
        clearTimeout(pageInfo.changePageTimer);
    }
    $('header a.selected').removeClass('selected');
    $('header a[href="#'+pageInfo.section[i].name+'"]').addClass('selected');
    
    // Change hash
    if(pageInfo.section[i].subSections == 0){
        pageInfo.changeHash(pageInfo.section[i].name);
    }
    
    if(i == 0 && !$('a.logo').hasClass('defaultCursor')){
        $('a.logo').addClass('defaultCursor');
    } else if(i > 0 && $('a.logo').hasClass('defaultCursor')){
        $('a.logo').removeClass('defaultCursor');
    }
        
    pageInfo.currentSection = i;
    
    if(pageInfo.section[i].subSections > 0){
        if(!$('.'+pageInfo.section[i].name).find('.subNav').is(':visible')){
            $('.subNav:visible').fadeOut();
            $('.'+pageInfo.section[i].name).find('.subNav').fadeIn();
        }
    } else {
        $('.subNav:visible').fadeOut();
    }
}

PageInfo.prototype.changeSubSection = function(i){
    var pageInfo = this;
    if(pageInfo.section[pageInfo.currentSection] != undefined) {
        if(pageInfo.section[pageInfo.currentSection].subSection[i] != undefined){
            if(pageInfo.changePageTimer != false){
                clearTimeout(pageInfo.changePageTimer);
            }
            
            var sectionParent = pageInfo.section[pageInfo.currentSection].name;
            var sectionName = pageInfo.section[pageInfo.currentSection].subSection[i].name, sectionShortName = sectionName.substr(sectionName.indexOf('_'));
            
            $('.'+sectionParent+' .subNav a.selected').removeClass('selected');
            $('.'+sectionParent+' .subNav a[href="#'+sectionName+'"]').addClass('selected');
            
            if(pageInfo.section[i].subSections == 0){
                pageInfo.changeHash(sectionName);
            }
            
            pageInfo.currentSubSection = i;
        }
    }
}

PageInfo.prototype.changeHash = function(n) {
    var pageInfo = this;
    pageInfo.changePageTimer = setTimeout(function(){
        var url = location.href.substr(0,location.href.indexOf('#'))+'#'+n;
        if(Modernizr.history){
            window.history.pushState(null,null,url);
        }
    }, 1000);
}

function initialCap(field) {
   field = field.substr(0, 1).toUpperCase() + field.substr(1);
   return field;
}

var HomeDemo = function(item) {
    this.active = false;
    
    var array0 = [
        {'type': 'Discover', 'query':'discover.json?publisher=bbc.co.uk&available=true&limit=5'},
        {'type': 'Discover', 'query':'discover.json?genre=drama&availableCountries=uk&mediaType=audio&limit=5'},
        {'type': 'Search', 'query':'search.json?q=green&limit=5'},
        {'type': 'Discover', 'query':'discover.json?publisher=itv.com&limit=5'},
        {'type': 'Discover', 'query':'discover.json?publisher=seesaw.com&limit=5'},
        {'type': 'Discover', 'query':'discover.json?publisher=bbc.co.uk&genre=comedy&limit=5'},
        {'type': 'Discover', 'query':'discover.json?publisher=hulu.com&limit=5'},
        {'type': 'Search', 'query':'search.json?q=Britain&limit=5'},
        {'type': 'Discover', 'query':'discover.json?publisher=bbc.co.uk&genre=factual&limit=5'},
        {'type': 'Discover', 'query':'discover.json?publisher=video.uk.msn.com&limit=5'}
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
    item.append('<a href="'+queryBeg+homeDemo.query[homeDemo.activeQuery].query+'" class="query api api'+homeDemo.query[homeDemo.activeQuery].type+'">'+queryBeg+homeDemo.query[homeDemo.activeQuery].query+'</a>');
    
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
					if(homeDemo.activeQuery < homeDemo.marker){
					   homeDemo.scrolling = true;
					   clearInterval(homeDemo.timer);
					   homeDemo.activeQuery++;
					   if(homeDemo.activeQuery == 10){
    					   homeDemo.activequery = 0;
    					}
					   homeDemo.nextQuery();
					   if(homeDemo.activeQuery == homeDemo.marker) {
					       homeDemo.prevBtn.removeClass('inactive');
					       homeDemo.countdown();
					       homeDemo.scrolling = false;
					   }
					} else {
					   clearInterval(homeDemo.timer);
					   if(homeDemo.activeQuery == 10){
					       homeDemo.activeQuery = 0;
					   }
					   homeDemo.nextQuery();
					   homeDemo.request();
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
    
    homeDemo.nav.find('.timer .js_txt').html('Loading');
    
    var item = (homeDemo.activeQuery*2)+1;
    var item2 = (homeDemo.activeQuery*2)+2;
    
    
    item = $('.slideShow .showItem:nth-child('+item+')');
    item2 = $('.slideShow .showItem:nth-child('+item2+')');
    
    if((!item.find('img').attr('src') || item.find('img').height() == 0) || (!item2.find('img').attr('src') || item2.find('img').height() == 0)){
    
        // Make request
        $.ajax({
            url: queryBeg+homeDemo.query[homeDemo.activeQuery].query,
            dataType: 'jsonp',
            jsonpCallback: 'jsonp',
            cache: true,
            timeout: 5000,
            context: homeDemo.item,
            success: function(data, textStatus, jqXHR){            
                homeDemo.nav.find('.timer').fadeOut();
            
                var results = processTheJson(data);
                                
                results.clean(undefined);
                                
                if(results.length > 0){
                
                    if(results[0] != undefined){
                        if(!item.find('img').attr('src') || item.find('img').height() == 0){
                            item.find('img').attr('src',results[0].image).fadeIn(500, function(){
                                    item.removeClass('loading');
                                });
                        }
                        item.attr('href',queryBeg+'content.json?uri='+results[0].uri);
                        item.find('.br').html(results[0].brand);
                        item.find('.pub').html('('+results[0].publisher+')');                       
                        item.find('.ep').html(results[0].episode);
                        item.find('.caption').fadeIn();
                    }
                    
                    if(results[1] != undefined){
                        if(!item2.find('img').attr('src') || item2.find('img').height() == 0){
                            item2.find('img').attr('src',results[1].image).fadeIn(500, function(){
                                item.removeClass('loading');
                            });
                        }
                        item2.attr('href',queryBeg+'content.json?uri='+results[1].uri);
                        item2.find('.br').html(results[1].brand);
                        item2.find('.pub').html('('+results[1].publisher+')');
                        item2.find('.ep').html(results[1].episode);
                        item2.find('.caption').fadeIn();
                    } else {
                        item2.removeClass('loading');
                    }
                }         
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
                
                homeDemo.nextBtn.removeClass('inactive');
            }
        });
    } else {
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
        
        homeDemo.nextBtn.removeClass('inactive');
    }
}

HomeDemo.prototype.nextQuery = function() {
    var homeDemo = this;
        
    var item = homeDemo.nav.find('.queries');
    var imageHolder = $('.slideShow .slideshowItem');
    if(homeDemo.activeQuery != 0) {
        if(item.children().length < 10 && homeDemo.scrolling == false){
            var clone = item.children('a:last-child').clone();
            clone.removeAttr('class').attr('class','query api api'+homeDemo.query[homeDemo.activeQuery].type);
            clone.attr('href',queryBeg+homeDemo.query[homeDemo.activeQuery].query).html(queryBeg+homeDemo.query[homeDemo.activeQuery].query);
            clone.appendTo(item);
            /*var href = '<a href="'+homeDemo.query[homeDemo.activeQuery]+'" class="query api">'+homeDemo.query[homeDemo.activeQuery]+'</a>';
            item.append(href);
            (href);*/
        }
        item.animate({'left': '-='+homeDemo.width},1000);
        imageHolder.animate({'left': '-=960'}, 1000);
    } else {
        item.animate({'left': '0'},1000);
        imageHolder.animate({'left': '0'}, 1000);
    }
    
    if(homeDemo.activeQuery <= homeDemo.marker && homeDemo.prevBtn.hasClass('inactive')){
        homeDemo.prevBtn.removeClass('inactive');
    }
}

HomeDemo.prototype.prevQuery = function() {
    var homeDemo = this;
    
    var item = homeDemo.nav.find('.queries');
    var imageHolder = $('.slideShow .slideshowItem');
    
    homeDemo.nav.find('.timer').fadeOut();
    
    if(homeDemo.activeQuery != 9) {
        item.animate({'left': '+='+homeDemo.width}, 1000);
        imageHolder.animate({'left': '+=960'}, 1000);
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
    this.queryBar = [];
    this.timedOut = false;
}

ApiExplorer.prototype.buttonHandler = function(){
    var apiExplorer = this;
    
    $('.urlCopy').each(function(i){
        apiExplorer.queryBar[i] = {'txt': $(this).find('.urlTxt'), 'btn': $(this).find('.btnCopy'), 'parent': $(this).parents('.tabArea')};
        var parentName = $(this).parents('.tabArea').attr('id')
        parentName = parentName.split('_');
        parentName = parentName[1];
        if(parentName == 'search' || parentName == 'discover'){
            apiExplorer.queryBar[i].txt.val(queryBeg+parentName+'.json?limit=20');
        } else {
            apiExplorer.queryBar[i].txt.val(queryBeg+parentName+'.json?');
        }
    });
    
    $('input[value="Run"]').parents('form').submit(function(){
        var that = $(this);
        if(updateString == undefined){
            doStuff();
        } else {
            setTimeout(function(){
                doStuff();
            }, 750);
        }
        
        var doStuff = function() {
            var queryParent = {'item': that.parents('.tabArea'), 'name': that.parents('.tabArea').attr('id')};
            queryParent.name = queryParent.name.split('_');
            queryParent.name = queryParent.name[1];
            
            if(queryParent.name != 'advanced'){
                var query = queryParent.item.find('.urlTxt').val();
            } else {
                var query = $('#'+queryParent.name+'_string').val();
            }
            
            
            // Run query type
            switch(queryParent.name) {
                case 'advanced':
                    apiExplorer.customQuery(query);
                break;
                case 'search':
                    apiExplorer.searchQuery(query);
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
        }
        return false;
    });
}

ApiExplorer.prototype.customQuery = function(query,run){
    var apiExplorer = this;
    apiExplorer.queryType = 'advanced';
    var queryHolder = apiExplorer.holder.find('#advanced_string');
    queryHolder.val(query);
    apiExplorer.query = queryBeg+query;
    if(run != false){
        apiExplorer.runQuery(4);
    } else {
        queryHolder.focus();
    }
}

ApiExplorer.prototype.searchQuery = function(query){
    var apiExplorer = this;
    apiExplorer.queryType = 'search';
    
    var queryTitle = getParamByName('q',query);
    var queryPublisher = getParamByName('publisher',query);
    
    if(queryTitle.length > 0){
        $('#search_title').val(queryTitle).change();
    }
    if(queryPublisher.length > 0){
        $('#search_publisher').val(queryPublisher).change();
    }
    
    apiExplorer.query = query;
    apiExplorer.runQuery(0);
}

ApiExplorer.prototype.discoverQuery = function(query){
    var apiExplorer = this;
    apiExplorer.queryType = 'discover';
    
    var queryPublisher = getParamByName('publisher',query);
    var queryGenre = getParamByName('genre',query);
    
    if(queryGenre.length > 0){
        $('#discover_genre').val(queryGenre).change();
    }
    if(queryPublisher.length > 0){
        $('#discover_publisher').val(queryPublisher).change();
    }
    
    /* if(apiExplorer.timedOut == true){*/
        apiExplorer.query = query;
        apiExplorer.runQuery(1);
    /* } */
}

ApiExplorer.prototype.scheduleQuery = function(query){
    var apiExplorer = this;
    apiExplorer.queryType = 'schedule';
    var queryChannel = getParamByName('channel',query);
    var queryFrom = getParamByName('from',query);
    var queryTo = getParamByName('to',query);
    
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
    
    var queryPublisher = getParamByName('publisher', query);
    
    if(!queryPublisher){ 
        apiExplorer.query = query+'&publisher=bbc.co.uk,itv.com';
    }
    apiExplorer.runQuery(2);
}

ApiExplorer.prototype.contentQuery = function(query){
    var apiExplorer = this;
    apiExplorer.queryType = 'content';
    
    $('#content_uri').val(getParamByName('uri',query)).change();
    
    apiExplorer.query = query;
    apiExplorer.runQuery(3);
}

var getParamByName = function(name,string){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( string );
    if( results == null )
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

ApiExplorer.prototype.runQuery = function(tab){
    var apiExplorer = this;
    if(apiExplorer.btn.siblings('.msg:visible')){
        apiExplorer.btn.siblings('.msg').fadeOut();
    }
    apiExplorer.btn.val('Please Wait').addClass('inactive');
    
    if(apiExplorer.queryType != 'advanced'){
        apiExplorer.queryBar[tab].txt.val(apiExplorer.query);
    }
    $('#currentQuery').val(apiExplorer.query);
    
    // Make request
    var url = apiExplorer.query;
    
    $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonpCallback: 'jsonp',
        cache: true,
        timeout: 5000,
        context: apiExplorer.holder,
        success: function(data, textStatus, jqXHR){
            /*
                1. Go through data removing any item that does not have an image
                2. Clean returned data to remove any undefined items
                3. For each showItem - add loading class, fadeout image and text, change everything, fade it all back in, remove loading class
                4. Deal with Json
            */
            
            var theData;
            if(data.contents != undefined) {
                theData = data.contents;
            } else {
                theData = data.schedule[0].items;
            }
                
            // 1
            var results = processTheJson(data);
            
            // 2
            results.clean(undefined);
            if(results.length > 5){
                results = results.slice(0,5);
            }
            
            // 3
            apiExplorer.queryBar[tab].parent.find('.resultsArea .preview .showItem').each(function(i){
                var item = $(this);
                var itemImage = $(this).find('img');
                var itemCaption = $(this).find('.caption');
                item.addClass('loading');
                itemImage.fadeOut();
                itemCaption.fadeOut();
                if(results[i] != undefined){
                    itemImage.attr('src',''+results[i].image+'');
                    itemCaption.find('.br').html(results[i].brand);
                    itemCaption.find('.pub').html('('+results[i].publisher+')');
                    itemCaption.find('.ep').html(results[i].episode);
                    item.attr('href', queryBeg+'content.json?uri='+results[i].uri).addClass('apiContent');
                    itemCaption.fadeIn();
                    itemImage.fadeIn();
                    item.fadeIn();
                } else {
                    item.fadeOut();
                }
                item.removeClass('loading');
            });
            
            var theData;
            
            if(data.contents != undefined) {
                if(data.contents.length > 2){
                    data.contents = data.contents.slice(0,2);
                }
                theData = data.contents;
            }
            
            var xmlUrl = url.replace('json','xml');
            var htmlUrl = url.replace('json', 'html');
            var rdfUrl = url.replace('json', 'rdf.xml');
            
            $('a[data-tab="'+apiExplorer.queryType+'_xml"]').attr('href', xmlUrl);
            $('a[data-tab="'+apiExplorer.queryType+'_html"]').attr('href', htmlUrl);
            $('a[data-tab="'+apiExplorer.queryType+'_rdf"]').attr('href', rdfUrl);
                             
            $('#'+apiExplorer.queryType+'_json').html(apiExplorer.prettyJson(theData));
            
            if(apiExplorer.queryBar[tab].parent.find('.resultsArea:hidden')){
                apiExplorer.queryBar[tab].parent.find('.resultsArea').slideDown();
            }
            
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
            sendMsg('error','Sorry, the following error occured: '+errorThrown);
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

ApiExplorer.prototype.prettyJson = function(json) {
    var apiExplorer = this;
    
    var newJson = JSON.stringify(json, null, '&nbsp;');
    
    newJson = newJson.replace(/\</g, '&lt;');
    newJson = newJson.replace(/\>/g, '&gt;');
    
    newJson = prettyPrintOne(newJson);

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

var sendMsg = function(type, message){
    if(message != false){
        clearTimeout(message);
    }
    var apiExplorer = this;
    var msgPane = $('#msgs');
    msgPane.addClass(type).html(message).slideDown();
    message = setTimeout(function(){
        msgPane.slideUp();
    }, 5000);
}

var imageReplace = function(image,newUrl) {
    image.attr('src',newUrl).bind('load', function(){
        if($(this).height() > 0){
            $(this).fadeIn('slow');
        } else {
            return false;
        }
    });
}

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
    
    if(selectBox.current.name != 'none'){
        selectBox.item.find('.value').html(selectBox.current.name);
        selectBox.current.item.addClass('selected');
    } else {
        selectBox.item.find('.value').html('Please Select');
    }
    
    selectBox.input.val(selectBox.current.val);
    
    var item = {'item': selectBox.input, 'title': selectBox.input.attr('data-title'), 'val': selectBox.input.val()};
        
    // Add to url string
    updateString(item);
}

var processTheJson = function(json){
    var item = [];
        
    // if 'contents' exists
    if(json.contents != undefined){
        if(json.contents.length > 0){
            // for each contents item
            $.each(json.contents, function(i){
                if(json.contents[i].image != undefined && json.contents[i].image != ''){
                    item[i] = {'brand': '', 'uri': '', 'publisher': '', 'episode': '', 'series':'', 'image': ''};
                    
                    if(json.contents[i].title != undefined){
                        item[i].brand = json.contents[i].title;
                    }
                    if(json.contents[i].uri != undefined){
                        item[i].uri = json.contents[i].uri;
                    }
                    if(json.contents[i].publisher.name != undefined) {
                        item[i].publisher = json.contents[i].publisher.name;
                    }
                    if(json.contents[i].image != undefined){
                        item[i].image = json.contents[i].image;
                    }
                    if(json.contents[i].content != undefined && json.contents[i].content.length != 0){
                        if(json.contents[i].content[0].title != undefined) {
                            if(json.contents[i].content[0].title != json.contents[i].title){
                                item[i].episode = json.contents[i].content[0].title;
                            }
                        }
                        if(json.contents[i].content[0].series_number != undefined){
                            item[i].series = json.contents[i].content[0].series_number;
                        }
                        if(json.contents[i].content[0].image != undefined){
                            item[i].image = json.contents[i].content[0].image;
                        }
                    }
                } else {
                    item[i] = undefined;
                }
            });
        }
        
    // Else if 'schedule' exists
    } else if(json.schedule[0].items != undefined) {
        $.each(json.schedule[0].items, function(i){
            if(i <= 20 && json.schedule[0].items[i].image != undefined && json.schedule[0].items[i].image != ''){
                item[i] = {'brand': '', 'uri': '', 'publisher': '', 'episode': '', 'series':'', 'image': ''};
                
                if(json.schedule[0].items[i].title != undefined){
                    item[i].brand = json.schedule[0].items[i].title;
                }
                if(json.schedule[0].items[i].uri != undefined){
                    item[i].uri = json.schedule[0].items[i].uri;
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
            } else {
                item[i] == undefined;
            }
        });
    }
    
    return item;
}

var updatingString;
var updateString = function(obj) {
    /*
        1. Get parent info
        2. Get current query
        3. Replace appropriate param
    */
    
    // 1
    var itemParent = {'item': obj.item.parents('.tabArea'), 'name': obj.item.parents('.tabArea').attr('id')};
    itemParent.name = itemParent.name.split('_');
    itemParent.name = itemParent.name[1];
    
    if(itemParent.name == 'search' && obj.title == 'title'){
        obj.title = 'q';
    }
    
    if(obj.title == 'limit'){
        var v = parseInt(obj.val);
        if(v > 50){
            obj.val = '50';
            obj.item.val('50');
        }
        if(v == 0){
            obj.val = '1'
            obj.item.val('1');
        }
    }
    
    if(obj.title == 'from' || obj.title == 'to'){
        var theDate = obj.val.match(/(.*?)\//g);
        var theYear = obj.val.match(/\d{4}/g);
        obj.val = toTimestamp(parseInt(theYear[0]), parseInt(theDate[1]), parseInt(theDate[0]), 0, 0, 0);
    }
    
    // 2
    var updatingString = itemParent.item.find('.urlCopy .urlTxt');
    var currentQuery = updatingString.val();
    if(currentQuery != null){
        currentQuery = currentQuery.replace('&amp;','&');
    } else {
        currentQuery = '';
    }
    var newQuery;
    
    // 3
    /*
        1. Does the param exist?
        2. Remove it from the query.
        3. Add it to the end
    */
    // 1
    if(currentQuery.search(obj.title+'=') != -1){
        // Remove current info
        // GETTING THIS WRONG AFTER REMOVE/ADDING TEXT WHEN MORE THEN ONE OTHER PARAMETER IS PRESENT        
        currentQuery = currentQuery.replace('&amp;','&');
        
        var currentParam = getParamByName(obj.title,currentQuery);
       
        var currentStart = currentQuery.substr(0,currentQuery.search(obj.title));
        var fullLength = (obj.title.length+1)+currentParam.length;
        var currentEnd = currentQuery.substr(currentQuery.search(obj.title)+fullLength);
       
        if(currentEnd.substr(0,1) == '&'){
            if(obj.val.length > 0){
                currentEnd = currentEnd.substr(1)+'&';
            }
        }
        
        currentStart = currentStart.replace('&amp;','&');
        currentEnd = currentEnd.replace('&amp;','&');
        
        if(obj.val.length > 0){
            newQuery = currentStart + obj.title+'='+obj.val+'&'+currentEnd;
        } else {
            if(currentEnd.substr(0,1) == '&'){
                currentEnd = currentEnd.substr(1);
            }
            newQuery = currentStart+currentEnd;
        }
    } else {
        // If a ? is present
        if(currentQuery.search(/\?/g) != -1){
            // If it's not the first param add a &
            if(currentQuery.substr(currentQuery.search(/\?/g)+1).length != 0) {
                newQuery = currentQuery+'&'+obj.title+'='+obj.val;
            } else {
                newQuery = currentQuery+obj.title+'='+obj.val;
            }
        } else {
            // Add the entire thing including the type.
            newQuery = queryBeg;
            if(itemParent.name != 'advanced'){
                newQuery += itemParent.name;
            } else {
                newQuery += 'discover';
            }
            newQuery += '.json?'+obj.title+'='+obj.val;
        }
    }
    if(newQuery.substr(-1) == '&'){
        newQuery = newQuery.substr(0, newQuery.length-1);
    }
    
    newQuery = newQuery.replace('&amp;','&');
    
    updatingString.val(newQuery);
    
    /* ---------------- */
    /* --------------- */
}

function jsonp() {
}

function toTimestamp(year,month,day,hour,minute,second){
    var datum = new Date(Date.UTC(year,month-1,day,hour,minute,second));
    return datum.getTime()/1000;
}

$(document).ready(function(){
    var pageInfo = new PageInfo();
    pageInfo.init();
    
    $('section:not(.subSection):last-child').css('min-height', pageInfo.pageHeight-148);
        
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
    
    $('.subTab a').click(function(){
        return false;
    });
    
    $('a.apiSearch').click(function(){
        if(apiFuncRun == false && $(this).attr('href')!= '') {
            tabs.changeTab(0);
            apiExplorer.searchQuery($(this).attr('href'));
            if($.browser.msie && $.browser.version.substr(0,1)<=7) {
                $('a[href="#apiExplorer"]').click();
            } else {
                window.location.hash = 'apiExplorer';
            }
            apiFuncRun = true;
        }
        return false;
    });
    
    $('a.apiDiscover').click(function(){
        if(apiFuncRun == false && $(this).attr('href')!= '') {
            tabs.changeTab(1);
            apiExplorer.discoverQuery($(this).attr('href'));
            if($.browser.msie && $.browser.version.substr(0,1)<=7) {
                $('a[href="#apiExplorer"]').click();
            } else {
                window.location.hash = 'apiExplorer';
            }
            apiFuncRun = true;
        }
        return false;
    });
    
    $('a.apiSchedule').click(function(){
        if(apiFuncRun == false && $(this).attr('href')!= '') {
            tabs.changeTab(2);
            apiExplorer.scheduleQuery($(this).attr('href'));
            if($.browser.msie && $.browser.version.substr(0,1)<=7) {
                $('a[href="#apiExplorer"]').click();
            } else {
                window.location.hash = 'apiExplorer';
            }
            apiFuncRun = true;
        }
        return false;
    });
    
    $('a.apiContent').click(function(){
        if(apiFuncRun == false && $(this).attr('href')!= '') {
            tabs.changeTab(3);
            apiExplorer.contentQuery($(this).attr('href'));
            if($.browser.msie && $.browser.version.substr(0,1)<=7) {
                $('a[href="#apiExplorer"]').click();
            } else {
                window.location.hash = 'apiExplorer';
            }
            apiFuncRun = true;
        }
        return false;
    });
    
    $('a.api').click(function(){
        if(apiFuncRun == false && $(this).attr('href')!= '') {
            tabs.changeTab(4);
            apiExplorer.customQuery($(this).attr('href'));
            if($.browser.msie && $.browser.version.substr(0,1)<=7) {
                $('a[href="#apiExplorer"]').click();
            } else {
                window.location.hash = 'apiExplorer';
            }
            apiFuncRun = true;
        }
        return false;
    });
    
    $('.urlCopy .urlTxt').click(function(){
        $(this).select();
        return false;
    });
    
    $('.urlCopy .urlTxt').keyup(function(e){
        var query = $(this).val();
        if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40) {
            query = query.substr(query.indexOf('0/')+2);
            query = query.replace(/\&amp\;/g,'&');
            query = query.replace(queryBeg, '');
            tabs.changeTab(4);
            apiExplorer.customQuery(query,false);
        }
        return false;
    });
    
    $('.watchMe').keyup(function(e){
        if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40){
            clearTimeout(updatingString);
            var item = {'item': $(this), 'title': $(this).attr('data-title'), 'val': $(this).val()};
            
            if($(this).hasClass('date')){
                
            }
        
            // Add to url string
            updatingString = setTimeout(function(){
                updateString(item);
            },500);
        }
    });
    
    $('.watchMe').change(function(e){
        clearTimeout(updatingString);
        var item = {'item': $(this), 'title': $(this).attr('data-title'), 'val': $(this).val()};
    
        // Add to url string
        updatingString = setTimeout(function(){
            updateString(item);
        },500);
    });
    
    $('input.date').datepicker({
        showOn: "both",
        buttonImage: "images/date.gif",
        buttonImageOnly: true,
        dateFormat: 'dd/mm/yy'
    });
    
    $('.mainMenu a').click(function(){
        pageInfo.menuClick = true;
        var index = $(this).parent().index();
        if(index >= 0){
            $(document).scrollTop(pageInfo.section[index].position);
            pageInfo.changePage(index);
        }
    });
    
    $('.subNav a').click(function(){
        var index = $(this).parent().index();
        if(index >= 0){
            $(document).scrollTop(pageInfo.section[pageInfo.currentSection].subSection[index].position);
            pageInfo.changeSubSection(index);
        }
    });
    
    $('a.btnCopy').click(function(){
        return false;
    });
    
    $('a[href="#apiExplorer"]').click(function(){
        $(document).scrollTop(pageInfo.section[pageInfo.sections].position);
        pageInfo.changeSubSection(pageInfo.sections);
    });
    
    $(window).scroll(function(e){
        pageInfo.currentEvent = e;
        pageInfo.update(false,false,true);
    });
    
    var hoverTimer;
    $('.hov').bind('mouseover',function() {
        var that = $(this);
        var thatHeight = $(this).height();
        hoverTimer = setTimeout(function(){
            if(that.find('.hover').length == 0) {
                if(!that.hasClass('hovDown')){
                    $('.hover[data-title="'+that.attr('data-title')+'"]').clone().css({'bottom': thatHeight+5}).appendTo(that).fadeIn('fast');
                } else {
                    $('.hover[data-title="'+that.attr('data-title')+'"]').clone().css({'top': thatHeight+5}).appendTo(that).fadeIn('fast');
                }
            } else {
                that.find('.hover').fadeIn('fast');
            }
        }, 500);
    $('.hov').bind('mouseout',function(){
            clearTimeout(hoverTimer);
            that.find('.hover').fadeOut('fast');
        });
    });
});

/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());