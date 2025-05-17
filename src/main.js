//
// NOTE : modified from a template from isketch activity in class
//

var ISKETCH = ISKETCH || {}

$(document).ready(() => {
    console.log('Welcome to iSketch!')

    // variables
    ISKETCH.current = '';
    ISKETCH.order = [];
    ISKETCH.completed = false;
    ISKETCH.toggle = true;

    // disable canvas
    $('#finishBtn').prop('disabled', true);
    $('#cvsMain').prop('disabled', true);
    $('#cvsMain').css('pointer-events', 'none');
    $('#deleteBtn').prop('disabled', true);


    // initialize the canvas
    $('#cvsMain')[0].width = 800;
    $('#cvsMain')[0].height = 500;
    $('#cvsMain').css('background-color', '#eeeeee');
    ISKETCH.context = $('#cvsMain')[0].getContext('2d');
    ISKETCH.context.strokeStyle = "#df4b26";
    ISKETCH.context.lineJoin = "round";
    ISKETCH.context.lineWidth = 5;

    ISKETCH.allStrokes = []; // stores all strokes
    ISKETCH.userID = ""; // store user id

    // add input event handlers
    $('#cvsMain').on('mousedown', ISKETCH.canvasMouseDown);
    $('#cvsMain').on('mousemove', ISKETCH.canvasMouseMove);
    $('#cvsMain').on('mouseup', ISKETCH.canvasMouseUp);

    // add click handler (for "finished" and "delete" button)
    $('#finishBtn').on('click', ISKETCH.saveToJson);
    $('#deleteBtn').on('click', ISKETCH.deleteData);

    // enable/disable start button
    $('#userID').on('input', function(){
        ISKETCH.userID = $(this).val().trim();
        if (ISKETCH.userID) $("#startBtn").prop('disabled', false);
        else  $("#startBtn").prop('disabled', true);
    });

    // add click handler for start
    $('#startBtn').on('click', function(){
        if(ISKETCH.userID) {
            $('#finishBtn').prop('disabled', false);
            $('#deleteBtn').prop('disabled', false);
            $('#cvsMain').prop('disabled', false);
            $('#cvsMain').css('pointer-events', 'auto');
            $("#startBtn").prop('disabled', true);
            $('#userID').prop('disabled', true);
            $('#charCount').text("Gestures remaining: " + ISKETCH.order.length)

            ISKETCH.generateCharacerOrder();
            ISKETCH.displayNextCharacter();
        } 
    })
})

ISKETCH.generateCharacerOrder = function() {
    const c = [']', '[', 'o'];
    ISKETCH.order = [];

    for (let i=0; i<25; i++){
        ISKETCH.order.push(c[0]);
        ISKETCH.order.push(c[1]);
        ISKETCH.order.push(c[2]);
    }

    ISKETCH.order = ISKETCH.order.sort(()=>Math.random() - 0.5);
}

ISKETCH.displayNextCharacter = function(){
    if(ISKETCH.order.length>0) {
        ISKETCH.current = ISKETCH.order.pop();

        $('#charCount').text("Gestures remaining: " + ISKETCH.order.length)

        const color = ISKETCH.toggle? 'black' : 'brown';
        ISKETCH.toggle = !ISKETCH.toggle;

        $('#charMsg')
            .text('Draw : ' +  ISKETCH.current)
            .css('color', color);
    } 
    else {
        ISKETCH.completed = true; 
        $('#statusMsg').text("Finished! All characters drawn.");
        $('#cvsMain').css('pointer-events', 'none');
        $('#cvsMain').prop('disabled', true);
    }
}

ISKETCH.canvasMouseDown = function (e) {
    $('#statusMsg').text("");
    ISKETCH.context.clearRect(0, 0, $('#cvsMain').width(), $('#cvsMain').height());
    ISKETCH.context.beginPath();

    let rect = $('#cvsMain')[0].getBoundingClientRect();
    let x = e.clientX - rect.left, y = e.clientY - rect.top
    ISKETCH.context.moveTo(x, y);
    ISKETCH.context.stroke();

    ISKETCH.isDragging = true;

    ISKETCH.coords = []

    let coord = {x: x, y: y}
    ISKETCH.coords.push(coord)

}

ISKETCH.canvasMouseMove = function (e) {
    if (!ISKETCH.isDragging) return;

    let rect = $('#cvsMain')[0].getBoundingClientRect();
    let x = e.clientX - rect.left, y = e.clientY - rect.top
    ISKETCH.context.lineTo(x, y);
    ISKETCH.context.moveTo(x, y);
    ISKETCH.context.stroke();

    let coord = {x: x, y: y};
    ISKETCH.coords.push(coord);

}

ISKETCH.canvasMouseUp = function (e) {
    if(ISKETCH.drawingCompleted) return;

    ISKETCH.isDragging = false;
    ISKETCH.context.closePath();

    let rect = $('#cvsMain')[0].getBoundingClientRect();
    let x = e.clientX - rect.left, y = e.clientY - rect.top;
    let coord = {x:x, y:y};

    ISKETCH.coords.push(coord);
    ISKETCH.allStrokes.push({
        label : ISKETCH.current,
        coordinates : ISKETCH.coords
    });

    ISKETCH.displayNextCharacter();

    console.log("coords added")
    console.log(ISKETCH.allStrokes)
}

ISKETCH.deleteData = function (){
    if (ISKETCH.allStrokes.length > 0){
        const last = ISKETCH.allStrokes.pop();
        if (last && last.label){
            ISKETCH.order.push(last.label);
        }
        ISKETCH.completed = false;
        $('#statusMsg').text("last gesture deleted");
        if (ISKETCH.order.length == 1) {
            $('#charCount').text("Gestures remaining: 0")
            ISKETCH.displayNextCharacter();
        }
        else {$('#charCount').text("Gestures remaining: " + ISKETCH.order.length)}
        $('#cvsMain').css('pointer-events', 'auto');
        $('#cvsMain').prop('disabled', false);
    }
}

ISKETCH.saveToJson = function (){
    let json = JSON.stringify(ISKETCH.allStrokes, null, 2);
    let blob = new  Blob ([json], {type: "applcation/json"});

    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = "user_" + ISKETCH.userID + ".json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    $('#statusMsg').text("json file created and downloaded");
    console.log(ISKETCH.allStrokes)
}
