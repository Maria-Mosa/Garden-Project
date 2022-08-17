import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rset-data',
  templateUrl: './rset-data.component.html',
  styleUrls: ['./rset-data.component.css']
})
export class RsetDataComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  // button to move to another page
  goToDraw(){
    this.router.navigate(["/shape/:id"])
  }
}
