const db = require('./connection');

module.exports={
    createUser: async (user) =>{
        return await db('users').insert(user).returning('id');
    },
    getUserByMail: async (mail)=>{
        let user = await db('users').select().where('email', mail);
        return user[0];
    },
    getUserById: async (id) =>{
        let user = await db('users').select("name", "lastname").where('id', id);
        return user[0];
    }
};