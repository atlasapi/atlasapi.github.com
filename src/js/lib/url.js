var createURL = function (protocol, hostname, pathname, queryParams) {
  var url = `${protocol}://${hostname}${(pathname || '')}`;
  var query = [];

  if (queryParams) {
    for (let param in queryParams) {
      query.push(`${param}=${encodeURIComponent(queryParams[param])}`);
    }

    url += `?${query.join('&')}`;
  }

  return url;
};

export {createURL}