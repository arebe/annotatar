Tweets = new Mongo.Collection("tweets");

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("tweets");

  Template.body.helpers({
    tweets: function(){
      return Tweets.find({}, {sort: {createdAt: -1}});
    }
  });

  Meteor.startup(function(){
    var ar = $('#ar'),
    canvas = $('canvas', ar)[0],
    context = canvas.getContext('2d'),
    video = $('video', ar)[0];

    context.font = "20px serif";
    context.fillStyle = "#3264FF";

    try{
      navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.mozURL || window.webkitURL;

      // note ab resolution: http://stackoverflow.com/questions/27420581/get-maximum-video-resolution-with-getusermedia
      navigator.getUserMedia({'video': {
        optional: [
        {minWidth: 320},
        {minWidth: 640},
        {minWidth: 800},
        {minWidth: 900},
        {minWidth: 1024},
        {minWidth: 1280},
        {minWidth: 1920},
        {minWidth: 2560}
        ]
      }}, 
      function(stream){
        video.src = window.opera ? stream : window.URL.createObjectURL(stream);
        video.play();
      }, 
      function(err){
        console.errr("video capture error: ", err);
      })

    } catch(err){
      console.log("navigator.getUserMedia error: ", err);
    }
    video.style.position = "absolute";
    video.style.visibility = "hidden";

    setInterval(function(){
      var img = context.drawImage(video, 0, 0, 800, 500);
      renderTweets();
    }, 200);

    function renderTweets(){
      var tweets = Tweets.find({}, {sort: {createdAt: -1}}).fetch();
      if(!tweets.length) {
        console.log("no tweets");
        return;
      }
      tweets.map(function(data){
        globalAlpha = data.createdAt %255;
        context.fillText(data.text, Math.random()*(800-10)+5, Math.random()*(500-10)+5);
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Twit = new TwitMaker({
      consumer_key:         'VroUuKrEelXeAzaD7C7pj1Jjd'
      , consumer_secret:      'F6cejULcJGP28tpPk9nPPW02SHEPQPKncER6aOXbR9G70GYzI5'
      , access_token:         '11008862-Bb7p7VQRHCbzqviAX4nAdBOCEoWSj6Qy7z57wR3QN'
      , access_token_secret:  'R4bHwhPLsCOdimkhMdPQSaD34GsR8eCWYkKpIGiO6FdTk'
    });

    var handleTweets = Meteor.bindEnvironment(function(err, data, response) {
      console.log(data);
      console.log(err);
      for(var i = 0; i < data.statuses.length; i++){
        Meteor.call("addTweet", data.statuses[i].text);
      }
      
    });

    var handleStream = Meteor.bindEnvironment(function(tweet, err){
      debugger;
      console.log("***********************", err, "***********************");
      console.log("+++++++++++++++++++++++",tweet,"+++++++++++++++++++++++");
      Meteor.call("addTweet", tweet.text);
    });
    
    var stream = Twit.stream('statuses/filter', { track: '#truth' })

    // Twit.get('search/tweets',
    // {
    //   q: 'banana since:2011-11-11',
    //   count: 100
    // },
    // handleTweets
    // );

// uncomment to turn the stream on:
    // stream.on('tweet', handleStream);
  });

Meteor.publish("tweets", function () {
  return Tweets.find();
});
}

Meteor.methods({
  addTweet: function(text){
    Tweets.insert({
      text: text,
      createdAt: new Date()
    });
  }
});
