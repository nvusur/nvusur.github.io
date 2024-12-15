document.addEventListener('DOMContentLoaded', async function() {

    const radioButtons = document.querySelectorAll('input[name="prostor"]');
    const dataDisplay = document.getElementById('prikaz_desni');
    const zigbeeButton = document.getElementById('zigbee');
    
    let room_info={};
    let selected_room=0;
    
    zigbeeButton.addEventListener('click', async () => {

    });


    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', function() {
            if (this.checked) {
                selected_room=this.value;
                updateDisplay();
            }
        });
    });


    function updateDisplay(){
        if(selected_room in room_info){
        var temp = Math.round(room_info[selected_room].temp*10) / 10; 
        dataDisplay.textContent = `Temperatura je ${temp}°C`
        } else{
            dataDisplay.textContent = 'Nema dostupnih podataka za prikaz.';
        }
    }
    

});