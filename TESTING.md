# Testing Headers and Authentication

## Test Headers

1. **Test with httpbin.org (echoes back headers)**
   - Method: `GET`
   - URL: `httpbin.org/headers`
   - Headers tab: Add a custom header
     - Key: `X-Custom-Header`
     - Value: `MyCustomValue`
   - Click Send
   - Check "Request" tab to see what was sent
   - Check "Body" tab to see the server echoed your headers

2. **Test with User-Agent**
   - Method: `GET`
   - URL: `httpbin.org/user-agent`
   - Headers tab:
     - Key: `User-Agent`
     - Value: `Stormer API Client v1.0`
   - Click Send

## Test Authentication

### Bearer Token
1. Method: `GET`
2. URL: `httpbin.org/bearer`
3. Auth tab: Select "Bearer Token"
4. Token: `my-secret-token-12345`
5. Click Send
6. Check "Request" tab to verify Authorization header was added

### Basic Auth
1. Method: `GET`
2. URL: `httpbin.org/basic-auth/user/passwd`
3. Auth tab: Select "Basic Auth"
4. Username: `user`
5. Password: `passwd`
6. Click Send
7. Should return 200 with authenticated: true

## Test Query Parameters

1. Method: `GET`
2. URL: `httpbin.org/get`
3. Params tab: Add parameters
   - Key: `page`, Value: `1`
   - Key: `limit`, Value: `10`
4. Click Send
5. Check "Request" tab to see sent params
6. Check response body to see args with your params

## Test Cookies

1. **Test with httpbin.org**
   - Method: `GET`
   - URL: `httpbin.org/cookies`
   - Cookies tab: Add cookies
     - Key: `session_id`, Value: `abc123xyz`
     - Key: `user_token`, Value: `token456`
   - Click Send
   - Check "Request" tab to see sent cookies
   - Check response to see cookies echoed back

2. **Test Cookie Header**
   - Method: `GET`
   - URL: `httpbin.org/headers`
   - Cookies tab:
     - Key: `auth`, Value: `secret123`
   - Click Send
   - In response, look for "Cookie" in headers section

## Test POST with Body

1. Method: `POST`
2. URL: `httpbin.org/post`
3. Body tab: Enter JSON
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "age": 30
   }
   ```
4. Click Send
5. Response will echo back your JSON in the "json" field

## Test Localhost

1. Start a local server (e.g., on port 8080)
2. Method: `GET`
3. URL: `localhost:8080` (or `localhost:8080/api/endpoint`)
4. The app will automatically add `http://` prefix
5. Click Send
