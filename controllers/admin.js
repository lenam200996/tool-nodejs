const moment = require('moment')
var adminModel = require('../db/schemes/admin.scheme')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
class adminController {
    constructor(){

    }
    async login(req, res){
        let {email , password} = req.body
        let hash_pass = crypto.createHash('md5').update(password).digest("hex")
        adminModel.findOne({email, password: hash_pass}).then(doc => {
            if(doc && doc._id) {
                let token = jwt.sign({ email: email,type: doc.type, active: doc.active, _id: doc._id}, 'namlv200996')
                // generate jwt token
                return res.send({
                    success:true,
                    email,
                    token
                    //jwt
                })
            }
            return res.send({
                error: doc || "INVALID"
            })
        })

    }
    register(req , res){
        let {email , password , secretkey} = req.body
        if(secretkey !== 'namlv200996')  res.send({error: 'NO_PERMISSION'})
        let adminData = {
            password: crypto.createHash('md5').update(password).digest("hex"),
            email, 
            type: 1,
            active:  1,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        adminModel.create(adminData).then(doc => {
            if(doc && doc._id) return res.send({success: true , email})
            return res.send({error: doc})
        })
    }
}

const s = new adminController()
module.exports = s