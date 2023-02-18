import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            default: null
        },
        password: {
            type: String,
            required: true
        },
        commission: {
            type: Number,
            default: null
        },
        loginType: {
            type: String,
            required: true
        },
        accessToken: {
            type: String,
            default: null
        },
        profilePicture: {
            type: String,
            default: null
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        },
        pages: [
            {
                type: String,
                ref: 'Pages',
                unique: true
            }
        ]
    },
    {
        timestamps: true
    }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
