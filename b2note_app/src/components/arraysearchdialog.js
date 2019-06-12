import {AnnotationApi} from '../components/annotationapi';
import {inject} from 'aurelia-framework';

@inject(AnnotationApi)
export class Arraysearchdialog {
  constructor(api) {
    this.tabs = [
      {id: 'semantic', label: 'Semantic annotation'},
      {id: 'keyword', label: 'Free-text keywords'},
      {id: 'comment', label: 'Comment           '}
    ];
    this.active = 'semantic';
    this.annotationsemantic = '';
    this.annotationkeyword = '';
    this.annotationcomment = '';
    this.api = api;
    this.child = false;
    this.query = [];
    this.logic = '';
  }

  switchtab(tabid) {
    this.active = tabid;
    return true;
  }

  createSemantic() {
    console.log('create semantic:', this.annotationsemantic)
  }

  createKeyword() {
    console.log('create keyword:', this.annotationkeyword)

  }

  createComment() {
    console.log('create semantic:', this.annotationcomment)

  }

  //TODO refactor to use api.query instead of this.query
  search() {
    console.log('search', this.active);
    //based on active tab show return appropriate value
    this.searchvalue = this.active === 'semantic' ? this.annotationsemantic :
      (this.active === 'keyword' ? this.annotationkeyword : '');
    this.searchtype = this.active;
    let queryitem = {first:this.query.length==0,logic: this.query.length === 0 ? '' : this.logic, type: this.searchtype, value: this.searchvalue}
    if (queryitem.value !== '') this.query.push(queryitem);

    this.api.searchQuery(this.query);
  }

  createChild() {
    //determine the query value based on current tab
    this.searchvalue = this.active === 'semantic' ? this.annotationsemantic :
      (this.active === 'keyword' ? this.annotationkeyword : '');
    this.searchtype = this.active;
    //create queryitem record with logic operator, type and value from dialog
    let queryitem = {first:this.query.length==0,logic: this.query.length === 0 ? '' : this.logic, type: this.searchtype, value: this.searchvalue}
    this.query.push(queryitem);
    //reset dialog values
    this.active = 'semantic';
    this.annotationsemantic = this.annotationkeyword = this.annotationcomment = '';
    console.log('creating child');
    this.child = this.query.length > 0;
    this.logic = 'AND';
  }

  deleteChild() {
    console.log('deleting child');
    let queryitem = this.query.pop()
    this.active = queryitem.type;
    console.log('deleteChild(), active: queryitem:', this.active, queryitem.logic, queryitem.type, queryitem.value)
    this.annotationsemantic = this.annotationkeyword = this.annotationcomment = '';
    if (this.active === 'semantic') this.annotationsemantic = queryitem.value;
    if (this.active === 'keyword') this.annotationkeyword = queryitem.value;
    this.logic = queryitem.logic;
    this.child = this.query.length > 0;
  }

  deleteItem(item) {
    console.log('deleting item');
    let itemindex = this.query.indexOf(item);
    if (itemindex > -1) {
      //can delete from query
      let queryitem = item;
      this.query.splice(itemindex, 1); //remove the item from queries
      this.query[0].logic=''
      /*
      //set current dialog to the delete queryitem properties
      this.active = queryitem.type;
      console.log('deleteChild(), active: queryitem:',this.active,queryitem.logic,queryitem.type,queryitem.value)
      this.annotationsemantic=this.annotationkeyword=this.annotationcomment='';
      if (this.active==='semantic') this.annotationsemantic=queryitem.value;
      if (this.active==='keyword') this.annotationkeyword=queryitem.value;

      */
      this.child = this.query.length > 0;
      this.query[0].first=true;
    } else console.log('warning, item not found in queryindex', item, this.query);
  }

  /**
   * Modifies item, splits the query array into 2 parts
   * @param item
   */
  modifyItem(item) {
    console.log('modify item');
    if (this.modify){
      //already modifying something else
      this.confirmModifiedItem();
    }
    let itemindex = this.query.indexOf(item);
    if (itemindex > -1) {
      //copy elements from item
      this.suffixquery = this.query.slice(itemindex+1);
      //remove suffix from query
      this.query.splice(itemindex+1,this.query.length-itemindex);
      //now delete the last child - it will allow to edit it
      this.deleteChild();
      //set modify flag
      this.modify=true;
    }

  }

  /**
   * Merges modification of an item
   * @param item
   */
  confirmModifiedItem(){
    //adds the dialog to the query
    this.createChild();
    //merge the rest of the suffix to the query
    let newquery = this.query.concat(this.suffixquery);
    this.query=newquery;
    //set modify flag
    this.modify=false;
  }

}
