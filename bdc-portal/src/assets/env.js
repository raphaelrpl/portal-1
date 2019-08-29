(function (window) {
    window.__env = window.__env || {};

    // API url Geoserver
    window.__env.urlGeoserver = 'http://brazildatacube.dpi.inpe.br/geoserver';
    // API url STAC
    window.__env.urlStac = 'http://cbers1.dpi.inpe.br:5051';
    // API url STAC-Compose
    window.__env.urlStacCompose = 'http://localhost:5000/stac_compose';
    // API url WTSS
    window.__env.urlWTSS = 'http://cbers1.dpi.inpe.br:5073/wtss';
    // API url Oauth
    window.__env.urlOauth = 'http://cbers1.dpi.inpe.br:5082/oauth';

}(this));