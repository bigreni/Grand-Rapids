    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent)) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            notFirstUse();
        }
    }

    function initApp() {
        if (/(android)/i.test(navigator.userAgent)){
            interstitial = new admob.InterstitialAd({
                //dev
                adUnitId: 'ca-app-pub-3940256099942544/1033173712'
                //prod
                //adUnitId: 'ca-app-pub-9249695405712287/4904986440'
              });
            }
            else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
                interstitial = new admob.InterstitialAd({
                    //dev
                    adUnitId: 'ca-app-pub-3940256099942544/4411468910'
                    //prod
                    //adUnitId: 'ca-app-pub-9249695405712287/7995195971'
                  });
            }
            registerAdEvents();
            interstitial.load();
    }

    // optional, in case respond to events or handle error
    function registerAdEvents() {
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('admob.ad.load', function (data) {
            document.getElementById("screen").style.display = 'none';    
        });
        document.addEventListener('admob.ad.loadfail', function (data) {
            document.getElementById("screen").style.display = 'none'; 
        });
        document.addEventListener('admob.ad.show', function (data) { 
            document.getElementById("screen").style.display = 'none';     
        });
        document.addEventListener('admob.ad.dismiss', function (data) {
            document.getElementById("screen").style.display = 'none';     
        });
    }

   function checkFirstUse()
    {
        $("span").remove();
        $(".dropList").select2();
        initApp();
        checkPermissions();
        askRating();
        //document.getElementById('screen').style.display = 'none';     
    }

   function notFirstUse()
    {
        $("span").remove();
        $(".dropList").select2();
        document.getElementById('screen').style.display = 'none';     
    }

    function checkPermissions(){
        const idfaPlugin = cordova.plugins.idfa;
    
        idfaPlugin.getInfo()
            .then(info => {
                if (!info.trackingLimited) {
                    return info.idfa || info.aaid;
                } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
                    return idfaPlugin.requestPermission().then(result => {
                        if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
                            return idfaPlugin.getInfo().then(info => {
                                return info.idfa || info.aaid;
                            });
                        }
                    });
                }
            });
    }

function askRating()
{
    const appRatePlugin = AppRate;
    appRatePlugin.setPreferences({
        reviewType: {
            ios: 'AppStoreReview',
            android: 'InAppBrowser'
            },
    useLanguage:  'en',
    usesUntilPrompt: 10,
    promptAgainForEachNewVersion: true,
    storeAppURL: {
                ios: '1296631802',
                android: 'market://details?id=com.grandrapids.free'
               }
    });

    AppRate.promptForRating(false);
}


function loadDirections() {
        reset();
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
        reset();
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
    showAd();
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
    showAd();
    window.location = "Favorites.html";
}

function showAd()
{
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent)) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
        document.getElementById("screen").style.display = 'block';     
        interstitial.show();
        document.getElementById("screen").style.display = 'none';
    }
}

function reset()
{
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#message").text('');
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

function proSubscription()
{
    window.location = "Subscription.html";
    //myProduct.getOffer().order();
}