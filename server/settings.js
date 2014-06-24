module.exports = {
    database: {
        host: 'localhost',
        port: 27017,
        database: 'pro',
        fullPath: function(){
            if(this.port == 27017)
                return 'mongodb://'+this.host+'/'+this.database;
            else
                return 'mongodb://'+this.host+':'+this.port+'/'+this.database;
        }
    },
    server: {
        host: "http://localhost",
        port: 8080,
        fullPath: function(){
            return (this.port == 80)?this.host+'/':this.host+':'+this.port+'/';
        }
    }
};