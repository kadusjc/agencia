module.exports = function(app) {

  var fs = require('fs')
  , formidable = require('formidable')
  , Picture =  require('../models').Picture
  , path = require("path")
  , easyimg = require('easyimage');
  

 var defError = {reason: 'unknown_error', message:'Ocorreu um erro ao fazer upload da imagem'};

 var persistImage =  function(foto, croppedFile, res){
     Picture.update(foto, function(foto){
         fs.unlink(croppedFile);
         res.json(foto);
      }, function(err){
        res.json(500, err);
      });
  }; 
  
  
  var PictureController = {

    load: function(req, res) {

      Picture.load(req.params.id, function(contact) {
       res.json(contact);       
      }, function(err) {
        res.json(500, err);
      }
    )},

    uploadFirstImage: function(req, res){
      var form = new formidable.IncomingForm();
      form.encoding = 'utf-8';

      form.parse(req, function (error, fields, files) {
        if(!files){
           res.json(500, defError);
        }
      
        var directory = path.dirname(files.file.path);
		    var filename = path.basename(files.file);
		    var filePath = directory + "/" + filename.toLowerCase();
	 	    fs.renameSync(files.file, filePath);
	 	    
        var croppedFile = directory + '/'+req.session.user.id+'_1.png';
        fs.openSync(croppedFile, 'w');
        
        /*easyimg.crop({
            src: filePath, dst: croppedFile,
            cropwidth:128, cropheight:128,  
            gravity:'North', x:30, y:50
          },
          function(err, stdout, stderr) {
            if(err) res.json(500, defError);          
          }
        );*/
        var options = {
           src:filePath, dst:croppedFile,
           cropwidth:128, cropheight:128,
           gravity:'North', x:30, y:50
        };

        easyimg.crop(options, function(err, stdout, stderr){
           if(!!err) {
      	     defError.message = 'Erro ao cortar imagem';
      	     res.json(500, defError);    
      	   }
      
          var stream = new Buffer(croppedFile).toString('base64');    
          var foto = {
             id_cliente: req.session.user.id,
             foto1: stream
       	  };
          return persistImage(foto, croppedFile, res);
          
        });
        
        
      });//end form.parse
     
    }

  };

  return PictureController;
};
