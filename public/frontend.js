var spotifyApi = new SpotifyWebApi();

let html_access_token = document.getElementById("access");
if(html_access_token.innerHTML.length > 0)
{
  spotifyApi.setAccessToken(html_access_token.innerHTML);
  console.log(spotifyApi.getAccessToken());
}
else {
  html_access_token.addEventListener('change', (event) => {
    spotifyApi.setAccessToken(html_access_token.innerHTML);
    console.log(spotifyApi.getAccessToken());
  });
}

document.addEventListener("DOMContentLoaded", function(event) {
    const list = new FrontEnd("#container")
  });


class FrontEnd
{
    constructor(list)
    {
        this.list
        this.createContainer()
    }
    createContainer()
    {
      spotifyApi.getMe(null).then(
        function (data) {
            callGetUserPlayerList(data)
        },
        function (err) {
            console.error(err);
        }
        );
    function callGetUserPlayerList(oldData)
    {
        
        spotifyApi.getUserPlaylists(oldData.id).then(
            function (data) {
                for (let i = 0; i<data.items.length;i++)
                {
                    var newButton = document.createElement("button");
                    var node = document.createTextNode(data.items[i].name);
                    
                    newButton.appendChild(node);
                    var element = document.getElementById("container");
                    newButton.onclick = function(){myFunction(data.items[i].id)};
                    element.appendChild(newButton);
                    
                }
            },
            function (err) {
              console.error(err);
            }
          );
    }
    function myFunction(oldDataId){
      document.getElementById("container").style.display = "none";
      console.log(oldDataId);
      spotifyApi.getPlaylistTracks(oldDataId).then(
        function (data) {
        console.log(data);
    },
    function (err) {
        console.error(err);
    }
    );
    }
  }
}