import asyncHanlder from 'express-async-handler'
import async from 'async'

import Post from '../models/feedModel.js'
import Comment from '../models/commentModel.js'

// @desc    Get Performance
// @route   GET /api/posts/performance/:id
// @access  Private
const getPerformance = asyncHanlder(async (req, res) => {
    let performanceData = {}
    console.log(req.params.id)
    let posts = await Post.find({ pageId: req.params.id })

    // topics
    let talkingAboutTopics = [
        'Others',
        'Appreciation',
        'Complain',
        'Dealership',
        'Queries',
        'Want to order'
    ]
    let perceptionTopics = ['Complain', 'Appreciation']
    let wantsToKnowTopics = ['Price', 'Contact Number', 'Job Seeking', 'Usage']
    let complainTopics = ['Info', 'Gift', 'Price']
    let appreciationTopics = ['Quality', 'Wish', 'Congratulations']
    // topics end

    let from = req.query.from ? req.query.from : ''
    let to = req.query.to ? req.query.to : ''

    // talking about
    let takingAboutData = await Comment.aggregate([
        {
            $match: {
                pageId: req.params.id,
                topic: { $in: talkingAboutTopics },
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: '$topic',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                area: '$_id',
                count: 1
            }
        }
    ])
    performanceData.talkingAbout = takingAboutData
    // talking about end

    // perception
    let perceptionData = await Comment.aggregate([
        {
            $match: {
                pageId: req.params.id,
                topic: { $in: perceptionTopics },
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: '$topic',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                type: '$_id',
                count: 1
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ])

    // let totalAppreciation = 0
    // let totalComplain = 0
    // for (let i = 0; i < perceptionData.length; i++) {
    //     if (perceptionData[i].area === 'Appreciation') {
    //         totalAppreciation = perceptionData[i].count
    //     } else if (perceptionData[i].area === 'Complain') {
    //         totalComplain = perceptionData[i].count
    //     }
    // }

    // let totalComments = await Comment.count({})
    // totalAppreciation = (totalAppreciation * 100) / totalComments
    // totalComplain = (totalComplain * 100) / totalComments
    // performanceData.perception = [
    //     {
    //         type: 'Appreciation',
    //         count: totalAppreciation
    //     },
    //     {
    //         type: 'Complain',
    //         count: totalComplain
    //     }
    // ]
    performanceData.perception = perceptionData
    // perception end

    // wants to know
    let wantsToKnowData = await Comment.aggregate([
        {
            $match: {
                pageId: req.params.id,
                subTopic: { $in: wantsToKnowTopics },
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: '$topic',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                topic: '$_id',
                count: 1
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ])
    performanceData.wantsToKnow = wantsToKnowData
    // wants to know end

    // complain
    let complainData = await Comment.aggregate([
        {
            $match: {
                pageId: req.params.id,
                subTopic: { $in: complainTopics },
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: '$topic',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                type: '$_id',
                count: 1
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ])
    performanceData.complain = complainData
    // complain end

    // appreciation
    let appreciationData = await Comment.aggregate([
        {
            $match: {
                pageId: req.params.id,
                subTopic: { $in: appreciationTopics },
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: '$topic',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                type: '$_id',
                count: 1
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ])
    performanceData.appreciation = appreciationData
    // appreciation end

    // top three posts
    let comments = await Comment.aggregate([
        {
            $match: {
                pageId: req.params.id,
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: '$postId',
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]).limit(4)

    for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < comments.length; j++) {
            if (posts[i].id === comments[j]._id) {
                comments[j].pageName = posts[i].pageName
                comments[j].message = posts[i].message
                comments[j].pageId = posts[i].pageId
                comments[j].url = `https://www.facebook.com/${posts[i].id}`
            }
        }
    }
    performanceData.topThreePosts = comments
    // top three posts end
    //console.log(comments)
    // public sentiment
    let publicSentimentData = await Comment.aggregate([
        {
            $match: {
                pageId: req.params.id,
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        {
                            $and: [
                                { $gte: ['$sentimentScore', 0.61] },
                                { $lte: ['$sentimentScore', 1] }
                            ]
                        },
                        'Very Happy',
                        {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ['$sentimentScore', 0.21] },
                                        { $lte: ['$sentimentScore', 0.6] }
                                    ]
                                },
                                'Happy',
                                {
                                    $cond: [
                                        {
                                            $and: [
                                                {
                                                    $gte: [
                                                        '$sentimentScore',
                                                        -0.2
                                                    ]
                                                },
                                                {
                                                    $lte: [
                                                        '$sentimentScore',
                                                        0.2
                                                    ]
                                                }
                                            ]
                                        },
                                        'Neutral',
                                        {
                                            $cond: [
                                                {
                                                    $and: [
                                                        {
                                                            $gte: [
                                                                '$sentimentScore',
                                                                -0.6
                                                            ]
                                                        },
                                                        {
                                                            $lte: [
                                                                '$sentimentScore',
                                                                -0.21
                                                            ]
                                                        }
                                                    ]
                                                },
                                                'Sad',
                                                {
                                                    $cond: [
                                                        {
                                                            $and: [
                                                                {
                                                                    $gte: [
                                                                        '$sentimentScore',
                                                                        -1
                                                                    ]
                                                                },
                                                                {
                                                                    $lte: [
                                                                        '$sentimentScore',
                                                                        -0.61
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        'Very Sad',
                                                        'Unknown'
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                sentiment: '$_id',
                count: 1
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ])

    for (let i = 0; i < publicSentimentData.length; i++) {
        if (publicSentimentData[i].sentiment === 'Very Happy') {
            publicSentimentData[i].logo = {
                src: 'https://e7.pngegg.com/pngimages/726/726/png-clipart-smiling-emoji-illustration-emoji-happiness-smiley-sticker-applause-love-heart.png'
            }
        } else if (publicSentimentData[i].sentiment === 'Happy') {
            publicSentimentData[i].logo = {
                src: 'https://icon2.cleanpng.com/20180202/veq/kisspng-emoji-blushing-smiley-clip-art-blushing-emoji-png-hd-5a753fbd3e1a52.2262150515176334692544.jpg'
            }
        } else if (publicSentimentData[i].sentiment === 'Neutral') {
            publicSentimentData[i].logo = {
                src: 'https://www.pngfind.com/pngs/m/10-102223_download-slightly-smiling-emoji-icon-emojis-png-ios.png'
            }
        } else if (publicSentimentData[i].sentiment === 'Sad') {
            publicSentimentData[i].logo = {
                src: 'https://www.transparentpng.com/thumb/sad-emoji/Ej7iyi-sad-emoji-cut-out.png'
            }
        } else if (publicSentimentData[i].sentiment === 'Very Sad') {
            publicSentimentData[i].logo = {
                src: 'https://img.favpng.com/0/25/24/face-with-tears-of-joy-emoji-crying-laughter-sticker-png-favpng-gxKCtgzxBTVc3b4cdSe49qkJd_t.jpg'
            }
        } else if (publicSentimentData[i].sentiment === 'Unknown') {
            publicSentimentData[i].logo = {
                src: 'https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_630,w_1200,f_auto,q_auto/60063/thinking_emoji_b8fpll.png'
            }
        }
    }
    performanceData.publicSentiment = publicSentimentData
    // public sentiment end

    // post topic start
    let topicData = []
    let postData = []

    const sendData = () => {
        performanceData.postTopics = { topicData, postData }
        res.json(performanceData)
    }
    ////keep this one at the end of the code or use promise to avoid issues -- Arafat
    async.forEachOfSeries(
        comments,
        async (comment, i, callback) => {
            let td = await Comment.aggregate([
                {
                    $match: {
                        postId: comment._id,
                        created_time: {
                            $gte: new Date(from),
                            $lte: new Date(to)
                        }
                    }
                },
                {
                    $group: {
                        _id: '$topic',
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        topic: '$_id',
                        count: 1,
                        name: 1
                    }
                }
            ])
            for (let j = 0; j < td.length; j++) {
                td[j].name = td[j].topic + '(' + td[j].count + ')'
            }
            topicData.push(td)
            postData.push({
                message: comment.message,
                url: `https://www.facebook.com/${comment._id}`
            })
        },
        sendData
    )
    // post topic end
})

export { getPerformance }
