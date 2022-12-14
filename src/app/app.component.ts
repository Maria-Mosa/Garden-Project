import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';

import { Shape } from './shape';
import { ShapeService } from './shape.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  template: '<ejs-dropdownlist id="ddlelement"> </ejs-dropdownlist>',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Angular initializes the ShapeService 
  // and other constructor parameters via dependency injection
  constructor(private shapeService: ShapeService,
    private route: ActivatedRoute,
    private router: Router) { }

  title: string = 'Shape editor';
  shapes: Shape[] =[];
  currentShape = new BehaviorSubject<Shape>(null as any);

  findShape=(x:any) => x < 0 ? 1 : x + 1;

  ngOnInit() {
    // invoke the shape service
    this.shapes = this.shapeService.getShapes();

    // when current shape changes, navigate the router 
    this.currentShape.subscribe(shape =>
      this.router.navigate(['/shape', this.findShape(
        this.shapes.findIndex(sh => sh == shape))])
        );

    // when the route changes, change currentShape    
    this.route.params.pipe(map((p:any) => p.id))
      .subscribe((id:any) => this.currentShape.next(this.shapes[id - 1]));
  }
}
