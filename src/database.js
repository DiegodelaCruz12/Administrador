const mysql=require('mysql');

const{database}=require('./keys');

const pool=mysql.createPool(database);

const {promisify}=require('util');
pool.getConnection((err,connection)=>{
    if(err){
        if(err.code==='PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code==='ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code==='ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
        else{
            console.error(err);
        }
    }
    if(connection)connection.release();
    console.log('DB is CONNECTED');
    return;
});
pool.query = promisify(pool.query);
module.exports=pool;