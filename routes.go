package main

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/hheld/SmbWebAdmin/middleware"
	"github.com/hheld/SmbWebAdmin/user"
)

func init() {
	http.Handle("/api/userInfo", middleware.Handle(&middleware.Data{}, middleware.PrintLog, middleware.EnsureAuthentication, userInfo))
	http.Handle("/api/getUser", middleware.Handle(&middleware.Data{}, middleware.PrintLog, middleware.EnsureAuthentication, getUser))
	http.Handle("/api/allUsers", middleware.Handle(&middleware.Data{}, middleware.PrintLog, middleware.EnsureAuthentication, allUsers))
	http.Handle("/api/deleteUser", middleware.Handle(&middleware.Data{}, middleware.PrintLog, middleware.EnsureAuthentication, deleteUser))
	http.Handle("/api/updateUser", middleware.Handle(&middleware.Data{}, middleware.PrintLog, middleware.EnsureAuthentication, updateUser))
	http.Handle("/api/changePwd", middleware.Handle(&middleware.Data{}, middleware.PrintLog, middleware.EnsureAuthentication, changePwd))
	http.Handle("/api/addUser", middleware.Handle(&middleware.Data{}, middleware.PrintLog, middleware.EnsureAuthentication, addUser))
}

func userInfo(data *middleware.Data, w http.ResponseWriter, req *http.Request) (err error) {
	if req.Method != "GET" {
		return errors.New("User info endpoint only accepts GET requests!")
	}

	userInfo, err := user.GetUser(data.UserName)

	if err != nil {
		return
	}

	return json.NewEncoder(w).Encode(userInfo)
}

func getUser(data *middleware.Data, w http.ResponseWriter, req *http.Request) (err error) {
	if req.Method != "GET" {
		return errors.New("Getuser endpoint only accepts GET requests!")
	}

	q := req.URL.Query()

	user, err := user.GetUser(q.Get("userName"))

	if err != nil {
		return
	}

	return json.NewEncoder(w).Encode(user)
}

func allUsers(data *middleware.Data, w http.ResponseWriter, req *http.Request) (err error) {
	if req.Method != "GET" {
		return errors.New("All users endpoint only accepts GET requests!")
	}

	users, err := user.GetAllUsersInDb()

	if err != nil {
		return
	}

	return json.NewEncoder(w).Encode(users)
}

func deleteUser(data *middleware.Data, w http.ResponseWriter, req *http.Request) (err error) {
	if req.Method != "POST" {
		return errors.New("Delete user endpoint only accepts POST requests!")
	}

	var ud = struct {
		UserName string
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&ud)

	return user.DeleteUser(ud.UserName)
}

func updateUser(data *middleware.Data, w http.ResponseWriter, req *http.Request) (err error) {
	if req.Method != "POST" {
		return errors.New("Update user endpoint only accepts POST requests!")
	}

	userData := struct {
		OldData user.User
		NewData user.User
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&userData)

	return user.UpdateData(&userData.OldData, &userData.NewData)
}

func changePwd(data *middleware.Data, w http.ResponseWriter, req *http.Request) (err error) {
	if req.Method != "POST" {
		return errors.New("Update password endpoint only accepts POST requests!")
	}

	pwdData := struct {
		UserName   string
		NewPwd     string
		CurrentPwd string
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&pwdData)

	err = user.ChangePassword(pwdData.UserName, pwdData.CurrentPwd, pwdData.NewPwd)

	json.NewEncoder(w).Encode(struct {
		Success bool
	}{
		Success: err == nil,
	})

	return
}

func addUser(data *middleware.Data, w http.ResponseWriter, req *http.Request) (err error) {
	if req.Method != "POST" {
		return errors.New("Add user endpoint only accepts POST requests!")
	}

	userData := struct {
		User     user.User
		Password string
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&userData)

	return user.StoreUserInDb(&userData.User, userData.Password)
}
