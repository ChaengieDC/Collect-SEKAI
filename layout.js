// JS du LAYOUT
/* --------- */

// Fonction de chargement du contenu de fichiers HTML vers d'autres fichiers
function loadContent(file, targetElement){
    fetch(file)
        .then(response =>{
            return response.text();
        })
        .then(data =>{
            targetElement.innerHTML = data;
        })
        .catch(error =>{
            console.error(`Une erreur est survenue lors du chargement: ${error}`);
        });
}
// Chargement du contenu de la navbar (nav.html)
let headerElement = document.querySelector("header");
loadContent("nav.html", headerElement);
// Chargement du contenu du footer (footer.html)
let footerElement = document.querySelector("footer");
loadContent("footer.html", footerElement);