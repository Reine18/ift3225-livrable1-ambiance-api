const Location= require("../models/Location");
const getLocation = async (req, res) => {
    try{
        const location =await Location.find() // on recupere tous les documents de la collection Location
        .select("idLocation name latitude longitude")
        .sort({name: 1}); //on trie les resultats par name en ordre croissant 

        return res.status(200).json({
            sucess: true,
            count: locations.length,
            data: locations,
        });
        
    } catch(error){
        return res.status(500).json({
            sucess: false,
            message: "erreur lors de la recuperation des lieux",
            error:error.message,
        });

    }
};

module.exports={
    getLocations,
};