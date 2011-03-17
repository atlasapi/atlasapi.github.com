var homePageTimer;

var queryBeg = 'http://otter.atlasapi.org/3.0/';

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
        pageInfo.section[i] = {'name': $(this).attr('class'), 'position': $(this).find('.marker').offset().top, 'subSection': [], 'subSections': ''};
        $(this).find('.subSection').each(function(ii) {
            pageInfo.section[i].subSection[ii] = {'name': $(this).attr('data-title'), 'position': $(this).find('.marker').offset().top};
        });
        pageInfo.section[i].subSections = pageInfo.section[i].subSection.length;
    });
    pageInfo.sections = pageInfo.section.length-1;
    
    $('section.subSection').each(function(i) {
        pageInfo.subSection[i] = {'name': $(this).attr('data-title'), 'position': $(this).find('.marker').offset().top, 'parent': $(this).parent().attr('class')};
    });
    pageInfo.subSections = pageInfo.subSection.length;
    
    $('body').keyup(function(e){
        if($(':focus').length == 0) {
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
        }
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
    if(Modernizr.history && pageInfo.section[i].subSections == 0){
        pageInfo.changeHash(pageInfo.section[i].name);
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
    if(pageInfo.changePageTimer != false){
        clearTimeout(pageInfo.changePageTimer);
    }
    
    var sectionParent = pageInfo.section[pageInfo.currentSection].name;
    var sectionName = pageInfo.section[pageInfo.currentSection].subSection[i].name, sectionShortName = sectionName.substr(sectionName.indexOf('_'));
    
    $('.'+sectionParent+' .subNav a.selected').removeClass('selected');
    $('.'+sectionParent+' .subNav a[href="#'+sectionName+'"]').addClass('selected');
    
    if(Modernizr.history && pageInfo.section[i].subSections == 0){
        pageInfo.changeHash(sectionName);
    }
    
    pageInfo.currentSubSection = i;
}

PageInfo.prototype.changeHash = function(n) {
    var pageInfo = this;
    pageInfo.changePageTimer = setTimeout(function(){
        var url = location.href.substr(0,location.href.indexOf('#'))+'#'+n;
        window.history.pushState(null,null,url);
    }, 1000);
}

function initialCap(field) {
   field = field.substr(0, 1).toUpperCase() + field.substr(1);
   return field;
}

var HomeDemo = function(item) {
    this.active = false;
    
    var array0 = [
        {'type': 'Discover', 'query':'discover.json?publisher=bbc.co.uk&available=true'},
        {'type': 'Discover', 'query':'discover.json?genre=comedy&availableCountries=uk&mediaType=video'},
        {'type': 'Search', 'query':'search.json?title=east'},
        {'type': 'Discover', 'query':'discover.json?publisher=bbc.co.uk&genre=drama'},
        {'type': 'Discover', 'query':'discover.json?publisher=seesaw.com'},
        {'type': 'Discover', 'query':'discover.json?publisher=bbc.co.uk&genre=comedy'},
        {'type': 'Discover', 'query':'discover.json?publisher=hulu.com'},
        {'type': 'Search', 'query':'search.json?title=Britain'},
        {'type': 'Discover', 'query':'discover.json?publisher=bbc.co.uk&genre=factual'},
        {'type': 'Discover', 'query':'discover.json?publisher=video.uk.msn.com'}
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
    item.append('<a href="'+queryBeg+homeDemo.query[homeDemo.activeQuery].query+'&limit=20" class="query api api'+homeDemo.query[homeDemo.activeQuery].type+'">'+queryBeg+homeDemo.query[homeDemo.activeQuery].query+'</a>');
    
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
            url: queryBeg+homeDemo.query[homeDemo.activeQuery].query+'&limit=5&available=true',
            dataType: 'jsonp',
            jsonpCallback: 'jsonp',
            cache: true,
            timeout: 5000,
            context: homeDemo.item,
            success: function(data, textStatus, jqXHR){            
                homeDemo.nav.find('.timer').fadeOut();
            
                var results = processTheJson(data);
                
                results.clean(undefined);
                
                if(results.length > 0 && results[0] != undefined){
                    // Multiply current query by 2
                    
                    
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
                    
                    if(!item2.find('img').attr('src') || item2.find('img').height() == 0){
                        item2.find('img').load(function(){
                            $(this).fadeIn(500, function(){
                                item2.removeClass('loading');
                            });
                        }).attr('src',results[1].image);
                    }
                    item2.attr('href',queryBeg+'content.json?uri='+results[1].uri);
                    item2.find('.br').html(results[1].brand);
                    item2.find('.pub').html('('+results[1].publisher+')');
                    item2.find('.ep').html(results[1].episode);
                    item2.find('.caption').fadeIn();
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
            clone.attr('href',queryBeg+homeDemo.query[homeDemo.activeQuery].query+'&limit=20').html(queryBeg+homeDemo.query[homeDemo.activeQuery].query);
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
    $('a.btnCopy').hover(function(){
        if($(this).attr('data-bound') != 'true'){
            var clip = new ZeroClipboard.Client();
            clip.glue($(this).attr('id'));
            clip.setHandCursor(true);
            clip.setText($(this).siblings('input[type="text"]').val());
            $(this).attr('data-bound','true');
        }
    });
    
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
    
    $('input[value="Run"]').click(function(){
        var queryParent = {'item': $(this).parents('.tabArea'), 'name': $(this).parents('.tabArea').attr('id')};
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
    
    apiExplorer.query = query+'&publisher=bbc.co.uk,itv.com';
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
                        
            var oldPre = apiExplorer.queryBar[tab].parent.find('.resultsArea .output pre');
            var newPre = oldPre.clone();
            
            apiExplorer.queryBar[tab].parent.find('.resultsArea .output').append(newPre)
            
            newPre.hide().html(apiExplorer.prettyJson(theData));
            
            oldPre.fadeOut('fast', function(){
                $(this).remove();
                newPre.fadeIn();
            });
            
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
    
    var newJson = JSON.stringify(json, 'null', '&nbsp;');
    
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
    
    $('section:not(.subSection):last-child').css('min-height', pageInfo.pageHeight-161);
        
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
    
    $('a.apiSearch').click(function(){
        if(apiFuncRun == false) {
            tabs.changeTab(0);
            apiExplorer.searchQuery($(this).attr('href'));
            window.location.hash = 'apiExplorer';
            apiFuncRun = true;
            return false;
        }
    });
    
    $('a.apiDiscover').click(function(){
        if(apiFuncRun == false) {
            tabs.changeTab(1);
            apiExplorer.discoverQuery($(this).attr('href'));
            window.location.hash = 'apiExplorer';
            apiFuncRun = true;
            return false;
        }
    });
    
    $('a.apiSchedule').click(function(){
        if(apiFuncRun == false) {
            tabs.changeTab(2);
            apiExplorer.scheduleQuery($(this).attr('href'));
            window.location.hash = 'apiExplorer';
            apiFuncRun = true;
            return false;
        }
    });
    
    $('a.apiContent').click(function(){
        if(apiFuncRun == false) {
            tabs.changeTab(3);
            apiExplorer.contentQuery($(this).attr('href'));
            window.location.hash = 'apiExplorer';
            apiFuncRun = true;
            return false;
        }
    });
    
    $('a.api').click(function(){
        if(apiFuncRun == false) {
            tabs.changeTab(4);
            apiExplorer.customQuery($(this).attr('href'));
            window.location.hash = 'apiExplorer';
            apiFuncRun = true;
            return false;
        }
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
