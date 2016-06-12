package middleware

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
)

// EnsureAuthentication returns a middleware that ensures that an url is secured. Only those users that have a token
// signed with the specified secret string may access such an end point.
func EnsureAuthentication(data *Data, w http.ResponseWriter, req *http.Request) (err error) {
	tokenStr, err := req.Cookie("token")

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	token, err := jwt.Parse(tokenStr.Value, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Signing method for token doesn't match: " + token.Header["alg"].(string))
		}

		return []byte(secretString), nil
	})

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if token == nil {
		err = errors.New("No authorization token specified!")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if !token.Valid {
		err = errors.New("Token is not valid!")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if int64(token.Claims["exp"].(float64)) < time.Now().Unix() {
		err = errors.New("Token expired!")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// protect from CSRF ###############################################################################################
	jti := token.Claims["jti"]

	mac := hmac.New(sha256.New, []byte(secretString))
	mac.Write([]byte(jti.(string)))
	expectedMAC := mac.Sum(nil)
	xsrfToken, err := hex.DecodeString(req.Header.Get("X-Csrf-Token"))

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if !hmac.Equal(xsrfToken, expectedMAC) {
		err = errors.New("XSRF token is invalid")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	// #################################################################################################################

	data.UserName = token.Claims["userInfo"].(map[string]interface{})["userName"].(string)

	return
}
