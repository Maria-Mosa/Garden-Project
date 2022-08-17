import { Injectable } from '@angular/core';
import { Shape } from './shape';

@Injectable()
export class ShapeService {

  private shapes:Shape[]=[
    {type:'ellipse', x:10, y:10, w:12, h:34,id:1},
    {type:'line', x:60, y:20, w:12, h:34,id:2},
    {type:'rectangle', x:30, y:30, w:12, h:34,id:3},
    {type:'circle', x:70, y:50, w:25, h:34,id:4},
    {type:'Half-circle', x:75 ,y:55, w:35, h:34,id:5}

    

  ];
  getShapes(){return this.shapes;}
}
