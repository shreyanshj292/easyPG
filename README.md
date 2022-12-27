"# easyPG" 

The information of database is as follows
There are 4 tables 
    users
    blogs
    "comments"
    likes

Users table have 3 columns
    id: primary key column
    name: varchar(255)
    username: varchar(255)
    password: text

blogs table have following columns
    id: primary key
    blog_title: varchar(255)
    blog_content: text
    blog_category: varchar(255)
    created_date: date
    likes_count: int -> initialised 0
    comments_count: int -> initialised 0
    user_id: int -> id of user writing the blog ( column in foreign key )

"comments" table have the followinng cokumns
    id: primary key
    comment_text: text
    blog_id: id of the blog the comment is to (for foreign key)
    comment_user_id: id of the user commenting (for foreign key)

likes table have the following columns
    id: primary key
    blog_id: id of the blog which is liked (for foreign key)
    like_user_id: Id of user liking the blog (for foreign key)



