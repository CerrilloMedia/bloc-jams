var pointsArray = document.getElementsByClassName('point');
    
var animatePoints = function(points) {
    
    var revealPoint = function(index) {
            points[index].style.opacity = 1;
            points[index].style.color = "rgb(233,50,117)";
            points[index].getElementsByTagName('span')[0].style.color = "rgb(255,255,255)";
            points[index].style.transform = "scaleX(1) translateY(0)";
            points[index].style.msTransform = "scaleX(1) translateY(0)";
            points[index].style.WekitTransform = "scaleX(1) translateY(0)";
    };
        
    forEach(pointsArray, revealPoint);
    /*
    Is it ever an option to create something like:
    pointsArray.forEach(revealPoint); 
    to pass only 1 parameter or does the JS engine use the built/default forEach() function before going into the utilities.js file for my version?
    */
};

window.onload = function() {
    if (window.innerHeight > 950) {    // if div is already visible, call animatePoints
        animatePoints(pointsArray);
    }
    
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;    // for screens needing to scroll to the window, calculate the distance to the fold plus 200px into the selling-points div
    
    window.addEventListener('scroll', function(event) {
        console.log("Scroll distance: " + scrollDistance);
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance ) {
        animatePoints(pointsArray);
        }
    })
};