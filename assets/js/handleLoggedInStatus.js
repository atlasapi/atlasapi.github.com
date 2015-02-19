var handleLoggedInStatus = (function () {
  'use strict';

  /**
   * Checks to see if user is logged in or not
   * @return {boolean} `true` if logged in, `false` if not
   */
  function userLoggedIn() {
    return localStorage.getItem('auth.token') ? true : false;
  }

  /**
   * Gets users auth credentials from localStorage
   * @return {object} OAuth provider and token
   */
  function getCredentials() {
    return {
      oauth_provider: localStorage.getItem('auth.provider'),
      oauth_token: localStorage.getItem('auth.token')
    };
  }

  /**
   * Creates a query string from an object
   * @param  {object} data The key/value pairs to be encoded
   * @return {string}      An encoded query string
   */
  // TODO: This needs to be common
  function encodeQueryData(data) {
    var queryData = [];

    for (var parameter in data) {
      queryData.push(encodeURIComponent(parameter) + '=' + encodeURIComponent(data[parameter]));
    }

    return queryData.join('&');
  }

  /**
   * Get data from users endpoint and pass to template to be compiled
   * @param  {string} url users endpoint URL
   */
  function getUserDataAndLoadTemplate(url) {
    $.ajax({
      url: url,
      success: function (data) {
        loadTemplate({
          templatePath: 'assets/templates/logged-in.ejs',
          templateContainer: '#navbar-tools'
        }, data);
        if (data.user.role === 'admin') {
          loadTemplate({
            templatePath: 'assets/templates/admin-menu.ejs',
            templateContainer: '#admin-menu'
          });
        }
        loadUserPhoto();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
        logout();
      }
    });
  }

  /**
   * Sorts array of applications by most recently created
   * @param  {object} data The data returned from the applications endpoint
   * @return {object}      The applications data sorted my most recently created
   */
  function sortApplicationsByDateDescending(data) {
    data.applications.sort(function (a, b) {
      a = new Date(a.created);
      b = new Date(b.created);
      return a > b ? -1 : a < b ? 1 : 0;
    });

    return data;
  }

  /**
   * Get data from applications endpoint and pass to template to be compiled
   * @param  {string} url applications endpoint URL
   */
  function getApplicationsDataAndLoadTemplate(url) {
    $.ajax({
      url: url,
      success: function (data) {
        data = sortApplicationsByDateDescending(data);

        loadTemplate({
          templatePath: 'assets/templates/apps-menu.ejs',
          templateContainer: '#apps-menu'
        }, data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  /**
   * Get data from groups endpoint and pass to template to be compiled
   * @param  {string} url groups endpoint URL
   */
  function getGroupsDataAndLoadTemplate(url) {
    $.ajax({
      url: url,
      success: function (data) {
        if (data.length) {
          loadTemplate({
            templatePath: 'assets/templates/content-menu.ejs',
            templateContainer: '#content-menu'
          }, data);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(errorThrown);
      }
    });
  }

  /**
   * Compiles template and optionally passes in data
   * @param  {object} templateInfo The `templatePath` and `templateContainer`
   * @param  {object} data         Data to be passed into the template
   */
  function loadTemplate(templateInfo, data) {
    var data = data || {},
        template;

    template = new EJS({
      url: templateInfo.templatePath
    }).render(data);

    $(templateInfo.templateContainer).html(template);
  }

  /**
   * Compiles template for user menus
   */
  function loadNavigationTemplate() {
    var template;

    template = new EJS({
      url: 'assets/templates/user-navigation.ejs'
    }).render();

    $('#nav-main').append(template);
  }

  /**
   * Logs out user
   */
  function logout() {
    localStorage.removeItem('auth.provider');
    localStorage.removeItem('auth.token');
    loadTemplate({
      templatePath: 'assets/templates/logged-out.ejs',
      templateContainer: '#navbar-tools'
    });

    $('.user-menu').each(function () {
      $(this).empty();
    });
  }

  /**
   * Toggles visibility of dropdown menus
   * @param  {selector} $this The element being clicked
   */
  function toggleDropDownMenu($this) {
    var $targetMenu = $this.siblings('.dropdown-menu');

    $('.dropdown-menu').not($targetMenu).hide();
    $targetMenu.toggle();

    $('.has-dropdown-menu').not($this).removeClass('active-link');
    $this.toggleClass('active-link');
  }

  /**
   * Handles click events with a callback
   * @param  {selector}   element  The element being clicked
   * @param  {function} callback The function to be called when click event occurs
   */
  function handleClick(element, callback) {
    $(document).on('click', element, function (e) {
      e.preventDefault();
      callback($(this));
    });
  }

  /**
   * Loads users photo once page has loaded
   */
  function loadUserPhoto() {
    var $userPhoto = $('.profile-picture'),
        imageUrl = $userPhoto.data('src');

    $userPhoto.attr('src', imageUrl);
  }

  /**
   * Handles any event based functions
   */
  function events() {
    handleClick('.logout', logout);
    handleClick('.has-dropdown-menu > a', toggleDropDownMenu);
  }

  /**
   * Initialises the class
   */
  function init() {
    if (userLoggedIn()) {
      var credentials = getCredentials(),
          credentialsQueryString = encodeQueryData(credentials);

      loadNavigationTemplate();
      getUserDataAndLoadTemplate('http://atlas.metabroadcast.com/4/auth/user.json?' + credentialsQueryString);
      getApplicationsDataAndLoadTemplate('http://atlas.metabroadcast.com/4/applications.json?' + credentialsQueryString);
      getGroupsDataAndLoadTemplate('http://atlas-admin-backend.metabroadcast.com/api/user/groups?' + credentialsQueryString);

      events();
    } else {
      loadTemplate({
        templatePath: 'assets/templates/logged-out.ejs',
        templateContainer: '#navbar-tools'
      });
    }
  }

  return init;
})();
