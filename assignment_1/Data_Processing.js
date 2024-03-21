const fs = require('fs')

// let cleaned_user_data;
let data_collection_date = new Date("02/26/2024");

class Data_Processing{
  constructor() {
      this.raw_user_data = null;
      this.formatted_user_data = null;
      this.cleaned_user_data = null;
      this.email_id = {}
  }

  load_CSV(fileName){
    fileName = `${fileName}.csv`
    this.raw_user_data = fs.readFileSync(fileName, "utf-8")
  }

  format_date_birth(db){
    let db_parts = db.split(/[\/\s.]+/);

      let day = parseInt(db_parts[0], 10);
      let month = parseInt(db_parts[1], 10) - 1;
      let year = parseInt(db_parts[2], 10);
      if(year < 10){
        year = '200' + year;
      }
      else{
        let date = new Date(year, 0);
        year = date.getFullYear();
      }

      let dbirth_clean;
      if(!isNaN(day) && !isNaN(month) && !isNaN(year)){
        dbirth_clean = new Date(year, month, day);
      }
      else{
        dbirth_clean = new Date(db);
      }

      let dbirth_format = dbirth_clean.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit'})
      return dbirth_format;
  }

  format_age(word_check){
    var ageInt = 0;
    let letterRegex = /[a-zA-Z]/;
    const decimal = {
        '1' : 'one',
        '2' : 'two',
        '3' : 'three',
        '4' : 'four',
        '5' : 'five',
        '6' : 'six',
        '7' : 'seven',
        '8' : 'eight',
        '9' : 'nine',
        '10' : 'ten',
        '11' : 'eleven',
        '12' : 'twelve',
        '13' : 'thirteen',
        '14' : 'fourteen',
        '15' : 'fifteen',
        '16' : 'sixteen',
        '17' : 'seventeen',
        '18' : 'eighteen',
        '19' : 'nineteen',
        '20' : 'twenty',
        '30' : 'thirty',
        '40' : 'fourty',
        '50' : 'fifty',
        '60' : 'sixty',
        '70' : 'seventy',
        '80' : 'eighty',
        '90' : 'ninety'
      }
    if(word_check.includes('-')){
      let word_spl = word_check.split('-');

      let dec_1 = this.getKeyByValue(decimal, word_spl[0]);
      let dec_2 = this.getKeyByValue(decimal, word_spl[1]);
      ageInt = parseInt(dec_1) + parseInt(dec_2);
    }

    else{
      ageInt = parseInt(word_check)
      if(isNaN((ageInt))){
        if(letterRegex.test(word_check)){
          ageInt = parseInt(this.getKeyByValue(decimal, word_check));
        }
      }
    }
  return ageInt;
  }

  format_data(){
    const staticTitle = ["Mr", "Mrs", "Miss", "Ms", "Dr", "Dr."]
     var lines = this.raw_user_data.trim().split('\n');
     var format_data = lines.map(line => {
       var columns = line.split(/, \s*/);
       var fcolumn = columns[0].split(',')[0];
       var fcolumnDet = fcolumn.split(' ');
       var title = '';
       var first_name = '';
       var middle_name = '';
       var last_name = '';
       var db = columns[0].split(',')[1];
       var mail = columns[0].split(',')[3].trim();

      //  Formatting title, name, middle name, last name
       if(staticTitle.includes(fcolumnDet[0])){
        title = fcolumnDet[0];
        first_name = fcolumnDet[1];
        first_name = first_name.replace(/(^|[\s-])\S/g, function (match) {
          return match.toUpperCase();
        });
        if(fcolumnDet.length > 3){
          middle_name = fcolumnDet.slice(2, -1).join(" ");
        }
        last_name = fcolumnDet[-1];
       }
       else{
        first_name = fcolumnDet[0];
        if(fcolumnDet.length >= 3){
          middle_name = fcolumnDet.slice(1, -1).join(" ");
        }
        last_name = fcolumnDet[-1];
       }

      let dob = this.format_date_birth(db);

      let in_age = columns[0].split(',')[2];
      let age_format = this.format_age(in_age);

      return{
         title: title,
         first_name: first_name,
         middle_name: middle_name,
         surname: fcolumnDet[fcolumnDet.length - 1],
         date_of_birth: dob,
         age: age_format,
         email: mail
       };
       })
       this.formatted_user_data = format_data;
  }

