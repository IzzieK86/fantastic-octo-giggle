# API Project: URL Shortener Microservice for freeCodeCamp


### User Stories

1. I can POST a URL to `https://honorable-reindeer.glitch.me//api/shorturl/new` and I will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL , the JSON response will contain an error like `{"error":"invalid URL"}`. 
3. When I visit the shortened URL, it will redirect me to my original link.


#### Creation Example:

POST https://honorable-reindeer.glitch.me/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

https://honorable-reindeer.glitch.me/api/shorturl/3

#### Will redirect to:

[forum.freecodecamp.com](forum.freecodecamp.com)

*by IzzieK86 as a challenge from [freeCodeCamp](freecodecamp.com)*