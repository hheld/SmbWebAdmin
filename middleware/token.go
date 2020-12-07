package middleware

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/hheld/SmbWebAdmin/user"
)

// secretString defines a secret string used for token generation. Change that to something only you know!!
const secretString = "putyoursecretstringhere"

func init() {
	http.Handle("/token", Handle(nil, PrintLog, token))
	http.Handle("/logout", Handle(nil, PrintLog, logout))
}

func token(data *Data, w http.ResponseWriter, req *http.Request) (err error) {
	if req.Method != "POST" {
		err = errors.New("Token endpoint only accepts POST requests!")
		return
	}

	var ud = struct {
		UserName string `json:"userName"`
		Password string `json:"password"`
	}{}

	decoder := json.NewDecoder(req.Body)
	decoder.Decode(&ud)

	userInfo, _ := user.GetUser(ud.UserName)
	_, err = user.ValidateUser(userInfo, ud.Password)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		log.Printf("Authorization failed for user '%s' : %s", ud.UserName, err)
		return
	}

	token, id, err := generateToken(userInfo)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Printf("Could not generate token for user '%s': %s", ud.UserName, err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Secure:   true,
		HttpOnly: true,
		Name:     "token",
		Value:    string(token),
		MaxAge:   3600 * 24 * 7,
	})

	mac := hmac.New(sha256.New, []byte(secretString))
	mac.Write([]byte(id))

	http.SetCookie(w, &http.Cookie{
		Secure:   true,
		HttpOnly: false,
		Name:     "Csrf-token",
		Value:    hex.EncodeToString(mac.Sum(nil)),
		MaxAge:   3600 * 24 * 7,
	})

	w.WriteHeader(http.StatusOK)
	return
}

func generateToken(userInfo *user.User) ([]byte, string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := make(jwt.MapClaims)

	claims["exp"] = time.Now().Add(24 * 7 * time.Hour).Unix()
	claims["iat"] = time.Now().Unix()

	id := make([]byte, 32)
	_, err := rand.Read(id)

	if nil != err {
		return nil, "", err
	}

	clientID := hex.EncodeToString(id)

	claims["jti"] = clientID

	claims["userInfo"] = map[string]interface{}{
		"userName":  userInfo.UserName,
		"email":     userInfo.Email,
		"firstName": userInfo.FirstName,
		"lastName":  userInfo.LastName,
		"roles":     strings.Join(userInfo.Roles, ","),
	}

	token.Claims = claims

	tokenString, err := token.SignedString([]byte(secretString))

	return []byte(tokenString), clientID, err
}

func logout(data *Data, w http.ResponseWriter, req *http.Request) (err error) {
	http.SetCookie(w, &http.Cookie{
		Secure:   true,
		HttpOnly: false,
		Name:     "token",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
	})

	return
}
