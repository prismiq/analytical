/*
   Anlytical Campaign Logger Library
   www.anlytical.com
   
   Version: v1.1
*/

// Inputs: campaignId (string), campaignKey (string)
// Output: None
var CampaignLogger = {
    // URLs
    campaignBaseURL: 'https://api.anlytical.com/campaign/v1',
    campaignLogURL: this.campaignBaseURL + '/log/',
    campaignUserURL: this.campaignBaseURL + '/user/',
    
    // Function to initialize the campaign logger
    init: function(campaignId, campaignKey) {
        if (CampaignLogger.getCookie('CL_CampaignID') == "") {
            // New campaign
            CampaignLogger.setCookieInfo(campaignId, campaignKey);
            CampaignLogger.sendEvent('PageView', 0, 1);
        } else {
            if (CampaignLogger.getCookie('CL_CampaignID') != "") {
                // Found cookie
                CampaignLogger.sendEvent('PageView', 0, 0);
            }
        }
    },

    // Function to set cookie information
    setCookieInfo: function(CampaignID, CampaignKey) {
        var randomUserId = Math.random().toPrecision(21).substring(16);
        CampaignLogger.setCookie('CL_CampaignID', window.btoa(CampaignID), 30);
        CampaignLogger.setCookie('CL_CampaignKey', window.btoa(CampaignKey), 30);
        CampaignLogger.setCookie('CL_UserID', window.btoa(randomUserId), 30);
    },

    // Function to send AJAX request
    sendAjax: function(url, isAsync, success) {
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.open('POST', url, isAsync);
        xhr.onload = function() {
            if (xhr.readyState > 3 && xhr.status == 200) success(xhr.responseXML);
        };
        xhr.send();
        return xhr;
    },

    // Function to send event data
    sendEvent: function(eventType, eventValue, newUser) {
        var userID = window.atob(CampaignLogger.getCookie('CL_UserID'));
        var campaignID = window.atob(CampaignLogger.getCookie('CL_CampaignID'));
        var campaignKey = window.atob(CampaignLogger.getCookie('CL_CampaignKey'));

        // User information
        var userAgent = navigator.userAgent;
        var platform = navigator.platform;
        var language = navigator.language;

        // Page information
        var fullUrl = window.location.href;
        var hostName = window.location.hostname;
        var pageUrl = window.location.pathname;
        var referrerInfo = document.referrer;
        var historyInfo = history.length;

        // Additional information
        var browser = navigator.appName;
        var cookieInfo = document.cookie;
        var screenWidth = screen.width;
        var screenHeight = screen.height;
        var browserLang = navigator.language;
        var browserVersion = navigator.appVersion;
        var browserLanguage = navigator.browserLanguage;

        var d = new Date();
        var dateTime = d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear();

        var qsData = 'CampaignID=' + campaignID + '&CampaignKey=' + campaignKey + '&UserID=' + userID + '&EventType=' + eventType + '&EventValue=' + parseInt(eventValue) + '&UserAgent=' + encodeURIComponent(userAgent) + '&Platform=' + encodeURIComponent(platform) + '&Language=' + encodeURIComponent(language) + '&FullURL=' + encodeURIComponent(fullUrl) + '&HostName=' + encodeURIComponent(hostName) + '&Page=' + encodeURIComponent(pageUrl) + '&Referrer=' + encodeURIComponent(referrerInfo) + '&History=' + parseInt(historyInfo) + '&Browser=' + encodeURIComponent(browser) + '&cookeInfo=' + encodeURIComponent(cookieInfo) + '&ScreenWidth=' + encodeURIComponent(screenWidth) + '&ScreenHeight=' + encodeURIComponent(screenHeight) + '&BrowserLang=' + encodeURIComponent(browserLang) + '&BrowserLanguage=' + encodeURIComponent(browserLanguage) + '&BrowserVersion=' + encodeURIComponent(browserVersion) + '&NewUser=' + encodeURIComponent(newUser);

        var hash = encodeURIComponent(window.btoa(campaignKey));

        // Send AJAX request
        CampaignLogger.sendAjax(CampaignLogger.campaignLogURL + '?' + qsData + '&Hash=' + hash, false, function(data) {
            // No response
        });
    },

    // Function to set cookie
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },

    // Function to get cookie
    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    // Function to get user info
    getUserInfo: function() {
        var xmlDoc = '';
        var arr = new Array();
        var userID = CampaignLogger.getCookie("CL_UserID");
        var obj = {};

        CampaignLogger.sendAjax(CampaignLogger.campaignUserURL + '?UserID=' + userID, false, function(data) {
            var i;
            xmlDoc = data;
            var x = xmlDoc.getElementsByTagName("Session");

            var obj = {};
            for (i = 0; i < x.length; i++) {
                obj = {
                    ID: i,
                    CampaignID: xmlDoc.getElementsByTagName("UserID")[i].childNodes[0].nodeValue,
                    UserID: xmlDoc.getElementsByTagName("UserID")[i].childNodes[0].nodeValue,
                    SessionUserID: xmlDoc.getElementsByTagName("SessionUserID")[i].childNodes[0].nodeValue,
                    EventType: xmlDoc.getElementsByTagName("EventType")[i].childNodes[0].nodeValue,
                    EventValue: xmlDoc.getElementsByTagName("EventValue")[i].childNodes[0].nodeValue,
                    UserAgent: xmlDoc.getElementsByTagName("UserAgent")[i].childNodes[0].nodeValue,
                    Platform: xmlDoc.getElementsByTagName("Platform")[i].childNodes[0].nodeValue,
                    Language: xmlDoc.getElementsByTagName("Language")[i].childNodes[0].nodeValue,
                    FullURL: xmlDoc.getElementsByTagName("FullURL")[i].childNodes[0].nodeValue,
                    HostName: xmlDoc.getElementsByTagName("HostName")[i].childNodes[0].nodeValue,
                    Page: xmlDoc.getElementsByTagName("Page")[i].childNodes[0].nodeValue,
                    Referrer: xmlDoc.getElementsByTagName("Referrer")[i].childNodes[0].nodeValue,
                    History: xmlDoc.getElementsByTagName("History")[i].childNodes[0].nodeValue,
                    Browser: xmlDoc.getElementsByTagName("Browser")[i].childNodes[0].nodeValue,
                    ScreenWidth: xmlDoc.getElementsByTagName("ScreenWidth")[i].childNodes[0].nodeValue,
                    ScreenHeight: xmlDoc.getElementsByTagName("ScreenHeight")[i].childNodes[0].nodeValue,
                    BrowserLang: xmlDoc.getElementsByTagName("BrowserLang")[i].childNodes[0].nodeValue,
                    BrowserLanguage: xmlDoc.getElementsByTagName("BrowserLanguage")[i].childNodes[0].nodeValue,
                    QueryString: xmlDoc.getElementsByTagName("QueryString")[i].childNodes

[0].nodeValue,
                    ASN: xmlDoc.getElementsByTagName("ASN")[i].childNodes[0].nodeValue,
                    ASNInfo: xmlDoc.getElementsByTagName("ASNInfo")[i].childNodes[0].nodeValue,
                    Country: xmlDoc.getElementsByTagName("Country")[i].childNodes[0].nodeValue,
                    Region: xmlDoc.getElementsByTagName("Region")[i].childNodes[0].nodeValue,
                    City: xmlDoc.getElementsByTagName("City")[i].childNodes[0].nodeValue,
                    Lng: xmlDoc.getElementsByTagName("Lng")[i].childNodes[0].nodeValue,
                    Lat: xmlDoc.getElementsByTagName("Lat")[i].childNodes[0].nodeValue,
                    Postcode: xmlDoc.getElementsByTagName("Postcode")[i].childNodes[0].nodeValue,
                    Date_Added: xmlDoc.getElementsByTagName("Date")[i].childNodes[0].nodeValue
                }
                arr.push(obj);
            }
        });

        // Return array of sessions
        return arr;
    }
};
