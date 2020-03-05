import $ from 'jquery';
export const formatDate = (startdate) => {
    var dd = new Date(startdate).getDate();
    var mm = new Date(startdate).getMonth()+1; 
    var yyyy = new Date(startdate).getFullYear();
    var formatDate = '';
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    formatDate = dd+'-'+mm+'-'+yyyy;
    return formatDate;
};

export const formatMoney = (num) => {
    if(num){
        return (
            "€ "+num
              .toFixed(2) // always two decimal digits
              .replace('.', ',') // replace decimal point character with ,
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') 
          ) // use . as a separator
    }else{
        return "€ 0,00" 
    }
};

export const formatPercent = (num) => {
    if(num){
        var value = num.toFixed(2);
        return  value.toString()+" %";
    }else{
        return "0.00 %" 
    }
   
};

export const formatDateSecond = (date) =>{
    if(date){
        var dateStr = date.split('-')
        var formatDate = dateStr[1]+'/'+dateStr[0]+'/'+dateStr[2];
        return formatDate;
    }else{
        return '';
    }
}

export const formatDecimal = (data) =>{
    
    return data.replace(",", ".");
}

export const formatEasyTypeDate = (value, e) =>{
    return value;
}

export const showSlideForm = () =>{
    // $(".slide-form__controls").toggleClass("open")
    $(".fade-display").toggleClass("fade modal-backdrop show"); 
    return true;
}

export const hideSlideForm = () =>{
    // $(".slide-form__controls").toggleClass("open");
    $(".fade-display").toggleClass("fade modal-backdrop show");
    return true;
}