import asyncHanlder from 'express-async-handler'
import async from 'async'

import Post from '../models/feedModel.js'
import Comment from '../models/commentModel.js'

const getCompetitor = asyncHanlder(async (req, res) => {
    console.log('Hello competitor')
    let data = {}
    const pageId = req.params.id
    //let count = await Post.find({ pageId: req.params.id })

    let from = req.query.from ? req.query.from : ''
    let to = req.query.to ? req.query.to : ''

    let postCount = await Post.aggregate([
        {
            $match: {
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: '$pageName',
                count: { $sum: 1 }
            }
        }
    ])

    let commentCount = await Comment.aggregate([
        {
            $match: {
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: '$pageName',
                count: { $sum: 1 }
            }
        }
    ])

    let activityData = []
    for (let i = 0; i < postCount.length; i++) {
        for (let j = 0; j < commentCount.length; j++) {
            if (postCount[i]._id == commentCount[j]._id) {
                // let totalCount = postCount[i].count + commentCount[j].count
                activityData.push({
                    name: postCount[i]._id || commentCount[j]._id,
                    post: postCount[i].count,
                    comment: commentCount[j].count
                })
                break
            }
        }
    }

    data.activityData = activityData

    const sentimenData = await Comment.aggregate([
        {
            $match: {
                sentimentScore: { $ne: 0 },
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: '$pageName',
                sentimentScore: { $avg: '$sentimentScore' }
            }
        },
        {
            $project: {
                _id: 0,
                name: '$_id',
                sentimentScore: 1
            }
        }
    ])

    for (let i = 0; i < sentimenData.length; i++) {
        if (sentimenData[i].sentimentScore >= 0.61) {
            sentimenData[i].icon =
                'https://e7.pngegg.com/pngimages/726/726/png-clipart-smiling-emoji-illustration-emoji-happiness-smiley-sticker-applause-love-heart.png'
        } else if (
            sentimenData[i].sentimentScore >= 0.21 &&
            sentimenData[i].sentimentScore <= 0.6
        ) {
            sentimenData[i].icon =
                'https://icon2.cleanpng.com/20180202/veq/kisspng-emoji-blushing-smiley-clip-art-blushing-emoji-png-hd-5a753fbd3e1a52.2262150515176334692544.jpg'
        } else if (
            sentimenData[i].sentimentScore >= -0.2 &&
            sentimenData[i].sentimentScore <= 0.2
        ) {
            sentimenData[i].icon =
                'https://www.pngfind.com/pngs/m/10-102223_download-slightly-smiling-emoji-icon-emojis-png-ios.png'
        } else if (
            sentimenData[i].sentimentScore >= -0.6 &&
            sentimenData[i].sentimentScore <= -0.21
        ) {
            sentimenData[i].icon =
                'https://www.transparentpng.com/thumb/sad-emoji/Ej7iyi-sad-emoji-cut-out.png'
        } else if (
            sentimenData[i].sentimentScore >= -0.1 &&
            sentimenData[i].sentimentScore <= -0.61
        ) {
            sentimenData[i].icon =
                'https://img.favpng.com/0/25/24/face-with-tears-of-joy-emoji-crying-laughter-sticker-png-favpng-gxKCtgzxBTVc3b4cdSe49qkJd_t.jpg'
        } else {
            sentimenData[i].icon =
                'https://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_630,w_1200,f_auto,q_auto/60063/thinking_emoji_b8fpll.png'
        }
    }

    data.sentimentData = sentimenData

    const trendData = await Comment.aggregate([
        {
            $addFields: {
                date: {
                    $dateFromParts: {
                        year: { $year: '$created_time' },
                        month: { $month: '$created_time' },
                        day: { $dayOfMonth: '$created_time' }
                    }
                }
            }
        },
        {
            $match: {
                date: {
                    $gte: new Date(
                        new Date().getTime() - 90 * 24 * 60 * 60 * 1000
                    )
                }
            }
        },
        {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$date'
                        }
                    },
                    pageName: '$pageName'
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: '$_id.date',
                data: {
                    $push: {
                        pageName: '$_id.pageName',
                        count: '$count'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id',
                data: 1
            }
        },
        {
            $sort: { date: -1 }
        }
    ])

    data.trendData = trendData

    ////////////////what matters most/////////////////////

    const mattersMost = await Comment.aggregate([
        {
            $match: {
                created_time: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        },
        {
            $group: {
                _id: {
                    pageName: '$pageName',
                    topic: '$topic'
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: '$_id.pageName',
                topics: {
                    $push: {
                        name: '$_id.topic',
                        count: '$count'
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                pageName: '$_id',
                topics: 1
            }
        }
    ])

    data.mattersMostData = mattersMost

    res.json(data)
})

export { getCompetitor }
