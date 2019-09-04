(function (window) {
    window.__env = window.__env || {};

    // API url Geoserver
    window.__env.urlGeoserver = 'http://brazildatacube.dpi.inpe.br/geoserver';
    // API url STAC
    window.__env.urlStac = 'http://datacube-001.dpi.inpe.br:5025';
    // API url STAC-Compose
    window.__env.urlStacCompose = 'http://localhost:5000/stac_compose';
    // API url WTSS
    window.__env.urlWTSS = 'http://datacube-001.dpi.inpe.br:5024/wtss';
    // API url Oauth
    window.__env.urlOauth = 'http://datacube-001.dpi.inpe.br:5023/oauth';
    // API url Soloist
    window.__env.urlSoloist = 'http://cbers1.dpi.inpe.br:5021';

}(this));