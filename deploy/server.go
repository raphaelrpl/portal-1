package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

func Log(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.URL.Path, "/static/") {
			log.Printf("%s %s %s", r.RemoteAddr, r.Method, r.URL)
		}
		handler.ServeHTTP(w, r)
	})
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	if _, err := os.Stat("dist/portal/" + r.URL.Path); os.IsNotExist(err) {
		http.ServeFile(w, r, "dist/portal/index.html")
	} else {
		http.ServeFile(w, r, "dist/portal/"+r.URL.Path)
	}
}

func main() {
	file_url := "/usr/src/app/dist/portal/"

	// open and recreate file with env variables
	data, err := ioutil.ReadFile(file_url+"env.txt")
	if err != nil {
		log.Fatal(err)
	}

	new_content := strings.ReplaceAll(string(data), "URL_GEOSERVER", "'"+os.Getenv("URL_GEOSERVER")+"'")
	new_content = strings.ReplaceAll(new_content, "APP_NAME", "'"+os.Getenv("APP_NAME")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_STAC_COMPOSE", "'"+os.Getenv("URL_STAC_COMPOSE")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_STAC", "'"+os.Getenv("URL_STAC")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_WTSS", "'"+os.Getenv("URL_WTSS")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_OAUTH_APP", "'"+os.Getenv("URL_OAUTH_APP")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_OAUTH", "'"+os.Getenv("URL_OAUTH")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_SOLOIST", "'"+os.Getenv("URL_SOLOIST")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_MAESTRO", "'"+os.Getenv("URL_MAESTRO")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_RC_MAESTRO", "'"+os.Getenv("URL_RC_MAESTRO")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_DATASEARCH_INPE", "'"+os.Getenv("URL_DATASEARCH_INPE")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_BDC_TILER", "'"+os.Getenv("URL_BDC_TILER")+"'")
	new_content = strings.ReplaceAll(new_content, "URL_APM_SERVER", "'"+os.Getenv("URL_APM_SERVER")+"'")
	err = ioutil.WriteFile(file_url+"assets/env.js", []byte(new_content), 0644)
	if err != nil {
		log.Fatalln(err)
	}

	// start web app
	http.HandleFunc("/", rootHandler)

	log.Println("Aplicação iniciada com sucesso")
	http.ListenAndServe(":8080", Log(http.DefaultServeMux))
}