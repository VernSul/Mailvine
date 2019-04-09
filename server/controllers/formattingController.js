const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const path = require("path");
const csvParser = require('json2csv').Parser;
const emailExistence = require('email-existence');
const dns = require('dns');
const async = require('async');


const formattingController = {

    format : (req, res) => {
        console.log("In format function")
        const input = fs.readFileSync(path.join(__dirname, '../../base.csv'))
        // var input = fs.createReadStreamSync(path.join(__dirname, '../base.csv'));
        var records = parse(input, {columns: true});
        // const i = 2;
        let testArr = [ 21, 34, 41, 99 ]
        const recordsTest = testArr.map(el => {return records[el]}) 
        let nwRecords = [];
        let current;
        let checkArray = [];

        function check(task, callback) {
            
            current = records.indexOf(task)
            task.prenom = task.nomComplet.slice(3).split(task.nom.toString())[0].split(' ').join('');

            if(task.site.includes('/')) task.site = task.site.split('/')[0];
            if(task.site.includes('www')) task.domain = task.site.split('www.')[1];
            else {
                task.domain = task.site;
            }
            task.emailPerso = [];
            let count = 0;

            let check = new Promise((resolve, reject) => {

                
            if(task.domain){
                setTimeout(function(){
                    q.workersList().forEach(el => { if (el.data === task) resolve(task)})
                }, 40000);
                let first = task.prenom.toLowerCase();
                let domain = task.domain.toLowerCase();
                let last = task.nom.toLowerCase();
    
                const comb = [];
                let dom = '@'+domain;
                let composed = false;

                comb.push(first[0]+last);
                comb.push(first[0]+'.'+last);
                comb.push(first);
                comb.push(first+'.'+last);
                comb.push(first+'_'+last);
                comb.push(first+last);
                comb.push(first+last[0]);
                comb.push(first+'.'+last[0]);
                comb.push(first[0]+first[1]+last);
                comb.push(last);
                if(first.includes('-')){
                    comb.push(first[0]+first[first.indexOf('-')+1]+last);
                    comb.push(first[0]+first[first.indexOf('-')+1]+'.'+last);
                    comb.push(first.split('-').join('')+last);
                    comb.push(first.split('-').join('')+'.'+last);
                    composed = true;

                }

                    for(let j = 0; j < comb.length; j++){
                        let adres = comb[j]+dom;
                        emailExistence.check(adres, function(error, response){
                            count++;
                            if(response == true) {
                                task.emailPerso.push(adres);
                            }
                            if(error){
                                task.emailPerso = '';
                                resolve(task);          
                            }
                            if(count > 11 && composed == true) {
                                if(task.emailPerso.length === 12){ 
                                    task.emailPerso = '';
                                    resolve(task);
                                } else {
                                resolve(task);
                                }
                            }
                            if(count > 7 && composed == false) {
                                if(task.emailPerso.length === 8){ 
                                    task.emailPerso = '';
                                    resolve(task);
                                } else {
                                    resolve(task);
                                }
                            }
                        });
                    }         
            }
            else{
                task.emailPerso = '';
                resolve(task);
            }
            
        })
        .then(tk => {
            nwRecords.push(tk);
            checkArray.push(tk.domain);
                let arr = [];
                for(let i = 0; i <= Math.max(...checkArray); i++){
                    if(checkArray.includes(i) === false) arr.push(i);
                }
                // console.log("Array missing nb: ", arr, checkArray.length);
                

            // console.log(records.indexOf(tk), tk.emailPerso);
            
            current = records.indexOf(tk)
            // nwRecords.emailPerso = nwRecords.emailPerso.toString();
            callback();
        })
        }
        let q = async.queue(check, 100)

        q.push(records, (err) => {
            q.workersList().forEach(el => {console.log("Currently : ", el.data.domain);
        });
            console.log("Progress: ", (nwRecords.length/records.length)*100, '%');
            if (err) console.log(err);
    
        })
        q.drain = function() {
            nwRecords.forEach(el => {
                el.emailPerso = el.emailPerso.toString();
            })
            
            const fields = Object.keys(nwRecords[5])
            // records = JSON.stringify(records);
            const json2csvParser = new csvParser({ fields });
            const csv = json2csvParser.parse(nwRecords);
            // console.log("csv: ", csv)
        
            fs.writeFileSync('./nwBase.csv', csv, 'utf8')
            console.log('Finished!')
            res.send("Finished!");
        };
    

        

    },

    

    test : async (req, res) => {
        let domain = req.body.domain;
        console.log(domain)
        await dns.resolveMx(domain, (err, adresses) => {
            if(err) throw Error;
            console.log(adresses);
            res.send(adresses);
        })
        
        
    },

    single : (req, res) => {
            
            console.log(req.body)
            let first = req.body.first;
            let domain = req.body.domain;
            let last = req.body.last;
            let emails = [];

            const comb = [];
            let dom = '@'+domain;
            let count = 0;

            comb.push(first[0]+last);
            comb.push(first[0]+'.'+last);
            comb.push(first[0]+first.slice(1)+'.'+last[0]+last.slice(1));
            comb.push(first);
            comb.push(first+'.'+last);
            comb.push(last+'.'+first);
            comb.push(first+last);
            comb.push(first+'-'+last);
            comb.push(first+'_'+last);
            comb.push(first+'_'+last[0]);
            comb.push(first+last[0]);
            comb.push(first+'.'+last[0]);
            comb.push(last);

            let checkEmail = new Promise((resolve, reject) => {
    

            for(let j = 0; j < comb.length; j++){
                let adres = comb[j]+dom;

                emailExistence.check(adres, function(error, response){
                    count++;
                    console.log(adres, response);
                    if (error) console.log(error);
                    if(response == true) {
                        console.log(adres, ' ', response);
                        emails.push(adres);
                    }
                    if(count === 11) resolve(emails);
            });
        }
    }).then((emails) => {
        console.log(emails);
        res.send(emails)
    })
    }
}

module.exports = formattingController;