Meteor.methods({
  addTweet: function(text, hashtag, created_at){
    var thisColor = {
      r: lastColor.r < 255 ? constrain(lastColor.r+10, 10, 255) : 10,
      g: lastColor.g < 255 ? constrain(lastColor.g+5, 10, 255) : 10,
      b: lastColor.b < 255 ? constrain(lastColor.b+20, 10, 255) : 10,
    }
    Tweets.insert({
      text: text.stripURL(),
      hashtag: hashtag,
      tweetCreatedAt: new Date(created_at),
      createdAt: new Date(),
      xPos: (Math.random()*(1000-10)+5)-1000,
      yPos: Math.random()*(700-10)+20,
      zPos: Math.random()*(80-10)+5,
      color: thisColor,
    });
    lastColor = thisColor;
    // remove oldest if count is too large
    // if(Tweets.find({hashtag: hashtag}) > 300){
    //   Tweets.findOne({hashtag: hashtag}, {sort: {tweetCreatedAt: 1}}).pop();
    // }
    
  },
  // updateTweet: function(id, x, y){
  //   Tweets.update(this.id, {
  //     $set: {
  //       {xPos: x},
  //       {yPos: y},
  //     }
  //   });
  // },
  addHashtag: function(lat, lon, hashtag){
    Hashtags.insert({
      lat: lat,
      lon: lon,
      hashtag: hashtag,      
    });
   // hashtags.push(hashtag);
    console.log("inserted into Hashtags: "+hashtag);
  },
  findHashtag: function(lat, lon){
    var hashtag;
    var cursor = Hashtags.findOne({
      lat: lat,
      lon: lon
    });
    if (cursor){
      hashtag = cursor.hashtag;
    }
    return hashtag;
  },
  download: function() {
    var collection = Tweets.find().fetch();
    var heading = true; // Optional, defaults to true
    var delimiter = "\t" // Optional, defaults to ",";
    return exportcsv.exportToCSV(collection, heading, delimiter);
  },

});

function constrain(n, min, max){
        return Math.max(Math.min(n, max), min);
}

// Twitter Parsers
// adapted from http://www.itworld.com/article/2704521/development/how-to-parse-urls--hash-tags--and-more-from-a-tweet.html
String.prototype.stripURL = function() {
    return this.replace(/[A-Za-z]+\:\/\/+[A-Za-z0-9-_]+.[A-Za-z0-9-_:%&~?\/.=]+/g, "");
};

String.prototype.stripUsername = function() {
    return this.replace(/[@]+[A-Za-z0-9-_]+/g, "");
};

String.prototype.stripHashtag = function() {
    return this.replace(/[#]+[A-Za-z0-9-_]+/g, "");
};