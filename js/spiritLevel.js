/*
 * The folowing two functions are available for you to use.
 * 
 * offsetBubble(x, y, bubbleId)
 *     This function will position the bubble with ID 'bubbleId' at an
 *     offset of (x, y) pixels from its original position in centre of
 *     the track.
 *
 *     The coordinate system's origin (0, 0) is the original bubble position.
 *     x increases to the right and y increases to the top of the view.
 *     
 *     Parameters:
 *         x, y:     Numbers in pixels. 
 *                   Negative values offset bubble in opposite direction.
 *         bubbleId: ID of bubble to be moved.
 * 
 *
 * bubbleTrackLength()
 *     Returns the length of both bubble tracks in pixels.
 * 
 *     Return value:
 *         Returns an Number of pixels representing the length.
 * 
 * 
 * removeMarkerStyles()
 *     Removes all JavaScript-created style changes from all track markers.
 *
 *
 * deviceMotionNormalisedAccelerationIncludingGravity(event)
 *     Given a DeviceMotionEvent object, returns a normalised version
 *     of the accelerationIncludingGravity property object with values
 *     matching Android, since Safari on iOS reports negated values.
 *     This is only useful if you want to test/run your app on iOS.
 * 
 *     Parameters:
 *         event:    A devicemotion event object.
 *     Return value:
 *         Returns an object with same properties as the 
 *         event.accelerationIncludingGravity object.
 * 
 * 
 * IDs of HTML elements of interest
 * =========================================
 * 
 * message-area       ID of text area at the bottom of the view.
 * vertical-25        ID of upper marker in vertical track.
 * vertical-50        ID of centre marker in vertical track.
 * vertical-75        ID of lower marker in vertical track.
 * horizontal-25      ID of left marker in horizontal track.
 * horizontal-50      ID of centre marker in horizontal track.
 * horizontal-75      ID of right marker in horizontal track.
 * vertical-bubble    ID of the bubble in vertical track.
 * horizontal-bubble  ID of the bubble in horizontal track. 
*/

// YOUR CODE HERE

// Declaring reference variables and referencing the DOM
var betaRef = document.getElementById("betaValue"),
    gammaRef = document.getElementById("gammaValue");

// Declaring buffer arrays
var bufferX = [],
    bufferY = [];

// Pixels to move per degrees
const ppdX = (bubbleTrackLengthH() - 20) / 180,
      ppdY = (bubbleTrackLengthV() - 20) / 180;

function getMotion(event)
    {
        var x = event.accelerationIncludingGravity.x;
        var y = event.accelerationIncludingGravity.y;
        
        x = x / 9.8;    // Value of x and y are divided by 9.8 to make it easy to manipulate the value
        y = -y / 9.8;   //
        
        // Buffer code start here
        // Buffer is an array to store N recent values from which we can get the average.
        if (bufferX.length < 25)
            {
                bufferX.push(x);
                bufferY.push(y);
            }
        else
            {
                bufferX.splice(0,1);
                bufferX.push(x);
                bufferY.splice(0,1);
                bufferY.push(y);
            };
        
        var avgX = 0,
            avgY = 0;
        
        for (var counter = 0; counter < bufferX.length; counter++)
            {
                avgX += bufferX[counter];
                avgY += bufferY[counter];
            };
        // Buffer code ends here
        
        avgX = avgX / bufferX.length;
        avgY = avgY / bufferY.length;
        
        // Change the value of x and y into degrees
        avgX = avgX * 90;
        avgY = avgY * 90;
        
        gammaRef.innerHTML = avgX.toFixed(2);
        avgX = Math.round(avgX);
        avgX = avgX * ppdX;                     // Multiply the angle by ppd to find the pixels it's supposed to move
        
        betaRef.innerHTML = -(avgY.toFixed(2));
        avgY = Math.round(avgY);
        avgY = avgY * ppdY;                     // Multiply the angle by ppd to find the pixels it's supposed to move
        
        offsetBubble(avgX, 0, "horizontal-bubble");
        if (-4 <= avgX && avgX <= 4)
            {
                document.getElementById("horizontal-50").style.backgroundColor = "rgba(0, 255, 0, 0.3)";    // Condition for when it is stable
            }
        else if ((bubbleTrackLengthH() / 4) - 4 <= avgX && avgX <= (bubbleTrackLengthH()/4) + 4)
            {
                document.getElementById("horizontal-75").style.backgroundColor = "rgba(255, 0, 0, 0.3)";    // Condition for when the phone is tilted to the left            
            }
        else if ((bubbleTrackLengthH()/4) - 4 <= -avgX && -avgX <=(bubbleTrackLengthH() / 4) + 4 )
            {
                document.getElementById("horizontal-25").style.backgroundColor = "rgba(255, 0, 0, 0.3)";    // Condition for when the phone is tilted to the right
            }
        else
            {
                removeMarkerStyles("horizontal");
            }
        
        offsetBubble(0, avgY, "vertical-bubble");
        if (-4 <= avgY && avgY <= 4)
            {
                document.getElementById("vertical-50").style.backgroundColor = "rgba(0, 255, 0, 0.3)";      // Condition for when it is stable
            }        
        else if ((bubbleTrackLengthV()/4) - 4 <= avgY && avgY <=(bubbleTrackLengthV() / 4) + 4 )
            {
                document.getElementById("vertical-75").style.backgroundColor = "rgba(255, 0, 0, 0.3)";      // Condition for when the phone is tilted to the left
            }
        else if ((bubbleTrackLengthV()/4) - 4 <= -avgY && -avgY <=(bubbleTrackLengthV() / 4) + 4 )
            {
                document.getElementById("vertical-25").style.backgroundColor = "rgba(255, 0, 0, 0.3)";      // Condition for when the phone is tilted to the right
            }
        else
            {
                removeMarkerStyles("vertical");
            }
    }

window.addEventListener("devicemotion", getMotion);