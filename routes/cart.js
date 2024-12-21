const router = require ('express').Router();
const User = require ('../models/user')
const {authenticateToken} = require('./userauth')



//// add/put book to cart 

router.put('/add-to-cart',authenticateToken, async(req,res)=>{
    try {

        const {bookid , id } = req.headers ;
        const userData = await User.findById(id);
        const isBookInCart = userData.cart.includes(bookid);
        if (isBookInCart) {
            res.json({ 
                status : "Success",
                message: "Book is already in your cart" });
            } 

              await User.findByIdAndUpdate ( id, 
                {
                    $push: {cart : bookid }
                 })

            return res.json ({
                status : "Success",
                message: "Book added to cart"
            })
       

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error adding to cart" })
    }
})


///// delete/remove book from favorite using put to update because not to delete form database using id 
router.put('/remove-from-cart/:bookid',authenticateToken, async(req,res)=>{
    try {

        const {bookid } =req.params ;
         const { id } = req.headers ;
         const userData = await User.findById(id);  
         const isBookInCart = userData.cart.includes(bookid);
         if (!isBookInCart) {
            res.json({
                status : "Success",
                message: "Book is not in your cart" });
                }
        
                await User.findByIdAndUpdate ( id, 
                    {
                        $pull: {cart : bookid }
                     })
    
    
                return res.json ({
                    status : "Success",
                    message: "Book remove from cart"
                })        
                       
            

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error occured removing book from cart" })
    }
})



////// get cart of a particular user 
router.get('/get-user-cart', authenticateToken ,async (req,res)=>{
    try {
        const { id } = req.headers ;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse ();
        return res.json({
            status : "Success",
            message: "Cart of user fetched successfully",
            data:cart

        });
        
        
    } catch (error) {
                console.log(error);
                return res.status(500).json({message: "Error fetching cart" })
    }
})




module.exports = router ;