const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
    host: 'http://localhost:9200'
});

const templateController = {
    recordTemplate: async (req, res) => {
        console.log(req.body)
        let resp;
        try {
            let dbRes = await client.create({
                "index": "template",
                "type": "custom",
                "id": req.body.name,
                "body": {
                    "name": req.body.name,
                    "subject": req.body.subject,
                    "text": req.body.text
                }
            });
            resp = dbRes
        } catch(err) {
            console.log(err);
            resp = err
        }
        res.send(resp);

    },

    get: async(req, res) => {

        let temps = await client.search({
            "index": "template",
            "type": "custom"
        })

        console.log(temps);

        res.send(temps);
    },

    delete: async (req, res) => {
        let del = await client.delete({
            "index": "template",
            "type": "custom",
            "id" : req.body.name
        })
        res.send(del)
    },

    update: async(req, res) => {
        let body = JSON.stringify({doc: req.body})
        try{
        let upd = await client.update({
            "index": "template",
            "type": "custom",
            "id" : req.body.name,
            "body" : body
        })
        res.send(upd);
    } catch(err) {
        console.log(err);
        res.send(err);
    }
        

    }
}

module.exports = templateController;