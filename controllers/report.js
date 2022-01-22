
const moment = require('moment');
const mongoosePaginate = require ('mongoose-pagination');
const Report = require('../models/report');

async function saveReport(req, res){
    const params = req.body;
     
    if(!params.text) return res.status(200).send({message: 'necesitas enviar texto'});
    const report = Report();
    report.title = params.title;
    report.text = params.text;
    report.user = params.user;
    report.publication= params.publication;
    report.publisher_id = params.publisher_id;
    report.created_at = moment().unix();
    report.reviewed = false;
    

    report.save((err, reportSaved)=>{
        
        if(err) return res.status(500).send({message: 'Error al publicar la report'})
        if(!reportSaved) return res.status(404).send({message: 'la publicacion no ha sido guardada'});
        report.user.password = undefined;
        
        return res.status(200).send({report: reportSaved});
    })
}

function getReports(req, res){
    
    if(req.params.page){
        page= +req.params.page;
        
    }
    
    const itemsPerPage = 10;
        Report.find().sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, reports, total)=>{
            if(err) return res.status(500).send({message: 'error de recibir publicaciones'});
            if(!reports) return res.status(404).send({message: 'no hay publicaciones'});
            reports.forEach(function(publication){
                publication.user.password = undefined;
            })
            
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page: page,
                items_per_page: itemsPerPage,
                reports
            })
        })

    }
module.exports = {
    saveReport,
    getReports
}