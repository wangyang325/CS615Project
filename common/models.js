module.exports = {
    user: {
        name: {type: String, required: true},
        password: {type: String, required: true}
    },
    book: {
        ISBN: {type: String, required: true},
        owner: {type: String, required: true},
        title: {type: String, required: true},
        author: {type: String, required: true},
        year: {type: String, required: true},
        abstract: {type: String, required: true},
        metadata: {type: String, required: true},
        shared: {type: Boolean, default: false}
    },
    suggestion: {
        ISBN: {type: String, required: true},
        user: {type: String, required: true},
        comment: {type: String, required: true}
    }
};
