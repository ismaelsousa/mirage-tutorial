// Welcome to the tutorial!
import {belongsTo, createServer, Factory, hasMany, Model, RestSerializer} from 'miragejs'

export default function (){
  createServer({
    serializers:{
      reminder: RestSerializer.extend({
        include: ['list'],
        embed:true
      })
    },
    models:{ 
      list: Model.extend({
        reminders: hasMany()
      }),
      reminder:Model.extend({
        list: belongsTo()
      })
    },
    factories:{
      list: Factory.extend({
        name(i) {
          return `List ${i}`;
        },
        afterCreate(list, server) {
          server.createList('reminder', 5, { list })
        }
      }),
      reminder:Factory.extend({
        text(i){
          return `Reminder ${i}`
        }
      })
    },
    seeds(server) {
      server.createList("reminder", 10);
      server.create("reminder");
      server.create("reminder");
      server.create("reminder");

      let homeList = server.create("list", { name: "Home" });
      server.create("reminder", { list: homeList, text: "Do taxes" });

      let workList = server.create("list", { name: "Work" });
      server.create("reminder", { list: workList, text: "Visit bank" });

      server.create("list", {
        reminders: server.createList("reminder", 2),
      });
    },
    routes(){
      this.get("/api/reminders", (schema)=>{
        return schema.reminders.all()
      })
      this.post("/api/reminders", (schema, request)=>{
        let attrs = JSON.parse(request.requestBody)
        return schema.reminders.create(attrs)
      })
      this.delete("/api/reminders/:id", (schema, request) => {
        let id = request.params.id
      
        return schema.reminders.find(id).destroy()
      })
      this.get("/api/lists", (schema, request) => {
        return schema.lists.all()
      })
      this.get("/api/lists/:id/reminders", (schema, request) => {
        let listId = request.params.id
        let list = schema.lists.find(listId)
      
        return list.reminders
      })
    }
  });
}