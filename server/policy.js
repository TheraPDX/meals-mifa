BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

var trusted = [
  '*.googleapis.com',
  '*.bootstrapcdn.com',
  '*.gstatic.com',
  '*.google.com',
  '*.bootstrapcdn.com'
];

_.each(trusted, function(origin) {
  origin = "https://" + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});

var nontrusted = [
  '*.google.com'
];
_.each(nontrusted, function(origin) {
  origin = "http://" + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});