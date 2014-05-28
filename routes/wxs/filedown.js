var fs = require('fs'),
	uuid = require('node-uuid'),
    request = require('request');

var FILE_PATH = 'fileupload/';

exports.download = function(uri,callback){

  request.head(uri, function(err, res, body){
      var content_type = res.headers['content-type'];
      var filename=gen_file_name(content_type);
      request(uri)
     	.pipe(fs.createWriteStream(FILE_PATH+filename))
     	.on('close',function(err){
          if(err) callback(err);
          callback(null,filename);
      });
  });
}





function gen_file_name(content_type){
  var file_suffix = content_type.substring(content_type.lastIndexOf("/")+1);
  var id = uuid.v1();
  return id + "." + file_suffix;
}
