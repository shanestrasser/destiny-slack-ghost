# destiny-slack-ghost
Slack app for getting Destiny stats.

Project is still in progress. Stay tuned for me details.

There are two options for testing: 

1. **Use your local machine.** Follow the guide here: http://www.girliemac.com/slack-httpstatuscats/ for more details.
2. **Using your own server.** More details to follow, but I finally figured this one out. The general idea is
    1. Run your app on a different port (6000)
    2. Configure your .htaccess file to include a subdirectory to be mapped to localhost:6000 
    
        ```
        RewriteEngine On
        RewriteRule ^ghost.io$ http://127.0.0.1:6000/ [P,L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ghost.io(.*)$ http://127.0.0.1:6000/$1 [P,L]
        ```
        
        Here, I've used port 6000 and the subdirectory is ghost.io. To hit the URL from the outside, I only have to hit `mysite.com/ghost.io`. Make sure the port is in a valid range (I had troubles using 3000).



TODO's List:

1. Handle errors from Bungie.net
2. Add command for Grimore
