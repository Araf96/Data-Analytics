import asyncHanlder from 'express-async-handler'
import NewsData from '../models/newsDataModel.js'

// @desc    Get News
// @route   GET /api/news/:id
// @access  Private
const getNewsData = asyncHanlder(async (req, res) => {
    const id = req.params.id
    const names = []
    let allData = {}

    if (id === '730393906972869') {
        names.push('Prothomalo')
        names.push('Planning Division')
    }
    allData.govtProjectNews = await NewsData.find({
        // description: { $regex: /ব্রিজ/ },
        title: { $regex: /ব্রিজ/ },
        imageUrl: { $ne: '' }
    }).sort({ dateTime: -1 })
    allData.ecnecNews = await NewsData.find({
        category: 'Other',
        allData: { $exists: false }
    }).sort({ dateTime: -1 })

    allData.constructionNews = await NewsData.find({
        // description: { $regex: /নির্মাণ/ },
        title: { $regex: /নির্মাণ/ },
        imageUrl: { $ne: '' }
    }).sort({ dateTime: -1 })

    allData.cementNews = await NewsData.find({
        // description: { $regex: /সিমেন্ট/ },
        title: { $regex: /সিমেন্ট/ },
        imageUrl: { $ne: '' }
    }).sort({ dateTime: -1 })

    let latestNeswData = [
        {
            topic: 'Govt Project',
            date: '2022-09-29T00:00:00.000Z',
            count: 4
        },
        {
            topic: 'Govt Project',
            date: '2022-09-30T00:00:00.000Z',
            count: 1
        },
        {
            topic: 'Govt Project',
            date: '2022-10-02T00:00:00.000Z',
            count: 2
        },
        {
            topic: 'Govt Project',
            date: '2022-10-06T00:00:00.000Z',
            count: 3
        },
        {
            topic: 'Govt Project',
            date: '2022-10-09T00:00:00.000Z',
            count: 3
        },
        {
            topic: 'Govt Project',
            date: '2022-10-10T00:00:00.000Z',
            count: 2
        },
        {
            topic: 'Govt Project',
            date: '2022-10-14T00:00:00.000Z',
            count: 1
        },
        {
            topic: 'Govt Project',
            date: '2022-10-15T00:00:00.000Z',
            count: 1
        },
        {
            topic: 'Govt Project',
            date: '2022-10-16T00:00:00.000Z',
            count: 3
        },
        {
            topic: 'Govt Project',
            date: '2022-10-17T00:00:00.000Z',
            count: 2
        },
        {
            topic: 'Govt Project',
            date: '2022-10-18T00:00:00.000Z',
            count: 1
        },
        {
            topic: 'Govt Project',
            date: '2022-10-20T00:00:00.000Z',
            count: 2
        }
    ]

    // let from = req.query.from ? req.query.from : ''
    // let to = req.query.to ? req.query.to : ''
    // if (to) {
    //     let date = new Date(to)
    //     date.setDate(date.getDate() + 1)
    //     to = date
    // }

    // allData.latestNeswData = latestNeswData

    allData.latestNeswData = await NewsData.aggregate([
        {
            $match: {
                title: {
                    $regex: 'ব্রিজ|নির্মাণ|সিমেন্ট'
                }
            }
        },
        {
            $addFields: {
                topic: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $regexMatch: {
                                        input: '$title',
                                        regex: 'ব্রিজ'
                                    }
                                },
                                then: 'Govt Project'
                            },
                            {
                                case: {
                                    $regexMatch: {
                                        input: '$title',
                                        regex: 'নির্মাণ'
                                    }
                                },
                                then: 'Construction'
                            },
                            {
                                case: {
                                    $regexMatch: {
                                        input: '$title',
                                        regex: 'সিমেন্ট'
                                    }
                                },
                                then: 'Cement Industry'
                            }
                        ],
                        default: 'Other'
                    }
                }
            }
        },
        {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$dateTime'
                        }
                    },
                    topic: '$topic'
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                date: '$_id.date',
                topic: '$_id.topic',
                count: 1
            }
        },
        {
            $sort: {
                date: 1
            }
        }
    ])

    res.send(allData)
})

export { getNewsData }
