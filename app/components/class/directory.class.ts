export default class Directory {
  parentId: number;
  fullPhysicalPath: string;
  path: string;
  name: string;
  isDirectory: boolean;
  children = new Array<Directory>();
  level: number;
  parentDir: Directory;
  isSelected = false;
  checkEnable = true;

 constructor( _parentLibId, _name, _relativePath,  _fullPhysicalPath, _isDirectory, _level, _parentDir) {
    this.name = _name;
    this.path = _relativePath;
    this.parentId = _parentLibId;
    this.fullPhysicalPath = _fullPhysicalPath;
    this.isDirectory = _isDirectory;
    this.level = _level;
    this.parentDir = _parentDir;

   }
}
