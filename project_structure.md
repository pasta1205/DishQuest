
#Project Structure in EclipseIDE:

DishQuest/                          
│
├── src/main/java                            
│   └── com/
│       └── dishquest/
│           ├── db/
│           │   └── DBConnection.java
│           └── servlet/
│               ├── RegisterServlet.java
│               ├── LoginServlet.java
│               └── AuthFilter.java
│
└── webapp/                   
    │
    ├── login.jsp
    ├── register.jsp
    │
    ├── index.html                 
    ├── index.css
    ├── search.html
    ├── search.css
    ├── search.js
    ├── ingredients.html
    ├── ingredients.css
    ├── ingredients.js
    ├── random.html
    ├── random.css
    ├── random.js
    │
    └── WEB-INF/
        ├── web.xml
        └── lib/
            └── postgresql-42.x.x.jar