import Directory from './directory.class';

export default class Library {
  id: number;
  name: string;
  path: string;
  directories = new Array<Directory>();


  constructor(_id, _name, _path) {
    this.id = _id;
    this.name = _name;
    this.path = _path;
  }
}
