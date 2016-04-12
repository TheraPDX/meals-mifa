BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

var trusted = [
  '*.googleapis.com',
<<<<<<< refs/remotes/origin/master
  '*.bootstrapcdn.com',
  '*.gstatic.com',
  '*.google.com'
=======
  '*.bootstrapcdn.com'
>>>>>>> Inital Load
];

_.each(trusted, function(origin) {
  origin = "https://" + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
<<<<<<< refs/remotes/origin/master
});

var nontrusted = [

  '*.google.com'
];

_.each(nontrusted, function(origin) {
  origin = "http://" + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
=======
>>>>>>> Inital Load
});