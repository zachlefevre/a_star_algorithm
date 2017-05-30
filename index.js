console.log("index.js loaded");
var w;
var h;

var cols = 25;
var rows = 25;
var grid;

var openSet = [];
var closedSet = [];
var start;
var end;

var path = [];

function Spot(x_,y_){
  this.x = x_;
  this.y = y_;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.parent = null;

  this.wall = false;

  if(random(1)<.3){
    this.wall= true;
  }
}
Spot.prototype.show = function(color){
  fill(color);
  if(this.wall){
    fill(0);
  }
  noStroke();
  rect(this.x*w, this.y*h, w-1, h-1)
}
Spot.prototype.addNeighbors = function(grid){
  if(this.x < cols-1){
    this.neighbors.push(grid[this.x+1][this.y]);
  }
  if(this.x > 0) {
    this.neighbors.push(grid[this.x-1][this.y]);
  }
  if(this.y < rows-1){
    this.neighbors.push(grid[this.x][this.y+1]);
  }
  if(this.y > 0){
    this.neighbors.push(grid[this.x][this.y-1]);
  }
  if(this.y > 0 && this.x > 0){
    this.neighbors.push(grid[this.x-1][this.y-1])
  }if(this.y < rows-1 && this.x < cols-1){
    this.neighbors.push(grid[this.x+1][this.y+1])
  }if(this.y < rows-1 && this.x > 0){
    this.neighbors.push(grid[this.x-1][this.y+1])
  }if(this.y > 0 && this.x < cols-1){
    this.neighbors.push(grid[this.x + 1][this.y-1])
  }
}



function setup(){
  createCanvas(400,400);
  w = width/cols;
  h = height/rows;
  grid = new Array(cols);
  for(var i = 0; i < cols; i++){
    grid[i] = Array(rows);
  }

  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j] = new Spot(i,j);
    }
  }

  for(var i = 0; i < cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[rows-1][cols-1]
  start.wall = false;
  end.wall = false;
  openSet.push(start);

}

function draw(){
  background(150);

  if(openSet.length > 0){
    var lowestIndex  = 0;
    for(var i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[lowestIndex].f){
        lowestIndex = i;
      }
    }
    var current = openSet[lowestIndex]
    if(current === end){
      noLoop();
      console.log("DONE!");
    }
    removeFromArray(openSet, current);
    closedSet.push(current);

    for(var i = 0; i < current.neighbors.length; i++){
      if(!closedSet.includes(current.neighbors[i]) && !current.neighbors[i].wall){
        tentativeG = current.g + 1;
        if(openSet.includes(current.neighbors[i])){
          if (tentativeG < current.neighbors[i].g){
            current.neighbors[i].g = tentativeG;
            current.neighbors[i].prev = current;
          }
        }else{
          openSet.push(current.neighbors[i])
          current.neighbors[i].g = tentativeG;
        }

        current.neighbors[i].h = heuristic(current.neighbors[i],end);
        current.neighbors[i].f = current.neighbors[i].g + current.neighbors[i].h
      }

    }
  }else{
    console.log("no solution");
    noLoop()
    //no solution
  }

  for(var i = 0; i < cols; i++){
    for(var j= 0; j < rows; j++){
      grid[i][j].show(color(255));
    }
  }

  for(var i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(255,0,0));
  }

  for(var i = 0; i < openSet.length; i++){
    openSet[i].show(color(0,255,0));
  }

  var temp = current;
  path = []
  path.push(temp);
  while(temp.prev){
    path.push(temp.prev);
    temp = temp.prev
  }


  for(var i = 0; i < path.length; i++){
    path[i].show(color(0,0,255));
  }


}

function removeFromArray(array, toRemove){
  for(var i = array.length; i >=0 ; i--){
    if(array[i] == toRemove){
      array.splice(i,1);
    }
  }
}

function heuristic(a, b){ //euclidean distance
  //return dist(a.x, a.y, b.x, b.y);
  return(abs(a.x-b.x) + abs(a.y-b.y))

}
