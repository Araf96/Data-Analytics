import mongoose from 'mongoose'

const feedSchema = mongoose.Schema({
    coordinates: { type: {}, default: null, default: null },
    created_time: { type: Date, default: null },
    from: { type: {}, default: null },
    id: {
        type: String,
        required: [true, 'Post id is required.'],
        unique: [true, 'Post already exists in database']
    },
    pageId: { type: String, default: null },
    pageName: { type: String, default: null },
    message: { type: String, default: null },
    is_expired: { type: Boolean, default: null },
    is_hidden: { type: Boolean, default: null },
    is_popular: { type: Boolean, default: null },
    is_published: { type: Boolean, default: null },
    instagram_eligibility: { type: String, default: null },
    is_eligible_for_promotion: { type: Boolean, default: null },
    privacy: { type: {}, default: null },
    multi_share_end_card: { type: Boolean, default: null },
    subscribed: { type: Boolean, default: null },
    updated_time: { type: Date, default: null },
    attachments: { type: {}, default: null },
    multi_share_optimized: { type: Boolean, default: null },
    promotable_id: { type: String, default: null },
    promotion_status: { type: String, default: null },
    timeline_visibility: { type: String, default: null },
    cursors: { type: {}, default: null }
})

const Feed = mongoose.model('feed', feedSchema)

export default Feed
