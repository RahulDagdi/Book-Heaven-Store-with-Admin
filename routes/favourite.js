const router = require ('express').Router();
const User = require ('../models/user')
const {authenticateToken} = require('./userauth')


 ////add book to favorite 
router.put('/add-book-to-favorite',authenticateToken, async (req,res)=>{
    try {
        const {bookid ,id } = req.headers ;
        const userData = await User.findById(id);
        const isBookFavourite =  userData.favourites.includes(bookid);

        if (isBookFavourite) {
            return res.status(400).json({message: "Book is already in your favourite list."
                });
                }
                const updatedData = await User.findByIdAndUpdate(id,{$push: {favourites: bookid}},
                    {new: true});
                    res.status(200).json({message: "Book added to your favourite list."})
                


        
    } catch (error) {
           console.log(error);
           return res.status(500).json({
            message: "Internal server Error adding book to favorite"
           })
        }

})

///// delete/remove book from favorite using put to update because not to delete form database
router.put('/remove-book-from-favorite',authenticateToken, async (req,res)=>{
    try {
        const {bookid , id } =req.headers ;
        const userData = await User.findById(id);
        const isBookFavourite =  userData.favourites.includes(bookid);
        if (!isBookFavourite) {
            return res.status(400).json({message: "Book is not in your favourite list."});
        }
        const updatedData = await User.findByIdAndUpdate(id,{$pull: {favourites: bookid}},
            {new: true});
            
         res.status(200).json({message: "Book removed from your favourite list."})
         
    }
    catch (error)
    {
        console.log(error);
        return res.status(500).json({
    message: "Internal server Error removing book from favorite"})
}
});


///// get favorite book of a particular user 
router.get('/get-favorite-book',authenticateToken, async (req,res)=>{ 
    try {
           const {id}   = req.headers ;
           const userData = await User.findById(id).populate("favourites") ; 
           // .populate to use showing all data other wise showing only id
           const favoriteBooks = userData.favourites ;
           return res.status(200).json({
            status: "Success",
            data:favoriteBooks
            })
      


    
} catch (error) {
    console.log(error)
       return res.status(500).json({
        message: "Internal server Error fetching favourite book"
       }) 
}

})

module.exports = router ;