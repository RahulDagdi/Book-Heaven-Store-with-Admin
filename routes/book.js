const router = require ('express').Router();
const  User = require ('../models/user'); 
const jwt = require('jsonwebtoken');
const {authenticateToken} = require ('./userauth')
const Book = require ('../models/book')

//// add book -- admin 
router.post('/add-book', authenticateToken, async (req, res) => {    
    try {
        const {id} = req.headers ;
      const user=   await User.findById(id);
     if(user.role !== "admin")
     {
        return res.status(403).json({message: "You are not authorized to perform admin action"})
     }

         const book = new Book ({
            url : req.body.url,
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            description : req.body.description,
            language: req.body.language


        });

        await book.save();
        res.status(201).json({ message: 'Book added successfully' });
                 
    }

    catch(error)
    {
        res.status(500).send({message: "Internal server Error in adding book"})
    }

})

///// update book -- admin 

router.put('/update-book',async (req,res)=>{
   try{
    const {bookid} = req.headers ;
    await Book.findByIdAndUpdate(bookid,{
     
        url : req.body.url ,
        title : req.body.title ,
        author : req.body.author ,
       price : req.body.price, 
       description : req.body.description ,
       language : req.body.language

    })
     return res.status(200).json({message : "Book Updated successfully"});

    }
    
     catch (error)
     {
         console.log(error)
         return res.status(500).json({message : "an Error Occurred"});
    }
})


////// delete book -- admin
router.delete ('/delete-book', async (req,res)=>{
    try {
        const {bookid} = req.headers ;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({message : "Book Deleted successfully"});
        
    } catch (error) {
         console.log(error)
   return res.status(500).json({message :" An Error occurred"})

    }
})


//// get all book 
router.get('/get-all-book', async (req, res) => {
    try {

        const books = await Book.find().sort({createAt : -1 });
        return res.status(200).json({
            status: "Success" ,
             data : books
              
            });

    }
    catch(error)
    {
        console.log(error)
          return res.status(500).json ({message : "An Error Occurred"})
    }
})


///// get recently added books limit 4 

router.get('/get-recent-book', async (req,res)=>{
    try {
          const books = await Book.find().sort({createAt: -1 }).limit(4)
          return res.status(200).json({
            status : "Success",
            data : books

          })


        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "An Error Occurred"})
    }
})



///// get book by id 
router.get('/get-book-by-id/:id', async (req, res) => {
  try {
    const {id} = req.params ;
    const book = await Book.findById(id);
    if(!book)
        {
            return res.status(404).json({message : "Book Not Found"})

        }
        return res.status(200).json({
            status : "Success",
            data : book

        })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An Error Occurred" });
  }
})

module.exports = router ;