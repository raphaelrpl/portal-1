package main

import (
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
	http.HandleFunc("/", rootHandler)

	log.Println("Aplicação iniciada com sucesso")
	http.ListenAndServe(":8080", Log(http.DefaultServeMux))
}