# voila.metabroadcast.com

## What does this do?
This is the website for Voila. It gives an overview of what Voila is.

## What's being used in this project?
This project is self-contained, although the demo widgets do make calls to Voila.

## How do I get set up?
First clone this repository:
```
git@bitbucket.org:mbst/voila.metabroadcast.com
```

Then from inside the project install all dependencies:
```
npm install && bower install
```

To use the project run:
```
gulp dev
```

This will start a local HTTP server on port 8080 so you should be able to access the site at <http://dev.mbst.tv:8080>. (You may need to add `dev.mbst.tv` to your hosts file).
