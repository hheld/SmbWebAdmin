package smbControl

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os/exec"

	"github.com/hheld/SmbWebAdmin/db"
	"github.com/hheld/SmbWebAdmin/middleware"
)

const smbControlCollection = "smbControl"

func init() {
	http.Handle("/api/changeSmbPwd", middleware.Handle(nil, middleware.PrintLog, changeSmbPwd))
	http.Handle("/api/setLocalShareForVerification", middleware.Handle(&middleware.Data{}, middleware.PrintLog, middleware.EnsureAuthentication, setLocalShareFromAPI))
	http.Handle("/api/localShareForVerification", middleware.Handle(&middleware.Data{}, middleware.PrintLog, middleware.EnsureAuthentication, localShareFromAPI))

	if err := db.CreateCollection(smbControlCollection); err != nil {
		panic("Could not create collection '" + smbControlCollection + "' in the database.")
	}
}

func changeSmbPwd(data *middleware.Data, w http.ResponseWriter, req *http.Request) error {
	if req.Method != "POST" {
		return errors.New("Change smb user password endpoint only accepts POST requests!")
	}

	var postData = struct {
		UserName    string
		CurrentPwd  string
		NewPassword string
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&postData)

	if ok := VerifyPassword(postData.UserName, postData.CurrentPwd); ok == false {
		w.WriteHeader(http.StatusBadRequest)
		return errors.New("The given password does not match the given user. Could not change the password!")
	}

	err := ChangePassword(postData.UserName, postData.NewPassword)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return err
	}

	return nil
}

func setLocalShareFromAPI(data *middleware.Data, w http.ResponseWriter, req *http.Request) error {
	if req.Method != "POST" {
		return errors.New("Set local share for smb user pwd verification endpoint only accepts POST requests!")
	}

	var postData = struct {
		LocalShare string
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&postData)

	return SetLocalShareForPwdVerification(postData.LocalShare)
}

func localShareFromAPI(data *middleware.Data, w http.ResponseWriter, req *http.Request) error {
	if req.Method != "GET" {
		return errors.New("Local share for smb user pwd verification endpoint only accepts GET requests!")
	}

	localShare, err := LocalShareForPwdVerification()

	if err != nil {
		return err
	}

	var shareInfo = struct {
		LocalShare string
	}{
		LocalShare: localShare,
	}

	return json.NewEncoder(w).Encode(shareInfo)
}

// SetLocalShareForPwdVerification stores a given local share in the database that is then used toverify a user's password.
func SetLocalShareForPwdVerification(localShare string) error {
	return db.AddDataToCollection(smbControlCollection, []byte("pwdVerifyShare"), []byte(localShare))
}

// LocalShareForPwdVerification returns the local share stored in the database that is to be used to verify users' passwords.
func LocalShareForPwdVerification() (localShare string, err error) {
	rawData, err := db.GetDataFromCollection(smbControlCollection, []byte("pwdVerifyShare"))

	if err != nil {
		return
	}

	localShare = string(rawData)

	return
}

// VerifyPassword verifies if the given user's password for the samba server is actually the one given by password.
func VerifyPassword(userName, password string) bool {
	localShare, err := LocalShareForPwdVerification()

	if err != nil {
		return false
	}

	cmd := exec.Command("smbclient", "//localhost/"+localShare, "-U", userName, "-c", "exit")

	var outbuf bytes.Buffer
	cmd.Stdout = &outbuf

	stdin, _ := cmd.StdinPipe()

	cmd.Start()

	stdin.Write([]byte(password))
	stdin.Close()

	err = cmd.Wait()

	output := outbuf.String()

	log.Printf("Output of password verification: %s\n.", output)

	return err == nil
}

// ChangePassword changes a given samba user's password.
func ChangePassword(userName, pwd string) (err error) {
	cmd := exec.Command("smbpasswd", userName)

	stdin, err := cmd.StdinPipe()

	cmd.Start()

	stdin.Write([]byte(pwd + "\n"))
	stdin.Write([]byte(pwd + "\n"))

	err = stdin.Close()

	if err != nil {
		return
	}

	err = cmd.Wait()

	return
}
