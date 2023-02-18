import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    id: { type: String, default: null },
    postId: { type: String, default: null },
    pageId: { type: String, default: null },
    pageName: { type: String, default: null },
    can_comment: { type: Boolean, default: null },
    can_hide: { type: Boolean, default: null },
    can_like: { type: Boolean, default: null },
    application: { type: {}, default: null },
    comment_count: { type: Number, default: null },
    created_time: { type: Date, default: null },
    is_hidden: { type: Boolean, default: null },
    is_private: { type: Boolean, default: null },
    like_count: { type: Number, default: null },
    message: { type: String, default: null },
    user_likes: { type: Boolean, default: null },
    permalink_url: { type: String, default: null },
    attachment: { type: {}, default: null },
    can_remove: { type: Boolean, default: null },
    type: { type: String, required: [true, 'Type field is required'] },
    translation: { type: {}, default: null },
    sentimentScore: { type: Number, default: null },
    sentimentAnalysis: { type: {}, default: null },
    topic: { type: String, default: null },
    subTopic: { type: String, default: null },
    from: { type: {}, default: null },
    fromId: { type: String, default: null },
    fromName: { type: String, default: null }
})

commentSchema.index({ created_time: 1, message: 1 }, { unique: true })

const Comment = mongoose.model('comments', commentSchema)

export default Comment
