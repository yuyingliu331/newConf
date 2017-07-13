import { Component, Input, Output, EventEmitter } from '@angular/core';
import Directory  from './class/directory.class';
import { GetDataService } from '../services/data.service';


@Component({
  selector: 'sub-folder',
  template: `    
    <div class="right-folder-list">
      <div *ngIf="directory.isDirectory === false && directory.checkEnable" style="display: inline-block">
          <input name="singleSelect" type="checkbox" (click)="selectSingle(directory)" [(ngModel)]="directory.isSelected" [ngModelOptions]="{standalone: true}">
      </div>
          <i fa [name]="getIcon(directory)" style="color: blue"></i>
          <span (click)="loadFolders(directory)">{{directory.name}}</span>
  </div>
      <div *ngIf="directory.children.length > 0"  style="position: relative; left: 150px;">
          <input type="checkbox" name="selectChild" (click)="selectAll(directory.children)" [ngModel]="isAllSelected(directory.children)" [ngModelOptions]="{standalone: true}"> 
        <strong>Select All</strong>
        <div class="children" *ngFor="let childDir of directory.children">
          <sub-folder [directory]="childDir" (selectLib)="updateChildAll(childDir)"></sub-folder>
        </div>
      </div>
  `

})
export class SubFolderComponent {

 @Input() directory;
 @Input() library;
 @Output() selectLib = new EventEmitter();
 subAllSelected: boolean;


 constructor(private  dataService: GetDataService) {}

  loadFolders(dir) {
    let currentDir = dir.parentDir ? dir.parentDir.children : this.library.directories;
      currentDir.map(singleDir => {
        singleDir.children = [];
        singleDir.checkEnable = dir.isDirectory ? false : true;
        singleDir.isSelected = false;
      });

    this.dataService.getChildLibrary(dir.parentId, dir.path)
      .subscribe((data: any) => {
        data.map(d => dir.children.push(new Directory(dir.parentId, d['name'], d['relativePath'], d['fullPath'], d['isDirectory'], dir.level+1, dir)));
      });
  }

  selectAll(directories) {
    this.subAllSelected = this.isAllSelected(directories);
    this.subAllSelected = !this.subAllSelected;
    directories.map(dir => {
      dir.isSelected = (this.subAllSelected && !dir.isDirectory) ? true: false;
    });
  }

  isAllSelected(childrenList) {
    let selected = false;
    childrenList.map(child => {
      selected = (!child.isDirectory) ? true : selected;
    });
    childrenList.map(child => {
      selected = (!child.isDirectory && !child.isSelected) ? false : selected;
    });
    return selected;
  }

  selectSingle(directory) {
    directory.isSelected = !directory.isSelected;
    this.selectLib.emit(directory);
  }

  updateChildAll(childDir) {
    if(childDir.parentDir) {
      let currentChild = childDir.parentDir.children;
      this.subAllSelected = false;
      currentChild.map(oneChild => {
          this.subAllSelected = (!oneChild.isDirectory && !oneChild.isSelected) ? false : this.subAllSelected;
      });
    }
  };

  isLatestLevel(childrenList) {
    let isLatest = true;
    childrenList.map(child => {
      isLatest = child.children.length > 0 ? false : isLatest;
    })
    return isLatest;
  }

   getIcon(folder) {
     return folder['isDirectory'] ? 'folder' : 'file';
   }
}
