# A Wonky Mechanical Counter

This is a vanilla-javascript mechanical counter with zero dependencies.

![Examples](docs/sizes.png)

All you need is for the counter are the ``mechctr.js`` and ``mechctr.css`` files.


## Example Usage

```
let div = document.getElementById("my_div")
let counter = new MechanicalCounter(div, 4, 2, "audio")
counter.setValue(123.45)
```


## API

### Constructor

  ```
  MechanicalCounter(
      parentElement,          // DOM element to create the counter in
      digitsBeforeDecimal,    // number of digits left of the decimal point, int
      digitsAfterDecimal,     // number of digits right of the decimal point, int
      audioFilesPath,         // path to audio effect files, string
      size,                   // [optional] counter size (0=big, 1=medium, 2=small), int
      decimalPointCharacter,  // [optional] decimal point character, default is ","
      wonkiness               // [optional] roller positioning accuracy, float, default=0.1
                              //            (0=perfectly accurate; 1=might be a whole digit off)
  )
  ```
  
### Setting counter value

  ```
  counter.setValue(
      value,                  // the value to show, number
      jump                    // if ``true``, do not animate the move, quietly set to the new value;
                              // otherwise, the counter will be animated and sound effects will be
                              // produced
  )
  ```


## Examples

Check the ``example.html`` and ``calculator.html`` files for examples.

To see the counter in action, visit http://avtanski.net/projects/calc


## Known issues

* Audio does not work correctly in Safari.


## Contact

Alexander Avtanski, alex@avtanski.com