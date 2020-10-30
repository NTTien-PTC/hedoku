const BlogPost = require('../models/BlogPost.js')
module.exports = (req, res) => {
    BlogPost.findById(req.params.id, function(error, detailpost){
        res.render('post',{
            detailpost
        })
    })  
}