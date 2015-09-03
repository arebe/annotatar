(function(){
Template.body.addContent((function() {
  var view = this;
  return HTML.Raw('<div id="ar">\n    <video id="video" width="800" height="500" autoplay=""></video>\n    <canvas width="800" height="500"></canvas>\n  </div>\n  <div id="toggles">\n  	<button id="streamButton" type="button">Stream toggle</button>\n  </div>');
}));
Meteor.startup(Template.body.renderToDocument);

})();
