import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit, Input } from '@angular/core';
import { convertPixelToValue } from '@syncfusion/ej2/lineargauge';
import { fontColor } from '@syncfusion/ej2/spreadsheet';
import { CircleShape } from 'ng2-canvas-whiteboard';
import {map, Subject} from 'rxjs';
import * as $ from "jquery";

import { Shape } from '../shape';
let count=6;
let indexOfCut =0;
var cuts:string[] = [] 
@Component({
  selector: 'app-canvas',
  templateUrl: './canvans.component.html',
  styleUrls: ['./canvans.component.css']
})
export class CanvasComponent implements OnInit {
  constructor() { }
  @Input() shapesToDraw: Shape[]=[];
  shapeType = 'rectangle';
  setType(type: string) { this.shapeType = type; }

  @Input() currentShape: Subject<Shape>  = new Subject<Shape>();

  ngOnInit() { }

  // the shape being just drawn
  createdShape: Shape = new Shape;

  //method that start drawing when user click on the mouse
  startDrawing(evt: MouseEvent) {
    this.createdShape = {
      type: this.shapeType,
      x: evt.offsetX,
      y: evt.offsetY,
      w: 0,
      h: 0,
      id:count++
    };
    this.shapesToDraw.push(this.createdShape);
  }

  //method that continue to draw while user clicking on the mouse
  keepDrawing(evt: MouseEvent) {
    if (this.createdShape) {
      this.currentShape.next(this.createdShape);
      this.createdShape.w = evt.offsetX - this.createdShape.x;
      this.createdShape.h = evt.offsetY - this.createdShape.y;
    }
  }