  clean_data(){

    var splitted_email;
    this.cleaned_user_data = this.formatted_user_data

    //go through dataset line by line
    //check for duplicates
    //if duplicate is identified, remove that row

    for(let i = 0; i < this.cleaned_user_data.length; i++){

      // Fill first name, last name by email
      this.cleaned_user_data[i].title = this.cleaned_user_data[i].title.replace(/[.]/g, '')
      if(this.cleaned_user_data[i].first_name == '' || this.cleaned_user_data[i].surname == ''){
        splitted_email = (this.cleaned_user_data[i].email).split("@");
        this.cleaned_user_data[i].first_name = splitted_email[0].split(".")[0];
        this.cleaned_user_data[i].surname = splitted_email[0].split(".")[1];
      }

      //Clean date of birth and age
      let db_parts = this.cleaned_user_data[i].date_of_birth.split(/[\/\s.]+/);
      let new_age = 0;

      let day = parseInt(db_parts[0], 10);
      let month = parseInt(db_parts[1], 10) - 1;
      let year = parseInt(db_parts[2]);

      let dbirth_clean;
      if(!isNaN(day) && !isNaN(month) && !isNaN(year)){
        dbirth_clean = new Date(year, month, day);
      }
      else{
        dbirth_clean = new Date(db);
      }

      new_age = Math.abs(data_collection_date - dbirth_clean);
      new_age = Math.floor(new_age / (1000 * 60 * 60 * 24 * 365.25));
      this.cleaned_user_data[i].age = new_age;

      // Formar email in clean form
      this.cleaned_user_data[i].email = `${this.cleaned_user_data[i].first_name}.${this.cleaned_user_data[i].surname}@example.com`
    }

    // let jsonObject = this.cleaned_user_data.map(JSON.stringify);
    // let uniqueSet = new Set(jsonObject);
    // this.cleaned_user_data = Array.from(uniqueSet).map(JSON.parse);
    // this.cleaned_user_data = this.filterEmails(this.cleaned_user_data)

    this.cleaned_user_data = this.duplicatedEntities(this.cleaned_user_data)

    let email_frequency = this.emailFrequency(this.cleaned_user_data)

    for(let i = 0; i < this.cleaned_user_data.length; i++){
      // Identify email by ID if repeated
      const count = this.email_id[this.cleaned_user_data[i].email] || 1;
      if (count >= 2) {
          this.cleaned_user_data[i].email = `${this.cleaned_user_data[i].first_name}.${this.cleaned_user_data[i].surname}${count}@example.com`;
        }
      this.email_id[this.cleaned_user_data[i].email] = count + 1;

      const emailNoId = this.cleaned_user_data[i].email;
      const frequency = email_frequency[emailNoId] || 0;
      if(frequency > 1){
        this.cleaned_user_data[i].email = `${this.cleaned_user_data[i].first_name}.${this.cleaned_user_data[i].surname}1@example.com`;
      }


      // console.log(this.cleaned_user_data)
    }
  }

  most_common_surname(){
    var count_surname = {}
    var most_surname_count = 0
    var common_surname = [];
    for(let i = 0; i < this.cleaned_user_data.length; i++){
      if(count_surname.hasOwnProperty(this.cleaned_user_data[i].surname)){
        count_surname[this.cleaned_user_data[i].surname]++;
      }
      else{
        count_surname[this.cleaned_user_data[i].surname] = 1;
      }
    }

    for(var j in count_surname){
      if(count_surname[j] > most_surname_count){
        most_surname_count = count_surname[j];
        common_surname = [j];
      }else if (count_surname[j] === most_surname_count) {
        common_surname.push(j);
      }
    }
    return common_surname;
  }

