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
  channels = new Array();
  contentTypes = new Array();
  priorities = new Array();
  renditions: SelectItem[];
  workflows: SelectItem[];
  archivalRules: SelectItem[];
  formats: SelectItem[];
  defaultSoO: SelectItem[];
  defaultPriority: any;
  selectedContentType: any;
  isRush = false;
  selectedPriority: any;
  intputReason = '';
  formatSelected: any;
  name = new Array();
  value = new Array();
  attributes = new Array<Attribute>();
  codeSet = new Array();
  codeValues: any = [];
  codeSetDelta= new Array();
  templates: SelectItem[];
  selectedTemplate: any;
  id: number;
  seletedChannels = [];
  selectedDirList = [];
  renditionSelected: any;
  wfSelected: any;
  archRuleSelect: any;
  attributeResult = new Array();


  constructor(private adalService: AdalService,
              private dataService: GetDataService,
              private modalService: ModalService,
              private elementRef:ElementRef) {
   // this.workflows = [{'name': ''}];
  }
  public logOut() {
    this.adalService.logOut();
  }

  loadData() {
    this.dataService.getSystemOrigin()
      .subscribe((data: any) => {
        this.systemOfOrigins = data['value'];
        this.systemOfOrigins.map (sys=>{
          sys.label = sys['SystemOfOriginDesc'];
          sys.value = sys['SystemOfOriginId']
        });
        this.defaultSoO = this.systemOfOrigins[9];
      });

    this.dataService.getPriority()
      .subscribe((data: any) => {
        this.priorities = data['value'];
        this.priorities.map (prior=>{
          prior.value = prior['Priority_Id'];
           prior.label = prior['Desc'];
        });
      });

    this.dataService.getChannel()
      .subscribe((data: any) => {
        this.channels = data['value'];
         this.channels.map(cha => {
        cha.value = cha['ChannelId'];
        cha.label = cha['ChannelName'];
      });
      });

    this.dataService.getContentType()
      .subscribe((data: any) => {
        this.contentTypes = data['value'];
        this.contentTypes.map (con =>{
          con.label = con['ContentTypeDesc'];
          con.value = con['ContentTypeId'];
        })
        this.selectedContentType = this.contentTypes[1];
      });

    this.dataService.getRen()
      .subscribe((data: any) => {
        this.renditions = data['value'];
        this.renditions = this.renditions.filter(ren => {
          return ren['IsDigital'] === true;
        });
        this.renditions.map (rend => {
          rend.label = rend['RenditionDesc'];
          rend.value = rend['RenditionId'];
        });
      });

    this.dataService.getFormat()
      .subscribe((data: any) => {
        this.formats = data;
        this.formats.map (form =>{
          form.label = form['Description'];
          form.value = form['FormatId'];
        });
      });

    this.dataService.getArchivalRule()
      .subscribe((data: any) => {
        this.archivalRules = data['value'];
         this.archivalRules.map(rules=> {
           rules.label = rules ['RuleName'];
           rules.value = rules ['ArchivalRuleId'];
         });
      });
  }
  updateWorkFlowChange(format: any): any {
    let formatId = format;
    this.dataService.getWorkFlow(formatId)

      .subscribe((data: any) => {
        this.workflows = data;
        this.workflows.map(workflow => {
          workflow.label = workflow['Name'];
          workflow.value = workflow['WorkflowTemplateId'];
        });

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

  getIconName() {
      return 'upload';
  }

  loadTemplates() {
    this.dataService.getTemplates()
      .subscribe((data: any) => {
        this.templates = data['value'];
        this.templates.map (temp => {
          temp.label = temp['AttributeTemplateDesc'];
          temp.value = temp['AttributeTemplateId'];
          temp['templates'] = temp['AttributeTemplateValue'] ;
        });

      });
    this.dataService.getCodeValues()
      .subscribe((data: any) => {
        this.codeValues = data['value'];
      });
  }

  getTemplate(templateId) {
    let tmpArr = new Array<Attribute>();
    this.templates.forEach(function (x) {
      if (x.value === templateId) {
        x['templates'].forEach(function (this, z) {
          if (x.value === templateId) {
            tmpArr.push(new Attribute(z.CodeSet, z.CodeValue));
           }

        });
      }
    });
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
    
    this.codeSetDelta.map(csd =>{
      csd.label = csd['CodeSet1'];
      csd.value = csd ['CodeSet1'];
      csd.dataType = csd['Datatype'];
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
      attribute.codeValues.push({value: x.CodeValueValue, label: x.CodeValueValue});
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
      resultChannels.push((data).toString());
    });

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
    let ingestItem = {
      'SubmittedBy': userName.toString(),
      'UserId': userId.toString(),
      'UserEmail': userEmail.toString(),
      'SystemOfOrigin': 'X',
      'ContentTypeId': (this.selectedContentType).toString(),
      'Channels': resultChannels,
      'PriorityId': (this.selectedPriority).toString(),
      'RushReason': this.intputReason,
      'RenditionId': (this.renditionSelected).toString(),
      'FormatId': (this.formatSelected).toString(),
      'WorkFlowId': (this.wfSelected).toString(),
      'ArchivalRuleId': (this.archRuleSelect).toString(),
      'Attributes': this.attributeResult,
      'Files': totalSelectedFiles
    }
    console.log('ingest item', JSON.stringify(ingestItem));

  }
  ngOnInit() {
    this.loadData();
    this.getCodeSets();
    this.loadTemplates();
  }
}

