 export class Attribute {
    name = '';
    value='';
    datatype ='';
    isEditable=false;
    codeValues= new Array<string>();
    codeSets: any[];
    label: any[];
    constructor(_name,_value){
        this.name=_name;
        this.value =_value;
    }
  };