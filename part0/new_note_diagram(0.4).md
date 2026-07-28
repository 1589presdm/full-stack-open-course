sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{content: 'yuuiio', date: '2026-07-28T10:51:12.977Z'}]
    deactivate server

    Note right of browser: User writes note and clicks Save-button

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note (form data: content="Garage for sale")
    activate server
    server-->>browser: responds the status code 302 Found
    deactivate server

    Note right of browser: Server responds 302 with Location: /notes (redirect).
    Note right of browser: The browser reloads page. The reload causes four HTTP requests.

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{content: 'Garage for sale', date: '2026-07-28T10:59:29.085Z'}]
    deactivate server