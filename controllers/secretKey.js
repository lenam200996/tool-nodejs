const moment = require('moment')
var keyModel = require('../db/schemes/secretKey.scheme')
var crypto = require('crypto')
const KEY_TYPES = ['1m', '3m', '6m' , '12m']
const UPDATE_FIELDS = ['type', 'status']
async function generateToken(){
    return new Promise((resolve, reject) => {
        crypto.randomBytes(48, async function(err, buffer) {
            var token = buffer.toString('hex');
            let _doc = await keyModel.findOne({key : token})
            if(_doc && _doc._id) return await generateToken()
            else resolve(token)
        })
    })
    
}

class secretKeyController {
    constructor(){

    }

    async detail(req, res){
        let {key} = req.body
        let doc = await keyModel.findOne({key})
        return res.send({doc})
    }
    async create(req, res){
        let {type} = req.body
        if(KEY_TYPES.indexOf(type) == -1) return res.status(400).send({error: 'TYPE_INVALID'})
        let now = moment()
        let token = await generateToken()
        let keyData = {
            key: token,
            type ,
            createdAt: now,
            updatedAt: now,
            status: 0, 
            expiredTime: now.add(1, 'M')
        }
        let keyDoc = new keyModel(keyData)
        keyDoc.save().then(_doc => {
            res.status(200).send({success:true , token: _doc.key})
        }).catch(e => {
            res.status(200).send({error: 'SAVE_ERROR' , message: e})
        })
        
    }
    async update (req , res ){
        let {_id , update } = req.body
        if(!_id) return res.status(200).send({error: "INPUT_INVALID"})
        let dataUpdate = {

        }
        UPDATE_FIELDS.forEach(field => {
            if(update.hasOwnProperty(field)) dataUpdate[field] = update[field]
        })

        keyModel.updateOne({_id}, dataUpdate).then(_result => {
            res.status(200).send({success: true, updated: _result})
        }).catch(e =>{
            res.status(200).send({error: 'UPDATE_ERROR', message: e})
        })
    }

    async verify(req , res){
        let {key} = req.body
        console.log(req.headers['user-agent'])
        let doc = await keyModel.findOne({key})
        if(!doc || !doc._id) return res.status(200).send({error: "SECRET_KEY_INVALID"})
        if(doc.status == 0)  return res.status(200).send({error: "SECRET_KEY_NOT_ACTIVE"})
        if(new Date(doc.expiredTime).getTime() <= Date.now()) return res.status(200).send({error: 'SECRET_KEY_EXPIRED'})
        return res.status(200).send({
            key, 
            expiredTime : doc.expiredTime,
            type: doc.type
        })
    }
}

const s = new secretKeyController()
module.exports = s