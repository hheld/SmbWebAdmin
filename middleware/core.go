package middleware

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

// Data collects all data required to be passed along chained middleware functions.
type Data struct {
	UserName string
}

// Handler defines the type of middleware functions that can be chained.
type Handler func(data *Data, w http.ResponseWriter, r *http.Request) error

// Handle takes care of chaining middleware handlers in the given order.
func Handle(data *Data, handlers ...Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		for _, handler := range handlers {
			err := handler(data, w, r)
			if err != nil {
				log.Printf("There was an error: %v", err)
				return
			}
		}
	})
}

// ServeFilesFromDir serves files from the given directory.
// This is especially needed to server assets for a React app that uses react-router.
// If a file is being asked for that doesn't exist physically on disk, index.html is returned.
// Otherwise, react-router wouldn't work as expected.
func ServeFilesFromDir(directory string) Handler {
	return func(data *Data, w http.ResponseWriter, r *http.Request) error {
		htmlIndexFile := fmt.Sprintf("%s/index.html", directory)
		requestedFileCandidate := fmt.Sprintf("%s/%s", directory, r.URL.Path[1:])

		if _, err := os.Stat(requestedFileCandidate); os.IsNotExist(err) {
			http.ServeFile(w, r, htmlIndexFile)
		} else {
			http.ServeFile(w, r, requestedFileCandidate)
		}

		return nil
	}
}

// PrintLog middleware prints log messages for each request.
func PrintLog(data *Data, w http.ResponseWriter, req *http.Request) (err error) {
	log.Printf("%s %s", req.URL, req.RemoteAddr)
	return
}
