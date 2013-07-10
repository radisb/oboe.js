/*
   Call a single function with the given arguments.
   Basically, a more functional version of the slightly more OO Function#apply for when we don't care about
   the context of the call
 */
function apply(fn, args) {
   return fn.apply(undefined, args);
}

/*
   Call each of a list of functions with the same arguments, where the arguments are given as an
   array. Ignores any return values from the functions.
 */
function applyAll( fns, args ) {

   fns.forEach(function( fn ){
      apply(fn, args);
   });
}


function varArgs(){

   function sliceArray(arrayLikeThing, startIndex, endIndex) {
      return Array.prototype.slice.call(arrayLikeThing, startIndex, endIndex);
   }

   var numberOfFixedArguments, fn;
   
   if( arguments.length == 2 ) {
      numberOfFixedArguments = arguments[0];
      fn = arguments[1];
   } else {
      numberOfFixedArguments = 0;
      fn = arguments[0];   
   }
       
   return function(){
   
      // make an array of the fixed arguments
      var argumentsToFunction = sliceArray( arguments, 0, numberOfFixedArguments );
      
      // push on the varargs bit as a sub-array:
      argumentsToFunction.push( sliceArray( arguments, numberOfFixedArguments ) );   
      
      return fn.apply( this, argumentsToFunction );
   }       
}


/** 
 *  Call a list of functions with the same args until one returns a truthy result. Equivalent to || in javascript
 *  
 *  So:
 *       lazyUnion([f1,f2,f3 ... fn])( p1, p2 ... pn )
 *       
 *  Is equivalent to: 
 *       apply(f1, [p1, p2 ... pn]) || apply(f2, [p1, p2 ... pn]) || apply(f3, [p1, p2 ... pn]) ... apply(fn, [p1, p2 ... pn])  
 *   
 *  @returns the first return value that is given that is truthy.
 */
var lazyUnion = varArgs(function(fns) {

   return varArgs(function(params){

      var maybeValue;
   
      for (var i = 0; i < len(fns); i++) {
         
         maybeValue = apply(fns[i], params);            
               
         if( maybeValue ) {
            return maybeValue;
         }      
      }
   });    
});

/**
 * Apply a an arbitrary condition
 * 
 */
function lazyIntersection(fn1, fn2) {

   return function (param) {
                                                              
      return fn1(param) && fn2(param);
   };   
}

/** Partially complete the given function by filling it in with all arguments given
 *  after the function itself. Returns the partially completed version.    
 */
var partialComplete = varArgs(1, function( fn, boundArgs ) {

   return varArgs(function( callArgs ) {
            
      return fn.apply(this, boundArgs.concat(callArgs));
   }); 
});