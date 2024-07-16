var Discord  = require('discord.js');
var Imap     = require('imap'),
    inspect  = require('util').inspect;
var fs       = require('fs');


var config = JSON.parse(fs.readFileSync('config.json'));
var imap = new Imap({
    user: config.user,
    password: config.password,
    host: config.host,
    port: config.port,
    tls: config.tls
});

const bot = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages
]})
bot.login(config.token);

function openInbox(callback) {
    imap.openBox('INBOX', true, callback);
}
  
// Send the newest message to discord
function sendNewest() {
    openInbox(function(err, box) {
        if (err) throw err;

        var f = imap.seq.fetch(box.messages.total + ':*', {
            id: 1,
            bodies: ['HEADER.FIELDS (FROM, SUBJECT)', '1'],
            struct: true
        })

        f.on('message', (message, index) => {
            message.on('body', (stream, info) => {
                var buffer = '', count = 0;
                var prefix = '(#' + index + ') ';

                stream.on('data', function(chunk) {
                    count += chunk.length;
                    buffer += chunk.toString('utf8');
                    console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
                });

                stream.once('end', function() {
                    var channel = bot.channels.get(config.channel); // announcments channel
                    channel.send(buffer);
                    console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                });

            });
        });
        
        f.once('error', function(err) {
            console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
            console.log('Done fetching all messages!');
            // imap.end();
        });
    });

}

imap.once('ready', function() {
    imap.on('mail', mail => {
        sendNewest();
    });

    sendNewest();
});

imap.connect();
