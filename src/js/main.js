import './lib/init.js';
import {loadTemplates} from './lib/templates.js';
import ContentCollection from './Collections/ContentCollection.js';
import ContentCollectionView from './Views/ContentCollectionView.js';
import {tooltip, dropdowns, toggleSelectedNavItem} from './lib/helpers.js';

var envInfo = {};

if (window.location.hostname !== 'atlas.metabroadcast.com' || window.location.hostname !== 'stage.metabroadcast.com') {
  envInfo.isDev = true;
  loadTemplates();
}

$(window).load(function () {
  $(function () {
    var contentCollection = new ContentCollection();
    var contentCollectionView = new ContentCollectionView({ collection: contentCollection });
    var headerTemplate = Handlebars.compile($('#header-template').html());
    var subHeaderTemplate = Handlebars.compile($('#sub-header-template').html());
    $('#site-header').html(headerTemplate(envInfo));
    $('#sub-header').html(subHeaderTemplate());
  });

  var onePageNavOptions = {
    currentClass: 'selected',
    changeHash: true,
    scrollSpeed: 200
  };

  // This is so external links work on the docs page
  if ($('.homepage').length) {
    $('.sub-nav').onePageNav(onePageNavOptions);
  } else {
    $('.dropdown').onePageNav(onePageNavOptions);
  }

  tooltip();
  dropdowns();
  handleLoggedInStatus();

  // Makes sure correct nav item is highlighted
  if (window.location.hash) {
    var target = window.location.hash;
    $('.sub-nav').find('a[href=' + target + ']').trigger('click');
  }
});

$(window).on('scroll', _.debounce(toggleSelectedNavItem, 250));
