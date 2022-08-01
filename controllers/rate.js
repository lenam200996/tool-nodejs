const moment = require('moment')
var rateModel = require('../db/schemes/rate.scheme')


class rateController {
    constructor(){

    }
    async create(req, res){
        let {key , rateCount , rateFeedback, otherFeedback } = req.body
        console.log(req.headers['user-agent'])
        let dataRate = {
            key,
            rateCount ,
            rateFeedback, 
            otherFeedback: JSON.stringify({
                'user-agent': req.headers['user-agent'],
                otherFeedback
            })
        }

        rateModel.create(dataRate).then(_doc => {
            if(_doc && _doc._id) return res.status(200).send({success: true})
            else return res.status(200).send({error: _doc})
        }).catch(e => {
            res.status(200).send({error: e})
        })
    }
}

const s = new rateController()
module.exports = s