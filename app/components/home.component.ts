import {Component, OnInit, ElementRef} from '@angular/core';
import {AdalService} from 'ng2-adal/core';
import {GetDataService} from '../services/data.service';
import {Attribute} from './class/attribute.class';
import { ModalService } from '../services/index';

import {SelectItem} from 'primeng/primeng';


@Component({
  selector: 'home',
  templateUrl: 'app/components/home.html'
})
export class HomeComponent implements OnInit {

  systemOfOrigins = new Array();
  channels: SelectItem[];
  contentTypes = new Array();
  priorities = new Array();
  renditions: SelectItem[];
  workflows = new Array();
  archivalRules = new Array();
  formats = new Array();
  defaultSoO = '';
  defaultPriority = '';
  selectedContentType: any;
  isRush = false;
  selectedPriority: any;
  intputReason = '';
  formatSelected: any;
  name = new Array();
  value = new Array();
  attributes = new Array<Attribute>();
  codeSet: any = [];
  codeValues: any = [];
  codeSetDelta: any = [];
  templates = new Array();
  selectedTemplate: any;
  id: number;
  seletedChannels = [];
  selectedDirList = [];
  renditionSelected: any;
  wfSelected: any;
  archRuleSelect: any;
  attributeResult = new Array();
  display: boolean = false;


  constructor(private adalService: AdalService,
              private dataService: GetDataService,
              private modalService: ModalService,
              private elementRef:ElementRef) {
    this.workflows = [{'name': ''}];
  }

  public logOut() {
    this.adalService.logOut();
  }

  loadData() {

    this.dataService.getSystemOrigin()
      .subscribe((data: any) => {
        this.systemOfOrigins = data['value'];
        this.defaultSoO = this.systemOfOrigins[9];
      });

    this.dataService.getPriority()
      .subscribe((data: any) => {
        this.priorities = data['value'];
      });

    this.dataService.getChannel()
      .subscribe((data: any) => {
        this.channels = data['value'];
        this.channels.map(cha => {
          cha.label = cha['ChannelName'];
          cha.value = cha['ChannelId'];
        })
      });

    this.dataService.getContentType()
      .subscribe((data: any) => {
        this.contentTypes = data['value'];
        this.selectedContentType = this.contentTypes[1];
      });

    this.dataService.getRen()
      .subscribe((data: any) => {
        this.renditions = data['value'];
        this.renditions = this.renditions.filter(ren => {
          return ren['IsDigital'] === true;
        });
        this.renditions.map(ren=>{
          ren.label = ren['RenditionDesc'];
          ren.value = ren['RenditionId'];
        })

      });

    this.dataService.getFormat()
      .subscribe((data: any) => {
        this.formats = data;
      });

    this.dataService.getArchivalRule()
      .subscribe((data: any) => {
        this.archivalRules = data['value'];
      });
  }

  updateWorkFlowChange(format: any): any {
    let formatId = format['FormatId'];
    this.dataService.getWorkFlow(formatId)
      .subscribe((data: any) => {
        this.workflows = data;
      });
  }




  dirResult($event) {
      this.selectedDirList = $event;
      return $event;
  }

  clearSelection() {
      this.selectedDirList = [];
  }

  deletedChannel(channel) {
      for (let i = 0; i < this.seletedChannels.length; i++) {
          if (channel.ChannelId === this.seletedChannels[i].ChannelId) {
              this.seletedChannels.splice(i, 1);
              break;
      }
      }
  }
  openModal(id: string) {
      this.modalService.open(id);

  }


  showDialog(){
    this.display = true;
  }


  getIconName() {
      return 'upload';
  }

  loadTemplates() {
    this.dataService.getTemplates()
      .subscribe((data: any) => {
        this.templates = data['value'];

      });

    this.dataService.getCodeValues()
      .subscribe((data: any) => {
        this.codeValues = data['value'];
      });

  }

  getTemplate(templateId) {
    let tmpArr = new Array<Attribute>();
    this.templates.forEach(function (x) {
      if (x.AttributeTemplateId === templateId) {
        x['AttributeTemplateValue'].forEach(function (this, z) {
          if (x.AttributeTemplateId === templateId) {
            tmpArr.push(new Attribute(z.CodeSet, z.CodeValue));
          }
        });
      }
    })
    this.attributes = tmpArr;
    this.getDelta();
  }

