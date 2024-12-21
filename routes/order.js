const router = require('express').Router();
const { authenticateToken } = require('./userauth');
const Book = require('../models/book')
const Order = require('../models/order');
const  User  = require ('../models/user')


////// Place Order
router.post('/place-order', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;

        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderDataFromDb = await newOrder.save();

            ///// saving order in user model 

            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id }
            });

            // clearing cart 

            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id }
            });
          
        }
        return res.json({
            status: "Success",
            message: "Order Placed Successfully",
        })
    }

    catch (error) {
        console.log(error);
        
        res.status(400).json({ 
            status: "Failed",
            message: "Order failed to place",
        })
    }
})


////// Get order history of particular user 
// router.get('/get-order-history', authenticateToken, async (req, res) => {
//     try {

//         const  {id} = req.params ; 
//         const userData = await User.findById(id ).populate({
//             path: 'orders',
//             populate :  {path : "book"} 
//         });
//         const orderData = userData.orders.reverse();

//         return res.json({
//             status: "Success",
//             message: "Order History Retrieved Successfully",
//             data: orderData
//             })
//     }
//     catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Invalid request in get order history" })
//         }
//      })
router.get('/get-order-history', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers; // Get `id` from headers

        // Fetch user data and populate orders
        const userData = await User.findById(id).populate({
            path: 'orders',
            populate: { path: 'book' },
        });

        if (!userData) {
            return res.status(404).json({
                status: "Failed",
                message: "User not found",
            });
        }

        const orderData = userData.orders.reverse(); // Reverse for recent orders

        return res.status(200).json({
            status: "Success",
            message: "Order history retrieved successfully",
            data: orderData,
        });
    } catch (error) {
        console.error("Error in get-order-history:", error);
        return res.status(500).json({
            status: "Failed",
            message: "Invalid request in get order history",
        });
    }
});


/////// get all order --- admin 
router.get('/get-all-orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({ path: "book" })
            .populate({ path: "user" })
            .sort({ createdAt: -1 });
        
        return res.json({
            status: "Success",
            message: "All Orders Retrieved Successfully",
            data: orders, // Should use `orders` here instead of `userData`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid request in get all orders" });
    }
});


/////// update order status --- admin 
router.put('/update-status/:id', authenticateToken, async (req, res) => {
try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id,{status: req.body.status })
    return res.json({
        status: "Success",
        message: "Order Status Updated Successfully",
        })
    
} catch (error) {
    console.log(error)
    res.status(500).json({ message: "Invalid request in update order" })
}

})


module.exports = router;
