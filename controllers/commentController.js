import asyncHanlder from 'express-async-handler'
import XLSX from 'xlsx'

import Comment from '../models/commentModel.js'

const getUsers = asyncHanlder(async (req, res) => {
    const { pageId, topic, subTopic, type } = req.query

    let from = req.query.from ? req.query.from : ''
    let to = req.query.to ? req.query.to : ''

    let filter = {}
    if (pageId != null && pageId != 'null') {
        filter.pageId = pageId
    }
    if (topic != null && topic != 'null') {
        filter.topic = topic
    }
    if (subTopic != null && subTopic != 'null') {
        filter.subTopic = subTopic
    }

    filter.created_time = {
        $gte: new Date(from),
        $lte: new Date(to)
    }
    let response
    if (type == 'data') {
        response = await Comment.find(filter, {
            from: 1,
            fromId: 1,
            fromName: 1
        }).limit(20)

        ///////////////will delete later///////////////////
        if (topic == 'Complain') {
            response = [
                { fromId: '188507869711', fromName: 'Abrar Hossain' },
                { fromId: '477554338727', fromName: 'Sheikh Mahfuzur Rahman' },
                { fromId: '948015192030', fromName: 'Tomal Mazumdar' },
                { fromId: '271657993775', fromName: 'Jannat Ara' },
                { fromId: '672129844900', fromName: 'Pranta Biswas' },
                { fromId: '261036384090', fromName: 'Saad Al Muttaki' },
                { fromId: '118463135192', fromName: 'Reza Shuvo' },
                { fromId: '860681022568', fromName: 'Tanzid Hossain' },
                { fromId: '913011542433', fromName: 'Abdul Haq' },
                { fromId: '572268006654', fromName: 'Rimon Talukdar' }
            ]
        } else if (topic == 'Appreciation') {
            response = [
                { fromId: '944111260501', fromName: 'Nurul Islam' },
                { fromId: '953341512257', fromName: 'Emon Hossan' },
                { fromId: '997565298452', fromName: 'Saroar Zahan' },
                { fromId: '504744952179', fromName: 'Alomgir Bhuiyan' },
                { fromId: '938607203839', fromName: 'Palash Malakar' },
                { fromId: '362174198385', fromName: 'Abdul Hannan' },
                { fromId: '881437048455', fromName: 'Barkat Ullah' },
                { fromId: '283841231321', fromName: 'Mokhlesur Rahman' },
                { fromId: '452983723799', fromName: 'Azmira Akter' },
                { fromId: '874749544073', fromName: 'Muhammad Ebrahim' }
            ]
        } else {
            response = [
                { fromId: '874749544073', fromName: 'Muhammad Ebrahim' },
                { fromId: '938607203839', fromName: 'Palash Malakar' },
                { fromId: '572268006654', fromName: 'Rimon Talukdar' },
                { fromId: '014889234044', fromName: 'HD Shohel' },
                { fromId: '547564929412', fromName: 'Mst Sarmin' },
                { fromId: '183556484910', fromName: 'Zk Zonee' },
                { fromId: '596018027890', fromName: 'Abed Ali' },
                { fromId: '999773100669', fromName: 'Masum Patwary' },
                { fromId: '637343063631', fromName: 'Md Foysal' },
                { fromId: '935939989138', fromName: 'Empty Zillur' }
            ]
        }

        let showData = []

        for (let i = 0; i < response.length; i++) {
            let ed = {}
            var fullName = response[i].fromName.split(' '),
                firstName = fullName[0],
                lastName = fullName[fullName.length - 1]
            ed.email = response[i].email
            ed.phone = response[i].phone
            ed.madid = response[i].madid
            ed.fn = firstName
            ed.ln = lastName
            ed.ct = response[i].ct
            ed.gen = response[i].gen
            ed.age = response[i].age
            ed.uid = response[i].fromId
            showData.push(ed)
        }

        res.json(showData)
    } else {
        response = await Comment.find(filter, {
            from: 1,
            fromId: 1,
            fromName: 1
        })

        ///////////////will delete later///////////////////
        if (topic == 'Complain') {
            response = [
                { fromId: '188507869711', fromName: 'Abrar Hossain' },
                { fromId: '477554338727', fromName: 'Sheikh Mahfuzur Rahman' },
                { fromId: '948015192030', fromName: 'Tomal Mazumdar' },
                { fromId: '271657993775', fromName: 'Jannat Ara' },
                { fromId: '672129844900', fromName: 'Pranta Biswas' },
                { fromId: '261036384090', fromName: 'Saad Al Muttaki' },
                { fromId: '118463135192', fromName: 'Reza Shuvo' },
                { fromId: '860681022568', fromName: 'Tanzid Hossain' },
                { fromId: '913011542433', fromName: 'Abdul Haq' },
                { fromId: '572268006654', fromName: 'Rimon Talukdar' }
            ]
        } else if (topic == 'Appreciation') {
            response = [
                { fromId: '944111260501', fromName: 'Nurul Islam' },
                { fromId: '953341512257', fromName: 'Emon Hossan' },
                { fromId: '997565298452', fromName: 'Saroar Zahan' },
                { fromId: '504744952179', fromName: 'Alomgir Bhuiyan' },
                { fromId: '938607203839', fromName: 'Palash Malakar' },
                { fromId: '362174198385', fromName: 'Abdul Hannan' },
                { fromId: '881437048455', fromName: 'Barkat Ullah' },
                { fromId: '283841231321', fromName: 'Mokhlesur Rahman' },
                { fromId: '452983723799', fromName: 'Azmira Akter' },
                { fromId: '874749544073', fromName: 'Muhammad Ebrahim' }
            ]
        } else {
            response = [
                { fromId: '874749544073', fromName: 'Muhammad Ebrahim' },
                { fromId: '938607203839', fromName: 'Palash Malakar' },
                { fromId: '572268006654', fromName: 'Rimon Talukdar' },
                { fromId: '014889234044', fromName: 'HD Shohel' },
                { fromId: '547564929412', fromName: 'Mst Sarmin' },
                { fromId: '183556484910', fromName: 'Zk Zonee' },
                { fromId: '596018027890', fromName: 'Abed Ali' },
                { fromId: '999773100669', fromName: 'Masum Patwary' },
                { fromId: '637343063631', fromName: 'Md Foysal' },
                { fromId: '935939989138', fromName: 'Empty Zillur' }
            ]
        }

        if (Array.isArray(response)) {
            let excelData = []
            for (let i = 0; i < response.length; i++) {
                let ed = {}
                var fullName = response[i].fromName.split(' '),
                    firstName = fullName[0],
                    lastName = fullName[fullName.length - 1]
                ed.email = response[i].email
                ed.phone = response[i].phone
                ed.madid = response[i].madid
                ed.fn = firstName
                ed.ln = lastName
                ed.ct = response[i].ct
                ed.gen = response[i].gen
                ed.age = response[i].age
                ed.uid = response[i].fromId
                excelData.push(ed)
            }

            const workSheet = XLSX.utils.json_to_sheet(excelData)
            const workBook = XLSX.utils.book_new()

            XLSX.utils.book_append_sheet(workBook, workSheet, 'userData')

            XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' })

            const file_path = `./download/userData_${new Date().getTime()}_${topic}_dn.xlsx`

            XLSX.writeFile(workBook, file_path)

            res.sendFile(file_path, { root: '.' })
        }
    }
})

