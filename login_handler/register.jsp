<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DishQuest – Create Account</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --light-bg:       #f8f9fa;
      --text-dark:      #343a40;
      --primary-color:  #4caf50;
      --primary-dark:   #45a049;
      --error-color:    #e53935;
      --card-shadow:    0 16px 40px rgba(0,0,0,0.08);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "Poppins", sans-serif;
      background-color: var(--light-bg);
      color: var(--text-dark);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px 15px;
    }

    .auth-card {
      width: 100%;
      max-width: 460px;
      background: linear-gradient(135deg, #fff8ef 0%, #edf7ee 100%);
      border-radius: 24px;
      box-shadow: var(--card-shadow);
      padding: 44px 40px;
    }

    .brand {
      text-align: center;
      margin-bottom: 28px;
    }
    .brand-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 999px;
      background-color: rgba(76,175,80,0.14);
      color: var(--primary-color);
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .brand h1 {
      font-size: 1.9rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .brand p {
      font-size: 0.92rem;
      color: #5c6770;
      margin-top: 6px;
    }

    .error-box {
      background: #fdecea;
      border-left: 4px solid var(--error-color);
      color: var(--error-color);
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 18px;
    }

    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--text-dark);
    }
    input {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid #dde3e7;
      border-radius: 12px;
      font-family: "Poppins", sans-serif;
      font-size: 0.95rem;
      background: #fff;
      color: var(--text-dark);
      transition: border-color 0.2s;
      outline: none;
    }
    input:focus { border-color: var(--primary-color); }

    .hint {
      font-size: 0.78rem;
      color: #8a9399;
      margin-top: 4px;
    }

    .submit-btn {
      width: 100%;
      margin-top: 8px;
      padding: 14px;
      background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
      color: #fff;
      font-family: "Poppins", sans-serif;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 14px;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(76,175,80,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(76,175,80,0.35);
    }

    .switch-link {
      text-align: center;
      margin-top: 20px;
      font-size: 0.88rem;
      color: #5c6770;
    }
    .switch-link a {
      color: var(--primary-color);
      font-weight: 600;
      text-decoration: none;
    }
    .switch-link a:hover { text-decoration: underline; }
  </style>
</head>
<body>

<div class="auth-card">
  <div class="brand">
    <div class="brand-badge">Recipe Assistant</div>
    <h1>Create Account</h1>
    <p>Join DishQuest to start discovering recipes</p>
  </div>

  <%-- Error message from servlet --%>
  <% String error = (String) request.getAttribute("error");
     if (error != null) { %>
    <div class="error-box"><%= error %></div>
  <% } %>

  <form action="RegisterServlet" method="post" novalidate>

    <div class="form-group">
      <label for="fullName">Full Name</label>
      <input
        type="text"
        id="fullName"
        name="fullName"
        placeholder="Ravi Kumar"
        value="<%= request.getAttribute("fullName") != null ? request.getAttribute("fullName") : "" %>"
        required
      />
    </div>

    <div class="form-group">
      <label for="email">Email Address</label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="ravi@example.com"
        value="<%= request.getAttribute("email") != null ? request.getAttribute("email") : "" %>"
        required
      />
    </div>

    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="ravi_kumar"
        required
      />
      <p class="hint">Only letters, numbers, and underscores. Used to log in.</p>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Min. 6 characters"
        required
        minlength="6"
      />
    </div>

    <button type="submit" class="submit-btn">Create Account</button>
  </form>

  <div class="switch-link">
    Already have an account? <a href="login.jsp">Sign In</a>
  </div>
</div>

</body>
</html>
