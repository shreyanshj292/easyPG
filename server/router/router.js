const config = require("../config/config")
const express = require("express")
const req = require("express/lib/request");
const res = require("express/lib/response");

const db = config.createDB()


const router = express.Router();

router.get("/api/check", async (req, res) => {
    const result = await db.query(`SELECT * FROM users`, (err, resp) => {
        if (!err) {
            // console.log(resp);
            res.send({
                data: resp.rows
            })
        }
        else {
            console.log(err);
            res.send({
                statusCode: 2
            })
        }
    })
})

router.post("/api/signup", (req, res) => {
    let _name = req.body.data.name
    let _username = req.body.data.username
    let _password = req.body.data.password

    const result = db.query(`
    SELECT * from users where username='${_username}';
    do $$
    declare 
        userID integer := -1;
    begin 
        SELECT id into userID from users where username='${_username}';
        if userID is null THEN 
            INSERT INTO users(name, username, password) VALUES('${_name}', '${_username}',  '${_password}');
        end if;

    end; $$
    `, (err, resp) => {
        if (!err) {
            console.log(resp)
            if (resp[0].rows.length !== 0) {
                res.send({
                    statusCode: 3
                })
            }
            else {
                res.send({
                    statusCode: 1
                })
            }
        }
        else {
            console.log(err)
            res.send({
                statusCode: 2
            })
        }
    })
})

router.post("/api/login", (req, res) => {
    let _username = req.body.data.username;
    let _password = req.body.data.password;

    const result = db.query(`SELECT * FROM users WHERE username='${_username}' AND password='${_password}'`, (err, resp) => {
        if (!err) {
            if (resp.rows.length === 1) {
                res.send({
                    statusCode: 1,
                })
            } else {
                res.send({
                    statusCode: 3
                })
            }
        }
        else {
            console.log(err)
            res.send({
                statusCode: 2
            })
        }
    })
})

router.get("/api/users/:id", (req, res) => {
    let user_id = req.params.id;

    const result = db.query(`
    SELECT * FROM users WHERE id=${user_id};
    SELECT * from blogs WHERE user_id=${user_id}
    `, (err, resp) => {
        if (!err) {
            let ret = [];
            ret.push(resp[0].rows);
            ret.push(resp[1].rows)
            res.send({
                data: ret
            })
        }
        else {
            res.send({
                statusCode: 2
            })
        }
    })
})


router.post("/api/posts", (req, res) => {
    let _blog_title = req.body.data.blog_title;
    let _blog_content = req.body.data.blog_content;
    let _blog_category = req.body.data.blog_category;
    let _created_date = req.body.data.created_date;
    let _likes_count = 0;
    let _comments_count = 0;
    let _user_id = req.body.data.user_id;
    // console.log(req.body, _created_date, _blog_category, _blog_content, _blog_title, _likes_count, _comments_count, _user_id)



    const result = db.query(`INSERT INTO blogs (blog_title, blog_content, blog_category, created_date, likes_count, comments_count, user_id) values( '${_blog_title}', '${_blog_content}', '${_blog_category}', '${_created_date}', ${_likes_count}, ${_comments_count}, ${_user_id} );`, (err, resp) => {
        // console.log(resp)
        if (!err) {
            res.send({
                statusCode: 1
            })
        }
        else {
            console.log(err)
            res.send({
                statusCode: 2
            })
        }
    })
})

router.get("/api/posts/:id", (req, res) => {
    let _id = req.params.id;
    // console.log(_id)
    const result = db.query(`SELECT * FROM blogs WHERE id=${_id}`, (err, resp) => {
        if (!err) {
            if (resp.rows.length === 1) {
                res.send({
                    data: resp.rows
                })
            }
            else {
                res.send({
                    statusCode: 3,
                    msg: "Blog with that id does not exist"
                })
            }
        } else {
            res.send({
                statusCode: 2,
                msg: "Something went wrong"
            })
        }
    })
})

router.put("/api/posts/:id", (req, res) => {
    let _id = req.params.id
    let _blog_title = req.body.data.blog_title;
    let _blog_content = req.body.data.blog_content;
    let _blog_category = req.body.data.blog_category;
    let _created_date = req.body.data.created_date;
    // let _likes_count = 0;
    // let _comments_count = 0;
    // let _user_id = req.body.data.user_id;

    const result = db.query(`UPDATE blogs SET blog_title='${_blog_title}', blog_content='${_blog_content}', blog_category='${_blog_category}', created_date='${_created_date}' WHERE id=${_id}  `, (err, resp) => {
        // console.log(resp)
        if (!err) {
            res.send({
                statusCode: 1
            })
        }
        else {
            console.log(err)
            res.send({
                statusCode: 2
            })
        }
    })
})

router.delete("/api/posts/:id", (req, res) => {
    let _id = req.params.id;
    console.log(_id)

    const result = db.query(`DELETE FROM blogs where id=${_id}`, (err, resp) => {
        if (!err) {
            res.send({
                statusCode: 1,
            })
        }
        else {
            res.send({
                statusCode: 2,
            })
        }
    })
})

