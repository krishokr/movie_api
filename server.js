const http = require('http');
const url = require('url');
const fs = require('fs');


http.createServer((request, response) => {
    //getting the url from the user (in the request) using .url
    let addr = request.url;
    //using the .parse method from the url module to parse addr
    let q = url.parse(addr, true);
    let filepath = '';
    console.log(q.pathname);
    if (q.pathname.includes('documentation')) {
        
        filepath = (__dirname + '/documentation.html');
        console.log('pathname includes documentation');
    } else {
        console.log(__dirname);
        filepath = ('index.html');
        console.log('pathname does not include documentation');
    }

    //writing timestamp to .txt file
    fs.appendFile('log.txt', 'URL ' + addr + '\nTimestamp ' + new Date() +'\n\n', (err) => {
        if (err) {
            console.log(error);
        } else {
            console.log('Added to log.');
        }
    });

   
    //using the fs module to read the html file specified above in filepath
    //data is the data from filepath (ex: the html elements written in the html file)
    fs.readFile(filepath, (err, data) => {
        if (err) {
            throw(err);
        }
        
        //specifying what the data is?
        response.writeHead(200, {'Content-Type': 'text/html'});
        //writing the data
        response.write(data);
        //stopping?
        response.end();
    })

}).listen(8080);



