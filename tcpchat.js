var net = require('net'),
    chatServer = net.createServer(),
    clientList = [];

chatServer.on('connection', function(client){
    client.name = client.remoteAddress + ':' + client.remotePort;
    client.write('Hi ' + client.name + ' !\n');

    console.log(client.name + ' joined!\n');

    clientList.push(client);

    client.on('data', function(data){
        broadcast(data, client);
    });

    client.on('end', function(){
        console.log(client.name + ' quit!\n');
        clientList.splice(clientList.indexOf(client), 1);
    });

    client.on('error', function(e){
        console.log(e);
    });
});

function broadcast(message, client){
    var cleanup = [];

    for(var i = 0, n = clientList.length; i < n; i++){
        if(client !== clientList[i]){
            if(clientList[i].writable){
                clientList[i].write(client.name + ' says ' + message +'\r\n');
            }else{
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
    }

    for(i = 0, n = cleanup.length; i < n; i++){
        clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }
}

chatServer.listen(9000);