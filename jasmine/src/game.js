// $(document).ready(function(){

//   // event listeners
//   $('#submit_answer').on('click', submitAnswer)
// })



var Word = Word || {};

Word = {

  testWords: "belt parts remain",

  isLongEnough: function(answer) {
    return answer.length > 1;
  }

}

function submitAnswer(){
  event.preventDefault();

  // get dictionnary API to ensure the word exists

  // check words only has letters from the three words, and in the allowed amount


  console.log(event);
  console.log(this);
  console.log('submitting answer');
}






















