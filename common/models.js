// *********************************
// ** Collection definition module:
// **   Definition for collections
// *********************************
module.exports = {
    // Collection: users
    user: {
        name: {type: String, required: true},
        password: {type: String, required: true}
    },
    // Collection: books
    book: {
        ISBN: {type: String, required: true},
        owner: {type: String, required: true},
        title: {type: String, required: true},
        author: {type: String, required: true},
        year: {type: String, required: true},
        abstract: {type: String, required: true},
        metadata: {type: String, required: true}                   //topics under which books would fall
    }
};