// @desc    Add a new customer
// @route   POST /api/customers
// @access  Private/Admin
const addCustomer = asyncHanlder(async (req, res) => {
    // const { name, email, phone, address, assignedDate, salesman, note } =
    //     req.body
    // const customerExists = await Customer.findOne({ phone })
    // const user = await User.findById(salesman)
    // let userId = ''
    // if (user) {
    //     userId = user._id
    // }
    // if (customerExists) {
    //     res.status(400)
    //     throw new Error('User already exists')
    // }
    // const customer = await Customer.create({
    //     name,
    //     email,
    //     phone,
    //     address,
    //     assignedDate,
    //     salesman: userId,
    //     note
    // })
    // if (customer) {
    //     res.status(201).json({
    //         _id: customer._id,
    //         name: customer.name,
    //         email: customer.email,
    //         phone: customer.phone,
    //         address: customer.address,
    //         assignedDate: customer.assignedDate,
    //         salesman: customer.salesman,
    //         note: customer.note
    //     })
    // } else {
    //     res.status(400)
    //     throw new Error('Invalid customer data')
    // }
})

// @desc    Get all comments
// @route   GET /api/comments
// @access  Private
const getComments = asyncHanlder(async (req, res) => {
    let comments
    comments = await Comment.find({})
    // comments = await Comment.find({}).populate('salesman', 'name')
    res.json(comments)
})

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = asyncHanlder(async (req, res) => {
    // const customer = await Customer.findById(req.params.id).select('-password')
    // const customer = await Customer.find({
    //     _id: req.params.id,
    //     salesman: req.user._id
    // })
    // if (customer && customer.length !== 0) {
    //     res.json(customer)
    // } else {
    //     res.status(404)
    //     throw new Error('Customer not found')
    // }
})

// @desc    Update customer info
// @route   PUT /api/customers/:id
// @access  Private/Admin
const updateCustomer = asyncHanlder(async (req, res) => {
    // const customer = await Customer.findById(req.params.id)
    // if (customer) {
    //     if (req.body.salesman) {
    //         const user = await User.findById(req.body.salesman)
    //         if (user) {
    //             customer.salesman = user._id
    //         } else {
    //             customer.salesman = ''
    //         }
    //     } else {
    //         customer.salesman = customer.salesman
    //     }
    //     customer.name = req.body.name || customer.name
    //     customer.email = req.body.email || customer.email
    //     customer.phone = req.body.phone || customer.phone
    //     customer.address = req.body.address || customer.address
    //     customer.note = req.body.note || customer.note
    //     customer.assignedDate = req.body.assignedDate || customer.assignedDate
    //     // customer.salesman = req.body.salesman || customer.salesman
    //     const updatedCustomer = await customer.save()
    //     res.json({
    //         _id: updatedCustomer._id,
    //         name: updatedCustomer.name,
    //         email: updatedCustomer.email,
    //         phone: updatedCustomer.phone,
    //         address: updatedCustomer.address,
    //         assignedDate: updatedCustomer.assignedDate,
    //         salesman: updatedCustomer.salesman
    //     })
    // } else {
    //     res.status(404)
    //     throw new Error('Customer not found')
    // }
})

// @desc    Delete user
// @route   DELETE /api/customers/:id
// @access  Private/Admin
const deleteCustomer = asyncHanlder(async (req, res) => {
    // const customer = await Customer.findById(req.params.id)
    // if (customer) {
    //     const quotation = await Quotation.find({ customer: req.params.id })
    //     console.log(quotation)
    //     if (quotation.length > 0) {
    //         res.status(404)
    //         throw new Error(
    //             'As this customer has quotation, it can not be deleted'
    //         )
    //     } else {
    //         await customer.remove()
    //         res.json({ message: 'Customer removed' })
    //     }
    // } else {
    //     res.status(404)
    //     throw new Error('Customer not found')
    // }
})

export {
    getUsers,
    addCustomer,
    getComments,
    getCustomerById,
    updateCustomer,
    deleteCustomer
}
