chatApp.directive('validFile',function(){

    return {
        require : 'ngModel',
        link  : function(scope,el,attrs,ngModel){
          ngModel.$render = function(){
            console.log("ngModel render");
            ngModel.$setViewValue(el.val());
          };
          el.bind('change',function(){
            scope.$apply(function(){
              console.log("ngModel change");
              ngModel.$render();
            })
          })
        }
    }
})
