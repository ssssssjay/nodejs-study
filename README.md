# 1. 작품의 목적

## 1.1 기획 의도

노드를 활용하여 독서기록장 만들기.

## 1.2 주 목적

생성, 조회, 수정, 삭제가 가능하도록 작업합니다.

# 2. 작품 요약

## 2.1 내용 및 주요 기능

CRUD 기능 구현

# 3. 작품 제작 과정

## 3.1 제작 기간
[참고영상](https://www.youtube.com/watch?v=OML9f6LXUUs&t=3905s)

~~아이디어 구상 및 데이터 확보: 약 1시간 정도~~

~~전처리 / 시각화: 약 1시간 정도 소요~~

~~웹페이지 제작: x~~

작품 설명서 작성: 약 30분 정도 소요


## 3.2 프로젝트 폴더 구조
![](https://images.velog.io/images/jay__ss/post/3fc0a9be-b72e-4ff0-bd97-5d695a736d70/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-01-08%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%203.29.53.png)
## 3.3 DB schema

몽고디비의 장점인 자율성이 과연 쓰일지는 고민해봐야함.
(우리의 디비가 자율성이 필요한가? 어느정도 정해진 규칙이 더 좋을지도)
스키마를 사용해 다시 자율성이 적어지는 느낌??으로 이해.
(sql의 느낌에 더 다가선다)

```js
// models/Post.js

const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
```


## 3.4 CRUD
```js
// routes/posts.js

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
```

# 4. 작품에 사용된 도구

## 4.1 도구

* VSC
* MongoDB (& compass)


## 4.1 언어 및 라이브러리

- node.js
- express
- mongoose

# 5. 제작결과

## 5.1 시연 영상
~~Front 코드를 못짜겠다... Postman으로 확인 가능~~