import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LogoutService } from '../services/logout.service';

import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {

  user = {
    name: 'USER',
    email: 'user@user.com',
    branch: 'BranchTemp',
  };

  slideOpts = {
    slidesPerView: 3,
    initialSlide: 0,
    speed: 400
  };

  userCourses = {
    course1: "course1",
    course2: "course2",
    course3: "course3",
    course4: "course4"
  };

  leng = Object.keys(this.userCourses).length;

  userBranchCourses = {
    course1: "course1",
    course2: "course2",
    course3: "course3",
    course4: "course4"
  };

  leng2 = Object.keys(this.userBranchCourses).length;

  constructor(private platform: Platform,
              private logoutService: LogoutService,
              private menuController: MenuController
            ){
    menuController.enable(true);

  }

  ngOnInit() {

  }

  openMenu(event){
    if(event==='home'){
      this.menuController.enable(true,'homeList');
      this.menuController.enable(false,'userList');
    } else {
      this.menuController.enable(true,'userList');
      this.menuController.enable(false,'homeList');
    }
    this.menuController.toggle();
  }
}
