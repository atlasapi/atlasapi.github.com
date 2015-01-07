var PageInfo = function () {
  this.section = [];
  this.subSection = [];
  this.menuClick = false;
  this.changePageTimer = false;
};

PageInfo.prototype.init = function () {
  var pageInfo = this;
  pageInfo.update(true,true,true);
  $('section[class]:not(.subSection)').each(function (i) {
    pageInfo.section[i] = {
      'item': $(this),
      'name': $(this).attr('class'),
      'position': $(this).find('.marker').offset().top - 67,
      'subSection': [],
      'subSections': ''
    };
    $(this).find('.subSection').each(function (ii) {
      pageInfo.section[i].subSection[ii] = {
        'item': $(this),
        'name': $(this).attr('data-title'),
        'position': $(this).find('.marker').offset().top - 67
      };
      var leftPos = $('.mainMenu a[href="#'+pageInfo.section[i].name+'"]').offset().left;
      pageInfo.section[i].item.find('.subNav').css({
        'left': leftPos-2
      });
    });
    pageInfo.section[i].subSections = pageInfo.section[i].subSection.length;
  });
  pageInfo.sections = pageInfo.section.length-1;
  $('section.subSection').each(function (i) {
    pageInfo.subSection[i] = {
      'name': $(this).attr('data-title'),
      'position': $(this).find('.marker').offset().top,
      'parent': $(this).parent().attr('class')
    };
  });
  pageInfo.subSections = pageInfo.subSection.length;
};

PageInfo.prototype.update = function (width,height,offset) {
  var pageInfo = this;
  if (width) {
    pageInfo.pageWidth = $(window).width();
  }
  if (height) {
    pageInfo.pageHeight = $(window).height();
  }
  if (offset) {
    pageInfo.pageOffset = $(window).scrollTop();
    for(i=0; i<pageInfo.sections; i++) {
      if (i < pageInfo.sections) {
        var nextItem = i+1;
        if (pageInfo.pageOffset > pageInfo.section[i].position && pageInfo.pageOffset < pageInfo.section[nextItem].position) {
          if (pageInfo.currentSection !== i) {
            pageInfo.changePage(i);
            if (pageInfo.section[i].subSection.length-1 > 0) {
              pageInfo.changeSubSection(0);
            }
          }
          if (pageInfo.section[i].subSections > 0) {
            var subLength = pageInfo.section[i].subSection.length-1;
            for(ii=0; ii<subLength; ii++) {
              var nextItem2 = ii+1;
              if (pageInfo.pageOffset > pageInfo.section[i].subSection[ii].position && pageInfo.pageOffset < pageInfo.section[i].subSection[nextItem2].position) {
                if (pageInfo.currentSubSection !== ii) {
                  pageInfo.changeSubSection(ii);
                }
              } else if (pageInfo.pageOffset >= pageInfo.section[i].subSection[subLength].position) {
                if (pageInfo.currentSubSection !== subLength) {
                  pageInfo.changeSubSection(subLength);
                }
              }
            }
          }
        } else if (pageInfo.pageOffset >= pageInfo.section[pageInfo.sections].position) {
          if (pageInfo.currentSection !== pageInfo.sections) {
            pageInfo.changePage(pageInfo.sections);
          }
        }
      }
    }
  }
};

PageInfo.prototype.changePage = function (i) {
  var pageInfo = this;
  if (pageInfo.changePageTimer !== false) {
    clearTimeout(pageInfo.changePageTimer);
  }
  $('header a.selected').removeClass('selected');
  $('header a[href="#'+pageInfo.section[i].name+'"]').addClass('selected');
  if (pageInfo.section[i].subSections === 0) {
    pageInfo.changeHash(pageInfo.section[i].name);
  }
  if (i === 0 && !$('a.logo').hasClass('defaultCursor')) {
    $('a.logo').addClass('defaultCursor');
  } else if (i > 0 && $('a.logo').hasClass('defaultCursor')) {
    $('a.logo').removeClass('defaultCursor');
  }
  pageInfo.currentSection = i;
  if (pageInfo.section[i].subSections > 0) {
    if (!$('.'+pageInfo.section[i].name).find('.subNav').is(':visible')) {
      $('.subNav:visible').fadeOut();
      $('.'+pageInfo.section[i].name).find('.subNav').fadeIn();
    }
  } else {
    $('.subNav:visible').fadeOut();
  }
};

PageInfo.prototype.changeSubSection = function (i) {
  var pageInfo = this;
  if (pageInfo.section[pageInfo.currentSection] !== undefined) {
    if (pageInfo.section[pageInfo.currentSection].subSection[i] !== undefined) {
      if (pageInfo.changePageTimer !== false) {
        clearTimeout(pageInfo.changePageTimer);
      }
      var sectionParent = pageInfo.section[pageInfo.currentSection].name;
      var sectionName = pageInfo.section[pageInfo.currentSection].subSection[i].name, sectionShortName = sectionName.substr(sectionName.indexOf('_'));
      $('.'+sectionParent+' .subNav a.selected').removeClass('selected');
      $('.'+sectionParent+' .subNav a[href="#'+sectionName+'"]').addClass('selected');
      if (pageInfo.section[i].subSections === 0) {
        pageInfo.changeHash(sectionName);
      }
      pageInfo.currentSubSection = i;
    }
  }
};

PageInfo.prototype.changeHash = function (n) {
  var pageInfo = this;
  pageInfo.changePageTimer = setTimeout(function () {
    var url = location.href.substr(0,location.href.indexOf('#'))+'#'+n;
    if (window.history.pushState) {
      window.history.pushState(null,null,url);
    }
  }, 1000);
};
