package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/hheld/SmbWebAdmin/db"
	"github.com/hheld/SmbWebAdmin/middleware"
	_ "github.com/hheld/SmbWebAdmin/smbControl"
	"github.com/hheld/SmbWebAdmin/user"
)

func main() {
	defer db.Close()

	flag.Parse()

	// check if an admin user should be created, and if so, if we have all necessary information #######################
	if *createAdminUser == true {
		if adminToBeCreated.UserName != "" && *newAdminPwd != "" {
			if err := user.StoreUserInDb(&adminToBeCreated, *newAdminPwd); err != nil {
				log.Printf("Could not store new admin user in the database: %v\n", err)
				os.Exit(1)
			}

			os.Exit(0)
		}
	}
	// #################################################################################################################

	http.Handle("/", middleware.Handle(nil, middleware.PrintLog, middleware.ServeFilesFromDir("assets")))
	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, res *http.Request) {})

	log.Println("Server is about to listen at port " + *serverPort + ".")

	if err := http.ListenAndServeTLS(":"+*serverPort, "cert.pem", "key.pem", nil); err != nil {
		log.Printf("Could not start server at port %s: %v\n", *serverPort, err)
	}
}
