// MIDDLEWARE.JS = Opérations intermédiaires
/* -------------------------------------- */

// Fonction pour rediriger un utilisateur selon son état d'authentification
function authenticationRedirect(req, res, next){
    if(req.session.user && req.originalUrl === "/login.html" || req.session.user && req.originalUrl === "/signup.html"){
        return res.redirect("/index.html");
    }
    next();
}


module.exports = { authenticationRedirect };