import './lib/init.js';
import {loadTemplates} from './lib/templates.js';
import ContentCollection from './Collections/ContentCollection.js';
import ContentCollectionView from './Views/ContentCollectionView.js';
import SectionView from './Views/SectionView.js';
import {tooltip, dropdowns, toggleSelectedNavItem} from './lib/helpers.js';

loadTemplates();

var envInfo = {};

if (window.location.hostname !== 'voila.metabroadcast.com') {
  envInfo.isDev = true;
}

$(function () {
  var contentCollection = new ContentCollection();
  var contentCollectionView = new ContentCollectionView({ collection: contentCollection });
  var headerTemplate = Handlebars.compile($('#header-template').html());
  var subHeaderTemplate = Handlebars.compile($('#sub-header-template').html());
  $('#site-header').html(headerTemplate(envInfo));
  $('#sub-header').html(subHeaderTemplate);
});

$(window).load(function () {
  $('.sub-nav').onePageNav({
    currentClass: 'selected',
    changeHash: true,
    scrollSpeed: 200
  });

  tooltip();
  dropdowns();

  // Makes sure correct nav item is highlighted
  if (window.location.hash) {
    var target = window.location.hash;
    $('.sub-nav').find('a[href=' + target + ']').trigger('click');
  }

  // Initiate now next widget
  var nowNextLater = new NowNextLater();
  nowNextLater.init();
});

$(window).on('scroll', _.debounce(toggleSelectedNavItem, 250));
