import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GetDataService } from '../services/data.service';
import { ModalService } from '../services/index';
import Library   from './class/library.class';
import Directory from './class/directory.class';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';



@Component({
  selector: 'upload',
  templateUrl: 'upload.html',
  moduleId: module.id.toString()
})


export class UploadComponent implements OnInit {
  @Input() updatedResult;
  @Output() selectedDir = new EventEmitter();


    currLib: Library;
    allCheck: boolean;
    libraries = new Array<Library>();
    allIsChecked: boolean = false;
    isSubChecked: boolean = false;


    constructor (private dataService: GetDataService, private modalService: ModalService) {}
    loadLibrary() {
          this.dataService.getLibraries()
          .subscribe((data: any) => {
            data.map(library => this.libraries.push(new Library(library['Id'], library['Description'], library['PhysicalPath'])));
          });
  }

    closeModal(id: string) {
      this.currLib = null;
      this.modalService.close(id);
    }

    getSubFolder(library) {
      this.currLib = library;
      this.currLib.directories = [];

      this.dataService.getChildLibrary(library.id, '')
          .subscribe((data: any) => {
                 data.map(dir =>  this.currLib.directories.push(new Directory(library.id, dir['name'], dir['relativePath'], dir['fullPath'], dir['isDirectory'], 1, null)));
      });
    }

  selectAll(directories) {
    this.allCheck = this.isAllSelected(directories);
    this.allCheck = !this.allCheck;
     directories.map(dir => {
       dir.isSelected = (this.allCheck && !dir.isDirectory) ? true : false;
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

  updateSelectAll() {
      let currDirList = this.currLib.directories;
      this.allCheck = true;
      currDirList.map(curDir => {
        this.allCheck = (!curDir.isDirectory && !curDir.isSelected) ? false : this.allCheck;
      });
  }

  isLatestLevel(childrenList){
    let isLatest = true;
    childrenList.map(child => {
      isLatest = child.children.length > 0 ? false : isLatest;
    })
    return isLatest;
  }

  updateCurrLib() {
    this.currLib = null;
  }


  submit() {
    if(this.currLib.directories) {
      let dirArr = this.currLib.directories;
      this.updatedResult = this.getSelected(dirArr,  this.updatedResult);
      this.selectedDir.emit( this.updatedResult);
      console.log('final result',  this.updatedResult);
    }

  }

  getSelected(dirList, resultArr) {
    for(let i = 0; i < dirList.length; i++){
      let singleDir = dirList[i];
      if(singleDir.children.length > 0){
        return this.getSelected(singleDir.children, resultArr);
      }else{
        if(singleDir.isSelected){
          resultArr.push(singleDir);
        }
      }
    }
    return resultArr;
  }

  clearSelection(){
    this.updatedResult = [];
    this.selectedDir.emit(this.updatedResult);
    this.currLib = null;
  }

    ngOnInit () {
        this.loadLibrary();
    }
}
