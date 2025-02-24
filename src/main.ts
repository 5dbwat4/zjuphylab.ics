
import inquirer from "inquirer";
import * as ics from "ics"
import * as fs from "fs";

import { GET, login } from "./networking";
import { toIcsEvent } from "./toIcsEvent";

(async () => {
  // Ask for username and passsword
  inquirer
    .prompt([
      {
        type: "input",
        name: "username",
        message: "Enter your username",
      },
      {
        type: "password",
        name: "password",
        message: "Enter your password",
      },
    ])
    .then(async (answers) => {
      // Login
      const loginSuccess = await login(answers.username, answers.password);
      return answers.username;
    })
    .then(async (username) => {
      const uid = username;
      const term = await GET("/api/terms").then((v) => {
        
        return { id: v.data.content[0].id, name: v.data.content[0].name };
      });
      const course = await GET("/api/courses/uid", {
        page: "-1",
        size: "-1",
        termId: term.id,
        uid,
      }).then((v) => {
        
        return {
          id: v.data[0].id,
          name: v.data[0].courseName,
        };
      });
      await GET("/api/course/lab/students/full",{
        uid,
        page: "-1",
        size: "-1",
        termId: term.id,
        courseName: course.name,
      }).then(v=>{
        // console.log(JSON.stringify(v));
        ics.createEvents(v.data.content.map(toIcsEvent), (error, value) => {
          if (error) {
            console.error("Failed",error);
            return;
          }
          const outputFilename = "zjuphylab.ics";
          if(fs.existsSync(outputFilename)){
            return inquirer.prompt({
              type: "confirm",
              name: "overwrite",
              message: "File ["+ outputFilename+"] exists. Overwrite?",
            }).then((answers) => {
              if(answers.overwrite){
                fs.writeFileSync(outputFilename, value);
              }
            });
          }else{
            fs.writeFileSync(outputFilename, value);
          }
        }
        );
        
      })
    });
})();
