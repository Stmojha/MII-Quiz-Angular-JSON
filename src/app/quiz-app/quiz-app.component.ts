import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subject, interval, takeUntil } from 'rxjs';

@Component({
  selector: 'app-quiz-app',
  templateUrl: './quiz-app.component.html',
  styleUrls: ['./quiz-app.component.css']
})
export class QuizAppComponent {
showStartDiv:boolean=true;
showInstrDiv:boolean=false;
showQuestions:boolean=false;
questionsList:any[]=[];
currentQuestionNumber:number=0;
remTime:number=15;
timer=interval(1500);
private destroy$:Subject<void>=new Subject<void>();
nextQueButtonText:string='Next';
isQuizEnded:boolean=false;
correctAnswerCount:number=0;

constructor(private http:HttpClient) {  
}
ngOnInit():void{
  this.loadQuestions();
}
showStartButton(){
  this.showStartDiv=true;
  this.showInstrDiv=false;
}

restartFull(){
  this.questionsList.forEach(question => {
    question.options.forEach((option:any) => {
      option.isSelected = false;
    });
  });
  this.correctAnswerCount=0;
  this.showStartDiv = true;
  this.showInstrDiv = false;
  this.showQuestions = false;
  this.isQuizEnded=false;
}

restartInstr(){
  this.questionsList.forEach(question => {
    question.options.forEach((option:any) => {
      option.isSelected = false;
    });
  });
  this.correctAnswerCount=0;
  this.showStartDiv = false;
  this.showInstrDiv = true;
  this.showQuestions = false;
  this.isQuizEnded=false;
}


loadQuestions(){
  this.http.get("assets/questions.json").subscribe((res:any)=>{
    console.log(res);
    this.questionsList=res;

  })
}
IncQueNo(){
  if(this.currentQuestionNumber<this.questionsList.length-1){
    this.currentQuestionNumber++;
    this.remTime = 15;
  }else{
    this.timer.pipe;
    this.questionsList.forEach(question => {
      question.options.forEach((option:any) => {
        option.isSelected = false;
      });
    });
    this.currentQuestionNumber = 0;
    this.showStartDiv = false;
    this.showInstrDiv = false;
    this.showQuestions = false;
    this.isQuizEnded=true;
    this.destroy$.next();
  }
  if(this.currentQuestionNumber===this.questionsList.length-1){
    this.nextQueButtonText='Finish Quiz';
    
  }else{
    this.nextQueButtonText='Next';
  }
}
moveToInstrDiv(){
  this.showStartDiv=false;
  this.showInstrDiv=true;
}
selectOption(option:any){
  option.isSelected=true;
  if(option.isCorrect){
    this.correctAnswerCount++;
  }
}
isOptionSelected(options:any){
  const selectionCount=options.filter((a:any)=>a.isSelected==true).length;
  if(selectionCount==0){
    return false;
  }else{
    return true;
  }
}
exitInstr(){
  this.showStartDiv=true;
  this.showInstrDiv=false;
}
finishQuiz(){
  if (this.currentQuestionNumber >= this.questionsList.length - 1) {
    this.currentQuestionNumber = 0;
    this.showStartDiv = false;
    this.showInstrDiv = false;
    this.showQuestions = false;
    this.isQuizEnded=true;

  }
}
showQueFunc() {
  this.showStartDiv = false;
  this.showInstrDiv = false;
  this.showQuestions = true;
  this.timer.pipe(takeUntil(this.destroy$)).subscribe(()=>{
    if (this.remTime != 0) {
      this.remTime--;
    } else {
      this.IncQueNo();
      this.remTime = 15;

      if (this.currentQuestionNumber >= this.questionsList.length - 1) {
        this.currentQuestionNumber = 0;
        this.showStartDiv = false;
        this.showInstrDiv = false;
        this.showQuestions = false;
        this.isQuizEnded=true;
        this.destroy$.next();

      }
    }
  });

}
ngOnDestroy():void{
  this.destroy$.next();
  this.destroy$.complete();
}

}
