Template.docPage.onCreated(function(){
    this.hashtags = this.subscribe('hashtags');
});

Template.docPage.helpers({
    subscription: function(){
        return Template.instance().hashtags.ready();
    }
})
    

Template.docPage.onRendered(function(){
	console.log("hi i'm onRendered");
    $(function() {
    $('.easy-modal').easyModal({
      // top: 20,
      overlay: 0.2,
      overlayColor: "#333",
      overlayOpacity: 0.8,
    });

    $('.easy-modal-open').click(function(e) {
      var target = $(this).attr('href');
      $(target).trigger('openModal');
      e.preventDefault();
    });

    $('.easy-modal-close').click(function(e) {
      $('.easy-modal').trigger('closeModal');
    });

  });
}); // end docPage onRendered


Template.map.onCreated(function() {
    var self = this;

    GoogleMaps.ready('map', function(map) {
        var icon = 'tweet_marker.png';
        var markers = [];
        console.log("initMap hashtags count: ", Hashtags.find().count());
        self.autorun(function(){
          var hashtagsCursor = Hashtags.find();
          hashtagsCursor.map(function(h){
              console.log("adding marker for: ", h.lat, " ", h.lon, " ", h.hashtag);
              var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(h.lat, h.lon),
                  map: map.instance,
                  icon: icon,
                  title: h.hashtag,
                  description: "whatever stuff"
               });
              marker.addListener("click", function(){
                console.log("you clicked on:", marker.description, "about", marker.title);
              });
              markers.push(marker);
          });
        }); // end self.autorun
    }); // end GoogleMaps.ready
  }); // end Template.map.onCreated

  Template.map.helpers({
    mapOptions: function() {
      // Initialize the map once we have the latLng.
      if (GoogleMaps.loaded()) {
        return {
          mapTypeId: google.maps.MapTypeId.TERRAIN,
          center: new google.maps.LatLng( 40, -74 ),
          zoom: 7
        };
      }
    }
  }); // end Template.map.helpers