router.post("/api/comments", (req, res) => {
    let _comment_text = req.body.data.comment_text;
    let _blog_id = req.body.data.blog_id;
    let _comment_user_id = req.body.data.comment_user_id;

    const result = db.query(`INSERT INTO "comments" (comment_text, blog_id, comment_user_id) VALUES ( '${_comment_text}', ${_blog_id}, ${_comment_user_id} );
                            UPDATE blogs SET comments_count = comments_count + 1 WHERE id=${_blog_id}
    `, (err, resp) => {
        if (!err) {
            res.send({
                statusCode: 1
            })
        }
        else {
            console.log(err);
            res.send({
                statusCode: 2
            })
        }
    })
})

router.get("/api/comments/:id", (req, res) => {
    let _id = req.params.id;
    console.log(_id)
    const result = db.query(` SELECT * FROM "comments" where id=${_id} `, (err, resp) => {
        if (!err) {
            if (resp.rows.length === 1) {
                res.send({
                    data: resp.rows
                })
            } else {
                res.send({
                    statusCode: 3,
                    msg: `No such comment with id ${_id} `
                })
            }
        } else {
            res.send({
                statusCode: 2,
                msg: "Something went wrong"
            })
        }
    })
})

router.get("/api/comments", (req, res) => {
    const result = db.query(`SELECT * FROM "comments" `, (err, resp) => {
        if (!err) {
            res.send({
                data: resp.rows
            })
        }
        else {
            res.send({
                statusCode: 2
            })
        }
    })
})

router.put("/api/comments/:id", (req, res) => {
    let _comment_text = req.body.data.comment_text;
    let _comment_id = req.params.id;
    // let _blog_id = req.body.data.blog_id;
    // let _comment_user_id = req.body.data.comment_user_id

    const result = db.query(`UPDATE "comments" SET comment_text='${_comment_text}' WHERE id=${_comment_id}; `, (err, resp) => {
        if (!err) {
            res.send({
                statusCode: 1
            })
        }
        else {
            console.log(err)
            res.send({
                statusCode: 2
            })
        }
    })
})

router.delete("/api/comments/:id", (req, res) => {

    let _id = req.params.id;

    const result = db.query(`do $$
        declare 
            blogID integer;
        begin
            select blog_id into blogID from  "comments" where id=${_id};
            update blogs set comments_count = comments_count-1 where id=blogID;
            DELETE FROM "comments" WHERE id=${_id};
        end; $$`, (err, resp) => {
        if (!err) {
            res.send({
                statusCode: 1
            })
        }
        else {
            console.log(err)
            res.send({
                statusCode: 2
            })
        }
    })
})

router.post("/api/like", (req, res) => {
    let _blog_id = req.body.data.blog_id;
    let _like_user_id = req.body.data.like_user_id

    let result = db.query(` do $$
    declare 
        likeID integer:= -1;
    begin
        select id into likeID from likes where like_user_id=${_like_user_id} and blog_id=${_blog_id};
        if likeID is null THEN 
            INSERT INTO likes(blog_id, like_user_id) VALUES(${_blog_id}, ${_like_user_id}) ;
            UPDATE blogs SET likes_count=likes_count+1 WHERE id=${_blog_id};
        end if;
    end; $$`, (err, resp) => {
        if (!err) {
            res.send({
                statusCode: 1
            })
        } else {
            console.log(err)
            res.send({
                statusCode: 2
            })
        }
    });
})

router.post("/api/unlike", (req, res) => {
    let _blog_id = req.body.data.blog_id;
    let _like_user_id = req.body.data.like_user_id;

    let result = db.query(` do $$
    declare 
        likeID integer:= -1;
    begin
        select id into likeID from likes where like_user_id=${_like_user_id} and blog_id=${_blog_id};
        if likeID is not null THEN 
            DELETE from likes where id=likeID ;
            UPDATE blogs SET likes_count=likes_count-1 WHERE id=${_blog_id};
        end if;
    end; $$`, (err, resp) => {

        if (!err) {
            res.send({
                statusCode: 1
            })
        } else {
            res.send({
                statusCode: 2
            })
        }
    })
})


router.get("/api/posts", (req, res) => {

    let result = db.query(`
        SELECT * FROM blogs ORDER BY likes_count desc;
        SELECT * FROM blogs ORDER BY comments_count desc;
        SELECT * FROM blogs ORDER BY created_date desc;

    `, (err, resp) => {
        let ret = []
        for (let i = 0; i < resp.length; i++) {
            ret.push(resp[i].rows)
        }
        if (!err) {
            res.send({
                data: ret,
                msg: "the first element of the object is most liked, 2nd is most commented, and the third one is most recent post ordering"
            })
        } else {
            {
                res.send({
                    statusCode: 2
                })
            }
        }
    })
})


module.exports = router;