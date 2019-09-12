(function (window) {
    window.__env = window.__env || {};

    // API url Geoserver
    window.__env.urlGeoserver = 'http://brazildatacube.dpi.inpe.br/geoserver';
    // API url STAC
    window.__env.urlStac = 'http://cbers1.dpi.inpe.br:5051';
    // API url STAC-Compose
    window.__env.urlStacCompose = 'http://cbers1.dpi.inpe.br:5077/stac_compose';
    // API url WTSS
    window.__env.urlWTSS = 'http://cbers1.dpi.inpe.br:5073/wtss';
    // API url Oauth
    window.__env.urlOauth = 'http://brazildatacube.dpi.inpe.br/oauth';
    // API url Soloist
    window.__env.urlSoloist = 'http://cbers1.dpi.inpe.br:5021';
    // API url Maestro
    window.__env.urlMaestro = 'http://cbers1.dpi.inpe.br:5020';
    // API url DataSearch - INPE
    window.__env.urlDataSearchINPE = 'http://www.dpi.inpe.br/datasearch/';
    // URL APM SERVE
    window.__env.urlAPMServer = 'http://127.0.0.1:8200/';

}(this));