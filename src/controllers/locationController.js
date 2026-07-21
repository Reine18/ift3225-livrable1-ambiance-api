const Location= require("../models/Location");
const getLocations = async (req, res) => {
    try{
        const locations =await Location.find() // on recupere tous les documents de la collection Location
        .select("idlocation name latitude longitude")
        .sort({name: 1}); //on trie les resultats par name en ordre croissant 

        return res.status(200).json({
            success: true,
            count: locations.length,
            data: locations,
        });
        
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "erreur lors de la recuperation des lieux",
            error:error.message,
        });

    }
};

module.exports={
    getLocations,
};