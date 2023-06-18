const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const fs = require('fs')
const nodemailer = require('nodemailer')
const mysql = require('mysql')
const { error, log } = require('console')

const PATH = '/Users/foxy/Documents/Projets/react/server/db'
//Mails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'photo.frozencloud@gmail.com',
        pass: 'gckvbkjndlgxkwho',
    },
    secure: true,
});


var connection = mysql.createConnection({
    host: '138.195.138.73',
    user: 'frozencloud',
    password: 'poney',
    database: 'frozencloud'
})


connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to mysql DB');
    }
});






const upload = multer({
    dest: "/tmp"
})



require('dotenv').config();
console.log(process.env.ACCESS_TOKEN_SECRET);
app.use(bodyParser.json());
app.use(cors());

function generateJwt(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600s' })
}

app.listen(8080, () => console.log("Listening on port 8080"))

function handleLogin(req, res) {
    const { username, password } = req.body
    console.log(username, password)
    connection.query('SELECT password from users where username = ?', username, (err, result) => {
        if (!result.length > 0) {
            res.status(200).send({ response: 'wrong' })
        } else {
            if (password === result[0].password) {
                console.log('Connected');
                const token = generateJwt({ username: username });
                res.status(200).send({ response: 'right', token: token })
            } else {
                res.status(200).send({ response: 'wrong' })
            }
        }

    })

}
app.post('/login', handleLogin)


function handleGallery(req, res) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    console.log(token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            fs.readdir(PATH + '/' + user.username, (err, files) => {
                res.status(200).send({
                    gallery: {
                        'images': files
                    }
                });
            })

        }
    })

}

app.get('/gallery', handleGallery)

function handleImport(req, res) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            fs.rename(req.file.path, PATH + '/' + user.username + '/' + req.file.originalname, (err) => {
                console.log(err);
                if (!err) {
                    res.status(200).send('success');
                } else {
                    res.status(401).send('error')
                }
            })

        }
    })
}

app.post('/import', upload.single('File'), handleImport)


function handlePhoto(req, res) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    console.log("Handling photo")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            console.log(PATH + user.username + '/' + req.query.name)
            res.status(200).sendFile(PATH + '/' + user.username + '/' + req.query.name)

        }
    })

}

app.get('/photo', handlePhoto)

function handleDelete(req, res) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    console.log("Handling delete")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
        } else {
            fs.unlink(PATH + user.username + '/' + req.query.name, (err) => {
                if (err) {
                    res.status(401).send('error')
                } else {
                    res.status(200).send('success')
                }
            })

        }
    })

}

app.delete('/delete', handleDelete)



function handleSignup(req, res) {
    const { username, password } = req.body;
    console.log(username)
    connection.query('SELECT username FROM users WHERE username=?', username, (erro, result) => {
        if (result.length > 0) {
            res.status(200).send('exists')
            log('Already exists')
        } else {
            connection.query('SELECT username FROM transactions WHERE username=? ', username, (err, result) => {
                if (!err) {
                    if (result.length == 0) {
                        var date = new Date();
                        time = date.getTime() + 1000 * 60 * 5
                        var code = Math.floor(Math.random() * 10000)
                        connection.query('INSERT INTO transactions value (?, ?, ?, ?)', [username, time, code, password], (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                const mailData = {
                                    from: 'photo.frozencloud@gmail.com',  // sender address
                                    to: 'r.faure75@gmail.com',   // list of receivers
                                    subject: 'Your verification code',
                                    text: 'Your verification code',
                                    html: `<b>Hey there! Welcome to Frozencloud ! </b> <br> Here is your activation code : ${code} <br/> `,
                                }
                                transporter.sendMail(mailData, function (err, info) {
                                    if (err)
                                        console.log(err)
                                    else
                                        res.status(200).send("success");
                                });
                            }
                        })
                    } else {
                        res.status(200).send("ongoing");
                    }
                } else {
                    res.status(401).send("error");
                }
            })
        }
    })


}

app.post('/signup', handleSignup)

function handleVerification(req, res) {
    const { username, code } = req.body
    var date = new Date();
    var time = date.getTime();
    let password;
    connection.query('SELECT password from transactions where username = ?', username, (err, result) => {
        if (result.length > 0) {
            password = result[0].password;
        }
    });
    connection.query('SELECT * FROM transactions WHERE username = ? ', username, (e, result) => {
        if (e) {
            console.log(e)
        } else if (result.length > 0) {
            if (result[0].time < time) {
                res.status(200).send('expired')
                connection.query('DELETE FROM transactions WHERE username = ?', username)
            } else if (result[0].code != code) {
                console.log(parseInt(code), parseInt(result[0].code))
                res.status(200).send("code")
            } else {
                connection.query('DELETE FROM transactions WHERE username = ?', username, (err, result) => {
                    if (!err) {
                        console.log('Deleted transaction');
                        connection.query('INSERT INTO users VALUE (?,?)', [username, password], (error, result) => {
                            if (!error) {
                                console.log('Inserted user');
                                fs.mkdir(PATH + '/' + username, (err) => {
                                    console.log(err)
                                })
                                res.status(200).send('success')
                            } else {
                                console.log(error)
                            }
                        })

                    } else {
                        console.log(err)
                    }
                })
            }
        }
    })
}

app.post('/verify', handleVerification)
