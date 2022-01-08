const router = require("express").Router();
const Post = require("../models/Post");

//포스트 생성하기
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

////포스트 수정하기
router.put("/:id", async(req, res)=>{
  try { 
    // 복잡시레 긴 아이디를 의미. 그게 같고 유저이름도 같아야 한다.
    // 뒤에 파라미터로 온값으로 포스트를 찾고, 이름이 같다면~
    const post = await Post.findById(req.params.id);
    if(post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id, 
          {
            // findByIdAndUpdate(아이디, {세팅})
            $set:req.body
          }, 
          //{ new: true }를 넣으면 수정 이후의 값 반환 
          { new:true }
        )
        res.status(200).json(updatedPost);
      } catch(err) {}
        res.status(500).json(err);
    } else {
      // 만약 유저네임이 다르다면 이렇게 됨
      res.status(401).json("본인 글만 업뎃 가능함!")
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

////포스트 삭제하기 아이디와 네임이 같아야 하는부분은 위와 같음
router.delete("/:id", async(req, res)=>{
  try { 
    const post = await Post.findById(req.params.id);
    if(post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json("글이 삭제됨");
      } catch(err) {}
        res.status(500).json(err);
    } else {
      res.status(401).json("본인 글만 삭제 가능함!")
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

////해당게시물 가져오기?긁어오기?
// 단일 아이디로 찾아서 딱 하나의 글을 가져온다
router.get("/:id", async (req, res)=>{
  try{
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch(err) {
    res.status(500).json(err)
  }
});

// posts?user=원하는 유저네임 입력
// 카테고리도 한번 넣어봄...
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;