  getCodeSets() {
    this.dataService.getCodeSets()
      .subscribe((data: any) => {
        this.codeSet = data['value'];
      });
  }

  getDelta() {
    this.codeSetDelta = [];
    this.codeSet.forEach(x => {
      let match = false;
      this.attributes.forEach(y => {
        if (x.CodeSet1 === y.name)
          match = true;
      })
      if (!match)
        this.codeSetDelta.push(x);
    })
    this.codeSetDelta.sort((a, b) => {
      return (a.CodeSet1 < b.CodeSet1) ? -1 : 1;
    });
  }

  editAttribute(attribute, index) {
    attribute.isEditable = true;
    attribute.datatype = this.codeSet.find(t => t.CodeSet1 === attribute.name).Datatype;  // returns single obj
    let list = this.codeValues.filter(t => t.CodeSet === attribute.name);// returns array
    attribute.codeValues = [];
    list.forEach(function (x) {
      attribute.codeValues.push(x.CodeValueValue);
    });
    this.getDelta();
    let location = this.attributes.indexOf(attribute);
    this.attributes.map((att, place) => att.isEditable = (place === index) ? true : false);
  }

  deleteAttribute(attName) {
    this.attributes.splice(this.attributes.indexOf(this.attributes.find(t => t.name === attName)), 1);
  }

  addAttribute() {
    this.getDelta();
    let att = new Attribute('', '');
    this.attributes.push(att);
    this.codeSetDelta.forEach((x, index) => {
      if (index === 0) {
        att.name = x.CodeSet1;
        att.datatype = x.Datatype;
      }
      });
    att.isEditable = true;
    if (this.codeSetDelta.length <= 0) {
      alert('No More Attributes to add!');
    }
  }



  submit() {
    this.attributeResult = [];
    let currentInfo = JSON.parse(sessionStorage.getItem('currentUser'));
    let userId = currentInfo.UserId;
    let userName = currentInfo.UserName;
    let userEmail = currentInfo.Email;
    let resultChannels = [];
    this.seletedChannels.map(data => {
      resultChannels.push((data.value).toString());
    });
    console.log(this.selectedDirList, 'selected files');

    let totalSelectedFiles = [];

    this.selectedDirList.map(data => {
      let eachFile = {};
      eachFile['Title'] = data.name;
      eachFile['FileName'] = data.fullPhysicalPath.replace(/%7c/g, '\\');
      totalSelectedFiles.push(eachFile);
    });

    this.attributes.map(attribute => {
      let obj = {};
      obj['name'] = attribute.name;
      obj['value'] =  attribute.value;
      this.attributeResult.push(obj);
    });

    // console.log('total selected files', totalSelectedFiles, (this.selectedPriority.Priority_Id).toString());
    let ingestItem = {
      'SubmittedBy': userName.toString(),
      'UserId': userId.toString(),
      'UserEmail': userEmail.toString(),
      'SystemOfOrigin': 'X',
      'ContentTypeId': (this.selectedContentType.ContentTypeId).toString(),
      'Channels': resultChannels,
      'PriorityId': (this.selectedPriority.Priority_Id).toString(),
      'RushReason': this.intputReason,
      'RenditionId': (this.renditionSelected.RenditionId).toString(),
      'FormatId': (this.formatSelected.FormatId).toString(),
      'WorkFlowId': (this.wfSelected.WorkflowTemplateId).toString(),
      'ArchivalRuleId': (this.archRuleSelect.ArchivalRuleId).toString(),
      'Attributes': this.attributeResult,
      'Files': totalSelectedFiles
    }
    console.log('ingest item', JSON.stringify(ingestItem));
    //this.dataService.submitBulkIngest(JSON.stringify(ingestItem));

  }
// ngAfterViewInit() {
//      this.loadData();
//     this.getCodeSets();
//     this.loadTemplates();
//   var s = document.createElement("script");
//   s.type = "text/javascript";
//   s.src = "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js";
//   this.elementRef.nativeElement.appendChild(s);
// }

  ngOnInit() {
    this.loadData();
    this.getCodeSets();
    this.loadTemplates();

  }
}

