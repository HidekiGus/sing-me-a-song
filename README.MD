# ROUTES

### 📮 POST /recommendations

```yml
- Use to create a recommendation

- headers: {}
- body: {
  "name": "example", // Must be a string
  "youtubeLink": "https://www.youtube.com/watch?=example" // Must be a string with a youtube url
}
```

### 📮 POST /recommendations/:id/upvote

```yml
- Use to upvote a recommendation

- headers: {}
- body: {}
```

### 📮 POST /recommendations/:id/downvote

```yml
- Use to downvote a recommendation
- If a recommendation gets a score below -5, it gets deleted

- headers: {}
- body: {}
```

### 🔎 GET /recommendations

```yml
- Use to get last 10 recommendations

- headers: {}
- body: {}
```

### 🔎 GET /recommendations/:id

```yml
- Use to get a specific recommendation

- headers: {}
- body: {}
```

### 🔎 GET /recommendations/random

```yml
- Use to get a random recommendation

- headers: {}
- body: {}
```

### 🔎 GET /recommendations/top/:amount

```yml
- Use to get a specific amount of the top recommendations (ordered by score, higher first)

- headers: {}
- body: {}
```
