import mongoose from 'mongoose'

const newsDataSchema = mongoose.Schema(
    {
        name: {
            type: String
        },
        url: {
            type: String,
            unique: true
        },
        title: {
            type: String
        },
        description: {
            type: String
        },
        imageUrl: {
            type: String
        },
        dateTime: {
            type: Date
        },
        rootUrlId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'rootUrl'
        },
        status: {
            type: String
        },
        category: {
            type: String
        },
        allData: []
    },
    {
        timestamps: true
    }
)

const newsData = mongoose.model('newsData', newsDataSchema)

export default newsData
