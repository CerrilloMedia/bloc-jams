var animatePoints = function() {

    var points = document.getElementsByClassName('point');
    
    var revealPoint = function(arg) {
            points[arg].style.opacity = 1;
            points[i].style.color = "rgb(233,50,117)";
            points[i].getElementsByTagName('span')[0].style.color = "rgb(255,255,255)";
            points[arg].style.transform = "scaleX(1) translateY(0)";
            points[arg].style.msTransform = "scaleX(1) translateY(0)";
            points[arg].style.WekitTransform = "scaleX(1) translateY(0)";
    };
        
    for ( var i = 0; i < points.length ; i++) {
        revealPoint(i);
    }

};