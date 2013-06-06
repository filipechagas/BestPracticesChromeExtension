
var Ajax = (function () {

    function load(page, updateItem) {

        // Google PageSpeed
        if (page.url.indexOf("localhost") === -1 && page.url.indexOf("file://") === -1) {
            getUrl("https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=" + page.url + "&key=AIzaSyCUKP2H8Tq02_EmppV1oct2K_gOaZquA3s&prettyprint=false", function (xhr) {
                if (xhr.status === 200) {
                    var score = JSON.parse(xhr.responseText).score;
                    page.Performance.pagespeed = { text: "Google PageSpeed score of " + score + "/100", result: score > 90 };
                    updateItem("pagespeed", page.Performance.pagespeed);
                }
            });
        }
        else {
            page.Performance.pagespeed = { text: "Google PageSpeed (remote only)", result: "n/a" };
            updateItem("pagespeed", page.Performance.pagespeed);
        }

        // Robots.txt and XML Sitemap
        getUrl(page.url + "/robots.txt", function (xhr) {
            page.SEO.robotstxt = { text: "Robots.txt exist", result: xhr.status === 200 };
            //page.SEO.sitemap = { text: "Sitemap.xml exist", result: xhr.responseText.indexOf("sitemap") > -1 };
            updateItem("robotstxt", page.SEO.robotstxt);
        });
        
        // Favicon
        if (!page.Usability.favicon.result) {
            getUrl(page.url + "/favicon.ico", function (xhr) {
                if (xhr.status === 200) {
                    page.Usability.favicon.result = true;
                    updateItem("favicon", page.Usability.favicon);
                }
            });
        }
    }

    function getUrl(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime(), true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr);
            }
        };
        xhr.send();
    }

    return {
        load: load
    };
})();