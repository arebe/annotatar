(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var TwitMaker;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/mrt:twit/main.js                                         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
                                                                     // 1
TwitMaker = Npm.require('twit');                                     // 2
                                                                     // 3
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mrt:twit'] = {
  TwitMaker: TwitMaker
};

})();

//# sourceMappingURL=mrt_twit.js.map
