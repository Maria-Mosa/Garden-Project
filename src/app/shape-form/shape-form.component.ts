import { Component, OnInit, Input } from '@angular/core';
import {Subject} from 'rxjs';

import { Shape } from '../shape';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shape-form',
  templateUrl: './shape-form.component.html',
  styleUrls: ['./shape-form.component.css']
})
export class ShapeFormComponent implements OnInit {
  constructor(private router : Router) { }
  @Input() shapesToEdit:Shape[]=[];
  @Input() editedShape:Subject<Shape>= new Subject<Shape>();

  // a local reference to the currentShape, useful for [(ngModel)]
  localCurrent:Shape= new Shape;

  // subscribe the local currentShape to the global Subject
  ngOnInit() {
    this.editedShape.subscribe(x=>this.localCurrent=x);
  }
  // when the shape changes, make the current shape subject emit
  shapeChanged(e:Event){
    this.editedShape.next(this.localCurrent);
  }
}
