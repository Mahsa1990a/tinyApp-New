
- 1. GET "/" : show home page ("Hello")
- 2. GET "/urls" : define my templateVar with key of urls, of urlDatabase, which render to urls-new (show me shorURL, longURL, edit and delete)
- 3. GET "/urls/new" : render to urls-new(creat TinyURL, Enter a URL)
- 4. GET "/urls/:shortURL" : render to 'urls_show' (TinyURL for: longURL, short URL: shortURL, New URL: submit)
- 4-1. POST "/login" : set cookie name "username" to the value submit with form on browser and redirect to "/urls"
- 4-2. POST '/logout' : delete username and redirect to '/urls'
- 5. POST "/urls" : when we go to urls/new => we Enter a NEW URL and submit, it gives info(URL) and redirect it to "`/urls/${shortURL}`"

- 6. POST(delete) "/urls/:shortURL/delete" :
when we go to /urls we can delete urlDatabase[shortURL] and redirect to same /urls

- 7. POST(edit) "/urls/:shortURL" : when we go to /urls we can edit urlDatabase[shortURL] = longURL(updating longURLs) and redirect to same /urls

- 8. GET "/u/:shortURL" : which is : http://localhost:8080/u/b2xVn2 redirect it to : http://www.lighthouselabs.ca

- 9. GET "/urls.json" : give back json obj of urlDatabase

- 10. GET "/hello" will show html Hello World!

- 11. Listening to port
