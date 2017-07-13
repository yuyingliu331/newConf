import { Component, Input, Output, EventEmitter } from '@angular/core';
import Directory  from './class/directory.class';
import { GetDataService } from '../services/data.service';


@Component({
  selector: 'sub-folder',
  template: `
 
      <div class="clearfix folder-list" >
          <div *ngIf="directory.isDirectory === false && directory.checkEnable" class="checkbox checkbox-info">
            <input name="singleSelected" type="checkbox" (click)="selectSingle(directory)" [(ngModel)]="directory.isSelected" [ngModelOptions]="{standalone: true}">
            <label> </label>
          </div>
            <i *ngIf="directory.isDirectory == false" class="fa fa-file-video-o" aria-hidden="true"></i>
            <i *ngIf="directory.isDirectory == true" class="fa fa-folder-o"></i>
              <span class="folder-list-items" (click)="loadFolders(directory)">
                {{directory.name}}
              </span>
          <i class="fa fa-angle-right pull-right" aria-hidden="true"></i>
        </div>
  `

})
export class SubFolderComponent {


 @Input() library;
 @Input() directory;
 @Output() selectLib = new EventEmitter();
 @Output() selectDir = new EventEmitter();
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
        data.map(d => dir.children.push(new Directory(dir.parentId, d['name'], d['relativePath'], d['fullPath'], d['isDirectory'], dir.level + 1, dir)));

      });
    this.selectDir.emit(dir);
  }

  selectAll(directories) {
    this.subAllSelected = this.isAllSelected(directories);
    this.subAllSelected = !this.subAllSelected;
    directories.map(dir => {
      dir.isSelected = (this.subAllSelected && !dir.isDirectory) ? true : false;
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
