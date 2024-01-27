# API (request - response) :

## Users End point:

### Register new user --> "/api/v1/users/signup"

Resquest body: POST

```json
{
    // REQUIRED
    "firstname": "user",
    "email": "user@gmail.com",
    "password1": "user123",
    "password2": "user123",

    // OPTIONAL
    "lastname": "last-name",
    "status": "user-status",
    "role": "user-role"
}
```

Responses:<br/>

<p style=color:green>Success:</p>
StatusCode - 201

```json
{
    "firstname": "user",
    "email": "user@email.com",
    "accessToken": "access-token",
    "refreshToken": "refresh-token"
}
```

<p style=color:red>Failed:</p>

StatusCode - 411

```json
{
    "message": "Invalid inputs!!"
}
```

StatusCode - 411

```json
{
    "message": "Passwords does not match!!"
}
```

StatusCode - 411

```json
{
    "message": "User already exists with this email, please login!!"
}
```

### Login user --> "/api/v1/users/login"

Resquest body: POST

```json
{
    "email": "user@gmail.com",
    "password": "user123"
}
```

Responses:<br/>

<p style=color:green>Success:</p>
StatusCode - 200

```json
{
    "firstname": "user",
    "email": "user@email.com",
    "accessToken": "access-token",
    "refreshToken": "refresh-token"
}
```

<p style=color:red>Failed:</p>

StatusCode - 411

```json
{
    "message": "Invalid inputs!!"
}
```

StatusCode - 411

```json
{
    "message": "User not found with this email, please register!!"
}
```

StatusCode - 411

```json
{
    "message": "Invalid password!!"
}
```
