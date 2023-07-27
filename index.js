#!/administrator/bin/env node
const readline = require('node:readline');
const {stdin: input, stdout: output} = require('node:process');
require('dotenv').config();

const http = require('http');
const myAPIKey = process.env.myAPIKey;
const question = "Ведите город в котором хотите узнать погоду: ";


http.createServer((req, res) => {
    res.end("Hello createServer");
}).listen(3000)


let timeout = setTimeout(function tick(){

    const rl = readline.createInterface({ input, output });

    rl.question(question, (answer) => {
        rl.close();
        if(answer !== '')
        {
            const url = 'http://api.weatherstack.com/current?access_key=' + myAPIKey + '&query=' + answer;

            http.get(url, (res) => {
                const {statusCode} = res;

                if(statusCode !== 200){
                    console.log('statusCode: ${statusCode}')
                    return
                }

                res.setEncoding("utf8");
                let rowData = '';
                res.on('data', (chunk) => rowData += chunk);
                res.on('end', () => {
                    let parseDate = JSON.parse(rowData);
                    console.log("температура: " + parseDate.current.temperature);
                }).on('error', (err) => {
                    console.log()
                })
            })

            timeout = setTimeout(tick, 100);
        }else{
            console.log('программа завершила работу потому что вы ей приказали.');
        }
    });
}, 100);

