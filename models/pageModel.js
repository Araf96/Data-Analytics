import mongoose from 'mongoose'

const PageSchema = mongoose.Schema({
    pageId: {
        type: String,
        required: [true, 'Page ID is missing.'],
        unique: [true, 'Page already exists in database.']
    },
    pageName: {
        type: String,
        required: [true, 'Pagename is missing.']
    },
    pageOwner: {
        type: String,
        default: null
    },
    ownerId: {
        type: String,
        default: null
    },
    ownerName: {
        type: String,
        default: null
    },
    pageURL: {
        type: String,
        required: [true, 'Page link is missing']
    },
    profilePicture: {
        type: String,
        default: null
    },
    addedBy: {
        type: String,
        default: null
    },
    updatedBy: {
        type: String,
        default: null
    },
    creationDate: {
        type: Date,
        default: null
    },
    updateDate: {
        type: Date,
        default: null
    },
    userList: {
        type: Array,
        default: []
    },
    page_access_token: {
        type: String,
        default: null
    },
    category: {
        type: String,
        default: null
    },
    tasks: {
        type: Array,
        default: []
    },
    users: [
        {
            type: String,
            ref: 'User',
            unique: true
        }
    ]
})

const Pages = new mongoose.model('Pages', PageSchema)

export default Pages
