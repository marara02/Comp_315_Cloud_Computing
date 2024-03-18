const fs = require('fs')

let raw_user_data;
let formatted_used_data;
let cleaned_user_data;
class Data_Processing{
  constructor() {}

  load_CSV(fileName){
    raw_user_data = fs.readFileSync(fileName, "utf-8")
  }

  format_data(){
    const staticTitle = ["Mr", "Mrs", "Miss", "Ms", "Dr"]
     var lines = raw_user_data.trim().split('\n');
     var format_data = lines.map(line => {
       var columns = line.split(/, \s*/);
       var fcolumn = columns[0].split(',')[0];
       var fcolumnDet = fcolumn.split(' ');
       var title = '';
       var first_name = '';
       var middle_name = '';
       var last_name = '';
       var without_punc = fcolumnDet[0].replace(/[.]/g, '')
       if(staticTitle.includes(without_punc)){
        title = without_punc;
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

       return{
         title: title,
         first_name: first_name,
         middle_name: middle_name,
         last_name: fcolumnDet[fcolumnDet.length - 1],
         date_of_birth: columns[0].split(',')[1],
         age: columns[0].split(',')[2],
         email: columns[0].split(',')[3].trim()
       };
       })
       formatted_used_data = JSON.stringify(format_data)
      //  console.log(formatted_used_data)
  }

  clean_data(){
    //console.log(formatted_used_data);
    cleaned_user_data = JSON.parse(formatted_used_data)
    let data_collection_date = new Date("02/26/2024");

    for(let i = 0; i < cleaned_user_data.length; i++){
      let dbirth_clean = new Date(cleaned_user_data[i].date_of_birth);
      let db_parts = cleaned_user_data[i].date_of_birth.split("/");

      let dbirth_format = dbirth_clean.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit'})
      if(dbirth_format != 'Invalid Date'){
        cleaned_user_data[i].date_of_birth = dbirth_format;
      }
      else{

        let day = db_parts[0];
        let month = db_parts[1];
        let year = db_parts[2];
        if(year.length < 4){
          let date = new Date(year, 0);
          year = date.getFullYear();
        }
        cleaned_user_data[i].date_of_birth = `${day}/${month}/${year}`;
      }
      let dbGetTime = new Date(`${db_parts[1]}/${db_parts[0]}/${db_parts[2]}`);

      let age_diff = data_collection_date.getTime() - dbGetTime.getTime();
      let age = (age_diff / 31536000000).toFixed(0);
      cleaned_user_data[i].age = age;
    }
    console.log(cleaned_user_data)
  }
  }

const processor = new Data_Processing();
processor.load_CSV('Raw_User_Data.csv');
processor.format_data();
// console.log(typeof(formatted_used_data))

processor.clean_data()
