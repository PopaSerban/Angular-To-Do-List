import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

export interface Task{
  name:string,
  status: string
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChildren('filters') filters: QueryList<ElementRef> = new QueryList;
  filterListDeclaration: string[];
  editTaskId: number;
  isEditingMode: boolean;
  title = 'to-do-list';
  taskEntered: string;
  taskList: Task[];

  constructor(){
    this.filterListDeclaration = ['All','Pending','Completed'];
    this.isEditingMode = false;
    this.editTaskId = -1;
    this.taskEntered = '';
    this.taskList = [];
  }
  ngOnInit(): void {
   this.InitializeTaskList();
 }
  OnTaskEntered(){
    if(this.taskEntered){
      if(this.isEditingMode){
        this.taskList[this.editTaskId].name = this.taskEntered;
        localStorage.setItem('todo_list', JSON.stringify(this.taskList));
        this.taskEntered ='';
        this.isEditingMode = !this.isEditingMode;

      }else{
        let task = { name: this.taskEntered, status: 'Pending'};
        this.taskList.push(task);
        this.AddTaskToLocalStorage(this.taskList);
        this.taskEntered = '';
      }
    }
  }
  OnTaskEdit(index: number){
    this.isEditingMode = !this.isEditingMode;
    this.editTaskId = index;
    this.taskEntered = this.taskList[index].name;

  }
  OnTaskDelete(index: number){
    this.taskList.splice(index,1);
    this.AddTaskToLocalStorage(this.taskList);
  }
  
  OnCheckboxClick(index: number){
      let task = this.taskList[index];
      task.status === 'Completed' ? task.status ='Pending': task.status = 'Completed';
      this.taskList[index] = task;
      this.AddTaskToLocalStorage(this.taskList);
  }

  AddTaskToLocalStorage(taskList: Task[]){
    localStorage.setItem('todo_list', JSON.stringify(taskList));
  }
  OnDeleteAll(){
    this.taskList= [];
    this.AddTaskToLocalStorage(this.taskList);
  }
  OnFilterSelection(filter:HTMLSpanElement){
    this.filters.forEach(span => {
      span.nativeElement.classList.contains('active') ? span.nativeElement.classList.remove('active'): '';
      span.nativeElement.classList.remove('active')
    });
    filter.classList.add('active');
    this.FilterTaskList(filter.innerText);

  }

  FilterTaskList(filterOption: string){
    let filter = filterOption.trim();
    this.InitializeTaskList();
    if(filter != 'All'){
      this.taskList = this.taskList.filter(task=> task.status === filter);
    }
  }
  InitializeTaskList(){
    let localTask = JSON.parse(localStorage.getItem('todo_list') as string);
    !localTask ? this.taskList =[] : this.taskList = localTask as Task[];
  }
}


