import http from 'http';
import dotenv from 'dotenv';
import {readFileSync, writeFileSync} from 'fs';
import { idGenerate } from './uitility/idGenerator.js';

// enverment confugeration
dotenv.config()
let port = process.env.SERVER_PORT;

// data management
const stu_data = readFileSync('./data.json');
const stu_obj  = JSON.parse(stu_data)



http.createServer((req, res)=>{
    res.writeHead('200', {'content-type' : 'application/json'})
    
    // path and routing
    if (req.url == '/api/students' && req.method == 'GET') {
        res.write(stu_data)
        res.end()
    }else if(req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method == 'GET'){
        let id = req.url.split('/')[3];
        if (stu_obj.some(data => data.id == id)) {
            let singleData = stu_obj.find(data => data.id == id);
            res.write(JSON.stringify(singleData));
            res.end()
        } else {
            res.end(JSON.stringify({
                message : 'Data not found'
            }))
        }
    }else if(req.url == '/api/students' && req.method == 'POST'){
        let data = ''
        req.on('data', (chunk)=>{
            data += chunk.toString();
        })
        res.end('end', ()=>{
            let {name, age, skill, location} = JSON.parse(data);
            console.log();
            stu_obj.push({
                id : idGenerate(stu_obj),
                name : name,
                age : age,
                skill : skill,
                location : location
            })
            writeFileSync('./data.json', JSON.stringify(stu_obj))
            res.end(JSON.stringify({
                message : 'New data added'
            }))
        })
        
    } else if(req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method == 'DELETE'){
        let id = req.url.split('/')[3]
        if (stu_obj.some(data=> data.id == id)) {
            let deletedData = stu_obj.filter(data => data.id != id)
            writeFileSync('./data.json', JSON.stringify(deletedData))
            res.end(JSON.stringify({
                message : 'data deleted successfull'
            }))
        } else {
            res.end(JSON.stringify({
                message : 'Data not exist'
            }))
        }
        
    }else if(req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method == 'PUT' || req.url.match(/\/api\/students\/[0-9]{1,}/) && req.method == 'PATCH'){
        let id = Number(req.url.split('/')[3])
        if (stu_obj.some(data=> data.id == id)) {
            let index = stu_obj.findIndex(data => data.id == id)
            let data = ''
            req.on('data', (chunk)=>{
                data += chunk.toString();
            });
            req.on('end', ()=>{
                let {name, age , skill , location} = JSON.parse(data);
                stu_obj[index] = {
                    id : id,
                    name : name,
                    age   : age,
                    skill : skill,
                    location : location
                }
                writeFileSync('./data.json', JSON.stringify(stu_obj))
            })
            res.end(JSON.stringify({
                alert : 'Data edit successful.'
            }))
        } else {
            res.end(JSON.stringify({
                alert : 'Data not exist!'
            }))
        }
        
    }else {
        res.end(JSON.stringify({
            alert : 'worng route'
        }))
    }

}).listen('5050', ()=>{
    console.log(`server is ronning on port ${port}`);
})