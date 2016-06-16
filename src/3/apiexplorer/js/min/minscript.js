var homePageTimer;var queryBeg="https://atlasapi.org/3.0/";var clearTimer=function(){clearInterval(homePageTimer)};var apiFuncRun=false;var message=false;var Tabs=function(){this.tabHolder;this.count=0;this.active;this.tab=[];this.page=[]};Tabs.prototype.init=function(b){var a=this;a.tabHolder=b;var c=[];b.find(".tab").each(function(d){if($(this).hasClass("tabExt")){a.tab[d]={id:$(this).attr("data-tab"),li:$(this),a:$(this)}}else{a.tab[d]={id:$(this).find("a").attr("data-tab"),li:$(this),a:$(this).find("a")}}a.tab[d].a.click(function(){a.changeTab(d)});a.count++});b.find(".tabArea").each(function(d){a.page[d]={index:d,item:$(this)};a.page[d].item.hide()})};Tabs.prototype.changeTab=function(c){var a=this;a.tabHolder.find(".tab.selected").removeClass("selected");a.tabHolder.find(".tabArea:visible").hide();a.tab[c].li.addClass("selected");a.page[c].item.show();a.active=c;var b=new ZeroClipboard.Client();b.glue(a.page[a.active].item.find(".urlCopy .btnCopy").attr("id"),a.page[a.active].item.find(".urlCopy").attr("id"));b.addEventListener("mouseDown",function(){var d=a.page[a.active].item.find(".urlCopy .urlTxt").val();if(!d){d=queryBeg+a.page[a.active].item.find(".urlCopy input.adv").val()}b.setText(d)})};var SubTabs=function(){this.tabHolder;this.count=0;this.active;this.tab=[];this.page=[]};SubTabs.prototype.init=function(b){var a=this;a.tabHolder=b;var c=[];b.find(".subTab").each(function(d){if($(this).hasClass("subTabExt")){a.tab[d]={id:$(this).attr("data-tab"),li:$(this),a:$(this)}}else{a.tab[d]={id:$(this).find("a").attr("data-tab"),li:$(this),a:$(this).find("a")}}a.tab[d].a.click(function(){a.changeTab(d);window.location.hash="apiExplorer";return false});a.count++});b.find(".subTabArea").each(function(d){a.page[d]={index:d,item:$(this)};a.page[d].item.hide()})};SubTabs.prototype.changeTab=function(b){var a=this;a.tabHolder.find(".subTab.selected").removeClass("selected");a.tabHolder.find(".subTabArea:visible").hide();a.tab[b].li.addClass("selected");a.page[b].item.show();a.active=b};var PageInfo=function(){this.pageWidth;this.pageHeight;this.pageOffset;this.section=[];this.sections;this.subSection=[];this.subSections;this.currentSection;this.currentSubSection;this.menuClick=false;this.currentEvent;this.changePageTimer=false};PageInfo.prototype.init=function(){var a=this;a.update(true,true,true);$("section:not(.subSection)").each(function(b){a.section[b]={item:$(this),name:$(this).attr("class"),position:$(this).find(".marker").offset().top,subSection:[],subSections:""};$(this).find(".subSection").each(function(d){a.section[b].subSection[d]={item:$(this),name:$(this).attr("data-title"),position:$(this).find(".marker").offset().top};var c=$('.mainMenu a[href="#'+a.section[b].name+'"]').offset().left;a.section[b].item.find(".subNav").css({left:c-2})});a.section[b].subSections=a.section[b].subSection.length});a.sections=a.section.length-1;$("section.subSection").each(function(b){a.subSection[b]={name:$(this).attr("data-title"),position:$(this).find(".marker").offset().top,parent:$(this).parent().attr("class")}});a.subSections=a.subSection.length;$("body").keyup(function(b){})};PageInfo.prototype.update=function(e,b,g){var d=this;if(e){d.pageWidth=$(window).width()}if(b){d.pageHeight=$(window).height()}if(g){d.pageOffset=$(window).scrollTop();for(i=0;i<d.sections;i++){if(i<d.sections){var a=i+1;if(d.pageOffset>d.section[i].position&&d.pageOffset<d.section[a].position){if(d.currentSection!=i){d.changePage(i);if(d.section[i].subSection.length-1>0){d.changeSubSection(0)}}if(d.section[i].subSections>0){var c=d.section[i].subSection.length-1;for(ii=0;ii<c;ii++){var f=ii+1;if(d.pageOffset>d.section[i].subSection[ii].position&&d.pageOffset<d.section[i].subSection[f].position){if(d.currentSubSection!=ii){d.changeSubSection(ii)}}else{if(d.pageOffset>=d.section[i].subSection[c].position){if(d.currentSubSection!=c){d.changeSubSection(c)}}}}}}else{if(d.pageOffset>=d.section[d.sections].position){if(d.currentSection!=d.sections){d.changePage(d.sections)}}}}}}};PageInfo.prototype.changePage=function(a){var b=this;if(b.changePageTimer!=false){clearTimeout(b.changePageTimer)}$("header a.selected").removeClass("selected");$('header a[href="#'+b.section[a].name+'"]').addClass("selected");if(b.section[a].subSections==0){b.changeHash(b.section[a].name)}if(a==0&&!$("a.logo").hasClass("defaultCursor")){$("a.logo").addClass("defaultCursor")}else{if(a>0&&$("a.logo").hasClass("defaultCursor")){$("a.logo").removeClass("defaultCursor")}}b.currentSection=a;if(b.section[a].subSections>0){if(!$("."+b.section[a].name).find(".subNav").is(":visible")){$(".subNav:visible").fadeOut();$("."+b.section[a].name).find(".subNav").fadeIn()}}else{$(".subNav:visible").fadeOut()}};PageInfo.prototype.changeSubSection=function(d){var e=this;if(e.section[e.currentSection]!=undefined){if(e.section[e.currentSection].subSection[d]!=undefined){if(e.changePageTimer!=false){clearTimeout(e.changePageTimer)}var a=e.section[e.currentSection].name;var c=e.section[e.currentSection].subSection[d].name,b=c.substr(c.indexOf("_"));$("."+a+" .subNav a.selected").removeClass("selected");$("."+a+' .subNav a[href="#'+c+'"]').addClass("selected");if(e.section[d].subSections==0){e.changeHash(c)}e.currentSubSection=d}}};PageInfo.prototype.changeHash=function(b){var a=this;a.changePageTimer=setTimeout(function(){var c=location.href.substr(0,location.href.indexOf("#"))+"#"+b;if(Modernizr.history){window.history.pushState(null,null,c)}},1000)};function initialCap(a){a=a.substr(0,1).toUpperCase()+a.substr(1);return a}var HomeDemo=function(j){this.active=false;var g=new Date();var c=g.getTime();c=Math.round(c/1000);var d=c+14400;var e=Math.floor(Math.random()*10);if(e==0){e=5}var b=Math.floor(Math.random()*10);if(b==0){e=3}var a=[{type:"Search",query:"search.json?q=cars&limit=5"},{type:"Discover",query:"discover.json?publisher=bbc.co.uk&available=true&limit=5"},{type:"Schedule",query:"schedule.json?from=now&to=now.plus.24h&channel=bbcone&publisher=bbc.co.uk"},{type:"Search",query:"search.json?q=red&publisher=bbc.co.uk&available=true&limit=5"},{type:"Discover",query:"discover.json?publisher=seesaw.com&limit=5&offset="+e+"&available=true"},{type:"Discover",query:"discover.json?genre=drama&availableCountries=uk&mediaType=audio&limit=5"},{type:"Schedule",query:"schedule.json?from=now.minus.24h&to=now&channel=bbchd&publisher=bbc.co.uk"},{type:"Search",query:"search.json?q=world&publisher=itv.com&limit=5"},{type:"Discover",query:"discover.json?genre=lifestyle&publisher=bbc.co.uk&limit=5"},{type:"Schedule",query:"schedule.json?from="+c+"&to="+d+"&channel=bbctwo&publisher=bbc.co.uk"},{type:"Search",query:"search.json?q=Jane Eyre&limit=5"},{type:"Discover",query:"discover.json?genre=learning&availableCountries=uk&mediaType=video&limit=5"},{type:"Schedule",query:"schedule.json?from="+c+"&to="+d+"&channel=radio1&publisher=bbc.co.uk"},{type:"Search",query:"search.json?q=green&limit=5"},{type:"Schedule",query:"schedule.json?from="+c+"&to="+d+"&channel=cbbc&publisher=bbc.co.uk"},{type:"Discover",query:"discover.json?publisher=bbc.co.uk&genre=comedy&transportType=link&limit=5"},{type:"Search",query:"search.json?q=Brave&publisher=hulu.com&limit=5&available=true"},{type:"Discover",query:"discover.json?publisher=bbc.co.uk&genre=music&mediaType=video&limit=5"},{type:"Search",query:"search.json?q=Britain&limit=5"},{type:"Discover",query:"discover.json?publisher=video.uk.msn.com&limit=5&available=true&offset="+b},{type:"Discover",query:"discover.json?publisher=bbc.co.uk&genre=comedy&limit=5"},];var f=Math.floor(Math.random()*a.length);var k=a.slice(0,f);var h=a.slice(f);this.query=h.concat(k);this.activeQuery=0;this.marker=0;this.time=20000;this.timer;this.nav=j;this.item=[];this.width=$(".queryHolder").width();this.prevBtn=j.find(".cbtn.previous");this.nextBtn=j.find(".cbtn.next");this.scrolling=false};HomeDemo.prototype.init=function(){var c=this;var b=c.nav.find(".queries");c.query.clean(undefined);for(i=0;i<c.query.length-1;i++){b.append('<a href="'+queryBeg+c.query[i].query+'" class="query api api'+c.query[i].type+'">'+queryBeg+c.query[i].query+"</a>")}for(i=0;i<(c.query.length-1)*2;i++){var a=$(".slideshowItem .showItem:first-child").clone();$(".slideshowItem").append(a)}c.nav.find(".cbtn").click(function(){if(!$(this).hasClass("inactive")){if($(this).hasClass("previous")){if(c.activeQuery>1&&b.children().length>1){c.scrolling=true;clearInterval(c.timer);c.activeQuery--;c.prevQuery();c.nextBtn.removeClass("inactive")}}else{if($(this).hasClass("next")){if(!$(this).hasClass("wait")){if(c.activeQuery<c.marker){c.scrolling=true;clearInterval(c.timer);c.activeQuery++;if(c.activeQuery==c.query.length-1){c.activequery=0}c.nextQuery();if(c.activeQuery==c.marker){c.prevBtn.removeClass("inactive");c.countdown();c.scrolling=false}}else{clearInterval(c.timer);if(c.activeQuery==c.query.length-1){c.activeQuery=0}c.nextQuery();c.request()}}}}}return false});c.request()};HomeDemo.prototype.request=function(){var c=this;c.marker=c.activeQuery;clearTimeout(c.timer);c.prevBtn.addClass("inactive");c.nextBtn.addClass("inactive");c.nav.find(".timer .js_txt").html("Loading");var b=(c.activeQuery*2)+1;var a=(c.activeQuery*2)+2;b=$(".slideShow .showItem:nth-child("+b+")");a=$(".slideShow .showItem:nth-child("+a+")");if((!b.find("img").attr("src")||b.find("img").height()==0)||(!a.find("img").attr("src")||a.find("img").height()==0)){$.ajax({url:queryBeg+c.query[c.activeQuery].query,dataType:"jsonp",jsonpCallback:"jsonp",cache:true,timeout:5000,context:c.item,success:function(f,g,e){c.nav.find(".timer").fadeOut();var d=processTheJson(f);d.clean(undefined);if(d.length>0){if(d[0]!=undefined){if(!b.find("img").attr("src")||b.find("img").height()==0){b.find("img").attr("src",d[0].image).fadeIn(500,function(){b.removeClass("loading")})}b.attr("href",queryBeg+"content.json?uri="+d[0].uri);b.find(".br").html(d[0].brand);b.find(".pub").html("("+d[0].publisher+")");b.find(".ep").html(d[0].episode);b.find(".caption").fadeIn()}if(d[1]!=undefined){if(!a.find("img").attr("src")||a.find("img").height()==0){a.find("img").attr("src",d[1].image).fadeIn(500,function(){b.removeClass("loading")})}a.attr("href",queryBeg+"content.json?uri="+d[1].uri);a.find(".br").html(d[1].brand);a.find(".pub").html("("+d[1].publisher+")");a.find(".ep").html(d[1].episode);a.find(".caption").fadeIn()}else{a.removeClass("loading")}}},error:function(d,f,e){},complete:function(d,e){if(c.activeQuery<c.query.length-1){c.activeQuery++;c.marker++}else{c.activeQuery=0;c.marker=0}c.countdown();if(c.marker>1){c.prevBtn.removeClass("inactive")}c.nextBtn.removeClass("inactive")}})}else{if(c.activeQuery<c.query.length-1){c.activeQuery++;c.marker++}else{c.activeQuery=0;c.marker=0}c.countdown();if(c.marker>1){c.prevBtn.removeClass("inactive")}c.nextBtn.removeClass("inactive")}};HomeDemo.prototype.nextQuery=function(){var e=this;var d=e.nav.find(".queries");var c=$(".slideShow .slideshowItem");if(e.activeQuery!=0){if(d.children().length<e.query.length-1&&e.scrolling==false){var g=d.children("a:last-child").clone();g.removeAttr("class").attr("class","query api api"+e.query[e.activeQuery].type);g.attr("href",queryBeg+e.query[e.activeQuery].query).html(queryBeg+e.query[e.activeQuery].query);g.appendTo(d)}d.animate({left:"-=763"},1000);c.animate({left:"-=960"},1000)}else{var f=$(".slideShow .showItem:first-child").clone();var a=$(".slideShow .showItem:nth-child(1)").clone();c.append(f).append(a);var b=d.find(".query:first-child").clone();d.append(b);d.animate({left:"-=763"},1000,function(){d.css({left:0})});c.animate({left:"-=960"},1000,function(){c.css({left:0})})}if(e.activeQuery<=e.marker&&e.prevBtn.hasClass("inactive")){e.prevBtn.removeClass("inactive")}};HomeDemo.prototype.prevQuery=function(){var c=this;var b=c.nav.find(".queries");var a=$(".slideShow .slideshowItem");c.nav.find(".timer").fadeOut();if(c.activeQuery!=c.query.length-2){b.animate({left:"+="+c.width},1000);a.animate({left:"+=960"},1000)}if(c.activeQuery==1){c.prevBtn.addClass("inactive")}};HomeDemo.prototype.countdown=function(){var c=this;clearInterval(c.timer);var b=20;var a=c.nav.find(".timer");if(c.buttonClicked){if(c.activeQuery==c.marker){a.fadeIn();c.timer=setInterval(function(){a.find(".js_txt").html(b+"s");b--;if(b==-1){a.find(".js_txt").html("Loading");clearTimer(c.timer);c.request()}},1000)}else{a.fadeOut()}}else{c.timer=setInterval(function(){if(!a.is(":visible")){a.fadeIn()}a.find(".js_txt").html(b+"s");b--;if(b==-1){a.find(".js_txt").html("Loading");clearTimer(c.timer);c.nextQuery();c.request()}},1000)}};var ApiExplorer=function(b,a){this.holder=b;this.queryType;this.query;this.btn=$('.btn[value="Run"]');this.queryBar=[];this.timedOut=false;this.tabs=a};ApiExplorer.prototype.buttonHandler=function(){var a=this;$(".urlCopy").each(function(b){a.queryBar[b]={txt:$(this).find(".urlTxt"),btn:$(this).find(".btnCopy"),parent:$(this).parents(".tabArea")};var c=$(this).parents(".tabArea").attr("id");c=c.split("_");c=c[1];if(c=="search"||c=="discover"){a.queryBar[b].txt.val(queryBeg+c+".json?limit=20")}else{a.queryBar[b].txt.val(queryBeg+c+".json?")}});$('input[value="Run"]').parents("form").submit(function(){a.btn.val("Please Wait").addClass("inactive").after('<img src="images/loader.gif" class="fr" />');var c=$(this);if(updateString==undefined){b()}else{setTimeout(function(){b()},750)}var b=function(){var d={item:c.parents(".tabArea"),name:c.parents(".tabArea").attr("id")};d.name=d.name.split("_");d.name=d.name[1];if(d.name!="advanced"){var e=d.item.find(".urlTxt").val()}else{var e=$("#"+d.name+"_string").val()}switch(d.name){case"advanced":a.customQuery(e);break;case"search":a.searchQuery(e);break;case"discover":a.discoverQuery(e);break;case"schedule":a.scheduleQuery(e);break;case"content":a.contentQuery(e);break}};return false})};ApiExplorer.prototype.customQuery=function(b,d){var c=this;c.queryType="advanced";var a=c.holder.find("#advanced_string");a.val(b);c.query=queryBeg+b;if(d!=false){c.runQuery(4)}else{a.focus()}};ApiExplorer.prototype.searchQuery=function(c){var d=this;d.queryType="search";if(d.textAltered(c,["q","publisher","limit"])){return false}var a=getParamByName("q",c);if(!a){sendMsg("error","Error: Please define a title");d.cancelQuery();return false}var b=getParamByName("publisher",c);if(a.length>0){$("#search_title").val(a).change()}if(b.length>0){$("#search_publisher").val(b).change()}d.query=c;d.runQuery(0)};ApiExplorer.prototype.discoverQuery=function(b){var d=this;d.queryType="discover";if(d.textAltered(b,["publisher","genre","limit"])){return false}var a=getParamByName("publisher",b);var c=getParamByName("genre",b);if(c.length>0){$("#discover_genre").val(c).change()}if(a.length>0){$("#discover_publisher").val(a).change()}d.query=b;d.runQuery(1)};ApiExplorer.prototype.scheduleQuery=function(d){var f=this;f.queryType="schedule";if(f.textAltered(d,["channel","from","to"])){return false}var a=getParamByName("channel",d);if(!a){sendMsg("error","Error: Please specify a channel from the drop down");f.cancelQuery();return false}var b=getParamByName("from",d);var e=getParamByName("to",d);if(isNaN(parseFloat(b))&&b.length>0){b=timeConvertor(b)*1000}if(!b){sendMsg("error","Error: Please specify a 'from' date");f.cancelQuery();return false}if(isNaN(parseFloat(e))&&e.length>0){e=timeConvertor(e)*1000}if(!b){sendMsg("error","Error: Please specify a 'to' date");f.cancelQuery();return false}if(b>=e){sendMsg("error","Error: Please ensure the 'to' date is later then the 'from' date");f.cancelQuery();return false}var c=getParamByName("publisher",d);if(!c){d=d+"&publisher=bbc.co.uk,itv.com"}f.query=d;f.runQuery(2)};ApiExplorer.prototype.contentQuery=function(b){var c=this;c.queryType="content";if(c.textAltered(b,["uri"])){return false}var a=getParamByName("uri",b);if(!a){sendMsg("error","Error: Please specify a URI");c.cancelQuery();return false}$("#content_uri").val(a).change();c.query=b;c.runQuery(3)};ApiExplorer.prototype.textAltered=function(d,f){var e=this;var a=e.queryType;if($("#explore_"+a+" #"+a+"_altered").val()=="true"){d=d.substr(d.indexOf("0/")+2);d=d.replace(/\&amp\;/g,"&");d=d.replace(queryBeg,"");var f=d.match(/\?(.*)/g);var b=false;f=f[0].substr(1).split("&");for(var c=0;c<f.length;c++){f[c]=f[c].split("=");if(a=="search"&&f[c][0]=="q"){f[c][0]="title"}if($("#"+a+"_"+f[c][0]).length<1){b=true}}if(b){e.tabs.changeTab(4);e.customQuery(d);$("#explore_"+a+" #"+a+"_altered").val("false");return true}}return false};var getParamByName=function(c,b){c=c.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var a="[\\?&]"+c+"=([^&#]*)";var e=new RegExp(a);var d=e.exec(b);if(d==null){return""}else{return decodeURIComponent(d[1].replace(/\+/g," "))}};ApiExplorer.prototype.runQuery=function(b){var c=this;if(!c.btn.hasClass("inactive")){c.btn.val("Please Wait").addClass("inactive").after('<img src="images/loader.gif" class="fr" />')}if(c.btn.siblings(".msg:visible")){c.btn.siblings(".msg").fadeOut()}if(c.queryType!="advanced"){c.queryBar[b].txt.val(c.query)}$("#currentQuery").val(c.query);var a=c.query;$.ajax({url:a,dataType:"jsonp",jsonpCallback:"jsonp",cache:true,timeout:5000,context:c.holder,statusCode:{0:function(e,d,f){sendMsg("error","Sorry, either that end point can't be reached or a required parameter is missing")}},success:function(v,e,l){var o;if(v.contents!=undefined){o=v.contents}else{if(v.schedule[0]!=undefined){o=v.schedule[0].items}else{if(v.error){c.ajaxError("Sorry, "+v.error.message)}}}var k=processTheJson(v);k.clean(undefined);var w=c.queryBar[b].parent.find(".resultsArea .preview");for(var q=0;q<w.children().length;q++){if(q>=5){w.find(".showItem:nth-child("+q+")").remove()}}var r=w.children().length;if(c.queryBar[b].parent.find(".resultsArea .previewPrev").length>0){c.queryBar[b].parent.find(".resultsArea .previewPrev").remove();c.queryBar[b].parent.find(".resultsArea .previewNext").remove();c.queryBar[b].parent.find(".resultsArea .pageNumber").remove();w.css({left:0})}if(k.length>r){var h=k.length-r;var g=(w.find(".showItem:first-child").width()+30)*(r+h)+(10*((r+h)/5));w.css("width",g+"px");var m=w.find(".showItem:first-child");for(var q=0;q<h;q++){var d=m.clone(true);w.append(d);r++}for(var q=0;q<k.length;q++){var s=w.find(".showItem:nth-child("+(q+1)+")");s.css("margin-right",10);if((q+1)%5==0){s.css("margin-right",20)}}if(r>5){var u=910;var p=Math.ceil(r/5);var n=1;w.before('<a href="#" class="cbtn next previewNext"><span class="icn"></span></a><p class="pageNumber">Page: <span class="pageNo">1</span> of '+p+'</p><a href="#" class="cbtn previous previewPrev"><span class="icn"></span></a>');c.queryBar[b].parent.find(".resultsArea .previewNext").click(function(){if(!$(this).hasClass("inactive")){$(this).addClass("inactive");var x=$(this);if(w.position().left-u>=-u*(p-1)){n++;c.queryBar[b].parent.find(".resultsArea .pageNo").html(n);w.animate({left:"-="+u},1000,function(){x.removeClass("inactive")});if(c.queryBar[b].parent.find(".resultsArea .previewPrev").hasClass("inactive")){c.queryBar[b].parent.find(".resultsArea .previewPrev").removeClass("inactive")}}}return false});c.queryBar[b].parent.find(".resultsArea .previewPrev").click(function(){if(!$(this).hasClass("inactive")){$(this).addClass("inactive");var x=$(this);if(w.position().left<0){n--;c.queryBar[b].parent.find(".resultsArea .pageNo").html(n);w.animate({left:"+="+u},1000,function(){x.removeClass("inactive")})}if(c.queryBar[b].parent.find(".resultsArea .previewNext").hasClass("inactive")){c.queryBar[b].parent.find(".resultsArea .previewNext").removeClass("inactive")}}return false})}}c.queryBar[b].parent.find(".resultsArea .preview .showItem").each(function(y){var z=$(this);var A=$(this).find("img");var x=$(this).find(".caption");z.addClass("loading");A.fadeOut();x.fadeOut();if(k[y]!=undefined){A.attr("src",""+k[y].image+"");x.find(".br").html(k[y].brand);x.find(".pub").html("("+k[y].publisher+")");x.find(".ep").html(k[y].episode);z.attr("href",queryBeg+"content.json?uri="+k[y].uri).addClass("apiContent");x.fadeIn();A.fadeIn();z.fadeIn()}else{z.fadeOut()}z.removeClass("loading")});var o;if(v.contents!=undefined){o=v.contents}var j=a.replace("json","xml");var t=a.replace("json","html");var f=a.replace("json","rdf.xml");$('a[data-tab="'+c.queryType+'_xml"]').attr("href",j);$('a[data-tab="'+c.queryType+'_html"]').attr("href",t);$('a[data-tab="'+c.queryType+'_rdf"]').attr("href",f);$("#"+c.queryType+"_json").html(c.prettyJson(o));if(c.queryBar[b].parent.find(".resultsArea:hidden")){c.queryBar[b].parent.find(".resultsArea").slideDown()}$(".object .btn").click(function(x){x.stopImmediatePropagation();if($(this).parent().hasClass("closed")){$(this).parent().removeClass("closed")}else{$(this).parent().addClass("closed")}return false});$(".array .btn").click(function(x){x.stopImmediatePropagation();if($(this).parent().hasClass("closed")){$(this).parent().removeClass("closed")}else{$(this).parent().addClass("closed")}return false})},error:function(d,f,e){c.ajaxError("Sorry, the following error occured: "+e)},complete:function(d,e){c.btn.val("Run").removeClass("inactive").siblings("img").fadeOut("fast",function(){$(this).remove()});apiFuncRun=false}})};ApiExplorer.prototype.ajaxError=function(a){sendMsg("error",a)};ApiExplorer.prototype.cancelQuery=function(){var a=this;a.btn.val("Run").removeClass("inactive").siblings("img").fadeOut("fast",function(){$(this).remove()});apiFuncRun=false};ApiExplorer.prototype.prettyJson=function(b){var c=this;var a=JSON.stringify(b,null,"&nbsp;");a=a.replace(/\</g,"&lt;");a=a.replace(/\>/g,"&gt;");a=prettyPrintOne(a);return a};Array.prototype.clean=function(b){for(var a=0;a<this.length;a++){if(this[a]==b){this.splice(a,1);a--}}return this};var sendMsg=function(a,c){if(c!=false){clearTimeout(c)}var d=this;var b=$("#msgs");b.addClass(a).html(c).slideDown();c=setTimeout(function(){b.slideUp()},5000)};var imageReplace=function(b,a){b.attr("src",a).bind("load",function(){if($(this).height()>0){$(this).fadeIn("slow")}else{return false}})};var timeConvertor=function(d){if(d=="now"){var c=new Date().getTime()/1000;return Math.round(c)}else{d=d.split(".");if(d.length==3){var a=d[2].match(/\D/i);switch(a[0]){case"s":case"S":a=1;break;case"m":case"M":a=60;break;case"h":case"H":a=3600;break;case"d":case"D":a=86400;break;case"w":case"W":a=604800;break;case"m":case"M":a=2629743;break;case"y":case"Y":a=31556926;break;default:a=0;break}var b=d[2].match(/\d*/i);if(d[0]=="now"){var c=new Date().getTime()/1000}if(a>0){if(d[1]=="plus"){c+=a*b;return Math.round(c)}else{if(d[1]=="minus"){c-=a*b;return Math.round(c)}}}}}};var SelectBox=function(a){this.item=a;this.option=[];this.current;this.input=a.siblings('input[type="hidden"]')};SelectBox.prototype.init=function(){var a=this;a.item.find(".option").each(function(b){a.option[b]={item:$(this),name:$(this).html(),val:$(this).attr("data-value")}});a.input.change(function(){var b=$(this).val();$.each(a.option,function(c){if(a.option[c].val==b){a.current=a.option[c]}});a.changeSelection()})};SelectBox.prototype.changeSelection=function(){var b=this;b.item.find(".option.selected").removeClass("selected");if(b.current.name!="none"){b.item.find(".value").html(b.current.name);b.current.item.addClass("selected")}else{b.item.find(".value").html("Please Select")}b.input.val(b.current.val);var a={item:b.input,title:b.input.attr("data-title"),val:b.input.val()};updateString(a)};var processTheJson=function(b){var c=[];if(b.contents!=undefined){if(b.contents.length>0){for(var a=0;a<b.contents.length;a++){c[a]={brand:"",uri:"",publisher:"",episode:"",series:"",image:""};if(b.contents[a].brand_summary!=undefined&&b.contents[a].brand_summary.title!=undefined){c[a].brand=b.contents[a].brand_summary.title;if(b.contents[a].title!=c[a].brand){c[a].episode=b.contents[a].title}}else{if(b.contents[a].title!=undefined){c[a].brand=b.contents[a].title}}if(b.contents[a].uri!=undefined){c[a].uri=encodeURIComponent(b.contents[a].uri)}if(b.contents[a].publisher.name!=undefined){c[a].publisher=b.contents[a].publisher.name}if(b.contents[a].image!=undefined){c[a].image=b.contents[a].image}else{c[a].image="images/missingImage.png"}if(b.contents[a].content!=undefined&&b.contents[a].content.length!=0){if(b.contents[a].content[0].title!=undefined){if(b.contents[a].content[0].title!=b.contents[a].title){c[a].episode=b.contents[a].content[0].title}}if(b.contents[a].content[0].series_number!=undefined){c[a].series=b.contents[a].content[0].series_number}if(b.contents[a].content[0].image!=undefined){c[a].image=b.contents[a].content[0].image}}}}}else{if(b.schedule[0].items!=undefined){for(var a=0;a<b.schedule[0].items.length;a++){if(a<=20&&b.schedule[0].items[a].image!=undefined&&b.schedule[0].items[a].image!=""){c[a]={brand:"",uri:"",publisher:"",episode:"",series:"",image:""};if(b.schedule[0].items[a].title!=undefined){c[a].brand=b.schedule[0].items[a].title}if(b.schedule[0].items[a].uri!=undefined){c[a].uri=b.schedule[0].items[a].uri}if(b.schedule[0].items[a].publisher.name!=undefined){c[a].publisher=b.schedule[0].items[a].publisher.name}if(b.schedule[0].items[a].image!=undefined){c[a].image=b.schedule[0].items[a].image}if(b.schedule[0].items[a].brand_summary!=undefined&&b.schedule[0].items[a].brand_summary.title!=b.schedule[0].items[a].title){c[a].brand=b.schedule[0].items[a].brand_summary.title}if(b.schedule[0].items[a].title!=undefined){if(b.schedule[0].items[a].title!=c[a].brand){c[a].episode=b.schedule[0].items[a].title}}if(b.schedule[0].items[a].series_number!=undefined){c[a].series=b.schedule[0].items[a].series_number}if(b.schedule[0].items[a].image!=undefined){c[a].image=b.schedule[0].items[a].image}}else{c[a]==undefined}}}}return c};var updatingString;var updateString=function(h){var f={item:h.item.parents(".tabArea"),name:h.item.parents(".tabArea").attr("id")};f.name=f.name.split("_");f.name=f.name[1];if(f.name=="search"&&h.title=="title"){h.title="q"}if(h.title=="limit"){var l=parseInt(h.val);if(l>50){h.val="50";h.item.val("50")}if(l==0){h.val="1";h.item.val("1")}}if(h.title=="from"||h.title=="to"){var j=h.val.match(/(.*?)\//g);var b=h.val.match(/\d{4}/g);if(j&&b){h.val=toTimestamp(parseInt(b[0]),parseInt(j[1]),parseInt(j[0]),0,0,0)}else{return false}}if(h.title=="uri"){h.val=encodeURIComponent(h.val)}var c=f.item.find(".urlCopy .urlTxt");var k=c.val();if(k!=null){k=k.replace("&amp;","&")}else{k=""}var m;if(k.search(h.title+"=")!=-1){k=k.replace("&amp;","&");var g=getParamByName(h.title,k);var d=k.substr(0,k.search(h.title));var a=(h.title.length+1)+g.length;var e=k.substr(k.search(h.title)+a);if(h.title=="uri"){e=""}if(e.substr(0,1)=="&"){if(h.val.length>0){e=e.substr(1)+"&"}}d=d.replace("&amp;","&");e=e.replace("&amp;","&");if(h.val>0){h.val=new String(h.val)}if(h.val.length>0){m=d+h.title+"="+h.val;if(e.length>0&&e.substr(0,1)=="&"){m+=e}else{if(e.length>0&&e.substr(0,1)!="&"){m+="&"+e}}}else{if(e.substr(0,1)=="&"){e=e.substr(1)}m=d+e}}else{if(k.search(/\?/g)!=-1){if(k.substr(k.search(/\?/g)+1).length!=0){m=k+"&"+h.title+"="+h.val}else{m=k+h.title+"="+h.val}}else{m=queryBeg;if(f.name!="advanced"){m+=f.name}else{m+="discover"}m+=".json?"+h.title+"="+h.val}}if(m.substr(-1)=="&"){m=m.substr(0,m.length-1)}m=m.replace("&amp;","&");c.val(m)};function jsonp(){}function toTimestamp(e,f,c,a,g,d){var b=new Date(Date.UTC(e,f-1,c,a,g,d));return b.getTime()/1000}function getCaretPosition(d){var c=0,f=null,e,b;if(window.getSelection){e=window.getSelection();if(e.rangeCount){b=e.getRangeAt(0);if(b.commonAncestorContainer.parentNode==d){c=b.endOffset}}}else{if(document.selection&&document.selection.createRange){b=document.selection.createRange();if(b.parentElement()==d){var g=document.createElement("span");d.insertBefore(g,d.firstChild);var a=b.duplicate();a.moveToElementText(g);a.setEndPoint("EndToEnd",b);c=a.text.length}}}return c}$(document).ready(function(){var c=new PageInfo();c.init();$("section:not(.subSection):last-child").css("min-height",c.pageHeight-148);var b=new Tabs();b.init($("#explorerWrapper"));b.changeTab(0);var f=new ApiExplorer($("#explorerWrapper"),b);f.buttonHandler();var e=[];$(".select").each(function(g){e[g]=new SelectBox($(this));e[g].init();$(this).find(".option").click(function(){e[g].current={item:$(this),name:$(this).html(),val:$(this).attr("data-value")};e[g].changeSelection();e[g].item.find(".options").hide()});$(this).hover(function(){$(this).find(".options").show()},function(){$(this).find(".options").hide()})});var d=new HomeDemo($(".controlBar"));d.init();$(".subTab a").click(function(){return false});$("a.apiSearch").click(function(){if(apiFuncRun==false&&$(this).attr("href")!=""){b.changeTab(0);f.searchQuery($(this).attr("href"));if($.browser.msie&&$.browser.version.substr(0,1)<=7){$('a[href="#apiExplorer"]').click()}else{window.location.hash="apiExplorer"}apiFuncRun=true}return false});$("a.apiDiscover").click(function(){if(apiFuncRun==false&&$(this).attr("href")!=""){b.changeTab(1);f.discoverQuery($(this).attr("href"));if($.browser.msie&&$.browser.version.substr(0,1)<=7){$('a[href="#apiExplorer"]').click()}else{window.location.hash="apiExplorer"}apiFuncRun=true}return false});$("a.apiSchedule").click(function(){if(apiFuncRun==false&&$(this).attr("href")!=""){b.changeTab(2);f.scheduleQuery($(this).attr("href"));if($.browser.msie&&$.browser.version.substr(0,1)<=7){$('a[href="#apiExplorer"]').click()}else{window.location.hash="apiExplorer"}apiFuncRun=true}return false});$("a.apiContent").click(function(){if(apiFuncRun==false&&$(this).attr("href")!=""){b.changeTab(3);f.contentQuery($(this).attr("href"));if($.browser.msie&&$.browser.version.substr(0,1)<=7){$('a[href="#apiExplorer"]').click()}else{window.location.hash="apiExplorer"}apiFuncRun=true}return false});$("a.api").click(function(){if(apiFuncRun==false&&$(this).attr("href")!=""){b.changeTab(4);f.customQuery($(this).attr("href"));if($.browser.msie&&$.browser.version.substr(0,1)<=7){$('a[href="#apiExplorer"]').click()}else{window.location.hash="apiExplorer"}apiFuncRun=true}return false});$(".urlCopy .urlTxt").click(function(){$(this).select();return false});$(".urlCopy .urlTxt").keyup(function(h){var g=$(this).val();if(h.keyCode!=37&&h.keyCode!=38&&h.keyCode!=39&&h.keyCode!=40){$(this).siblings('input[type="hidden"]').val("true")}return false});$(".watchMe").keyup(function(h){if(h.keyCode!=37&&h.keyCode!=38&&h.keyCode!=39&&h.keyCode!=40){clearTimeout(updatingString);var g={item:$(this),title:$(this).attr("data-title"),val:$(this).val()};updatingString=setTimeout(function(){updateString(g)},500)}});$(".watchMe").change(function(h){if(!$(this).hasClass("date")){clearTimeout(updatingString);var g={item:$(this),title:$(this).attr("data-title"),val:$(this).val()};updatingString=setTimeout(function(){updateString(g)},500)}});$("input.date").each(function(j){var h=new Date();if(j>0){h.setDate(h.getDate()+1)}var g=h.getDate(),l=h.getMonth()+1,k=h.getFullYear();if(g<10){g="0"+g}if(l<10){l="0"+l}$(this).datepicker({showOn:"both",buttonImage:"images/date.gif",buttonImageOnly:true,dateFormat:"dd/mm/yy",onClose:function(n,m){updateString({item:$(this),title:$(this).attr("data-title"),val:n})}});$(this).datepicker("setDate",g+"/"+l+"/"+k);updateString({item:$(this),title:$(this).attr("data-title"),val:$(this).val()});$("#ui-datepicker-div").hide()});$(".mainMenu a").click(function(){c.menuClick=true;var g=$(this).parent().index();if(g>=0){$(document).scrollTop(c.section[g].position);c.changePage(g)}});$(".subNav a").click(function(){var g=$(this).parent().index();if(g>=0){$(document).scrollTop(c.section[c.currentSection].subSection[g].position);c.changeSubSection(g)}});$("a.btnCopy").click(function(){return false});$('a[href="#apiExplorer"]').click(function(){$(document).scrollTop(c.section[c.sections].position);c.changeSubSection(c.sections)});$(window).scroll(function(g){c.currentEvent=g;c.update(false,false,true)});var a;$(".hov").bind("mouseover",function(){var h=$(this);var g=$(this).height();a=setTimeout(function(){if(h.find(".hover").length==0){if(!h.hasClass("hovDown")){$('.hover[data-title="'+h.attr("data-title")+'"]').clone().css({bottom:g+5}).appendTo(h).fadeIn("fast")}else{$('.hover[data-title="'+h.attr("data-title")+'"]').clone().css({top:g+5}).appendTo(h).fadeIn("fast")}}else{h.find(".hover").fadeIn("fast")}},500);$(".hov").bind("mouseout",function(){clearTimeout(a);h.find(".hover").fadeOut("fast")})})});var JSON;if(!JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());