  average_age(){
    var sum = 0;
    for(let i = 0; i < this.cleaned_user_data.length; i++){
      sum += this.cleaned_user_data[i].age;
    }

    return (sum / this.cleaned_user_data.length).toPrecision(3);
  }

  youngest_dr(){
    var dr_title = this.cleaned_user_data.filter(dr => dr.title === 'Dr')
    .reduce((min, curr) => min.age < curr.age ? min : curr);
    return dr_title;
  }

  most_common_month(){
    var count_month = {}
    var most_month_count = 0
    var common_month;
    for(let i = 0; i < this.cleaned_user_data.length; i++){
      let db_parts = this.cleaned_user_data[i].date_of_birth.split("/");
      if(count_month.hasOwnProperty(db_parts[1])){
        count_month[db_parts[1]]++;
      }
      else{
        count_month[db_parts[1]] = 1;
      }
    }
    for(var j in count_month){
      if(count_month[j] > most_month_count){
        most_month_count = count_month[j];
        common_month = j;
      }
    }
   return parseInt(common_month);
  }

  percentage_titles(){
    // Mr, Mrs, Miss, Ms, Dr, or left blank.
    let percents = []
    var total = this.cleaned_user_data.length;
    var mr_data = this.cleaned_user_data.filter(function(obj) {
      return obj.title === 'Mr';
    });
    var mrs_data = this.cleaned_user_data.filter(function(obj) {
      return obj.title === 'Mrs';
    });
    var miss_data = this.cleaned_user_data.filter(function(obj) {
      return obj.title === 'Miss';
    });
    var ms_data = this.cleaned_user_data.filter(function(obj) {
      return obj.title === 'Ms';
    });
    var dr_data = this.cleaned_user_data.filter(function(obj) {
      return obj.title === 'Dr';
    });
    var no_data = this.cleaned_user_data.filter(function(obj) {
      return obj.title === '';
    });

    var p1 = Math.round((mr_data.length / total) * 100)
    var p2 = Math.round((mrs_data.length / total) * 100)
    var p3 = Math.round((miss_data.length / total) * 100)
    var p4 = Math.round((ms_data.length / total) * 100)
    var p5 = Math.round((dr_data.length / total) * 100)
    var p6 = Math.round((no_data.length / total) * 100)

    percents.push(p1, p2, p3, p4, p5, p6);

    return percents;
  }

  percentage_altered() {
    let totalKeys = Object.keys(this.cleaned_user_data[0]);
    let total = this.formatted_user_data.length;
    let altered = 0;

    this.formatted_user_data.forEach((_, index) => {
        if (JSON.stringify(this.formatted_user_data[index]) !== JSON.stringify(this.cleaned_user_data[index])) {
          altered++;
      }
    });

    console.log("Altered entries:", altered);
    console.log("Total entries:", total);

    let percentage = (altered / total) * 100;
    return percentage.toPrecision(3);
}


  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  filterEmails(data) {
    return data.filter(entry => !entry.email.includes("@Liverpool.ac.uk"));
  }

  emailFrequency(data){
    const emailFrequency = {};
    data.forEach(item => {
      const email = item.email;
      emailFrequency[email] = (emailFrequency[email] || 0) + 1;
    });
    return emailFrequency;
  }

  duplicatedEntities(jsArray){
    const unique = {};
    const uniqueArray = []
    jsArray.forEach(entity => {
      const key = JSON.stringify(entity);
      if(!unique[key]){
        unique[key] = true;
        uniqueArray.push(entity)
      }
    });
    return uniqueArray;
  }

  }

const processor = new Data_Processing();
processor.load_CSV('Raw_User_Data');
processor.format_data();
processor.clean_data();
// // // // // console.log(cleaned_user_data)
// processor.most_common_surname();
// // processor.average_age();
// // processor.youngest_dr();
// // processor.most_common_month();
// // processor.percentage_titles();
processor.percentage_altered()