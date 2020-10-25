var spotifyApi = new SpotifyWebApi();

let html_access_token = document.getElementById("access");
if(html_access_token.innerHTML.length > 0)
{
  spotifyApi.setAccessToken(html_access_token.innerHTML);
  console.log("cashe loaded");
}
else {
  html_access_token.addEventListener('change', (event) => {
    spotifyApi.setAccessToken(html_access_token.innerHTML);
    console.log("event loaded");
  });
}

document.addEventListener("DOMContentLoaded", function(event) {
    const list = new FrontEnd("#container")
    document.getElementById("remove_song").addEventListener("click", function() {
      list.removeSong();
  });
});

  var userID;

  var selectedPlaylist;
  var selected_playlist_name;
class FrontEnd
{

  constructor(list)
  {
    this.list
    this.createContainer()
  }

  createContainer()
  {
    /**
      * Find the userId of the user and call a function that gets the users playlist if promise is fulfilled.
      */
    spotifyApi.getMe(null).then(
      function (data) {
        updateUser(data);
        callGetUserPlayerList(data);
      },
      function (err) {
        console.error(err);
      });
    /**
     * makes playlists into button options and calls a function that gets tracks in playlist
     * @param {object} oldData data of all the user playlists
     */
    function callGetUserPlayerList(oldData)
    {

      spotifyApi.getUserPlaylists(oldData.id).then(
        function (data) {
          document.getElementById("header").innerHTML = "Choose a Playlist to be Edited";
          for (let i = 0; i<data.items.length;i++)
          {
              let newButton = document.createElement("button");
              var node = document.createTextNode(data.items[i].name);
              newButton.appendChild(node);
              var element = document.getElementById("playList");
              newButton.onclick = function(){showTracks(data.items[i].id);
              selected_playlist_name = data.items[i].name;};
              element.appendChild(newButton);
          }
        },
        function (err) {
          console.error(err);
        }
      );
    }
    /**
     * displays track names after being edited
     * @param {string} oldDataId id of the playlist selected
     */
    function showTracks(oldDataId){
      document.getElementById("playList").style.display = "none";
      console.log(oldDataId);

      spotifyApi.getPlaylistTracks(oldDataId).then(
        function (data) {
          selectedPlaylist = data;
          document.getElementById("header").innerHTML = "Choose a Track to play";
          for (let i = 0; i<data.items.length;i++)
          {
              var newButton = document.createElement("button");
              newButton.setAttribute("id", i);
              var node = document.createTextNode(data.items[i].track.name);
              var x = document.createElement("INPUT");
              x.setAttribute("type", "checkbox");

              newButton.appendChild(node);
              var element = document.getElementById("trackList");
              newButton.onclick = function(){selectSong(i)};
              element.appendChild(newButton);

          }

        },
        function (err) {
          console.error(err);
        }
      );
    }
    function selectSong(i)
    {
      var element = document.getElementById(i);
      if (element.checked == true) 
      {
        element.checked = false;
      }
      else
      {
        console.log("passed");
        element.checked = true;
      }
    }
    /**
    * This function updates the current users information on screen.
    * @param {json} data A json file containing information about the users profile
    */
    function updateUser(data)
    {
      userID = data.id;
      document.getElementById("profile-userName").innerHTML = "Username: " + data.display_name;
      document.getElementById("profile-userID").innerHTML = ("userID: " + data.id);
      document.getElementById("profile-pic").src = data.images[0].url;
    }

  }
  removeSong()
  {
    
    for (let i =0; i<selectedPlaylist.items.length;i++)
    {
      var element = document.getElementById(i);
      if(element.checked == true)
      {
        delete selectedPlaylist.items[i];
        selectedPlaylist.items.length--;
      }
    }
    console.log(selectedPlaylist);
    }

}

/**
* This function takes the current selected playlist and creates a clone of it on spotify
*/
function finishPlaylist()
{
  var finalPlaylist = [];
  console.log(selected_playlist_name);
  for(i = 0; i < selectedPlaylist.items.length;i++)
  {
    finalPlaylist[i] = (selectedPlaylist.items[i].track.uri).toString();
  }

  spotifyApi.createPlaylist(userID,{name:"clone of " + selected_playlist_name}).then(
    function (data) {
      spotifyApi.addTracksToPlaylist(data.id,finalPlaylist,null).then(
        function(newPlaylist){
          console.log(newPlaylist);
          location.reload();
        },
        function(err){
          console.log(err);
        });
    },
    function (err) {
      console.error(err);
    });

}
