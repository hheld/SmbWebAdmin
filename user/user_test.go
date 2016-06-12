package user

import (
	"log"
	"os"
	"reflect"
	"testing"
)

var u = User{
	FirstName: "Test",
	LastName:  "User",
	UserName:  "tuser",
	Email:     "test@user.com",
	Roles:     []string{"admin", "user", "test"},
}

func TestAddGetDeleteUser(t *testing.T) {
	err := StoreUserInDb(&u, "pwd")

	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	ui, err := GetUser(u.UserName)

	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	if reflect.DeepEqual(u, *ui) == false {
		t.Error(
			"For", u,
			"expected", u,
			"got", *ui,
		)
	}

	err = DeleteUser(u.UserName)

	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	ui, err = GetUser(u.UserName)

	if err.Error() != "EOF" {
		log.Println(err)
		t.FailNow()
	}

	if ui != nil {
		t.Error(
			"After deleting", u,
			"expected", nil,
			"got", ui,
		)
	}
}

func TestChangeUserData(t *testing.T) {
	err := StoreUserInDb(&u, "pwd")

	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	// change everything but user name
	var u2 = User{
		FirstName: "Test2",
		LastName:  "User2",
		UserName:  "tuser",
		Email:     "test@user.com2",
		Roles:     []string{"admin2", "user2", "test2"},
	}

	err = UpdateData(&u, &u2)

	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	ui, err := GetUser(u.UserName)

	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	if reflect.DeepEqual(u2, *ui) == false {
		t.Error(
			"After updating", u,
			"expected", u2,
			"got", *ui,
		)
	}

	// change user name
	u2.UserName = "tuser2"

	err = UpdateData(&u, &u2)

	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	ui, err = GetUser(u.UserName)

	if err.Error() != "EOF" {
		log.Println(err)
		t.FailNow()
	}

	if ui != nil {
		t.Error(
			"After updating", u,
			"expected", nil,
			"got", ui,
		)
	}

	ui, err = GetUser(u2.UserName)

	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	if reflect.DeepEqual(u2, *ui) == false {
		t.Error(
			"After updating", u,
			"expected", u2,
			"got", *ui,
		)
	}

	err = DeleteUser(u2.UserName)

	if err != nil {
		log.Println(err)
		t.FailNow()
	}
}

func TestValidateAndChangePassword(t *testing.T) {
	err := StoreUserInDb(&u, "pwd")

	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	ok, err := ValidateUser(&u, "pwd")

	if ok != true || err != nil {
		t.Error(
			"For user with password", "pwd",
			"expected validation with 'pwd' to be", true,
			"got", ok,
		)
	}

	notOk, err := ValidateUser(&u, "wrongPwd")

	if notOk != false || err == nil {
		t.Error(
			"For user with password", "pwd",
			"expected validation with 'wrongPwd' to be", false,
			"got", notOk,
		)
	}
}

func TestMain(m *testing.M) {
	log.SetFlags(log.Lshortfile)

	res := m.Run()

	os.Remove("data.db")

	os.Exit(res)
}
