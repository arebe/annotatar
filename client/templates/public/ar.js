Template.ar.onRendered(function(){
  var ffmobile = navigator.userAgent.indexOf('Firefox') > -1 && navigator.userAgent.indexOf("Mobile") > -1;
  var mobile = navigator.userAgent.indexOf("Mobile") > -1;
 
  var offset = {
    lastTime: 0,
    time: 0,
    velX: 0.0,
    velY: 0.0,
    x: 0.0,
    y: 0.0,
  };

  var ar = $('#ar'),
  canvas = $('canvas', ar)[0],
  context = canvas.getContext('2d'),
  video = $('video', ar)[0],
  navLat, navLong, accurate,
  hashtag;
  var sx = 0, 
  sy = 0, 
  sw = video.width, 
  sh = video.height;

  console.log("video w: ", video.width, " video h: ", video.height);
  console.log("window w: ", $(window).width())
  context.canvas.width = $(window).width();
  context.canvas.height = $(window).height();
  context.font = "20px serif";


  try{
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.mozURL || window.webkitURL;

      navigator.getUserMedia({ audio: false, 'video': true}, 
      function(stream){
        video.src = window.opera ? stream : window.URL.createObjectURL(stream);
        video.play();
      }, 
      function(err){
        console.err("video capture error: ", err);
      })

    } catch(err){
      console.log("navigator.getUserMedia error: ", err);
    }

    video.style.position = "absolute";
    video.style.visibility = "hidden";

  setInterval(function(){
    if(ffmobile){
      var wh = window.innerHeight - video.height;
      context.save();
      context.scale(1, -1);
      context.translate(0,-wh);
      var img = context.drawImage(video, 0, -video.height, window.innerWidth, window.innerHeight);
      context.restore();
      renderTweets();
    }
    else if(mobile){
      renderWarning("Browser not supported.");
    }
    else{
      var img = context.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
      renderTweets();
    }

    //renderTest("TEST");
    
    
    
  }, 100); // end setInterval

var renderTest = function(testText){
    context.font = '50px "Walter Turncoat"';
    context.fillStyle = 'rgba(255, 60, 180, 1)';
    context.fillText(testText, 25, 100);
}

var renderWarning = function(testText){
    context.font = '50px "Walter Turncoat"';
    context.fillStyle = "rgb(49,84,129)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255, 80, 60, 1)';
    context.fillText(testText, 25, (canvas.height/2));
}

var renderTweets = function(){
      var tweets = Tweets.find({}, {sort: {createdAt: -1}}).fetch();
      if(!tweets.length) {
        console.log("no tweets");
        return;
      }
      tweets.map(function(data){
        var age = parseInt(Date.now() - data.tweetCreatedAt);
        // 14400000 ms == 4 hrs
        // 3600000 ms == 1 hr
        // 1200000 ms = 20min
        // 60000 ms = 1min
        var ageMax = (48*3600000),
        fsizeMax = 50,
        fsizeMin = 0;
        if (age > ageMax){ age = ageMax };
        var fsize = Math.floor((((fsizeMin-fsizeMax)*age)/ageMax)+fsizeMax);
        alphaMax = 1.0;
        alphaMin = 0;
        var alpha = (((alphaMin-alphaMax)*age)/ageMax)+alphaMax;
        context.font = fsize+'px "Walter Turncoat"';
        context.fillStyle = 'rgba('+data.color.r+','+data.color.g+','+ data.color.b+','+ alpha+')';
        context.fillText(data.text, data.xPos+offset.x, data.yPos+offset.y);
      });
  $("#hashtag").html("<p>"+Session.get("hashtag")+"</p>");
  //$("#tweetUrl").href("https://twitter.com/home?status=%23"+Session.get("hashtag")+"%20%23annotatAR");
}; // end renderTweets

$("#downloadBtn").click(function(event) {
  var filename = 'annotatar_data.csv';
  Meteor.call('download', function(err, fileContent) {
    if(fileContent){
      var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
      saveAs(blob, filename);
    }
  })
});

$("#captureBtn").click(function(e){
  var url = canvas.toDataURL('png');
  $("#captureLink").attr('href', url).click();

});

function orientationhandler(evt){
  
  // For FF3.6+
  if (!evt.gamma && !evt.beta) {
    evt.gamma = -(evt.x * (180 / Math.PI));
    evt.beta = -(evt.y * (180 / Math.PI));
  }
  
  // use evt.gamma, evt.beta, and evt.alpha 
  // according to dev.w3.org/geo/api/spec-source-orientation
  var tiltLR = parseInt(evt.gamma);
  var tiltFB = parseInt(evt.beta);
  var dir = parseInt(evt.alpha);
  //document.getElementById("doEvent").innerHTML = "<p>dir: "+dir+"tiltFB:"+tiltFB+"tiltLR:"+tiltLR+"</p>";

}

window.addEventListener('deviceorientation',  orientationhandler, false);
window.addEventListener('mozOrientation',     orientationhandler, false);

if (window.DeviceOrientationEvent) {
  //document.getElementById("doEvent").innerHTML = "DeviceOrientation";
  // Listen for the deviceorientation event and handle the raw data
  // window.addEventListener('deviceorientation', function(eventData) {
  //   document.getElementById("doEvent").innerHTML = "<p>eventData: "+eventData+"</p>";
  //   // gamma is the left-to-right tilt in degrees, where right is positive
  //   var tiltLR = parseInt(eventData.gamma);

  //   // beta is the front-to-back tilt in degrees, where front is positive
  //   var tiltFB = parseInt(eventData.beta);

  //   // alpha is the compass direction the device is facing in degrees
  //   var dir = eventData.alpha;

  //   // call our orientation event handler
  //   deviceOrientationHandler(tiltLR, tiltFB, dir);
  // }, false);
} else {
  //document.getElementById("doEvent").innerHTML = "Device orientation not supported."
}

var lastDir = 0;

function deviceOrientationHandler(tiltLR, tiltFB, dir){
  //document.getElementById("doEvent").innerHTML = "<p>dir: "+dir+"tiltFB:"+tiltFB+"tiltLR:"+tiltLR+"</p>";
  //console.log("dir: ", dir);
  //deltaDir = dir - lastDir;
  //console.log("deltadir: ", deltaDir);
}




 window.ondevicemotion = function(e){
    //var now = Date.now();
    //offset.time = now - offset.lastTime;
    //offset.lastTime = now;
    //var interval = e.interval;
    var accX = Math.round(e.accelerationIncludingGravity.x*10)/10;
    var accY = Math.round(e.accelerationIncludingGravity.y*10)/10;
    // offset.velX = offset.velX + (accX * (offset.time/1000));
    // offset.velY = offset.velY + (accY * (offset.time/1000));
    var xincr = 0;
    if (accY > 0){
      accY > 1 ? xincr = 2 : xincr = 1;
    }
    else if(accY < 0){
      accY < -1 ? xincr = -2 : xincr = -1;
    }

    offset.x += xincr;
    if(offset.x > 1000){
      offset.x = 0;
    }
    else if(offset.x < -1000){
      offset.x = 0;
    }
    
    //offset.y -= offset.velY;
    //console.log("accX: "+accX+" accY: "+accY+" offset.x: "+offset.x+" offset.y: "+offset.y+" offset.time: "+offset.time/1000+" interval: "+interval);

    //offset.velX = 0;
    //offset.velY = 0;

  } // end ondevicemotion

}); // end template.mainar.onrendered
