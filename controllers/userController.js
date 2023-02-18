import fetch from 'node-fetch'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import Pages from '../models/pageModel.js'
// import Quotation from '../models/quotationModel.js'
// import Customer from '../models/customerModel.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const facebookLogin = asyncHandler(async (req, res) => {
    const { userId, userName, accessToken, email, profilePicture } = req.body

    try {
        const get_page_url =
            process.env.GRAPH_API_URL +
            '/me/accounts?fields=picture{url},category,category_list,name,tasks,link,access_token&access_token=' +
            accessToken +
            '&limit=' +
            100

        const response = await fetch(get_page_url)
        const data = await response.json()

        const pages = data.data

        let user = await User.findOne({ userId })

        if (user) {
            user.name = userName
            user.accessToken = accessToken
            user.email = email
            user.profilePicture = profilePicture

            user = await user.save()
        } else {
            user = await User.create({
                userId,
                name: userName,
                accessToken,
                email,
                profilePicture,
                password: '$#@#$%^^%$#$%^&**&^%$%&*',
                loginType: 'facebook',
                isAdmin: false
            })
        }

        for (let i = 0; i < pages.length; i++) {
            console.log(pages[i])
            let page = await Pages.findOne({ pageId: pages[i].id })
            if (page) {
                page.pageName = pages[i].name
                page.pageURL = pages[i].link
                page.profilePicture = pages[i].picture.data.url
                page.page_access_token = pages[i].access_token
                page.category = pages[i].category
                page.updateDate = new Date()
                page.addedBy = user.name
                page.updatedBy = user.name
                page.tasks = pages[i].tasks
                await page.save()
                if (!page.users.includes(user.userId)) {
                    page.users.push(user.userId)
                    await page.save()
                }
            } else {
                page = new Pages({
                    pageId: pages[i].id,
                    pageName: pages[i].name,
                    pageURL: pages[i].link,
                    profilePicture: pages[i].picture.data.url,
                    page_access_token: pages[i].access_token,
                    category: pages[i].category,
                    creationDate: new Date(),
                    updateDate: new Date(),
                    addedBy: user.name,
                    updatedBy: user.name,
                    tasks: pages[i].tasks
                })
                await page.save()

                page.users.push(user.userId)
                await page.save()

                if (!user.pages.includes(page.pageId)) {
                    user.pages.push(page.pageId)
                    await user.save()
                }
            }
        }

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                userId: user.userId,
                phone: user.phone,
                commission: user.commission,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({
                message: 'Login failed!!!'
            })
        }
    } catch (e) {
        console.log(e)
    }

    // if (user && (await user.matchPassword(password))) {
    //     res.json({
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         phone: user.phone,
    //         commission: user.commission,
    //         isAdmin: user.isAdmin,
    //         token: generateToken(user._id)
    //     })
    // } else {
    //     res.status(401)
    //     throw new Error('Invalid email or password')
    // }
})
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            commission: user.commission,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, phone, password, commission } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    const user = await User.create({
        name,
        email,
        phone,
        password,
        commission
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            commission,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Get all the users as salesman
// @route   POST /api/users
// @access  Private/Admin
const getUsersAsSalesman = asyncHandler(async (req, res) => {
    const salesman = await User.find({ isAdmin: false }, '-password')
    res.json(salesman)
})

// @desc    Update user profile
// @route   PUT /api/users
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.phone = req.body.phone || user.phone
        user.commission = req.body.commission || user.commission
        user.isAdmin = req.body.isAdmin || user.isAdmin
        if (req.body.password) {
            user.password = req.body.password
        }
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            isAdmin: updatedUser.isAdmin,
            commission: updatedUser.commission,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.phone = req.body.phone || user.phone
        user.commission = req.body.commission || user.commission
        //user.isAdmin = req.body.isAdmin || user.isAdmin
        // user.isAdmin = req.body.isAdmin
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            commission: updatedUser.commission,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    // const user = await User.findById(req.params.id)
    // if (user) {
    //     const quotation = await Quotation.find({ salesman: req.params.id })
    //     const customer = await Customer.find({ salesman: req.params.id })
    //     if (customer.length > 0) {
    //         res.status(404)
    //         throw new Error(
    //             'As this salesman has been assigned to customer, it can not be deleted'
    //         )
    //     } else if (quotation.length > 0) {
    //         res.status(404)
    //         throw new Error(
    //             'As this salesman has quotation, it can not be deleted'
    //         )
    //     } else {
    //         await user.remove()
    //         res.json({ message: 'User removed' })
    //     }
    // } else {
    //     res.status(404)
    //     throw new Error('User not found')
    // }
})

const getUserPages = async (req, res) => {
    const userId = req.params.userId

    const pages = await Pages.find(
        { users: { $in: [userId] } },
        { userList: 0, tasks: 0, users: 0, page_access_token: 0 }
    )

    res.json(pages)
}

export {
    authUser,
    registerUser,
    updateUserProfile,
    updateUser,
    getUsersAsSalesman,
    deleteUser,
    facebookLogin,
    getUserPages
}
