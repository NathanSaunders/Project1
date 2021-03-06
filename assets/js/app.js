$(document).ready(function () {
    let queryURL = "https://accounts.spotify.com/api/token";
    let token = null;
    let songArray = [];
    let songObject = {};
    
    function GetToken() {
        $.ajax({
            url: queryURL,
            crossDomain: true,
            method: "POST",
            data: { "grant_type": "client_credentials" },
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            headers: { "Authorization": "Basic Y2FkYWUyOTk4YTMwNDZlZWEzMGQ3ZGQ5OTZhZTg4ZmY6NmMxMmQyYmI3YzNmNGUwYmIxMDBmZmY1ZDZmMGY3OWI=" },
            form: {grant_type: 'client_credentials'}
        }).then(function (response) {
            token = response.access_token;
        });
    };

    setInterval(() => GetToken(), 300000);

    $(".searchBtn").on("click", function (event) {
        event.preventDefault();
        let track = $(".searchField").val().trim();
        let searchQRY = "https://api.spotify.com/v1/search?q=track:" + track + "&type=track&market=US&limit=25";
        
        $.ajax({
            url: searchQRY,
            method: "GET",
            headers: { "Authorization": "Bearer " + token },
            json: true,
            data: {
                q: track,
                type: "track"
            }
        }).then(function (response) {
            console.log(response);
            console.log(response.tracks.items.length);
            let artistlists = $(".resultsdiv");
            songArray = [];
            songObject = {};
            
            for (var i = 0; i < response.tracks.items.length; i++) {
                let artistsname = response.tracks.items[i].artists[0].name;
                let trackname = response.tracks.items[i].name;
                let trackimage = response.tracks.items[i].album.images[1].url;
                let trackID = response.tracks.items[i].id;
                let duration = response.tracks.items[i].duration_ms;
                
                let newDiv = $("<div>");
                newDiv.addClass("results ");
                artistlists.append(newDiv);
                let p1 = $("<p>").text("Artist Name: " + artistsname);
                let p2 = $("<p>").text("Song Name: " + trackname);
                let albImage = $("<img>");
 
                albImage.attr("aname", artistsname);
                albImage.attr("tname", trackname);
                albImage.attr("src", trackimage);
                albImage.attr("tid", trackID);
                albImage.attr("dur", duration);
                albImage.addClass("albImage");
                
                newDiv.append(albImage);
                newDiv.append(p1);
                newDiv.append(p2);
            }
        });
    });
    GetToken();
    $(document).on("click", ".albImage", function() {
        let widgetDiv = $(".widgetplayer");
        
        let tid = $(this).attr("tid");
        
        let spotifyWidget = document.createElement("iframe");
        
        let widgetaddy = "https://open.spotify.com/embed/track/" + tid;
        
        console.log(widgetaddy);
        
        spotifyWidget.setAttribute("src", widgetaddy);
        spotifyWidget.style.width = "100%";
        spotifyWidget.style.height = "380";
        spotifyWidget.setAttribute("allowtransparency", true);
        spotifyWidget.setAttribute("allow", "encrypted-media");
        
        widgetDiv.html(spotifyWidget);
        document.getElementsByClassName("resultsdiv")[0].innerHTML = "";
    });
});


