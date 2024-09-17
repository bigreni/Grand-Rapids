function loadFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    var arrStops = null;
    var arrIds;
    var text = "";
    for (i = 0; i < arrFaves.length; i++) 
    {
        arrStops = arrFaves[i].split(":");
        arrIds = arrStops[0].split(">");
        text = '<li><button onclick=removeFavorite(' + i + '); style="background-color:red; border:none;float:right;">&#x2718;</button><a href="javascript:loadFaveArrivals(' + arrIds[0] + ",'" + arrIds[1] + "'," + arrIds[2] +')"; class="langOption"><h4 class="selectLanguage">' + arrStops[1] + '</h4></a></li>';
	    $("#lstFaves").append(text);
    }
}

function removeFavorite(index)
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    if(arrFaves.length > 1)
    {
        arrFaves.splice(index, 1);
        var faves = arrFaves.join("|");
        localStorage.setItem("Favorites", faves);
    }
    else
    {
        localStorage.removeItem("Favorites");
    }
    location.reload();
}

function loadFaveArrivals(route,direction,stop)
{
    var outputContainer = $('.js-next-bus-results');
    $.ajax(
          {
              type: "GET",
              url: "https://m.ridetherapid.org/api/routes/routeStopInfo",
              data: "routeNumber=" + route + "&direction=" + direction + "&stopID=" + stop + "&manualStopID=",
              contentType: "application/json;	charset=utf-8",
              dataType: "text",
              success: function (output) {
                  if (output == null || output.length == 0) {
                      $(outputContainer).html('').hide(); // reset output container's html
                  }
                  else {
                      $(outputContainer).html(output).show();
                  }
              }
          });
}

