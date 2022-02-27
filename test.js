function test(p,polygon){
  let isInside = false;
    var i = 0, j = polygon.length - 2;
  for ( i,j; i<polygon.length; j = i){
    i += 2
    console.log('this is i',i)
    console.log('this is j',j)
  
    if ( (polygon[i+1] > p.y) != (polygon[j+1] > p.y) &&
      p.x < (polygon[j] - polygon[i]) * (p.y - polygon[i+1]) / (polygon[j+1] - polygon[i+1]) + polygon[i] ) {
    isInside = !isInside;
  }
  }
  return isInside
}

function test2(p,polygon){
  let isInside = false;
  var i = 0, j = polygon.length - 1;
  for (i, j; i < polygon.length; j = i++) {
    console.log('this is i2',i)
    console.log('this is j2',j)
      if ( (polygon[i].y > p.y) != (polygon[j].y > p.y) &&
              p.x < (polygon[j].x - polygon[i].x) * (p.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x ) {
          isInside = !isInside;
      }
  }
  return isInside
}
  
test({x:0.1,y:0.1},[0,0,0,1,1,0]);
// test2({x:0.1,y:0.1},[{x:0,y:0},{x:0,y:1},{x:1,y:0}]);