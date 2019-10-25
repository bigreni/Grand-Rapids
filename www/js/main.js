    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            notFirstUse();
        }
    }

  var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/4904986440'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/7995195971'
    };
  }

    function initApp() {
        if (!AdMob) { alert('admob plugin not ready'); return; }
        initAd();
        //display interstitial at startup
        loadInterstitial();
    }
    function initAd() {
        var defaultOptions = {
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            bgColor: 'black', // color name, or '#RRGGBB'
            isTesting: false // set to true, to receiving test ad for testing purpose
        };
        AdMob.setOptions(defaultOptions);
        registerAdEvents();
    }
    // optional, in case respond to events or handle error
    function registerAdEvents() {
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            document.getElementById('screen').style.display = 'none';     
        });
        document.addEventListener('onAdLoaded', function (data) {
            AdMob.showInterstitial();
        });
        document.addEventListener('onAdPresent', function (data) { });
        document.addEventListener('onAdLeaveApp', function (data) { });
        document.addEventListener('onAdDismiss', function (data) { 
            document.getElementById('screen').style.display = 'none';     
        });
    }

    function createSelectedBanner() {
          AdMob.createBanner({adId:admobid.banner});
    }

    function loadInterstitial() {
        if ((/(android|windows phone)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: false });
            //document.getElementById("screen").style.display = 'none';     
        } else if ((/(ipad|iphone|ipod)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: true });
            //document.getElementById("screen").style.display = 'none';     
        } else
        {
            document.getElementById("screen").style.display = 'none';     
        }
    }

   function checkFirstUse()
    {
        $("span").remove();
        $(".dropList").select2();
        //window.ga.startTrackerWithId('UA-88579601-5', 1, function(msg) {
        //    window.ga.trackView('Home');
        //});
        initApp();
        askRating();
        //document.getElementById('screen').style.display = 'none';     
    }

   function notFirstUse()
    {
        $("span").remove();
        $(".dropList").select2();
        document.getElementById('screen').style.display = 'none';     
    }

function askRating()
{
  AppRate.preferences = {
  openStoreInApp: true,
  useLanguage:  'en',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: true,
  storeAppURL: {
                ios: '1296631802',
                android: 'market://details?id=com.grandrapids.free'
               }
};
 
AppRate.promptForRating(false);
}


function loadDirections() {
        $('.js-next-bus-results').html('').hide(); // reset output container's html
        document.getElementById('btnSave').style.visibility = "hidden";
        $("#message").text('');
        $("#routeStopSelect").attr("disabled", "");
        $("#routeStopSelect").val('0');

        var direction = $("#routeSelect").find('option:selected').attr('data-direction') || false;
        var route = $("#routeSelect").val();
        if(direction == 'EW') {
            var options = [ 'Westbound', 'Eastbound'];
        } else if(direction == 'NS') {
            var options = ['Northbound', 'Southbound'];
        } else if(direction == 'Loop') {
            var options = ['Loop'];
        } else {
            var options = false;
            $('#routeDirectionSelect', '#nextBusForm').attr('disabled', 'disabled');
        }
            $("#routeDirectionSelect").removeAttr('disabled');
            $("#routeDirectionSelect").empty();
            $("#routeDirectionSelect").append($("<option disabled/>").val("0").text("- Select Direction -"));
        if(options) {
            $.each(options, function(i, d) {
                $("#routeDirectionSelect").append($("<option />").val(d).text(d));
            });
        }
        $("#routeDirectionSelect").val('0');
        $("span").remove();
        $(".dropList").select2();
    }


function loadStops() {
        $('.js-next-bus-results').html('').hide(); // reset output container's html
        document.getElementById('btnSave').style.visibility = "hidden";
        $("#message").text('');

        var request = new XMLHttpRequest();
        request.open("GET", "https://m.ridetherapid.org/api/routes/stops?routeNumber=" + $("#routeSelect").val() + "&direction=" + $("#routeDirectionSelect").val(), true);
        request.onreadystatechange = function () {//Call a function when the state changes.
            if (request.readyState == 4) {
                if (request.status == 200 || request.status == 0) {
                    var msg = JSON.parse(request.responseText);
                    var list = $("#routeStopSelect");
                    $(list).empty();
                    $(list).append($("<option disabled/>").val("0").text("- Select Stop -"));
                    $.each(msg, function (index, item) {
                        $(list).append($("<option />").val(item.id).text(item.name));
                    });
                    $(list).removeAttr('disabled');
                    $(list).val('0');
                    $("span").remove();
                    $(".dropList").select2();
                }
            }
        }
    request.send();
    }

function loadArrivals() {
    var outputContainer = $('.js-next-bus-results');

    $.ajax(
          {
              type: "GET",
              url: "https://m.ridetherapid.org/api/routes/routeStopInfo",
              data: "routeNumber=" + $("#routeSelect").val() + "&direction=" + $("#routeDirectionSelect").val() + "&stopID=" + $("#routeStopSelect").val() + "&manualStopID=",
              contentType: "text/html;	charset=utf-8",
              dataType: "text",
              success: function (output) {
                  if (output == null || output.length == 0) {
                      $(outputContainer).html('').hide(); // reset output container's html
                      document.getElementById('btnSave').style.visibility = "hidden";
                  }
                  else {
                      $(outputContainer).html(output).show();
                      document.getElementById('btnSave').style.visibility = "visible";
                  }
              }
          });
}

function loadFaves()
{
    window.location = "Favorites.html";
    //window.ga.trackView('Favorites');
}

function saveFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    var newFave = $('#routeSelect option:selected').val() + ">" + $("#routeDirectionSelect option:selected").val() + ">" + $("#routeStopSelect option:selected").val() + ":" + $('#routeSelect option:selected').text() + " > " + $("#routeDirectionSelect option:selected").text() + " > " + $("#routeStopSelect option:selected").text();
        if (favStop == null)
        {
            favStop = newFave;
        }   
        else if(favStop.indexOf(newFave) == -1)
        {
            favStop = favStop + "|" + newFave;               
        }
        else
        {
            $("#message").text('Stop is already favorited!!');
            return;
        }
        localStorage.setItem("Favorites", favStop);
        $("#message").text('Stop added to favorites!!');
}