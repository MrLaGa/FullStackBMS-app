const express = require("express")
const Theatre = require("../models/theatreModel")
const authMiddleware = require("../middlewares/authMiddleWare")
const Show = require("../models/showModel")
const router = express.Router();


//create
router.post("/add-theatre", authMiddleware, async(req, res)=>{
    try{
      // console.log(req)
      const newtheatre = new Theatre(req.body);
      await newtheatre.save();
      res.status(200).send({
        success:true,
        message:"Theatre added successfully",
      }
      )
    }
    catch(error){
       res.status(500).send({
        success:false,
        message:"Something went wrong. Please, try again in sometime"
       })
    }
} )


//read
router.get("/get-all-theatres-by-owner", authMiddleware, async(req, res)=>{
    try{
      // console.log(req)
     
      const theatres = await Theatre.find({ owner: req.body.userId });
      
          // Theatre.find({ owner: req.body.userId });
          // console.log(theatres);
          res.status(200).send({
            success:true,
            message:"Theatres fetched successfully",
            data:theatres,
          })
    }
    catch(err){
        res.status(500).send({
            success:false,
            message:"Something went wrong. Please, try again in sometime."
        })

    }
})

router.get("/get-all-theatres", authMiddleware, async (_, response) => {
    try {
     const theatres=  await Theatre.find().populate("owner").select("-password")
      response.status(200).send({
        success: true,
        message: "Theatres fetched successfully!",
        data: theatres,
      });
    } catch (err) {
      // console.log(err)
      response.status(500).send({
        success: false,
        message: "Something went wrong. Please, try again in sometime.",
      });
    }
  });



  router.put("/update-theatre", authMiddleware, async (request, response) => {
    try {
      await Theatre.findByIdAndUpdate(request.body.theatreId, request.body);
      response.send({
        success: true,
        message: "Theatre Updated Successfully",
      });
    } catch (err) {
      response.status(500).send({
        success: false,
        message: err.message,
      });
    }
  });

  // Delete
router.delete("/delete-theatre", authMiddleware, async (request, response) => {
    try {
      await Theatre.findByIdAndDelete(request.query.theatreId);
      response.send({
        success: true,
        message: "Theatre Deleted Successfully",
      });
    } catch (err) {
      response.status(500).send({
        success: false,
        message: err.message
      });
    }
  });

  //show API
  router.post("/add-show", authMiddleware, async(req, res)=>{
    try{
      const newShow = new Show(req.body);
      await newShow.save();
      res.status(200).send({
        success:true,
        message:"Show added successfully"
      })
    }
    catch(error){
     res.status(500).send({
      success:false,
      message:error.message,
     })
    }
  })

router.post("/get-all-shows-by-theatre", authMiddleware, async(req, res)=>{
  try{
       const shows = await Show.find({theatre: req.body.theatreId}).populate("movie");
       res.status(200).send({
        success:true,
        message:"Shows fetched successfully",
        data:shows
       })
  }
  catch(err){
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
})

router.delete("/delete-show", authMiddleware, async (request, response) => {
  try {
    await Show.findByIdAndDelete(request.query.showId);
    response.send({
      success: true,
      message: "Show Deleted Successfully",
    });
  } catch (err) {
    response.status(500).send({
      success: false,
      message: err.message,
    });
  }
});


router.post(
  "/get-all-theatres-by-movie",
  authMiddleware,
  async (request, response) => {
    try {
      const { movieId, date } = request.body;
      // get all shows for the movie
      const shows = await Show.find({ movie: movieId, date })
        .populate("theatre")
        .sort({ createdAt: -1 });
      // get all unique theatres from the shows
      let uniqueTheatres = [];
      shows.forEach((show) => {
        const theatre = uniqueTheatres.find(
          (theatre) => theatre._id === show.theatre._id
        );
        if (!theatre) {
          const showsForThisTheatre = shows.filter(
            (showObj) => showObj.theatre._id == show.theatre._id
          );
          uniqueTheatres.push({
            ...show.theatre._doc,
            shows: showsForThisTheatre,
          });
        }
      });
      response.send({
        success: true,
        message: "Theatres fetched successfully",
        data: uniqueTheatres,
      });
    } catch (err) {
      response.status(500).send({
        success: false,
        message: err.message,
      });
    }
  }
);


router.post("/get-show-by-id", authMiddleware, async (req, res) => {
  try {
    const show = await Show.findById(req.body.showId)
      .populate("movie")
      .populate("theatre");

    res.send({
      success: true,
      message: "Show fetched successfully",
      data: show,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});



  
  module.exports = router;