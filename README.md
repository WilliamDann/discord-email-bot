# Discord Email Bot
Send the newest email from an inbox to a discord channel. 

### config.json
The bot uses a json file to store configuration information. Below are their configurable paramenters:

| parameter   |      description                    |  type   |
|-------------|:------------------------------------|:--------|
| user        | The email address to get email from | string  |
| password    | The password of that email          | string  |
| host        | The imap host for the email service (i.e. 'imap.gmail.com') | string |
| port        | Mail port of the host               | Number  |
| tls         | If a TLS connection should be used  | Boolean |
| token       | The discord bot token               | Boolean |
| channel     | The id for the channel to send to    | string  |
