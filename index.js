var express = require('express');
var app = express();
var lo = require('lodash');
var util = require('util');
var exec = require('child_process').exec;

// Given blog data URL
var command = 'curl --request GET --url https://intent-kit-16.hasura.app/api/rest/blogs --header "x-hasura-admin-secret: 32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"'
class Response {
	constructor (num_blog, longest_title, title_privacy, unique_title){
	   this.num_blog = num_blog;
           this.longest_title = longest_title;
           this.title_privacy =  title_privacy;
           this.unique_title = unique_title;		
	}
}

var blogs
var total_blogs
var title=[]
var num_blog
var longest_title
var words
var privacy_title_count
var unique_title

function fetch_title(blogs){
     console.log("in fetch title")	
     lo.forEach(blogs, function(b) {
	  console.log(b)   
          title.push(b.title);
     });
};

function find_num_blog(title) {
   num_blog = title.length;
   console.log("in size");
   console.log(num_blog);
}

function find_blog_longest_title(title){
	max_len = 0
	lo.forEach(title, function(b) {
	    if (b.length > max_len){
	       longest_title = b;
	       max_len = b.length;	    
	    }
	});

}


function find_privacy_title_count(title){
	count=0
	lo.forEach(title, function(b){
	      var words = lo.words(b);
	      lo.forEach(words, function(x){
		console.log(x)      
	        if (lo.isEqual(x, "Privacy")){
			count++;
		}
	      })
	      	  
	      
	});
	privacy_title_count = count;
};

function find_unique_title(title) {
     unique_title = lo.uniq(title);	
};

function create_json_response(){
     
}

function fetch_blog_data(fetch_cmd) {
   console.log("in function fetch");
  
   child = exec(fetch_cmd, function(error, stdout, stderr){

   //console.log('stdout: ' + stdout);
   //console.log('stderr: ' + stderr);

   if (error !== null) {
      console.log('exec error: ' + error);
      return "";	   
   }

    var blog_json = JSON.parse(stdout);
    var blogs_arr = lo.map(blog_json, function(obj){
        return obj;
    });   	   
    blogs = blogs_arr[0];	   
  });
};


app.use('/api/blog-stats', function(req, res){
    console.log(req.originalUrl);
    fetch_blog_data(command);
    fetch_title(blogs);
    find_num_blog(title);
    find_blog_longest_title(title)
    find_privacy_title_count(title)
    find_unique_title(title)	
    response = new Response(num_blog, longest_title, privacy_title_count, unique_title);
    res.send(response);
});

app.get('/api', function(req, res) {
	res.send("in api call");
});

app.get('*', function(req, res) {
    res.send("bad Resource selected");
});

app.listen(3000)
