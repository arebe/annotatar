if (Meteor.isClient) {
  // This code only runs on the client

//Meteor.subscribe("tweets");
  Meteor.subscribe("hashtags");

Template.body.helpers({
  tweets: function(){
    return Tweets.find({}, {sort: {createdAt: -1}});
  }
});

Template.mainAR.helpers({
  startAR: function(){
    console.log("startAR!");
    }, // end startAR
  }); // end mainAR helpers


Meteor.startup(function(){
  GoogleMaps.load();  

  var navLat, navLon, hashtag;

  try {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        navLat = position.coords.latitude;
        navLon = position.coords.longitude;
        navLat = Math.round(100*navLat)/100;
        navLon = Math.round(100*navLon)/100;
        console.log("lat: ", navLat, " long: ", navLon, " accuracy: ", position.coords.accuracy);
        $("#dynamsg").append('<p>latitude: '+navLat+' longitude: '+navLon+' accuracy: <span id="acc">'+position.coords.accuracy+'</span></p>');
        Meteor.call("findHashtag", navLat, navLon, function(err, result){
          if(result){
            hashtag = result;
            console.log("subscribing to: ", hashtag);
            Meteor.subscribe("tweets", hashtag);
            Session.set("hashtag", hashtag);
          }
          else{
            console.log("no hashtag found! subscribing to #occupy");
            Meteor.subscribe("tweets", "occupy");
            Session.set("hashtag", "occupy");
          }
        });
      });
    }
    else{
      navLat = 0;
      navLon = 0;
      console.log("no geolocation detected");
    }
  } catch(err){
    console.log("geolocation error: ", err);        
  }

  var renderNoTweets = function(message){
    for(var i = 0; i < 30; i++){
      context.fillStyle("#f11");
      context.fillText(message, 10, (10*i));
    }
  }

  });  // end onstartup

 

} // end if meteor.isClient