  //method that stop drawing when user release the mouse
  stopDrawing(evt: MouseEvent) {
    this.createdShape =null as any;
    
  }


//helping method that return the nearest 2 lines for specefic index 
returnNe(  index2: any,w_h:any ,mapH:any,mapW:any , sizeId:any){
  if (index2<0){
    return[-6,-6]
  }
//if w
let x=10;
let id1=-1;
let id2=-1;
let x_w=10;
let len = sizeId;
index2=index2+5;
if(w_h=='h'){
  for(let i=5; i<len;i++){
    if(i!=index2-1){
     if( (Math.abs(Math.abs(this.shapesToDraw[i].y) -Math.abs(this.shapesToDraw[index2-1].y))< x ) && Math.abs(this.shapesToDraw[i].h)<25) {
      x=Math.abs(this.shapesToDraw[i].y) -Math.abs(this.shapesToDraw[index2-1].y);
      x=Math.abs(x);

    
id1=i+1;
     }
      else if((Math.abs((Math.abs(this.shapesToDraw[index2-1].y)+Math.abs(this.shapesToDraw[index2-1].h)) -Math.abs(this.shapesToDraw[i].y))< x_w) && Math.abs(this.shapesToDraw[i].h)<25){
      x_w=Math.abs((Math.abs(this.shapesToDraw[index2-1].y)+Math.abs(this.shapesToDraw[index2-1].h)) -Math.abs(this.shapesToDraw[i].y));
      x_w=Math.abs(x_w);

      id2=i+1;
      }

      else if(( Math.abs(Math.abs(this.shapesToDraw[i].y) -(Math.abs(this.shapesToDraw[index2-1].y)-Math.abs(this.shapesToDraw[index2-1].h)))< x_w) && Math.abs(this.shapesToDraw[i].h)<25){
      x_w=Math.abs(this.shapesToDraw[i].y) -(Math.abs(this.shapesToDraw[index2-1].y)-Math.abs(this.shapesToDraw[index2-1].h));
      x_w=Math.abs(x_w);

      id2=i+1;
      }
  }
  }
if(mapW.get(id1-5)==undefined)
id1= -1;
if(mapW.get(id2-5)==undefined)
id2= -1;
}

  else if(w_h=='w'){
    for(let i=5; i<len;i++){

      if(i!=index2-1){
       if( (Math.abs(Math.abs(this.shapesToDraw[i].x) -Math.abs(this.shapesToDraw[index2-1].x))< x ) && Math.abs(this.shapesToDraw[i].w)<25) {
        x=Math.abs(Math.abs(this.shapesToDraw[i].x) -Math.abs(this.shapesToDraw[index2-1].x));
       x=Math.abs(x);

           id1=i+1;
       }
       
        else if((Math.abs((Math.abs(this.shapesToDraw[index2-1].x)+Math.abs(this.shapesToDraw[index2-1].w) -Math.abs(this.shapesToDraw[i].x)))< x_w) && Math.abs(this.shapesToDraw[i].w)<25){
        x_w=Math.abs((Math.abs(this.shapesToDraw[index2-1].x)+Math.abs(this.shapesToDraw[index2-1].w)) -Math.abs(this.shapesToDraw[i].x));
        id2=i+1;
        x_w=Math.abs(x_w);

        }
        else if(( Math.abs(Math.abs(this.shapesToDraw[i].x) - (Math.abs(this.shapesToDraw[index2-1].x)-Math.abs(this.shapesToDraw[index2-1].w))) < x_w) && Math.abs(this.shapesToDraw[i].w)<25){
          x_w=Math.abs(Math.abs(this.shapesToDraw[i].x) - (Math.abs(this.shapesToDraw[index2-1].x)-Math.abs(this.shapesToDraw[index2-1].w)));
          id2=i+1;
          x_w=Math.abs(x_w);

          }
    }
    }
    if(mapH.get(id1-5)==undefined)
    id1= -1;
    if(mapH.get(id2-5)==undefined)
    id2= -1;
  }
   console.log("NEWWW JERAN")
   console.log([id1-5,id2-5]);
  return [id1-5,id2-5];
}


// method that return the solution - optimal cuts
solution(){
  // const d = document.getElementById("shapetoclear") as HTMLCanvasElement;
  // d.innerHTML = "1111111111111" ;
  let sx: Shape = new Shape;
  let sizeId = this.shapesToDraw.length;
  let sizeIdChange = this.shapesToDraw.length;
  console.log("***** NEWWWWWW CLICK ON THE BUTTON SOLUTION *****")
  cuts = [];
  indexOfCut =0;
  const textarea = document.getElementById("your_textarea") as HTMLInputElement;
  let mapW = new Map();
  let mapH = new Map();
let len = this.shapesToDraw.length;
let count =0;
    this.shapesToDraw.forEach(function(v,index){
      if(index>4){
        if(Math.abs(v.h)<10)
      mapW.set(index-4,Math.abs(v.w));
      if(Math.abs(v.w)<10)
      mapH.set(index-4,Math.abs(v.h));
      }
    });
mapH = new Map([...mapH.entries()].sort((a, b) => b[1] - a[1]));
mapW = new Map([...mapW.entries()].sort((a, b) => b[1] - a[1]));

while((mapH.size>0 &&mapW.size >0 )){


  if(mapW.has(-6) || mapH.has(-6))
    break;
mapH = new Map([...mapH.entries()].sort((a, b) => b[1] - a[1]));
mapW = new Map([...mapW.entries()].sort((a, b) => b[1] - a[1]));

  // console.log("NEWWWWWWWWW LOOPPPPPPP")
  // console.log("MAP OF H")
  // console.log(mapH)
  // console.log("MAP OF W")
  // console.log(mapW)
  // console.log("**********************")
var twoNe;
let minNe;
let id_min;
let max;

if(mapH.get(mapH.entries().next().value[0]) >= mapW.get(mapW.entries().next().value[0])){ 
  max = mapH.get(mapH.entries().next().value[0]);
  console.log(mapH.entries().next().value[0].x)
  twoNe = this.returnNe(mapH.entries().next().value[0],'h',mapH,mapW,sizeId);
  if(((Math.abs(mapW.get(twoNe[0]))>=Math.abs(mapW.get(twoNe[1]))) && (mapW.get(twoNe[1])!=undefined)) ||
  (mapW.get(twoNe[1])!=undefined && mapW.get(twoNe[0])==undefined )){
  minNe=Math.abs(mapW.get(twoNe[1]));
  if(minNe<=100){
    var twoToDelete =  this.returnNe(twoNe[1],'w',mapH,mapW,sizeId);
    var twoToUpdate =  this.returnNe(twoNe[0],'w',mapH,mapW,sizeId);
    if(max>=300){
      console.log(indexOfCut +"-) There is a cut : "+ minNe + ", and " + 300);
      // sx = {
      //   type: this.shapeType,
      //   x: this.shapesToDraw[twoNe[1]+4].x,
      //   y: this.shapesToDraw[twoNe[1]+4].y,
      //   w: 10,
      //   h: 100,
      //   id:9
      // };
      // this.shapesToDraw.push(sx);  
      cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ minNe + ", and " + 300;
      indexOfCut = indexOfCut+1;
      if(mapH.get(twoToDelete[0])< max)
      mapH.delete(twoToDelete[0]);
    else if(mapH.get(twoToDelete[1])< max)
      mapH.delete(twoToDelete[1]);
      mapH.set(mapH.entries().next().value[0],max-300);
    }
else{
    console.log(indexOfCut +"-) There is a cut : "+ minNe + ", and " + max)
    // console.log("faaaaat1")
    // sx = {
    //   type: this.shapeType,
    //   x: Number(Math.abs(this.shapesToDraw[twoNe[1]+4].x)),
    //   y: Number(Math.abs(this.shapesToDraw[twoNe[1]+4].y))-max-10,
    //   w: 0,
    //   h: max+20,
    //   id:sizeIdChange+1
    // };
    // this.shapesToDraw.push(sx); 
    sizeIdChange+=1; 
    cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ minNe + ", and " + max;
    indexOfCut = indexOfCut+1;
    mapW.set(twoNe[0],Math.abs(mapW.get(twoNe[0]))-minNe);
    
    if(((mapH.get(twoToDelete[0])<=300|| mapH.get(twoToDelete[0])==undefined) && (mapH.get(twoToDelete[1])<=300 || mapH.get(twoToDelete[1])==undefined  ))){
      mapW.delete(twoNe[1]);  // delete min
    }
    if(mapH.get(twoToDelete[0])<=300  &&(twoToUpdate[0]>0 && twoToUpdate[1]>0 )){
       mapH.delete(twoToDelete[0]);
    }
    else if(mapH.get(twoToDelete[0])>300){
      mapH.set(twoToDelete[0],mapH.get(twoToDelete[0])-300);
    }
    if(mapH.get(twoToDelete[1])<=300&&(twoToUpdate[0]>0 && twoToUpdate[1]>0 ) ){
      mapH.delete(twoToDelete[1]);

    }
    else if((mapH.get(twoToDelete[1])>300) ){
      mapH.set(twoToDelete[1],mapH.get(twoToDelete[1])-300);
    }
  }
}
  else if(twoNe[1]>0) {
    if(max>300){
      mapW.set(twoNe[1],Math.abs(mapW.get(twoNe[1]))-100);
      mapH.set(mapH.entries().next().value[0],max-300);
      console.log(indexOfCut +"-) There is a cut : "+ 100 + ", and " + 300);
      cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ 100 + ", and " + 300;
      indexOfCut = indexOfCut+1;
    }
else{
    mapW.set(twoNe[1],Math.abs(mapW.get(twoNe[1]))-100);
    console.log(indexOfCut +"-) There is a cut : "+ 100 + ", and " + max);
    // console.log("faaaaat5")
    // sx = {
    //   type: this.shapeType,
    //   x: Number(Math.abs(this.shapesToDraw[twoNe[1]+4].x))-100,
    //   y: Number(Math.abs(this.shapesToDraw[twoNe[1]+4].y))-max-10,
    //   w: 0,
    //   h: max+20,
    //   id:sizeIdChange+1
    // };
    // this.shapesToDraw.push(sx);  
    sizeIdChange+=1;
    cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ 100 + ", and " + max;
    indexOfCut = indexOfCut+1;
}
}
  else
  break;
id_min= twoNe[1];
  }
  else{
    
  minNe=Math.abs(mapW.get(twoNe[0]));
  var twoToDelete =  this.returnNe(twoNe[0],'w',mapH,mapW,sizeId);
  var twoToUpdate =  this.returnNe(twoNe[1],'w',mapH,mapW,sizeId);
  if(minNe<=100){
    if(max>=300){
      console.log(indexOfCut +"-) There is a cut : "+ minNe + ", and " + 300);
      cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ minNe + ", and " + 300;
      indexOfCut = indexOfCut+1;
      if(mapH.get(twoToDelete[0])< max)
        mapH.delete(twoToDelete[0]);
      else if(mapH.get(twoToDelete[1])< max)
        mapH.delete(twoToDelete[1]);
      mapH.set(mapH.entries().next().value[0],max-300);
    }
else{
  if(Math.abs(mapH.get(twoNe[1]))<=100){
    console.log(indexOfCut +"-) There is a cut : "+ Math.abs(mapW.get(twoNe[0])) + ", and " + max);
    // console.log("faaaaat3")
    // sx = {
    //   type: this.shapeType,
    //   x: this.shapesToDraw[twoNe[0]+4].x+this.shapesToDraw[twoNe[0]+4].w-(minNe-100),
    //   y: this.shapesToDraw[twoNe[0]+4].y-max-10,
    //   w: 0,
    //   h: max+20,
    //   id:sizeIdChange+1
    // };
    // this.shapesToDraw.push(sx);
  sizeIdChange+=1;
  cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ Math.abs(mapW.get(twoNe[1])) + ", and " + max;
  indexOfCut = indexOfCut+1;
  mapW.delete(twoNe[1]);
  }
  else{
    console.log(indexOfCut +"-) There is a cut : "+ minNe + ", and " + max)
    // console.log("faaaaat4")
    // sx = {
    //   type: this.shapeType,
    //   x: (Number(Math.abs(this.shapesToDraw[twoNe[0]+4].x))+Number(Math.abs(this.shapesToDraw[twoNe[0]+4].w))-minNe),
    //   y: Number(Math.abs(this.shapesToDraw[twoNe[0]+4].y))-10,
    //   w: 0,
    //   h: max+20,
    //   id:sizeIdChange+1
    // };
    // console.log("sx.x:" + sx.x)
    // this.shapesToDraw.push(sx);
    sizeIdChange+=1;
    cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ minNe + ", and " + max;
    indexOfCut = indexOfCut+1;
    mapW.set(twoNe[1],Math.abs(mapW.get(twoNe[1]))-minNe);
    
          if(((mapH.get(twoToDelete[0])<=300|| mapH.get(twoToDelete[0])==undefined) && (mapH.get(twoToDelete[1])<=300 || mapH.get(twoToDelete[1])==undefined  ))){

        mapW.delete(twoNe[0]); 
      }
      if(mapH.get(twoToDelete[0])<=300 &&(twoToUpdate[0]>0 && twoToUpdate[1]>0 )  ){
        mapH.delete(twoToDelete[0]);
     }
     else if(mapH.get(twoToDelete[0])>300){
       mapH.set(twoToDelete[0],mapH.get(twoToDelete[0])-300);
     }
     if(mapH.get(twoToDelete[1])<=300 &&(twoToUpdate[0]>0 && twoToUpdate[1]>0 ))
       mapH.delete(twoToDelete[1]);
     else if((mapH.get(twoToDelete[1])>300)){
       mapH.set(twoToDelete[1],mapH.get(twoToDelete[1])-300);
     }
    }
   }
  }
   else if(twoNe[0]>0){
    if(max>300){
      mapW.set(twoNe[0],Math.abs(mapW.get(twoNe[0]))-100);
      mapH.set(mapH.entries().next().value[0],max-300);
      console.log(indexOfCut +"-) There is a cut : "+ 100 + ", and " + 300);
      cuts[indexOfCut] =indexOfCut +"-) There is a cut : "+ 100 + ", and " + 300;
      indexOfCut = indexOfCut+1;
    }
      else{
    mapW.set(twoNe[0],Math.abs(mapW.get(twoNe[0]))-100);
    console.log(indexOfCut +"-) There is a cut : "+ 100 + ", and " + max);
    // console.log("faaaaat2")
    // sx = {
    //   type: this.shapeType,
    //   x: this.shapesToDraw[twoNe[0]+4].x+this.shapesToDraw[twoNe[0]+4].w-(minNe-100),
    //   y: this.shapesToDraw[twoNe[0]+4].y-max-10,
    //   w: 0,
    //   h: max+20,
    //   id:sizeIdChange+1
    // };
    // this.shapesToDraw.push(sx);
    sizeIdChange+=1;
    cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ 100 + ", and " + max;
    indexOfCut = indexOfCut+1;
      }
  }
   else
   break;
  id_min= twoNe[0];
  }
}
else if (mapH.get(mapH.entries().next().value[0]) <mapW.get(mapW.entries().next().value[0])){
  max= mapW.get(mapW.entries().next().value[0]);
  console.log("the max is " + max);
  twoNe = this.returnNe(mapW.entries().next().value[0],'w',mapH,mapW,sizeId); 

  if(((Math.abs(mapH.get(twoNe[0]))>=Math.abs(mapH.get(twoNe[ 1]))) && (mapH.get(twoNe[1])!=undefined)) ||
(mapH.get(twoNe[1])!=undefined && mapH.get(twoNe[0])==undefined )){
  minNe=Math.abs(mapH.get(twoNe[1]));
  id_min= twoNe[1];
  if(minNe<=100){
    var twoToDelete =  this.returnNe(twoNe[1],'h',mapH,mapW,sizeId);
    var twoToUpdate =  this.returnNe(twoNe[0],'h',mapH,mapW,sizeId);
 
    if(max>=300){
      console.log(indexOfCut +"-) There is a cut : "+ minNe + ", and " + 300);
      cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ minNe + ", and " + 300;
    //   console.log("faaaaat11")
    // sx = {
    //   type: this.shapeType,
    //   x: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].x))+300,
    //   y: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].y))-10,
    //   w: 0,
    //   h: minNe+20,
    //   id:sizeIdChange+1
    // };
    // this.shapesToDraw.push(sx);
    sizeIdChange+=1;
    indexOfCut = indexOfCut+1;
    if(mapW.get(twoToDelete[0])< max)
        mapW.delete(twoToDelete[0]);
    else if(mapW.get(twoToDelete[1])< max)
      mapW.delete(twoToDelete[1]);
    mapW.set(mapW.entries().next().value[0],max-300);
    }
else{
    console.log(indexOfCut +"-) There is a cut : "+ minNe + ", and " + max);
    console.log("faaaaat6")
    // sx = {
    //   type: this.shapeType,
    //   x: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].x))-10,
    //   y: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].y))+Number(Math.abs(this.shapesToDraw[twoNe[1]+4].h)),
    //   w: max+20,
    //   h: 0,
    //   id:sizeIdChange+1
    // };
    // this.shapesToDraw.push(sx);
    sizeIdChange+=1;
    cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ minNe + ", and " + max;
    indexOfCut = indexOfCut+1;
    mapH.set(twoNe[0],Math.abs(mapH.get(twoNe[0]))-minNe);
    if(((mapW.get(twoToDelete[0])<=300|| mapW.get(twoToDelete[0])==undefined) && (mapW.get(twoToDelete[1])<=300 || mapW.get(twoToDelete[1])==undefined  ))){
      mapH.delete(twoNe[1]);
    }
    if(mapW.get(twoToDelete[0])<=300 &&(twoToUpdate[0]>0 && twoToUpdate[1]>0 ) ){
      mapW.delete(twoToDelete[0]);
   }
   else if(mapW.get(twoToDelete[0])>300 ){
     mapW.set(twoToDelete[0],mapW.get(twoToDelete[0])-300);
   }
   if(mapW.get(twoToDelete[1])<=300 &&(twoToUpdate[0]>0 && twoToUpdate[1]>0 ))
     mapW.delete(twoToDelete[1]);
   else if((mapW.get(twoToDelete[1])>300)){
     mapW.set(twoToDelete[1],mapW.get(twoToDelete[1])-300);
   }
  }
}
  else if( twoNe[1]>0){
    if(max>300){
      mapH.set(twoNe[1],Math.abs(mapH.get(twoNe[1]))-100);
      mapW.set(mapW.entries().next().value[0],max-300);
      console.log(indexOfCut +"-) There is a cut : "+ 100 + ", and " + 300);
      cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ 100 + ", and " + 300;
      // console.log("faaaaat12")
      // sx = {
      //   type: this.shapeType,
      //   x: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].x)),
      //   y: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].y))+100,
      //   w: 300,
      //   h: 0,
      //   id:sizeIdChange+1
      // };
      // this.shapesToDraw.push(sx);
      sizeIdChange+=1;
      indexOfCut = indexOfCut+1;
    }
      else{
    mapH.set(twoNe[1],Math.abs(mapH.get(twoNe[1]))-100);
    console.log(indexOfCut +"-) There is a cut : "+ 100 + ", and " + max);
    // console.log("faaaaat7")
    // sx = {
    //   type: this.shapeType,
    //   x: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].x))-10,
    //   y: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].y))+100,
    //   w: max+20,
    //   h: 0,
    //   id:sizeIdChange+1
    // };
    // this.shapesToDraw.push(sx);
    sizeIdChange+=1;
    cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ 100 + ", and " + max;
    indexOfCut = indexOfCut+1;
      }
  }
   else
   break;
  }
  else{
  minNe=Math.abs(mapH.get(twoNe[0]));
  id_min= twoNe[0];
  var twoToDelete =  this.returnNe(twoNe[0],'h',mapH,mapW,sizeId);
  var twoToUpdate =  this.returnNe(twoNe[1],'h',mapH,mapW,sizeId);
  if(minNe<=100){
    if(max>=300){
      console.log(indexOfCut +"-) There is a cut : "+ minNe + ", and " + 300);
      cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ minNe + ", and " + 300;
      // console.log("faaaaat13")
      // sx = {
      //   type: this.shapeType,
      //   //for the second draw 
      //   x: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].x))+300,
      //   y: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].y))-10,
      //   w: 0,
      //   h: minNe+20,
      //   // for the rectangle of 500 and 170
      //   // x: Number(Math.abs(this.shapesToDraw[mapH.entries().next().value[0]+4].x))-10,
      //   // y: Number(Math.abs(this.shapesToDraw[mapH.entries().next().value[0]+4].y)),
      //   // w: 300,
      //   // h: 0,
      //   id:sizeIdChange+1
      // };
      // this.shapesToDraw.push(sx);
      sizeIdChange+=1;
    indexOfCut = indexOfCut+1;
    if(mapW.get(twoToDelete[0])< max)
        mapW.delete(twoToDelete[0]);
    else if(mapW.get(twoToDelete[1])< max)
      mapW.delete(twoToDelete[1]);
      mapW.set(mapW.entries().next().value[0],max-300);
    }
else{
    if(Math.abs(mapH.get(twoNe[1]))<=100){
      console.log(indexOfCut +"-) There is a cut : "+ Math.abs(mapH.get(twoNe[1])) + ", and " + max);
      // console.log("faaaaat8")
      // sx = {
      //   type: this.shapeType,
      //   x: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].x))-Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].w))-10,
      //   y: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].y)),
      //   w: max+20,
      //   h: 0,
      //   id:sizeIdChange+1
      // };
      // this.shapesToDraw.push(sx);
      sizeIdChange+=1;
    cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ Math.abs(mapH.get(twoNe[1])) + ", and " + max;
    indexOfCut = indexOfCut+1;
    mapH.delete(twoNe[1]);
    }
    else{
    console.log(indexOfCut +"-) There is a cut : "+ minNe + ", and " + max);
    // console.log("faaaaat9")
    //   sx = {
    //     type: this.shapeType,
    //     // x: Number(Math.abs(this.shapesToDraw[twoNe[0]+4].x))+Number(Math.abs(this.shapesToDraw[twoNe[0]+4].w))-(minNe-100),
    //     // y: Number(Math.abs(this.shapesToDraw[twoNe[0]+4].y))-max-10,
    //     // w: 0,
    //     // h: max+20,
    //     x: Math.abs(Number(Math.abs(this.shapesToDraw[mapH.entries().next().value[0]+4].x))+Number(Math.abs(this.shapesToDraw[mapH.entries().next().value[0]+4].w))-max),
    //     y: Number(Math.abs(this.shapesToDraw[mapH.entries().next().value[0]+4].y))+Number(Math.abs(this.shapesToDraw[twoNe[0]+4].h)),
    //     w: max+20,
    //     h: 0,
    //     id:sizeIdChange+1
    //   };
    //   this.shapesToDraw.push(sx);
      sizeIdChange+=1;
    cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ minNe + ", and " + max;
    indexOfCut = indexOfCut+1;
    mapH.set(twoNe[1],Math.abs(mapH.get(twoNe[1]))-minNe);
    }
      if(((mapW.get(twoToDelete[0])<=300|| mapW.get(twoToDelete[0])==undefined) && (mapW.get(twoToDelete[1])<=300 || mapW.get(twoToDelete[1])==undefined  ))){
        mapH.delete(twoNe[0]);
      }
      if(mapW.get(twoToDelete[0])<=300  &&(twoToUpdate[0]>0 && twoToUpdate[1]>0 )){
        mapW.delete(twoToDelete[0]);
     }
     else if(mapW.get(twoToDelete[0])>300){
       mapW.set(twoToDelete[0],mapW.get(twoToDelete[0])-300);
     }
     if(mapW.get(twoToDelete[1])<=300  &&(twoToUpdate[0]>0 && twoToUpdate[1]>0 ))
       mapW.delete(twoToDelete[1]);
     else if((mapW.get(twoToDelete[1])>300)){
       mapW.set(twoToDelete[1],mapW.get(twoToDelete[1])-300);
     }
  }
}
  else if(twoNe[0]>0){
    if(max>300){
      mapH.set(twoNe[0],Math.abs(mapH.get(twoNe[0]))-100);
      mapW.set(mapW.entries().next().value[0],max-300);
      console.log(indexOfCut +"-) There is a cut :  "+ 100 + ", and " + 300);
      cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ 100 + ", and " + 300;
      // console.log("faaaaat14")
      // sx = {
      //   type: this.shapeType,
      //   x: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].x))+300,
      //   y: Number(Math.abs(this.shapesToDraw[mapW.entries().next().value[0]+4].y))-10,
      //   w: 0,
      //   h: minNe+20,
      //   id:sizeIdChange+1
      // };
      // this.shapesToDraw.push(sx);
      sizeIdChange+=1;
      indexOfCut = indexOfCut+1;
    }
      else{
    mapH.set(twoNe[0],Math.abs(mapH.get(twoNe[0]))-100);
    console.log(indexOfCut +"-) There is a cut :  "+ 100 + ", and " + max);
    // console.log("faaaaat10")
    //   sx = {
    //     type: this.shapeType,
    //     x: this.shapesToDraw[twoNe[0]+4].x+this.shapesToDraw[twoNe[0]+4].w-(minNe-100),
    //     y: this.shapesToDraw[twoNe[0]+4].y-max-10,
    //     w: 0,
    //     h: max+20,
    //     id:sizeIdChange+1
    //   };
    //   this.shapesToDraw.push(sx);
      sizeIdChange+=1;
    cuts[indexOfCut] = indexOfCut +"-) There is a cut : "+ 100 + ", and " + max;
    indexOfCut = indexOfCut+1;
      }
}
  else
  break;
  }
  
}
}

// fill in the text area the cuts!
if(cuts.length ==0)
  textarea.value = ("No cuts!!");
if(textarea!=null && cuts.length !=0)
  textarea.value = cuts.join("\n");

}

// method that delete the last shape
back(){
  if(this.shapesToDraw.length>5){
      this.shapesToDraw.pop();
      count=count-1;
  }
  else
  return;
}


  // method that delete all the shapes
clear(){
  this.shapesToDraw.splice(5,this.shapesToDraw.length -1);
  count=6;
  cuts = [];
  indexOfCut =0;
}
}
