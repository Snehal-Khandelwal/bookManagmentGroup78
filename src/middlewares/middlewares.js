const jwt = require("jsonwebtoken");
const bookModel = require("../models/booksModel.js");

//================================[ Authentication ]=======================================//
const isTokenValid = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]

        if (!token) return res.status(401).send({ status: false, message: "token is not present" })

        jwt.verify(token, "Project3-78",(err, decoded) => {
            if (err) {
                res.status(401).send({ status: false, Error: err.message })
            }
            req.token = decoded
        })

        next()

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//=====================================[ Authorisation ]=======================================//
const isAuthorised = async function (req, res, next) {
    try {
        bookId = req.params.bookId;
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "invalid BookId" })

        let requiredBook = await bookModel.findById(bookId)
        if (!requiredBook) {
            return res.status(404).send("No such book present ")
        }

        const userId = requiredBook.userId
        const token = req.headers["x-api-key"]

        const decodedToken = jwt.verify(token, "Project3-78")
        
        if (userId == decodedToken.userId) {
            next()
        }
        else {
            return res.status(403).send("you are not authorized to take this action")
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = { isTokenValid, isAuthorised }
