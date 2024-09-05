// MIDDLEWARE.JS = Opérations intermédiaires
/* -------------------------------------- */

// Fonction pour rediriger un utilisateur selon son état d'authentification
function authenticationRedirect(req, res, next){
    // Si l'utilisateur est connecté:
    if(req.session.user){
        if(req.originalUrl === "/login.html" || req.originalUrl === "/signup.html"){
            return res.redirect("/");
        }
    // S'il ne l'est pas:
    } else{
        if(req.originalUrl === "/settings.html"){
            return res.redirect("/login.html");
        }
    }
    next();
}


module.exports = { authenticationRedirect };